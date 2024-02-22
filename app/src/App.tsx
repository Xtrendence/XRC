import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';

import Navigation from './components/navigation/Navigation';

import Processes from './components/processes/Processes';
import ControlCenter from './components/control-center/ControlCenter';
import BackupUtility from './components/backup-utility/BackupUtility';
import Settings from './components/settings/Settings';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <CssVarsProvider defaultMode="dark">
      <Router>
        <Toaster />
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/processes" />} />
          <Route path="/processes" element={<Processes />} />
          <Route path="/control-center" element={<ControlCenter />} />
          <Route path="/backup-utility" element={<BackupUtility />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
      </Router>
    </CssVarsProvider>
  );
}

export default App;
