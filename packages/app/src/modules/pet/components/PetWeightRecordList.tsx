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
  WeightRecord,
  useLoadWeightRecords,
  useRemoveWeightRecord,
} from "@petfabula/common";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  useFirstFocusEffect,
  getMonthDateText,
  LoadingMoreIndicator,
  BottomSheetButton,
  BottomSheet,
  AlertAction,
  PendingOverlay,
  ActivityIndicator,
  FlatList,
  formatNumber,
  sameDay,
} from "../../shared";
import {
  RecordBaseType,
  makeListData,
  RecordItem,
  DateItem,
} from "./RecordListComponents";
import { LineChart } from "react-native-chart-kit";

// const PNUM = 1;
// const makeGraphLabels = () => {
//   const res: string[] = [];

//   for (let i = 0; i < PNUM; i++) {
//     let d = Date.now() - (6 - i) * 7 * 24 * 3600 * 1000;
//     res.push(getMonthDateText(d));
//   }
//   return res;
// };

// const makeGraphData = () => {
//   const res: number[] = [];

//   for (let i = 0; i < PNUM; i++) {
//     const w = Math.floor(Math.random() * (4000 - 3000)) + 3000;
//     res.push(w);
//   }

//   return res;
// };

const getGraphDate = (records: WeightRecord[]) => {
  let selectedRecords = [];

  let prev = new Date(0).getMilliseconds();
  let cnt = 0;
  for (let r of records) {
    if (!sameDay(prev, r.dateTime)) {
      selectedRecords.push(r);
      cnt += 1;
    }
    if (cnt >= 7) {
      break;
    }
    prev = r.dateTime;
  }

  selectedRecords = selectedRecords.reverse();
  const res: { labels: string[]; weights: number[] } = {
    labels: [],
    weights: [],
  };
  for (let r of selectedRecords) {
    res.labels.push(getMonthDateText(r.dateTime));
    res.weights.push(r.weight);
  }

  return res;
};

type RecordItemType = WeightRecord & RecordBaseType;

const Item = ({ record }: { record: RecordItemType }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { removeWeightRecord } = useRemoveWeightRecord();

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
        // minHeight: 100,
        padding: 12,
        backgroundColor: theme.colors?.white,
        borderRadius: 16,
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
                    screen: "CreatePetWeightRecord",
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
                    removeWeightRecord(record.id);
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 6,
          }}
        >
          <Text style={{ marginTop: 3, lineHeight: 30 }}>
            <Text
              style={{ fontWeight: "bold", fontSize: 20, lineHeight: 30 }}
            >{`${t("pet.record.weightLabel")}:  `}</Text>
            <Text
              style={{
                lineHeight: 30,
                fontWeight: "bold",
                fontSize: 24,
                color: theme.colors?.primary,
              }}
            >
              {`${formatNumber(record.weight)}`}
            </Text>
            <Text
              style={{ fontSize: 18, lineHeight: 30, fontWeight: "bold" }}
            >{` g`}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const RecordListItem = ({ record }: { record: RecordItemType }) => {
  return (
    <RecordItem record={record}>
      <Item record={record} />
    </RecordItem>
  );
};

const WeightGraph = ({ petId }: { petId: number }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { petId: recordPetId, pending, records } = useLoadWeightRecords();
  const grpahData = getGraphDate(records);

  return (
    <View
      style={{
        paddingVertical: 12,
        alignItems: "center",
        backgroundColor: theme.colors?.white,
        height: 260,
      }}
    >
      <Text style={{ fontWeight: "bold" }}>
        {t("pet.record.recentWeights")}
      </Text>
      {!pending && petId == recordPetId && records.length == 0 && (
        <Text style={{ marginTop: 100 }}>no data</Text>
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
                data: grpahData.weights,
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
              {formatNumber(grpahData.weights[index])}
            </Text>
          )}
          width={Dimensions.get("window").width - 20} // from react-native
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
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              // stroke: "#ffa726",
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      )}
    </View>
  );
};

const PetWeightRecordList = ({ petId }: { petId: number }) => {
  const { theme } = useTheme();

  const {
    petId: recordPetId,
    initializing,
    pending,
    loadRecords,
    records,
    hasMore,
    nextCursor,
    error,
  } = useLoadWeightRecords();
  const { pending: removePending } = useRemoveWeightRecord();

  useFirstFocusEffect(() => {
    loadRecords(petId, null);
  }, [petId, loadRecords]);

  const keyExtractor = (item: RecordItemType) => item.id.toString();

  const renderItem = useCallback<ListRenderItem<RecordItemType>>(({ item }) => {
    return <RecordListItem record={item} />;
  }, []);

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
        ListHeaderComponent={<WeightGraph petId={petId} />}
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

export default PetWeightRecordList;
