import React, { useRef, useMemo, useCallback } from "react";
import {
  View,
  FlatList,
  ListRenderItem,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme, Text, Icon, Divider } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import {
  FeedRecord,
  useLoadFeedRecords,
  useRemoveFeedRecord,
} from "@petfabula/common";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  useFirstFocusEffect,
  toDateText,
  getTimeText,
  LoadingMoreIndicator,
  BottomSheetButton,
  BottomSheet,
  AlertAction,
  PendingOverlay,
} from "../../shared";
import {
  RecordBaseType,
  makeListData,
  RecordItem,
} from "./RecordListComponents";

type FeedRecordItemType = FeedRecord & RecordBaseType;

const Item = ({ record }: { record: FeedRecordItemType }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { removeFeedRecord } = useRemoveFeedRecord();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [200], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, [bottomSheetModalRef]);

  return (
    <View
      style={{
        flex: 1,
        // height: 100,
        padding: 12,
        backgroundColor: theme.colors?.white,
        borderRadius: 6,
        shadowColor: theme.colors?.grey2,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 3,
        elevation: 2,

        flexDirection: "row",
      }}
    >
      <BottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        handleClose={handleClose}
      >
        <View style={{ paddingHorizontal: 24 }}>
          <Divider />

          <View style={{ paddingTop: 16 }}>
            <View style={{ flexDirection: "row" }}>
              <BottomSheetButton
                label={t("common.edit")}
                type="antdesign"
                name="edit"
                onPress={() => {
                  navigation.navigate("CreateNew", {
                    screen: "CreateFeedRecord",
                    params: { record: record },
                  });

                  bottomSheetModalRef.current?.close();
                }}
              />

              <BottomSheetButton
                label={t("common.delete")}
                type="antdesign"
                name="delete"
                onPress={() => {
                  AlertAction.AlertDelele(t, () => {
                    removeFeedRecord(record.id);
                  });
                  handleClose();
                }}
              />
            </View>
          </View>
        </View>
      </BottomSheet>

      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon
              type="material-community"
              name="clock-time-seven-outline"
              size={20}
              color={theme.colors?.grey1}
            />
            <Text style={{ marginLeft: 6, color: theme.colors?.grey0 }}>
              {`${toDateText(record.dateTime)} ${getTimeText(record.dateTime)}`}
            </Text>
          </View>

          <TouchableWithoutFeedback onPress={handlePresentModalPress}>
            <Icon
              type="feather"
              name="more-vertical"
              size={20}
              color={theme.colors?.grey1}
            />
          </TouchableWithoutFeedback>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 3,
          }}
        >
          <Text style={{ marginTop: 3 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>{`${t(
              "pet.record.foodAmountLabel"
            )}:`}</Text>

            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {`${record.amount}g`}
            </Text>
            <Text style={{}}>{`　${record.foodContent}`}</Text>
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 3,
          }}
        >
          <Text style={{ fontWeight: "bold", color: theme.colors?.black }}>
            {`${t("pet.record.noteLabel")}:`}
          </Text>
          <Text numberOfLines={1} style={{ color: theme.colors?.black }}>
            {`${record.note}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const FeedRecordListItem = ({ record }: { record: FeedRecordItemType }) => {
  return (
    <RecordItem record={record}>
      <Item record={record} />
    </RecordItem>
  );
};

const FeedRecordList = ({ petId }: { petId: number }) => {
  const { theme } = useTheme();

  const {
    petId: recordPetId,
    pending,
    loadRecords,
    records,
    hasMore,
    nextCursor,
    error,
  } = useLoadFeedRecords();
  const { pending: removePending } = useRemoveFeedRecord();

  useFirstFocusEffect(() => {
    loadRecords(petId, null);
  }, [petId, loadRecords]);

  const keyExtractor = (item: FeedRecordItemType) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<FeedRecordItemType>>(
    ({ item }) => {
      return <FeedRecordListItem record={item} />;
    },
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <PendingOverlay pending={removePending} />
      <FlatList
        style={
          {
            // backgroundColor: theme.colors?.white,
          }
        }
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        keyExtractor={keyExtractor}
        data={makeListData(records)}
        renderItem={renderItem}
        ListFooterComponent={hasMore ? <LoadingMoreIndicator /> : null}
        onEndReached={() => {
          if (hasMore && !pending && !error) {
            loadRecords(petId, nextCursor);
          }
        }}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
};

export default FeedRecordList;
