import { combineReducers } from 'redux';

import dashboard from './dashboard';
import nav from './nav';
import session from './session';

export default combineReducers({
  dashboard,
  nav,
  session
});
