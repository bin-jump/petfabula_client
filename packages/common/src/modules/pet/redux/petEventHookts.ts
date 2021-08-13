import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { PetState, PetEventRecordForm } from './types';
import { CreatePetEventRecordActionType } from './actionTypes';
import { ActionBase, UploadImage } from '../../shared';

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
    const records = state.myPetPetEventRecords.data;
    return {
      ...state,
      createPetEventRecord: {
        ...state.createPetEventRecord,
        pending: false,
        data: action.payload,
      },
      myPetPetEventRecords: {
        ...state.myPetPetEventRecords,
        data: records ? [action.payload, ...records] : records,
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
};
