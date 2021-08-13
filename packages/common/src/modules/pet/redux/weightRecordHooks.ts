import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { PetState, WeightRecordForm } from './types';
import { CreateWeightRecordActionType } from './actionTypes';
import { ActionBase, UploadImage } from '../../shared';

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
    const weightRecords = state.myPetWeightRecords.data;
    return {
      ...state,
      createWeightRecord: {
        ...state.createWeightRecord,
        pending: false,
        data: action.payload,
      },
      myPetWeightRecords: {
        ...state.myPetWeightRecords,
        data: weightRecords
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
};
