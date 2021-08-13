import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useTheme, Icon, Overlay } from "react-native-elements";
import { UploadImage } from "@petfabula/common";
import { ImageFile, changeExtName, getFileName, Image } from "../../shared";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

const ImageSelector = ({
  images,
  onSelect,
  onRemove,
}: {
  images: ImageFile[];
  onSelect: (image: ImageFile) => void;
  onRemove: (index: number) => void;
}) => {
  const { theme } = useTheme();
  const [processing, setProcessing] = useState(false);

  const processImage = async (uri: string) => {
    const file = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1000 } }],
      { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
    );
    return file;
  };

  const openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }
    const fileName = getFileName(pickerResult.uri);
    const image: UploadImage = {
      uri: pickerResult.uri,
      name: changeExtName(fileName, "jpg"),
      type: "image/jpg",
    };

    setProcessing(true);

    const pPhoto = await processImage(image.uri);
    const img: ImageFile = {
      uri: pPhoto.uri,
      name: changeExtName(fileName, "jpg"),
      type: "image/jpg",
    };
    setProcessing(false);
    onSelect(img);
  };

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
      }}
    >
      {/* prevent onSelect on unmount  */}
      <Overlay
        isVisible={processing}
        overlayStyle={{ backgroundColor: "transparent" }}
        backdropStyle={{ opacity: 0 }}
      />

      <TouchableOpacity
        disabled={processing}
        onPress={() => {
          openImagePickerAsync();
        }}
        style={{
          width: 80,
          height: 80,
          justifyContent: "center",
          borderRadius: 10,
          backgroundColor: theme.colors?.grey3,
          marginRight: 10,
          marginTop: 10,
        }}
      >
        <Icon
          size={50}
          color={theme.colors?.white}
          type="Ionicons"
          name="add"
        />
      </TouchableOpacity>

      {images.map((item, index) => (
        <View key={item.name} style={{ alignItems: "flex-end" }}>
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
                onRemove(index);
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
            key={item.name}
            source={{ uri: item.uri }}
            style={{
              width: 78,
              height: 78,
              marginRight: 10,
              marginTop: 10,
            }}
          />
        </View>
      ))}
    </View>
  );
};

export default ImageSelector;
