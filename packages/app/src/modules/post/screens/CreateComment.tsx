import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  TouchableWithoutFeedback,
  useWindowDimensions,
  TextInput,
  Keyboard,
  KeyboardEvent,
} from "react-native";
import { useTheme, Text } from "react-native-elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useCreatePostComment } from "@petfabula/common";
import { useDidUpdateEffect, ActivityIndicator } from "../../shared";

import ParamTypes from "./ParamTypes";

const CreateComment = () => {
  //   const [kbHeight, setKbHeight] = useState<number>(0);
  //   const { bottom } = useSafeAreaInsets();
  const [comment, setComment] = useState("");
  const { height: screenHeight } = useWindowDimensions();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const contentHeight = 110;
  const kbHeight = useSharedValue(contentHeight + 30);
  const { createComment, pending, result } = useCreatePostComment();
  const { params } = useRoute<RouteProp<ParamTypes, "CreateComment">>();
  const { postId } = params;

  const keyboardDidShow = useCallback(
    (e: KeyboardEvent) => {
      kbHeight.value = e.endCoordinates.height + contentHeight;
    },
    [kbHeight]
  );

  const style = useAnimatedStyle(() => {
    return {
      marginTop: withTiming(screenHeight - kbHeight.value),
      height: withTiming(kbHeight.value),
    };
  });

  useDidUpdateEffect(() => {
    if (result) {
      navigation.goBack();
    }
  }, [result]);

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", keyboardDidShow);

    return () => {
      Keyboard.removeListener("keyboardDidShow", keyboardDidShow);
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <View>
        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              {
                width: "100%",
                backgroundColor: theme.colors?.white,
              },
              style,
            ]}
          >
            <View
              style={{
                padding: 12,
                height: contentHeight,
                flexDirection: "row",
              }}
            >
              <TextInput
                multiline
                autoFocus
                placeholder={`${t("post.commentToPost")}...`}
                placeholderTextColor={theme.colors?.grey1}
                value={comment}
                onChangeText={(e) => {
                  setComment(e);
                }}
                style={{
                  padding: 6,
                  fontSize: 18,
                  flex: 1,
                  color: theme.colors?.black,
                  backgroundColor: theme.colors?.grey5,
                  borderRadius: 6,
                }}
              />
              <View
                style={{
                  width: 60,
                  marginLeft: 12,
                  marginBottom: 8,
                  justifyContent: "space-between",
                }}
              >
                <View>
                  {!pending ? (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        if (comment.trim()) {
                          createComment({ postId, content: comment });
                        }
                      }}
                    >
                      <Text
                        style={{ fontSize: 20, color: theme.colors?.primary }}
                      >
                        {t("common.send")}
                      </Text>
                    </TouchableWithoutFeedback>
                  ) : (
                    <ActivityIndicator color={theme.colors?.grey1} />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      comment.length > 240
                        ? theme.colors?.error
                        : theme.colors?.grey0,
                  }}
                >{`${comment.length}/240`}</Text>
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateComment;
