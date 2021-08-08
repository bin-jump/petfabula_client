import * as React from "react";
import { FieldProps } from "formik";
import { Input, useTheme, Icon } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

const errorStyle = {
  color: "red",
  fontSize: 16,
};

const ButtonInputField: React.FC<
  FieldProps<any> & {
    prefix: React.ReactNode;
    label?: string;
    placeholder?: string;
    style: any;
    multiline?: boolean;
    onPress?: () => void;
    leftIcon?: () => JSX.Element;
    makeContent?: (value: string) => string;
  }
> = ({
  field: { onChange, ...field },
  form: { touched, errors, values, setFieldValue, handleBlur },
  label,
  placeholder,
  style,
  multiline,
  onPress,
  leftIcon,
  makeContent,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const inputStyle = () => {
    return multiline ? styles.multilineInput : styles.singlelineInput;
  };

  const errorMsg =
    touched[field.name] && errors[field.name]
      ? (errors[field.name] as string)
      : undefined;

  return (
    <TouchableOpacity
      style={{ width: "100%" }}
      onPress={() => {
        if (onPress) {
          onPress();
        }
      }}
    >
      <Input
        pointerEvents="none"
        disabled
        disabledInputStyle={{
          color: theme.colors?.black,
          opacity: 1,
        }}
        multiline={multiline}
        leftIcon={leftIcon}
        leftIconContainerStyle={{ minWidth: 30, marginRight: 8 }}
        labelStyle={{ color: theme.colors?.black }}
        errorStyle={errorStyle}
        errorMessage={errorMsg ? `* ${t(errorMsg)}` : undefined}
        value={
          makeContent
            ? makeContent(values[field.name])
            : `${values[field.name]}`
        }
        label={label}
        placeholder={placeholder}
        containerStyle={{ paddingHorizontal: 0, ...style }}
        inputContainerStyle={[
          {
            minHeight: 36,
            borderBottomColor: errorMsg
              ? theme.colors?.error
              : theme.colors?.grey3,
          },
          inputStyle(),
        ]}
        autoCapitalize="none"
        onBlur={() => handleBlur(field.name)}
        rightIcon={
          <Icon
            type="antdesign"
            name="right"
            color={theme.colors?.grey1}
            size={18}
          />
        }
      />
    </TouchableOpacity>
  );
};

export default ButtonInputField;

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
