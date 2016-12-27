import  Dispatcher from  "service/dispatcher";

let EventEmitter = require('events').EventEmitter;

describe('Service/Dispatcher', () => {
  it('is EventEmitter', () => {
    expect(Dispatcher).to.be.an.instanceof(EventEmitter);
  });
});