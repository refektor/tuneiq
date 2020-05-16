import PageWrapper from './page_wrapper';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  welcomeMessage:  {
    margin: theme.spacing(2, "auto"),
    lineHeight: 2,
    fontWeight: 600
  },

  userName: {
    color: theme.palette.primary.main,
  }
}));

const WELCOME = "Welcome";
const SIGNED_IN = ", what is your Tune IQ?";
const NOT_SIGNED_IN = "What is your Tune IQ?";

export default function WelcomeLayout({ userName, children }) {
  const classes = useStyles();

  return (
      <PageWrapper>
        <Typography className={classes.welcomeMessage} variant="h6">
          {userName && (
            <div>
              <span>{WELCOME} </span>
              <span className={classes.userName}>{userName}</span>
              <span>{SIGNED_IN}</span>
            </div>
          )}

          {!userName && (
            <span>
              {NOT_SIGNED_IN}
            </span>
          )}
        </Typography>

        {children}
      </PageWrapper>);
}