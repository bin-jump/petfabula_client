import React, { useCallback, useEffect } from "react";
import { View, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { useTheme, Text, Icon } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import { Pet, useLoadPet, useCurrentUser } from "@petfabula/common";
import { Avatar, toAge, toAgeMonth, useRefocusEffect } from "../../shared";
import ParamTypes from "./ParamTypes";
import TabBar from "../components/TabBar";
import PetPostList from "../components/PetPostList";
import PetPostImageList from "../components/PetPostImageList";

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
                  borderRadius: 90,
                  padding: 6,
                  backgroundColor: theme.colors?.white,
                  shadowColor: theme.colors?.grey2,
                  shadowOffset: { width: 2, height: 4 },
                  shadowOpacity: 0.5,
                  shadowRadius: 5,
                  elevation: 2,
                }}
              >
                <Avatar source={{ uri: pet.photo }} size={80} iconType="PET" />
              </View>

              <View style={{ marginLeft: 20 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
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

                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 16,
                    color: theme.colors?.grey1,
                  }}
                >
                  {pet.breed}
                </Text>
              </View>
            </View>

            <View style={{}}>
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
      ) : null}
    </View>
  );
};

const PetDetailView = () => {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { params } = useRoute<RouteProp<ParamTypes, "PetDetailView">>();
  const petId = params.petId;
  const { pet, pending, loadPet } = useLoadPet();

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
  >((props) => <TabBar {...props} />, []);

  useRefocusEffect(() => {
    if (petId != pet?.id) {
      loadPet(petId);
    }
  }, [petId, loadPet, pet]);

  useEffect(() => {
    loadPet(petId);
  }, [loadPet, petId]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: theme.colors?.white, height: top }} />
      <View
        style={{
          flexDirection: "row",
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
