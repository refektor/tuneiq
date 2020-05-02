/**
 * This component should wrap any content that should only be
 * shown to authenticated users. If the user is not authenticated,
 * we will route to the home screen.
 */

import { useState, useEffect, Fragment, Component } from "react";
import { CircularProgress } from '@material-ui/core';
import Router from 'next/router';
import UserLogin from '../components/user_login'
import { Firebase } from '../database/firebase';


interface IProps {
    onSuccess?: any;
    attemptSignIn?: boolean;
}

interface IState {
    authenticated: boolean;
    needsName: boolean;
    firebaseLoading: boolean;
}


export default class Auth extends Component<IProps, IState> {
    attemptSignIn: boolean;
    constructor(props) {
        super(props);
        this.attemptSignIn = props.attemptSignIn;
        this.onSuccess = this.onSuccess.bind(this);
        this.state = {
            authenticated: false,
            needsName: true,
            firebaseLoading: false
        };

        Firebase.auth().onAuthStateChanged((user) => {
            console.log(`signed in as id: ${user.uid}`)
            let authenticated = false;
            let needsName = true;
            if (user?.displayName) {
                if (this.props.onSuccess) {
                    this.props.onSuccess(user.displayName);
                }
                authenticated = true;
                needsName = false;
            } else {
              // signed out
            }
            this.setState({needsName, authenticated, firebaseLoading: false});
        });
    }
    
    componentDidMount() {
        // if not signed in
        if (!Firebase.auth().currentUser) {
            // try to sign in if parent component indicated so
            if (this.attemptSignIn) {
                console.log('attempting sign in')
                Firebase.auth().signInAnonymously();
                this.setState({firebaseLoading: true});
            } else {
                console.log('not attempting sign in, redirect to home page')
                Router.replace("/");
            }
        } else {
            //setAuthenticated(true);
            this.setState({authenticated: true})
        }
    }

    onSuccess(nickname) {
        this.setState({authenticated: true, needsName: false})
        if (this.props.onSuccess) {
            this.props.onSuccess(nickname);
        }
    } 

    renderChildren() {
        if (this.state.authenticated) {
            return this.props.children;
        } else if (this.state.firebaseLoading) {
            return (<CircularProgress />);
        } else if (this.state.needsName) {
            return (<UserLogin setNickname={this.onSuccess} />);
        }
    }

    render() {
        return (
            <>
            {this.renderChildren()}
            </>
        );
    }
}