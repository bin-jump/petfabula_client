import React from "react";
import { View, ScrollView } from "react-native";
import { useTheme, Text, Divider, Button, Icon } from "react-native-elements";
import { Skeleton } from "../../shared";

export const PostDetailSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View
      style={{ padding: 20, flex: 1, backgroundColor: theme.colors?.white }}
    >
      <Skeleton
        style={{
          height: 300,
        }}
      />

      <View style={{ marginTop: 20 }}>
        <Skeleton />
        <Skeleton />
        <Skeleton cut />
      </View>
    </View>
  );
};

export const QuestionDetailSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View
      style={{ padding: 20, flex: 1, backgroundColor: theme.colors?.white }}
    >
      <Skeleton style={{ height: 32 }} />

      <View style={{ marginTop: 20 }}>
        <Skeleton />
        <Skeleton cut />
      </View>
    </View>
  );
};

export const UserDetailSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors?.white }}>
      <View style={{ flexDirection: "row" }}>
        <Skeleton
          style={{ height: 60, width: 60, borderRadius: 70, marginTop: 0 }}
        />
        <Skeleton
          style={{
            height: 32,
            width: 120,
            marginLeft: 16,
            marginTop: 12,
            flex: 1,
          }}
        />
      </View>

      <View style={{ marginTop: 0 }}>
        <Skeleton />
      </View>
    </View>
  );
};

export const PostSearchItemSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors?.white,
        padding: 16,
        shadowColor: theme.colors?.grey2,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Skeleton
          style={{ height: 32, width: 32, borderRadius: 40, marginTop: 0 }}
        />
        <Skeleton
          style={{
            width: 120,
            marginLeft: 16,
          }}
        />
      </View>

      <View style={{ marginTop: 0, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Skeleton />
          <Skeleton cut />
        </View>
        <Skeleton style={{ height: 70, width: 70, marginLeft: 16 }} />
      </View>
    </View>
  );
};

export const PostSearchSkeleton = () => {
  return (
    <ScrollView>
      {Array.from(Array(5).keys()).map((item) => (
        <View key={item} style={{ marginTop: 12 }}>
          <PostSearchItemSkeleton />
        </View>
      ))}
    </ScrollView>
  );
};

export const QuestionSearchItemSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors?.white,
        padding: 16,
        shadowColor: theme.colors?.grey2,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.3,
        elevation: 2,
      }}
    >
      <Skeleton style={{ height: 24 }} />
      <View style={{ flexDirection: "row", marginTop: 12 }}>
        <Skeleton
          style={{ height: 32, width: 32, borderRadius: 40, marginTop: 0 }}
        />
        <Skeleton
          style={{
            width: 120,
            marginLeft: 16,
          }}
        />
      </View>

      <View style={{ marginTop: 0, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Skeleton />
          <Skeleton cut />
        </View>
        <Skeleton style={{ height: 70, width: 70, marginLeft: 16 }} />
      </View>
    </View>
  );
};

export const QuestionSearchSkeleton = () => {
  return (
    <ScrollView>
      {Array.from(Array(5).keys()).map((item) => (
        <View key={item} style={{ marginTop: 12 }}>
          <QuestionSearchItemSkeleton />
        </View>
      ))}
    </ScrollView>
  );
};
