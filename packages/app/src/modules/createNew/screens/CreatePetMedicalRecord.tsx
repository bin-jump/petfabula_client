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
  useCreateMedicalRecord,
  useUpdateMedicalRecord,
  DisplayImage,
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
import { ImageFile, validSelect } from "../../shared";

const CreatePetMedicalRecord = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { createMedicalRecord } = useCreateMedicalRecord();
  const { updateMedicalRecord } = useUpdateMedicalRecord();
  const { params } =
    useRoute<RouteProp<ParamTypes, "CreatePetMedicalRecord">>();
  const record = params?.record;
  const [existImages, setExistImages] = useState<DisplayImage[]>(
    record ? record.images : []
  );
  const pet = validSelect(params?.pet) ? params?.pet : record?.pet;
  const disableSelectPet = record ? true : false;
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  const initial: MedicalRecordForm = record
    ? {
        petId: record.pet.id,
        dateTime: record.dateTime,
        hospitalName: record.hospitalName,
        symptom: record.symptom,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        note: record.note,
      }
    : {
        petId: pet?.id as any,
        dateTime: new Date().getTime(),
        hospitalName: "",
        symptom: "",
        diagnosis: "",
        treatment: "",
        note: "",
      };

  const handleUpdate = (data: MedicalRecordForm) => {
    if (record) {
      updateMedicalRecord({ ...record, ...data, images: existImages }, images);
    }
  };

  const handleCreate = (data: MedicalRecordForm) => {
    createMedicalRecord({ ...data }, images);
  };

  const handleSubmit = (data: MedicalRecordForm) => {
    // console.log(data);
    if (record) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <DismissKeyboardView>
      <View style={{ backgroundColor: "rgba(1, 1, 1, 0.6)" }}>
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
              paddingBottom: top + 160,
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

                    disableSelectPet,
                    existImages,
                    images,
                    setImages,
                    setExistImages,
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

  disableSelectPet,
  existImages,
  images,
  setImages,
  setExistImages,
}: {
  values: MedicalRecordForm;
  handleSubmit: any;
  pet: Pet | null | undefined;
  setErrors: (errors: any) => void;
  handleBlur: (e: any) => void;
  setValues: (val: MedicalRecordForm) => void;

  disableSelectPet: boolean;
  existImages?: DisplayImage[];
  images: ImageFile[];
  setImages: (image: ImageFile[]) => void;
  setExistImages?: (image: DisplayImage[]) => void;
}) => {
  const { theme } = React.useContext(ThemeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { result, pending } = useCreateMedicalRecord();
  const { result: updateResult, pending: updatePending } =
    useUpdateMedicalRecord();

  useEffect(() => {
    setValues({ ...values, petId: pet ? pet.id : (null as any) });
  }, [pet]);

  useDidUpdateEffect(() => {
    if (result) {
      navigation.goBack();
    }
  }, [result]);

  useDidUpdateEffect(() => {
    if (updateResult) {
      navigation.goBack();
    }
  }, [updateResult]);

  return (
    <View
      style={{ width: "100%", alignItems: "center", paddingHorizontal: 12 }}
    >
      <PendingOverlay pending={pending || updatePending} />

      <Field
        name="petId"
        pet={pet}
        component={PetSelector}
        disabled={disableSelectPet}
        onPress={() => {
          navigation.navigate("PetSelect", {
            backScreen: "CreatePetMedicalRecord",
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
          existImages={existImages}
          images={images}
          setImages={setImages}
          setExistImage={setExistImages}
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

export default CreatePetMedicalRecord;

const styles = StyleSheet.create({
  caption: {
    fontSize: 18,
  },
});
