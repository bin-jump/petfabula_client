import React, {
  useState,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  FlatList,
  useWindowDimensions,
  FlatListProps,
  ListRenderItem,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme, Text, Divider, Icon } from "react-native-elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  useFirstFocusEffect,
  LoadingMoreIndicator,
} from "../../shared";
import ParamTypes from "./ParamTypes";

const UserInfomation = () => {
  const { params } = useRoute<RouteProp<ParamTypes, "UserInfomation">>();
  const { user } = params;
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <ScrollView style={{ backgroundColor: theme.colors?.white }}>
      <Divider />
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 50,
        }}
      >
        <Avatar
          containerStyle={{ marginTop: 8 }}
          source={{ uri: user.photo }}
          size={100}
        />

        <Text h3 style={{ marginTop: 12 }}>
          {user.name}
        </Text>

        <View>
          <Text style={{ marginTop: 12 }}>{user.bio}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserInfomation;
