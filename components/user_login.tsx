import { useState } from 'react';
import { Container, TextField, Fab } from '@material-ui/core';
import { getFirebaseApp } from '../firebase/firebase';
import inputStyles from '../styles/styles';
import AddIcon from '@material-ui/icons/Add';

const FirebaseApp = getFirebaseApp();

export default function UserLogin(props) {
    const classes = inputStyles();
    const [nickname, setNickname] = useState("");
    const [nicknameLabel, setNicknameLabel] = useState("Nickname");
    const [nicknameError, setNicknameError] = useState(false);

    function createNicknameClicked() {
        //TODO check db for existing nicknames
        if (!nickname.length) {
            setNicknameError(true);
            setNicknameLabel("Bruh...");
            return;
        }

        const user = FirebaseApp.auth().currentUser;

        user.updateProfile({
            displayName: nickname,
            }).then(function() {
                console.log('updated user nickname successfully');
            }).catch(function(error) {
                console.log(error);
            });
            
        props.setNickname(nickname);
    }

    function updateNickname(e) {
        const input = e.target.value;
        if (input.length) {
            setNicknameError(false);
            setNicknameLabel("Nickname");
        } else {
            setNicknameError(true);
            setNicknameLabel("Bruh...");
        }

        setNickname(input)
    }

    return (
        <Container>
            <TextField 
                error={nicknameError}
                className={classes.inputChild} 
                id="standard-basic" 
                label={nicknameLabel} 
                onChange={updateNickname}
            />
            <Fab
                variant="extended"
                color="primary"
                size="large"
                className={classes.button}
                onClick={createNicknameClicked}
            >
                <AddIcon />
                Start
            </Fab>
        </Container>
    )
}