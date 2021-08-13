import React, { useEffect, useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function useRefocusEffect(fn: any, inputs: Array<any>) {
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      fn();
    }
  }, [...inputs, mounted]);

  useFocusEffect(useCallback(fn, [...inputs]));
}
