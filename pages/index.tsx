import Head from 'next/head'
import { useState, useEffect } from "react";
import Link from 'next/link'
import WelcomeLayout from '../components/welcome_layout'
import GamesMenu from '../components/games_menu'
import UserLogin from '../components/user_login'
import { Container } from '@material-ui/core'
import { Firebase } from '../database/firebase'
import Auth from '../components/auth'

import * as db from "../database/db";

function Home() {
  const [nickname, setNickname] = useState("");

  // useEffect(() => {
  //   Firebase.auth().signInAnonymously();
  // });

  // Firebase.auth().onAuthStateChanged(function(user) {
  //   if (user?.displayName) {
  //     setNickname(user.displayName);
  //   } else {
  //     // signed out
  //   }
  // });

  function nicknameSet(validNickname) {
    setNickname(validNickname);
  }

  function renderNickname() {
    if (!nickname) {
      return (<UserLogin setNickname={nicknameSet}/>);
    }
    else {
      return (<GamesMenu/>);
    }
  }

  return (
    <Container maxWidth="md">
      <Head>
        <title>Tune IQ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      
      <WelcomeLayout userName={nickname}>
      <Auth attemptSignIn={true} onSuccess={nicknameSet}>
        <GamesMenu/>
      </Auth>
      </WelcomeLayout>
      
    </Container>
  )
}

export default Home;
