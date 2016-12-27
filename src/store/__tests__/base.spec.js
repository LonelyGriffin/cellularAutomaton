import BaseStore from "store/base";
import spies from "chai-spies";

chai.use(spies);

describe('Store/Base', () => {
	//формальная проверка на наличие
	it('is Constructor', () => {
		expect(BaseStore).to.be.a('function');
	});

	//проверка подписки на изменение
	describe('#addListener', () => {
		//проверка вызова callback
		it('callback called', () => {
			let store = new BaseStore();
			let callback = chai.spy();
			store.addListener(callback);
			store._emitChanged();
			expect(callback).to.have.been.called();
		});
		//проверка передачи состояния в callback
		it('callback called whith store state param', () => {
			let store = new BaseStore();
			let callback = chai.spy((state) => {
				expect(state).to.be.an('object');
			});
			store.addListener(callback);
			store._emitChanged();
		});
	});
	// проверка получения состояния
	describe("#getState", () => {
		it('get value', () => {
			let store = new BaseStore();
			let state = store.getState();
			expect(state).to.eql({});
		});
	});
});