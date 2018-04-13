<?php

namespace App\Http\Controllers;

use App\Notification;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class WebSocketController extends Controller implements MessageComponentInterface
{
    protected $clients;

    const SEND_NOTIFICATION = "SEND_NOTIFICATION";
    const GET_NOTIFICATION = "GET_NOTIFICATION";

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    /**
     * When a new connection is opened it will be passed to this method
     * @param  ConnectionInterface $conn The socket/connection that just connected to your application
     * @throws \Exception
     */
    function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
        echo "Connection {$conn->resourceId} has opened\n";
    }

    /**
     * This is called before or after a socket is closed (depends on how it's closed).  SendMessage to $conn will not result in an error if it has already been closed.
     * @param  ConnectionInterface $conn The socket/connection that is closing/closed
     * @throws \Exception
     */
    function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    /**
     * If there is an error with one of the sockets, or somewhere in the application where an Exception is thrown,
     * the Exception is sent back down the stack, handled by the Server and bubbled back up the application through this method
     * @param  ConnectionInterface $conn
     * @param  \Exception $e
     * @throws \Exception
     */
    function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred with user ".$conn->resourceId;
        $this->clients->detach($conn);
        $conn->close();
    }

    /**
     * Triggered when a client sends data through the socket
     * @param  \Ratchet\ConnectionInterface $conn The socket/connection that sent the message to your application
     * @param  string $msg The message received
     * @throws \Exception
     */
    function onMessage(ConnectionInterface $conn, $msg)
    {
        $message = json_decode($msg);
        $data = $message->data;

        $request = ['eventType' => ''];
        switch ($message->eventType){
            case WebSocketController::SEND_NOTIFICATION:
                $notification = null;
                try {
                    $notification = Notification::create([
                        'message' => $data->message,
                    ]);
                } catch (\Exception $exception){
                    echo "Cannot create Notification:\n".$exception.$message;
                }

                if ($notification){
                    foreach ($this->clients as $client) {
                        $msg = [
                            'eventType' => WebSocketController::GET_NOTIFICATION,
                            'data' => [
                                $notification
                            ],
                        ];
                        $client->send(json_encode($msg));
                    }
                }

                break;
        }
    }
}