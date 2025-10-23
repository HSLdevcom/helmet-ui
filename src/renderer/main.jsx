import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.jsx';
import { searchEMMEPython, listEMMEPythonPaths } from './search_emme_pythonpath.js';
import { version } from '../../package.json'; // your package.json version
import { HelmetModelProvider } from './context/HelmetModelContext';

// Import CSS here instead of in HTML
import './components/App.css';
import './components/Settings/Settings.css';
import './components/HelmetProject/HelmetProject.css';
import './components/HelmetProject/HelmetScenario/HelmetScenario.css';
import './components/HelmetProject/Runtime/Runtime.css';
import './components/HelmetProject/Runtime/RunStatus/RunStatus.css';
import './components/HelmetProject/RunLog/RunLog.css';
import './components/HelmetProject/CostBenefitAnalysis/CostBenefitAnalysis.css';
import 'react-tabs/style/react-tabs.css';
import 'vex-js/dist/css/vex.css';
import 'vex-js/dist/css/vex-theme-os.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetModelProvider>
    <App
      helmetUIVersion={version}
      searchEMMEPython={searchEMMEPython}
      listEMMEPythonPaths={listEMMEPythonPaths}
    />
  </HelmetModelProvider>
);