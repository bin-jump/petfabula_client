import React from "react";
import { ImageBrowser } from "expo-image-picker-multiple";
import { View, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Icon, Image, useTheme } from "react-native-elements";
import { ImageFile } from "../../shared";

const MultipleImageSelect = ({
  images,
  fromScreen,
  onRemove,
}: {
  images: ImageFile[];
  fromScreen: string;
  onRemove: (index: number) => void;
}) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("ImageSelect", { fromScreen })}
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
        {images.map((item, index) => (
          <View key={item.name} style={{ alignItems: "flex-end" }}>
            <Icon
              onPress={() => {
                onRemove(index);
              }}
              containerStyle={{
                marginBottom: -24,
                zIndex: 2,
                marginRight: 3,
                backgroundColor: "#000",
                opacity: 0.5,
                borderRadius: 20,
              }}
              size={20}
              color={theme.colors?.grey3}
              type="Ionicons"
              name="close"
            />
            <Image
              key={item.name}
              source={{ uri: item.uri }}
              style={{ width: 92, height: 92, margin: 3 }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default MultipleImageSelect;
