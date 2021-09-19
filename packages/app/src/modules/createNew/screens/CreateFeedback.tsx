import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Keyboard } from "react-native";
import {
  Text,
  ThemeContext,
  useTheme,
  Icon,
  Button,
} from "react-native-elements";
import { Field, Formik } from "formik";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  BlankInput,
  useDidUpdateEffect,
  DismissKeyboardView,
  PendingOverlay,
} from "../../shared";
import {
  validFeedbackSchema,
  useCreateFeedback,
  FeedbackForm,
} from "@petfabula/common";

const AfterFeedback = ({ count }: { count: number }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, paddingTop: 120, alignItems: "center" }}>
      <Icon
        name="email"
        type="fontisto"
        size={80}
        color={theme.colors?.grey3}
      />
      <Text
        style={{
          lineHeight: 32,
          color: theme.colors?.primary,
          fontSize: 28,
          fontWeight: "bold",
          marginTop: 16,
        }}
      >{`${t("common.thanks")}`}</Text>

      <Text style={{ marginTop: 12, fontSize: 18 }}>{`${t(
        "setting.gobackAfter",
        {
          second: count,
        }
      )}...`}</Text>
      <View style={{ marginTop: 12 }}>
        <Text
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            fontSize: 18,
            textDecorationLine: "underline",
            color: theme.colors?.grey0,
          }}
        >
          {t("common.goback")}
        </Text>
      </View>
    </View>
  );
};

const CreateFeedback = () => {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(6);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { createFeedback, result } = useCreateFeedback();

  const initial = {
    content: "",
  };

  const handleSubmit = (data: FeedbackForm) => {
    createFeedback(data);
    // setDone(true);
  };

  useDidUpdateEffect(() => {
    if (result) {
      // navigation.goBack();
      setDone(true);
    }
  }, [result]);

  useEffect(() => {
    if (done) {
      var doneInterval = setInterval(function () {
        setCount(count - 1);
      }, 1000);
      return () => clearInterval(doneInterval);
    }
  });

  useEffect(() => {
    if (count == 0) {
      navigation.goBack();
    }
  }, [count]);

  return (
    <DismissKeyboardView>
      <View
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: theme.colors?.white,
          paddingHorizontal: 16,
        }}
      >
        <Formik
          initialValues={initial}
          onSubmit={handleSubmit}
          validationSchema={validFeedbackSchema}
        >
          {({ values, setErrors, handleSubmit, handleBlur, setValues }) => (
            <ReportFormContent
              {...{
                values,
                setErrors,
                handleSubmit,
                handleBlur,
                setValues,
                done,
                count,
              }}
            />
          )}
        </Formik>
      </View>
    </DismissKeyboardView>
  );
};

const ReportFormContent = ({
  values,
  handleSubmit,
  setErrors,
  handleBlur,
  setValues,
  done,
  count,
}: {
  values: FeedbackForm;
  handleSubmit: any;
  setErrors: (errors: any) => void;
  handleBlur: (e: any) => void;
  setValues: (val: FeedbackForm) => void;
  done: boolean;
  count: number;
}) => {
  const { theme } = React.useContext(ThemeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { pending, error, result } = useCreateFeedback();

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 24 }}>
          {!done ? (
            <TouchableOpacity
              onPress={() => {
                handleSubmit();
              }}
            >
              <Text style={{ fontSize: 20 }}>{t("common.send")}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ),
    });
  }, [navigation, done]);

  // useDidUpdateEffect(() => {
  //   if (result) {
  //     navigation.goBack();
  //   }
  // }, [result]);

  return !done ? (
    <View style={{ width: "100%", alignItems: "center" }}>
      <PendingOverlay pending={pending} />

      <Field
        name="content"
        placeholder={`${t("createNew.input.feedbackPlaceholder")}...`}
        component={BlankInput}
        autoFocus
        multiline
      />
    </View>
  ) : (
    <AfterFeedback count={count} />
  );
};

export default CreateFeedback;
