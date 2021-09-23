import React, { useEffect, forwardRef } from "react";
import {
  View,
  TouchableWithoutFeedback,
  FlatListProps,
  FlatList as RNFlatList,
} from "react-native";
import Animated from "react-native-reanimated";
import { useTheme, Text, Icon } from "react-native-elements";
import { useTranslation } from "react-i18next";
import ActivityIndicator from "./ActivityIndicator";

export const EmptyListComponent = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={{ paddingTop: 120 }}>
      <Icon
        name="file-tray"
        type="ionicon"
        color={theme.colors?.grey3}
        size={70}
      />
      <Text style={{ textAlign: "center", color: theme.colors?.grey1 }}>{`${t(
        "component.emptyList"
      )}`}</Text>
    </View>
  );
};

// export type Props = Omit<FlatListProps<any>, "ListEmptyComponent">;
export type Props = FlatListProps<any> & { pending?: boolean };

const FlatList = forwardRef<RNFlatList, Props>((props, ref) => {
  const { pending, ListHeaderComponent } = props;

  return (
    <RNFlatList
      ref={ref}
      {...props}
      ListHeaderComponent={
        <View>
          {ListHeaderComponent}
          {pending ? <ActivityIndicator style={{ marginTop: 10 }} /> : null}
        </View>
      }
      ListEmptyComponent={<EmptyListComponent />}
    />
  );
});

export default FlatList;
