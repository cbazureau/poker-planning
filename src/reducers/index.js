import { combineReducers } from 'redux';
// Reducers
import roomReducer from './room-reducer';
// Combine Reducers
const reducers = combineReducers({
  room: roomReducer,
});
export default reducers;
