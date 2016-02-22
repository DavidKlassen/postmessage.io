import {ExtendableError} from 'extendable-error';

export class ClientError extends ExtendableError {
    constructor(m) {
        super(m);
    }
}
