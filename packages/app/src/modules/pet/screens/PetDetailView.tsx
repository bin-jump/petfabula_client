import React, { useRef, useMemo, useCallback, useEffect } from "react";
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useTheme, Text, Icon, Divider } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
  MaterialTopTabBar,
} from "@react-navigation/material-top-tabs";
import {
  Pet,
  useLoadPet,
  useRemovePet,
  useCurrentUser,
} from "@petfabula/common";
import {
  Avatar,
  toAge,
  toAgeMonth,
  useRefocusEffect,
  BottomSheet,
  BottomSheetButton,
  AlertAction,
  PendingOverlay,
  useDidUpdateEffect,
  ActivityIndicator,
} from "../../shared";
import ParamTypes from "./ParamTypes";
import TabBar from "../components/TabBar";
import PetPostList from "../components/PetPostList";
import PetPostImageList from "../components/PetPostImageList";
import { PetDetailSkeleton } from "../components/Skeletons";

const Tabs = createMaterialTopTabNavigator();

const AgeItem = ({ mili }: { mili: number }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const age = toAge(mili);
  const month = toAgeMonth(mili);
  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <Text style={{ fontSize: 18, color: theme.colors?.grey0 }}>
        {t("pet.age", {
          age,
        })}
      </Text>
      {month > 0 ? (
        <Text style={{ fontSize: 18, color: theme.colors?.grey0 }}>
          {t("pet.ageMonth", {
            month,
          })}
        </Text>
      ) : null}
    </View>
  );
};

const GenderItem = ({ gender }: { gender: string | null }) => {
  const { theme } = useTheme();

  if (gender == "MALE") {
    return (
      <Icon
        containerStyle={
          {
            // backgroundColor: "#edf1ff",
          }
        }
        type="ionicon"
        name="male"
        size={20}
        color="#73abfc"
      />
    );
  }

  if (gender == "FEMALE") {
    return (
      <Icon
        containerStyle={
          {
            // backgroundColor: "#fceaea",
          }
        }
        type="ionicon"
        name="female"
        size={20}
        color="#e93235"
      />
    );
  }

  return null;
};

const PetContent = ({ pet, petId }: { pet: Pet | null; petId: number }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<ParamTypes, "PetDetailView">>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { currentUser } = useCurrentUser();

  // const handleOpenEdit = () => {
  //   if (currentUser) {
  //     navigation.navigate("CreateNew", {
  //       screen: "CreatePet",
  //       params: { pet: pet },
  //     });
  //   }
  // };

  return (
    <View style={{}}>
      {pet && pet.id == petId ? (
        <View
          style={{
            paddingHorizontal: 26,
            // height: 150,
            backgroundColor: theme.colors?.white,
            paddingBottom: 2,
          }}
        >
          <View
            style={{ justifyContent: "space-between", flexDirection: "row" }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 90,
                  padding: 6,
                  backgroundColor: theme.colors?.white,
                  shadowColor: theme.colors?.grey2,
                  shadowOffset: { width: 2, height: 4 },
                  shadowOpacity: 0.6,
                  shadowRadius: 5,
                  elevation: 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar source={{ uri: pet.photo }} size={80} iconType="PET" />
              </View>

              <View
                style={{
                  marginLeft: 20,
                  paddingRight: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      lineHeight: 30,
                      height: 30,
                      fontSize: 24,
                      fontWeight: "bold",
                      marginRight: 4,
                      maxWidth: 170,
                    }}
                  >
                    {pet.name}
                  </Text>
                  <GenderItem gender={pet.gender} />
                </View>

                <View
                  style={{
                    marginTop: 2,
                    justifyContent: "center",
                    borderRadius: 6,
                  }}
                >
                  <AgeItem mili={pet.birthday} />
                </View>

                <View style={{ flexShrink: 1 }}>
                  <Text
                    numberOfLines={2}
                    style={{
                      maxWidth: 200,
                      marginTop: 4,
                      fontSize: 14,
                      color: theme.colors?.grey1,
                      flexShrink: 1,
                    }}
                  >
                    {pet.breed.name}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 20, width: 50 }}>
              {currentUser?.id == pet.feederId ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.push("PetRecords", { pet: pet });
                  }}
                  style={{
                    shadowColor: theme.colors?.grey2,
                    shadowOffset: { width: 2, height: 2 },
                    shadowOpacity: 0.7,
                    shadowRadius: 6,
                    elevation: 2,
                  }}
                >
                  <Icon
                    containerStyle={{
                      backgroundColor: theme.colors?.white,
                      padding: 10,
                      borderRadius: 60,
                    }}
                    type="material-community"
                    name="text-box-check-outline"
                    size={30}
                    color={theme.colors?.primary}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <Text
            numberOfLines={2}
            style={{
              textAlign: "center",
              color: theme.colors?.grey1,
              marginTop: 2,
              paddingHorizontal: 6,
            }}
          >
            {pet.bio}
          </Text>
        </View>
      ) : (
        <PetDetailSkeleton />
      )}
    </View>
  );
};

const PetDetailView = () => {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { params } = useRoute<RouteProp<ParamTypes, "PetDetailView">>();
  const petId = params.petId;
  const { pet, pending, loadPet } = useLoadPet();
  const { currentUser } = useCurrentUser();
  const {
    removePet,
    pending: removePending,
    result: removeResult,
  } = useRemovePet();

  const TabIndicatorLeft = (width / 2 - 30) / 2;

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [200], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, [bottomSheetModalRef]);

  const renderPetPostList = useCallback(
    () => <PetPostList petId={petId} />,
    [petId]
  );

  const renderPetPostImageList = useCallback(
    () => <PetPostImageList petId={petId} />,
    [petId]
  );

  const renderTabBar = useCallback<
    (props: MaterialTopTabBarProps) => React.ReactElement
  >(
    (props) => (
      <MaterialTopTabBar
        // scrollEnabled
        contentContainerStyle={{
          height: 42,
        }}
        activeTintColor={theme.colors?.black}
        inactiveTintColor={theme.colors?.grey1}
        labelStyle={{
          fontSize: 16,
          fontWeight: "bold",
          paddingBottom: 18,
        }}
        tabStyle={{
          paddingBottom: 18,
        }}
        indicatorStyle={{
          backgroundColor: theme.colors?.primary,
          // marginHorizontal: 20,
          width: 30,
          // marginBottom: 6,
          left: TabIndicatorLeft,
          height: 3,
          borderRadius: 3,
        }}
        {...props}
        style={{
          backgroundColor: theme.colors?.white,
        }}
      />
    ),
    []
  );

  useRefocusEffect(() => {
    if (petId != pet?.id) {
      loadPet(petId);
    }
  }, [petId, loadPet, pet]);

  useEffect(() => {
    loadPet(petId);
  }, [loadPet, petId]);

  useDidUpdateEffect(() => {
    if (removeResult) {
      navigation.goBack();
    }
  }, [removePet, removeResult]);

  return (
    <View style={{ flex: 1 }}>
      <BottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        handleClose={handleClose}
      >
        <View style={{ paddingHorizontal: 24 }}>
          <Divider />

          <View style={{ paddingTop: 16 }}>
            <View style={{ flexDirection: "row" }}>
              <BottomSheetButton
                label={t("common.edit")}
                type="antdesign"
                name="edit"
                onPress={() => {
                  if (currentUser) {
                    navigation.navigate("CreateNew", {
                      screen: "CreatePet",
                      params: { pet: pet },
                    });
                  }
                  bottomSheetModalRef.current?.close();
                }}
              />

              <BottomSheetButton
                label={t("common.delete")}
                type="antdesign"
                name="delete"
                onPress={() => {
                  AlertAction.AlertDelele(t, () => {
                    if (pet) {
                      removePet(pet.id);
                    }
                  });
                  handleClose();
                }}
              />
            </View>
          </View>
        </View>
      </BottomSheet>

      <PendingOverlay pending={removePending} />
      <View style={{ backgroundColor: theme.colors?.white, height: top }} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          backgroundColor: theme.colors?.white,
          paddingHorizontal: 16,
        }}
      >
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Icon
            type="entypo"
            name="chevron-thin-left"
            size={24}
            color={theme.colors?.black}
          />
        </TouchableWithoutFeedback>

        {currentUser?.id == pet?.feederId ? (
          <TouchableWithoutFeedback
            onPress={() => {
              handlePresentModalPress();
            }}
          >
            <Icon
              type="feather"
              name="more-vertical"
              size={24}
              color={theme.colors?.black}
            />
          </TouchableWithoutFeedback>
        ) : null}
      </View>
      <PetContent pet={pet} petId={petId} />

      <Tabs.Navigator tabBar={renderTabBar}>
        <Tabs.Screen
          options={{
            tabBarLabel: t("pet.profile.petPostTitle"),
            tabBarIcon: () => (
              <Icon
                type="material-community"
                name="shoe-print"
                color={theme.colors?.grey0}
              />
            ),
          }}
          name="PetPosts"
        >
          {renderPetPostList}
        </Tabs.Screen>

        <Tabs.Screen
          options={{ tabBarLabel: t("pet.profile.petAlbumTitle") }}
          name="PetAlbum"
        >
          {renderPetPostImageList}
        </Tabs.Screen>
      </Tabs.Navigator>
    </View>
  );
};

export default PetDetailView;
