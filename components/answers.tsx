import { useState } from "react";
import { List } from '@material-ui/core';
import AnswerItem from './answer'

export default function AnswerList(props) {

    const [answerSubmitted, setAnswerSubmitted] = useState(false);
    const [correctAnswerSubmitted, setCorrectAnswerSubmitted] = useState(false);

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
            return `You're right! This song is called ${correctAnswer.displayText}`;
        } else {
            return `You're wrong! This This song is called ${correctAnswer.displayText}`;
        }
    }

    return (
        <List>
        {answerSubmitted && 
        <p>{getAnswerText()}</p>
        }
        {
            props.answers.map((answer) => (
                <AnswerItem disabled={answerSubmitted} key={answer.id} displayText={answer.displayText} isCorrect={answer.isCorrect} onClick={answerClicked}/>
            ))
        }
        </List>
    )
}  