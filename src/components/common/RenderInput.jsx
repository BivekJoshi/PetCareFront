import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
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

// Show / hide toggle for password fields.
const passwordToggle = ({ visible, onToggle, onMouseDown } = {}) => ({
  endAdornment: (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={onToggle}
        onMouseDown={onMouseDown}
        edge="end"
        size="small"
      >
        {visible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
      </IconButton>
    </InputAdornment>
  ),
});

/**
 * RenderInput — global, form-agnostic field renderer.
 *
 * One `switch (field.type)` is the single place to add or extend a field type,
 * so every form in the app (auth, profile, pet, booking…) renders from the same
 * declarative config instead of hand-written JSX.
 *
 * field — { name, type, label, placeholder, icon, helperText, options, rows,
 *           inputProps, autoFocus, required, disabled, multiline, size }
 * ctrl  — { value, onChange, onBlur, onEnter, error, helperText, password }
 *           password = { visible, onToggle, onMouseDown } (type "password" only)
 *
 * Supported types: text · email · phone/tel · number · code · password ·
 *   textarea/multiline · dropdown/select · checkbox · switch · radio
 */
export const RenderInput = (field, ctrl = {}) => {
  const {
    name,
    type = "text",
    placeholder,
    icon: Icon,
    options = [],
    inputProps,
    autoFocus,
    required,
    disabled,
    rows,
    size = "medium",
  } = field;

  // Props shared by every TextField-based control.
  const common = {
    name,
    required,
    disabled,
    autoFocus,
    size,
    fullWidth: true,
    variant: "outlined",
    placeholder,
    value: ctrl.value ?? "",
    onChange: ctrl.onChange,
    onBlur: ctrl.onBlur,
    error: Boolean(ctrl.error),
    helperText: ctrl.helperText,
    inputProps,
    onKeyDown: ctrl.onEnter
      ? (e) => {
          if (e.key === "Enter" && !field.multiline) {
            e.preventDefault();
            ctrl.onEnter();
          }
        }
      : undefined,
  };

  switch (type) {
    case "dropdown":
    case "select":
      return (
        <TextField {...common} select>
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      );

    case "password":
      return (
        <TextField
          {...common}
          type={ctrl.password?.visible ? "text" : "password"}
          InputProps={passwordToggle(ctrl.password)}
        />
      );

    case "textarea":
    case "multiline":
      return <TextField {...common} multiline minRows={rows || 3} />;

    case "number":
      return <TextField {...common} type="number" InputProps={trailingIcon(Icon)} />;

    case "checkbox":
      return (
        <FormControl error={Boolean(ctrl.error)} disabled={disabled}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                color="primary"
                name={name}
                checked={Boolean(ctrl.value)}
                onChange={ctrl.onChange}
              />
            }
            label={<Typography sx={{ fontSize: "0.875rem" }}>{field.label}</Typography>}
          />
          {ctrl.helperText && <FormHelperText>{ctrl.helperText}</FormHelperText>}
        </FormControl>
      );

    case "switch":
      return (
        <FormControlLabel
          control={
            <Switch
              color="primary"
              name={name}
              checked={Boolean(ctrl.value)}
              onChange={ctrl.onChange}
              disabled={disabled}
            />
          }
          label={<Typography sx={{ fontSize: "0.875rem" }}>{field.label}</Typography>}
        />
      );

    case "radio":
      return (
        <FormControl error={Boolean(ctrl.error)} disabled={disabled} component="fieldset">
          {field.label && <FormLabel component="legend" sx={labelSx}>{field.label}</FormLabel>}
          <RadioGroup
            row={field.row}
            name={name}
            value={ctrl.value ?? ""}
            onChange={ctrl.onChange}
          >
            {options.map((opt) => (
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

    case "email":
      return <TextField {...common} type="email" InputProps={trailingIcon(Icon)} />;

    case "phone":
    case "tel":
    case "code":
    case "text":
    default:
      return <TextField {...common} type="text" InputProps={trailingIcon(Icon)} />;
  }
};

// Field types that render their own label inline — skip the standalone label.
const SELF_LABELLED = new Set(["checkbox", "switch", "radio"]);

/**
 * formikControl — derive a field's full control object from a Formik bag, so
 * onChange, onBlur (touch), error, helperText and the password toggle are ALL
 * wired dynamically. Nothing per-field is hand-written on the page.
 *
 *   showValues — map of `visibilityKey` -> boolean (password shown?)
 *   toggles    — map of `visibilityKey` -> toggle handler
 */
export const formikControl = (formik, { showValues = {}, toggles = {} } = {}) => (field) => {
  const { name, helperText, visibilityKey } = field;
  const touched = formik.touched[name];
  const error = formik.errors[name];
  const showError = Boolean(touched && error);
  return {
    value: formik.values[name],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur, // marks the field touched → drives onError display
    error: showError,
    helperText: (showError && error) || helperText,
    onEnter: field.submitOnEnter ? formik.submitForm : undefined,
    password: visibilityKey
      ? {
          visible: showValues[visibilityKey],
          onToggle: toggles[visibilityKey],
          onMouseDown: (e) => e.preventDefault(),
        }
      : undefined,
  };
};

/**
 * RenderForm — lay out any list of fields on a responsive grid. Each field's
 * `grid` config (e.g. `{ xs: 12, sm: 6 }`) sets how many columns it spans, so
 * the layout is fully data-driven: two fields side-by-side on wide screens,
 * stacked on mobile, all without touching JSX.
 *
 * Pass EITHER:
 *   formik  — a Formik bag; change / touch / error / helperText are auto-wired
 *             (use `showValues` + `toggles` for password fields), OR
 *   control — `control(field)` returns a custom normalized control object
 *             (for forms not backed by Formik).
 *
 * Set `animate={false}` to drop the per-field entrance motion.
 */
export const RenderForm = ({
  fields,
  formik,
  control,
  showValues,
  toggles,
  spacing = 2.5,
  animate = true,
}) => {
  const resolve = control || formikControl(formik, { showValues, toggles });
  const Item = animate ? MotionBox : Box;
  return (
    <Grid container spacing={spacing}>
      {fields.map((field) => {
        const showLabel = field.label && !SELF_LABELLED.has(field.type);
        return (
          <Grid item key={field.name} xs={12} {...field.grid}>
            <Item variants={animate ? fieldItem : undefined}>
              {showLabel && <Typography sx={labelSx}>{field.label}</Typography>}
              {RenderInput(field, resolve(field))}
            </Item>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default RenderInput;
