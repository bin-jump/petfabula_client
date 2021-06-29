import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  Platform,
  Modal,
} from "react-native";
import {
  useTheme,
  Text,
  Divider,
  Button,
  Icon,
  Tooltip as RneTooltip,
} from "react-native-elements";

const Tooltip: React.FC<{
  popover: React.ReactElement;
  children: React.ReactElement;
  height?: number;
}> = ({
  children,
  popover,
  height,
}: {
  popover: React.ReactElement;
  children: React.ReactElement;
  height?: number;
}) => {
  const { theme } = useTheme();

  return (
    <RneTooltip
      height={height ? height : 50}
      backgroundColor={theme.colors?.white as string}
      width={140}
      overlayColor="transparent"
      containerStyle={{
        elevation: 2,
        shadowColor: theme.colors?.grey2,
        shadowOffset: { width: 4, height: 2 },
        shadowOpacity: 0.9,
      }}
      withPointer={true}
      toggleAction="onPress"
      toggleOnPress={true}
      onClose={() => {}}
      onOpen={() => {}}
      withOverlay={false}
      highlightColor=""
      skipAndroidStatusBar={false}
      closeOnlyOnBackdropPress={false}
      ModalComponent={Modal}
      popover={popover}
    >
      {children}
    </RneTooltip>
  );
};

export default Tooltip;
