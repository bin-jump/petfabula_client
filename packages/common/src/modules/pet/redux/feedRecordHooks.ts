import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { PetState, FeedRecordForm, FeedRecord } from './types';
import {
  CreateFeedRecordActionType,
  LoadPetFeedRecordActionType,
  UpdateFeedRecordActionType,
  RemoveFeedRecordActionType,
  LoadPetRecentFeedRecordActionType,
} from './actionTypes';
import { ActionBase, fillCursorResponseData } from '../../shared';
import { sortRecords } from './recordHelper';

export const useCreateFeedRecord = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.pet.createFeedRecord.data,
      pending: state.pet.createFeedRecord.pending,
      error: state.pet.createFeedRecord.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (data: FeedRecordForm) => {
      dispatch({
        type: CreateFeedRecordActionType.BEGIN,
        payload: data,
      });
    },
    [dispatch],
  );

  return {
    createFeedRecord: boundAction,
    result,
    pending,
    error,
  };
};

export const useUpdateFeedRecord = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.pet.updateFeedRecord.data,
      pending: state.pet.updateFeedRecord.pending,
      error: state.pet.updateFeedRecord.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (data: FeedRecord) => {
      dispatch({
        type: UpdateFeedRecordActionType.BEGIN,
        payload: data,
      });
    },
    [dispatch],
  );

  return {
    updateFeedRecord: boundAction,
    result,
    pending,
    error,
  };
};

export const useRemoveFeedRecord = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.pet.removeFeedRecord.data,
      pending: state.pet.removeFeedRecord.pending,
      error: state.pet.removeFeedRecord.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (recordId: number) => {
      dispatch({
        type: RemoveFeedRecordActionType.BEGIN,
        payload: { recordId },
      });
    },
    [dispatch],
  );

  return {
    removeFeedRecord: boundAction,
    result,
    pending,
    error,
  };
};

export const useLoadFeedRecords = () => {
  const dispatch = useDispatch();
  const { petId, records, hasMore, nextCursor, initializing, pending, error } =
    useSelector(
      (state: AppState) => ({
        petId: state.pet.petFeedRecords.petId,
        records: state.pet.petFeedRecords.data,
        pending: state.pet.petFeedRecords.pending,
        error: state.pet.petFeedRecords.error,
        hasMore: state.pet.petFeedRecords.hasMore,
        nextCursor: state.pet.petFeedRecords.nextCursor,
        initializing: state.pet.petFeedRecords.initializing,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (petId: number, cursor: object | null) => {
      dispatch({
        type: LoadPetFeedRecordActionType.BEGIN,
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

export const useLoadRecentFeedRecords = () => {
  const dispatch = useDispatch();
  const { petId, records, pending, error } = useSelector(
    (state: AppState) => ({
      petId: state.pet.petRecentFeedRecords.petId,
      records: state.pet.petRecentFeedRecords.data,
      pending: state.pet.petRecentFeedRecords.pending,
      error: state.pet.petRecentFeedRecords.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (petId: number) => {
      dispatch({
        type: LoadPetRecentFeedRecordActionType.BEGIN,
        payload: { petId },
      });
    },
    [dispatch],
  );

  return {
    petId,
    loadRecords: boundAction,
    records,
    pending,
    error,
  };
};

export const feedRecordReducer = {
  [CreateFeedRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      createFeedRecord: {
        ...state.createFeedRecord,
        pending: true,
        error: null,
      },
    };
  },
  [CreateFeedRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    const feedRecords = state.petFeedRecords.data;
    return {
      ...state,
      createFeedRecord: {
        ...state.createFeedRecord,
        pending: false,
        data: action.payload,
      },
      petFeedRecords: {
        ...state.petFeedRecords,
        data:
          state.petFeedRecords.petId == action.payload.petId
            ? sortRecords<FeedRecord>([action.payload, ...feedRecords])
            : feedRecords,
      },
    };
  },
  [CreateFeedRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      createFeedRecord: {
        ...state.createFeedRecord,
        pending: false,
        error: action.error,
      },
    };
  },

  [UpdateFeedRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      updateFeedRecord: {
        ...state.updateFeedRecord,
        pending: true,
        error: null,
      },
    };
  },
  [UpdateFeedRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    const records = state.petFeedRecords.data;
    return {
      ...state,
      updateFeedRecord: {
        ...state.updateFeedRecord,
        pending: false,
        data: action.payload,
      },
      petFeedRecords: {
        ...state.petFeedRecords,
        data:
          state.petFeedRecords.petId == action.payload.petId
            ? sortRecords<FeedRecord>(
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
  [UpdateFeedRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      updateFeedRecord: {
        ...state.updateFeedRecord,
        pending: false,
        error: action.error,
      },
    };
  },

  [RemoveFeedRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      removeFeedRecord: {
        ...state.removeFeedRecord,
        pending: true,
        error: null,
      },
    };
  },
  [RemoveFeedRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    const records = state.petFeedRecords.data;
    return {
      ...state,
      removeFeedRecord: {
        ...state.removeFeedRecord,
        pending: false,
        data: action.payload,
      },
      petFeedRecords: {
        ...state.petFeedRecords,
        data: records.filter((item) => item.id != action.payload.id),
      },
    };
  },
  [RemoveFeedRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      removeFeedRecord: {
        ...state.removeFeedRecord,
        pending: false,
        error: action.error,
      },
    };
  },

  // load
  [LoadPetFeedRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petFeedRecords: {
        ...state.petFeedRecords,
        initializing: action.payload.cursor == null,
        pending: true,
        error: null,
      },
    };
  },
  [LoadPetFeedRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petFeedRecords: {
        ...fillCursorResponseData(state.petFeedRecords, action),
        petId: action.extra.petId,
      },
    };
  },
  [LoadPetFeedRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petFeedRecords: {
        ...state.petFeedRecords,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },

  [LoadPetRecentFeedRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petRecentFeedRecords: {
        ...state.petRecentFeedRecords,
        pending: true,
        error: null,
      },
    };
  },
  [LoadPetRecentFeedRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petRecentFeedRecords: {
        ...state.petRecentFeedRecords,
        petId: action.extra.petId,
        pending: false,
        data: action.payload,
      },
    };
  },
  [LoadPetRecentFeedRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petRecentFeedRecords: {
        ...state.petRecentFeedRecords,
        pending: false,
        error: action.error,
      },
    };
  },
};
