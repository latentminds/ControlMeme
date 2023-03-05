import logo from './logo.svg';
import './App.css';
import ControleMeme from './ControleMeme';

import { createTheme } from '@mui/material/styles';

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: "#00ff00"
      }
    }
  });

  return (
    <div className="App">
      <ControleMeme />

    </div>
  );
}

export default App;
