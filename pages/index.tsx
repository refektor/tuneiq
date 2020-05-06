import Head from 'next/head'
import { useState } from "react";
import WelcomeLayout from '../components/welcome_layout'
import GamesMenu from '../components/games_menu'
import { Container } from '@material-ui/core'
import Auth from '../components/auth'

function Home() {
  const [nickname, setNickname] = useState("");

  function nicknameSet(validNickname) {
    setNickname(validNickname);
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
  );
}

export default Home;
