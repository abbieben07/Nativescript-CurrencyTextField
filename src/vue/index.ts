import { CurrencyTextField } from '../currency-textfield';

export default {
    install(Vue) {
        Vue.registerElement('CurrencyTextField', () => CurrencyTextField, {
            model: {
                value: 'text.value',
                event: 'textChange'
            }
        });
    }
};
