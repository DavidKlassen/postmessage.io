import EventEmitter from 'events';
import {ClientError} from './errors';
import uid from './utils/uid';

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

        this.setCid(uid());
        this._serverWindow = null;
        this._clientWindow = clientWindow;
        this._targetOrigin = targetOrigin;
        this._handler = (e) => {
            try {
                var message = JSON.parse(e.data);
                if (typeof message.name !== 'string' || typeof message.cid === 'undefined') {
                    return new Error('Unknown message format');
                }
            } catch (err) {
                return err;
            }

            this.emit(message.name, message.payload);
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
        this._clientWindow.removeEventListener('message', this._handler);
        this.send('disconnect');
        this.setServer(null);
    }

    /**
     * Sends the data to the server.
     *
     * @param {string} name
     * @param {*=} payload
     */
    send(name, payload) {
        if (this._serverWindow === null) {
            throw new ClientError('Can not call send method, client is not connected');
        }

        let cid = this.getCid();
        this._serverWindow.postMessage(JSON.stringify({ name, payload, cid }), this._targetOrigin);
    }

    /**
     * Returns the server window.
     *
     * @return {Window}
     */
    getServer() {
        return this._serverWindow;
    }

    /**
     * Sets the server window.
     *
     * @param {Window} serverWindow
     */
    setServer(serverWindow) {
        this._serverWindow = serverWindow;
    }

    /**
     * Returns client id.
     *
     * @return {number}
     */
    getCid() {
        return this._cid;
    }

    /**
     * Sets the client id.
     *
     * @param cid
     */
    setCid(cid) {
        this._cid = cid;
    }
}
