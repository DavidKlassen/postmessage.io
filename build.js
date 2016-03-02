import 'core-js/shim';
import * as postmessage from './lib';

((root) => {
    root.postmessage = postmessage;
})(window);
