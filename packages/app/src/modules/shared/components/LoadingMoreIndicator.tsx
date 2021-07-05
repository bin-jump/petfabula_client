import React, { useEffect } from "react";
import { View, ViewProps } from "react-native";
import { Overlay, Icon, useTheme, Text } from "react-native-elements";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";

const LoadingMoreIndicator = (props: ViewProps) => {
  const { theme } = useTheme();

  const rotation = useSharedValue(0);
  const startAnimation = () => {
    rotation.value = 0;
    rotation.value = withRepeat(
      withTiming(360, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  };

  const animatedStyle = useAnimatedStyle(() => {
    const rotationDegree = rotation.value;
    return {
      transform: [{ rotate: rotationDegree + "deg" }],
    };
  });

  useEffect(() => {
    startAnimation();
    return () => {
      cancelAnimation(rotation);
    };
  }, []);

  return (
    <View style={{ marginVertical: 12 }} {...props}>
      <Animated.View style={[animatedStyle]}>
        <Icon
          type="antdesign"
          name="loading1"
          size={26}
          color={theme.colors?.grey1}
        />
      </Animated.View>
    </View>
  );
};

export default LoadingMoreIndicator;
