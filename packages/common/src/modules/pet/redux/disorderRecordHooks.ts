import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { PetState, DisorderRecordForm, DisorderRecord } from './types';
import {
  CreateDisorderRecordActionType,
  LoadPetDisorderRecordActionType,
  UpdateDisorderRecordActionType,
  RemoveDisorderRecordActionType,
} from './actionTypes';
import { ActionBase, UploadImage, fillCursorResponseData } from '../../shared';

export const useCreateDisroderRecord = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.pet.createDisorderRecord.data,
      pending: state.pet.createDisorderRecord.pending,
      error: state.pet.createDisorderRecord.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (data: DisorderRecordForm, images: UploadImage[]) => {
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
        type: CreateDisorderRecordActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    createDisorderRecord: boundAction,
    result,
    pending,
    error,
  };
};

export const useUpdateDisroderRecord = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.pet.updateDisorderRecord.data,
      pending: state.pet.updateDisorderRecord.pending,
      error: state.pet.updateDisorderRecord.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (data: DisorderRecord, images: UploadImage[]) => {
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
        type: UpdateDisorderRecordActionType.BEGIN,
        payload: d,
      });
    },
    [dispatch],
  );

  return {
    updateDisorderRecord: boundAction,
    result,
    pending,
    error,
  };
};

export const useRemoveDisroderRecord = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.pet.removeDisorderRecord.data,
      pending: state.pet.removeDisorderRecord.pending,
      error: state.pet.removeDisorderRecord.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (recordId: number) => {
      dispatch({
        type: RemoveDisorderRecordActionType.BEGIN,
        payload: { recordId },
      });
    },
    [dispatch],
  );

  return {
    removeDisorderRecord: boundAction,
    result,
    pending,
    error,
  };
};

export const useLoadDisorderRecords = () => {
  const dispatch = useDispatch();
  const { petId, records, hasMore, nextCursor, initializing, pending, error } =
    useSelector(
      (state: AppState) => ({
        petId: state.pet.petDisorderRecords.petId,
        records: state.pet.petDisorderRecords.data,
        pending: state.pet.petDisorderRecords.pending,
        error: state.pet.petDisorderRecords.error,
        hasMore: state.pet.petDisorderRecords.hasMore,
        nextCursor: state.pet.petDisorderRecords.nextCursor,
        initializing: state.pet.petDisorderRecords.initializing,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (petId: number, cursor: object | null) => {
      dispatch({
        type: LoadPetDisorderRecordActionType.BEGIN,
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

export const disorderRecordReducer = {
  [CreateDisorderRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      createDisorderRecord: {
        ...state.createDisorderRecord,
        pending: true,
        error: null,
      },
    };
  },
  [CreateDisorderRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    const records = state.petDisorderRecords.data;
    return {
      ...state,
      createDisorderRecord: {
        ...state.createDisorderRecord,
        pending: false,
        data: action.payload,
      },
      petDisorderRecords: {
        ...state.petDisorderRecords,
        data:
          state.petDisorderRecords.petId == action.payload.petId
            ? [action.payload, ...records]
            : records,
      },
    };
  },
  [CreateDisorderRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      createDisorderRecord: {
        ...state.createDisorderRecord,
        pending: false,
        error: action.error,
      },
    };
  },

  [UpdateDisorderRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      updateDisorderRecord: {
        ...state.updateDisorderRecord,
        pending: true,
        error: null,
      },
    };
  },
  [UpdateDisorderRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    const records = state.petDisorderRecords.data;
    return {
      ...state,
      updateDisorderRecord: {
        ...state.updateDisorderRecord,
        pending: false,
        data: action.payload,
      },
      petDisorderRecords: {
        ...state.petDisorderRecords,
        data:
          state.petDisorderRecords.petId == action.payload.petId
            ? records.map((item) => {
                if (item.id == action.payload.id) {
                  return action.payload;
                }
                return item;
              })
            : records,
      },
    };
  },
  [UpdateDisorderRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      updateDisorderRecord: {
        ...state.updateDisorderRecord,
        pending: false,
        error: action.error,
      },
    };
  },

  [RemoveDisorderRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      removeDisorderRecord: {
        ...state.removeDisorderRecord,
        pending: true,
        error: null,
      },
    };
  },
  [RemoveDisorderRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    const records = state.petDisorderRecords.data;
    return {
      ...state,
      removeDisorderRecord: {
        ...state.removeDisorderRecord,
        pending: false,
        data: action.payload,
      },
      petDisorderRecords: {
        ...state.petDisorderRecords,
        data: records.filter((item) => item.id != action.payload.id),
      },
    };
  },
  [RemoveDisorderRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      removeDisorderRecord: {
        ...state.removeDisorderRecord,
        pending: false,
        error: action.error,
      },
    };
  },

  // load
  [LoadPetDisorderRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petDisorderRecords: {
        ...state.petDisorderRecords,
        initializing: action.payload.cursor == null,
        pending: true,
        error: action.error,
      },
    };
  },
  [LoadPetDisorderRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petDisorderRecords: {
        ...fillCursorResponseData(state.petDisorderRecords, action),
        petId: action.extra.petId,
      },
    };
  },
  [LoadPetDisorderRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petDisorderRecords: {
        ...state.petDisorderRecords,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },
};
