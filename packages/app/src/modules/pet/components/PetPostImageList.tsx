import React, { useCallback } from "react";
import {
  View,
  FlatList,
  ListRenderItem,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme, Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useLoadPetPostImages, PostImage } from "@petfabula/common";
import {
  Image,
  LoadingMoreIndicator,
  toDateText,
  toDate,
  getMonthDateText,
  useRefocusEffect,
  useFirstFocusEffect,
} from "../../shared";

type ListItemType = {
  id: number;
  left: PostImage;
  middle: PostImage | null;
  right: PostImage | null;
};

const makeListData = (images: PostImage[]) => {
  const res: ListItemType[] = [];

  let item: any = null;
  for (let i = 0; i < images.length; i++) {
    const cur = images[i];
    if (!item) {
      item = { id: cur.id, left: cur, middle: null, right: null };
      continue;
    }

    if (!item.middle) {
      item.middle = cur;
    } else {
      item.right = cur;
    }

    if (i % 3 == 2 && item) {
      res.push(item);
      item = null;
    }
  }
  if (item) {
    res.push(item);
  }

  return res;
};

const RowItem = ({ item }: { item: ListItemType }) => {
  const { left, middle, right } = item;
  const { theme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View
      style={{
        flexDirection: "row",
        height: 120,
        flex: 1,
      }}
    >
      <Image
        onPress={() => {
          navigation.push("PostDetailView", { id: left.postId });
        }}
        source={{ uri: left.url }}
        containerStyle={{ flex: 1, margin: 1 }}
      />
      {middle ? (
        <Image
          onPress={() => {
            navigation.push("PostDetailView", { id: middle.postId });
          }}
          source={{ uri: middle.url }}
          containerStyle={{ flex: 1, margin: 1 }}
        />
      ) : (
        <View style={{ flex: 1 }} />
      )}
      {right ? (
        <Image
          onPress={() => {
            navigation.push("PostDetailView", { id: right.postId });
          }}
          source={{ uri: right.url }}
          containerStyle={{ flex: 1, margin: 1 }}
        />
      ) : (
        <View style={{ flex: 1 }} />
      )}
    </View>
  );
};

const PetPostImages = ({ petId }: { petId: number }) => {
  const { theme } = useTheme();

  const {
    petId: postPetId,
    images,
    loadPetPostImages,
    hasMore,
    pending,
    error,
    nextCursor,
  } = useLoadPetPostImages();

  useFirstFocusEffect(() => {
    loadPetPostImages(petId, null);
  }, [petId, loadPetPostImages]);

  useRefocusEffect(() => {
    if (petId != postPetId) {
      loadPetPostImages(petId, null);
    }
  }, [petId, postPetId, loadPetPostImages]);

  const keyExtractor = (item: ListItemType) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<ListItemType>>(({ item }) => {
    return <RowItem item={item} />;
  }, []);

  return (
    <FlatList
      //   style={{ backgroundColor: theme.colors?.white }}
      contentContainerStyle={{
        paddingTop: 20,
        paddingBottom: 40,
      }}
      keyExtractor={keyExtractor}
      data={makeListData(images)}
      renderItem={renderItem}
      ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
      onEndReached={() => {
        if (hasMore && !pending && !error) {
          loadPetPostImages(petId, nextCursor);
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
};

export default PetPostImages;
