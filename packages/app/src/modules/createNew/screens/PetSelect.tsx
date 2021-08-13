import React, { useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, useTheme, Icon, Divider } from "react-native-elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Pet, useLoadMyPets } from "@petfabula/common";
import { Avatar } from "../../shared";
import ParamTypes from "./paramTypes";

type Prop = {
  backScreen: string;
};

const PetItem = ({ pet }: { pet: Pet }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<ParamTypes, "PetSelect">>();
  const { backScreen } = params;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(backScreen, { pet });
      }}
    >
      <View
        style={{
          height: 80,
          backgroundColor: theme.colors?.white,
          alignItems: "center",
          paddingHorizontal: 16,
          flexDirection: "row",
        }}
      >
        <Avatar source={{ uri: pet.photo }} size={40} iconType="PET" />
        <Text style={{ marginLeft: 10, fontSize: 20 }}>{pet.name}</Text>
      </View>
      <Divider />
    </TouchableOpacity>
  );
};

const PetSelect = ({ backScreen }: Prop) => {
  const { theme } = useTheme();
  const { loadPets, pets } = useLoadMyPets();

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  return (
    <ScrollView
      style={{ minHeight: "100%", backgroundColor: theme.colors?.white }}
    >
      <Divider />
      {pets.map((item) => (
        <PetItem key={item.id} pet={item} />
      ))}
    </ScrollView>
  );
};

export default PetSelect;
