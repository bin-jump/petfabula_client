import React, { useCallback, useEffect, forwardRef } from "react";
import {
  View,
  TouchableWithoutFeedback,
  FlatList,
  ListRenderItem,
} from "react-native";
import { useTheme, Text, Divider, Icon } from "react-native-elements";
import {
  toDate,
  toDateText,
  getMonthDateText,
  getTimeText,
} from "../../shared";

export type RecordBaseType = { dateTime: number };

type Props = {
  record: any;
  children: React.ReactNode;
};

export const makeListData = (records: RecordBaseType[]) => {
  const res: any[] = [];
  if (records.length == 0) {
    return res;
  }

  let date = "";
  for (let r of records) {
    const item = { ...r, showDate: false };
    let curDate = toDateText(r.dateTime);
    if (curDate != date) {
      item.showDate = true;
      date = curDate;
    }
    // item.showDate = true;
    res.push(item);
  }

  return res;
};

export const RecordItem: React.FC<Props> = ({ children, record }: Props) => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      {record.showDate ? (
        <View
          style={{ flexDirection: "row", alignItems: "center", height: 36 }}
        >
          <View
            style={{
              marginLeft: 11,
              borderRadius: 20,
              height: 20,
              width: 20,
              backgroundColor: theme.colors?.white,
              borderWidth: 4,
              borderColor: theme.colors?.grey1,
            }}
          />
          <Text
            style={{
              marginLeft: 8,
              fontSize: 18,
              fontWeight: "bold",
              color: theme.colors?.grey0,
            }}
          >
            {`${toDateText(record.dateTime)}`}
          </Text>
        </View>
      ) : null}

      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      >
        <View style={{ width: 40 }}>
          <View
            style={{
              marginLeft: 20,
              width: 3,
              backgroundColor: theme.colors?.grey3,
              flex: 1,
            }}
          />
        </View>
        <View style={{ paddingVertical: 8, paddingRight: 16, flex: 1 }}>
          {children}
        </View>
      </View>
    </View>
  );
};

export const DateItem = ({ mili }: { mili: number }) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Icon
        type="material-community"
        name="calendar-outline"
        size={22}
        color={theme.colors?.grey1}
      />
      <Text style={{ marginLeft: 6, color: theme.colors?.grey0 }}>
        {`${toDateText(mili)}`}
      </Text>
    </View>
  );
};

export const TimeItem = ({ mili }: { mili: number }) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        marginTop: 6,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Icon
        type="material-community"
        name="clock-time-seven-outline"
        size={22}
        color={theme.colors?.grey1}
      />
      <Text
        style={{ marginLeft: 6, color: theme.colors?.grey0, marginRight: 6 }}
      >
        {`${getTimeText(mili)}`}
      </Text>
    </View>
  );
};
