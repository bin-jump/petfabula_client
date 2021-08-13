import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  Avatar as RneAvatar,
  AvatarProps,
  useTheme,
} from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { UploadImage } from "@petfabula/common";

const Avatar = (
  props: {
    size: number;
    iconType?: "USER" | "PET";
    squred?: boolean;
    source?: { uri?: string };
    title?: string;
    onPress?: () => void;
    editProps?: { onImageSelected: (image: UploadImage) => void };
  } & AvatarProps
) => {
  const { iconType, source, size, title, onPress, editProps, squred } = props;

  const { theme } = useTheme();
  let avatarIcon =
    iconType == "PET"
      ? { name: "pets", type: "materialicons" }
      : { name: "user", type: "antdesign" };

  const getFileName = (path: string) => {
    return path.substring(path.lastIndexOf("/") + 1);
  };

  const changeExtName = (filename: string, ext: string) => {
    const fileWithoutExt = filename.split(".").slice(0, -1).join(".");
    return `${fileWithoutExt}.${ext}`;
  };

  const processImage = async (uri: string) => {
    const file = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1000 } }],
      { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
    );
    return file;
  };

  const openImagePickerAsync = async () => {
    if (!editProps) {
      return;
    }
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

    const pPhoto = await processImage(image.uri);
    const img = {
      uri: pPhoto.uri,
      name: changeExtName(fileName, "jpg"),
      type: "image/jpg",
    };
    editProps.onImageSelected(img);
  };

  return (
    <RneAvatar
      icon={avatarIcon}
      rounded={!squred}
      size={size}
      title={title}
      source={{ uri: source?.uri }}
      containerStyle={[
        {
          borderWidth: 1,
          borderColor: theme.colors?.grey2,
          backgroundColor: theme.colors?.grey2,
        },
        props.containerStyle,
      ]}
      onPress={onPress}
    >
      {editProps ? (
        <RneAvatar.Accessory onPress={openImagePickerAsync} size={size / 3} />
      ) : null}
    </RneAvatar>
  );
};

export default Avatar;
