import React, { forwardRef } from "react";
import { FieldProps } from "formik";
import { TextInput, StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import { useTheme } from "react-native-elements";
import { useTranslation } from "react-i18next";

type Props = FieldProps<any> & {
  prefix: React.ReactNode;
  placeholder?: string;
  autoFocus?: boolean;
  multiline?: boolean;
  label?: string;
  leftIcon?: () => JSX.Element;
  multilineHeight?: number;
};

const InputField = ({
  field: { onChange, ...field },
  form: { touched, errors, values, setFieldValue, handleBlur },
  placeholder,
  autoFocus,
  multiline,
  label,
  leftIcon,
  multilineHeight,
}: Props) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const onChangeText = (text: string) => {
    setFieldValue(field.name, text);
  };

  const inputStyle = () => {
    return multiline ? styles.multilineInput : styles.singlelineInput;
  };

  const errorMsg =
    touched[field.name] && errors[field.name]
      ? (errors[field.name] as string)
      : undefined;

  // const multilineH = multilineHeight ? multilineHeight : 140;
  return (
    <Input
      autoFocus={autoFocus}
      multiline={multiline}
      autoCapitalize="none"
      label={label}
      labelStyle={{ color: theme.colors?.black }}
      leftIcon={leftIcon}
      leftIconContainerStyle={{ minWidth: 30, marginRight: 8 }}
      containerStyle={{ justifyContent: "flex-start" }}
      value={values[field.name]?.toString()}
      placeholder={placeholder}
      errorStyle={{
        color: theme.colors?.error,
        fontSize: 16,
      }}
      errorMessage={errorMsg ? `* ${t(errorMsg)}` : undefined}
      onChangeText={onChangeText}
      onBlur={() => handleBlur(field.name)}
      inputStyle={{
        marginHorizontal: 0,
        padding: 0,
      }}
      inputContainerStyle={[
        {
          borderBottomColor: errorMsg
            ? theme.colors?.error
            : theme.colors?.grey3,
        },
        inputStyle(),
      ]}
    />
  );
};
export default InputField;

const styles = StyleSheet.create({
  singlelineInput: {
    marginHorizontal: 0,
    paddingVertical: 3,
    height: 36,
  },
  multilineInput: {
    marginHorizontal: 0,
    paddingVertical: 3,
    minHeight: 36,
  },
});
