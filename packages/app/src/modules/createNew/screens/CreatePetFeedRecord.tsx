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
  validSelect,
} from "../../shared";
import {
  Pet,
  FeedRecordForm,
  validFeedRecordFormSchema,
} from "@petfabula/common";
import ParamTypes from "./paramTypes";
import ActionIcon from "../components/ActionIcon";
import {
  RecordDateField,
  RecordTimeField,
  RecordFilledInputField,
  RecordBlankInputField,
  PetSelector,
} from "../components/PetRecordComponents";
import { useCreateFeedRecord, useUpdateFeedRecord } from "@petfabula/common";

const CreatePetFeedRecord = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { createFeedRecord } = useCreateFeedRecord();
  const { updateFeedRecord } = useUpdateFeedRecord();

  const { params } = useRoute<RouteProp<ParamTypes, "CreatePetFeedRecord">>();
  const record = params?.record;
  const pet = validSelect(params?.pet) ? params?.pet : record?.pet;
  const disableSelectPet = record ? true : false;

  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  const initial: FeedRecordForm = record
    ? {
        petId: record.petId,
        amount: record.amount,
        foodContent: record.foodContent,
        note: record.note,
        dateTime: record.dateTime,
      }
    : {
        petId: pet?.id as any,
        amount: "" as any,
        foodContent: "",
        note: "",
        dateTime: new Date().getTime(),
      };

  const handleUpdate = (data: FeedRecordForm) => {
    if (record) {
      updateFeedRecord({ ...record, ...data });
    }
  };

  const handleSubmit = (data: FeedRecordForm) => {
    // console.log(data);
    if (record) {
      handleUpdate(data);
    } else {
      createFeedRecord(data);
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
          <View style={{ alignItems: "flex-start", width: "100%", height: 30 }}>
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
              minHeight: "100%",
              width: "100%",
              backgroundColor: theme.colors?.white,
              // paddingHorizontal: 16,
              alignItems: "center",
              // paddingTop: 16,
              // borderRadius: 24,
              paddingBottom: top + 140,
            }}
            showsVerticalScrollIndicator={false}
          >
            <ActionIcon
              type="material-community"
              name="silverware-fork-knife"
              size={40}
              backgroundColor="#fcead0"
              iconColor="#febe8a"
            />
            <Text
              style={{
                marginTop: 16,
                fontWeight: "bold",
                fontSize: 20,
                marginBottom: 20,
              }}
            >
              {t("pet.action.food")}
            </Text>
            <Formik
              initialValues={initial}
              onSubmit={handleSubmit}
              validationSchema={validFeedRecordFormSchema}
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
  disableSelectPet,
  handleSubmit,
  setErrors,
  handleBlur,
  setValues,
}: {
  values: FeedRecordForm;
  handleSubmit: any;
  pet: Pet | null | undefined;
  disableSelectPet: boolean;
  setErrors: (errors: any) => void;
  handleBlur: (e: any) => void;
  setValues: (val: FeedRecordForm) => void;
}) => {
  const { theme } = React.useContext(ThemeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { result, pending } = useCreateFeedRecord();
  const { result: updateResult, pending: updatePending } =
    useUpdateFeedRecord();

  useEffect(() => {
    setValues({ ...values, petId: pet ? pet.id : (null as any) });
  }, [pet]);

  useDidUpdateEffect(() => {
    if (updateResult) {
      navigation.goBack();
    }
  }, [updateResult]);

  useDidUpdateEffect(() => {
    if (result) {
      navigation.goBack();
    }
  }, [result]);

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        paddingHorizontal: 12,
      }}
    >
      <PendingOverlay pending={pending || updatePending} />

      <Field
        name="petId"
        pet={pet}
        disabled={disableSelectPet}
        component={PetSelector}
        onPress={() => {
          navigation.navigate("PetSelect", {
            backScreen: "CreatePetFeedRecord",
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
        name="amount"
        placeholder={t("pet.record.foodAmountPlaceholder")}
        component={RecordBlankInputField}
        autoFocus
        multiline
        width={170}
        keyboardType="number-pad"
        rightIcon={() => {
          return (
            <Text style={{ color: theme.colors?.grey1, fontSize: 20 }}>g</Text>
          );
        }}
      />

      <Field
        name="foodContent"
        placeholder={`${t("pet.record.foodContentPlaceholder")}`}
        component={RecordFilledInputField}
        title={t("pet.record.editFoodContent")}
      />

      <Field
        name="note"
        placeholder={`${t("pet.record.notePlaceholder")}`}
        component={RecordFilledInputField}
        multiline
        title={t("pet.record.editNote")}
      />

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

export default CreatePetFeedRecord;

const styles = StyleSheet.create({
  caption: {
    fontSize: 18,
  },
});
