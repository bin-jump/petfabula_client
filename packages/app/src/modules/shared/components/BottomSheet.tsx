import React, {
  forwardRef,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  View,
  TouchableWithoutFeedback,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme, Text, Divider, Button, Icon } from "react-native-elements";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  interpolateColor,
  interpolate,
  Easing,
} from "react-native-reanimated";

type Props = {
  snapPoints: (string | number)[];
  children?: React.ReactNode;
  handleClose?: () => void;
};

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    borderRadius: 12,
    opacity: interpolate(animatedIndex.value, [0, 1], [0.3, 0.8]),
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      ["#ffffff", "#fefefe"]
    ),
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export const BottomSheetButton = ({
  label,
  type,
  name,
  onPress,
  style,
}: {
  label: string;
  type: string;
  name: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}) => {
  const { theme } = useTheme();

  return (
    <View style={[{ flexDirection: "row", marginHorizontal: 12 }, style]}>
      <TouchableOpacity
        style={{ justifyContent: "center", alignItems: "center" }}
        onPress={onPress}
      >
        <Icon
          containerStyle={{
            borderRadius: 60,
            shadowColor: theme.colors?.grey2,
            shadowOffset: { width: 2, height: 1 },
            shadowOpacity: 0.8,
            elevation: 2,
            backgroundColor: theme.colors?.white,
            padding: 12,
            width: 60,
          }}
          type={type}
          name={name}
          size={32}
          color={theme.colors?.black}
        />
        <Text
          style={{
            textAlign: "center",
            marginTop: 6,
            fontSize: 16,
            fontWeight: "bold",
            color: theme.colors?.black,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const BottomSheetCancelButton = ({
  onPress,
}: {
  onPress: () => void;
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginTop: 12,
        marginHorizontal: 16,
        backgroundColor: "#dfdfdf",
        borderRadius: 6,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: 18,
          color: theme.colors?.black,
          paddingVertical: 14,
        }}
      >
        {t("common.cancel")}
      </Text>
    </TouchableOpacity>
  );
};

const BottomSheet = forwardRef<BottomSheetModal, Props>((props, ref) => {
  const { snapPoints, children, handleClose } = props;
  const { theme } = useTheme();

  return (
    <BottomSheetModal
      backdropComponent={BottomSheetBackdrop}
      ref={ref}
      backgroundComponent={CustomBackground}
      // index={1}
      snapPoints={snapPoints}
      style={{
        shadowColor: theme.colors?.grey1,
        shadowOffset: { width: 2, height: 1 },
        shadowOpacity: 0.8,
        elevation: 2,
      }}
    >
      {children}
      {handleClose ? <BottomSheetCancelButton onPress={handleClose} /> : null}
    </BottomSheetModal>
  );
});

export default BottomSheet;
