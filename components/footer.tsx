import { Container, Typography, makeStyles } from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub';

//TODO: make this footer's border the same colour as main somehow
const useStyles = makeStyles((theme) => ({
    footer: {
        border: 0
    },

    container: {
        borderTop: 1,
        borderColor: 'text.main'
    },

    icon: {
        margin: theme.spacing(0, 2)
    }
}));

const text = "Check us out";

export default function Footer() {
    const classes = useStyles();

    return (
        <Container>
            <footer>
                <a
                    href="https://github.com/refektor/tuneiq"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                <Typography variant="overline">
                    {text}
                </Typography>
                <GitHubIcon className={classes.icon} />
                </a>
            </footer>
        </Container>); 
}