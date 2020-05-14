import Link from 'next/link'
import { Container, Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import useGameStyles from '../styles/game_styles';

const CREATE_URL = "/games/create";
const JOIN_URL = "/games/join";

export default function GamesMenu() {
    const classes = useGameStyles();
    
    return (
        <Container maxWidth="sm">
            <Link href={CREATE_URL}>
                <Fab 
                    variant="extended"
                    color="primary"
                    size="large"
                    className={classes.button}
                >
                    <AddIcon />
                    CREATE GAME
                </Fab>
            </Link>
            <Link href={JOIN_URL}>
                <Fab 
                    variant="extended"
                    color="primary"
                    size="large"
                    className={classes.button}
                >
                    <PeopleAltIcon />
                    JOIN GAME
                </Fab>
            </Link>
        </Container>);
}