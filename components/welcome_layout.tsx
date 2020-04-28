
function WelcomeLayout({ userName, children }) {
    function renderWelcomeMessage() {
        if (userName) {
            return `Welcome ${userName}, what is your Tune IQ?`;
        } else {
            return "What is your Tune IQ?";
        }
    }

    return (
        <div>
        <main>
        <h1 className="title">
          Tune IQ
        </h1>

        <p className="description">
          {renderWelcomeMessage()}
        </p>

        {children}
      </main>

      <footer>
        <a
          href="https://github.com/refektor/tuneiq"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check us out <img src="/Github-Mark-32px.png" />
        </a>
      </footer>
    </div>); 
}

export default WelcomeLayout;