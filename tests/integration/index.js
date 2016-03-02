describe('Global reference to postmessage', () => {
    it('should be defined', () => {
        expect(postmessage).to.not.be.undefined;
    });
});

describe('Connecting a client', () => {
    it('should fire a "connection" event on server', (done) => {
        let server = new postmessage.Server(window);
        let client = new postmessage.Client(window, '*');
        server.listen();
        let spy = sinon.spy();
        server.on('connection', spy);
        client.connect(window);
        setTimeout(() => {
            expect(spy).to.have.been.called;
            client.disconnect();
            done();
        }, 100);
    });

    it('should fire a "connected" event on client', (done) => {
        let server = new postmessage.Server(window);
        let client = new postmessage.Client(window, '*');
        server.listen();
        let spy = sinon.spy();
        client.on('connected', spy);
        client.connect(window);
        setTimeout(() => {
            expect(spy).to.have.been.called;
            client.disconnect();
            done();
        }, 100);
    });

    it('should pass a reference to the client as an argument to "connection" event callback', (done) => {
        let server = new postmessage.Server(window);
        let client = new postmessage.Client(window, '*');
        server.listen();
        let spy = sinon.spy();
        server.on('connection', spy);
        client.connect(window);
        setTimeout(() => {
            expect(spy).to.have.been.calledWith(sinon.match.instanceOf(postmessage.Client));
            client.disconnect();
            done();
        }, 100);
    });
});

describe('Sending an event to server', () => {
    it('should fire an event on server\'s reference to a client', (done) => {
        let server = new postmessage.Server(window);
        let client = new postmessage.Client(window, '*');
        server.listen();
        let spy = sinon.spy();
        client.connect(window);
        server.on('connection', (client) => {
            client.on('my-event', spy);
        });
        client.on('connected', () => {
            client.send('my-event');
        });
        setTimeout(() => {
            expect(spy).to.have.been.calledOnce;
            client.disconnect();
            done();
        }, 100);
    });

    it('should pass the payload to the event listener', (done) => {
        let server = new postmessage.Server(window);
        let client = new postmessage.Client(window, '*');
        server.listen();
        let spy = sinon.spy();
        let payload = { foo: 'bar' };
        client.connect(window);
        server.on('connection', (client) => {
            client.on('my-event', spy);
        });
        client.on('connected', () => {
            client.send('my-event', payload);
        });
        setTimeout(() => {
            expect(spy).to.have.been.calledOnce;
            expect(spy).to.have.been.calledWith(payload);
            client.disconnect();
            done();
        }, 100);
    });
});
