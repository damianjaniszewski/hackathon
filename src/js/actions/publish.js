import { PUBLISH_LOAD, PUBLISH_UNLOAD } from '../actions';

export function loadPublish() {
  return { type: PUBLISH_LOAD };
}

export function unloadPublish() {
  return { type: PUBLISH_UNLOAD };
}
