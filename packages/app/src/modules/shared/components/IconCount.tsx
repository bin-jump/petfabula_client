import React from "react";
import { View, ViewProps } from "react-native";
import { Icon, Text, useTheme } from "react-native-elements";

const IconCount = (
  props: {
    name: string;
    type: string;
    count: number;
    size: number;
  } & ViewProps
) => {
  const { theme } = useTheme();
  const { name, type, count, size } = { ...props };
  const sz = size ? size : 20;

  return (
    <View
      {...props}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
        },
        props.style,
      ]}
    >
      {type && name ? (
        <Icon color={theme.colors?.grey1} type={type} name={name} size={sz} />
      ) : null}

      <Text
        style={{ color: theme.colors?.grey1, fontSize: sz - 2, marginLeft: 8 }}
      >
        {count}
      </Text>
    </View>
  );
};

export default IconCount;
