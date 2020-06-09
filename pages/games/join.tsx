import React, { useState } from "react";
import { TextField, Fab } from '@material-ui/core';
import { useRouter } from 'next/router';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PageWrapper from '../../components/page_wrapper';
import LoadingWrapper from '../../components/loading_wrapper';
import Auth from '../../components/auth'
import inputStyles from '../../styles/styles';
import server from '../../firebase/server';
import { getFirebaseApp } from '../../firebase/firebase';

export default function JoinGame() {
  const classes = inputStyles();
  const router = useRouter();
  const [gameCodeError, setGameCodeError] = useState(false);
  const [gameCode, setGameCode] = useState("");


  function joinGame() {
    // send request to join game, and get back game ID
    // ...
    const user = getFirebaseApp().auth().currentUser;
    server.attemptToJoinGame(gameCode, user.uid, user.displayName).then((gameId) => {
      router.push({
        pathname: "/games/play",
        query: {
          gameId: gameId
        }
      })
    }).catch((err) => {
      if (err.field === "gameCode") {
        setGameCodeError(true)
      }
    });

  }

  function handleGameCodeChange(e) {
    setGameCode(e.target.value);
    setGameCodeError(false);
  }

  return (
    <Auth>
      <PageWrapper>
        <TextField
          id="standard-password-input"
          label="GameCode"
          autoComplete="off"
          className={classes.inputChild}
          value={gameCode}
          error={gameCodeError}
          onChange={handleGameCodeChange}
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