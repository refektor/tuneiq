import { TextField, Button } from '@material-ui/core'
import { useState } from 'react' 
import {getFirebaseApp} from '../firebase/firebase'

const FirebaseApp = getFirebaseApp();

export default function UserLogin(props) {
    const [errorText, setErrorText] = useState("");
    const [nickname, setNickname] = useState("");
    const [hasError, setHasError] = useState(false);

    function createNicknameClicked(e) {
        const user = FirebaseApp.auth().currentUser;

        user.updateProfile({
            displayName: nickname,
            }).then(function() {
            // Update successful.
            console.log('success')
            }).catch(function(error) {
            // An error happened.
            });
        props.setNickname(nickname);
    }

    return (
        <form noValidate autoComplete="off">
            <TextField 
                error={hasError} 
                id="standard-basic" 
                label="Nickname" 
                helperText={errorText} 
                onChange={(e) => setNickname(e.target.value)}
            />
            <Button variant="contained"  onClick={createNicknameClicked}>
                Create
            </Button>
        </form>
    )
}