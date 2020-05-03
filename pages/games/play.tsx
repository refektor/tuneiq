/**
 * Page repsonsible for hosting the game content.
 */
import { Fragment, Component } from "react";
import ReactPlayer from 'react-player'
import { Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const testUrl = "https://p.scdn.co/mp3-preview/4839b070015ab7d6de9fec1756e1f3096d908fba?cid=774b29d4f13844c495f206cafdad9c86";

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
            <Fragment>
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
            </Fragment>
         )
     }
 }