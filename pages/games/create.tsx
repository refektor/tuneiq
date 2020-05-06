import { useState, useEffect } from "react";
import { Container, TextField, Radio, RadioGroup, FormControlLabel, Button, makeStyles } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import * as hash from 'password-hash';
import * as db from "../../firebase/db";
import PageWrapper from '../../components/page_wrapper';
import Auth from '../../components/auth';
import GenrePicker from '../../components/genre_picker';
import useGameStyles from '../../styles/game_styles';

function CreateGame({ player }) {
    const classes = useGameStyles();
    const [name, setName] = useState("");
    const [nameLabel, setNameLabel] = useState("Game Name")
    const [nameError, setNameError] = useState(false);

    const [password, setPassword] = useState("");

    const [genre, setGenre] = useState('');

    const handleNameChange = (e) => {
      const currentName = e.target.value;
      setName(currentName);

      //dont bombard db just yet
      return
      db.fetchGame(currentName).then(result => {
        if (result.length > 0 && result[0].name == currentName) {
          setNameError(true)
          setNameLabel("Game name is already taken")
        } else {
          setNameError(false)
          setNameLabel("Game Name")
        }
      });

      // reset on key storkes
      setNameError(false)
      setNameLabel("Game Name")
    }

    const handleGenreChange = (genre) => {
      console.log(genre);
      setGenre(genre); // can prob pass this directly in
    }

    const createGame = () => {
      const hashedPassword = hash.generate(password);
      console.log("Creating new game with params:", name, hashedPassword, genre, player);
      return; //dont post to db yet
      db.createGame(name, password, genre, player).then(() => {
        //redirect to game page
      }).catch((err)=>{console.log(err);});
      setPassword("") // clear password
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
                onChange={(e) => setPassword(e.target.value)} 
              />
              <GenrePicker onPicked={handleGenreChange} />
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                startIcon={<PlayArrowIcon />}
                onClick={createGame}
              >
                CREATE
              </Button>
            </Container>
          </PageWrapper>
        </Auth>
      )
}

export default CreateGame;