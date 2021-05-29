import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { useTheme, Icon, Text } from "react-native-elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const SearchHeader = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={{ overflow: "hidden", paddingBottom: 5 }}>
      <View
        style={{
          backgroundColor: theme.colors?.white,
          height: 46,
          width: "100%",
          paddingHorizontal: 20,
          justifyContent: "center",
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate("Search");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              backgroundColor: theme.colors?.grey4,
              height: 34,
              borderRadius: 10,
              paddingLeft: 12,
            }}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Icon
                type="font-awesome"
                name="search"
                size={20}
                color={theme.colors?.grey0}
              />
            </View>
            <View style={{ justifyContent: "center", marginLeft: 9 }}>
              <Text
                style={{
                  fontSize: 18,
                  textAlign: "center",
                  color: theme.colors?.grey1,
                }}
              >
                {`${t("common.search")}...`}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default SearchHeader;
