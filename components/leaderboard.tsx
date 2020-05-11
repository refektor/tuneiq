import React from 'react';
import { Box, Drawer, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, makeStyles, Avatar, ListItemSecondaryAction } from '@material-ui/core';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    
    drawerPaper: {
        width: drawerWidth,
    },
    
    leaderboard: {
        display: 'inline-block',
        margin: theme.spacing(6, 'auto')
    }
}));

export default function Leaderboard({ leaderboard }) {
    const classes = useStyles();
    if (leaderboard) {
        leaderboard.sort((a,b) => {return b.score - a.score });
    }

    return (
        <Box overflow="hidden" className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="right"
            >
                <Typography variant="h6" className={classes.leaderboard}>
                    Leaderboard
                </Typography>
                <Divider />
                <List id="leaderboard">
                {leaderboard && leaderboard.map((player, index) => (
                    <ListItem key={player.name}>
                        <ListItemIcon>
                            <Avatar>{player.name.substring(0,1).toUpperCase()}</Avatar>
                        </ListItemIcon>
                        <ListItemText primary={player.name} />
                        <ListItemSecondaryAction>
                        <ListItemText primary={player.score}/>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
                </List>
            </Drawer>
        </Box>
  );
}
