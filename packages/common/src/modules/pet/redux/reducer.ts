import { createReducer, ActionBase } from '../../shared';
import { PetState } from './types';
import { petReducer } from './petHooks';
import { feedRecordReducer } from './feedRecordHooks';
import { weightRecordReducer } from './weightRecordHooks';
import { disorderRecordReducer } from './disorderRecordHooks';
import { petEventRecordReducer } from './petEventHookts';
import { medicalRecordReducer } from './medicalRecordHooks';

const initialStat: PetState = {
  myPets: { data: [], pending: false, error: null },
  pet: { data: null, pending: false, error: null },

  feederPets: { data: [], feederId: null, pending: false, error: null },
  petBreeds: { data: [], pending: false, error: null },

  createPet: { data: null, pending: false, error: null },
  createDisorderRecord: { data: null, pending: false, error: null },
  createFeedRecord: { data: null, pending: false, error: null },
  createMedicalRecord: { data: null, pending: false, error: null },
  createPetEventRecord: { data: null, pending: false, error: null },
  createWeightRecord: { data: null, pending: false, error: null },

  myPetDisorderRecords: {
    petId: null,
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  myPetFeedRecords: {
    petId: null,
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  myPetMedicalRecords: {
    petId: null,
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  myPetPetEventRecords: {
    petId: null,
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  myPetWeightRecords: {
    petId: null,
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
};

export const petRootReducer = createReducer<PetState, ActionBase>(initialStat, {
  ...petReducer,
  ...feedRecordReducer,
  ...weightRecordReducer,
  ...disorderRecordReducer,
  ...petEventRecordReducer,
  ...medicalRecordReducer,
});
