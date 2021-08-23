import React, { useCallback } from "react";
import { View, FlatList, ListRenderItem } from "react-native";
import { useTheme, Text, Icon } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { FeedRecord, useLoadFeedRecords } from "@petfabula/common";
import {
  useFirstFocusEffect,
  toDateText,
  getTimeText,
  LoadingMoreIndicator,
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
      <View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
  );
};

export default FeedRecordList;
