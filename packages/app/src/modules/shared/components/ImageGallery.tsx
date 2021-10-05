import React, { useCallback } from "react";
import { View, useWindowDimensions, ViewStyle } from "react-native";
import { Icon, useTheme } from "react-native-elements";
import Carousel from "react-native-snap-carousel";
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

// const FullScreenImage = ({
//   image,
//   visiable,
//   close,
// }: {
//   image: GalleryImage;
//   visiable: boolean;
//   close: () => void;
// }) => {
//   const { width, height } = useWindowDimensions();
//   const { top } = useSafeAreaInsets();

//   const x = useSharedValue(1);
//   const focalX = useSharedValue(0);
//   const focalY = useSharedValue(0);
//   const gestureHandler =
//     useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
//       onStart: (evt, ctx: any) => {
//         ctx.offsetX = evt.focalX;
//         ctx.offsetY = evt.focalY;
//       },
//       onActive: (event, ctx: any) => {
//         // console.log(event);
//         x.value = Math.max(0.3, Math.min(8, event.scale));
//         focalX.value = event.focalX - ctx.offsetX;
//         focalY.value = event.focalY - ctx.offsetY;
//       },
//       onEnd: () => {
//         x.value = withTiming(1);
//         focalX.value = withTiming(0);
//         focalY.value = withTiming(0);
//       },
//     });
//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         {
//           scale: x.value,
//         },
//         { translateX: focalX.value },
//         { translateY: focalY.value },
//       ],
//     };
//   });

//   const ratio = () => {
//     const ratio = image.width / image.height;
//     let w = width;
//     let h = w / ratio;
//     const viewHeight = height - top;
//     if (h > viewHeight) {
//       w = viewHeight * ratio;
//       h = viewHeight;
//     }

//     return [w, h];
//   };

//   return (
//     <Overlay
//       fullScreen
//       //transparent
//       animationType="none"
//       isVisible={visiable}
//       style={{ backgroundColor: "#111" }}
//       overlayStyle={{
//         padding: 0,
//         backgroundColor: "#111",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <PinchGestureHandler onGestureEvent={gestureHandler}>
//         <Animated.View
//           style={{ height: "100%", width: "100%", justifyContent: "center" }}
//         >
//           <View
//             style={{
//               top: top,
//               paddingTop: 12,
//               width: "100%",
//               paddingHorizontal: 16,
//               position: "absolute",
//               backgroundColor: "transparent",
//               borderBottomColor: "transparent",
//               alignItems: "flex-start",
//               zIndex: 99,
//             }}
//           >
//             <TouchableOpacity
//               style={{ borderRadius: 20, padding: 6 }}
//               onPress={() => {
//                 close();
//               }}
//             >
//               <Icon
//                 containerStyle={{ zIndex: 99 }}
//                 type="antdesign"
//                 name="close"
//                 size={28}
//                 color="rgba(255, 255, 255, 0.8)"
//               />
//             </TouchableOpacity>
//           </View>
//           <Animated.Image
//             style={[{ width: ratio()[0], height: ratio()[1] }, animatedStyle]}
//             source={{ uri: image.url }}
//           />
//         </Animated.View>
//       </PinchGestureHandler>
//     </Overlay>
//   );
// };

type GalleryImage = {
  url: string;
  width: number;
  height: number;
};

type Props = {
  images: GalleryImage[];
  containerStyle?: ViewStyle;
};

const Indicator = ({ total, current }: { total: number; current: number }) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {[...Array(total)].map((_, i) => (
        <Icon
          containerStyle={{ marginHorizontal: 2 }}
          key={i}
          color={current == i ? theme.colors?.primary : theme.colors?.grey1}
          type="octicon"
          name="primitive-dot"
          size={current == i ? 16 : 12}
        />
      ))}
    </View>
  );
};

const SingleImage = ({
  image,
  ratio,
}: {
  image: GalleryImage;
  ratio: number;
}) => {
  const { width } = useWindowDimensions();

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
      resizeMode: "contain",
      transform: [
        {
          scale: scale.value,
        },
        { translateX: focalX.value },
        { translateY: focalY.value },
      ],
    };
  });

  // const ratio = Math.max(1, Math.min(1.2, image.width / image.height));

  return (
    <PinchGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={{ width: "100%", overflow: "visible" }}>
        <Image
          animated
          style={[
            {
              left: 0,
              right: 0,
              width: width,
              height: width / ratio,
            },
          ]}
          animatedStyle={animatedStyle}
          uri={image.url}
          sz="LG"
        />
      </Animated.View>
    </PinchGestureHandler>
  );
};

const resolveRatio = (w: number, h: number) => {
  const r = (w + 1) / (h + 1);
  if (r >= 1.3) {
    return Math.min(4 / 3, r);
  }
  if (r <= 0.8) {
    return Math.max(3 / 4, r);
  }
  return 1;
};

export default function ImageGallery({ images, containerStyle }: Props) {
  const galleryRef = React.useRef(null);
  const { width } = useWindowDimensions();
  const [curIndex, setCurIndex] = React.useState(0);
  const { theme } = useTheme();

  // const _renderItem = ({
  //   item,
  //   index,
  // }: {
  //   item: GalleryImage;
  //   index: number;
  // }) => {
  //   return <SingleImage image={item} />;
  // };

  const ratio = resolveRatio(images[0].width, images[0].height);

  const _renderItem = useCallback(
    ({ item, index }: { item: GalleryImage; index: number }) => {
      return <SingleImage ratio={ratio} image={item} />;
    },
    [ratio]
  );

  return (
    <View
      style={[{ justifyContent: "center", zIndex: 99 }, { ...containerStyle }]}
    >
      <Carousel
        containerCustomStyle={{
          zIndex: 2,
          overflow: "visible",
        }}
        ref={galleryRef}
        onSnapToItem={(idx) => {
          setCurIndex(idx);
        }}
        data={images}
        renderItem={_renderItem}
        sliderWidth={width}
        itemWidth={width}
        // sliderHeight={width / ratio}
      />
      <View style={{ marginTop: 1, zIndex: 1 }}>
        <Indicator total={images.length} current={curIndex} />
      </View>
    </View>
  );
}
