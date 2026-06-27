import { Component } from '../base/Component';

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLButtonElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = this.ensureElement<HTMLButtonElement>('.order-success__close', container);
        this._description = this.ensureElement<HTMLElement>('.order-success__description', container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number) {
        this.setText(this._description, `Списано ${value} синапсов`);
    }

    render(data?: Partial<ISuccess>): HTMLElement {
        if (data) {
            Object.assign(this, data);
        }
        return this.container;
    }
}
