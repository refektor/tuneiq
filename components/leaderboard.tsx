import React from 'react';
import { Box, Drawer, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, makeStyles, Avatar } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

const drawerWidth = 600;

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

export default function Leaderboard({ players }) {
    const classes = useStyles();

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
                <List>
                {players.map((player, index) => (
                    <ListItem button key={player.name}>
                        <ListItemIcon>
                            <Avatar>{player.name.substring(0,1).toUpperCase()}</Avatar>
                        </ListItemIcon>
                        <ListItemText primary={player.name} />
                        <ListItemText primary={player.score} />
                    </ListItem>
                ))}
                </List>
            </Drawer>
        </Box>
  );
}
