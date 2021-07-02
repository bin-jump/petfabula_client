import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function useFirstFocusEffect(fn: any, inputs: Array<any>) {
  const [hasFocused, setHasFocused] = useState(false);

  useEffect(() => {
    if (hasFocused) {
      fn();
    }
  }, [...inputs, hasFocused]);

  useFocusEffect(() => {
    if (!hasFocused) {
      setHasFocused(true);
    }
  });
}
