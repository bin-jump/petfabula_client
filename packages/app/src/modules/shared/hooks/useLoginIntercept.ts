import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useCurrentUser } from "@petfabula/common";

export default function useLoginIntercept() {
  const { currentUser } = useCurrentUser();
  const navigation = useNavigation();

  const assertLogin = useCallback(
    (navigate: boolean = true) => {
      if (!currentUser) {
        if (navigate) {
          navigation.navigate("LoginRequire");
        }
        return false;
      }
      return true;
    },
    [currentUser, navigation]
  );

  return { assertLogin };
}
