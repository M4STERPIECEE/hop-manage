import type { AnyFieldApi } from "@tanstack/react-form";
import { createFormHook } from "@tanstack/react-form";
import { CheckboxField } from "./checkbox-field";
import { ComboboxField } from "./combobox-field";
import { DateField } from "./date-field";
import { fieldContext, formContext } from "./form-context";
import { InputField } from "./input-field";
import { NumberField } from "./number-field";
import { RadioField } from "./radio-field";
import { SelectField } from "./select-field";
import { SubmitButton } from "./submit-button";
import { TextareaField } from "./textarea-field";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputField,
    NumberField,
    DateField,
    SelectField,
    ComboboxField,
    CheckboxField,
    RadioField,
    TextareaField,
  },
  formComponents: { SubmitButton },
});

export type AppFieldApi = AnyFieldApi & {
  InputField: typeof InputField;
  SelectField: typeof SelectField;
  DateField: typeof DateField;
  NumberField: typeof NumberField;
  ComboboxField: typeof ComboboxField;
  CheckboxField: typeof CheckboxField;
  RadioField: typeof RadioField;
  TextareaField: typeof TextareaField;
};
