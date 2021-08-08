import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
  LoadMyPetsActionType,
  LoadFeederPetsActionType,
  CreatePetsActionType,
  LoadPetBreedsActionType,
} from './actionTypes';

const watchCreatePets = createSagaWatcher({
  url: `/api/pet/pets`,
  method: 'POST',
  asyncAction: CreatePetsActionType,
  watchType: 'EVERY',
});

const watchLoadPetBreeds = createSagaWatcher({
  url: `/api/pet/breeds`,
  method: 'GET',
  asyncAction: LoadPetBreedsActionType,
  watchType: 'LATEST',
});

const watchLoadMyPets = createSagaWatcher({
  url: `/api/pet/pets`,
  method: 'GET',
  asyncAction: LoadMyPetsActionType,
  watchType: 'LATEST',
});

const watchLoadFeederPets = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/pet/feeders/${payload.feederId}/pets`;
  },
  method: 'GET',
  asyncAction: LoadFeederPetsActionType,
  watchType: 'LATEST',
});

export function* petRootSaga() {
  yield all([
    fork(watchCreatePets),
    fork(watchLoadPetBreeds),
    fork(watchLoadMyPets),
    fork(watchLoadFeederPets),
  ]);
}
