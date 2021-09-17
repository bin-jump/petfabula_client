import * as React from "react";
import { View } from "react-native";
import { Text, ThemeContext, Button, CheckBox } from "react-native-elements";
import { Field, Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  DismissKeyboardView,
  useDidUpdateEffect,
  FilledInput,
} from "../../shared";
import {
  useEmailCodeSendRegisterCode,
  EmailCodeSendRegisterCodeForm,
  validSendRegisterCodeFormSchema,
  resolveResponseFormError,
  useEmailCodeRegisterAndLogin,
} from "@petfabula/common";

const Signup = () => {
  const { t } = useTranslation();
  const { theme } = React.useContext(ThemeContext);
  const { sendCode } = useEmailCodeSendRegisterCode();
  const initial = { name: "", email: "", userAgreement: false };

  const handleSubmit = (data: EmailCodeSendRegisterCodeForm) => {
    sendCode(data);
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
          {t("authentication.signup.title")}
        </Text>
        <Formik
          initialValues={initial}
          onSubmit={handleSubmit}
          validationSchema={validSendRegisterCodeFormSchema}
        >
          {({
            values,
            setErrors,
            handleSubmit,
            setValues,
            errors,
            touched,
          }) => (
            <RegisterFormContent
              {...{
                values,
                setErrors,
                handleSubmit,
                setValues,
                errors,
                touched,
              }}
            />
          )}
        </Formik>
      </View>
    </DismissKeyboardView>
  );
};

const RegisterFormContent = ({
  values,
  handleSubmit,
  setErrors,
  setValues,
  errors,
  touched,
}: {
  values: EmailCodeSendRegisterCodeForm;
  handleSubmit: any;
  setErrors: (errors: any) => void;
  setValues: (values: EmailCodeSendRegisterCodeForm) => void;
  errors: any;
  touched: any;
}) => {
  const navigation = useNavigation();
  const { theme } = React.useContext(ThemeContext);
  const { t } = useTranslation();
  const { pending, error, sendResult } = useEmailCodeSendRegisterCode();
  const { error: codeError } = useEmailCodeRegisterAndLogin();

  useDidUpdateEffect(() => {
    setErrors(resolveResponseFormError(error));
  }, [error]);

  useDidUpdateEffect(() => {
    setErrors(resolveResponseFormError(codeError));
  }, [codeError]);

  useDidUpdateEffect(() => {
    if (sendResult?.done) {
      navigation.navigate("SignupVerification", { ...values });
    }
  }, [sendResult]);

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <Field
        name="name"
        placeholder={t("authentication.input.namePlaceholder")}
        component={FilledInput}
        inputType="name"
      />
      <Field
        name="email"
        placeholder={t("authentication.input.emailPlaceholder")}
        component={FilledInput}
        inputType="email"
      />
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <CheckBox
          containerStyle={{ margin: 0, padding: 0 }}
          onPress={() => {
            setValues({ ...values, userAgreement: !values.userAgreement });
          }}
          checked={values.userAgreement}
        />
        <Text>
          <Text
            style={{
              color: theme.colors?.primary,
              textDecorationLine: "underline",
            }}
            onPress={() => {
              navigation.navigate("SecondaryStack", {
                screen: "UserAgreement",
              });
            }}
          >
            {t("authentication.login.oauthAutoUserAgreement")}
          </Text>
          <Text>{t("authentication.login.oauthAutoWithWord")}</Text>
          <Text
            style={{
              color: theme.colors?.primary,
              textDecorationLine: "underline",
            }}
            onPress={() => {
              navigation.navigate("SecondaryStack", {
                screen: "PrivacyAgreement",
              });
            }}
          >
            {t("authentication.login.oauthAutoPrivacyAgreement")}
          </Text>
        </Text>
      </View>

      <Button
        loading={pending}
        onPress={() => {
          handleSubmit(values);
        }}
        raised
        title={t("authentication.signup.signupAction")}
        containerStyle={{ marginTop: 14, width: "100%" }}
      />
      <View style={{ width: "100%", marginTop: 12, paddingHorizontal: 6 }}>
        <Text style={{ color: theme.colors?.error, fontSize: 16 }}>
          {touched.userAgreement && errors.userAgreement
            ? `* ${t(errors.userAgreement)}`
            : " "}
        </Text>
      </View>
    </View>
  );
};

export default Signup;
