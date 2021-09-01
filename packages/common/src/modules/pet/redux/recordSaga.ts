import { all, fork } from 'redux-saga/effects';
import { createSagaWatcher } from '../../shared';
import {
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
  UpdateDisorderRecordActionType,
  UpdateFeedRecordActionType,
  UpdateMedicalRecordActionType,
  UpdatePetEventRecordActionType,
  UpdateWeightRecordActionType,
  RemoveMedicalRecordActionType,
  RemoveDisorderRecordActionType,
  RemoveFeedRecordActionType,
  RemovePetEventRecordActionType,
  RemoveWeightRecordActionType,
} from './actionTypes';

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

const watchUpdateDisordertRecord = createSagaWatcher({
  url: `/api/pet/disorderrecords`,
  method: 'PUT',
  asyncAction: UpdateDisorderRecordActionType,
  watchType: 'EVERY',
});

const watchUpdateFeedRecord = createSagaWatcher({
  url: `/api/pet/feedrecords`,
  method: 'PUT',
  asyncAction: UpdateFeedRecordActionType,
  watchType: 'EVERY',
});

const watchUpdateMedicalRecord = createSagaWatcher({
  url: `/api/pet/medicalrecords`,
  method: 'PUT',
  asyncAction: UpdateMedicalRecordActionType,
  watchType: 'EVERY',
});

const watchUpdatePetEventRecord = createSagaWatcher({
  url: `/api/pet/peteventrecords`,
  method: 'PUT',
  asyncAction: UpdatePetEventRecordActionType,
  watchType: 'EVERY',
});

const watchUpdateWeightRecord = createSagaWatcher({
  url: `/api/pet/weightrecords`,
  method: 'PUT',
  asyncAction: UpdateWeightRecordActionType,
  watchType: 'EVERY',
});

const watchRemoveDisorderRecord = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/pet/disorderrecords/${payload.recordId}`;
  },
  method: 'DELETE',
  asyncAction: RemoveDisorderRecordActionType,
  watchType: 'EVERY',
});

const watchRemoveFeedRecord = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/pet/feedrecords/${payload.recordId}`;
  },
  method: 'DELETE',
  asyncAction: RemoveFeedRecordActionType,
  watchType: 'EVERY',
});

const watchRemoveMedicalRecord = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/pet/medicalrecords/${payload.recordId}`;
  },
  method: 'DELETE',
  asyncAction: RemoveMedicalRecordActionType,
  watchType: 'EVERY',
});

const watchRemovePetEventRecord = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/pet/peteventrecords/${payload.recordId}`;
  },
  method: 'DELETE',
  asyncAction: RemovePetEventRecordActionType,
  watchType: 'EVERY',
});

const watchRemoveWeightRecord = createSagaWatcher({
  createUrl: (payload) => {
    return `/api/pet/weightrecords/${payload.recordId}`;
  },
  method: 'DELETE',
  asyncAction: RemoveWeightRecordActionType,
  watchType: 'EVERY',
});

export function* petRecordRootSaga() {
  yield all([
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

    fork(watchUpdateDisordertRecord),
    fork(watchUpdateFeedRecord),
    fork(watchUpdateMedicalRecord),
    fork(watchUpdatePetEventRecord),
    fork(watchUpdateWeightRecord),

    fork(watchRemoveDisorderRecord),
    fork(watchRemoveFeedRecord),
    fork(watchRemoveMedicalRecord),
    fork(watchRemovePetEventRecord),
    fork(watchRemoveWeightRecord),
  ]);
}
