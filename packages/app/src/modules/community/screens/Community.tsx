import * as React from "react";
import { SafeAreaView, View, Animated } from "react-native";
import { Text } from "react-native-elements";

const Community = () => {
  const scrollY = React.useRef(new Animated.Value(50)).current;

  const clampDiffY = Animated.diffClamp(scrollY, 0, 50);
  const headerHeight = clampDiffY.interpolate({
    inputRange: [0, 50],
    outputRange: [50, 0],
    extrapolate: "clamp",
  });
  const headerTranslateY = clampDiffY.interpolate({
    inputRange: [0, 50],
    outputRange: [50, 0],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View
        style={[
          {
            width: "100%",
            height: headerHeight,
            backgroundColor: "yellow",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
          },
        ]}
      ></Animated.View>
      <View style={{ height: 30, backgroundColor: "blue" }}></View>
      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={5}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: scrollY },
              },
            },
          ],
          { useNativeDriver: false }
        )}
      >
        <View
          style={{
            height: 300,
            width: "100%",
            backgroundColor: "gray",
            marginVertical: 12,
          }}
        ></View>
        <View
          style={{
            height: 300,
            width: "100%",
            backgroundColor: "gray",
            marginVertical: 12,
          }}
        ></View>
        <View
          style={{
            height: 300,
            width: "100%",
            backgroundColor: "gray",
            marginVertical: 12,
          }}
        ></View>
        <View
          style={{
            height: 300,
            width: "100%",
            backgroundColor: "gray",
            marginVertical: 12,
          }}
        ></View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default Community;
