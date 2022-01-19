import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Icon, Image as RNEImage, useTheme } from "react-native-elements";
import { DisplayImage } from "@petfabula/common";
import { ImageFile, Image } from "../../shared";

const MultipleImageSelect = ({
  existImages,
  images,
  fromScreen,

  setImages,
  setExistImages,
}: {
  existImages?: DisplayImage[];
  images: ImageFile[];
  fromScreen: string;
  // onRemove: (index: number) => void;
  // handleExistImageRemove?: (id: number) => void;
  setImages: (image: ImageFile[]) => void;
  setExistImages?: (image: DisplayImage[]) => void;
}) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const displayImages = existImages ? existImages : [];
  const limit = 6 - displayImages.length;

  const handleRemove = (index: number) => {
    images.splice(index, 1);
    setImages([...images]);
  };

  const handleRemoveExistImage = (id: number) => {
    if (!existImages || !setExistImages) {
      return;
    }
    const im = existImages.filter((item) => item.id != id);
    setExistImages(im);
  };

  return (
    <View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ImageSelect", { fromScreen, limit })
          }
          style={{
            width: 92,
            height: 92,
            borderStyle: "dashed",
            justifyContent: "center",
            borderWidth: 3,
            borderRadius: 3,
            borderColor: theme.colors?.grey3,
            margin: 3,
          }}
        >
          <Icon
            size={40}
            color={theme.colors?.grey3}
            type="Ionicons"
            name="add"
          />
        </TouchableOpacity>

        {displayImages.map((item, index) => (
          <View key={item.id} style={{ alignItems: "flex-end" }}>
            <View
              style={{
                marginTop: 12,
                paddingRight: 12,
                position: "absolute",
                zIndex: 2,
                width: "100%",
                alignItems: "flex-end",
              }}
            >
              <Icon
                onPress={() => {
                  handleRemoveExistImage(item.id);
                }}
                containerStyle={{
                  width: 20,
                  backgroundColor: "#000",
                  opacity: 0.5,
                  borderRadius: 20,
                }}
                size={20}
                color={theme.colors?.grey3}
                type="Ionicons"
                name="close"
              />
            </View>

            <Image
              key={item.id}
              uri={item.url}
              style={{
                borderWidth: 3,
                borderColor: "#ffbc83",
                margin: 6,
                width: 80,
                height: 80,
              }}
              sz="SM"
            />
          </View>
        ))}
        {images.map((item, index) => (
          <View key={item.uri} style={{ alignItems: "flex-end" }}>
            <View
              style={{
                marginTop: 12,
                paddingRight: 12,
                position: "absolute",
                zIndex: 2,
                width: "100%",
                alignItems: "flex-end",
              }}
            >
              <Icon
                onPress={() => {
                  handleRemove(index);
                }}
                containerStyle={{
                  width: 20,
                  backgroundColor: "#000",
                  opacity: 0.5,
                  borderRadius: 20,
                }}
                size={20}
                color={theme.colors?.grey3}
                type="Ionicons"
                name="close"
              />
            </View>

            <RNEImage
              containerStyle={{
                margin: 6,
              }}
              key={item.uri}
              source={{ uri: item.uri }}
              style={{
                width: 80,
                height: 80,
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default MultipleImageSelect;
