import EventEmitter from 'events';
import {ClientError} from './errors';

export class Client extends EventEmitter {
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
            this.emit('message', e);
        };
    }

    connect(server) {
        this._serverWindow = server;
        this._clientWindow.addEventListener('message', this._handler);
        this.send('connection');
    }

    disconnect() {
        this._serverWindow = null;
        this._clientWindow.removeEventListener('message', this._handler);
    }

    send(name, message) {
        if (this._serverWindow === null) {
            throw new ClientError('Can not call send method, client is not connected');
        }
        this._serverWindow.postMessage(JSON.stringify({
            type: name,
            data: message
        }), this._targetOrigin);
    }

    getServer() {
        return this._serverWindow;
    }
}
