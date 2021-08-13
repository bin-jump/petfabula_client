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
  PetEventRecordForm,
  validPetEventRecordFormSchema,
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
import { useCreatePetEventRecord } from "@petfabula/common";
import { ImageFile } from "../../shared";

const CreatePetEventRecord = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { createPetEventRecord } = useCreatePetEventRecord();
  const { params } = useRoute<RouteProp<ParamTypes, "CreatePetEventRecord">>();
  const pet = params?.pet;
  const { type } = params;
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  const eventName = t(`${t(`pet.record.${type}`)}`);

  const initial: PetEventRecordForm = {
    petId: pet?.id as any,
    eventType: type,
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

  const handleSubmit = (data: PetEventRecordForm) => {
    // console.log(data);
    createPetEventRecord(data, images);
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
                // navigation.navigate("SelectPetEventType", { dismiss: true });
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
              alignItems: "center",
            }}
          >
            <ActionIcon
              type="material"
              name="event-note"
              size={40}
              backgroundColor="#d8f3ff"
              iconColor="#68bbff"
            />
            <Text
              style={{
                marginTop: 16,
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 20,
              }}
            >
              {`${t("pet.action.event")}-${eventName}`}
            </Text>
            <Formik
              initialValues={initial}
              onSubmit={handleSubmit}
              validationSchema={validPetEventRecordFormSchema}
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
  values: PetEventRecordForm;
  handleSubmit: any;
  pet: Pet | null;
  setErrors: (errors: any) => void;
  handleBlur: (e: any) => void;
  setValues: (val: PetEventRecordForm) => void;

  images: ImageFile[];
  handleSelect: (image: ImageFile) => void;
  handleRemove: (index: number) => void;
}) => {
  const { theme } = React.useContext(ThemeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { result, pending } = useCreatePetEventRecord();

  useEffect(() => {
    if (pet) {
      setValues({ ...values, petId: pet.id });
    }
  }, [pet]);

  useDidUpdateEffect(() => {
    if (result) {
      navigation.navigate("SelectPetEventType", { dismiss: true });
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
            backScreen: "CreatePetEventRecord",
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
        placeholder={`${t("pet.record.eventContentPlaceholder")}`}
        component={RecordFilledInputField}
        multiline
        title={t("pet.record.editEventContent")}
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

export default CreatePetEventRecord;

const styles = StyleSheet.create({
  caption: {
    fontSize: 18,
  },
});
