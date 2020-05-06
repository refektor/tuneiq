import PageWrapper from './page_wrapper';

export default function WelcomeLayout({ userName, children }) {
    function renderWelcomeMessage() {
        if (userName) {
            return `Welcome ${userName}, what is your Tune IQ?`;
        } else {
            return "What is your Tune IQ?" 
        }
    }

    return (
        <PageWrapper>
          <p className="description">
            {renderWelcomeMessage()}
          </p>

          {children}
        </PageWrapper>);
}