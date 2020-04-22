function WelcomeLayout({ children }) {
    return (
        <div>
        <main>
        <h1 className="title">
          Welcome to Tune IQ
        </h1>

        <p className="description">
          What is your Tune IQ?
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