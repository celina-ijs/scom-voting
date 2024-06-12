import {
    Module,
    customModule,
    IDataSchema,
    Container,
    ControlElement,
    customElements,
    Panel,
    Control,
    Styles,
    StackLayout,
    Label,
    Button
} from '@ijstech/components';
import { votingStyle } from './index.css';
import { IVoting } from './interface';
import formSchema from './formSchema';

const Theme = Styles.Theme.ThemeVars;
type callbackType = (target: Control, value: string) => void;

interface ScomVotingElement extends ControlElement {
    onButtonClicked?: callbackType;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ["i-scom-voting"]: ScomVotingElement;
        }
    }
}

@customModule
@customElements('i-scom-voting')
export default class ScomVoting extends Module {
    private pnlContent: StackLayout;
    private lblTitle: Label;
    private pnlButtons: StackLayout;
    private data: IVoting = {
        title: ''
    };

    tag: any = {};
    onButtonClicked: callbackType;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    static async create(options?: ScomVotingElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    async init() {
        super.init();
        this.onButtonClicked = this.getAttribute('onButtonClicked', true) || this.onButtonClicked;
    }

    private getData() {
        return this.data
    }

    private async setData(value: IVoting) {
        this.data = value;
        this.updateVoting();
    }

    private getTag() {
        return this.tag
    }

    private async setTag(value: any) {
        this.tag = value;
    }

    private updateVoting() {
        this.lblTitle.caption = this.data.title || '';
        if (this.data.backgroundImage) {
            this.pnlContent.background.image = this.data.backgroundImage;
        }
        this.renderButtons();
    }

    private renderButtons() {
        this.pnlButtons.clearInnerHTML();
        if (!this.data.buttons) {
            this.pnlButtons.visible = false;
            return;
        }
        this.pnlButtons.visible = true;
        for (let data of this.data.buttons) {
            const button = new Button(undefined, {
                caption: data.label || data.value || '',
                height: '2.25rem',
                padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' },
                border: { radius: '0.5rem' },
                stack: { grow: '1' },
                background: { color: Theme.colors.secondary.main },
                font: { size: '0.875rem', color: Theme.colors.secondary.contrastText, weight: 400 }
            });
            button.onClick = (target: Button) => {
                this.handleButtonClick(target, data.value);
            }
            this.pnlButtons.appendChild(button);
        }
    }

    private handleButtonClick(target: Button, value: string) {
        if (this.onButtonClicked)
            this.onButtonClicked(target, value);
    }

    getConfigurators() {
        return [
            {
                name: 'Editor',
                target: 'Editor',
                getActions: () => {
                    return this._getActions();
                },
                getData: this.getData.bind(this),
                setData: this.setData.bind(this),
                getTag: this.getTag.bind(this),
                setTag: this.setTag.bind(this)
            }
        ]
    }

    private _getActions() {
        const actions = [
            {
                name: 'Edit',
                icon: 'edit',
                command: (builder: any, userInputData: any) => {
                    let oldData: IVoting = { title: '' };
                    return {
                        execute: () => {
                            oldData = JSON.parse(JSON.stringify(this.data));
                            if (builder?.setData) builder.setData(userInputData);
                        },
                        undo: () => {
                            this.data = JSON.parse(JSON.stringify(oldData));
                            if (builder?.setData) builder.setData(this.data);
                        },
                        redo: () => { }
                    }
                },
                userInputDataSchema: formSchema.dataSchema,
                userInputUISchema: formSchema.uiSchema
            }
        ]
        return actions;
    }

    render() {
        return (
            <i-panel width="100%" height="100%" border={{ radius: '0.5rem' }} background={{ color: Theme.action.disabledBackground }} overflow="hidden">
                <i-stack
                    id="pnlContent"
                    class={votingStyle}
                    direction='vertical'
                    alignItems='center'
                    justifyContent='center'
                    background={{ color: Theme.background.gradient }}
                >
                    <i-label id="lblTitle" font={{ size: '1.75rem', color: Theme.text.secondary, weight: 600 }}></i-label>
                </i-stack>
                <i-stack
                    id="pnlButtons"
                    direction="horizontal"
                    alignItems="center"
                    padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                    gap="0.5rem"
                    visible={false}
                ></i-stack>
            </i-panel>
        )
    }
}