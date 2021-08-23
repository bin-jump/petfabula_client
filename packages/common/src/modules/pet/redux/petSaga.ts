import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
  LoadMyPetsActionType,
  LoadPetActionType,
  LoadFeederPetsActionType,
  CreatePetsActionType,
  LoadPetBreedsActionType,
  CreateFeedRecordActionType,
  CreateWeightRecordActionType,
  CreateDisorderRecordActionType,
  CreatePetEventRecordActionType,
  CreateMedicalRecordActionType,
  LoadPetFeedRecordActionType,
  LoadPetWeightRecordActionType,
  LoadPetDisorderRecordActionType,
  LoadPetPetEventRecordActionType,
  LoadPetMedicalRecordActionType,
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

const watchCreateFeedRecord = createSagaWatcher({
  url: `/api/pet/feedrecords`,
  method: 'POST',
  asyncAction: CreateFeedRecordActionType,
  watchType: 'EVERY',
});

const watchCreateWeightRecord = createSagaWatcher({
  url: `/api/pet/weightrecords`,
  method: 'POST',
  asyncAction: CreateWeightRecordActionType,
  watchType: 'EVERY',
});

const watchCreateDisordertRecord = createSagaWatcher({
  url: `/api/pet/disorderrecords`,
  method: 'POST',
  asyncAction: CreateDisorderRecordActionType,
  watchType: 'EVERY',
});

const watchCreatePetEventRecord = createSagaWatcher({
  url: `/api/pet/peteventrecords`,
  method: 'POST',
  asyncAction: CreatePetEventRecordActionType,
  watchType: 'EVERY',
});

const watchCreateMedicalRecord = createSagaWatcher({
  url: `/api/pet/medicalrecords`,
  method: 'POST',
  asyncAction: CreateMedicalRecordActionType,
  watchType: 'EVERY',
});

const watchLoadFeedRecords = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/pet/pets/${payload.petId}/feedrecords`;
  },
  method: 'GET',
  asyncAction: LoadPetFeedRecordActionType,
  watchType: 'LATEST',
});

const watchLoadWeightRecords = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/pet/pets/${payload.petId}/weightrecords`;
  },
  method: 'GET',
  asyncAction: LoadPetWeightRecordActionType,
  watchType: 'LATEST',
});

const watchLoadDisorderRecords = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/pet/pets/${payload.petId}/disorderrecords`;
  },
  method: 'GET',
  asyncAction: LoadPetDisorderRecordActionType,
  watchType: 'LATEST',
});

const watchLoadPetEventRecords = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/pet/pets/${payload.petId}/peteventrecords`;
  },
  method: 'GET',
  asyncAction: LoadPetPetEventRecordActionType,
  watchType: 'LATEST',
});

const watchLoadMedicalRecords = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/pet/pets/${payload.petId}/medicalrecords`;
  },
  method: 'GET',
  asyncAction: LoadPetMedicalRecordActionType,
  watchType: 'LATEST',
});

export function* petRootSaga() {
  yield all([
    fork(watchCreatePets),
    fork(watchLoadPetBreeds),
    fork(watchLoadMyPets),
    fork(watchLoadPetDetail),
    fork(watchLoadFeederPets),

    fork(watchCreateFeedRecord),
    fork(watchCreateWeightRecord),
    fork(watchCreateDisordertRecord),
    fork(watchCreatePetEventRecord),
    fork(watchCreateMedicalRecord),

    fork(watchLoadFeedRecords),
    fork(watchLoadWeightRecords),
    fork(watchLoadDisorderRecords),
    fork(watchLoadPetEventRecords),
    fork(watchLoadMedicalRecords),
  ]);
}
