import { Container, TextField, makeStyles  } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));

export default function CreateGame({ player }) {
    const classes = useStyles();
    
    return (
        <Container>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="standard-basic" label="Game Name" />
                <TextField id="standard-basic" label="Game Password" />
            </form>
        </Container>
      )
}