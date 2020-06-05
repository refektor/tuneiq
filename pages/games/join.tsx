import React, { useState } from "react";
import { TextField, Fab } from '@material-ui/core';
import { useRouter } from 'next/router';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PageWrapper from '../../components/page_wrapper';
import Auth from '../../components/auth';
import inputStyles from '../../styles/styles';
import * as server from '../../firebase/server';
import { getFirebaseApp } from '../../firebase/firebase';

export default function JoinGame() {
    const classes = inputStyles();
    const router = useRouter();
    const [nameLabel, setNameLabel] = useState("Name")
    const [nameError, setNameError] = useState(false);
    const [passError, setPassError] = useState(false);
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    function handleNameChange(e) {
        setName(e.target.value);
        setNameError(false);
    }

    function joinGame() {
        // send request to join game, and get back game ID
        // ...
        const user = getFirebaseApp().auth().currentUser;
        server.attemptToJoinGame(name, password, user.uid, user.displayName).then((gameId) => {
            router.push({
                pathname: "/games/play",
                query: {
                    gameId: gameId
                }
            })
        }).catch((err) => {
            if (err.field === "gameName") {
                setNameError(true)
            } else {
                setPassError(true);
            }
        });

    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
        setPassError(false);
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
            error={passError} 
            onChange={handlePasswordChange} 
          />
          <Fab
            variant="extended"
            color="primary"
            size="large"
            className={classes.button}
            onClick={joinGame}
          >
            <PlayArrowIcon />
            JOIN
          </Fab>
        </PageWrapper>
      </Auth>
    );
}