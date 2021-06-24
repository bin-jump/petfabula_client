import React, { useEffect } from "react";
import { View } from "react-native";
import { Overlay, Icon, useTheme, Text } from "react-native-elements";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";

interface Props {
  actionName?: SVGStringList;
  pending: boolean;
}

const PendingOverlay = ({ pending, actionName }: Props) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
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

  const text = actionName ? actionName : t("common.pending");

  return (
    <Overlay
      isVisible={pending}
      overlayStyle={{ backgroundColor: "transparent" }}
      backdropStyle={{ opacity: 0.3 }}
    >
      {/* <ActivityIndicator size="small" /> */}
      <View
        style={{
          borderRadius: 8,
          backgroundColor: "#000",
          opacity: 0.8,
          width: 130,
          height: 130,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View style={[animatedStyle]}>
          <Icon type="antdesign" name="loading2" size={50} color="white" />
        </Animated.View>
        <Text style={{ marginTop: 12, color: "white", fontSize: 16 }}>
          {`${text}...`}
        </Text>
      </View>
    </Overlay>
  );
};

export default PendingOverlay;
