import React, { useCallback, useEffect, useRef, useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { useTheme, Text, Divider, Icon } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
  interpolate,
} from "react-native-reanimated";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import { Avatar } from "../../shared";
import ParamTypes from "./ParamTypes";
import TabBar from "../components/TabBar";
import PetFeedRecordList from "../components/PetFeedRecordList";
import PetWeightRecordList from "../components/PetWeightRecordList";
import DisorderRecordList from "../components/DisorderRecordList";
import PetEventRecordList from "../components/PetEventRecordList";
import MedicalRecordList from "../components/MedicalRecordList";

const Tabs = createMaterialTopTabNavigator();
const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    borderRadius: 12,
    opacity: interpolate(animatedIndex.value, [0, 1], [0.3, 0.8]),
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      ["#ffffff", "#eaeaea"]
    ),
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

const RecordButton = ({
  label,
  type,
  name,
  backgroundColor,
  iconColor,
  onPress,
}: {
  label: string;
  type: string;
  name: string;
  backgroundColor: string;
  iconColor: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ justifyContent: "center" }}>
        <Icon
          containerStyle={{
            padding: 10,
            borderRadius: 100,
            backgroundColor,
          }}
          type={type}
          name={name}
          size={26}
          color={iconColor}
        />
        <Text style={{ textAlign: "center", fontWeight: "bold", marginTop: 4 }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const PetRecords = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<ParamTypes, "PetRecords">>();
  const pet = params.pet;
  const petId = params.pet.id;

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [140], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handlePresentModalClost = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar source={{ uri: pet.photo }} iconType="PET" size={30} />
          <Text style={{ marginLeft: 8, fontSize: 18, fontWeight: "bold" }}>
            {t("pet.record.recordsOfPetTitle", { name: pet.name })}
          </Text>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 24 }}>
          <TouchableOpacity
            onPress={() => {
              handlePresentModalPress();
            }}
          >
            <Icon
              type="ionicons"
              name="add-circle-outline"
              color={theme.colors?.black}
              size={28}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, handlePresentModalPress]);

  const renderFeedRecordList = useCallback(
    () => <PetFeedRecordList petId={petId} />,
    [petId]
  );

  const renderWeightRecordList = useCallback(
    () => <PetWeightRecordList petId={petId} />,
    [petId]
  );

  const renderDisorderRecordList = useCallback(
    () => <DisorderRecordList petId={petId} />,
    [petId]
  );

  const renderPetEventRecordList = useCallback(
    () => <PetEventRecordList petId={petId} />,
    [petId]
  );

  const renderMedicalRecordListList = useCallback(
    () => <MedicalRecordList petId={petId} />,
    [petId]
  );

  const renderTabBar = useCallback<
    (props: MaterialTopTabBarProps) => React.ReactElement
  >((props) => <TabBar {...props} />, []);

  return (
    <View style={{ flex: 1 }}>
      <BottomSheetModal
        backdropComponent={BottomSheetBackdrop}
        ref={bottomSheetModalRef}
        backgroundComponent={CustomBackground}
        // index={1}
        snapPoints={snapPoints}
        style={{
          shadowColor: theme.colors?.grey1,
          shadowOffset: { width: 2, height: 1 },
          shadowOpacity: 0.8,
          elevation: 2,
        }}
      >
        <View style={{ paddingHorizontal: 24 }}>
          <Divider />
          <View
            style={{
              paddingTop: 16,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <RecordButton
              type="material-community"
              name="silverware-fork-knife"
              backgroundColor="#fcead0"
              iconColor="#febe8a"
              label={t("pet.action.food")}
              onPress={() => {
                navigation.navigate("CreateNew", {
                  screen: "CreateFeedRecord",
                  params: {
                    pet: pet,
                  },
                });
                handlePresentModalClost();
              }}
            />

            <RecordButton
              type="material-community"
              name="scale"
              backgroundColor="#e6f3ff"
              iconColor="#94afef"
              label={t("pet.action.weight")}
              onPress={() => {
                navigation.navigate("CreateNew", {
                  screen: "CreateWeightRecord",
                  params: {
                    pet: pet,
                  },
                });
                handlePresentModalClost();
              }}
            />

            <RecordButton
              type="material"
              name="mood-bad"
              backgroundColor="#f4e9e0"
              iconColor="#d56940"
              label={t("pet.action.disorder")}
              onPress={() => {
                navigation.navigate("CreateNew", {
                  screen: "CreateDisorderRecord",
                  params: {
                    pet: pet,
                  },
                });
                handlePresentModalClost();
              }}
            />

            <RecordButton
              type="material"
              name="event-note"
              backgroundColor="#d8f3ff"
              iconColor="#68bbff"
              label={t("pet.action.event")}
              onPress={() => {
                navigation.navigate("CreateNew", {
                  screen: "SelectPetEventType",
                  params: {
                    pet: pet,
                  },
                });
                handlePresentModalClost();
              }}
            />

            <RecordButton
              type="material-community"
              name="hospital-box-outline"
              backgroundColor="#fcdcd2"
              iconColor="#f15e54"
              label={t("pet.action.medical")}
              onPress={() => {
                navigation.navigate("CreateNew", {
                  screen: "CreateMedicalRecord",
                  params: {
                    pet: pet,
                  },
                });
                handlePresentModalClost();
              }}
            />
          </View>
        </View>
      </BottomSheetModal>

      <Tabs.Navigator tabBar={renderTabBar}>
        <Tabs.Screen
          options={{
            tabBarLabel: t("pet.record.feedRecordTitle"),
            tabBarIcon: () => (
              <Icon
                type="material-community"
                name="shoe-print"
                color={theme.colors?.grey0}
              />
            ),
          }}
          name="FeedRecordList"
        >
          {renderFeedRecordList}
        </Tabs.Screen>

        <Tabs.Screen
          options={{
            tabBarLabel: t("pet.record.weightRecordTitle"),
          }}
          name="WeightRecordList"
        >
          {renderWeightRecordList}
        </Tabs.Screen>

        <Tabs.Screen
          options={{
            tabBarLabel: t("pet.record.disorderRecordTitle"),
          }}
          name="DisorderRecordList"
        >
          {renderDisorderRecordList}
        </Tabs.Screen>

        <Tabs.Screen
          options={{
            tabBarLabel: t("pet.record.petEventRecordTitle"),
          }}
          name="PetEventRecordList"
        >
          {renderPetEventRecordList}
        </Tabs.Screen>

        <Tabs.Screen
          options={{
            tabBarLabel: t("pet.record.medicalRecordTitle"),
          }}
          name="MedicalRecordList"
        >
          {renderMedicalRecordListList}
        </Tabs.Screen>
      </Tabs.Navigator>
    </View>
  );
};

export default PetRecords;
