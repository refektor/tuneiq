/**
 * This component should wrap any content that should only be
 * shown to authenticated users. If the user is not authenticated,
 * we will route to the home screen.
 */

import { Component, Fragment } from "react";
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
                //clear session after user exits tab
                Firebase.auth().setPersistence(FB.auth.Auth.Persistence.SESSION)
                    .then(function() {
                        return Firebase.auth().signInAnonymously();
                    })
                    .catch(function(error) {
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
            if (this.state.needsName) {
                // if we append it to an array, react complains about needing a unique key for each child
                return(this.props.children && <UserLogin setNickname={this.onSuccess} />);
            }

            return this.props.children;
            
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