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
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  interpolateColor,
  interpolate,
  Easing,
  Extrapolate,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";

type Props = {
  handleClose: () => void;
};

const ActionButton = ({
  label,
  color,
  icon,
  action,
}: {
  label: string;
  color: string;
  icon: { name: string; type: string; size: number };
  action: () => void;
}) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        action();
      }}
      style={{ marginRight: 30 }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: color,
            width: 54,
            height: 54,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon {...icon} color={theme.colors?.white} />
        </View>
        <Text
          style={{
            marginTop: 6,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    borderRadius: 12,
    opacity: interpolate(animatedIndex.value, [0, 1], [0.3, 0.8]),
    //   backgroundColor: interpolateColor(
    //     animatedIndex.value,
    //     [0, 1],
    //     ["#ffffff", "#fefefe"]
    //   ),
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

const CustomBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 0.6],
      Extrapolate.CLAMP
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: "#a8b5eb",
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return <Animated.View style={containerStyle} />;
};

const CreateNewBottomSheet = forwardRef<BottomSheetModal, Props>(
  (props, ref) => {
    const { handleClose } = props;
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { t } = useTranslation();

    return (
      <BottomSheetModal
        backdropComponent={CustomBackdrop}
        ref={ref}
        // backgroundComponent={CustomBackground}
        // index={1}

        snapPoints={[260]}
        style={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          backgroundColor: theme.colors?.white,
          shadowColor: theme.colors?.grey1,
          shadowOffset: { width: 2, height: 1 },
          shadowOpacity: 0.8,
          elevation: 2,
        }}
      >
        <View>
          <ActionButton
            color="#96a0e9"
            label={t("createNew.createPost")}
            icon={{ size: 36, type: "material-community", name: "feather" }}
            action={() => {
              //   navigation.navigate("CreatePost");
              handleClose();
              navigation.navigate("CreateNew", {
                screen: "CreatePost",
              });
            }}
          />
        </View>
      </BottomSheetModal>
    );
  }
);

export default CreateNewBottomSheet;
