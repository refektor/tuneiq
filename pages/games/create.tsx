import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Container, TextField, Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import * as hash from 'password-hash';
import{ getFirebaseApp } from '../../firebase/firebase';
import { createGame, doesGameNameExist } from '../../firebase/server';
import PageWrapper from '../../components/page_wrapper';
import Auth from '../../components/auth';
import GenrePicker from '../../components/genre_picker';
import useGameStyles from '../../styles/game_styles';

const FirebaseApp = getFirebaseApp();

function CreateGame({ player }) {
    const classes = useGameStyles();
    const router = useRouter();
    const [name, setName] = useState("");
    const [genre, setGenre] = useState("");
    const [password, setPassword] = useState("");

    const [nameLabel, setNameLabel] = useState("Game Name")
    const [nameError, setNameError] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const authorizeEndpoint = 'https://accounts.spotify.com/authorize';
    const clientId = "aee55436adf6456fba4cd426cc2b73b6"
    const redirect_uri = 'http://localhost:3000/';
    const authUrl = `${authorizeEndpoint}?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=token`

    const handleNameChange = (e) => {
      const currentName = e.target.value;
      setName(currentName);
      doesGameNameExist(currentName)
        .then((_) => {
          setNameError(false)
          setNameLabel("Game Name");
          if (!nameError && currentName.length && password && genre) {
            setButtonDisabled(false);
          } else {
            setButtonDisabled(true);
          }
        })
        .catch((err) => {
          setNameError(true);
          setNameLabel("Game name is already taken");
          setButtonDisabled(true);
      });
    }

    const handleGenreChange = (genre) => {
      setGenre(genre);
      
      if (!nameError && name && password && genre.length) {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
      }
    }

    const handlePasswordChange = (e) => {
      const password = e.target.value;
      setPassword(password);

      if (!nameError && name && password.length && genre) {
        setButtonDisabled(false);
      } else {
        setButtonDisabled(true);
      }
    }

    const handleCreateGame = () => {
      const hashedPassword = hash.generate(password);
      const userId = FirebaseApp.auth().currentUser?.uid;
      const userName = FirebaseApp.auth().currentUser?.displayName;
      console.log("Creating new game with params:", name, hashedPassword, genre, userId, userName);
      createGame(name, password, genre, userId, userName).then((docId) => {
        router.push({
            pathname: "/games/play",
            query: {
                gameId: docId
            }
        });
      });
    }
    
    return (
        <Auth>
          <PageWrapper>
            <Container maxWidth="sm">
              <TextField 
                id="standard-name" 
                label={nameLabel} 
                value={name} 
                autoComplete="off" 
                error={nameError} 
                onChange={handleNameChange}
                className={classes.inputChild}
              />
              <TextField 
                id="standard-password-input" 
                label="Password" 
                type="password" 
                autoComplete="off" 
                value={password}
                className={classes.inputChild}
                onChange={handlePasswordChange} 
              />
              <GenrePicker onPicked={handleGenreChange} />
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={buttonDisabled}
                className={classes.button}
                startIcon={<PlayArrowIcon />}
                onClick={handleCreateGame}
              >
                CREATE
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                href={authUrl}
              >
                  Spotify
              </Button>
            </Container>
          </PageWrapper>
        </Auth>
      )
}

export default CreateGame;