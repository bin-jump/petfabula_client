import * as React from "react";
import { View } from "react-native";
import { Text, ThemeContext, Button } from "react-native-elements";
import { Formik } from "formik";
import {
  useNavigation,
  useRoute,
  RouteProp,
  StackActions,
} from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { DismissKeyboardView, useDidUpdateEffect } from "../../shared";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import {
  useEmailCodeRegisterAndLogin,
  validEmailCodeRegisterFormSchema,
  EmailCodeRegisterForm,
  resolveResponseFormError,
} from "@petfabula/common";
import ParamTypes from "./paramTypes";

const CELL_COUNT = 6;

const SignupVerification = () => {
  const { t } = useTranslation();
  const { theme } = React.useContext(ThemeContext);
  const { registerAndLogin } = useEmailCodeRegisterAndLogin();

  const { params } = useRoute<RouteProp<ParamTypes, "SignupVerification">>();
  const initial = { ...params, code: "" };

  const handleSubmit = (data: EmailCodeRegisterForm) => {
    registerAndLogin(data);
  };

  return (
    <DismissKeyboardView>
      <View
        style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: theme.colors?.white,
          paddingHorizontal: 30,
        }}
      >
        <Text h1 style={{ marginBottom: 45 }}>
          {t("authentication.signup.verificationTitle")}
        </Text>
        <View style={{ width: "100%", paddingHorizontal: 6, marginBottom: 16 }}>
          <Text style={{ color: theme.colors?.grey0, fontSize: 16 }}>
            {t("authentication.signup.sendMailMessage")}
          </Text>
          {params?.email && (
            <Text
              style={{
                fontWeight: "bold",
                marginVertical: 6,
                color: theme.colors?.grey0,
                fontSize: 18,
              }}
            >
              {params?.email}
            </Text>
          )}
        </View>
        <Formik
          initialValues={initial}
          onSubmit={handleSubmit}
          validationSchema={validEmailCodeRegisterFormSchema}
        >
          {({
            touched,
            values,
            setErrors,
            handleSubmit,
            setValues,
            errors,
          }) => (
            <VerificationCodeFormContent
              {...{
                values,
                errors,
                setErrors,
                handleSubmit,
                setValues,
                touched,
              }}
            />
          )}
        </Formik>
      </View>
    </DismissKeyboardView>
  );
};

const VerificationCodeFormContent = ({
  values,
  handleSubmit,
  setErrors,
  setValues,
  errors,
  touched,
}: {
  values: EmailCodeRegisterForm;
  handleSubmit: any;
  setErrors: (errors: any) => void;
  setValues: (values: EmailCodeRegisterForm) => void;
  errors: any;
  touched: any;
}) => {
  const { theme } = React.useContext(ThemeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const value = values.code;
  const setValue = (val: string) => {
    setValues({ ...values, code: val });
  };

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const { pending, error, registerResult } = useEmailCodeRegisterAndLogin();

  useDidUpdateEffect(() => {
    if (registerResult) {
      navigation.navigate("TabScreen");
    }
  }, [registerResult]);

  useDidUpdateEffect(() => {
    const serverValidationError = resolveResponseFormError(error);
    if (serverValidationError.code) {
      setErrors(serverValidationError);
    } else if (serverValidationError.name || serverValidationError.email) {
      navigation.goBack();
    }
  }, [error]);

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <CodeField
        ref={ref}
        {...props}
        rootStyle={{ alignContent: "space-between" }}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            style={[
              {
                elevation: 2,
                shadowOffset: {
                  width: 2,
                  height: 1,
                },
                shadowOpacity: 0.5,
                shadowRadius: 3,
                shadowColor: theme.colors?.grey0,
                flex: 1,
                borderRadius: 6,
                height: 62,
                marginHorizontal: 6,
                backgroundColor: theme.colors?.grey5,
                justifyContent: "center",
              },
              isFocused && {
                borderWidth: 1,
                borderColor: theme.colors?.grey3,
              },
            ]}
            key={index}
            onLayout={getCellOnLayoutHandler(index)}
          >
            <Text
              key={index}
              style={{
                fontWeight: "bold",
                fontSize: 30,
                textAlign: "center",
                color: theme.colors?.black,
              }}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
      <View
        style={{
          marginTop: 9,
          width: "100%",
          height: 24,
          alignContent: "center",
        }}
      >
        <Text style={{ textAlign: "center", fontSize: 18, color: "red" }}>
          {errors.code && touched.code && t(errors.code)}
        </Text>
      </View>

      <Button
        loading={pending}
        onPress={() => {
          handleSubmit(values);
        }}
        raised
        title={t("authentication.signup.verificationAction")}
        containerStyle={{ marginTop: 20, width: "100%" }}
      />
    </View>
  );
};

export default SignupVerification;
