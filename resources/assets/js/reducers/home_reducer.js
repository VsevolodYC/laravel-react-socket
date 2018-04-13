import actions from '../actions';

export const initialState = {
  messages: [
  ],
};

export const homeReducer = function(state = initialState, action) {
  switch (action.type) {
    case actions.homeAction.RECEIVE_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, ...action.data],
      };
    default:
      return state;
  }
};