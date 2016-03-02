import {Server, Client} from '../../lib';
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
        expect(() => new Server()).to.throw(TypeError, /Server constructor expects a window argument/);
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
            window.postMessage(JSON.stringify({ name: 'connection', cid: 1 }));
            expect(spy).to.have.been.called;
        });

        describe('#listen method', () => {
            it('should be a function', () => {
                expect(server.listen).to.be.a('function');
            });

            it('should subscribe to window message events', () => {
                let spy = sinon.spy(window, 'addEventListener');
                server.unlisten();
                server.listen();
                expect(spy).to.have.been.called;
            });

            it('should not handle malformed messages', () => {
                let spy = sinon.spy();
                server.listen();
                window.postMessage('this is invalid JSON');
                window.postMessage(JSON.stringify({ name: 'connection' }));
                expect(spy).to.not.have.been.called;
            });

            it('should handle client messages', () => {
                let client = new Client(window, '*');
                let spy = sinon.spy();
                server.on('connection', (client) => {
                    client.on('message', spy);
                });
                server.listen();
                client.connect(window);
                client.send('message', 'foo');
                expect(spy).to.have.been.calledWith('foo');
            });

            it('should handle disconnect message', () => {
                let client = new Client(window, '*');
                let spy = sinon.spy();
                server.on('connection', (client) => {
                    client.on('disconnected', spy);
                });
                server.listen();
                client.connect(window);
                client.disconnect();
                expect(spy).to.have.been.called;
            });
        });

        describe('#addClient method', () => {
            it('should be a function', () => {
                expect(server.addClient).to.be.a('function');
            });

            it('should require the source argument', () => {
                let client = new Client(window, '*');
                expect(() => server.addClient(client)).to.throw(TypeError, /Server#addClient\(\) expects a source argument/);
            });

            it('should require the cid argument', () => {
                let client = new Client(window, '*');
                expect(() => server.addClient(client, window)).to.throw(TypeError, /Server#addClient\(\) expects a cid argument/);
            });

            it('should save a reference to the client', () => {
                let client = new Client(window, '*');
                server.addClient(client, window, 1);
                expect(server.getClient(window, 1)).to.equal(client);
            });

            it('should return a saved client', () => {
                let client = new Client(window, '*');
                expect(server.addClient(client, window, 1)).to.equal(client);
            });
        });

        describe('#getClient method', () => {
            it('should be a function', () => {
                expect(server.getClient).to.be.a('function');
            });

            it('should return a client', () => {
                let client = new Client(window, '*');
                server.addClient(client, window, 1);
                expect(server.getClient(window, 1)).to.equal(client);
            });

            it('should return undefined if client not found for the source', () => {
                let client = new Client(window, '*');
                server.addClient(client, window, 1);
                let w2 = new Window();
                expect(server.getClient(w2, 1)).to.be.undefined;
            });
        });

        describe('#removeClient method', () => {
            it('should be a function', () => {
                expect(server.removeClient).to.be.a('function');
            });

            it('should remove a client', () => {
                let c1 = new Client(window, '*');
                let cid1 = 1;
                let c2 = new Client(window, '*');
                let cid2 = 2;
                server.addClient(c1, window, cid1);
                server.addClient(c2, window, cid2);
                expect(server.getClient(window, cid1)).to.equal(c1);
                server.removeClient(window, cid1);
                expect(server.getClient(window, cid1)).to.be.undefined;
            });
        });
    });
});
