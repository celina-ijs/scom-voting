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
import { Block, BlockNoteEditor, BlockNoteSpecs, callbackFnType, executeFnType, getWidgetEmbedUrl, parseUrl } from '@scom/scom-blocknote-sdk';

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
export default class ScomVoting extends Module implements BlockNoteSpecs {
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
        const title = this.getAttribute('title', true);
        const backgroundImage = this.getAttribute('backgroundImage', true);
        const buttons = this.getAttribute('buttons', true);
        const fontColor = this.getAttribute('fontColor', true);
        if (title || buttons) {
            this.setData({ title, backgroundImage, buttons, fontColor });
        }
    }

    addBlock(blocknote: any, executeFn: executeFnType, callbackFn?: callbackFnType) {
        const blockType = 'voting';
        const moduleData = {
            name: '@scom/scom-voting',
            localPath: 'scom-voting'
        };

        const votingRegex = /https:\/\/widget.noto.fan\/(#!\/)?scom\/scom-voting\/\S+/g;
        function getData(href: string) {
            const widgetData = parseUrl(href);
            if (widgetData) {
                const { module, properties } = widgetData;
                if (module.localPath === moduleData.localPath) return { ...properties };
            }
            return false;
        }

        const VotingBlock = blocknote.createBlockSpec(
            {
                type: blockType,
                propSchema: {
                    ...blocknote.defaultProps,
                    title: { default: '' },
                    backgroundImage: { default: '' },
                    buttons: { default: [] },
                    fontColor: { default: '' }
                },
                content: 'none'
            },
            {
                render: (block: Block) => {
                    const wrapper = new Panel();
                    const props = JSON.parse(JSON.stringify(block.props));
                    wrapper.maxWidth = 780;
                    const customElm = new ScomVoting(wrapper, { ...props });
                    if (typeof callbackFn === 'function') {
                        callbackFn(customElm, block);
                    }
                    wrapper.appendChild(customElm);
                    return {
                        dom: wrapper
                    }
                },
                parseFn: () => {
                    return [
                        {
                            tag: `div[data-content-type=${blockType}]`,
                            node: blockType
                        },
                        {
                            tag: "a",
                            getAttrs: (element: string | HTMLElement) => {
                                if (typeof element === "string") {
                                    return false;
                                }
                                const href = element.getAttribute('href');
                                if (href) return getData(href);
                                return false;
                            },
                            priority: 408,
                            node: blockType
                        },
                        {
                            tag: "p",
                            getAttrs: (element: string | HTMLElement) => {
                                if (typeof element === "string") {
                                    return false;
                                }
                                const child = element.firstChild as HTMLElement;
                                if (child?.nodeName === 'A' && child.getAttribute('href')) {
                                    const href = child.getAttribute('href');
                                    return getData(href);
                                }
                                return false;
                            },
                            priority: 409,
                            node: blockType
                        }
                    ]
                },
                toExternalHTML: (block: any, editor: any) => {
                    const link = document.createElement("a");
                    const url = getWidgetEmbedUrl(
                        {
                            type: blockType,
                            props: { ...(block.props || {}) }
                        },
                        moduleData
                    );
                    link.setAttribute("href", url);
                    link.textContent = blockType;
                    const wrapper = document.createElement("p");
                    wrapper.appendChild(link);
                    return { dom: wrapper }
                },
                pasteRules: [
                    {
                        find: votingRegex,
                        handler(props: any) {
                            const { state, chain, range } = props;
                            const textContent = state.doc.resolve(range.from).nodeAfter?.textContent;
                            const widgetData = parseUrl(textContent);
                            if (!widgetData) return null;
                            const { properties } = widgetData;
                            chain().BNUpdateBlock(state.selection.from, {
                                type: blockType,
                                props: {
                                    ...properties
                                },
                            }).setTextSelection(range.from + 1);
                        }
                    }
                ]
            }
        );
        const VotingSlashItem = {
            name: "Voting",
            execute: (editor: BlockNoteEditor) => {
                const block: any = {
                    type: blockType,
                    props: {
                        title: 'Do you schedule casts?',
                        buttons: [
                            {
                                value: 'yes',
                                label: 'Yes'
                            },
                            {
                                value: 'no',
                                label: 'No'
                            },
                            {
                                value: 'sometimes',
                                label: 'Sometimes'
                            }
                        ]
                    }
                };
                if (typeof executeFn === 'function') {
                    executeFn(editor, block);
                }
            },
            aliases: [blockType, "widget"],
            group: "Widget",
            icon: { name: 'vote-yea' },
            hint: "Insert a voting widget"
        };

        return {
            block: VotingBlock,
            slashItem: VotingSlashItem,
            moduleData
        }
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
            this.pnlContent.background = { image: this.data.backgroundImage };
        } else {
            this.pnlContent.background = { color: Theme.background.gradient };
        }
        this.lblTitle.font = {
            size: '1.75rem',
            color: this.data.fontColor || Theme.text.secondary,
            weight: 600,
            style: 'italic'
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
        if (typeof this.onButtonClicked === 'function')
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
                    <i-label id="lblTitle" font={{ size: '1.75rem', color: Theme.text.secondary, weight: 600, style: 'italic' }}></i-label>
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