import React, { useEffect } from "react";
import { ListRenderItem, ScrollView, StyleSheet, View } from "react-native";
import { useTheme, Text, Divider, Icon } from "react-native-elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useLoadPrivacyAgreement } from "@petfabula/common";
import { LoadingMoreIndicator } from "../../shared";

const PrivacyAgreement = () => {
  const { theme } = useTheme();
  const { privacyAgreement, loadPrivacyAgreement } = useLoadPrivacyAgreement();

  useEffect(() => {
    loadPrivacyAgreement();
  }, [loadPrivacyAgreement]);

  return (
    <View>
      {privacyAgreement ? (
        <ScrollView
          contentContainerStyle={{
            backgroundColor: theme.colors?.white,
            padding: 16,
            paddingBottom: 30,
          }}
        >
          <Text style={{ fontSize: 18, lineHeight: 28 }}>
            {privacyAgreement.content}
          </Text>
        </ScrollView>
      ) : (
        <LoadingMoreIndicator />
      )}
    </View>
  );
};

export default PrivacyAgreement;
