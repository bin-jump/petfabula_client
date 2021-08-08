import { createAsyncActionType } from '../../shared';

export const LoadMyPetsActionType = createAsyncActionType('PET_LOAD_MINE');
export const LoadFeederPetsActionType = createAsyncActionType(
  'PET_LOAD_FEEDER_PET',
);
export const LoadPetBreedsActionType = createAsyncActionType(
  'PET_LOAD_PET_BREEDS',
);
export const CreatePetsActionType = createAsyncActionType('PET_CREATE_PET');

export const CreateDisorderRecordActionType = createAsyncActionType(
  'PET_CREATE_DISORDER_RECORD',
);
export const CreateFeedRecordActionType = createAsyncActionType(
  'PET_CREATE_FEED_RECORD',
);
export const CreateMedicalRecordActionType = createAsyncActionType(
  'PET_CREATE_MEDICAL_RECORD',
);
export const CreatePetEventRecordActionType = createAsyncActionType(
  'PET_CREATE_PET_EVENT_RECORD',
);
export const CreateWeightRecordActionType = createAsyncActionType(
  'PET_CREATE_WEIGHT_RECORD',
);

export const LoadMyPetDisorderRecordActionType = createAsyncActionType(
  'PET_LOAD_MY_PET_DISORDER_RECORD',
);
export const LoadMyPetFeedRecordActionType = createAsyncActionType(
  'PET_LOAD_MY_PET_FEED_RECORD',
);
export const LoadMyPetMedicalRecordActionType = createAsyncActionType(
  'PET_LOAD_MY_PET_MEDICAL_RECORD',
);
export const LoadMyPetPetEventRecordActionType = createAsyncActionType(
  'PET_LOAD_MY_PET_PET_EVENT_RECORD',
);
export const LoadMyPetWeightRecordActionType = createAsyncActionType(
  'PET_LOAD_MY_PET_WEIGHT_RECORD',
);
