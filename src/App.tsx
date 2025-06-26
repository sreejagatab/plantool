import WizardContainer from './components/wizard/WizardContainer';
import './App.css';

function App() {
  return (
    <div className="App min-h-screen flex flex-col">
      <div className="flex-1">
        <WizardContainer />
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            Powered by{' '}
            <a
              href="https://www.jagatab.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Jagatab.UK
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
