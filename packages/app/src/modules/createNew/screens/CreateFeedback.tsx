import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Keyboard } from "react-native";
import { Text, ThemeContext, useTheme } from "react-native-elements";
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
import ParamTypes from "./paramTypes";

const CreateFeedback = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { createFeedback } = useCreateFeedback();

  const initial = {
    content: "",
  };

  const handleSubmit = (data: FeedbackForm) => {
    createFeedback(data);
  };

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
}: {
  values: FeedbackForm;
  handleSubmit: any;
  setErrors: (errors: any) => void;
  handleBlur: (e: any) => void;
  setValues: (val: FeedbackForm) => void;
}) => {
  const { theme } = React.useContext(ThemeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { pending, error, result } = useCreateFeedback();

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 24 }}>
          <TouchableOpacity
            onPress={() => {
              handleSubmit();
            }}
          >
            <Text style={{ fontSize: 20 }}>{t("common.send")}</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useDidUpdateEffect(() => {
    if (result) {
      navigation.goBack();
    }
  }, [result]);

  return (
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
  );
};

export default CreateFeedback;
