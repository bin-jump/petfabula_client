import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Keyboard } from "react-native";
import {
  Text,
  ThemeContext,
  Icon,
  Image,
  useTheme,
  Divider,
} from "react-native-elements";
import { useTranslation } from "react-i18next";
import { Pet } from "@petfabula/common";
import { Avatar } from "../../shared";

const PostPetSelector = ({
  pet,
  onPress,
}: {
  pet: Pet | null;
  onPress: () => void;
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={{
        marginTop: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.colors?.grey5,
        height: 46,
        borderRadius: 10,
        width: "100%",
        paddingHorizontal: 8,
        marginBottom: 16,
      }}
      onPress={onPress}
    >
      {pet ? (
        <View
          style={{
            paddingLeft: 6,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar source={{ uri: pet.photo }} size={36} iconType="PET" />
          <Text style={{ marginLeft: 6, fontWeight: "bold", fontSize: 18 }}>
            {pet.name}
          </Text>
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 18, color: theme.colors?.grey0 }}>
            {t("createNew.petSelect")}
          </Text>
        </View>
      )}
      <Icon type="antdesign" name="right" color={theme.colors?.grey0} />
    </TouchableOpacity>
  );
};

export default PostPetSelector;
