/**
 * Page repsonsible for hosting the game content.
 */
import { Component } from "react";
import ReactPlayer from 'react-player'
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import {getFirebaseApp} from '../../firebase/firebase';
import server from '../../firebase/server';
import Auth from '../../components/auth';
import PageWrapper from '../../components/page_wrapper';
import AnswerList from '../../components/answers';
import Leaderboard from '../../components/leaderboard';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

const FirebaseApp = getFirebaseApp();

const useStyles = (theme: Theme) =>
    createStyles({
            emphasisText: {
                color: theme.palette.primary.main,
            }
    });

enum EventType {
    START = "starts",
    END = "ends",
}

type TimeEvent = {
    time: number;
    event: EventType;
    round: number;
}

interface State {
    playing: boolean;
    gameStarted: boolean;
    rounds?: any[];
    songUrl?: string;
    numberOfRounds?: number;
    isHost?: boolean;
    startTime?: number;
    currentRound?: number;
    countdownMessage?: string;
    intermissionDuration?: number;
    roundDuration?: number;
    roundInSession?: boolean;
    gameEnded?: boolean;
    leaderboard?: any;
    roundAnswers?: any[];
    roundProgress?: number;
};

interface Props {
    gameId: string;
    classes: any;
}

class PlayGame extends Component<Props, State> {
    timingEvents: TimeEvent[];
    timerInterval: number;
    intervalTimeoutId: NodeJS.Timeout;

    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            gameStarted: false,
            songUrl: "",
            currentRound: 0,
            intermissionDuration: 5000,
            roundDuration: 10000,
            roundInSession: false,
            gameEnded: false,
            leaderboard: [],
            roundAnswers: [],
        };

        this.timerInterval = 100;

        FirebaseApp.firestore().collection("games").doc(this.props.gameId)
            .onSnapshot((doc) => {
                this.handleGameUpdate(doc.data());
            });
    }

    handleGameUpdate(gameObj): void {
        const isHost: boolean = gameObj.hostId === FirebaseApp.auth().currentUser?.uid;
        const leaderboard = Object.keys(gameObj.leaderBoard).map((id, index) => {
            return { 'name': gameObj.leaderBoard[id].name, 'score': gameObj.leaderBoard[id].score }
        });
        this.setState({
            numberOfRounds: gameObj.rounds.length,
            rounds: gameObj.rounds,
            isHost,
            leaderboard
        })

        if (!this.state.gameStarted && gameObj.startTime) {
            this.startGame(gameObj.startTime);
        }
    }

     startGameClicked() {
         server.startGame(this.props.gameId);
     }
     
     /**
      * Event handler for the main interval timer timeout. Responsible
      * for updating the countdown timer and any game content transitions
      * (i.e. round -> intermission).
      */
     updateGameEventHandler() {
        if (!this.timingEvents.length) {
            return;
        }
        const {time, round, event} = this.timingEvents[0];
        const now = new Date().getTime();
        const remainingTime = time - now;

        if (remainingTime < 0) {
            this.timingEvents.shift();
            if (this.timingEvents.length === 0) {
                // end game!
                clearInterval(this.intervalTimeoutId);
                this.setState({gameEnded: true})
                return;
            }
            // change display (start/end round)
            const {event, round} = this.timingEvents[0];
            if (event === EventType.START) {
                // intermission
                this.setState({
                    songUrl: "",
                    playing: false,
                    roundProgress: 100,
                })
            } else {
                // round
                this.setState({
                    currentRound: round,
                    songUrl: this.state.rounds[round-1]?.url,
                    playing: true,
                    roundAnswers: this.getRoundAnswers(round-1),
                    roundProgress: 100,
                })
            }

            if (remainingTime < this.timerInterval) {
                clearInterval(this.intervalTimeoutId);
                setInterval(this.updateGameEventHandler.bind(this))
            }
        } else {
            let roundProgress = 100;
            if (event === EventType.START) {
                // intermission
                roundProgress = Math.ceil((remainingTime / this.state.intermissionDuration) * 100)
            } else {
                roundProgress = Math.ceil((remainingTime / this.state.roundDuration) * 100)
            }
            this.setState({
                countdownMessage: `Round ${round} of ${this.state.numberOfRounds} ${event} in ${Math.ceil(remainingTime / 1000)}`,
                roundProgress: roundProgress,
            })
        }
    }

    /**
     * Creates all of the game events and times based on the provided
     * start time and round/intermission durations. Starts the main game
     * interval timer for all game events.
     * @param startTime UTC time (milliseconds since unix epoch)
     */
     startGame(startTime: number) {
        const {roundDuration, intermissionDuration, numberOfRounds} = this.state;

        // Set up timing events for the start and end of each round
        const timingEvents: TimeEvent[] = [];
        let future = startTime;
        for (let i = 0; i < numberOfRounds; ++i) {
            future += (i === 0) ? 0 : intermissionDuration;
            timingEvents.push({
                time: future,
                round: i + 1,
                event: EventType.START
            });

            future += roundDuration;
            timingEvents.push({
                time: future,
                round: i + 1,
                event: EventType.END
            });
        }

        this.timingEvents = timingEvents;

        this.setState({
            gameStarted: true,
            currentRound: 1,
        })

        this.intervalTimeoutId = setInterval(this.updateGameEventHandler.bind(this), this.timerInterval);
     }

    // Fisher-Yates Shuffle
    shuffleAnswers(answers) {
        for (let i = answers.length - 1; i > 0; --i) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
        }

        return answers;
    }

     /**
      * Creates answer objects to be baswer to AnswerList component
      * based on the answers for the given round index.
      * @param roundIndex index of current round (0-based)
      */
     getRoundAnswers(roundIdx) {
        return this.shuffleAnswers(this.state.rounds[roundIdx].tracks).map((track) => {
            const answerText = `${track.title} - ${track.artists.join(", ")}`;
            return {id: track.id, displayText: track.title, isCorrect: track.isAnswer, answerText};
        });
    }

    correctAnswerSubmitted() {
        const { time } = this.timingEvents[0];
        const now = new Date().getTime();
        const remainingTime = time - now;

        // We check if the remaining time in the round is negative because
        // there is a chance that we receive this signal after the round has completed.
        if (remainingTime < 0) {
            return;
        }
        
        const roundDuration = this.state.roundDuration;
        const pctRoundRemaining = remainingTime / roundDuration;

        server.increasePlayerScore(this.props.gameId, FirebaseApp.auth().currentUser.uid, pctRoundRemaining);
    }

    getContent() {
        if (this.state.gameEnded) {
            return (
                <>
                    <p className="description">Game Over</p>
                </>
            );
        } else if (this.state.gameStarted) {
            return (
                <>
                {
                this.state.songUrl && 
                <>
                <img src="/music-gif.gif"/>
                <ReactPlayer  height={0} url={this.state.songUrl} playing={this.state.playing} />
                <p className="description">What is the name of this tune?</p>
                <AnswerList answers={this.state.roundAnswers} onCorrectAnswer={this.correctAnswerSubmitted.bind(this)}/>
                </>
                }
                </>
            )
        } else { // waiting for game to start
            return (
                <>
                    <p className="description">Waiting for game to start</p>
                    {(this.state.isHost) && <Button onClick={this.startGameClicked.bind(this)}>Start game</Button>}
                </>
            );
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <PageWrapper>
                <Auth attemptSignIn={true}>
                    <Leaderboard leaderboard={this.state.leaderboard} />
                    {this.state.gameStarted && !this.state.gameEnded &&
                        <>
                            <p className="description">{this.state.countdownMessage}</p>
                            <CircularProgress variant="static" value={this.state.roundProgress}/>
                        </>
                    }
                    
                    {this.getContent()}

                </Auth>
            </PageWrapper>
        )
    }
}

export default withStyles(useStyles)(PlayGame);

export async function getServerSideProps(context) {
    return {
        props: { gameId: context.query.gameId }, // will be passed to the page component as props
    }
}