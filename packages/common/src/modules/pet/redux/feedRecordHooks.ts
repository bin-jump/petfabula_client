import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { PetState, FeedRecordForm } from './types';
import { CreateFeedRecordActionType } from './actionTypes';
import { ActionBase, UploadImage } from '../../shared';

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
    const feedRecords = state.myPetFeedRecords.data;
    return {
      ...state,
      createFeedRecord: {
        ...state.createFeedRecord,
        pending: false,
        data: action.payload,
      },
      myPetFeedRecords: {
        ...state.myPetFeedRecords,
        data: feedRecords ? [action.payload, ...feedRecords] : feedRecords,
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
};
