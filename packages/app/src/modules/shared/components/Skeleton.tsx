import React, { useEffect, useState } from "react";
import { View, StyleProp, ViewStyle, useWindowDimensions } from "react-native";
import { useTheme, Text, Divider, Button, Icon } from "react-native-elements";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  withSequence,
  cancelAnimation,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { move } from "formik";

const SkeletonUnuse = (props: {
  style?: StyleProp<ViewStyle>;
  cut?: boolean;
  height: number;
}) => {
  const [dim, setDim] = useState({ width: 0, height: 0, set: false });
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const { style, cut, height } = props;
  const movement = useSharedValue(0);

  const startAnimation = () => {
    movement.value = 0;
    movement.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600, easing: Easing.linear }),
        withTiming(1, { duration: 1000, easing: Easing.linear })
      ),
      -1,
      false
    );
  };

  const moveWidth = dim.width / 2;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(movement.value, [0, 1], [0.7, 0.1]),
      transform: [
        // {
        //   scaleX: interpolate(moveWidth, [0, 1], [0, dim.width]),
        // },
        {
          translateX: interpolate(
            movement.value,
            [0, 1],
            [0, dim.width - moveWidth]
          ),
        },
      ],
    };
  });

  useEffect(() => {
    startAnimation();

    return () => {
      cancelAnimation(movement);
    };
  }, [dim]);

  const onLayout = (e: any) => {
    if (!dim.set) {
      setDim({
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height,
        set: true,
      });
    }
  };

  return (
    <View
      onLayout={onLayout}
      style={[
        {
          marginTop: 12,
          height: 24,
          borderRadius: 6,
          backgroundColor: "#f4f4f4",
          width: cut ? "70%" : "100%",
        },
        style,
      ]}
    >
      <Animated.View style={[{ width: 50 }, animatedStyle]}>
        <LinearGradient
          // Background Linear Gradient
          colors={["#f1f1f1", "#eaeaea"]}
          start={[0, 1]}
          end={[1, 1]}
          style={{ width: moveWidth, height: dim.height }}
        />
      </Animated.View>
    </View>
  );
};

const Skeleton = (props: { style?: StyleProp<ViewStyle>; cut?: boolean }) => {
  const [dim, setDim] = useState({ width: 0, height: 0, set: false });
  const { theme } = useTheme();

  const { style, cut } = props;

  return (
    <View
      style={[
        {
          marginTop: 12,
          height: 18,
          borderRadius: 6,
          backgroundColor: theme.colors?.grey4,
          width: cut ? "70%" : "100%",
        },
        style,
      ]}
    />
  );
};

export default Skeleton;
