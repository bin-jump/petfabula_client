import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { PetState, WeightRecordForm } from './types';
import {
  CreateWeightRecordActionType,
  LoadPetWeightRecordActionType,
} from './actionTypes';
import { ActionBase, fillCursorResponseData } from '../../shared';

export const useCreateWeightRecord = () => {
  const dispatch = useDispatch();
  const { result, pending, error } = useSelector(
    (state: AppState) => ({
      result: state.pet.createWeightRecord.data,
      pending: state.pet.createWeightRecord.pending,
      error: state.pet.createWeightRecord.error,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (data: WeightRecordForm) => {
      dispatch({
        type: CreateWeightRecordActionType.BEGIN,
        payload: data,
      });
    },
    [dispatch],
  );

  return {
    createWeightRecord: boundAction,
    result,
    pending,
    error,
  };
};

export const useLoadWeightRecords = () => {
  const dispatch = useDispatch();
  const { petId, records, hasMore, nextCursor, initializing, pending, error } =
    useSelector(
      (state: AppState) => ({
        petId: state.pet.petWeightRecords.petId,
        records: state.pet.petWeightRecords.data,
        pending: state.pet.petWeightRecords.pending,
        error: state.pet.petWeightRecords.error,
        hasMore: state.pet.petWeightRecords.hasMore,
        nextCursor: state.pet.petWeightRecords.nextCursor,
        initializing: state.pet.petWeightRecords.initializing,
      }),
      shallowEqual,
    );

  const boundAction = useCallback(
    (petId: number, cursor: object | null) => {
      dispatch({
        type: LoadPetWeightRecordActionType.BEGIN,
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

export const weightRecordReducer = {
  [CreateWeightRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      createWeightRecord: {
        ...state.createWeightRecord,
        pending: true,
        error: null,
      },
    };
  },
  [CreateWeightRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    const weightRecords = state.petWeightRecords.data;
    return {
      ...state,
      createWeightRecord: {
        ...state.createWeightRecord,
        pending: false,
        data: action.payload,
      },
      petWeightRecords: {
        ...state.petWeightRecords,
        data:
          state.petWeightRecords.petId == action.payload.petId
            ? [action.payload, ...weightRecords]
            : weightRecords,
      },
    };
  },
  [CreateWeightRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      createWeightRecord: {
        ...state.createWeightRecord,
        pending: false,
        error: action.error,
      },
    };
  },

  // load
  [LoadPetWeightRecordActionType.BEGIN]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petWeightRecords: {
        ...state.petWeightRecords,
        initializing: action.payload.cursor == null,
        pending: true,
        error: action.error,
      },
    };
  },
  [LoadPetWeightRecordActionType.SUCCESS]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petWeightRecords: {
        petId: action.extra.petId,
        ...fillCursorResponseData(state.petWeightRecords, action),
      },
    };
  },
  [LoadPetWeightRecordActionType.FAILURE]: (
    state: PetState,
    action: ActionBase,
  ): PetState => {
    return {
      ...state,
      petWeightRecords: {
        ...state.petWeightRecords,
        pending: false,
        initializing: false,
        error: action.error,
      },
    };
  },
};
