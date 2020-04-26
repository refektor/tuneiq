import Link from 'next/link'
import { Grid, Button, Fab } from '@material-ui/core'

export default function GamesMenu() {
    return (<div className="grid">
        <Grid color="primary" aria-label="outlined primary button group">
            <Link href="/games/create"><Button color="primary">Create Game</Button></Link>
            <Link href="games/join"><Button color="primary">Join a Game</Button></Link>
        </Grid>
    </div>);
}