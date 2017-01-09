import Observer from 'declaration/observer';
import spies from 'chai-spies';

chai.use(spies);

describe('declaretion/observer', () => {
	it('Should exist', () => {
		expect(Observer).to.exist();
	});
	it('Should support interface', () => {
		const o = new Observer();
		expect(o.on).to.be.a('function');
		expect(o.off).to.be.a('function');
		expect(o.fire).to.be.a('function');
	});
	it('Should dispatche event', () => {
		const o = new Observer();
		const spy = chai.spy();
		o.on('event', spy);
		o.fire('event');
		expect(spy).to.have.been.called.once();
	});
});