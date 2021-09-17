import React, { useEffect } from "react";
import { ListRenderItem, ScrollView, StyleSheet, View } from "react-native";
import { useTheme, Text, Divider, Icon } from "react-native-elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useLoadUserAgreement } from "@petfabula/common";
import { LoadingMoreIndicator } from "../../shared";

const UserAgreement = () => {
  const { theme } = useTheme();
  const { userAgreement, loadUserAgreement } = useLoadUserAgreement();

  useEffect(() => {
    loadUserAgreement();
  }, [loadUserAgreement]);

  return (
    <View>
      {userAgreement ? (
        <ScrollView
          contentContainerStyle={{
            backgroundColor: theme.colors?.white,
            padding: 16,
            paddingBottom: 30,
          }}
        >
          <Text style={{ fontSize: 18, lineHeight: 28 }}>
            {userAgreement.content}
          </Text>
        </ScrollView>
      ) : (
        <LoadingMoreIndicator />
      )}
    </View>
  );
};

export default UserAgreement;
