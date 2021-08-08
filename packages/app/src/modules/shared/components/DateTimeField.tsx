import * as React from "react";
import { FieldProps } from "formik";
import { Input, useTheme, Icon } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

const errorStyle = {
  color: "red",
  fontSize: 16,
};

const DateTimeField: React.FC<
  FieldProps<any> & {
    prefix: React.ReactNode;
    label?: string;
    placeholder?: string;
    style: any;
    mode: "DATE" | "TIME" | "DATETIME";
    leftIcon?: () => JSX.Element;
    makeContent?: (value: string) => string;
  }
> = ({
  field: { onChange, ...field },
  form: { touched, errors, values, setFieldValue, handleBlur },
  mode,
  label,
  placeholder,
  style,
  leftIcon,
  makeContent,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [show, setShow] = React.useState(false);

  const hideDatePicker = () => {
    setShow(false);
  };

  const handleConfirm = (date: any) => {
    hideDatePicker();
    //setDate(date);
    const d = date as Date;
    if (mode == "DATE") {
      d.setHours(0, 0, 0, 0);
    }
    d.setFullYear;
    setFieldValue(field.name, d.getTime());
  };
  const initialDate = () => {
    return new Date(values[field.name] || Date.now()).getTime();
  };

  const errorMsg =
    touched[field.name] && errors[field.name]
      ? (errors[field.name] as string)
      : undefined;

  return (
    <TouchableOpacity
      style={{ width: "100%" }}
      onPress={() => {
        setShow(true);
      }}
    >
      <DateTimePickerModal
        date={new Date(initialDate())}
        isVisible={show}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <Input
        pointerEvents="none"
        disabled
        disabledInputStyle={{
          color: theme.colors?.black,
          opacity: 1,
        }}
        leftIcon={leftIcon}
        leftIconContainerStyle={{ minWidth: 30, marginRight: 8 }}
        labelStyle={{ color: theme.colors?.grey0 }}
        errorStyle={errorStyle}
        errorMessage={errorMsg ? `* ${t(errorMsg)}` : undefined}
        value={
          makeContent
            ? makeContent(formatDate(values[field.name]))
            : formatDate(values[field.name])
        }
        label={label}
        placeholder={placeholder}
        containerStyle={{ paddingHorizontal: 0, ...style }}
        inputContainerStyle={{
          borderBottomColor: errorMsg
            ? theme.colors?.error
            : theme.colors?.grey3,
          height: 36,
        }}
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

export default DateTimeField;
