import type { ValidationResult, ValidationError } from "./types";

export function required(field: string, value: unknown): ValidationError | null {
  if (value === undefined || value === null || value === "") {
    return { field, message: `${field} is required`, code: "REQUIRED" };
  }
  return null;
}

export function minLength(field: string, value: string, min: number): ValidationError | null {
  if (value.length < min) {
    return { field, message: `${field} must be at least ${min} characters`, code: "MIN_LENGTH" };
  }
  return null;
}

export function maxLength(field: string, value: string, max: number): ValidationError | null {
  if (value.length > max) {
    return { field, message: `${field} must be at most ${max} characters`, code: "MAX_LENGTH" };
  }
  return null;
}

export function isEmail(field: string, value: string): ValidationError | null {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
  if (!emailRegex.test(value)) {
    return { field, message: `${field} must be a valid email`, code: "INVALID_EMAIL" };
  }
  return null;
}

export function isPositive(field: string, value: number): ValidationError | null {
  if (value <= 0) {
    return { field, message: `${field} must be positive`, code: "NOT_POSITIVE" };
  }
  return null;
}

export function validate(checks: (ValidationError | null)[]): ValidationResult {
  const errors = checks.filter((e): e is ValidationError => e !== null);
  return { valid: errors.length === 0, errors };
}
