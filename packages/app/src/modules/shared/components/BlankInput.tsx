import React, { forwardRef } from "react";
import { FieldProps } from "formik";
import { TextInput } from "react-native";
import { Input } from "react-native-elements";
import { useTheme } from "react-native-elements";
import { useTranslation } from "react-i18next";

type Props = FieldProps<any> & {
  prefix: React.ReactNode;
  placeholder?: string;
  autoFocus?: boolean;
};

const InputField = ({
  field: { onChange, ...field },
  form: { touched, errors, values, setFieldValue, handleBlur },
  placeholder,
  autoFocus,
}: Props) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const onChangeText = (text: string) => {
    setFieldValue(field.name, text);
  };

  const errorMsg =
    touched[field.name] && errors[field.name]
      ? (errors[field.name] as string)
      : undefined;

  return (
    <Input
      autoFocus={autoFocus}
      multiline
      autoCapitalize="none"
      value={values[field.name]?.toString()}
      placeholder={placeholder}
      errorStyle={{
        color: theme.colors?.error,
        fontSize: 16,
      }}
      errorMessage={errorMsg ? `* ${t(errorMsg)}` : undefined}
      onChangeText={onChangeText}
      onBlur={() => handleBlur(field.name)}
      inputStyle={{ height: 140, marginHorizontal: 0, padding: 0 }}
      inputContainerStyle={{
        marginHorizontal: 0,
        borderBottomColor: errorMsg ? theme.colors?.error : theme.colors?.grey3,
      }}
    />
  );
};
export default InputField;
