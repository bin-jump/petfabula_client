import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  View,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { useTheme, Text, Divider, Button, Icon } from "react-native-elements";

const ResourceNotFoundView = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Not Found</Text>
    </View>
  );
};

export default ResourceNotFoundView;
