import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import {
  Text,
  ThemeContext,
  useTheme,
  Icon,
  Button,
} from "react-native-elements";
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import ParamTypes from "./paramTypes";

const EventTypeItem = ({ type }: { type: string }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<ParamTypes, "SelectPetEventType">>();
  const pet = params?.pet;
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => {
        navigation.navigate("CreatePetEventRecord", { pet, type });
      }}
    >
      <View
        style={{
          borderRadius: 16,
          flex: 1,
          // width: 140,
          height: 140,
          margin: 1,
          marginHorizontal: 10,
          backgroundColor: theme.colors?.white,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: theme.colors?.grey2,
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 0.5,
          elevation: 2,
          shadowRadius: 10,

          // borderWidth: 1,
          // borderColor: theme.colors?.primary,
        }}
      >
        <Text
          style={{
            color: theme.colors?.black,
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          {t(`pet.record.${type}`)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const SelectPetEventType = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const { params } = useRoute<RouteProp<ParamTypes, "SelectPetEventType">>();
  const dismiss = params?.dismiss;

  useFocusEffect(() => {
    if (dismiss) {
      navigation.goBack();
    }
  });

  return (
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
            paddingBottom: 220,
            minHeight: "100%",
            width: "100%",
            backgroundColor: theme.colors?.white,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginTop: 3,
              fontWeight: "bold",
              fontSize: 20,
              marginBottom: 20,
            }}
          >
            {t("pet.record.selectPetEventType")}
          </Text>

          <View style={{ width: "100%", marginTop: 10, paddingHorizontal: 16 }}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-around",
              }}
            >
              <EventTypeItem type={"DEWORM"} />
              <EventTypeItem type={"CARE"} />
            </View>
            <View
              style={{
                marginTop: 30,
                width: "100%",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-around",
              }}
            >
              <EventTypeItem type={"TREATMENT"} />
              <EventTypeItem type={"INSURANCE"} />
            </View>

            <View
              style={{
                marginTop: 30,
                width: "100%",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-around",
              }}
            >
              <EventTypeItem type={"TOILET"} />
              <EventTypeItem type={"WALK"} />
            </View>

            <View
              style={{
                marginTop: 30,
                width: "100%",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-around",
              }}
            >
              <EventTypeItem type={"BEAUTY"} />
              <EventTypeItem type={"OTHERS"} />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default SelectPetEventType;

const styles = StyleSheet.create({
  caption: {
    fontSize: 18,
  },
});
