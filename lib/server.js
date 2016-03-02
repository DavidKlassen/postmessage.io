import EventEmitter from 'events';
import {Client} from './client';

/**
 * Fired when a server receives a new connection request.
 *
 * @type {string}
 */
const CONNECTION_EVENT = 'connection';

/**
 * Sent to client after a connection is received by server and the client is registered.
 *
 * @type {string}
 */
const CONNECTED_EVENT = 'connected';

/**
 * Sent by client when a client wants to disconnect.
 *
 * @type {string}
 */
const DISCONNECT_EVENT = 'disconnect';

/**
 * Sent to the client when a server unregisters the client.
 *
 * @type {string}
 */
const DISCONNECTED_EVENT = 'disconnected';

export class Server extends EventEmitter {
    /**
     * Server instance constructor.
     *
     * @param {Window} serverWindow
     */
    constructor(serverWindow) {
        super();

        if (typeof serverWindow === 'undefined') {
            throw new TypeError('Server constructor expects a window argument');
        }

        this._clients = new Map();
        this._listening = false;
        this._serverWindow = serverWindow;
        this._handler = (e) => {
            try {
                var message = JSON.parse(e.data);
                if (typeof message.name !== 'string' || typeof message.cid === 'undefined') {
                    return new Error('Unknown message format');
                }
            } catch(e) {
                return e;
            }

            if (message.name === CONNECTION_EVENT) {
                let client = this.addClient(new Client(this._serverWindow, '*'), e.source, message.cid);
                this.emit(CONNECTION_EVENT, client);
                client.send(CONNECTED_EVENT);
            } else if (message.name === DISCONNECT_EVENT) {
                let client = this.getClient(e.source, message.cid);
                this.removeClient(e.source, message.cid);
                client.emit(DISCONNECTED_EVENT);
            } else {
                let client = this.getClient(e.source, message.cid);
                client.emit(message.name, message.payload);
            }
        };
    }

    /**
     * Start listening for window message events.
     */
    listen() {
        if (this._listening) {
            return;
        }

        this._listening = true;
        this._serverWindow.addEventListener('message', this._handler);
    }

    unlisten() {
        this._listening = false;
        this._serverWindow.removeEventListener('message', this._handler);
    }

    /**
     * Registers the client.
     *
     * @param client
     * @param source
     * @param cid
     */
    addClient(client, source, cid) {
        if (typeof source === 'undefined') {
            throw new TypeError('Server#addClient() expects a source argument');
        }

        if (typeof cid === 'undefined') {
            throw new TypeError('Server#addClient() expects a cid argument');
        }

        let sourceClients = this._clients.get(source);

        client.setServer(source);

        if (!sourceClients) {
            sourceClients = {};
            this._clients.set(source, sourceClients);
        }

        return sourceClients[cid] = client;
    }

    /**
     * Returns a registered client.
     *
     * @param source
     * @param cid
     * @return {*}
     */
    getClient(source, cid) {
        let sourceClients = this._clients.get(source);

        if (!sourceClients) {
            return undefined;
        }

        return this._clients.get(source)[cid];
    }

    /**
     * Unregisters the client.
     *
     * @param source
     * @param cid
     */
    removeClient(source, cid) {
        let sourceClients = this._clients.get(source);
        delete sourceClients[cid];
        if (!Object.keys(sourceClients).length) {
            this._clients.delete(source);
        }
    }
}
