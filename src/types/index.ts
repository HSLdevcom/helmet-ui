// Logging
export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "UI-event" | "NEWLINE";

export interface LogEntry {
  id: number;
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
  React.SetStateAction<CbaOptions>
>;
