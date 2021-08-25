import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useTheme, Text, Divider } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { ParticiptorPet } from "@petfabula/common";
import { Avatar } from "../../shared";

const RelatePetItem = ({
  pet,
  onPress,
}: {
  pet: ParticiptorPet;
  onPress?: () => void;
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 140,
        marginTop: 12,
        // paddingVertical: 6,
        padding: 6,
        //   borderWidth: 1,
        backgroundColor: theme.colors?.white,
        borderColor: theme.colors?.grey4,
        justifyContent: "center",
        borderRadius: 60,

        shadowColor: theme.colors?.grey2,
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: 0.5,
        elevation: 2,
        shadowRadius: 3,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Avatar source={{ uri: pet.photo }} size={40} iconType="PET" />
        <Text
          style={{
            fontSize: 20,
            marginLeft: 8,
            fontWeight: "bold",
            width: 90,
          }}
        >
          {pet.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RelatePetItem;
