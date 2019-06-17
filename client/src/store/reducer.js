import {
  LOGIN_USER,
  IS_LOGGED_IN,
  SIGNOUT_USER,
  SET_THEME,
  CREATE_DRAFT,
  CREATE_DRAFT_EDIT,
  UPDATE_DRAFT,
  REMOVE_DRAFT,
  GET_PINS,
  UPDATE_PIN,
  CREATE_PIN,
  SET_PIN,
  DELETE_PIN,
  CLEAR_CURRENT_PIN,
  CREATE_COMMENT,
  DELETE_COMMENT,
  SET_POPUP,
  REMOVE_POPUP
} from './action-types';

export default function reducer(state, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        currentUser: action.payload
      }
    case IS_LOGGED_IN:
      return {
        ...state,
        isAuth: action.payload
      }
    case SIGNOUT_USER:
      return {
        ...state,
        isAuth: false,
        currentUser: null
      }
    case SET_THEME:
      return {
        ...state,
        mapTheme: action.payload
      }
    case CREATE_DRAFT:
      return {
        ...state,
        currentPin: null,
        draft: {
          latitude: 0,
          longitude: 0
        }
      }
    case CREATE_DRAFT_EDIT:
      return {
        ...state,
        draft: {
          latitude: 0,
          longitude: 0
        }
      }
    case UPDATE_DRAFT:
      return {
        ...state,
        draft: action.payload
      }
    case REMOVE_DRAFT:
      return {
        ...state,
        draft: null
      }
    case GET_PINS:
      return {
        ...state,
        pins: action.payload
      }
    case CREATE_PIN:
      const newPin = action.payload;
      const prevPins = state.pins.filter(pin => pin._id !== newPin._id)
      return {
        ...state,
        pins: [...prevPins, newPin]
      }
    case SET_PIN:
      return {
        ...state,
        currentPin: action.payload,
        draft: null
      }
    case DELETE_PIN:
      const filteredPins = state.pins.filter(pin => pin._id !== action.payload._id)
      return {
        ...state,
        pins: filteredPins,
        currentPin: null
      }
    case UPDATE_PIN:
      const editedPin = action.payload;
      const updatedEditedPin = state.pins.map(pin => pin._id === editedPin._id ? editedPin : pin)

      return {
        ...state,
        pins: updatedEditedPin,
        currentPin: null
      }
    case CLEAR_CURRENT_PIN:
      return {
        ...state,
        currentPin: null
      }
    case CREATE_COMMENT:
      const pinToUpdate = action.payload;
      const updatedPin = state.pins.map(pin => pin._id === pinToUpdate._id ? pinToUpdate : pin)
      return {
        ...state,
        pins: updatedPin,
        currentPin: pinToUpdate
      }
    case DELETE_COMMENT:
      const commentsAfterRemove = action.payload.comments;
      const changedPin = state.pins.filter(pin => pin._id === action.payload._id)
      changedPin[0].comments = commentsAfterRemove;

      return {
        ...state,
        pins: changedPin
      }
    case SET_POPUP:
      return {
        ...state,
        popup: action.payload
      }
    case REMOVE_POPUP:
      return {
        ...state,
        popup: null
      }
    default:
      {
        return state;
      }
  }
}