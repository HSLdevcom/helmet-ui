// Logging
export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "UI-event" | "NEWLINE";

export interface LogEntry {
  id?: number;
  level: LogLevel;
  message?: string;
  time?: number | string;
  [key: string]: unknown;
}

// CBA
export interface CbaOptions {
  baseline_scenario_path: string;
  projected_scenario_path: string;
  baseline_scenario_2_path?: string;
  projected_scenario_2_path?: string;

  // Allow extra optional keys for future-proofing:
  [key: string]: string | undefined;
}

export type SetCbaOptionsType = React.Dispatch<
  React.SetStateAction<CbaOptions | undefined>
>;

export interface ReadyScenarioLogfile {
  name: string;
  logfile?: string;
  resultsPath: string[];
}

export interface Scenario {
  id: string; // generated with uuidv4
  name: string;
  emme_project_file_path?: string | null;
  first_scenario_id?: string;
  first_matrix_id?: string | null;
  forecast_data_folder_path?: string | null;
  save_matrices_in_emme?: boolean;
  end_assignment_only?: boolean;
  delete_strategy_files?: boolean;
  iterations: number;
  separate_emme_scenarios?: boolean;
  use_fixed_transit_cost?: boolean;
  overriddenProjectSettings: {
    emmePythonPath: string | null;
    helmetScriptsPath: string | null;
    projectPath: string | null;
    basedataPath: string | null;
    resultsPath: string | null;
  };
  runStatus?: RunStatus;
}

export interface RunStatus {
  statusIterationsTotal?: number | null;
  statusIterationsCurrent?: number;
  statusIterationsCompleted?: number;
  statusIterationsFailed?: number;
  statusState?: string | null;
  statusLogfilePath?: string | null;
  statusReadyScenariosLogfiles?: ReadyScenarioLogfile[] | null;
  statusRunStartTime?: string | number | null;
  statusRunFinishTime?: string | number | null;
  demandConvergenceArray?: DemandConvergenceEntry[];
}

export interface DemandConvergenceEntry {
  iteration: number;
  rel_gap?: number;
  max_gap?: number;
  value?: number;
}

export interface LogArgs {
  status?: {
    total?: number;
    current?: number;
    completed?: number;
    failed?: number;
    state?: string;
    log?: string;
    name?: string;
  };
  level?: LogLevel;
  message?: string;
  time?: string | number;
}

export interface ProjectSettings {
  emmePythonPath: string | null;
  helmetScriptsPath: string | null;
  projectPath: string | null;
  basedataPath: string | null;
  resultsPath: string | null;
}

export interface ScenarioStore {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
  delete: (key: string) => void;
  clear: () => void;
}
