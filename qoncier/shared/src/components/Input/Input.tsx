import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { theme } from '../../theme';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  containerStyle,
  inputStyle,
  labelStyle,
  testID,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyles = [
    styles.container,
    containerStyle,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    styles[variant],
    styles[size],
    isFocused && styles.focused,
    error && styles.error,
  ];

  const inputStyles = [
    styles.input,
    styles[`${size}Input` as keyof typeof styles],
    inputStyle,
  ];

  const labelStyles = [
    styles.label,
    styles[`${size}Label` as keyof typeof styles],
    error && styles.errorLabel,
    labelStyle,
  ];

  return (
    <View style={containerStyles} testID={testID}>
      {label && <Text style={labelStyles}>{label}</Text>}
      <View style={inputContainerStyles}>
        <TextInput
          style={inputStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.gray[400]}
          {...textInputProps}
        />
      </View>
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  inputContainer: {
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Variants
  default: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
  },
  filled: {
    backgroundColor: theme.colors.gray[50],
    borderWidth: 0,
  },
  
  // Sizes
  sm: {
    minHeight: 36,
  },
  md: {
    minHeight: 44,
  },
  lg: {
    minHeight: 52,
  },
  
  input: {
    flex: 1,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.md,
  },
  
  // Size-specific input styles
  smInput: {
    fontSize: theme.typography.fontSize.sm,
    paddingVertical: theme.spacing.sm,
  },
  mdInput: {
    fontSize: theme.typography.fontSize.base,
    paddingVertical: theme.spacing.md,
  },
  lgInput: {
    fontSize: theme.typography.fontSize.lg,
    paddingVertical: theme.spacing.lg,
  },
  
  // Size-specific label styles
  smLabel: {
    fontSize: theme.typography.fontSize.xs,
  },
  mdLabel: {
    fontSize: theme.typography.fontSize.sm,
  },
  lgLabel: {
    fontSize: theme.typography.fontSize.base,
  },
  
  // Focus and error states
  focused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: theme.colors.danger,
  },
  errorLabel: {
    color: theme.colors.danger,
  },
  errorText: {
    color: theme.colors.danger,
  },
  
  helperText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
});

export default Input;
