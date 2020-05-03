/**
 * This component should wrap any content that should only be
 * shown to authenticated users. If the user is not authenticated,
 * we will route to the home screen.
 */

import { Component, Fragment } from "react";
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
}

export default class Auth extends Component<IProps, IState> {
    attemptSignIn: boolean;
    constructor(props) {
        super(props);
        this.attemptSignIn = props.attemptSignIn;
        this.onSuccess = this.onSuccess.bind(this);
        this.toggleAuthentication = this.toggleAuthentication.bind(this);

        this.state = {
            authenticated: false,
            needsName: true, //could a user ever needName but be not authenticated yet?
        };

        Firebase.auth().onAuthStateChanged((user) => {
            let authenticated = false;
            let needsName = true;
            if (user) {
                console.log(`signed in as id: ${user.uid}`)
                if (this.props.onSuccess) {
                    this.props.onSuccess(user.displayName);
                }
                authenticated = true;
                needsName = false;
            } else {
              // signed out
            }
            this.setState({ needsName, authenticated });
        });
    }
    
    componentDidMount() {
        // if not signed in
        if (!Firebase.auth().currentUser) {
            // try to sign in if parent component indicated so
            if (this.attemptSignIn) {
                console.log('attempting sign in')
                Firebase.auth().signInAnonymously().catch((error) => {
                    console.log(`error: ${error.code}, ${error.message}`);
                });
            } else {
                this.toggleAuthentication(!this.state.authenticated);
                console.log('not attempting sign in, redirect to home page')
                Router.replace("/");
            }
        } else {
            this.toggleAuthentication(!this.state.authenticated);
        }
    }

    onSuccess(nickname) {
        this.setState({authenticated: true, needsName: false})
        if (this.props.onSuccess) {
            this.props.onSuccess(nickname);
        }
    } 

    toggleAuthentication(toggle) {
        this.setState({ authenticated : toggle})
    }

    renderChildren() {
        if (this.state.authenticated) {
            let finalChildren = [];
            finalChildren.push(this.props.children);

            if (this.state.needsName) {
                finalChildren.push(<UserLogin setNickname={this.onSuccess} />);
            }

            return finalChildren;
            
        } else {
            return (<CircularProgress />);
        }
    }

    render() {
        return (
            <Fragment>
                {this.renderChildren()}
            </Fragment>
        );
    }
}