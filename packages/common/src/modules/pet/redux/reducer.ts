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
  editPet: { data: null, pending: false, error: null },
  removePet: { data: null, pending: false, error: null },

  createDisorderRecord: { data: null, pending: false, error: null },
  createFeedRecord: { data: null, pending: false, error: null },
  createMedicalRecord: { data: null, pending: false, error: null },
  createPetEventRecord: { data: null, pending: false, error: null },
  createWeightRecord: { data: null, pending: false, error: null },

  updateFeedRecord: { data: null, pending: false, error: null },
  updateWeightRecord: { data: null, pending: false, error: null },
  updateDisorderRecord: { data: null, pending: false, error: null },
  updateMedicalRecord: { data: null, pending: false, error: null },
  updatePetEventRecord: { data: null, pending: false, error: null },

  removeFeedRecord: { data: null, pending: false, error: null },
  removeWeightRecord: { data: null, pending: false, error: null },
  removeDisorderRecord: { data: null, pending: false, error: null },
  removeMedicalRecord: { data: null, pending: false, error: null },
  removePetEventRecord: { data: null, pending: false, error: null },

  petDisorderRecords: {
    petId: null,
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  petFeedRecords: {
    petId: null,
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  petMedicalRecords: {
    petId: null,
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  petPetEventRecords: {
    petId: null,
    data: [],
    pending: false,
    error: null,
    hasMore: false,
    nextCursor: null,
    initializing: false,
  },
  petWeightRecords: {
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
