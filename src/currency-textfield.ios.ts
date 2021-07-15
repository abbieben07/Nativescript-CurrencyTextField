import { CurrencyTextFieldBase, FormatMoney, symbolProperty } from './currency-textfield.common';

export class CurrencyTextField extends CurrencyTextFieldBase {
    nativeView: UITextField;
    private _delegate: CurrencyTextDelegate;

    initNativeView(): void {
        (this.nativeView as any).owner = this;
        super.initNativeView();
    }

    createNativeView(): Object {
        const editText: UITextField = super.createNativeView() as UITextField;
        return editText;
    }

    disposeNativeView(): void {
        (this.nativeView as any).owner = null;
        super.disposeNativeView();
    }

    [symbolProperty.setNative](symbol: string): void {
        this._delegate = CurrencyTextDelegate.initWithOwnerAndDefaultImplementation(new WeakRef(this), this._delegate, symbol);
    }

    [symbolProperty.getDefault](): string {
        return '';
    }
}

@NativeClass()
export class CurrencyTextDelegate extends NSObject implements UITextFieldDelegate {
    private _owner: WeakRef<CurrencyTextField>;
    private _defaultImplementation: UITextFieldDelegate;
    private _symbol: string;
    static ObjCProtocols = [UITextFieldDelegate];

    public static initWithOwnerAndDefaultImplementation(owner: WeakRef<CurrencyTextField>, defaultImplementation: UITextFieldDelegate, symbol: string): CurrencyTextDelegate {
        const delegate = super.new() as CurrencyTextDelegate;
        delegate._owner = owner;
        delegate._defaultImplementation = defaultImplementation;
        delegate._symbol = symbol;
        return delegate;
    }

    public textFieldShouldBeginEditing(textField: UITextField): boolean {
        return this._defaultImplementation.textFieldShouldBeginEditing(textField);
    }

    public textFieldDidBeginEditing(textField: UITextField) {
        this._defaultImplementation.textFieldDidBeginEditing(textField);
        textField.selectedTextRange = textField.textRangeFromPositionToPosition(textField.beginningOfDocument, textField.beginningOfDocument);
    }

    public textFieldDidEndEditing(textField: UITextField) {
        this._defaultImplementation.textFieldDidEndEditing(textField);
    }

    public textFieldShouldClear(textField: UITextField): boolean {
        return this._defaultImplementation.textFieldShouldClear(textField);
    }

    public textFieldShouldReturn(textField: UITextField): boolean {
        return this._defaultImplementation.textFieldShouldReturn(textField);
    }

    public textFieldShouldChangeCharactersInRangeReplacementString(textField: UITextField, range: NSRange, replacement: string): boolean {
        const text = textField.text.slice(0, range.location) + replacement + textField.text.slice(range.location);
        const formatted = FormatMoney(text, this._symbol);
        textField.text = formatted;
        this._owner.get().notify({ eventName: 'textChange', value: formatted, object: this, propertyName: 'text' });

        return false;
    }
}
