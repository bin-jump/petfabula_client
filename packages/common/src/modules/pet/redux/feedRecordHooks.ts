import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { PetState, FeedRecordForm } from './types';
import {
  CreateFeedRecordActionType,
  LoadPetFeedRecordActionType,
} from './actionTypes';
import { ActionBase, fillCursorResponseData } from '../../shared';

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
            ? [action.payload, ...feedRecords]
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
        error: action.error,
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
        petId: action.extra.petId,
        ...fillCursorResponseData(state.petFeedRecords, action),
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
};
