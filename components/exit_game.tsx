import { useState } from "react";
import { useRouter } from 'next/router'
import { Fab, IconButton, Typography, Modal, Dialog, DialogTitle, makeStyles } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import inputStyles from '../styles/styles';
import server from '../firebase/server';
import {getFirebaseApp} from '../firebase/firebase';

const FirebaseApp = getFirebaseApp();

const useStyles = makeStyles((theme) => ({
  dialog: {
    "& > .MuiDialog-container > .MuiPaper-root": { //pretty hacky...
      background: "#f1edee"
    }
  },

  exitIcon: {
    position: "absolute",
    top: 0,
    left: 0
  }
}));

export default function ExitGameComponent({ gameId }) {
  const inputClasses = inputStyles();
  const classes = useStyles();
  const router = useRouter();
  const [showBackdrop, setShowBackdrop] = useState(false);

  const exitGame = () => {
    server.leaveGame(gameId, FirebaseApp.auth().currentUser.uid);
    router.push({
      pathname: "/",
    });
  }

  const stayInGame = () => {
    setShowBackdrop(false);
  }

  const handleClose = () => {
    setShowBackdrop(false);
  }

  return (
    <>
      <IconButton aria-label="exit" className={classes.exitIcon} onClick={() => setShowBackdrop(true)}>
        <ClearIcon fontSize="inherit" />
      </IconButton>
      <Dialog
        className={classes.dialog}
        aria-labelledby="exit-game-label"
        onClose={handleClose}
        open={showBackdrop}
      >
        <DialogTitle id="simple-dialog-title">Are you sure? Your score will be erased</DialogTitle>
        <Fab
            variant="extended"
            color="default"
            size="large"
            className={inputClasses.button}
            onClick={stayInGame}
        >
          Stay
        </Fab>
        <Fab
            variant="extended"
            color="primary"
            size="large"
            className={inputClasses.button}
            onClick={exitGame}
        >
          EXIT
        </Fab>
      </Dialog>
    </>
  );
};