class SocketService {

    static socket = null;

    static getConnection(){
        if (SocketService.socket) {
            return this.socket;
        }

        SocketService.socket = new WebSocket('ws://localhost:8090');
        SocketService.socket.onmessage = function (e) {
            const msg=JSON.parse(e.data);
            if ( !SocketService.subscriptions) {
                SocketService.subscriptions = [];
            }
            if ( !SocketService.subscriptions[msg.eventType]) {
                SocketService.subscriptions[msg.eventType] = [];
            }

            if (SocketService.subscriptions[msg.eventType]) {
                SocketService.subscriptions[msg.eventType].map( callback => callback(msg));
            }
        };

        return SocketService.socket;
    };

    static subscribe(event_name, callback){
        if ( !SocketService.subscriptions) {
            SocketService.subscriptions = [];
        }
        if ( !SocketService.subscriptions[event_name]) {
            SocketService.subscriptions[event_name] = [];
        }

        let callback_in = SocketService.subscriptions[event_name].find( cb => cb === callback);
        if ( !callback_in ) {
            SocketService.subscriptions[event_name].push(callback);
            console.log(SocketService.subscriptions);
            callback_in = callback;
        }
        return callback_in;
    }

    static unsubscribe(event_name, callback){
        if ( !SocketService.subscriptions) {
            SocketService.subscriptions = [];
        }
        if ( !SocketService.subscriptions[event_name]) {
            SocketService.subscriptions[event_name] = [];
        }

        let callback_in = SocketService.subscriptions[event_name].find( cb => cb === callback);
        if ( !callback_in ) {
            SocketService.subscriptions[event_name].pop(callback);
            console.log(SocketService.subscriptions);
            callback_in = callback;
        }
        return callback_in;
    }

    static get events() {
        return {
            GET_NOTIFICATION: "GET_NOTIFICATION",
            SEND_NOTIFICATION: "SEND_NOTIFICATION",
        }
    }
}

export default SocketService;