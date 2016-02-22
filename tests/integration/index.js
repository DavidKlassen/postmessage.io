describe('Global reference to postmessage', () => {
    it('should be defined', () => {
        expect(postmessage).to.not.be.undefined;
    });
});

describe('Connecting a client', () => {
    it('should fire a "connection" event', (done) => {
        let server = new postmessage.Server(window);
        let spy = sinon.spy();
        server.on('connection', spy);
        server.listen();
        let client = new postmessage.Client(window, '*');
        client.connect(window);
        setTimeout(() => {
            expect(spy).to.have.been.called;
            done();
        }, 100);
    });
});
