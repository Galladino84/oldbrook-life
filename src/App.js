import { Button } from 'react-bootstrap';
import TestLocalStorage from './components/TestLocalStorage';

function App() {
  return (
    <div className="App container p-4">
      <h1>Oldbrook Life: Test UI</h1>
      <Button variant="primary">Test Bootstrap Button</Button>
      <TestLocalStorage />
    </div>
  );
}

export default App;
