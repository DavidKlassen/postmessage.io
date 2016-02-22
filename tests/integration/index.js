describe('Global reference to postmessage', () => {
    it('should be defined', () => {
        expect(postmessage).to.not.be.undefined;
    });
});

describe('Connecting a client', () => {
    it('should fire a "connection" event', (done) => {
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
