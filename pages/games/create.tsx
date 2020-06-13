import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Container, TextField, Fab } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as hash from 'password-hash';
import { getFirebaseApp } from '../../firebase/firebase';
import server from '../../firebase/server';
import PageWrapper from '../../components/page_wrapper';
import LoadingWrapper from '../../components/loading_wrapper';
import Auth from '../../components/auth';
import HeadsetIcon from '@material-ui/icons/Headset';
import inputStyles from '../../styles/styles';

const FirebaseApp = getFirebaseApp();

const genres = server.getPossibleGenres();

function CreateGame({ player }) {
  const classes = inputStyles();
  const router = useRouter();
  const [name, setName] = useState("");
  const [genre, setGenre] = useState(null);

  const [nameLabel, setNameLabel] = useState("Game Name")
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleNameChange = (e) => {
    const currentName = e.target.value;
    setName(currentName);
    setNameLabel("Game Name");
    if (genre) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }

  const handleGenreChange = (selectedGenre) => {
    setGenre(selectedGenre['name']);

    if (selectedGenre['name'].length) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }

  //TODO: download preset icon and return them
  const generateGenreIcon = (genre) => {
    return <HeadsetIcon id={`dropdown_${genre}`} />
  }
  const handleCreateGame = () => {
    const userId = FirebaseApp.auth().currentUser?.uid;
    const userName = FirebaseApp.auth().currentUser?.displayName;
    console.log("Creating new game with params:", name, genre, userId, userName);
    server.createGame(name, genre, userName, userId).then((docId) => {
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
          <Autocomplete
            id="combo-box"
            className={classes.inputChild}
            clearOnEscape
            options={genres}
            onChange={(_, newGenre) => handleGenreChange(newGenre)}
            getOptionDisabled={(genre) => genre.supported === false}
            getOptionLabel={(genre) => genre.name}
            renderOption={(genre) => (
              <>
                <span className={classes.genreIcon}>{generateGenreIcon(genre.name)}</span>
                <span>{genre.name}</span>
              </>
            )}
            renderInput={
              (params) =>
                <TextField className={classes.genreText} {...params} label="Genre" />
            }
          />
          <TextField
            id="standard-name"
            label={nameLabel}
            value={name}
            autoComplete="off"
            onChange={handleNameChange}
            className={classes.inputChild}
          />
          <Fab
            variant="extended"
            color="primary"
            size="large"
            disabled={buttonDisabled}
            className={classes.button}
            onClick={handleCreateGame}
          >
            <PlayArrowIcon />
                PLAY
              </Fab>
        </Container>
      </PageWrapper>
    </Auth>
  )
}

export default CreateGame;