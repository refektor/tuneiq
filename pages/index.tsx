import Head from 'next/head'
import Link from 'next/link'
import WelcomeLayout from '../components/welcome_layout'
import GamesMenu from '../components/games_menu'
import { Container } from '@material-ui/core'


export default function Home() {
  return (
    <Container maxWidth="md">
      <Head>
        <title>Tune IQ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WelcomeLayout>
        <GamesMenu/>
      </WelcomeLayout>
    </Container>
  )
}
