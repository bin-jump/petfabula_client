import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  useWindowDimensions,
  TextInput,
  Keyboard,
  KeyboardEvent,
  Platform,
} from "react-native";
import { useTheme, Text } from "react-native-elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useCreatePostCommentReply } from "@petfabula/common";
import { useDidUpdateEffect } from "../../shared";
import ParamTypes from "./ParamTypes";

const CreateCommentReply = () => {
  const [reply, setReply] = useState("");
  const { height: screenHeight } = useWindowDimensions();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const contentHeight = 110;
  const kbHeight = useSharedValue(contentHeight + 30);
  const { createCommentReply, pending, result } = useCreatePostCommentReply();
  const { params } = useRoute<RouteProp<ParamTypes, "CreateCommentReply">>();
  const { replyTarget, toComment, commentId } = params;
  const replyToId = toComment ? null : replyTarget.id;

  const keyboardDidShow = useCallback(
    (e: KeyboardEvent) => {
      kbHeight.value = e.endCoordinates.height + contentHeight;
    },
    [kbHeight]
  );

  const style = useAnimatedStyle(() => {
    return {
      marginTop: withTiming(
        screenHeight - kbHeight.value - (Platform.OS === "ios" ? 0 : 24)
      ),
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
                placeholder={`@${
                  replyTarget.participator.name
                }: ${replyTarget.content.substr(0, 10)}...`}
                placeholderTextColor={theme.colors?.grey1}
                value={reply}
                onChangeText={(e) => {
                  setReply(e);
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
                        const cmt = reply.trim();
                        if (cmt && cmt.length <= 240) {
                          createCommentReply({
                            commentId: commentId,
                            content: cmt,
                            replyToId,
                          });
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
                      reply.length > 240
                        ? theme.colors?.error
                        : theme.colors?.grey0,
                  }}
                >{`${reply.length}/240`}</Text>
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateCommentReply;
