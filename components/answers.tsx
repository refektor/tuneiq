import { useState } from "react";
import { List, Snackbar, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import AnswerItem from './answer';

const useStyles = makeStyles((theme) => ({
    correct: {
        background: "#73d13d"
    },

    incorrect: {
        background: "#ff4d4f"
    },
}))

export default function AnswerList(props) {
    const classes = useStyles();
    const [answerSubmitted, setAnswerSubmitted] = useState(false);
    const [correctAnswerSubmitted, setCorrectAnswerSubmitted] = useState(false);

    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
    };

    function answerClicked(isCorrect) {
        setAnswerSubmitted(true);
        if (isCorrect) {
            setCorrectAnswerSubmitted(true);
            props.onCorrectAnswer();
        }
    }

    function getAnswerText() {
        const correctAnswer = props.answers.find((answer) => (answer.isCorrect));
        if (correctAnswerSubmitted) {
            return (
                <>
                    <strong>{"Correct! "}</strong>
                    {"This song is called"}
                    <strong> {correctAnswer.answerText}</strong>
                </>
            )
        } else {
            return (
                <>
                    <strong>{"Nope! "}</strong>
                    {"This song is called"}
                    <strong> {correctAnswer.answerText}</strong>
                </>
            )
        }
    }

    return (
        <List>
        {answerSubmitted && (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                ContentProps={{
                    classes: {
                        root: clsx({
                            [classes.correct]: correctAnswerSubmitted,
                            [classes.incorrect]: !correctAnswerSubmitted,
                        }),
                    }
                }}
                open={true}
                autoHideDuration={3000}
                onClose={handleClose}
                message={getAnswerText()}
            />
        )}

        {
            props.answers.map((answer) => (
                <AnswerItem 
                    key={answer.id}
                    disabled={answerSubmitted} 
                    displayText={answer.displayText} 
                    isCorrect={answer.isCorrect} 
                    onClick={answerClicked}
                />
            ))
        }
        </List>
    )
}  