export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

export const receiveMessage = function(message_data) {
  return {
    type: RECEIVE_MESSAGE,
    data: message_data
  };
};