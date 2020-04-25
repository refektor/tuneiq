import Head from 'next/head'
import Link from 'next/link'
import WelcomeLayout from '../components/welcome_layout'
import * as db from '../database/db'

function getContent() {
  return (
    <div className="grid">
          <a href="https://nextjs.org/docs" className="card">
            <h3>Create a game &rarr;</h3>
            <p>Choose a genre, and share your game credentials with others.</p>
          </a>

          <a href="https://nextjs.org/learn" className="card">
            <h3>Join a game &rarr;</h3>
            <p>Enter game credentials to enter a game.</p>
          </a>
    </div>
  );
}

export default function Home() {
  db.fetchGames();
  return (
    <div className="container">
      <Head>
        <title>Tune IQ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WelcomeLayout>
        {getContent()}
      </WelcomeLayout>
    </div>
  )
}
