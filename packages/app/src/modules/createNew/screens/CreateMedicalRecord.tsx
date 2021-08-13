import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import {
  Text,
  ThemeContext,
  useTheme,
  Icon,
  Button,
} from "react-native-elements";
import { Field, Formik } from "formik";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import {
  BlankInput,
  useDidUpdateEffect,
  DismissKeyboardView,
  PendingOverlay,
} from "../../shared";
import {
  Pet,
  MedicalRecordForm,
  validMedicalRecordFormSchema,
} from "@petfabula/common";
import ParamTypes from "./paramTypes";
import ActionIcon from "../components/ActionIcon";
import {
  RecordDateField,
  RecordTimeField,
  RecordFilledInputField,
  PetSelector,
} from "../components/PetRecordComponents";
import ImageSelector from "../components/ImageSelector";
import { useCreateMedicalRecord } from "@petfabula/common";
import { ImageFile } from "../../shared";

const CreateMedicalRecord = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { createMedicalRecord } = useCreateMedicalRecord();
  const { params } = useRoute<RouteProp<ParamTypes, "CreateDisorderRecord">>();
  const pet = params?.pet;
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  const initial: MedicalRecordForm = {
    petId: pet?.id as any,
    dateTime: new Date().getTime(),
    hospitalName: "",
    symptom: "",
    diagnosis: "",
    treatment: "",
    note: "",
  };

  const handleSelect = (image: ImageFile) => {
    setImages([...images, image]);
  };

  const handleRemove = (index: number) => {
    images.splice(index, 1);
    setImages([...images]);
  };

  const handleSubmit = (data: MedicalRecordForm) => {
    // console.log(data);
    createMedicalRecord(data, images);
  };

  return (
    <DismissKeyboardView>
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <View style={{ height: top + 20 }}></View>
        </TouchableOpacity>

        <View
          style={{
            // height: "100%",
            // width: "100%",
            backgroundColor: theme.colors?.white,
            paddingHorizontal: 16,
            paddingTop: 16,
            borderRadius: 24,
          }}
        >
          <View style={{ alignItems: "flex-start", width: "100%" }}>
            <Icon
              onPress={() => {
                navigation.goBack();
              }}
              type="material-community"
              name="close-thick"
              size={28}
              color={theme.colors?.grey2}
            />
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              minHeight: "100%",
              width: "100%",
              backgroundColor: theme.colors?.white,
              // paddingHorizontal: 16,
              alignItems: "center",
              // paddingTop: 16,
              // borderRadius: 24,
              paddingBottom: 230,
            }}
          >
            <ActionIcon
              type="material-community"
              name="hospital-box-outline"
              size={40}
              backgroundColor="#fcdcd2"
              iconColor="#f15e54"
            />
            <Text
              style={{
                marginTop: 16,
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 20,
              }}
            >
              {t("pet.action.medical")}
            </Text>
            <Formik
              initialValues={initial}
              onSubmit={handleSubmit}
              validationSchema={validMedicalRecordFormSchema}
            >
              {({ values, setErrors, handleSubmit, handleBlur, setValues }) => (
                <FeedRecordFormContent
                  {...{
                    values,
                    setErrors,
                    handleSubmit,
                    handleBlur,
                    setValues,
                    pet,

                    images,
                    handleSelect,
                    handleRemove,
                  }}
                />
              )}
            </Formik>
          </ScrollView>
        </View>
      </View>
    </DismissKeyboardView>
  );
};

const FeedRecordFormContent = ({
  values,
  pet,
  handleSubmit,
  setErrors,
  handleBlur,
  setValues,

  images,
  handleSelect,
  handleRemove,
}: {
  values: MedicalRecordForm;
  handleSubmit: any;
  pet: Pet | null;
  setErrors: (errors: any) => void;
  handleBlur: (e: any) => void;
  setValues: (val: MedicalRecordForm) => void;

  images: ImageFile[];
  handleSelect: (image: ImageFile) => void;
  handleRemove: (index: number) => void;
}) => {
  const { theme } = React.useContext(ThemeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { result, pending } = useCreateMedicalRecord();

  useEffect(() => {
    if (pet) {
      setValues({ ...values, petId: pet.id });
    }
  }, [pet]);

  useDidUpdateEffect(() => {
    if (result) {
      navigation.goBack();
    }
  }, [result]);

  return (
    <View
      style={{ width: "100%", alignItems: "center", paddingHorizontal: 12 }}
    >
      <PendingOverlay pending={pending} />

      <Field
        name="petId"
        pet={pet}
        component={PetSelector}
        onPress={() => {
          navigation.navigate("PetSelect", {
            backScreen: "CreateMedicalRecord",
          });
        }}
      />

      <Field
        name="dateTime"
        component={RecordDateField}
        leftIcon={() => (
          <Text style={[styles.caption, { color: theme.colors?.black }]}>
            {`${t("common.date")}: `}
          </Text>
        )}
      />
      <Field
        name="dateTime"
        component={RecordTimeField}
        leftIcon={() => (
          <Text style={[styles.caption, { color: theme.colors?.black }]}>
            {`${t("common.time")}: `}
          </Text>
        )}
      />

      <Field
        name="hospitalName"
        placeholder={`${t("pet.record.hospitalNamePlaceholder")}`}
        component={RecordFilledInputField}
        title={t("pet.record.editHospitalName")}
      />

      <Field
        name="symptom"
        placeholder={`${t("pet.record.symptomPlaceholder")}`}
        component={RecordFilledInputField}
        multiline
        title={t("pet.record.editSymptom")}
      />

      <Field
        name="diagnosis"
        placeholder={`${t("pet.record.diagnosisPlaceholder")}`}
        component={RecordFilledInputField}
        multiline
        title={t("pet.record.editDiagnosis")}
      />

      <Field
        name="treatment"
        placeholder={`${t("pet.record.treatmentPlaceholder")}`}
        component={RecordFilledInputField}
        multiline
        title={t("pet.record.editTreatment")}
      />

      <Field
        name="note"
        placeholder={`${t("pet.record.notePlaceholder")}`}
        component={RecordFilledInputField}
        multiline
        title={t("pet.record.editNote")}
      />

      <View style={{ width: "100%", marginBottom: 12 }}>
        <ImageSelector
          images={images}
          onSelect={handleSelect}
          onRemove={handleRemove}
        />
      </View>

      <Button
        containerStyle={{ width: "100%" }}
        title={t("common.save")}
        onPress={() => {
          handleSubmit();
        }}
      />
    </View>
  );
};

export default CreateMedicalRecord;

const styles = StyleSheet.create({
  caption: {
    fontSize: 18,
  },
});
