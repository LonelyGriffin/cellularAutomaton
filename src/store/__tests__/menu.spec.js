import menuStore from "store/menu";
import spies from "chai-spies";

chai.use(spies);

describe('Store/Menu', () => {
	//формальная проверка на наличие
	it('is Object', () => {
		expect(menuStore).to.be.a('object');
	});

	//проверка подписки на изменение
	/*describe('#addListener', () => {

		//проверка вызова callback
		it('callback called', () => {
			let store = new BaseStore();
			let callback = chai.spy();
			store.addListener(callback);
			store._emitChanged();
			expect(callback).to.have.been.called();
		});
	});*/
});