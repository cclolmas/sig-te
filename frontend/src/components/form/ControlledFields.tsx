import React from 'react';
import { Controller } from 'react-hook-form';
import type { Control, FieldValues } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface ControlledTextFieldProps<T extends FieldValues = any> {
  name: string;
  control: Control<T>;
  label: string;
  type?: string;
  [key: string]: any;
}

/**
 * Campo de texto controlado para uso com react-hook-form.
 *
 * @param name - Nome do campo
 * @param control - Instância do controle do formulário
 * @param label - Rótulo do campo
 * @param type - Tipo do input (opcional)
 * @example
 * <ControlledTextField name="email" control={control} label="E-mail" />
 */
const ControlledTextField = React.forwardRef<HTMLInputElement, ControlledTextFieldProps>(
  function ControlledTextField({ name, control, label, type = 'text', ...rest }, ref) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            inputRef={ref}
            label={label}
            type={type}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
            {...rest}
          />
        )}
      />
    );
  }
);

interface ControlledSelectProps<T extends FieldValues = any> {
  name: string;
  control: Control<T>;
  label: string;
  options: { value: string; label: string }[];
  [key: string]: any;
}

/**
 * Campo select controlado para uso com react-hook-form.
 *
 * @param name - Nome do campo
 * @param control - Instância do controle do formulário
 * @param label - Rótulo do campo
 * @param options - Opções do select
 * @example
 * <ControlledSelect name="tipo" control={control} label="Tipo" options={[{value: 'a', label: 'A'}]} />
 */
const ControlledSelect = React.forwardRef<HTMLSelectElement, ControlledSelectProps>(
  function ControlledSelect({ name, control, label, options, ...rest }, ref) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Select
            {...field}
            inputRef={ref}
            label={label}
            error={!!fieldState.error}
            fullWidth
            {...rest}
          >
            {options.map((option: { value: string; label: string }) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    );
  }
);

export { ControlledTextField, ControlledSelect };
