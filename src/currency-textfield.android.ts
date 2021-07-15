import { CurrencyTextFieldBase, FormatMoney, symbolProperty } from './currency-textfield.common';

export class CurrencyTextField extends CurrencyTextFieldBase {
    //currencyTextChangeListener:
    nativeView: android.widget.EditText;
    currencyTextWatcher: android.text.TextWatcher;

    initNativeView(): void {
        (this.nativeView as any).owner = this;
        super.initNativeView();
    }

    createNativeView(): Object {
        const editText: android.widget.EditText = super.createNativeView() as android.widget.EditText;
        editText.removeTextChangedListener((editText as any).listener);
        //this.currencyTextWatcher = new CurrencyTextWatcher(new WeakRef(this), '₦');
        return editText;
    }

    disposeNativeView(): void {
        (this.nativeView as any).owner = null;
        super.disposeNativeView();
    }

    [symbolProperty.setNative](symbol: string): void {
        const editText: android.widget.EditText = this.nativeView;
        if (this.currencyTextWatcher) {
            editText.removeTextChangedListener(this.currencyTextWatcher);
        }
        editText.setText(FormatMoney(editText.getText().toString(), symbol));
        const currencyTextField: CurrencyTextField = this;
        this.currencyTextWatcher = new android.text.TextWatcher({
            afterTextChanged(s: any) {},
            beforeTextChanged(s: string, start: number, before: number, count: number) {},
            onTextChanged(s: string, start: number, before: number, count: number) {
                editText.removeTextChangedListener(this);

                const formatted = FormatMoney(s.toString(), symbol);
                editText.setText(formatted);
                editText.setSelection(formatted.length);

                currencyTextField.notify({ eventName: 'textChange', value: formatted, object: this, propertyName: 'text' });

                editText.addTextChangedListener(this);
            }
        });
        editText.addTextChangedListener(this.currencyTextWatcher);
    }

    [symbolProperty.getDefault](): string {
        return '';
    }
}

@Interfaces([android.text.TextWatcher])
class CurrencyTextWatcher extends java.lang.Object implements android.text.TextWatcher {
    constructor(private owner: WeakRef<CurrencyTextField>, private symbol: string) {
        super();
        return global.__native(this);
    }

    afterTextChanged(s: any) {}

    beforeTextChanged(s: string, start: number, before: number, count: number) {}

    onTextChanged(s: string, start: number, before: number, count: number) {
        const owner = this.owner.get();
        const editText: android.widget.EditText = owner.nativeView;
        editText.removeTextChangedListener(this);

        const formatted = FormatMoney(s.toString(), this.symbol);
        editText.setText(formatted);
        editText.setSelection(formatted.length);

        editText.addTextChangedListener(this);
    }
}
