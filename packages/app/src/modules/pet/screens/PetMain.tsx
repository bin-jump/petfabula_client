import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  RefreshControl,
} from "react-native";
import { Text, useTheme, Icon, Divider, Button } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useCurrentUser, useLoadMyPets, PetDetail } from "@petfabula/common";
import { Avatar, toAge, toAgeMonth, daysTillNow } from "../../shared";
import PetLoginPlease from "../components/PetLoginPlease";

const AgeItem = ({ mili }: { mili: number }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const age = toAge(mili);
  const month = toAgeMonth(mili);
  return (
    <View
      style={{
        flexDirection: "row",
        // paddingHorizontal: 6,
        // backgroundColor: theme.colors?.grey4,
        paddingVertical: 3,
        marginLeft: 6,
        borderRadius: 20,
      }}
    >
      <Text style={{ fontSize: 16 }}>
        {t("pet.age", {
          age,
        })}
      </Text>
      {month > 0 ? (
        <Text style={{ fontSize: 16 }}>
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
      <View
        style={{
          borderRadius: 20,
          backgroundColor: "#edf1ff",
          padding: 2,
        }}
      >
        <Icon type="ionicon" name="male" size={20} color="#73abfc" />
      </View>
    );
  }

  if (gender == "FEMALE") {
    return (
      <View
        style={{
          borderRadius: 20,
          backgroundColor: "#fceaea",
          width: 28,
          padding: 2,
        }}
      >
        <Icon type="ionicon" name="female" size={20} color="#e93235" />
      </View>
    );
  }

  return null;
};

const ActionIcon = ({
  type,
  name,
  size,
  text,
  backgroundColor,
  iconColor,
  onPress,
}: {
  type: string;
  name: string;
  size: number;
  text: string;
  backgroundColor: string;
  iconColor: string;
  onPress: () => void;
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <View
        style={{
          padding: 12,
          backgroundColor: backgroundColor,
          borderRadius: 60,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon type={type} name={name} size={size} color={iconColor} />
      </View>
      <Text style={{ marginTop: 4, fontWeight: "bold", fontSize: 14 }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const PetItem = ({ item }: { item: PetDetail }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View
      style={{
        width: "100%",
        height: 190,
        borderRadius: 24,
        backgroundColor: theme.colors?.white,
        shadowColor: theme.colors?.grey3,
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 6,
        elevation: 2,
        padding: 12,
        marginBottom: 16,
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("SecondaryStack", {
            screen: "PetDetailView",
            params: {
              petId: item.id,
            },
          });
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Avatar source={{ uri: item.photo }} size={60} iconType="PET" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <View
              style={{
                marginBottom: 6,
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text h3>{item.name}</Text>
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  color: theme.colors?.grey0,
                  fontSize: 14,
                }}
              >
                {`   ${item.breed.name}`}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <GenderItem gender={item.gender} />
              <AgeItem mili={item.birthday} />
              <Text
                style={{
                  marginLeft: 6,
                  color: theme.colors?.primary,
                }}
              >
                {`${t("pet.withYou", { day: daysTillNow(item.arrivalDay) })}`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{ marginTop: 8, color: theme.colors?.grey1, fontSize: 14 }}
        >
          {t("pet.action.quickRecord")}
        </Text>
        <Icon
          containerStyle={{ marginLeft: 2, paddingTop: 4 }}
          type="entypo"
          name="pencil"
          size={14}
          color={theme.colors?.grey1}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          marginTop: 2,
          justifyContent: "space-between",
        }}
      >
        <ActionIcon
          type="material-community"
          name="silverware-fork-knife"
          size={26}
          text={t("pet.action.food")}
          backgroundColor="#fcead0"
          iconColor="#febe8a"
          onPress={() => {
            navigation.navigate("CreateNew", {
              screen: "CreateFeedRecord",
              params: { pet: item },
            });
          }}
        />

        <ActionIcon
          type="material-community"
          name="scale"
          size={26}
          text={t("pet.action.weight")}
          backgroundColor="#e6f3ff"
          iconColor="#94afef"
          onPress={() => {
            navigation.navigate("CreateNew", {
              screen: "CreateWeightRecord",
              params: { pet: item },
            });
          }}
        />

        <ActionIcon
          type="material"
          name="mood-bad"
          size={26}
          text={t("pet.action.disorder")}
          backgroundColor="#f4e9e0"
          iconColor="#d56940"
          onPress={() => {
            navigation.navigate("CreateNew", {
              screen: "CreateDisorderRecord",
              params: { pet: item },
            });
          }}
        />

        <ActionIcon
          type="material"
          name="event-note"
          size={26}
          text={t("pet.action.event")}
          backgroundColor="#d8f3ff"
          iconColor="#68bbff"
          onPress={() => {
            navigation.navigate("CreateNew", {
              screen: "SelectPetEventType",
              params: { pet: item },
            });
          }}
        />
      </View>
    </View>
  );
};

const PetContent = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { currentUser } = useCurrentUser();
  const { loadPets, pets, pending } = useLoadMyPets();

  useEffect(() => {
    loadPets();
  }, [loadPets, currentUser]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          // progressViewOffset={70}
          refreshing={pending}
          onRefresh={() => {
            loadPets();
          }}
        />
      }
      style={{
        minHeight: "100%",
        minWidth: "100%",
        backgroundColor: theme.colors?.white,
        padding: 24,
      }}
      contentContainerStyle={{ paddingBottom: 320 }}
    >
      {pets.map((item) => (
        <PetItem key={item.id} item={item} />
      ))}
    </ScrollView>
  );
};

const PetMain = () => {
  const { top } = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { currentUser } = useCurrentUser();
  const { loadPets, pets, pending } = useLoadMyPets();

  useEffect(() => {
    loadPets();
  }, [loadPets, currentUser]);

  return (
    <View style={{ backgroundColor: theme.colors?.white, flex: 1 }}>
      <View
        style={{
          width: "100%",
          height: top,
        }}
      />
      <View
        style={{
          width: "100%",
          height: 60,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          backgroundColor: theme.colors?.white,
          shadowColor: theme.colors?.grey2,
          shadowOffset: { width: 2, height: 4 },
          shadowOpacity: 0.3,
          elevation: 2,
          zIndex: 2,
        }}
      >
        <View style={{ width: 50 }}></View>
        <Text h3>{t("pet.title")}</Text>
        <View style={{ width: 50, paddingRight: 16 }}>
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate("CreatePet", { feederId: currentUser?.id });
              navigation.navigate("CreateNew", {
                screen: "CreatePet",
              });
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
      </View>
      {currentUser ? <PetContent /> : <PetLoginPlease />}
    </View>
  );
};

export default PetMain;
