import {Client} from '../../lib';
import {ClientError} from '../../lib/errors';
import {Window} from '../mocks/window';

let window = new Window();

describe('Client', () => {
    it('should be a constructor function', () => {
        expect(Client).to.be.a('function');
    });

    it('should create a Client instance', () => {
        expect(new Client(window, '*')).to.be.an.instanceof(Client);
    });

    it('should require a client window argument', () => {
        expect(() => new Client()).to.throw(TypeError, /Client constructor expects a window argument/);
    });

    it('should require a target origin argument', () => {
        expect(() => new Client(window)).to.throw(TypeError, /Client constructor expects a targetOrigin argument/);
    });

    describe('Client instance', () => {
        let targetOrigin = '*';
        let client = new Client(window, targetOrigin);

        it('should implement EventEmitter interface', () => {
            expect(client.on).to.be.a('function');
            expect(client.emit).to.be.a('function');
        });

        it('should emit an event when receives a message', () => {
            let serverWindow = new Window();
            let spy = sinon.spy();
            client.on('message', spy);
            client.connect(serverWindow);
            window.postMessage(JSON.stringify({
                type: 'message'
            }));
            client.disconnect();
            expect(spy).to.have.been.called;
        });

        describe('#connect method', () => {
            it('should be a function', () => {
                expect(client.connect).to.be.a('function');
            });

            it('should save the reference to the server window', () => {
                let serverWindow = new Window();
                client.connect(serverWindow);
                expect(client.getServer()).to.equal(serverWindow);
                client.disconnect();
            });

            it('should subscribe to window message events', () => {
                let spy = sinon.spy(window, 'addEventListener');
                let serverWindow = new Window();
                client.connect(serverWindow);
                expect(spy).to.have.been.called;
                client.disconnect();
            });

            it('should send a "connection" event to server window', () => {
                let serverWindow = new Window();
                let spy = sinon.spy(serverWindow, 'postMessage');
                client.connect(serverWindow);
                expect(spy).to.have.been.calledWith(JSON.stringify({
                    type: 'connection'
                }));
                client.disconnect();
            });
        });

        describe('#disconnect method', () => {
            it('should be a function', () => {
                expect(client.disconnect).to.be.a('function');
            });

            it('should remove the reference to the server window', () => {
                let serverWindow = new Window();
                client.connect(serverWindow);
                expect(client.getServer()).to.equal(serverWindow);
                client.disconnect();
                expect(client.getServer()).to.equal(null);
            });

            it('should unsubscribe from window message events', () => {
                let serverWindow = new Window();
                client.connect(serverWindow);
                let spy = sinon.spy(window, 'removeEventListener');
                client.disconnect();
                expect(spy).to.have.been.called;
            });
        });

        describe('#send method', () => {
            it('should be a function', () => {
                expect(client.send).to.be.a('function');
            });

            it('should call server window #postMessage method', () => {
                let serverWindow = new Window();
                let spy = sinon.spy(serverWindow, 'postMessage');
                client.connect(serverWindow);
                client.send();
                client.disconnect();
                expect(spy).to.have.been.called;
            });

            it('should call server window #postMessage method with provided targetOrigin', () => {
                let serverWindow = new Window();
                client.connect(serverWindow);
                let spy = sinon.spy(serverWindow, 'postMessage');
                let messageType = 'message';
                let message = 'hello';
                client.send(messageType, message);
                client.disconnect();
                expect(spy).to.have.been.calledWith(JSON.stringify({
                    type: messageType,
                    data: message
                }), targetOrigin);
            });

            it('should throw error if client is not connected', () => {
                client.disconnect();
                expect(() => client.send()).to.throw(ClientError, /client is not connected/);
            });
        });

        describe('#getServer method', () => {
            it('should be a function', () => {
                expect(client.getServer).to.be.a('function');
            });
        });
    });
});
