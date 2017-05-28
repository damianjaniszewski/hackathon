import { DASHBOARD_LOAD, DASHBOARD_UNLOAD } from '../actions';
import { watchEvents, unwatchEvents } from '../api/dashboard';

export function loadDashboardEvents() {
  return dispatch => (
    watchEvents()
      .on('success',
        payload => dispatch({ type: DASHBOARD_LOAD, payload })
      )
      .on('error',
        payload => dispatch({ type: DASHBOARD_LOAD, error: true, payload })
      )
      .start()
  );
}

export function unloadDashboardEvents() {
  unwatchEvents();
  return { type: DASHBOARD_UNLOAD };
}
