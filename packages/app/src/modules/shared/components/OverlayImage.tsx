import React, { useState } from "react";
import {
  ViewProps,
  View,
  useWindowDimensions,
  TouchableOpacity,
  ImageStyle,
  TouchableWithoutFeedback,
} from "react-native";
import { Overlay, Icon } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
} from "react-native-reanimated";
import Image from "./Image";
import { DisplayImage } from "@petfabula/common";

const FullScreenImage = ({
  image,
  visiable,
  close,
}: {
  image: DisplayImage;
  visiable: boolean;
  close: () => void;
}) => {
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const gestureHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onStart: (event, ctx: any) => {
        if (event.numberOfPointers != 2) {
          return;
        }
        ctx.offsetX = event.focalX;
        ctx.offsetY = event.focalY;
        ctx.pointNum = 2;
      },
      onActive: (event, ctx: any) => {
        const pointNum = event.numberOfPointers;
        // recalculate focal offset when number of pointer changes
        if (ctx.pointNum != pointNum) {
          ctx.offsetX = event.focalX - focalX.value;
          ctx.offsetY = event.focalY - focalY.value;
        } else {
          scale.value = Math.max(0.3, Math.min(8, event.scale));
          focalX.value = event.focalX - ctx.offsetX;
          focalY.value = event.focalY - ctx.offsetY;
        }
        ctx.pointNum = pointNum;
      },
      onEnd: () => {
        scale.value = withTiming(1);
        focalX.value = withTiming(0);
        focalY.value = withTiming(0);
      },
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale.value,
        },
        { translateX: focalX.value },
        { translateY: focalY.value },
      ],
    };
  });

  const showSize = () => {
    const ratio = (image.width + 1) / (image.height + 1);
    let w = width;
    let h = w / ratio;
    const viewHeight = height - top;
    if (h > viewHeight) {
      w = viewHeight * ratio;
      h = viewHeight;
    }

    return [w, h];
  };

  const [w, h] = showSize();

  return (
    <Overlay
      fullScreen
      //transparent
      animationType="none"
      isVisible={visiable}
      style={{ backgroundColor: "#111" }}
      overlayStyle={{
        padding: 0,
        backgroundColor: "#111",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PinchGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              top: top,
              paddingTop: 12,
              width: "100%",
              paddingHorizontal: 16,
              position: "absolute",
              backgroundColor: "transparent",
              borderBottomColor: "transparent",
              alignItems: "flex-start",
              zIndex: 99,
            }}
          >
            <TouchableOpacity
              style={{ borderRadius: 20, padding: 6 }}
              onPress={() => {
                close();
              }}
            >
              <Icon
                containerStyle={{ padding: 8 }}
                type="antdesign"
                name="close"
                size={28}
                color="rgba(255, 255, 255, 0.8)"
              />
            </TouchableOpacity>
          </View>
          <Image
            animated
            animatedStyle={animatedStyle}
            style={[
              {
                resizeMode: "contain",
                left: 0,
                right: 0,
                width: w,
                height: h,
              },
            ]}
            uri={image.url}
            sz="LG"
          />
        </Animated.View>
      </PinchGestureHandler>
    </Overlay>
  );
};

const OverlayImage = (
  props: {
    height: number;
    width: number;
    image: DisplayImage;
    imageStyle?: ImageStyle;
  } & ViewProps
) => {
  const { height, width, image, imageStyle, ...viewProps } = props;
  const [visiable, setVisiable] = useState(false);

  return (
    <View {...viewProps}>
      <FullScreenImage
        visiable={visiable}
        image={image}
        close={() => {
          setVisiable(false);
        }}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          setVisiable(true);
        }}
      >
        <Image
          onPress={() => {
            setVisiable(true);
          }}
          style={[{ width, height }, imageStyle]}
          uri={image.url}
          sz="MD"
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default OverlayImage;
