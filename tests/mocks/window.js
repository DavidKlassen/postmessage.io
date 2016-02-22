export class Window {
    addEventListener(event, handler) {
        if (typeof this._handlers === 'undefined') {
            this._handlers = {};
        }
        if (typeof this._handlers[event] === 'undefined') {
            this._handlers[event] = [];
        }
        this._handlers[event].push(handler);
    }

    removeEventListener(event, handler) {
        if (this._handlers && this._handlers[event]) {
            let idx = this._handlers[event].indexOf(handler);
            if (idx !== -1) {
                this._handlers[event].splice(idx, 1);
            }
        }
    }

    postMessage(message) {
        if (this._handlers && this._handlers.message) {
            this._handlers.message.forEach((fn) => {
                fn({
                    data: message,
                    source: this
                });
            });
        }
    }
}
