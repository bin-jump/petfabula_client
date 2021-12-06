import * as React from "react";
import { View, Image } from "react-native";
import {
  Text,
  ThemeContext,
  Button,
  CheckBox,
  Divider,
} from "react-native-elements";
import { Field, Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";
import Toast from "react-native-root-toast";
import {
  DismissKeyboardView,
  useDidUpdateEffect,
  FilledInput,
  PendingOverlay,
  parseUrlParams,
  Storage,
} from "../../shared";
import {
  useEmailCodeSendRegisterCode,
  EmailCodeSendRegisterCodeForm,
  validSendRegisterCodeFormSchema,
  resolveResponseFormError,
  useEmailCodeRegisterAndLogin,
  useOauthRegisterAndLogin,
  OauthConfig,
  useAppleRegisterOrLogin,
} from "@petfabula/common";
import AppleButton from "../components/AppleButton";
import GoogleButton from "../components/GoogleButton";

WebBrowser.maybeCompleteAuthSession();

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
  const {
    registerAndLogin: oauthRegisterAndLogin,
    registerAndLoginResult: oauthResult,
    pending: oauthPending,
  } = useOauthRegisterAndLogin();
  const {
    registerAndLogin: appleRegisterAndLogin,
    result: appleResult,
    pending: applePending,
  } = useAppleRegisterOrLogin();

  const handleOauthLogin = async (
    url: string,
    redirectUri: string,
    endpointName: string
  ) => {
    const result = await WebBrowser.openAuthSessionAsync(url, redirectUri);
    // console.log("result", result);
    if (result?.type === "success") {
      const code = parseUrlParams(result.url)["code"];
      console.log("success", code);
      if (!code) {
        console.log("ERROR: No oauth code found");
        return;
      }
      const nm = endpointName as "GOOGLE" | "FACEBOOK";
      oauthRegisterAndLogin({ code: code, serverName: nm });
    }
  };

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const cachedName: string = await Storage.getItem(credential.user);
      const detailsArePopulated: boolean =
        !!credential?.fullName?.givenName && !!credential.email;

      if (detailsArePopulated) {
        await Storage.setItem(credential.user, credential?.fullName?.givenName);
      }

      // console.log("credential", credential, cachedName);
      // signed in
      if (credential.identityToken) {
        appleRegisterAndLogin({
          name: cachedName,
          identityToken: credential.identityToken,
        });
      }
    } catch (e: any) {
      if (e.code === "ERR_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
        Toast.show(`${t("authentication.login.appleLoginError")}`, {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP + 30,
          shadow: true,
          animation: true,
          hideOnPress: true,
        });
      }
    }
  };

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

  useDidUpdateEffect(() => {
    if (oauthResult) {
      navigation.navigate("TabScreen");
      // navigation.goBack();
    }
  }, [oauthResult]);

  useDidUpdateEffect(() => {
    if (appleResult) {
      // navigation.goBack();
      navigation.navigate("TabScreen");
    }
  }, [appleResult]);

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <PendingOverlay
        pending={oauthPending || applePending}
        actionName={t("authentication.login.logining")}
      />
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
      <View
        style={{
          width: "100%",
          marginTop: 12,
          paddingHorizontal: 6,
        }}
      >
        <Text style={{ color: theme.colors?.error, fontSize: 16 }}>
          {touched.userAgreement && errors.userAgreement
            ? `* ${t(errors.userAgreement)}`
            : " "}
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Divider style={{ width: 50, marginTop: 10 }} />
        <Text
          style={{
            fontSize: 16,
            marginHorizontal: 12,
            color: theme.colors?.grey0,
          }}
        >
          {t("authentication.login.thirdPartyRegister")}
        </Text>
        <Divider style={{ width: 50, marginTop: 10 }} />
      </View>

      <AppleButton
        buttonType="register"
        onPress={handleAppleLogin}
        containerStyle={{
          marginTop: 20,
        }}
      />

      <GoogleButton
        buttonType="register"
        onPress={() => {
          handleOauthLogin(
            OauthConfig.getGoogleUrl(),
            OauthConfig.getRedirectUrl(),
            "GOOGLE"
          );
        }}
        containerStyle={{ marginTop: 20 }}
      />

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          marginTop: 30,
          paddingHorizontal: 1,
          marginBottom: 38,
        }}
      >
        <Text style={{ fontSize: 15 }}>
          <Text>{t("authentication.login.oauthAutoUserAgreementFront")}</Text>
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
          <Text>{t("authentication.login.oauthAutoUserAgreementBack")}</Text>
        </Text>
      </View>
    </View>
  );
};

export default Signup;
