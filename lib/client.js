import EventEmitter from 'events';
import {ClientError} from './errors';

export class Client extends EventEmitter {
    /**
     * Created a client instance.
     *
     * @param {Window} clientWindow
     * @param {string} targetOrigin
     */
    constructor(clientWindow, targetOrigin) {
        super();

        if (typeof clientWindow === 'undefined') {
            throw new TypeError('Client constructor expects a window argument');
        }

        if (typeof targetOrigin === 'undefined') {
            throw new TypeError('Client constructor expects a targetOrigin argument');
        }

        this._serverWindow = null;
        this._clientWindow = clientWindow;
        this._targetOrigin = targetOrigin;
        this._handler = (e) => {
            let message = JSON.parse(e.data);
            this.emit(message.type, message.data);
        };
    }

    /**
     * Connects to client to the server.
     *
     * @param {Window} serverWindow
     */
    connect(serverWindow) {
        this.setServer(serverWindow);
        this._clientWindow.addEventListener('message', this._handler);
        this.send('connection');
    }

    /**
     * Disconnects the client.
     */
    disconnect() {
        this.setServer(null);
        this._clientWindow.removeEventListener('message', this._handler);
    }

    /**
     * Sends the data to the server.
     *
     * @param {string} name
     * @param {*} data
     */
    send(name, data) {
        if (this._serverWindow === null) {
            throw new ClientError('Can not call send method, client is not connected');
        }

        this._serverWindow.postMessage(JSON.stringify({
            type: name,
            data: data
        }), this._targetOrigin);
    }

    setServer(serverWindow) {
        this._serverWindow = serverWindow;
    }

    /**
     * Returns the server window.
     *
     * @return {Window}
     */
    getServer() {
        return this._serverWindow;
    }
}
