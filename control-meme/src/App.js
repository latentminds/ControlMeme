import logo from './logo.svg';
import './App.css';
import ControleMeme from './ControleMeme';
import { createTheme } from '@mui/material/styles';
import { UserContext, UserProvider } from './UserContext';
import { useContext, useState } from 'react';

function App() {

  const [user, setUser] = useState(null)


  const theme = createTheme({
    palette: {
      primary: {
        main: "#00ff00"
      }
    }
  });

  return (
    <div className="App">
      <UserProvider value={{ user, setUser }}>
        <ControleMeme />
      </UserProvider>
    </div>
  );
}

export default App;
