import React, { useRef, useMemo, useCallback } from "react";
import {
  View,
  ListRenderItem,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { useTheme, Text, Icon, Divider } from "react-native-elements";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import {
  FeedRecord,
  useLoadFeedRecords,
  useLoadRecentFeedRecords,
  useRemoveFeedRecord,
} from "@petfabula/common";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { LineChart } from "react-native-chart-kit";
import {
  useFirstFocusEffect,
  getMonthDateText,
  formatNumber,
  LoadingMoreIndicator,
  BottomSheetButton,
  BottomSheet,
  AlertAction,
  PendingOverlay,
  ActivityIndicator,
  FlatList,
  sameDay,
} from "../../shared";
import {
  RecordBaseType,
  makeListData,
  RecordItem,
  DateItem,
  TimeItem,
} from "./RecordListComponents";

const getGraphDate = (records: FeedRecord[]) => {
  const res: { labels: string[]; amounts: number[] } = {
    labels: [],
    amounts: [],
  };
  if (records.length == 0) {
    return res;
  }

  let prev = records[0].dateTime;
  let amount = 0;
  for (let r of records) {
    if (sameDay(prev, r.dateTime)) {
      amount += r.amount;
    } else {
      res.labels.push(getMonthDateText(prev));
      res.amounts.push(amount);
      amount = r.amount;
    }
    prev = r.dateTime;
  }

  res.labels.push(getMonthDateText(records[records.length - 1].dateTime));
  res.amounts.push(amount);

  res.labels = res.labels.reverse();
  res.amounts = res.amounts.reverse();

  return res;
};

type FeedRecordItemType = FeedRecord & RecordBaseType;

const Content = ({ content }: { content: string }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return content && content.length > 0 ? (
    <Text
      style={{ fontSize: 18, color: theme.colors?.grey0, marginTop: 6 }}
    >{`${content}`}</Text>
  ) : (
    <Text style={{ color: theme.colors?.grey1, fontSize: 18 }}>
      {t("pet.record.emptyContent")}
    </Text>
  );
};

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
        borderRadius: 12,
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
                    screen: "CreatePetFeedRecord",
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
          <DateItem mili={record.dateTime} />
          <TouchableWithoutFeedback onPress={handlePresentModalPress}>
            <Icon
              type="feather"
              name="more-vertical"
              size={20}
              color={theme.colors?.grey1}
            />
          </TouchableWithoutFeedback>
        </View>
        <TimeItem mili={record.dateTime} />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Text style={{ lineHeight: 30 }}>
            <Text
              style={{ fontWeight: "bold", fontSize: 20, lineHeight: 30 }}
            >{`${t("pet.record.foodAmountLabel")}:  `}</Text>

            <Text
              style={{
                lineHeight: 30,
                fontWeight: "bold",
                fontSize: 24,
                color: theme.colors?.primary,
              }}
            >
              {`${formatNumber(record.amount)}`}
            </Text>
            <Text style={{ fontSize: 18 }}>{` g`}</Text>
          </Text>
        </View>

        {record.foodContent.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{`${t(
              "pet.record.foodContentLabel"
            )} `}</Text>

            <Content content={record.foodContent} />
          </View>
        )}

        {record.note.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <Text
              style={{
                fontWeight: "bold",
                color: theme.colors?.black,
                fontSize: 18,
              }}
            >
              {`${t("pet.record.noteLabel")}`}
            </Text>
            <Content content={record.note} />
          </View>
        )}
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

const FeedGraph = ({ petId }: { petId: number }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const {
    petId: recordPetId,
    loadRecords,
    pending,
    records,
  } = useLoadRecentFeedRecords();
  const grpahData = getGraphDate(records);

  useFirstFocusEffect(() => {
    loadRecords(petId);
  }, [petId, loadRecords]);

  return (
    <View
      style={{
        paddingVertical: 12,
        alignItems: "center",
        backgroundColor: theme.colors?.white,
        height: 260,
      }}
    >
      <Text style={{ fontWeight: "bold" }}>{t("pet.record.recentFeeds")}</Text>
      {!pending && petId == recordPetId && records.length == 0 && (
        <Text style={{ marginTop: 100 }}>{t("pet.record.noGraphData")}</Text>
      )}
      {petId != recordPetId && (
        <ActivityIndicator
          size={20}
          style={{ marginTop: 100 }}
          color={theme.colors?.primary}
        />
      )}
      {petId == recordPetId && records.length > 0 && (
        <LineChart
          data={{
            labels: grpahData.labels,
            datasets: [
              {
                data: grpahData.amounts,
              },
            ],
          }}
          renderDotContent={({ x, y, index }) => (
            <Text
              key={index}
              style={{
                position: "absolute",
                paddingTop: y + 3,
                paddingLeft: x - 3,
                fontSize: 12,
              }}
            >
              {formatNumber(grpahData.amounts[index])}
            </Text>
          )}
          width={Dimensions.get("window").width - 30} // from react-native
          height={220}
          yAxisInterval={1} // optional, defaults to 1
          formatYLabel={(y) => `${formatNumber(parseInt(y))} g`}
          fromZero
          chartConfig={{
            backgroundColor: theme.colors?.secondary,
            backgroundGradientFrom: theme.colors?.white,
            backgroundGradientTo: theme.colors?.white,
            decimalPlaces: 0,
            color: (opacity = 1) =>
              theme.colors?.primary ? theme.colors?.primary : `#333`,
            labelColor: (opacity = 1) => `#333`,
            style: {
              borderRadius: 10,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              // stroke: "#ffa726",
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 10,
          }}
        />
      )}
    </View>
  );
};

const FeedRecordList = ({ petId }: { petId: number }) => {
  const { theme } = useTheme();

  const {
    petId: recordPetId,
    pending,
    initializing,
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

  if (recordPetId != petId) {
    return <ActivityIndicator style={{ marginTop: 12 }} />;
  }

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
        ListHeaderComponent={<FeedGraph petId={petId} />}
        pending={initializing}
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
