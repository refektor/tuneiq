import { Container } from '@material-ui/core'

export default function Header() {
    const title = "Tune IQ";

    return (
        <Container>
            <h1 className="title">
              {title}
            </h1>
        </Container>); 
}