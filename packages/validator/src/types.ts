export interface ValidationRule<T = unknown> {
  name: string;
  validate: (value: T) => ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}
