import { useState, useEffect } from "react";
import { Container, TextField, makeStyles, Radio, RadioGroup, FormControlLabel, Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import * as hash from 'password-hash';
import * as db from "../../database/db";
import Router from 'next/router'

const useStyles = makeStyles(theme => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },

    button: {
      margin: theme.spacing(1)
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

    useEffect(() => {
        if (!player) {
            Router.push('/')
        }
    });

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

    const startGame = () => {
      const hashedPassword = hash.generate(password);
      console.log("Creating new game with params:", name, hashedPassword, genre, player);
      //return; //dont post to db yet
      db.createGame(name, password, genre, player).then(() => {
        //redirect to game page
      }).catch((err)=>{console.log(err);});
      setPassword("") // clear password
    }
    
    return (
        <Container className={classes.root}>
          <TextField id="standard-name" label={nameLabel} value={name} autoComplete="off" error={nameError} onChange={handleNameChange}/>
          <TextField 
            id="standard-password-input" 
            label="Password" 
            type="password" 
            autoComplete="off" 
            value={password} 
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
            onClick={startGame}
          >
            PLAY
          </Button>
        </Container>
      )
}

CreateGame.getInitialProps = async ctx => {
    return {player: ctx.query.nickname};
}

export default CreateGame;