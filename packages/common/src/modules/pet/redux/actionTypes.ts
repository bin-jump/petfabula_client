import { createAsyncActionType } from '../../shared';

export const LoadMyPetsActionType = createAsyncActionType('PET_LOAD_MINE');
export const LoadPetActionType = createAsyncActionType('PET_LOAD_PET');

export const LoadFeederPetsActionType = createAsyncActionType(
  'PET_LOAD_FEEDER_PET',
);
export const LoadPetBreedsActionType = createAsyncActionType(
  'PET_LOAD_PET_BREEDS',
);
export const CreatePetsActionType = createAsyncActionType('PET_CREATE_PET');

export const UpdatePetActionType = createAsyncActionType('PET_UPDATE_PET');
export const RemovePetActionType = createAsyncActionType('PET_REMOVE_PET');

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

export const LoadPetDisorderRecordActionType = createAsyncActionType(
  'PET_LOAD_PET_DISORDER_RECORD',
);
export const LoadPetFeedRecordActionType = createAsyncActionType(
  'PET_LOAD_PET_FEED_RECORD',
);
export const LoadPetRecentFeedRecordActionType = createAsyncActionType(
  'PET_LOAD_PET_RECENT_FEED_RECORD',
);
export const LoadPetMedicalRecordActionType = createAsyncActionType(
  'PET_LOAD_PET_MEDICAL_RECORD',
);
export const LoadPetPetEventRecordActionType = createAsyncActionType(
  'PET_LOAD_PET_PET_EVENT_RECORD',
);
export const LoadPetWeightRecordActionType = createAsyncActionType(
  'PET_LOAD_PET_WEIGHT_RECORD',
);

export const UpdateDisorderRecordActionType = createAsyncActionType(
  'PET_UPDATE_DISORDER_RECORD',
);
export const UpdateFeedRecordActionType = createAsyncActionType(
  'PET_UPDATE_FEED_RECORD',
);
export const UpdateMedicalRecordActionType = createAsyncActionType(
  'PET_UPDATE_MEDICAL_RECORD',
);
export const UpdatePetEventRecordActionType = createAsyncActionType(
  'PET_UPDATE_PET_EVENT_RECORD',
);
export const UpdateWeightRecordActionType = createAsyncActionType(
  'PET_UPDATE_WEIGHT_RECORD',
);

export const RemoveDisorderRecordActionType = createAsyncActionType(
  'PET_REMOVE_DISORDER_RECORD',
);
export const RemoveFeedRecordActionType = createAsyncActionType(
  'PET_REMOVE_FEED_RECORD',
);
export const RemoveMedicalRecordActionType = createAsyncActionType(
  'PET_REMOVE_MEDICAL_RECORD',
);
export const RemovePetEventRecordActionType = createAsyncActionType(
  'PET_REMOVE_PET_EVENT_RECORD',
);
export const RemoveWeightRecordActionType = createAsyncActionType(
  'PET_REMOVE_WEIGHT_RECORD',
);
