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
  ReportForm,
  useCreateReport,
  validReportSchema,
} from "@petfabula/common";
import ParamTypes from "./paramTypes";

const CreateReport = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { createReport } = useCreateReport();
  const { params } = useRoute<RouteProp<ParamTypes, "CreateReport">>();
  const entityType = params.entityType;
  const entityId = params.entityId;

  const initial = {
    reason: "",
    entityType,
    entityId,
  };

  const handleSubmit = (data: ReportForm) => {
    createReport(data);
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
          validationSchema={validReportSchema}
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
  values: ReportForm;
  handleSubmit: any;
  setErrors: (errors: any) => void;
  handleBlur: (e: any) => void;
  setValues: (val: ReportForm) => void;
}) => {
  const { theme } = React.useContext(ThemeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { pending, error, result } = useCreateReport();

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
        name="reason"
        placeholder={`${t("createNew.input.reportReasonPlaceholder")}...`}
        component={BlankInput}
        autoFocus
        multiline
      />
    </View>
  );
};

export default CreateReport;
