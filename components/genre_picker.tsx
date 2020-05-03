import React from 'react';
import { Grid, Box, Button, Typography, makeStyles } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

// TODO: fetch from cloud function
const data = [
  {
    src:
      'https://i.ytimg.com/vi/pLqipJNItIo/hqdefault.jpg?sqp=-oaymwEYCNIBEHZIVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLBkklsyaw9FxDmMKapyBYCn9tbPNQ',
    genre: 'tech house',
    //times_played: 'Don Diablo', //future feature?
  },
  {
    src:
      'https://i.ytimg.com/vi/_Uu12zY01ts/hqdefault.jpg?sqp=-oaymwEZCPYBEIoBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLCpX6Jan2rxrCAZxJYDXppTP4MoQA',
    genre: 'disco',
  },
  {
    src:
      'https://i.ytimg.com/vi/kkLk2XWMBf8/hqdefault.jpg?sqp=-oaymwEYCNIBEHZIVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLB4GZTFu1Ju2EPPPXnhMZtFVvYBaw',
    genre: 'rap',
  },
  {
    src:
      'https://i.ytimg.com/vi/_Uu12zY01ts/hqdefault.jpg?sqp=-oaymwEZCPYBEIoBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLCpX6Jan2rxrCAZxJYDXppTP4MoQA',
    genre: 'pop',
  },
  {
    src:
      'https://i.ytimg.com/vi/kkLk2XWMBf8/hqdefault.jpg?sqp=-oaymwEYCNIBEHZIVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLB4GZTFu1Ju2EPPPXnhMZtFVvYBaw',
    genre: 'rock',
  },
  {
    src:
      'https://i.ytimg.com/vi/_Uu12zY01ts/hqdefault.jpg?sqp=-oaymwEZCPYBEIoBSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLCpX6Jan2rxrCAZxJYDXppTP4MoQA',
    genre: 'classical',
  },
  {
    src:
      'https://i.ytimg.com/vi/kkLk2XWMBf8/hqdefault.jpg?sqp=-oaymwEYCNIBEHZIVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLB4GZTFu1Ju2EPPPXnhMZtFVvYBaw',
    genre: 'alternative',
  },
];

const useStyles = makeStyles((theme) => ({
    wrapper: {
        display: 'block'
    },

    item: {
        margin: theme.spacing(4, 2),
        display: 'inline-block',
        float: 'right',
    },

    text: {
        margin: theme.spacing('auto', 2),
        display: 'block'
    }
}));

export default function GenrePicker({ onPicked }) {
    const classes = useStyles();

    return (
        <Box overflow="hidden">
            <Grid container>
            {Array.from(data.map((item, index) => (
                <Box key={index} className={classes.wrapper} maxWidth="md" >
                    {item ? (
                        <Box className={classes.item}>
                            <Button >
                                <img 
                                    style={{ width: 75, height: 75}}
                                    alt={item.genre} 
                                    src={item.src}
                                    onClick={() => onPicked(item.genre)} />
                            </Button>
                            <Typography className={classes.text} variant="caption" color="textSecondary">
                                {item.genre}
                            </Typography>
                        </Box>
                    ) : (
                        <Skeleton variant="rect" width={210} height={118} />
                    )}
                </Box>
            )))}
            </Grid>
        </Box>
  );
}
