import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, useTheme, Icon } from "react-native-elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import {
  BlankInput,
  useDidUpdateEffect,
  DismissKeyboardView,
  PendingOverlay,
} from "../../shared";

const Tab = createMaterialTopTabNavigator();

const Header = ({
  onFocus,
  onBlur,
}: {
  onFocus: () => void;
  onBlur: () => void;
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: theme.colors?.white,
        height: 70,
        width: "100%",
        paddingHorizontal: 16,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: theme.colors?.grey4,
            height: 40,
            borderRadius: 10,
            paddingLeft: 12,
            alignItems: "center",
            flex: 1,
          }}
        >
          <Icon
            type="font-awesome"
            name="search"
            size={20}
            color={theme.colors?.grey0}
          />
          <TextInput
            onSubmitEditing={() => {
              console.log("aa");
            }}
            returnKeyType="search"
            onFocus={onFocus}
            onBlur={onBlur}
            style={{ fontSize: 18, marginLeft: 8, marginRight: 8, flex: 1 }}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            marginLeft: 12,
            justifyContent: "center",
          }}
        >
          <Icon
            type="antdesign"
            name="close"
            size={24}
            color={theme.colors?.grey0}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Search = () => {
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [showSuggest, setShowSuggest] = useState(false);

  return (
    <DismissKeyboardView>
      <View>
        <View
          style={{
            height: top,
            backgroundColor: theme.colors?.white,
            zIndex: 2,
          }}
        ></View>
        <Header
          onFocus={() => {
            setShowSuggest(true);
          }}
          onBlur={() => {
            setShowSuggest(false);
          }}
        />

        {/* {showSuggest ? (
          <View
            style={{
              position: "absolute",
              marginTop: 128,
              width: "100%",
              height: 600,
              backgroundColor: theme.colors?.white,
              zIndex: 1,
            }}
          ></View>
        ) : null} */}

        <View style={{ width: "100%", height: 800 }}></View>
      </View>
    </DismissKeyboardView>
  );
};

export default Search;
