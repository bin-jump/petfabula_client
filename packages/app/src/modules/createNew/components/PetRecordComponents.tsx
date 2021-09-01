import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FieldProps } from "formik";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Input,
  useTheme,
  Icon,
  Text,
  Divider,
  Button,
  Overlay,
} from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTranslation } from "react-i18next";
import { Pet } from "@petfabula/common";
import { Avatar } from "../../shared";

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

function formatTime(date: Date | undefined) {
  if (!date) {
    return "";
  }
  var d = new Date(date),
    hour = "" + d.getHours(),
    minute = "" + d.getMinutes();

  if (hour.length < 2) hour = "0" + hour;
  if (minute.length < 2) minute = "0" + minute;

  return [hour, minute].join(":");
}

const errorStyle = {
  color: "red",
  fontSize: 16,
};

export const RecordDateField: React.FC<
  FieldProps<any> & {
    prefix: React.ReactNode;
    label?: string;
    placeholder?: string;
    leftIcon?: () => JSX.Element;
  }
> = ({
  field: { onChange, ...field },
  form: { touched, errors, values, setFieldValue, handleBlur },
  label,
  placeholder,
  leftIcon,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [show, setShow] = React.useState(false);

  const hideDatePicker = () => {
    setShow(false);
  };

  const handleConfirm = (date: any) => {
    hideDatePicker();
    const d = date as Date;
    // d.setHours(0, 0, 0, 0);
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
        locale="ja_JP"
        confirmTextIOS={t("common.confirm")}
        cancelTextIOS={t("common.cancel")}
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
        labelStyle={{ color: theme.colors?.grey0 }}
        errorStyle={errorStyle}
        errorMessage={errorMsg ? `* ${t(errorMsg)}` : undefined}
        value={formatDate(values[field.name])}
        label={label}
        placeholder={placeholder}
        containerStyle={{
          paddingHorizontal: 0,
        }}
        inputContainerStyle={{
          height: 24,
          width: 180,
          borderBottomWidth: 0,
        }}
        autoCapitalize="none"
        onBlur={() => handleBlur(field.name)}
        rightIcon={
          <Icon
            type="entypo"
            name="chevron-right"
            color={theme.colors?.grey3}
            size={24}
          />
        }
      />
    </TouchableOpacity>
  );
};

export const RecordTimeField: React.FC<
  FieldProps<any> & {
    prefix: React.ReactNode;
    label?: string;
    placeholder?: string;
    leftIcon?: () => JSX.Element;
  }
> = ({
  field: { onChange, ...field },
  form: { touched, errors, values, setFieldValue, handleBlur },
  label,
  placeholder,
  leftIcon,
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
        confirmTextIOS={t("common.confirm")}
        cancelTextIOS={t("common.cancel")}
        date={new Date(initialDate())}
        isVisible={show}
        mode="time"
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
        labelStyle={{ color: theme.colors?.grey0 }}
        errorStyle={errorStyle}
        errorMessage={errorMsg ? `* ${t(errorMsg)}` : undefined}
        value={formatTime(values[field.name])}
        label={label}
        placeholder={placeholder}
        containerStyle={{
          paddingHorizontal: 0,
        }}
        inputContainerStyle={{
          borderBottomWidth: 0,
          width: 180,
          height: 30,
        }}
        autoCapitalize="none"
        onBlur={() => handleBlur(field.name)}
        rightIcon={
          <Icon
            type="entypo"
            name="chevron-right"
            color={theme.colors?.grey3}
            size={24}
          />
        }
      />
    </TouchableOpacity>
  );
};

export const RecordFilledInputField: React.FC<
  FieldProps<any> & {
    prefix: React.ReactNode;
    placeholder?: string;
    multiline: boolean;
    autoFocus?: boolean;
    title?: string;
  }
> = ({
  field: { onChange, ...field },
  form: { touched, errors, values, setFieldValue, handleBlur },
  placeholder,
  multiline,
  autoFocus,
  title,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const { top } = useSafeAreaInsets();

  const toggleOverlay = () => {
    setVisible(!visible);
  };

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

  return (
    <View style={{ width: "100%" }}>
      <Overlay
        fullScreen
        transparent
        animationType="slide"
        isVisible={visible}
        onBackdropPress={toggleOverlay}
      >
        <View>
          <View style={{ height: top }}></View>
          <View
            style={{
              flexDirection: "row",
              height: 50,
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 26,
            }}
          >
            <View></View>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>{title}</Text>
            </View>
            <TouchableOpacity onPress={toggleOverlay}>
              {/* <Text style={{ fontSize: 20 }}>{t("common.done")}</Text> */}
            </TouchableOpacity>
          </View>
          <Divider />
          <View style={{ marginTop: 12 }}></View>
          <Input
            //   textAlignVertical="top"
            multiline={multiline}
            autoFocus={true}
            autoCapitalize="none"
            value={values[field.name]?.toString()}
            placeholder={placeholder}
            containerStyle={{
              padding: 0,
              margin: 0,
              // height: 56,
            }}
            errorStyle={{
              color: theme.colors?.error,
              fontSize: 16,
            }}
            // errorMessage={errorMsg ? `* ${t(errorMsg)}` : undefined}
            onChangeText={onChangeText}
            onBlur={() => handleBlur(field.name)}
            inputStyle={[{ margin: 0, padding: 0 }, inputStyle()]}
            inputContainerStyle={[
              {
                paddingHorizontal: 10,
                margin: 0,
                // backgroundColor: theme.colors?.grey5,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: theme.colors?.grey4,
              },
            ]}
          />
          <Button title={t("common.done")} onPress={toggleOverlay} />
        </View>
      </Overlay>

      <TouchableOpacity
        style={{ width: "100%" }}
        onPress={() => {
          toggleOverlay();
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
          autoFocus={autoFocus}
          autoCapitalize="none"
          value={values[field.name]?.toString()}
          placeholder={placeholder}
          containerStyle={{
            padding: 0,
            margin: 0,
            // height: 56,
          }}
          errorStyle={{
            color: theme.colors?.error,
            fontSize: 16,
          }}
          errorMessage={errorMsg ? `* ${t(errorMsg)}` : undefined}
          onChangeText={onChangeText}
          onBlur={() => handleBlur(field.name)}
          inputStyle={[{ margin: 0, padding: 0 }, inputStyle()]}
          inputContainerStyle={[
            {
              paddingHorizontal: 10,
              paddingVertical: 6,
              backgroundColor: theme.colors?.grey5,
              borderRadius: 10,
              borderBottomColor: "transparent",
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

export const RecordBlankInputField: React.FC<
  FieldProps<any> & {
    prefix: React.ReactNode;
    placeholder?: string;
    autoFocus?: boolean;
    width?: number;
    keyboardType?: "numeric" | "number-pad";
    rightIcon?: () => JSX.Element;
  }
> = ({
  field: { onChange, ...field },
  form: { touched, errors, values, setFieldValue, handleBlur },
  placeholder,
  autoFocus,
  width,
  keyboardType,
  rightIcon,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const onChangeText = (text: string) => {
    setFieldValue(field.name, text);
  };

  const keyType = keyboardType ? keyboardType : "default";
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
        padding: 0,
        margin: 0,
      }}
      keyboardType={keyType}
      rightIcon={rightIcon}
      errorStyle={{
        color: theme.colors?.error,
        fontSize: 16,
      }}
      errorMessage={errorMsg ? `* ${t(errorMsg)}` : undefined}
      onChangeText={onChangeText}
      onBlur={() => handleBlur(field.name)}
      inputStyle={{
        height: 40,
        margin: 0,
        padding: 0,
      }}
      inputContainerStyle={[
        {
          width: width ? width : "100%",
          // paddingHorizontal: 10,
          margin: 0,
          borderRadius: 10,
          // borderBottomColor: "transparent",
        },
      ]}
    />
  );
};

export const PetSelector: React.FC<
  FieldProps<any> & {
    pet: Pet | null;
    disabled?: boolean;
    onPress?: () => void;
  }
> = ({
  disabled,
  field: { onChange, ...field },
  form: { touched, errors, values, setFieldValue, handleBlur },
  pet,
  onPress,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const errorMsg =
    touched[field.name] && errors[field.name]
      ? (errors[field.name] as string)
      : undefined;

  return (
    <TouchableOpacity
      disabled={disabled}
      style={{ width: "100%" }}
      onPress={onPress}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          h4
          h4Style={{
            color: disabled ? theme.colors?.grey2 : theme.colors?.black,
          }}
        >
          {t("pet.record.selectPet")}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {pet ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <Avatar source={{ uri: pet.photo }} size={40} iconType="PET" />
                <Text style={{ marginLeft: 12, fontSize: 20 }}>{pet.name}</Text>
              </View>
            </View>
          ) : (
            <View>
              <Text style={{ color: theme.colors?.grey3 }}>{}</Text>
            </View>
          )}
          <Icon
            type="entypo"
            name="chevron-right"
            size={24}
            color={theme.colors?.grey3}
          />
        </View>
      </View>
      <Text style={errorStyle}>{errorMsg ? `* ${t(errorMsg)}` : ``}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  singlelineInput: {
    marginHorizontal: 0,
    paddingVertical: 3,
    height: 40,
  },
  multilineInput: {
    marginHorizontal: 0,
    paddingVertical: 3,
    height: 140,
  },
});
