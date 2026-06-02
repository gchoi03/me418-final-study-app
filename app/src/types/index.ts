// ─── Core database types ────────────────────────────────────────────────────

export interface MatlabCodeEntry {
  source: string
  description?: string
  code: string
  note?: string
}

export interface IdentifiedParameters {
  [key: string]: string | number | boolean
}

export interface ExperimentalDataRow {
  [key: string]: number | string
}

export interface ExperimentalTable {
  table: string
  data: ExperimentalDataRow[]
}

export interface ReportedClassStructure {
  file: string
  description: string
  constructor: string
  method_set_setpoint: string
  method_set_gains: string
  method_run: string
  source: string
}

export interface CodeCompletionAnswer {
  [key: string]: string
}

export interface CodeCompletionBlank {
  prompt: string
  answer: string
}

export interface CodeCompletionExercise {
  title: string
  instructions?: string
  specification?: string
  skeleton?: string
  blanked_code?: string
  answers?: CodeCompletionAnswer
  blanks?: CodeCompletionBlank[]
  note?: string
}

export interface PythonExercise {
  title: string
  source: string
  description?: string
  described_behavior?: string
  control_law_verbatim?: string
  class_name?: string
  file_name?: string
  methods_from_report?: Record<string, string>
  api_calls_from_report?: Record<string, string>
  files_used?: string[]
  note?: string
  variable_names?: Record<string, string>
}

export interface Lab {
  lab_id: string
  title: string
  date: string
  platform: string
  objectives: string[]
  prelab_questions: string[]
  important_equations: string[]
  matlab_simulink_exercises: string[]
  python_coding_exercises: PythonExercise[]
  matlab_code_verbatim?: MatlabCodeEntry[]
  code_completion_exercises?: CodeCompletionExercise[]
  hardware_procedures: string[]
  controller_tuning_methods: string[]
  common_mistakes: string[]
  likely_exam_concepts: string[]
  // optional rich fields
  identified_parameters?: IdentifiedParameters
  identified_gains_verbatim?: IdentifiedParameters
  experimental_results_tables?: ExperimentalTable[]
  appendix_code_note?: string
  reported_class_structure_verbatim?: ReportedClassStructure
  reported_api_calls_verbatim?: string[]
  reported_control_laws_verbatim?: string[]
  reported_warmup_description_verbatim?: string
  gain_name_note?: string
}

export interface KeyHardware {
  microcontroller: string
  motor: string
  encoder: string
  motor_driver_gain: string
  ide: string
  language: string
}

export interface MotorModel {
  Kss: number
  tau_s: number
  units: string
  TF: string
  steady_state_velocity_rad_s: number
  source: string
}

export interface PendulumModel {
  wn_rad_s: number
  zeta: number
  Kss: number
  TF: string
  MATLAB_snippet_verbatim: string
  source: string
}

export interface GainSet {
  Kp: number
  Ki?: number
  KI?: number
  KD?: number
  source: string
  capitalization_note?: string
}

export interface KeyParameters {
  DC_motor_model: MotorModel
  pendulum_model: PendulumModel
  optimal_PI_velocity_gains: GainSet
  optimal_PID_position_gains: GainSet
}

export interface StudyDatabase {
  course: string
  professor: string
  institution: string
  source_note: string
  labs: Lab[]
  key_hardware: KeyHardware
  key_parameters_identified: KeyParameters
  cross_lab_concepts: Record<string, unknown>
}

// ─── Progress tracking ────────────────────────────────────────────────────────

export type SectionKey =
  | 'objectives'
  | 'equations'
  | 'prelab'
  | 'matlab'
  | 'python'
  | 'hardware'
  | 'tuning'
  | 'mistakes'
  | 'exam'

export interface LabProgress {
  labId: string
  completedSections: SectionKey[]
}

export interface ProgressStore {
  [labId: string]: LabProgress
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchResult {
  labId: string
  labTitle: string
  section: string
  text: string
  score: number
}
