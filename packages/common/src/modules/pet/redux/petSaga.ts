import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
  LoadMyPetsActionType,
  LoadPetActionType,
  LoadFeederPetsActionType,
  CreatePetsActionType,
  UpdatePetActionType,
  RemovePetActionType,
  LoadPetBreedsActionType,
} from './actionTypes';

const watchCreatePet = createSagaWatcher({
  url: `/api/pet/pets`,
  method: 'POST',
  asyncAction: CreatePetsActionType,
  watchType: 'EVERY',
});

const watchUpdatePet = createSagaWatcher({
  url: `/api/pet/pets`,
  method: 'PUT',
  asyncAction: UpdatePetActionType,
  watchType: 'EVERY',
});

const watchRemovePet = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/pet/pets/${payload.petId}`;
  },
  method: 'DELETE',
  asyncAction: RemovePetActionType,
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

const watchLoadPetDetail = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/pet/pets/${payload.petId}`;
  },
  method: 'GET',
  asyncAction: LoadPetActionType,
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
    fork(watchCreatePet),
    fork(watchUpdatePet),
    fork(watchRemovePet),
    fork(watchLoadPetBreeds),
    fork(watchLoadMyPets),
    fork(watchLoadPetDetail),
    fork(watchLoadFeederPets),
  ]);
}
