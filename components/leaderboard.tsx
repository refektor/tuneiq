import React, { useState } from 'react';
import clsx from 'clsx';
import { 
    Box, 
    Drawer, 
    Typography, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    IconButton,
    Divider, 
    makeStyles, 
    Avatar, 
    ListItemSecondaryAction 
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';

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

    leaderButton: {
        margin: theme.spacing(0, 'auto')
    },

    leaderTitle: {
        padding: "8px",
    },
    
    hide: {
        display: 'none',
    },

    left: {
        float: "left"
    },

    right: {
        position: "absolute",
        width: "75%",
        right: 0
    },

    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },

    playerContainer: {
        padding: 0
    },

    avatar: {
        margin: theme.spacing(0, 'auto')
    },

    scoreRoot: {
        minWidth: "56px", // similar to avatar based on browser testing
        position: "inherit", //get rid of absolute position
        right: 0,
        transform: "none"
    },

    scoreText: {
        textAlign: "center"
    }
}));

export default function Leaderboard({ leaderboard }) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    if (leaderboard) {
        leaderboard.sort((a,b) => {return b.score - a.score });
    }

    return (
        <Box overflow="hidden" className={classes.root}>
            <Drawer
                variant="permanent"
                anchor="right"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                      [classes.drawerOpen]: open,
                      [classes.drawerClose]: !open,
                    }),
                }}
            >
                <IconButton
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    className={clsx(
                        classes.leaderButton, {
                        [classes.hide]: open,
                    })}
                >
                    <MenuIcon />
                </IconButton>

                <div>
                    <IconButton
                        aria-label="close drawer"
                        onClick={handleDrawerClose}
                        className={clsx(
                            classes.left, {
                            [classes.hide]: !open,
                        })}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                    <Typography 
                        variant="h6"
                        className={clsx(
                            classes.leaderTitle,
                            classes.right, {
                            [classes.hide]: !open,
                        })}
                    >
                        Leaderboard
                    </Typography>
                </div>
                
                <Divider />
                <List id="leaderboard">
                {leaderboard && leaderboard.map((player) => (
                    <ListItem 
                        key={player.name}
                        className={clsx({
                            [classes.playerContainer]: !open,
                        })}
                    >
                        <ListItemIcon>
                            <Avatar className={classes.avatar}>{player.name.substring(0,1).toUpperCase()}</Avatar>
                        </ListItemIcon>
                        <ListItemText 
                            primary={player.name}
                            className={clsx({
                                [classes.hide]: !open,
                            })}
                        />
                        <ListItemSecondaryAction
                            className={clsx({
                                [classes.scoreRoot]: !open,
                            })}
                        >
                            <ListItemText 
                                primary={player.score}
                                className={clsx({
                                    [classes.scoreText]: !open,
                                })}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
                </List>
            </Drawer>
        </Box>
  );
}
