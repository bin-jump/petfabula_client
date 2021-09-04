import {
  AsyncDataBase,
  AsyncListBase,
  AsyncCursorPageListBase,
  DisplayImage,
  AlreadyDeleted,
} from '../../shared';

type UserGender = 'MALE' | 'FEMALE' | 'OTHER';

export interface City {
  id: number;
  name: string;
  prefectureName: string;
  prefectureId: number;
}

export interface Account {
  id: number;
  name: string;
  photo: string;
  birthday: number | null;
  gender: UserGender | null;
  bio: string | null;
  cityId: number | null;
  city: City | null;
}

export interface NotifySetting {
  receiveAnswerComment: boolean;
  receiveFollow: boolean;
  receiveUpvote: boolean;
}

export interface UserState {
  myAccount: AsyncDataBase<Account>;
  updateAccount: AsyncDataBase<Account>;
  cities: AsyncListBase<City>;

  myNotifySetting: AsyncDataBase<NotifySetting>;
  updateNotifySetting: AsyncDataBase<NotifySetting>;
}
