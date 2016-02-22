import EventEmitter from 'events';
import {Client} from './client';

export class Server extends EventEmitter {
    /**
     * Server instance constructor.
     *
     * @param {Window} serverWindow
     */
    constructor(serverWindow) {
        super();

        if (typeof serverWindow === 'undefined') {
            throw new TypeError('Server constructor expects a \'Window\' argument');
        }

        this._serverWindow = serverWindow;
    }

    listen() {
        this._serverWindow.addEventListener('message', (e) => {
            let message = JSON.parse(e.data);
            if (message.type === 'connection') {
                let client = new Client(this._serverWindow, '*');
                message.data = client;
                client.setServer(e.source);
                client.send('connected');
                this.emit(message.type, message.data);
            }
        });
    }
}
