import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import {
  Text,
  useTheme,
  Icon,
  Divider,
  Button,
  Overlay,
} from "react-native-elements";
import { Field, Formik } from "formik";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import {
  UploadImage,
  PetForm,
  useCreatePet,
  useUpdatePet,
  validPetFormSchema,
  resolveResponseFormError,
  PetDetail,
  PetBreed,
} from "@petfabula/common";
import {
  Avatar,
  DateTimeField,
  useDidUpdateEffect,
  BlankInput,
  DismissKeyboardView,
  ButtonInputField,
  PendingOverlay,
} from "../../shared";
import ParamTypes from "./ParamTypes";

const CreatePet = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const { createPet } = useCreatePet();
  const { updatePet } = useUpdatePet();

  const [selectedImage, setSelectedImage] = useState<UploadImage | null>(null);
  const { params } = useRoute<RouteProp<ParamTypes, "CreatePet">>();
  const pet = params?.pet;
  // const breed = params?.breed;

  const initialBreed = pet?.breed;
  const selectBreed = params?.breed;
  const breed = selectBreed ? selectBreed : initialBreed;

  const initial: PetForm = pet
    ? {
        name: pet.name,
        birthday: pet.birthday,
        arrivalDay: pet.arrivalDay,
        gender: pet.gender,
        breedId: pet.breedId,
        bio: pet.bio,
      }
    : {
        name: "",
        birthday: null,
        arrivalDay: null,
        gender: null,
        breedId: null,
        bio: "",
      };

  const onImageSelected = (image: UploadImage) => {
    setSelectedImage(image);
  };

  const handleCreate = (data: PetForm) => {
    createPet(data, selectedImage);
  };

  const handleUpdate = (data: PetDetail) => {
    updatePet(data, selectedImage);
  };

  const handleSubmit = (data: PetForm) => {
    if (pet) {
      handleUpdate({ ...pet, ...(data as any) });
    } else {
      handleCreate(data);
    }
  };

  const uri = selectedImage ? selectedImage.uri : pet?.photo;

  return (
    <View style={{ backgroundColor: theme.colors?.white }}>
      <ScrollView style={{ minHeight: "100%" }}>
        <View
          style={{
            width: "100%",
            paddingTop: 40,
            //   justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            source={{ uri }}
            size={90}
            iconType="PET"
            editProps={{
              onImageSelected: onImageSelected,
            }}
          />

          <Formik
            initialValues={initial}
            onSubmit={handleSubmit}
            validationSchema={validPetFormSchema}
          >
            {({ values, setErrors, handleSubmit, handleBlur, setValues }) => (
              <PetFormContent
                {...{
                  values,
                  setErrors,
                  handleSubmit,
                  handleBlur,
                  setValues,
                  breed,
                }}
              />
            )}
          </Formik>
        </View>
      </ScrollView>
    </View>
  );
};

const PetFormContent = ({
  values,
  handleSubmit,
  setErrors,
  handleBlur,
  setValues,
  breed,
}: {
  values: PetForm;
  handleSubmit: any;
  setErrors: (errors: any) => void;
  handleBlur: (e: any) => void;
  setValues: (val: PetForm) => void;
  breed: PetBreed | null | undefined;
}) => {
  const { top } = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { pending, error, result } = useCreatePet();
  const {
    pending: updatePending,
    error: updateError,
    result: updateResult,
  } = useUpdatePet();

  const { params } = useRoute<RouteProp<ParamTypes, "CreatePet">>();

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [200], []);

  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log("handleSheetChanges", index);
  // }, []);

  const handleSelectGender = useCallback(
    (gender: string) => {
      setValues({ ...values, gender: gender as any });
      bottomSheetRef.current?.close();
    },
    [setValues, values]
  );

  const handleOpenSelectGender = () => {
    bottomSheetRef.current?.present();
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 24 }}>
          <TouchableOpacity
            onPress={() => {
              handleSubmit();
            }}
          >
            <Text style={{ fontSize: 20 }}>{t("common.save")}</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useDidUpdateEffect(() => {
    if (result) {
      navigation.navigate("TabScreen");
    }
  }, [result]);

  useDidUpdateEffect(() => {
    setErrors(resolveResponseFormError(error));
  }, [error]);

  useDidUpdateEffect(() => {
    setErrors(resolveResponseFormError(updateError));
  }, [updateError]);

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

  useEffect(() => {
    if (breed) {
      setValues({ ...values, breedId: breed.id });
    }
  }, [breed]);

  return (
    <DismissKeyboardView>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          paddingTop: 26,
          paddingHorizontal: 28,
        }}
      >
        <BottomSheetModal
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          backdropComponent={BottomSheetBackdrop}
          // onChange={handleSheetChanges}
        >
          <View style={{ padding: 16, paddingHorizontal: 24 }}>
            <Divider />
            {["MALE", "FEMALE"].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  handleSelectGender(item);
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 46,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                    {t(`pet.gender.${item}`)}
                  </Text>
                </View>
                <Divider />
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetModal>

        <Overlay
          fullScreen
          transparent
          animationType="slide"
          isVisible={visible}
          onBackdropPress={toggleOverlay}
        >
          <View>
            <View style={{ height: top }}></View>
            <View
              style={{
                flexDirection: "row",
                height: 50,
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 26,
              }}
            >
              <View></View>
              <View>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {t("pet.input.bioEdit")}
                </Text>
              </View>
              <TouchableOpacity onPress={toggleOverlay}>
                <Text style={{ fontSize: 20 }}>{t("common.done")}</Text>
              </TouchableOpacity>
            </View>
            <Divider />
            <View style={{ marginTop: 12 }}></View>
            <Field
              autoFocus
              name="bio"
              component={BlankInput}
              multiline
              onPress={toggleOverlay}
              multilineHeight={80}
              // label={`${t("pet.input.bioPlaceholder")}`}
            />
          </View>
        </Overlay>
        <PendingOverlay pending={pending || updatePending} />

        <Field
          name="name"
          placeholder={`${t("pet.input.petNamePlaceholder")}...`}
          component={BlankInput}
          leftIcon={() => (
            // <Icon
            //   type="material"
            //   name="pets"
            //   size={22}
            //   color={theme.colors?.grey0}
            // />
            <Text style={[styles.caption, { color: theme.colors?.black }]}>
              {t("pet.input.nameCaption")}
            </Text>
          )}
        />
        <Field
          name="birthday"
          placeholder={`${t("pet.input.birthdayPlaceholder")}...`}
          mode="DATE"
          component={DateTimeField}
          makeContent={(value: string) => {
            if (!value) {
              return "";
            }
            return t("pet.input.birthday", { date: value });
          }}
          leftIcon={() => (
            // <Icon
            //   type="font-awesome"
            //   name="birthday-cake"
            //   size={18}
            //   color={theme.colors?.grey0}
            // />
            <Text style={[styles.caption, { color: theme.colors?.black }]}>
              {t("pet.input.birthdayCaption")}
            </Text>
          )}
        />

        <Field
          name="arrivalDay"
          placeholder={`${t("pet.input.arrivalDayPlaceholder")}...`}
          mode="DATE"
          component={DateTimeField}
          makeContent={(value: string) => {
            if (!value) {
              return "";
            }
            return t("pet.input.arrivalDay", { date: value });
          }}
          leftIcon={() => (
            // <Icon
            //   iconStyle={{ width: 22 }}
            //   type="material"
            //   name="home-filled"
            //   size={22}
            //   color={theme.colors?.grey0}
            // />
            <Text style={[styles.caption, { color: theme.colors?.black }]}>
              {t("pet.input.arrivalDayCaption")}
            </Text>
          )}
        />

        <Field
          name="breedId"
          placeholder={`${t("pet.input.breedPlaceholder")}...`}
          component={ButtonInputField}
          onPress={() => {
            navigation.navigate("PetBreedSelect");
          }}
          makeContent={() => {
            if (!breed) {
              return "";
            }
            const cate = t(`pet.petCategory.${breed.category}`);
            return `${cate}, ${breed.name}`;
          }}
          leftIcon={() => (
            // <Icon
            //   iconStyle={{ width: 22 }}
            //   type="font-awesome"
            //   name="puzzle-piece"
            //   size={22}
            //   color={theme.colors?.grey0}
            // />
            <Text style={[styles.caption, { color: theme.colors?.black }]}>
              {t("pet.input.breedCaption")}
            </Text>
          )}
        />

        <Field
          name="gender"
          placeholder={`${t("pet.input.genderPlaceholder")}...`}
          component={ButtonInputField}
          onPress={() => {
            handleOpenSelectGender();
          }}
          makeContent={(value: string) => {
            if (!value) {
              return "";
            }
            return t(`pet.gender.${value}`);
          }}
          leftIcon={() => (
            // <Icon
            //   iconStyle={{ width: 22 }}
            //   type="font-awesome"
            //   name="puzzle-piece"
            //   size={22}
            //   color={theme.colors?.grey0}
            // />
            <Text style={[styles.caption, { color: theme.colors?.black }]}>
              {t("pet.input.genderCaption")}
            </Text>
          )}
        />

        <Field
          name="bio"
          component={ButtonInputField}
          multiline
          onPress={toggleOverlay}
          multilineHeight={80}
          placeholder={`${t("pet.input.bioPlaceholder")}...`}
          label={`${t("pet.input.bioPlaceholder")}`}
        />
      </View>
    </DismissKeyboardView>
  );
};

export default CreatePet;

const styles = StyleSheet.create({
  caption: {
    fontWeight: "bold",
    fontSize: 18,
    minWidth: 50,
  },
});
