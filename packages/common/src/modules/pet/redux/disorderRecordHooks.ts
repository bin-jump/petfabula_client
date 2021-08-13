import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { AppState } from '../../../stateProvider';
import { PetState, DisorderRecordForm } from './types';
import { CreateDisorderRecordActionType } from './actionTypes';
import { ActionBase, UploadImage } from '../../shared';

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
    const records = state.myPetDisorderRecords.data;
    return {
      ...state,
      createDisorderRecord: {
        ...state.createDisorderRecord,
        pending: false,
        data: action.payload,
      },
      myPetDisorderRecords: {
        ...state.myPetDisorderRecords,
        data: records ? [action.payload, ...records] : records,
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
};
