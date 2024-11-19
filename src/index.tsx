import {
    Module,
    customModule,
    Container,
    ControlElement,
    customElements,
    Control,
    Styles,
    StackLayout,
    Label,
    Panel,
    Button
} from '@ijstech/components';
import { votingStyle } from './index.css';
import { IVoting } from './interface';
import { Block, BlockNoteEditor, BlockNoteSpecs, callbackFnType, executeFnType, getWidgetEmbedUrl, parseUrl } from '@scom/scom-blocknote-sdk';
import { Model } from './model';

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
    private model: Model;
    private pnlContent: StackLayout;
    private lblTitle: Label;
    private pnlButtons: StackLayout;

    tag: any = {};
    onButtonClicked: callbackType;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        this.initModel();
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

    getConfigurators() {
        this.initModel();
        return this.model.getConfigurators();
    }

    getData() {
        return this.model.getData();
    }

    private async setData(value: IVoting) {
        this.model.setData(value);
    }

    getTag() {
        return this.tag;
    }

    async setTag(value: any) {
        this.model.setTag(value);
    }

    private updateVoting() {
        const { title, backgroundImage, fontColor } = this.model.getData();
        this.lblTitle.caption = title || '';
        if (backgroundImage) {
            this.pnlContent.background = { image: backgroundImage };
        } else {
            this.pnlContent.background = { color: Theme.background.gradient };
        }
        this.lblTitle.font = {
            size: '1.75rem',
            color: fontColor || Theme.text.secondary,
            weight: 600,
            style: 'italic'
        }
        this.renderButtons();
    }

    private renderButtons() {
        this.pnlButtons.clearInnerHTML();
        const { buttons } = this.model.getData();
        if (!buttons) {
            this.pnlButtons.visible = false;
            return;
        }
        this.pnlButtons.visible = true;
        for (let data of buttons) {
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

    private initModel() {
        if (!this.model) {
            this.model = new Model(this);
            this.model.updateVoting = this.updateVoting.bind(this);
        }
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