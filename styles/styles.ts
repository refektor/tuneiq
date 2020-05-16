import { makeStyles, createStyles } from '@material-ui/core/styles';

// Create a theme instance.
const inputStyles = makeStyles((theme) => createStyles ({
    inputChild: {
        margin: theme.spacing(3, 'auto'),
        display: 'block',
        width: 200,
        '& > *': {
          color: theme.palette.text.hint
        }
      },
    
      button: {
        margin: theme.spacing(3, 'auto'),
        display: 'flex',
        width: 200,
        fontWeight: 600,
        '& > *': {
          color: theme.palette.text.secondary,
          display: 'inline-flex',
          '& > *': {
            margin: theme.spacing(0, 1),
          }
        }
      }
}));

export default inputStyles;