import EventEmitter from 'events';

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
        this._serverWindow.addEventListener('message', () => {
            this.emit('connection');
        });
    }
}
