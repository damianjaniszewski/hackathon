import { PUBLISH_LOAD, PUBLISH_UNLOAD } from '../actions';
import { createReducer } from './utils';

const initialState = {
};

const handlers = {
  [PUBLISH_LOAD]: (state, action) => {
    if (!action.error) {
      action.payload.error = undefined;
      return action.payload;
    }
    return { error: action.payload };
  },
  [PUBLISH_UNLOAD]: () => initialState
};

export default createReducer(initialState, handlers);
