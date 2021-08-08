import React, { useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, useTheme, Icon, Divider } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useCurrentUser, useLoadMyPets, PetDetail } from "@petfabula/common";
import { Avatar } from "../../shared";

const toAge = (birth: number) => {
  const today = new Date();
  const birthDate = new Date(birth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const toAgeMonth = (birth: number) => {
  const today = new Date();
  const birthDate = new Date(birth);
  const m = (today.getMonth() + 12 - birthDate.getMonth()) % 12;

  return m;
};

const daysTillNow = (mili: number) => {
  const today = new Date().getTime();
  const res = (today - mili) / (1000 * 60 * 60 * 24);

  return Math.floor(res);
};

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
        <Icon type="foundation" name="male-symbol" size={24} color="#73abfc" />
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
        <Icon
          type="foundation"
          name="female-symbol"
          size={24}
          color="#e93235"
        />
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
}: {
  type: string;
  name: string;
  size: number;
  text: string;
  backgroundColor: string;
  iconColor: string;
}) => {
  const { theme } = useTheme();

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
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
    </View>
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
        borderRadius: 10,
        backgroundColor: theme.colors?.white,
        shadowColor: theme.colors?.grey3,
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: 0.7,
        shadowRadius: 6,
        elevation: 2,
        padding: 12,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Avatar source={{ uri: item.photo }} size={60} iconType="PET" />
        <View style={{ marginLeft: 12 }}>
          <View
            style={{
              marginBottom: 6,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text h3>{item.name}</Text>
            <Text
              numberOfLines={1}
              style={{ color: theme.colors?.grey0, fontSize: 14 }}
            >
              {`   ${item.breed}`}
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

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{ marginTop: 8, color: theme.colors?.grey1, fontSize: 14 }}
        >{`クィック記録`}</Text>
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
        />

        <ActionIcon
          type="material-community"
          name="scale"
          size={26}
          text={t("pet.action.weight")}
          backgroundColor="#e6f3ff"
          iconColor="#94afef"
        />

        <ActionIcon
          type="material"
          name="mood-bad"
          size={26}
          text={t("pet.action.disorder")}
          backgroundColor="#f4e9e0"
          iconColor="#d56940"
        />

        <ActionIcon
          type="material"
          name="event-note"
          size={26}
          text={t("pet.action.event")}
          backgroundColor="#d8f3ff"
          iconColor="#68bbff"
        />
      </View>
    </View>
  );
};

const PetMain = () => {
  const { top } = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { currentUser } = useCurrentUser();
  const { loadPets, pets } = useLoadMyPets();

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  return (
    <View style={{ backgroundColor: theme.colors?.white }}>
      <View
        style={{
          width: "100%",
          height: top,
        }}
      ></View>
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
              navigation.navigate("CreatePet", { feederId: currentUser?.id });
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
      <ScrollView
        style={{
          minHeight: "100%",
          minWidth: "100%",
          backgroundColor: theme.colors?.white,
          padding: 24,
        }}
      >
        {pets.map((item) => (
          <PetItem key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

export default PetMain;
