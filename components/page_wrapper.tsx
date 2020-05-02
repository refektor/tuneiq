import { Container } from '@material-ui/core'
import Header from './header';
import Footer from './footer';

export default function PageWrapper({ children }) {
    return (
        <div>
          <main>
            <Header />
            {children}
          </main>
          <Footer />
        </div>); 
}