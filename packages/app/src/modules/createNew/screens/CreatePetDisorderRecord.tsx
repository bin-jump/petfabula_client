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
import { BlurView } from "expo-blur";
import {
  BlankInput,
  useDidUpdateEffect,
  DismissKeyboardView,
  PendingOverlay,
} from "../../shared";
import {
  Pet,
  DisorderRecordForm,
  validDisorderRecordFormSchema,
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
import {
  useCreateDisroderRecord,
  useUpdateDisroderRecord,
} from "@petfabula/common";
import { ImageFile, validSelect } from "../../shared";

const CreatePetDisorderRecord = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { createDisorderRecord } = useCreateDisroderRecord();
  const { updateDisorderRecord } = useUpdateDisroderRecord();
  const { params } =
    useRoute<RouteProp<ParamTypes, "CreatePetDisorderRecord">>();
  const record = params?.record;
  const [existImages, setExistImages] = useState<DisplayImage[]>(
    record ? record.images : []
  );
  const pet = validSelect(params?.pet) ? params?.pet : record?.pet;
  const disableSelectPet = record ? true : false;

  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  const initial: DisorderRecordForm = record
    ? {
        petId: record.pet.id,
        disorderType: record.disorderType,
        content: record.content,
        dateTime: record.dateTime,
      }
    : {
        petId: pet?.id as any,
        disorderType: null,
        content: "",
        dateTime: new Date().getTime(),
      };

  const handleSelect = (image: ImageFile) => {
    setImages([...images, image]);
  };

  const handleRemove = (index: number) => {
    images.splice(index, 1);
    setImages([...images]);
  };

  const handleUpdate = (data: DisorderRecordForm) => {
    if (record) {
      updateDisorderRecord({ ...record, ...data, images: existImages }, images);
    }
  };

  const handleCreate = (data: DisorderRecordForm) => {
    createDisorderRecord({ ...data }, images);
  };

  const handleSubmit = (data: DisorderRecordForm) => {
    // console.log(data);
    if (record) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  const handleRemoveExistImage = (id: number) => {
    const im = existImages.filter((item) => item.id != id);
    setExistImages(im);
  };

  return (
    <DismissKeyboardView>
      <View
        style={{
          backgroundColor: "rgba(1, 1, 1, 0.6)",
        }}
      >
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
            contentContainerStyle={{
              height: "100%",
              width: "100%",
              backgroundColor: theme.colors?.white,
              // paddingHorizontal: 16,
              alignItems: "center",
              // paddingTop: 16,
              // borderRadius: 24,
            }}
          >
            <ActionIcon
              type="material"
              name="mood-bad"
              size={40}
              backgroundColor="#f4e9e0"
              iconColor="#d56940"
            />
            <Text
              style={{
                marginTop: 16,
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 20,
              }}
            >
              {t("pet.action.disorder")}
            </Text>
            <Formik
              initialValues={initial}
              onSubmit={handleSubmit}
              validationSchema={validDisorderRecordFormSchema}
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
                    handleRemoveExistImage,
                    existImages,
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

  disableSelectPet,
  existImages,
  images,
  handleSelect,
  handleRemove,
  handleRemoveExistImage,
}: {
  values: DisorderRecordForm;
  handleSubmit: any;
  pet: Pet | null | undefined;
  setErrors: (errors: any) => void;
  handleBlur: (e: any) => void;
  setValues: (val: DisorderRecordForm) => void;

  disableSelectPet: boolean;
  existImages?: DisplayImage[];
  images: ImageFile[];
  handleSelect: (image: ImageFile) => void;
  handleRemove: (index: number) => void;
  handleRemoveExistImage: (id: number) => void;
}) => {
  const { theme } = React.useContext(ThemeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { result, pending } = useCreateDisroderRecord();
  const { result: updateResult, pending: updatePending } =
    useUpdateDisroderRecord();

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
        disabled={disableSelectPet}
        component={PetSelector}
        onPress={() => {
          navigation.navigate("PetSelect", {
            backScreen: "CreatePetDisorderRecord",
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
        name="content"
        placeholder={`${t("pet.record.disorderContentPlaceholder")}`}
        component={RecordFilledInputField}
        multiline
        title={t("pet.record.editNote")}
      />

      <View style={{ width: "100%", marginBottom: 12 }}>
        <ImageSelector
          handleExistImageRemove={handleRemoveExistImage}
          existImages={existImages}
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

export default CreatePetDisorderRecord;

const styles = StyleSheet.create({
  caption: {
    fontSize: 18,
  },
});
