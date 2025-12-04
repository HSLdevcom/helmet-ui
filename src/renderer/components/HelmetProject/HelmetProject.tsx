import React, {useState, useEffect, useRef} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Runtime from './Runtime/Runtime.jsx';
import HelmetScenario from './HelmetScenario/HelmetScenario.jsx';
import RunLog from './RunLog/RunLog.jsx';
import CostBenefitAnalysis from './CostBenefitAnalysis/CostBenefitAnalysis.jsx';
import Modal from '../Modal/Modal'; 
import { Scenario, LogArgs, LogEntry, CbaOptions, ScenarioStore, DemandConvergenceEntry, ReadyScenarioLogfile } from '../../../types';
import { set } from 'lodash';

const { ipcRenderer, fs, path } = window.electronAPI;

interface HelmetProjectProps {
  emmePythonPath: string | undefined;
  helmetScriptsPath: string | undefined;
  projectPath: string | undefined;
  basedataPath: string | undefined;
  resultsPath: string | undefined;
  signalProjectRunning: (isRunning: boolean) => void;
}

const HelmetProject = ({
  emmePythonPath, helmetScriptsPath, projectPath, basedataPath, resultsPath,
  signalProjectRunning,
}: HelmetProjectProps) => {
  // HELMET Project -specific settings
  const [scenarios, setScenarios] = useState<Scenario[]>([]); // HELMET Scenarios under currently selected HELMET Project
  const [openScenarioID, setOpenScenarioID] = useState<string|null>(null); // currently open HELMET Scenario configuration

  // Runtime controls & -logging
  const [scenarioIDsToRun, setScenarioIDsToRun] = useState<string[]>([]); // selected active scenarios ready to run sequentially
  const [runningScenarioID, setRunningScenarioID] = useState<string|null>(null); // currently running HELMET Scenario, indicates if running
  const [runningScenarioIDsQueued, setRunningScenarioIDsQueued] = useState<string[]>([]); // queued ("remaining") HELMET Scenarios
  const [logContents, setLogContents] = useState<LogEntry[]>([]); // project runtime log-contents
  const [isLogOpened, setLogOpened] = useState<boolean>(false); // whether runtime log is open
  const [logArgs, setLogArgs] = useState<LogArgs>({});

  // Runtime status
  const [statusIterationsTotal, setStatusIterationsTotal] = useState<number|null>(null);
  const [statusIterationsCurrent, setStatusIterationsCurrent] = useState<number>(0);
  const [statusIterationsCompleted, setStatusIterationsCompleted] = useState<number>(0);
  const [statusIterationsFailed, setStatusIterationsFailed] = useState<number>(0);
  const [statusState, setStatusState] = useState<string|null>(null);
  const [statusLogfilePath, setStatusLogfilePath] = useState(null);
  const [statusReadyScenariosLogfiles, setStatusReadyScenariosLogfiles] = useState<ReadyScenarioLogfile[]>([]); // [{name: .., logfile: ..}]
  const [statusRunStartTime, setStatusRunStartTime] = useState(null); //Updated when receiving "starting" message
  const [statusRunFinishTime, setStatusRunFinishTime] = useState(null); //Updated when receiving "finished" message
  const [demandConvergenceArray, setDemandConvergenceArray] = useState<DemandConvergenceEntry[]>([]); // Add convergence values to array every iteration

  // User-set scenario list height in the Scenarios tab
  const [scenarioListHeight, setScenarioListHeight] = useState<string|null>(null);

  // Cost-Benefit Analysis (CBA) controls
  const [cbaOptions, setCbaOptions] = useState<CbaOptions|undefined>(undefined);

  // Scenario-specific settings under currently selected HELMET Project
  const configStores = useRef<Map<string, ScenarioStore>>(new Map()); // Use a Map to manage scenario-specific stores

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>('');
  const [newScenarioName, setNewScenarioName] = useState<string>('');

  const homedir = window.electronAPI.os.homedir();

  const _handleClickScenarioToActive = (scenario: Scenario) => {
    if(scenarioIDsToRun.includes(scenario.id)) {
      // If scenario exists in scenarios to run, remove it
      setScenarioIDsToRun(scenarioIDsToRun.filter((id) => id !== scenario.id))
    } else {
      // Else add it
      setScenarioIDsToRun(scenarioIDsToRun.concat(scenario.id));
    }
  };

  const _handleClickNewScenario = () => {
    setModalOpen(true);
    setModalError('');
    setNewScenarioName('');
  };

  const handleModalSubmit = () : void => {
    if (!newScenarioName.trim()) {
      setModalError('Nimike on pakollinen, tallennettavaa tiedostonimeä varten.');
      return;
    }
    if (scenarios.map((s) => s.name).includes(newScenarioName.trim())) {
      setModalError('Nimike on jo olemassa, valitse toinen nimi tai poista olemassa oleva ensin.');
      return;
    }
    _createScenario(newScenarioName.trim());
    setModalOpen(false);
  };

  const _handleClickStartStop = () => {
    runningScenarioID === null ?
      _runAllActiveScenarios(scenarioIDsToRun)
      :
      _cancelRunning();
  };

  const _loadProjectScenarios = async (projectPath: string|undefined): Promise<void> => {
    if (!projectPath) {
      setModalError('Projektikansiota ei ole asetettu, tarkista Asetukset.');
      return;
    }
    console.groupCollapsed('[HelmetProject] _loadProjectScenarios');
    console.log('Loading project from:', projectPath);

    try {
      const files = await fs.readdir(projectPath);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));
      console.log('Found JSON files:', jsonFiles);

      const foundScenarios = (
        await Promise.all(
          jsonFiles.map(async (fileName) => {
            const filePath = path.join(projectPath, fileName);

            try {
              const content = await fs.readFile(filePath);
              let obj = JSON.parse(content);

              // Detect and fix nested "scenario" structure
              if (obj && obj.scenario && typeof obj.scenario === 'object') {
                console.warn(`Detected nested scenario structure in ${fileName}. Fixing...`);
                obj = obj.scenario;

                // Attempt to rewrite the corrected structure
                try {
                  await fs.writeFile(filePath, JSON.stringify(obj, null, 2));
                  console.log(`Rewrote nested scenario file to flat format: ${fileName}`);
                } catch (writeErr) {
                  console.error(`Failed to rewrite corrected scenario file ${fileName}:`, writeErr);
                }
              }

              // Validate scenario structure
              if (
                'id' in obj &&
                'name' in obj &&
                'use_fixed_transit_cost' in obj &&
                'iterations' in obj
              ) {
                const namespace = `${projectPath}/${fileName.replace('.json', '')}`;
                if (!configStores.current.has(namespace)) {
                  configStores.current.set(
                    namespace,
                    window.electronAPI.StoreAPI.getScenarioStore(namespace)
                  );
                }
                return obj;
              } else {
                console.warn(`Invalid scenario structure in file: ${fileName}`);
                console.log('Scenario content:', obj);
              }
            } catch (err) {
              console.error(`Failed to load scenario from ${fileName}:`, err);
            }

            return null;
          })
        )
      ).filter(Boolean);

      // Add runStatus if missing (for backward compatibility)
      const decoratedFoundScenarios = foundScenarios.map((scenario) =>
        scenario.runStatus === undefined
          ? addRunStatusProperties(scenario)
          : scenario
      );

      // Update UI state
      setScenarios(decoratedFoundScenarios);
      setOpenScenarioID(null);
      setScenarioIDsToRun([]);
      setRunningScenarioID(null);
      setRunningScenarioIDsQueued([]);
      setLogContents([]);
      setLogOpened(false);

      // Summary log
      const fixedCount = foundScenarios.length - decoratedFoundScenarios.length;
      // console.log(`Loaded ${foundScenarios.length} scenarios from project.`);
      if (fixedCount > 0) {
        console.log(`Auto-fixed ${fixedCount} nested scenario file(s).`);
      }
    } catch (error) {
      console.error('Error loading project scenarios:', error);
    }

    console.groupEnd();
  };


  const addRunStatusProperties = (scenario: Scenario) => {
    return {
      ...scenario,
      runStatus: {
        statusIterationsTotal: null,
        statusIterationsCurrent: 0,
        statusIterationsCompleted: 0,
        statusIterationsFailed: 0,
        statusState: null,
        statusLogfilePath: null,
        statusReadyScenariosLogfiles: [],
        statusRunStartTime: null,
        statusRunFinishTime: null,
        demandConvergenceArray: [] as DemandConvergenceEntry[],
      }
    }
  }

  const _createScenario = async (newScenarioName: string) => {
    // Generate new (unique) ID for the new scenario
    if (!projectPath) {
      setModalError('Projektikansiota ei ole asetettu, tarkista Asetukset.');
      return;
    }
    const newId = uuidv4();

    // Extract the number at the beginning of the name, if it exists
    const match = newScenarioName.match(/^(\d+)[ _]/);
    const firstScenarioId = match ? match[1] : "1";

    // Check for .emp files in the project directory
    let defaultEmmeProjectFilePath = null;
    try {
      const files = await fs.readdir(projectPath);
      const empFiles = files.filter((file) => file.endsWith('.emp'));
      if (empFiles.length === 1) {
        defaultEmmeProjectFilePath = path.join((projectPath), empFiles[0]);
        console.log(`Default .emp file found: ${defaultEmmeProjectFilePath}`);
      } else if (empFiles.length > 1) {
        console.log(`Multiple .emp files found. No default will be set.`);
      } else {
        console.log(`No .emp files found in the project directory.`);
      }
    } catch (error) {
      console.error(`Error reading project directory for .emp files:`, error);
    }

    const newScenario = {
      id: newId,
      name: newScenarioName,
      emme_project_file_path: defaultEmmeProjectFilePath, // Use the default .emp file if found
      first_scenario_id: firstScenarioId,
      forecast_data_folder_path: null,
      delete_strategy_files: true,
      separate_emme_scenarios: false,
      save_matrices_in_emme: false,
      first_matrix_id: "100",
      use_fixed_transit_cost: false,
      end_assignment_only: false,
      iterations: 15,
      overriddenProjectSettings: {
        emmePythonPath: null,
        helmetScriptsPath: null,
        projectPath: null,
        basedataPath: null,
        resultsPath: null,
      },
      runStatus: {
        statusIterationsTotal: null,
        statusIterationsCurrent: 0,
        statusIterationsCompleted: 0,
        statusIterationsFailed: 0,
        statusState: null,
        statusLogfilePath: null,
        statusReadyScenariosLogfiles: [],
        statusRunStartTime: null,
        statusRunFinishTime: null,
        demandConvergenceArray: [] as DemandConvergenceEntry[],
      }
    };
    // Create the new scenario in "scenarios" array first
    setScenarios((prev) => [...prev, newScenario]);
    const namespace = `${ projectPath }/${ newScenario.name }`;
    const store = window.electronAPI.StoreAPI.getScenarioStore(namespace);
    configStores.current.set(namespace, store);
    store.set(newId, newScenario);
    // Then set scenario as open by id
    setOpenScenarioID(newId);
  };

  const _updateScenario = async (newValues: Scenario): Promise<void> => {      
    // Find the existing scenario using its ID
    const oldScenario = scenarios.find((s) => s.id === newValues.id);
    if (!oldScenario) {
      console.error('Scenario not found for update:', newValues.id);
      console.groupEnd();
      return;
    }

    // Update the state
    setScenarios((prev) =>
      prev.map((s) => (s.id === newValues.id ? { ...s, ...newValues } : s))
    );

    const oldNamespace = `${projectPath}/${oldScenario.name}`;
    const nameChanged = oldScenario.name !== newValues.name;

    if (nameChanged) {
      const oldFile = path.join(projectPath!, `${oldScenario.name}.json`);
      const newFile = path.join(projectPath!, `${newValues.name}.json`);

      try {
        await fs.rename(oldFile, newFile);
      } catch (err) {
        console.error('File rename failed:', err);
      }

      const newNamespace = `${projectPath}/${newValues.name}`;

      try {
        const newStore = window.electronAPI.StoreAPI.getScenarioStore(newNamespace);

        // Clear any existing data and write the new scenario at top level
        newStore.clear();
        Object.entries(newValues).forEach(([key, value]) => newStore.set(key, value));

        // Update the configStores map
        configStores.current.delete(oldNamespace);
        configStores.current.set(newNamespace, newStore);
      } catch (storeErr) {
        console.error('Failed to create or update new store:', storeErr);
      }
    } else {
      const store = configStores.current.get(oldNamespace);
      if (store) {
        try {
          store.clear();
          Object.entries(newValues).forEach(([key, value]) => store.set(key, value));
        } catch (err) {
          console.error('Failed to update store:', err);
        }
      } else {
        console.warn('Store not found for update.');
      }
    }

    console.groupEnd();
  };

  
  const _deleteScenario = async (scenario: Scenario) => {
    if (confirm(`Oletko varma skenaarion ${scenario.name} poistosta?`)) {
      setOpenScenarioID(null);
      setScenarios(scenarios.filter((s) => s.id !== scenario.id));
      const filePath = path.join(projectPath!, `${scenario.name}.json`);
      try {
        await fs.unlink(filePath);
      } catch (err: any) {
        if (err.code === 'ENOENT') {
          console.warn(`File already deleted: ${filePath}`);
        } else {
          console.error(`Error deleting scenario file:`, err);
        }
      }
      ipcRenderer.send('focus-fix');
    } else {
      ipcRenderer.send('focus-fix');
    }
  };

  const duplicateScenario = (scenario: Scenario) => {
    var duplicatedScenario = structuredClone(scenario);
    //Change ID and rename the scenario to avoid conflicts.
    duplicatedScenario.id = uuidv4();
    duplicatedScenario.name += `(${duplicatedScenario.id.split('-')[0]})`;
    setScenarios(scenarios.concat(duplicatedScenario));
    configStores.current.set(
      duplicatedScenario.id,
      window.electronAPI.StoreAPI.getScenarioStore(duplicatedScenario.name)
    );
  }

  const _runAllActiveScenarios = (activeScenarioIDs: string[]) => {
    const scenariosToRun = scenarios
      .filter((s) => activeScenarioIDs.includes(s.id))
      .sort((a, b) => scenarioIDsToRun.indexOf(a.id) - scenarioIDsToRun.indexOf(b.id));

    // Check required global parameters are set
    if (!emmePythonPath) {
      alert("Python -sijaintia ei ole asetettu!");
      return;
    }
    if (!helmetScriptsPath) {
      alert("Helmet Scripts -kansiota ei ole asetettu, tarkista Asetukset.");
      return;
    }
    if (!projectPath) {
      alert("Projektin kotikansiota ei ole asetettu, tarkista Asetukset.");
      return;
    }
    if (!basedataPath) {
      alert("L\u00E4ht\u00F6datan kansiota ei ole asetettu, tarkista Asetukset.");
      return;
    }
    if (!resultsPath) {
      alert("Tulosdatan kansiota ei ole asetettu, tarkista Asetukset.");
      return;
    }

    // For each active scenario, check required scenario-specific parameters are set
    for (let scenario of scenariosToRun) {
      const namespace = `${projectPath}/${scenario.name}`
      const store = configStores.current.get(namespace); // Use the `get` method of the Map
      if (!store) {
        alert(`Store not found for scenario "${scenario.name}".`);
        return;
      }

      const iterations = store.get('iterations');
      if (!store.get('emme_project_file_path')) {
        alert(`Emme-projektia ei ole valittu skenaariossa "${scenario.name}"`);
        return;
      }
      if (!store.get('forecast_data_folder_path')) {
        alert(`Ennustedata-kansiota ei ole valittu skenaariossa "${scenario.name}"`);
        return;
      }
      if (iterations < 1 || iterations > 99) {
        alert(`Aseta iteraatiot väliltä 1 - 99 skenaariossa "${scenario.name}"`);
        return;
      }
    }

    // Perform UI changes to indicate "initializing run of active scenarios"
    setOpenScenarioID(null); // Close any open scenario configuration
    setLogContents([
      {
        level: "UI-event",
        message: `Initializing run of scenarios: ${scenariosToRun.map((s) => s.name).join(', ')}`,
      },
    ]);
    setLogOpened(true); // Keep log open even after run finishes (or is cancelled)
    setRunningScenarioID(activeScenarioIDs[0]); // Disable controls
    setRunningScenarioIDsQueued(activeScenarioIDs.slice(1));
    signalProjectRunning(true); // Let App-component know too


    ipcRenderer.send(
      'message-from-ui-to-run-scenarios',
      scenariosToRun.map((s) => {
        // Run parameters per each run (enrich with global settings' paths to EMME python & HELMET model system
        return {
          ...s,
          emme_python_path:
            s.overriddenProjectSettings.emmePythonPath !== null &&
            s.overriddenProjectSettings.emmePythonPath !== emmePythonPath
              ? s.overriddenProjectSettings.emmePythonPath
              : emmePythonPath,
          helmet_scripts_path:
            s.overriddenProjectSettings.helmetScriptsPath !== null &&
            s.overriddenProjectSettings.helmetScriptsPath !== helmetScriptsPath
              ? s.overriddenProjectSettings.helmetScriptsPath
              : helmetScriptsPath,
          base_data_folder_path:
            s.overriddenProjectSettings.basedataPath !== null &&
            s.overriddenProjectSettings.basedataPath !== basedataPath
              ? s.overriddenProjectSettings.basedataPath
              : basedataPath,
          results_data_folder_path:
            s.overriddenProjectSettings.resultsPath !== null &&
            s.overriddenProjectSettings.resultsPath !== resultsPath
              ? s.overriddenProjectSettings.resultsPath
              : resultsPath,
          log_level: 'DEBUG',
        };
      })
    );
  };

  const _cancelRunning = () => {
    setLogContents(previousLog => [...previousLog, {level: "UI-event", message: "Cancelling remaining scenarios."}]);
    setRunningScenarioIDsQueued([]);
    ipcRenderer.send('message-from-ui-to-cancel-scenarios');
  };

  const _runCbaScript = () => {
    // Check required global parameters are set
    if (!cbaOptions) {
      alert("CBA-asetuksia ei ole määritetty oikein.");
      return;
    }
    if (!emmePythonPath) {
      alert("Python -sijaintia ei ole asetettu!");
      return;
    }
    if (!helmetScriptsPath) {
      alert("Helmet Scripts -kansiota ei ole asetettu, tarkista Asetukset.");
      return;
    }

    // Check required CBA parameters are set
    if (!cbaOptions.baseline_scenario_path) {
      alert(`Baseline skenaariota ei ole valittu`);
      return;
    }
    if (!cbaOptions.projected_scenario_path) {
      alert(`Projektoitua skenaariota ei ole valittu`);
      return;
    }

    // Perform UI changes to indicate "initializing run of script"
    setOpenScenarioID(null); // Close any open scenario configuration
    setLogContents([
      {
        level: "UI-event",
        message: `Initializing run CBA Script`
      }
    ]);
    setLogOpened(true); // Keep log open even after run finishes (or is cancelled)
    signalProjectRunning(true); // Let App-component know too
    ipcRenderer.send(
      'message-from-ui-to-run-cba-script',
      {
          ...cbaOptions,
          emme_python_path: emmePythonPath,
          helmet_scripts_path: helmetScriptsPath,
          results_path: resultsPath,
      });
  };

  // Electron IPC event listeners
  const onLoggableEvent = (_event:unknown, args:LogEntry) => {
    // console.log('[HelmetProject] received loggable-event:', args);
    setLogContents(previousLog => [...previousLog, args]);
    setLogArgs(args);
  };

  const onScenarioComplete = (_event:unknown, args:any) => {
    setRunningScenarioID(args.next.id);
    setRunningScenarioIDsQueued(runningScenarioIDsQueued.filter((id) => id !== args.completed.id));
    setLogContents(previousLog => [...previousLog, {level: 'NEWLINE', message: ''}]);
  };
  const onAllScenariosComplete = (_event:unknown, _args:unknown) => {
    setRunningScenarioID(null); // Re-enable controls
    setRunningScenarioIDsQueued([]);
    signalProjectRunning(false); // Let App-component know too
  };

  useEffect(() => {
    // Attach Electron IPC event listeners (to worker => UI events)
    ipcRenderer.on('loggable-event', onLoggableEvent);
    ipcRenderer.on('scenario-complete', onScenarioComplete);
    ipcRenderer.on('all-scenarios-complete', onAllScenariosComplete);

    if (!projectPath) {
      return;
    }
    _loadProjectScenarios(projectPath);

    return () => {
      // Detach Electron IPC event listeners
      ipcRenderer.removeListener('loggable-event', onLoggableEvent);
      ipcRenderer.removeListener('scenario-complete', onScenarioComplete);
      ipcRenderer.removeListener('all-scenarios-complete', onAllScenariosComplete);
    }
  }, []);

  useEffect(() => {
    if (projectPath) {
      _loadProjectScenarios(projectPath);
    }
  }, [projectPath]);

  return (
    <div className="Project">

      {/* Panel for primary view and controls */}
      <div className="Project__runtime">
        <Tabs className="tab-container">
          <TabList className="tab-list">
            <Tab selectedClassName="selected-tab" className="tab-list-item tab-item-name"> 
              Skenaariot
            </Tab>
            <Tab selectedClassName="selected-tab" className="tab-list-item tab-item-name">
              CBA
            </Tab>
          </TabList>

          <TabPanel className="runtime-tab">
            <Runtime
              projectPath={projectPath ?? homedir}
              reloadScenarios={() => _loadProjectScenarios(projectPath)}
              scenarios={scenarios}
              scenarioIDsToRun={scenarioIDsToRun}
              runningScenarioID={runningScenarioID}
              openScenarioID={openScenarioID}
              setOpenScenarioID={setOpenScenarioID}
              deleteScenario={(scenario) => {_deleteScenario(scenario)}}
              handleClickScenarioToActive={_handleClickScenarioToActive}
              handleClickNewScenario={_handleClickNewScenario}
              handleClickStartStop={_handleClickStartStop}
              logArgs={logArgs}
              duplicateScenario={duplicateScenario}
              scenarioListHeight={scenarioListHeight}
              setScenarioListHeight={setScenarioListHeight}
            />
          </TabPanel>
          <TabPanel>
            <CostBenefitAnalysis
              resultsPath={resultsPath}
              cbaOptions={cbaOptions}
              setCbaOptions={setCbaOptions}
              runCbaScript={_runCbaScript}
            />
          </TabPanel>
        </Tabs>
      </div>

      {/* Panel for secondary view(s) and controls */}
      <div className="Project__selected-details">
        {/* show log if, either scenario is running, or log is manually opened (outside running) */
          (runningScenarioID || isLogOpened) ?
            <RunLog
              entries={logContents.map((entry, i) => {return {...entry, id: i};})}
              isScenarioRunning={runningScenarioID  ? true : false}
              closeRunLog={() => setLogOpened(false)}
            />
            :
            /* while no scenarios running, and log hidden (log has precedence), allow showing open scenario config */
            openScenarioID !== null ?              
              <HelmetScenario
                projectPath={projectPath ?? homedir}  
                scenario={scenarios.find((s) => s.id === openScenarioID)!}
                updateScenario={_updateScenario}
                closeScenario={() => setOpenScenarioID(null)}
                existingOtherNames={scenarios.filter(s => s.id !== openScenarioID).map(s => s.name)}
                inheritedGlobalProjectSettings={{
                  emmePythonPath: emmePythonPath ?? '',
                  helmetScriptsPath: helmetScriptsPath ?? '',
                  projectPath: projectPath ?? '',
                  basedataPath: basedataPath ?? '',
                  resultsPath: resultsPath ?? '',
                }}
              />
              :
              ""
        }
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        title="Uusi Helmet-skenaario" // Updated title
      >
        <label className="Modal__label">Anna uuden skenaarion nimike:</label> {/* Added label */}
        <input
          className="Modal__input"
          type="text"
          value={newScenarioName}
          onChange={(e) => setNewScenarioName(e.target.value)}
          placeholder="Uuden skenaarion nimi"
          autoFocus
        />
        {modalError && <p className="Modal__error">{modalError}</p>}
      </Modal>
    </div>
  )
};

export default HelmetProject;