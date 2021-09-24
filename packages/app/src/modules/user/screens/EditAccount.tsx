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
  Account,
  useUpdateAccount,
  validAccountSchema,
  resolveResponseFormError,
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

const EditAccount = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const { updateAccount } = useUpdateAccount();
  const [selectedImage, setSelectedImage] = useState<UploadImage | null>(null);
  const { params } = useRoute<RouteProp<ParamTypes, "EditAccount">>();
  const account = params.account;
  const initial = { ...account };

  const uri = selectedImage ? selectedImage.uri : account.photo;

  const onImageSelected = (image: UploadImage) => {
    setSelectedImage(image);
  };

  const handleSubmit = (data: Account) => {
    // console.log("data", data);
    updateAccount(data, selectedImage);
  };

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
            iconType="USER"
            editProps={{
              onImageSelected: onImageSelected,
            }}
          />
          <Text style={{ marginTop: 6 }} h2>
            {account.name}
          </Text>
          <Formik
            initialValues={initial}
            onSubmit={handleSubmit}
            validationSchema={validAccountSchema}
          >
            {({ values, setErrors, handleSubmit, handleBlur, setValues }) => (
              <PetFormContent
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
}: {
  values: Account;
  handleSubmit: any;
  setErrors: (errors: any) => void;
  handleBlur: (e: any) => void;
  setValues: (val: Account) => void;
}) => {
  const { top } = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { pending, error, result } = useUpdateAccount();
  const { params } = useRoute<RouteProp<ParamTypes, "EditAccount">>();
  const account = params.account;
  const city = params.city ? params.city : account.city;

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
      navigation.goBack();
    }
  }, [result]);

  useDidUpdateEffect(() => {
    setErrors(resolveResponseFormError(error));
  }, [error]);

  useDidUpdateEffect(() => {
    if (result) {
      navigation.goBack();
    }
  }, [result]);

  useEffect(() => {
    if (city) {
      setValues({ ...values, cityId: city.id });
    }
  }, [city]);

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
            {["MALE", "FEMALE", "OTHER"].map((item) => (
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
                    {t(`user.gender.${item}`)}
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
                  {t("user.input.bioEdit")}
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
        <PendingOverlay pending={pending} />

        <Field
          name="birthday"
          placeholder={`${t("user.input.birthdayPlaceholder")}...`}
          mode="DATE"
          component={DateTimeField}
          // makeContent={(value: string) => {
          //   if (!value) {
          //     return "";
          //   }
          //   return t("user.input.birthday", { date: value });
          // }}
          leftIcon={() => (
            <Text style={[styles.caption, { color: theme.colors?.black }]}>
              {t("user.input.birthdayCaption")}
            </Text>
          )}
        />

        <Field
          name="gender"
          placeholder={`${t("user.input.genderPlaceholder")}...`}
          component={ButtonInputField}
          onPress={() => {
            handleOpenSelectGender();
          }}
          makeContent={(value: string) => {
            if (!value) {
              return "";
            }
            return t(`user.gender.${value}`);
          }}
          leftIcon={() => (
            <Text style={[styles.caption, { color: theme.colors?.black }]}>
              {t("user.input.genderCaption")}
            </Text>
          )}
        />

        <Field
          name="cityId"
          placeholder={`${t("user.input.cityPlaceholder")}...`}
          component={ButtonInputField}
          onPress={() => {
            navigation.navigate("CitySelect");
          }}
          makeContent={() => {
            if (!city) {
              return "";
            }
            const prefecture = `${city.prefectureName}`;
            return `${prefecture}, ${city.name}`;
          }}
          leftIcon={() => (
            <Text style={[styles.caption, { color: theme.colors?.black }]}>
              {t("user.input.cityCaption")}
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

const styles = StyleSheet.create({
  caption: {
    fontWeight: "bold",
    fontSize: 18,
    minWidth: 50,
  },
});

export default EditAccount;
