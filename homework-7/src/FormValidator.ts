import { FormValidatorConfiguration } from "./FormValidatorConfiguration";
import { ValidatorFunction } from "./ValidatorFunction";
import { composeValidators } from "./composeValidators";
import { ValidatorResult } from "./ValidatorResult";
import { createElementForm } from "./createElementForm";

export type FormValidateResult<Data extends object> = Partial<{
  [P in keyof Data]: NonNullable<ValidatorResult>;
}>;

export class FormValidator<Data extends object> {
  readonly #validationMap: Map<string, ValidatorFunction<unknown>>;

  constructor(configuration: FormValidatorConfiguration<Data>) {
    this.#validationMap = new Map();

    for (const [key, value] of Object.entries(configuration)) {
      this.#validationMap.set(
        key,
        Array.isArray(value)
          ? composeValidators(...(value as ValidatorFunction<unknown>[]))
          : (value as ValidatorFunction<unknown>)
      );
    }
  }

  validate(data: Data): FormValidateResult<Data> {
    const errors: FormValidateResult<Data>[] = [];
    const validateForm: string[] = [];

    for (const [propertyName, value] of Object.entries(data)) {
      const validator = this.#validationMap.get(propertyName);

      if (validator) {
        const result = validator(value);

        if (result) {
          errors.push({ [propertyName]: result } as FormValidateResult<Data>);
        } else {
          validateForm.push(value);
        }
      }
    }

    validateForm.push(" ");

    return errors.length
      ? Object.assign({}, ...errors)
      : createElementForm(...validateForm);
  }
}
