import React, { useEffect, useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function useRefocusEffect(fn: any, inputs: Array<any>) {
  const mounted = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (mounted.current) {
        fn();
      } else {
        mounted.current = true;
      }
    }, [...inputs])
  );

  // useEffect(() => {
  //   if (!mounted.current) {
  //     mounted.current = true;
  //   }
  // }, [...inputs, mounted]);
}
