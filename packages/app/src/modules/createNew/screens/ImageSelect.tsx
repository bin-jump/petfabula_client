import React from "react";
import { ImageBrowser } from "expo-image-picker-multiple";
import * as ImageManipulator from "expo-image-manipulator";
import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { ImageFile } from "../../shared";
import ParamTypes from "./paramTypes";

export default function ImageSelect() {
  const IMAGE_NUM_LIMIT = 6;
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { params } = useRoute<RouteProp<ParamTypes, "ImageSelect">>();
  const backScreenName = params.fromScreen;

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

  const _renderDoneButton = (count: any, onSubmit: any) => {
    if (!count) return null;
    return (
      <TouchableOpacity style={{ marginRight: 10 }} onPress={onSubmit}>
        <Text onPress={onSubmit} style={{ fontSize: 18 }}>
          {t("common.done")}
        </Text>
      </TouchableOpacity>
    );
  };

  const updateHandler = (count: any, onSubmit: any) => {
    navigation.setOptions({
      title: `${count}/${IMAGE_NUM_LIMIT}`,
      headerRight: () => _renderDoneButton(count, onSubmit),
    });
  };

  const imagesCallback = (callback: any) => {
    callback
      .then(async (photos: any) => {
        const cPhotos = [];
        for (let photo of photos) {
          const pPhoto = await processImage(photo.uri);
          const p: ImageFile = {
            uri: pPhoto.uri,
            name: changeExtName(photo.filename, "jpg"),
            type: "image/jpg",
          };
          cPhotos.push(p);
        }
        navigation.navigate(backScreenName, { images: cPhotos });
      })
      .catch((e: any) => console.log(e));
  };

  return (
    <View style={{ height: "100%" }}>
      <ImageBrowser
        max={IMAGE_NUM_LIMIT}
        onChange={updateHandler}
        callback={imagesCallback}
      />
    </View>
  );
}
