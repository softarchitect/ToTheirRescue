import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import storage from 'redux-persist/lib/storage';
import authReducer from './auth';
import userReducer from './user';
import pcoReducer from './pco';
import animalReducer from './animal';
import commonReducer from './common';

const persistConfig = {
  key: 'rootTyr',
  storage,
  stateReconciler: autoMergeLevel1,
  whitelist: [
    'auth',
    'common',
  ],
};

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  pco: pcoReducer,
  animal: animalReducer,
  common: commonReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'USER_LOGOUT') {
    return undefined;
  }
  return appReducer(state, action);
};

export default persistReducer(persistConfig, rootReducer);
