import { AbstractControl, ValidatorFn, Validators } from "@angular/forms";

export interface DynamicOptions {
  label: string;
  value: string;
}

type CustomValidators = { banWords: ValidatorFn };
type ValidatorKeys = keyof Omit<typeof Validators & CustomValidators, 'prototype' | 'compose' | 'composeAsync'>;

export interface DynamicControl<T = string> {
  controlType: 'input' | 'select' | 'checkbox' | 'group' | 'array';
  type?: string;
  label: string;
  order?: number;
  value: T | null;
  interactive?: {
    buttonText: string;
    controlTemplate: DynamicControl;
  };
  controlInstance?: AbstractControl<T>
  options?: DynamicOptions[];
  controls?: DynamicFormConfig['controls'] | DynamicControl[];
  validators?: {
    [key in ValidatorKeys]?: unknown
  }
}

export interface DynamicFormConfig {
  description: string;
  controls: {
    [key: string]: DynamicControl
  };
}