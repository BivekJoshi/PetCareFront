import { useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const EASE = [0.22, 1, 0.36, 1];

// Per-field entrance — inherits a parent form's staggered "show" orchestration.
export const fieldItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export const labelSx = {
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "text.primary",
  mb: 0.75,
};

/* ------------------------------------------------------------------ *
 *  Shared helpers
 * ------------------------------------------------------------------ */

// Trailing decorative icon, when a field configures one.
const trailingIcon = (Icon) =>
  Icon
    ? {
        endAdornment: (
          <InputAdornment position="end">
            <Icon fontSize="small" sx={{ color: "text.disabled" }} />
          </InputAdornment>
        ),
      }
    : undefined;

// Resolve a config value that may be a static value or a `(values) => value` fn.
const resolveDynamic = (val, values) =>
  typeof val === "function" ? val(values) : val;

// Props every TextField-based renderer shares. Keeps each renderer tiny.
const baseProps = (field, ctrl) => ({
  name: field.name,
  required: field.required,
  disabled: field.disabled,
  autoFocus: field.autoFocus,
  size: field.size || "medium",
  fullWidth: true,
  variant: field.variant || "outlined",
  placeholder: field.placeholder,
  value: ctrl.value ?? "",
  onChange: ctrl.onChange,
  onBlur: ctrl.onBlur,
  error: Boolean(ctrl.error),
  helperText: ctrl.helperText,
  inputProps: field.inputProps,
  onKeyDown:
    ctrl.onEnter && !field.multiline
      ? (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            ctrl.onEnter();
          }
        }
      : undefined,
  ...field.props, // per-field passthrough to the underlying MUI component
});

/* ------------------------------------------------------------------ *
 *  Built-in field renderers — each is a real component, so it can own
 *  local state (e.g. password visibility). Register more with
 *  `registerFieldType()` instead of editing this file.
 * ------------------------------------------------------------------ */

const TextInput = ({ field, ctrl }) => (
  <TextField {...baseProps(field, ctrl)} type="text" InputProps={trailingIcon(field.icon)} />
);

const EmailInput = ({ field, ctrl }) => (
  <TextField {...baseProps(field, ctrl)} type="email" InputProps={trailingIcon(field.icon)} />
);

const NumberInput = ({ field, ctrl }) => (
  <TextField {...baseProps(field, ctrl)} type="number" InputProps={trailingIcon(field.icon)} />
);

const TextareaInput = ({ field, ctrl }) => (
  <TextField {...baseProps(field, ctrl)} multiline minRows={field.rows || 3} />
);

const PasswordInput = ({ field, ctrl }) => {
  const [show, setShow] = useState(false); // self-contained: pages never wire this
  return (
    <TextField
      {...baseProps(field, ctrl)}
      type={show ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShow((s) => !s)}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
              size="small"
            >
              {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

const SelectInput = ({ field, ctrl }) => (
  <TextField {...baseProps(field, ctrl)} select>
    {(field.options || []).map((opt) => (
      <MenuItem key={opt.value} value={opt.value}>
        {opt.label}
      </MenuItem>
    ))}
  </TextField>
);

const CheckboxInput = ({ field, ctrl }) => (
  <FormControl error={Boolean(ctrl.error)} disabled={field.disabled}>
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          color="primary"
          name={field.name}
          checked={Boolean(ctrl.value)}
          onChange={ctrl.onChange}
        />
      }
      label={<Typography sx={{ fontSize: "0.875rem" }}>{field.label}</Typography>}
    />
    {ctrl.helperText && <FormHelperText>{ctrl.helperText}</FormHelperText>}
  </FormControl>
);

const SwitchInput = ({ field, ctrl }) => (
  <FormControlLabel
    control={
      <Switch
        color="primary"
        name={field.name}
        checked={Boolean(ctrl.value)}
        onChange={ctrl.onChange}
        disabled={field.disabled}
      />
    }
    label={<Typography sx={{ fontSize: "0.875rem" }}>{field.label}</Typography>}
  />
);

const RadioInput = ({ field, ctrl }) => (
  <FormControl error={Boolean(ctrl.error)} disabled={field.disabled} component="fieldset">
    {field.label && (
      <FormLabel component="legend" sx={labelSx}>
        {field.label}
      </FormLabel>
    )}
    <RadioGroup row={field.row} name={field.name} value={ctrl.value ?? ""} onChange={ctrl.onChange}>
      {(field.options || []).map((opt) => (
        <FormControlLabel
          key={opt.value}
          value={opt.value}
          control={<Radio size="small" />}
          label={opt.label}
        />
      ))}
    </RadioGroup>
    {ctrl.helperText && <FormHelperText>{ctrl.helperText}</FormHelperText>}
  </FormControl>
);

/* ------------------------------------------------------------------ *
 *  Field-type registry — the extension point. `field.type` looks up a
 *  renderer here; unknown types fall back to text.
 * ------------------------------------------------------------------ */
const FIELD_TYPES = {
  text: TextInput,
  email: EmailInput,
  phone: TextInput,
  tel: TextInput,
  code: TextInput,
  number: NumberInput,
  password: PasswordInput,
  textarea: TextareaInput,
  multiline: TextareaInput,
  select: SelectInput,
  dropdown: SelectInput,
  checkbox: CheckboxInput,
  switch: SwitchInput,
  radio: RadioInput,
};

// Field types that render their own label inline — skip the standalone label.
const SELF_LABELLED = new Set(["checkbox", "switch", "radio"]);

/**
 * Register (or override) a field type app-wide. e.g.
 *   registerFieldType("color", ColorInput)
 * then any config can use `{ type: "color", ... }`.
 */
export const registerFieldType = (type, component) => {
  FIELD_TYPES[type] = component;
};

/**
 * RenderInput — dispatch a single field to its renderer. `field.render` lets a
 * config supply a one-off custom component without touching the registry.
 */
export const RenderInput = ({ field, ctrl }) => {
  const Renderer = field.render || FIELD_TYPES[field.type] || FIELD_TYPES.text;
  return <Renderer field={field} ctrl={ctrl} />;
};

/* ------------------------------------------------------------------ *
 *  Adapters — turn a form library's state into the `control(field)`
 *  contract: { value, onChange, onBlur, error, helperText, onEnter, setValue }
 * ------------------------------------------------------------------ */

/**
 * formikControl — derive every field's control object from a Formik bag, so
 * onChange, onBlur (touch), error and helperText are ALL wired dynamically.
 * Password visibility is handled inside the field itself, so nothing extra is
 * threaded from the page.
 */
export const formikControl = (formik) => (field) => {
  const { name, helperText } = field;
  const touched = formik.touched[name];
  const error = formik.errors[name];
  const showError = Boolean(touched && error);
  return {
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: showError,
    helperText: (showError && error) || helperText,
    onEnter: field.submitOnEnter ? formik.submitForm : undefined,
    setValue: (v) => formik.setFieldValue(name, v),
  };
};

/**
 * controlledControl — adapter for plain useState forms. Pass a map of
 *   name -> { value, set, error, onEnter }
 * and it produces the same control contract.
 */
export const controlledControl = (map) => (field) => {
  const entry = map[field.name] || {};
  return {
    value: entry.value,
    onChange: (e) =>
      entry.set?.(e?.target?.type === "checkbox" ? e.target.checked : e?.target?.value ?? e),
    onBlur: entry.onBlur,
    error: Boolean(entry.error),
    helperText: entry.error || field.helperText,
    onEnter: field.submitOnEnter ? entry.onEnter : undefined,
    setValue: entry.set,
  };
};

/* ------------------------------------------------------------------ *
 *  RenderForm — the responsive, data-driven layout
 * ------------------------------------------------------------------ */

// Normalize a field's column config into a responsive `gridColumn` value for a
// 12-column CSS grid. Accepts a `span` shorthand or a full `grid` breakpoint
// object ({ xs: 12, sm: 6 }). CSS grid has no negative margins, so fields stay
// flush-left with the rest of the form (no spacing-induced shift).
const columnFor = (field) => {
  const toSpan = (n) => `span ${n}`;
  if (field.grid) {
    return Object.fromEntries(
      Object.entries(field.grid).map(([bp, n]) => [bp, toSpan(n)])
    );
  }
  if (field.span) return { xs: "span 12", sm: toSpan(field.span) };
  return { xs: "span 12" };
};

/**
 * RenderForm — lay out a list of fields on a responsive grid, fully data-driven.
 *
 * Source (pick one):
 *   formik  — a Formik bag (change / touch / error / helperText auto-wired), OR
 *   control — a `control(field)` adapter (e.g. from `controlledControl`).
 *
 * Dynamic per-field config:
 *   span | grid   — column width  ({ xs:12, sm:6 } or span:6)
 *   showIf(vals)  — render only when it returns true
 *   disabled(vals)/required — static or `(values) => boolean`
 *   render        — custom one-off component
 *
 * `animate={false}` drops the entrance motion. `values` overrides the value
 * source used for showIf/disabled (defaults to formik.values).
 */
export const RenderForm = ({
  fields,
  formik,
  control,
  values,
  spacing = 2.5,
  animate = true,
}) => {
  const resolve = control || formikControl(formik);
  const formValues = values || formik?.values || {};
  const Item = animate ? MotionBox : Box;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: spacing,
        width: "100%",
      }}
    >
      {fields.map((raw) => {
        // Conditional visibility.
        if (raw.showIf && !raw.showIf(formValues)) return null;

        // Resolve dynamic per-field flags against current form values.
        const field = {
          ...raw,
          disabled: resolveDynamic(raw.disabled, formValues),
          required: resolveDynamic(raw.required, formValues),
        };

        const showLabel = field.label && !SELF_LABELLED.has(field.type);
        return (
          <Item
            key={field.name}
            variants={animate ? fieldItem : undefined}
            sx={{ gridColumn: columnFor(field), minWidth: 0 }}
          >
            {showLabel && (
              <Typography sx={labelSx}>
                {field.label}
                {field.required && <Box component="span" sx={{ color: "error.main", ml: 0.25 }}>*</Box>}
              </Typography>
            )}
            <RenderInput field={field} ctrl={resolve(field)} />
          </Item>
        );
      })}
    </Box>
  );
};

export default RenderInput;
