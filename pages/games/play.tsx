/**
 * Page repsonsible for hosting the game content.
 */
import { Fragment, Component } from "react";
import ReactPlayer from 'react-player'
import { Button, Drawer } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {getFirebaseApp} from '../../firebase/firebase';
import * as server from '../../firebase/server';
import Auth from '../../components/auth';
import PageWrapper from '../../components/page_wrapper';
import AnswerList from '../../components/answers';
import Leaderboard from '../../components/leaderboard';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

const FirebaseApp = getFirebaseApp();

const useStyles = (theme: Theme) =>
  createStyles({
    
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

};

interface Props {
    gameId: string;
    classes: any;
}

class PlayGame extends Component<Props, State> {
    timingEvents: TimeEvent[];

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
            leaderboard: []
        };

        FirebaseApp.firestore().collection("games").doc(this.props.gameId)
            .onSnapshot((doc) => {
                this.handleGameUpdate(doc.data());
            });
     }

     handleGameUpdate(gameObj): void {
        console.log(gameObj);
        const isHost: boolean = gameObj.hostId === FirebaseApp.auth().currentUser?.uid;
        const leaderboard = Object.keys(gameObj.leaderBoard).map((id,index) => {
            return { 'name': gameObj.leaderBoard[id].name, 'score': gameObj.leaderBoard[id].score }
        });
        this.setState({
            numberOfRounds: gameObj.rounds.length,
            rounds: gameObj.rounds,
            isHost,
            leaderboard
        })

        if (gameObj.startTime) {
            this.startGame(gameObj.startTime);
        }
     }

     startGameClicked() {
         server.startGame(this.props.gameId);
     }

     startGame(startTime: number) {
        const {roundDuration, intermissionDuration, numberOfRounds} = this.state;
        const timingEvents: TimeEvent[] = [];

        let future = startTime;
        for (let i = 0; i < numberOfRounds; ++i) {
            future += (i === 0) ? 0 : intermissionDuration;
            timingEvents.push({
                time: future,
                round: i+1,
                event: EventType.START
            });

            future += roundDuration;
            timingEvents.push({
                time: future,
                round: i+1,
                event: EventType.END
            });
        }

        this.timingEvents = timingEvents;

        this.setState({
            gameStarted: true,
            currentRound: 1,
        })

        const interval = setInterval(() => {
            if (!timingEvents.length) {
                return;
            }
            const {time, round, event} = timingEvents[0];
            const now = new Date().getTime();
            const remainingTime = time - now;
            if (remainingTime < 0) {
                timingEvents.shift();
                if (timingEvents.length === 0) {
                    // end game!
                    clearInterval(interval);
                    this.setState({gameEnded: true, gameStarted: false})
                    return;
                }
                // change display (start/end round)
                const {event, round} = timingEvents[0];
                if (event === EventType.START) {
                    // intermission
                    this.setState({
                        songUrl: "",
                        playing: false,
                    })
                } else {
                    // round
                    this.setState({
                        currentRound: round,
                        songUrl: this.state.rounds[round-1]?.url,
                        playing: true,
                    })

                }
            } else {
                this.setState({
                    countdownMessage: `Round ${round}/${this.state.numberOfRounds} ${event} in ${Math.ceil(remainingTime / 1000)}`,
                })
            }
        }, 100);
     }

     getRoundAnswers() {
        const roundIdx = this.state.currentRound - 1;
        
        return this.state.rounds[roundIdx].tracks.map((track) => {
            return {id: track.id, displayText: track.title, isCorrect: track.isAnswer};
        });
     }

     correctAnswerSubmitted() {
        const {time} = this.timingEvents[0];
        const now = new Date().getTime();
        const remainingTime = time - now;
        const roundDuration = this.state.roundDuration;
        const pctRoundRemaining = remainingTime / roundDuration;

        server.increasePlayerScore(this.props.gameId, FirebaseApp.auth().currentUser.uid, pctRoundRemaining);
     }

     getContent() {
        if (this.state.gameStarted) {
            return (
                <>
                {
                this.state.songUrl && 
                <>
                <img src="/music-gif.gif"/>
                <ReactPlayer  height={0} url={this.state.songUrl} playing={this.state.playing} />
                <p className="description">What is the name of this tune?</p>
                <AnswerList answers={this.getRoundAnswers()} onCorrectAnswer={this.correctAnswerSubmitted.bind(this)}/>
                </>
                }
                </>
            )
        } else if (!this.state.gameEnded) { // waiting for game to start
            return (
                <>
                <p className="description">Waiting for game to start</p>
                {(this.state.isHost) && <Button onClick={this.startGameClicked.bind(this)}>Start game</Button>}
                </>
            );
        } else { // game is over
            return (
                <>
                <p className="description">Game Over</p>
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
            {this.state.gameStarted &&
            <>
            <p className="description">Game started!!!</p>
            <p className="description">{this.state.countdownMessage}</p>
            </>}
            
            {this.getContent()}

            </Auth>
            </PageWrapper>
         )
     }
 }

 export default withStyles(useStyles)(PlayGame);

 export async function getServerSideProps(context) {
    return {
      props: {gameId: context.query.gameId}, // will be passed to the page component as props
    }
  }