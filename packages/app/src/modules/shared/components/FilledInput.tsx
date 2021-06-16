import * as React from "react";
import { FieldProps } from "formik";
import { Input, ThemeContext } from "react-native-elements";
import { Icon } from "react-native-elements";
import { useTranslation } from "react-i18next";

const resolveIcon = (inputType: "email" | "name", theme: any) => {
  if (inputType == "email") {
    return (
      <Icon
        style={{ marginRight: 3 }}
        type="antdesign"
        name="mail"
        color={theme.colors?.grey1}
        size={22}
      />
    );
  }
  return (
    <Icon
      style={{ marginRight: 3 }}
      type="antdesign"
      name="user"
      color={theme.colors?.grey1}
      size={22}
    />
  );
};

const InputField: React.FC<
  FieldProps<any> & {
    prefix: React.ReactNode;
    placeholder?: string;
    inputType: "email" | "name";
    autoFocus?: boolean;
  }
> = ({
  field: { onChange, ...field },
  form: { touched, errors, values, setFieldValue, handleBlur },
  placeholder,
  inputType,
  autoFocus,
}) => {
  const { t } = useTranslation();
  const { theme } = React.useContext(ThemeContext);

  const onChangeText = (text: string) => {
    setFieldValue(field.name, text);
  };

  const errorMsg =
    touched[field.name] && errors[field.name]
      ? (errors[field.name] as string)
      : undefined;

  return (
    <Input
      //   textAlignVertical="top"
      autoFocus={autoFocus}
      autoCapitalize="none"
      value={values[field.name]?.toString()}
      placeholder={placeholder}
      containerStyle={{
        paddingHorizontal: 0,
        minHeight: 90,
      }}
      rightIcon={
        errorMsg ? (
          <Icon
            containerStyle={{ marginLeft: 6 }}
            type="antdesign"
            name="exclamationcircleo"
            size={16}
            color={theme.colors?.error}
          />
        ) : undefined
      }
      errorStyle={{
        color: theme.colors?.error,
        fontSize: 16,
      }}
      errorMessage={errorMsg ? `* ${t(errorMsg)}` : undefined}
      onChangeText={onChangeText}
      onBlur={() => handleBlur(field.name)}
      inputStyle={{ height: 60, marginHorizontal: 0, padding: 0 }}
      leftIcon={resolveIcon(inputType, theme)}
      inputContainerStyle={[
        {
          marginHorizontal: 0,
          paddingHorizontal: 16,
          backgroundColor: theme.colors?.grey5,
          borderRadius: 10,
          borderBottomColor: "transparent",
        },
        // errorMsg
        //   ? {
        //       borderWidth: 1,
        //       borderColor: "red",
        //       borderBottomColor: "red",
        //     }
        //   : {},
      ]}
    />
  );
};

export default InputField;
