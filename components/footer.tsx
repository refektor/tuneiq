import { Container } from '@material-ui/core'

export default function Footer() {
    const text = "Check us out";

    return (
        <Container>
            <footer>
                <a
                    href="https://github.com/refektor/tuneiq"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {text} <img src="/Github-Mark-32px.png" />
                </a>
            </footer>
        </Container>); 
}