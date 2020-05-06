/**
 * Page repsonsible for hosting the game content.
 */
import { Component } from "react";
import ReactPlayer from 'react-player'
import { Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Leaderboard from '../../components/leaderboard';

const testUrl = "https://p.scdn.co/mp3-preview/4839b070015ab7d6de9fec1756e1f3096d908fba?cid=774b29d4f13844c495f206cafdad9c86";

// TODO: fetch from db
const players = [{"name": "domdolla", "score": 15},{"name": "sonnyfodera", "score": 12},{"name": "dombresky", "score": 10}];

interface IState {
    playing: boolean;
}

interface IProps {

}

export default class PlayGame extends Component<IProps, IState> {
     constructor(props) {
        super(props);
        this.state = {
            playing: false
        }
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
                <Leaderboard players={players} />
            </>
         )
     }
 }