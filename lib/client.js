import EventEmitter from 'events';
import {ClientError} from './errors';

export class Client extends EventEmitter {
    constructor(clientWindow) {
        super();

        if (typeof clientWindow === 'undefined') {
            throw new TypeError('Client constructor expects a \'Window\' argument');
        }

        this._serverWindow = null;
        this._clientWindow = clientWindow;
        this._handler = (e) => {
            this.emit('message', e);
        };
    }

    connect(server) {
        this._serverWindow = server;
        this._clientWindow.addEventListener('message', this._handler);
    }

    disconnect() {
        this._serverWindow = null;
        this._clientWindow.removeEventListener('message', this._handler);
    }

    send(message) {
        if (this._serverWindow === null) {
            throw new ClientError('Can not call send method, client is not connected');
        }
        this._serverWindow.postMessage(message);
    }

    getServer() {
        return this._serverWindow;
    }
}
