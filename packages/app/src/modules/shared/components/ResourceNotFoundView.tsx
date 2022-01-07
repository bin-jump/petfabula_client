import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme, Text, Divider, Button, Icon } from "react-native-elements";

const ResourceNotFoundView = () => {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        {t("common.notFound")}
      </Text>
    </View>
  );
};

export default ResourceNotFoundView;
