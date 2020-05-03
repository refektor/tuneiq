import { makeStyles, createStyles } from '@material-ui/core/styles';

// Create a theme instance.
const useGameStyles = makeStyles((theme) => createStyles ({
    inputChild: {
        margin: theme.spacing(3, 'auto'),
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

export default useGameStyles;