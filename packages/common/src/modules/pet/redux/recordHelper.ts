type RecordBase = { id: number; dateTime: number };

function compare(a: RecordBase, b: RecordBase) {
  if (a.dateTime < b.dateTime) {
    return 1;
  }
  if (a.dateTime > b.dateTime) {
    return -1;
  }
  return 0;
}

export const sortRecords = <T extends RecordBase>(records: T[]) => {
  const map: { [key: number]: RecordBase } = {};
  records.forEach((item) => {
    map[item.id] = item;
  });

  records = Object.values(map) as T[];
  return records.sort(compare) as T[];
};
