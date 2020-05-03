import { TextField, Button } from '@material-ui/core';
import { useState } from "react";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PageWrapper from '../../components/page_wrapper';
import Auth from '../../components/auth'
import useGameStyles from '../../styles/game_styles';

export default function JoinGame() {
    const classes = useGameStyles();
    const [nameLabel, setNameLabel] = useState("Name")
    const [nameError, setNameError] = useState(false);
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    function handleNameChange() {

    }

    function joinGame() {
        // send request to join game, and get back game ID
        // ...


    }

    return (
      <Auth>
        <PageWrapper>
          <TextField 
            id="standard-name" 
            label={nameLabel} 
            value={name} 
            autoComplete="off" 
            error={nameError} 
            className={classes.inputChild}
            onChange={handleNameChange} 
          />
          <TextField 
            id="standard-password-input" 
            label="Password" 
            type="password" 
            autoComplete="off"
            className={classes.inputChild} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            startIcon={<PlayArrowIcon />}
            onClick={joinGame}
          >
            JOIN
          </Button>
        </PageWrapper>
      </Auth>
    );
}