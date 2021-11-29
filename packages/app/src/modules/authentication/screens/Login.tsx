import * as React from "react";
import { View, ScrollView } from "react-native";
import {
  Text,
  ThemeContext,
  Button,
  Icon,
  Divider,
} from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { Field, Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";
import {
  DismissKeyboardView,
  FilledInput,
  useDidUpdateEffect,
  PendingOverlay,
  parseUrlParams,
  Storage,
} from "../../shared";
import {
  useEmailCodeLogin,
  useEmailCodeSendLoginCode,
  EmailCodeSendLoginCodeForm,
  validSendLoginCodeFormSchema,
  resolveResponseFormError,
  useOauthRegisterAndLogin,
  OauthConfig,
} from "@petfabula/common";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const { t } = useTranslation();
  const { theme } = React.useContext(ThemeContext);
  const { sendLoginCode } = useEmailCodeSendLoginCode();

  const initial = { email: "" };

  const handleSubmit = (data: EmailCodeSendLoginCodeForm) => {
    sendLoginCode(data);
  };

  return (
    <DismissKeyboardView>
      <ScrollView
        bounces={false}
        style={{
          backgroundColor: theme.colors?.white,
        }}
      >
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
            {t("authentication.login.title")}
          </Text>

          <Formik
            initialValues={initial}
            onSubmit={handleSubmit}
            validationSchema={validSendLoginCodeFormSchema}
          >
            {({ values, setErrors, handleSubmit }) => (
              <LoginFormContent
                {...{
                  values,
                  setErrors,
                  handleSubmit,
                }}
              />
            )}
          </Formik>
        </View>
      </ScrollView>
    </DismissKeyboardView>
  );
};

const LoginFormContent = ({
  values,
  handleSubmit,
  setErrors,
}: {
  values: EmailCodeSendLoginCodeForm;
  handleSubmit: any;
  setErrors: (errors: any) => void;
}) => {
  const { theme } = React.useContext(ThemeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { pending, error, sendResult } = useEmailCodeSendLoginCode();
  const { error: loginError } = useEmailCodeLogin();
  const {
    registerAndLogin: oauthRegisterAndLogin,
    registerAndLoginResult: oauthResult,
    pending: oauthPending,
  } = useOauthRegisterAndLogin();

  const handleOauthLogin = async (
    url: string,
    redirectUri: string,
    endpointName: string
  ) => {
    const result = await WebBrowser.openAuthSessionAsync(url, redirectUri);
    console.log("result", result);
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

  useDidUpdateEffect(() => {
    if (sendResult?.done) {
      navigation.navigate("LoginVerification", { email: values.email });
    }
  }, [sendResult]);

  useDidUpdateEffect(() => {
    if (oauthResult) {
      navigation.goBack();
    }
  }, [oauthResult]);

  useDidUpdateEffect(() => {
    setErrors(resolveResponseFormError(loginError));
  }, [loginError]);

  useDidUpdateEffect(() => {
    setErrors(resolveResponseFormError(error));
  }, [error]);

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <PendingOverlay
        pending={oauthPending}
        actionName={t("authentication.login.logining")}
      />
      <Field
        name="email"
        placeholder={t("authentication.input.emailPlaceholder")}
        component={FilledInput}
        inputType="email"
      />

      <Button
        loading={pending}
        onPress={() => {
          handleSubmit(values);
        }}
        raised
        title={t("authentication.login.sendVerificationCodeAction")}
        containerStyle={{ marginTop: 6, width: "100%" }}
      />
      <Button
        onPress={() => {
          navigation.navigate("Signup");
        }}
        title={t("authentication.login.gotoSignup")}
        type="outline"
        containerStyle={{ marginTop: 20, width: "100%" }}
      />

      <View style={{ flexDirection: "row", marginTop: 40 }}>
        <Divider style={{ width: 50, marginTop: 10 }} />
        <Text
          style={{
            fontSize: 16,
            marginHorizontal: 12,
            color: theme.colors?.grey0,
          }}
        >
          {t("authentication.login.thirdPartyLogin")}
        </Text>
        <Divider style={{ width: 50, marginTop: 10 }} />
      </View>
      <Button
        onPress={() => {
          handleOauthLogin(
            OauthConfig.getGoogleUrl(),
            OauthConfig.getRedirectUrl(),
            "GOOGLE"
          );
        }}
        title="Google"
        type="outline"
        containerStyle={{ marginTop: 20, width: "100%" }}
        icon={
          <Icon
            type="antdesign"
            name="google"
            color={theme.colors?.primary}
            size={22}
            style={{ marginRight: 9 }}
          />
        }
      />

      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={
          AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE
        }
        cornerRadius={5}
        style={{ marginTop: 20, width: "100%", height: 60 }}
        onPress={async () => {
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
              await Storage.setItem(
                credential.user,
                credential?.fullName?.givenName
              );
            }

            console.log("credential", credential, cachedName);
            // signed in
          } catch (e: any) {
            if (e.code === "ERR_CANCELED") {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
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

export default Login;
