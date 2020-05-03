/**
 * This component should wrap any content that should only be
 * shown to authenticated users. If the user is not authenticated,
 * we will route to the home screen.
 */

import { Component } from "react";
import { CircularProgress } from '@material-ui/core';
import Router from 'next/router';
import UserLogin from '../components/user_login'
import { Firebase, FB } from '../database/firebase';


interface IProps {
    onSuccess?: any;
    attemptSignIn?: boolean;
}

interface IState {
    authenticated: boolean;
    needsName: boolean;
}

export default class Auth extends Component<IProps, IState> {
    attemptSignIn: boolean;
    constructor(props) {
        super(props);
        this.attemptSignIn = props.attemptSignIn;
        this.onSuccess = this.onSuccess.bind(this);

        this.state = {
            authenticated: false,
            needsName: false, //if this is initialized with true, the name popup comes up while waiting to get user from firebase
        };

        Firebase.auth().onAuthStateChanged((user) => {
            let authenticated = false;
            let needsName = true;
            if (user?.displayName) {
                console.log(`signed in as id: ${user.displayName}`)
                if (this.props.onSuccess) {
                    this.props.onSuccess(user.displayName);
                }
                authenticated = true;
                needsName = false;
            } else {
                console.log("user has no name");
            }
            console.log("needs name:", needsName, "authenticated:", authenticated);
            this.setState({ needsName, authenticated });
        });
    }
    
    componentDidMount() {
        // if not signed in
        if (!Firebase.auth().currentUser) {
            // try to sign in if parent component indicated so
            if (this.attemptSignIn) {
                console.log('attempting sign in')
                Firebase.auth().signInAnonymously().catch(function(error) {
                    console.log(`error: ${error.code}, ${error.message}`);
                });
            } else {
                console.log('not attempting sign in, redirect to home page');
                Router.replace("/");
            }
        } else {
            this.setState({ authenticated : true })
        }
    }

    onSuccess(nickname) {
        this.setState({authenticated: true, needsName: false})
        if (this.props.onSuccess) {
            this.props.onSuccess(nickname);
        }
    }

    renderChildren() {
        if (this.state.needsName) {
            return(<UserLogin setNickname={this.onSuccess} />);
        }

        if (this.state.authenticated) {
            return this.props.children;
        } else {
            return (<CircularProgress />);
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