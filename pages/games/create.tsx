import { useState, useEffect } from "react";
import { Container, TextField, Radio, RadioGroup, FormControlLabel, Button, makeStyles } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import * as hash from 'password-hash';
import * as db from "../../database/db";
import PageWrapper from '../../components/page_wrapper';
import Auth from '../../components/auth';

// TODO: move this outside of here and reuse in join component
const useStyles = makeStyles((theme) => ({
    inputChild: {
      margin: theme.spacing(2, 'auto'),
      display: 'block',
      width: '25ch',
    },

    button: {
      margin: theme.spacing(2, 'auto'),
      display: 'block',
      '& > *': {
        display: 'inline-block'
      }
    }
}));

const genres = ["Pop", "Rock", "EDM", "Hip-Hop"] // TODO: fetch from db

function CreateGame({ player }) {
    const classes = useStyles();
    const [name, setName] = useState("");
    const [nameLabel, setNameLabel] = useState("Name")
    const [nameError, setNameError] = useState(false);

    const [password, setPassword] = useState("");

    const [genre, setGenre] = useState(genres[0]);

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
          setNameLabel("Name")
        }
      });

      // reset on key storkes
      setNameError(false)
      setNameLabel("Name")
    }

    const handleGenreChange = (e) => {
      setGenre(e.target.value); // seems this refreshes the component
    }

    const createGame = () => {
      const hashedPassword = hash.generate(password);
      console.log("Creating new game with params:", name, hashedPassword, genre, player);
      //return; //dont post to db yet
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
              <RadioGroup aria-label="genre" name="Genre" value={genre} onChange={handleGenreChange}>
                {genres.map(genre => (
                  <FormControlLabel key={genre} value={genre} control={<Radio />} label={genre} />
                ))}
              </RadioGroup>
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