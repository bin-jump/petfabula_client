import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { PetState, PetEventRecordForm, PetEventRecord } from './types';
import {
  CreatePetEventRecordActionType,
  LoadPetPetEventRecordActionType,
  UpdatePetEventRecordActionType,
  RemovePetEventRecordActionType,
} from './actionTypes';
import { ActionBase, UploadImage, fillCursorResponseData } from '../../shared';
import { sortRecords } from './recordHelper';

export const useCreatePetEventRecord = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.pet.createPetEventRecord.data,
      pending: state.pet.createPetEventRecord.pending,
      error: state.pet.createPetEventRecord.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (data: PetEventRecordForm, images: UploadImage[]) => {
      const d = new FormData();
      d.append('record', JSON.stringify(data));
      for (const image of images) {
        if (image) {
          d.append('images', {
            uri: image.uri,
            name: image.name,
            type: image.type,
          } as any);
        }
      }

      dispatch({
        type: CreatePetEventRecordActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    createPetEventRecord: boundAction,
    result,
    pending,
    error,
  };
};

export const useUpdatePetEventRecord = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.pet.updatePetEventRecord.data,
      pending: state.pet.updatePetEventRecord.pending,
      error: state.pet.updatePetEventRecord.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (data: PetEventRecord, images: UploadImage[]) => {
      const d = new FormData();
      d.append('record', JSON.stringify(data));
      for (const image of images) {
        if (image) {
          d.append('images', {
            uri: image.uri,
            name: image.name,
            type: image.type,
          } as any);
        }
      }

      dispatch({
        type: UpdatePetEventRecordActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    updatePetEventRecord: boundAction,
    result,
    pending,
    error,
  };
};

export const useRemovePetEventRecord = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.pet.removePetEventRecord.data,
      pending: state.pet.removePetEventRecord.pending,
      error: state.pet.removePetEventRecord.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (recordId: number) => {
      dispatch({
        type: RemovePetEventRecordActionType.BEGIN,
        payload: { recordId },
      });
    },
    [dispatch],
  );

  return {
    removePetEventRecord: boundAction,
    result,
    pending,
    error,
  };
};

export const useLoadPetEventRecords = () => {
  const dispatch = useDispatch();
  const { petId, records, hasMore, nextCursor, initializing, pending, error } =
    useSelector(
      (state: AppState) => ({
        petId: state.pet.petPetEventRecords.petId,
        records: state.pet.petPetEventRecords.data,
        pending: state.pet.petPetEventRecords.pending,
        error: state.pet.petPetEventRecords.error,
        hasMore: state.pet.petPetEventRecords.hasMore,
        nextCursor: state.pet.petPetEventRecords.nextCursor,
        initializing: state.pet.petPetEventRecords.initializing,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (petId: number, cursor: object | null) => {
      dispatch({
        type: LoadPetPetEventRecordActionType.BEGIN,
        payload: { petId, cursor },
      });
    },
    [dispatch],
  );

  return {
    petId,
    loadRecords: boundAction,
    records,
    initializing,
    hasMore,
    nextCursor,
    pending,
    error,
  };
};

export const petEventRecordReducer = {
  [CreatePetEventRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      createPetEventRecord: {
        ...state.createPetEventRecord,
        pending: true,
        error: null,
      },
    };
  },
  [CreatePetEventRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    const records = state.petPetEventRecords.data;
    return {
      ...state,
      createPetEventRecord: {
        ...state.createPetEventRecord,
        pending: false,
        data: action.payload,
      },
      petPetEventRecords: {
        ...state.petPetEventRecords,
        data:
          state.petPetEventRecords.petId == action.payload.petId
            ? sortRecords<PetEventRecord>([action.payload, ...records])
            : records,
      },
    };
  },
  [CreatePetEventRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      createPetEventRecord: {
        ...state.createPetEventRecord,
        pending: false,
        error: action.error,
      },
    };
  },

  [UpdatePetEventRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      updatePetEventRecord: {
        ...state.updatePetEventRecord,
        pending: true,
        error: null,
      },
    };
  },
  [UpdatePetEventRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    const records = state.petPetEventRecords.data;
    return {
      ...state,
      updatePetEventRecord: {
        ...state.updatePetEventRecord,
        pending: false,
        data: action.payload,
      },
      petPetEventRecords: {
        ...state.petPetEventRecords,
        data:
          state.petPetEventRecords.petId == action.payload.petId
            ? sortRecords<PetEventRecord>(
                records.map((item) => {
                  if (item.id == action.payload.id) {
                    return action.payload;
                  }
                  return item;
                }),
              )
            : records,
      },
    };
  },
  [UpdatePetEventRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      updatePetEventRecord: {
        ...state.updatePetEventRecord,
        pending: false,
        error: action.error,
      },
    };
  },

  [RemovePetEventRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      removePetEventRecord: {
        ...state.removePetEventRecord,
        pending: true,
        error: null,
      },
    };
  },
  [RemovePetEventRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    const records = state.petPetEventRecords.data;
    return {
      ...state,
      removePetEventRecord: {
        ...state.removePetEventRecord,
        pending: false,
        data: action.payload,
      },
      petPetEventRecords: {
        ...state.petPetEventRecords,
        data: records.filter((item) => item.id != action.payload.id),
      },
    };
  },
  [RemovePetEventRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      removePetEventRecord: {
        ...state.removePetEventRecord,
        pending: false,
        error: action.error,
      },
    };
  },

  // load
  [LoadPetPetEventRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petPetEventRecords: {
        ...state.petPetEventRecords,
        initializing: action.payload.cursor == null,
        pending: true,
        error: action.error,
      },
    };
  },
  [LoadPetPetEventRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petPetEventRecords: {
        ...fillCursorResponseData(state.petPetEventRecords, action),
        petId: action.extra.petId,
      },
    };
  },
  [LoadPetPetEventRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petPetEventRecords: {
        ...state.petPetEventRecords,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },
};
