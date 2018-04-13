export default class SocketService {

  static socket = null;
  static subscriptions = [];

  static setSubscriptionsSocket = function (name) {
    if ( !SocketService.subscriptions[name] ) SocketService.subscriptions[name] = [];
  };

  static getConnection = function () {
    if (SocketService.socket) {
      return SocketService.socket;
    }

    SocketService.socket = new WebSocket('ws://localhost:8090');
    SocketService.socket.onmessage = function (e) {
      const msg=JSON.parse(e.data);
      SocketService.setSubscriptionsSocket(msg.eventType);

      if (SocketService.subscriptions[msg.eventType]) {
        SocketService.subscriptions[msg.eventType].map(callback => callback(msg));
      }
    };

    return SocketService.socket;
  };

  static subscribe = function ({ eventName, callback }) {
    SocketService.setSubscriptionsSocket(eventName);

    let callback_in = SocketService.subscriptions[eventName].find(cb => cb === callback);
    if ( !callback_in ) {
      SocketService.subscriptions[eventName].push(callback);
      callback_in = callback;
    }
    return { eventName, callback: callback_in };
  };

  static unsubscribe = function ({ eventName, callback }) {
    SocketService.setSubscriptionsSocket(eventName);

    let callback_in = SocketService.subscriptions[eventName].find(cb => cb === callback);
    if ( callback_in ) {
      SocketService.subscriptions[eventName].pop(callback);
      callback_in = callback;
    }
    return { eventName, callback: callback_in };
  };

  static events = {
      GET_NOTIFICATION: 'GET_NOTIFICATION',
      SEND_NOTIFICATION: 'SEND_NOTIFICATION',
  }
}
