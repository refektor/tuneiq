import React from 'react';
import { Grid, Box, Button, Typography, makeStyles } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { getPossibleGenres } from '../firebase/server';

const data = getPossibleGenres();

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
            {data && data.map((item, index) => (
                <Box key={index} className={classes.wrapper} maxWidth="md" >
                    {item ? (
                        <Box key={index} className={classes.item}>
                            <Button >
                                <img 
                                    style={{ width: 75, height: 75}}
                                    alt={item.name} 
                                    src={item.img}
                                    onClick={() => onPicked(item.name)} />
                            </Button>
                            <Typography key={index} className={classes.text} variant="caption" color="textSecondary">
                                {item.name}
                            </Typography>
                        </Box>
                    ) : (
                        <Skeleton variant="rect" />
                    )}
                </Box>
            ))}
            </Grid>
        </Box>
  );
}
