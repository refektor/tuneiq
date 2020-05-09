/**
 * Page repsonsible for hosting the game content.
 */
import { Component } from "react";
import ReactPlayer from 'react-player'
import { Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Leaderboard from '../../components/leaderboard';

import { getFirebaseApp } from "../../firebase/firebase";
import firebase from 'firebase'

const db = getFirebaseApp().firestore();

const testUrl = "https://p.scdn.co/mp3-preview/4839b070015ab7d6de9fec1756e1f3096d908fba?cid=774b29d4f13844c495f206cafdad9c86";

interface IState {
    playing: boolean;
    gameId: String;
    leaderboard: any;
}

interface IProps {

}

export default class PlayGame extends Component<IProps, IState> {
     constructor(props) {
        super(props);
        this.updatePlayer = this.updatePlayer.bind(this);
        this.state = {
            playing: false,
            gameId: '',
            leaderboard: null
        }
     }

     updatePlayer(player) {
        db.collection('games').doc('8XHtwngmzpadhpfa9anV')
            .update({
                [`leaderboard.${player.id}.score`]: firebase.firestore.FieldValue.increment(player.score),
            })
     }

     componentDidMount() {
        this.setState({ gameId: '8XHtwngmzpadhpfa9anV' });
        const docRef = db.collection('games').doc('8XHtwngmzpadhpfa9anV');

        docRef.onSnapshot(docSnapshot => {
            db.collection('games').doc('8XHtwngmzpadhpfa9anV').get()
                .then(doc => {
                    if (doc.exists) {
                        const leaderboard = Object.keys(doc.data().leaderboard).map((id,index) => {
                            return { 'name': doc.data().leaderboard[id].name, 'score': doc.data().leaderboard[id].score }
                        });
                        this.setState({ leaderboard });
                    } else {
                        console.log("nope");
                    }
                })
            }, err => {
                console.log(`Encountered error: ${err}`);
            });
     }

     render() {
         return (
            <>
                <ReactPlayer url={testUrl} playing={this.state.playing} />
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => this.setState({playing: !this.state.playing})}
                >
                PLAY
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => {this.updatePlayer({ 'id': 'id1', 'score': 1})}}
                >
                Dom Dolla +1
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => {this.updatePlayer({ 'id': 'id2', 'score': 1})}}
                >
                Sonny Fodera +1
                </Button>
                <Leaderboard leaderboard={this.state.leaderboard} />
            </>
         )
     }
 }