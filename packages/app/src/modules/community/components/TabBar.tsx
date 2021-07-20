import {
  MaterialTopTabBar,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import React, { FC, useEffect } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-elements";

type Props = MaterialTopTabBarProps & {
  onIndexChange?: (index: number) => void;
};

const TabBar: FC<Props> = ({ onIndexChange, ...props }) => {
  const { index } = props.state;
  const { theme } = useTheme();

  useEffect(() => {
    onIndexChange?.(index);
  }, [onIndexChange, index]);

  return (
    <MaterialTopTabBar
      contentContainerStyle={{
        height: 42,
      }}
      activeTintColor={theme.colors?.black}
      inactiveTintColor={theme.colors?.grey1}
      labelStyle={{
        fontSize: 16,
        fontWeight: "bold",
        paddingBottom: 18,
      }}
      tabStyle={{
        paddingBottom: 18,
      }}
      renderIndicator={(route: any) => {
        if (!route.getTabWidth()) {
          return null;
        }
        return (
          <View
            style={{
              width: route.getTabWidth(),
              height: "100%",
              left: route.navigationState.index * route.getTabWidth(),
              alignItems: "center",
              justifyContent: "flex-end",
              paddingBottom: 8,
            }}
          >
            <View
              style={{
                width: "30%",
                backgroundColor: theme.colors?.primary,
                borderRadius: 3,
                height: 3,
              }}
            ></View>
          </View>
        );
      }}
      {...props}
      style={{
        backgroundColor: theme.colors?.white,
      }}
    />
  );
};

export default TabBar;
