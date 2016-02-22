import {Server} from '../../lib';
import {Window} from '../mocks/window';

let window = new Window();

describe('Server', () => {
    it('should be a constructor function', () => {
        expect(Server).to.be.a('function');
    });

    it('should create a Client instance', () => {
        expect(new Server(window)).to.be.an.instanceof(Server);
    });

    it('should require a client window argument', () => {
        expect(() => new Server()).to.throw(TypeError, /Server constructor expects a \'Window\' argument/);
    });

    describe('Server instance', () => {
        let server = new Server(window);

        it('should implement EventEmitter interface', () => {
            expect(server.on).to.be.a('function');
            expect(server.emit).to.be.a('function');
        });

        it('should emit a "connection" event when receives "connect" a message', () => {
            let spy = sinon.spy();
            server.on('connection', spy);
            server.listen();
            window.postMessage(JSON.stringify({ type: 'connection' }));
            expect(spy).to.have.been.called;
        });

        describe('#listen method', () => {
            it('should be a function', () => {
                expect(server.listen).to.be.a('function');
            });

            it('should subscribe to window message events', () => {
                let spy = sinon.spy(window, 'addEventListener');
                server.listen();
                expect(spy).to.have.been.called;
            });
        });
    });
});
