var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-voting/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.votingStyle = void 0;
    exports.votingStyle = components_1.Styles.style({
        aspectRatio: '1.91 / 1'
    });
});
define("@scom/scom-voting/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-voting/formSchema.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-voting/formSchema.ts'/> 
    exports.default = {
        dataSchema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    label: 'Voting Title',
                    required: true
                },
                backgroundImage: {
                    type: 'string',
                    label: 'Voting Background Image'
                },
                buttons: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            value: {
                                type: 'string',
                                required: true
                            },
                            label: {
                                type: 'string',
                                required: true
                            }
                        }
                    }
                },
                fontColor: {
                    type: 'string',
                    format: 'color'
                }
            }
        },
        uiSchema: {
            type: 'VerticalLayout',
            elements: [
                {
                    type: 'HorizontalLayout',
                    elements: [
                        {
                            type: 'Categorization',
                            elements: [
                                {
                                    type: 'Category',
                                    label: 'General',
                                    elements: [
                                        {
                                            type: 'HorizontalLayout',
                                            elements: [
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/title'
                                                }
                                            ]
                                        },
                                        {
                                            type: 'HorizontalLayout',
                                            elements: [
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/backgroundImage'
                                                }
                                            ]
                                        },
                                        {
                                            type: 'HorizontalLayout',
                                            elements: [
                                                {
                                                    type: 'Control',
                                                    scope: '#/properties/fontColor'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'Category',
                                    label: 'Buttons',
                                    elements: [
                                        {
                                            type: 'Control',
                                            scope: '#/properties/buttons',
                                            options: {
                                                detail: {
                                                    type: 'VerticalLayout'
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };
});
define("@scom/scom-voting/model.ts", ["require", "exports", "@scom/scom-voting/formSchema.ts"], function (require, exports, formSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = void 0;
    class Model {
        constructor(module) {
            this.data = { title: '' };
            this.module = module;
        }
        getData() {
            return this.data;
        }
        async setData(value) {
            this.data = value;
            this.updateVoting();
        }
        getTag() {
            return this.module.tag;
        }
        async setTag(value) {
            this.module.tag = value;
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
            ];
        }
        _getActions() {
            const actions = [
                {
                    name: 'Edit',
                    icon: 'edit',
                    command: (builder, userInputData) => {
                        let oldData = { title: '' };
                        return {
                            execute: () => {
                                oldData = JSON.parse(JSON.stringify(this.data));
                                if (builder?.setData)
                                    builder.setData(userInputData);
                            },
                            undo: () => {
                                this.data = JSON.parse(JSON.stringify(oldData));
                                if (builder?.setData)
                                    builder.setData(this.data);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: formSchema_1.default.dataSchema,
                    userInputUISchema: formSchema_1.default.uiSchema
                }
            ];
            return actions;
        }
    }
    exports.Model = Model;
});
define("@scom/scom-voting", ["require", "exports", "@ijstech/components", "@scom/scom-voting/index.css.ts", "@scom/scom-blocknote-sdk", "@scom/scom-voting/model.ts"], function (require, exports, components_2, index_css_1, scom_blocknote_sdk_1, model_1) {
    "use strict";
    var ScomVoting_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    let ScomVoting = ScomVoting_1 = class ScomVoting extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.tag = {};
            this.initModel();
        }
        static async create(options, parent) {
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
        addBlock(blocknote, executeFn, callbackFn) {
            const blockType = 'voting';
            const moduleData = {
                name: '@scom/scom-voting',
                localPath: 'scom-voting'
            };
            const votingRegex = /https:\/\/widget.noto.fan\/(#!\/)?scom\/scom-voting\/\S+/g;
            function getData(href) {
                const widgetData = (0, scom_blocknote_sdk_1.parseUrl)(href);
                if (widgetData) {
                    const { module, properties } = widgetData;
                    if (module.localPath === moduleData.localPath)
                        return { ...properties };
                }
                return false;
            }
            const VotingBlock = blocknote.createBlockSpec({
                type: blockType,
                propSchema: {
                    ...blocknote.defaultProps,
                    title: { default: '' },
                    backgroundImage: { default: '' },
                    buttons: { default: [] },
                    fontColor: { default: '' }
                },
                content: 'none'
            }, {
                render: (block) => {
                    const wrapper = new components_2.Panel();
                    const props = JSON.parse(JSON.stringify(block.props));
                    wrapper.maxWidth = 780;
                    const customElm = new ScomVoting_1(wrapper, { ...props });
                    if (typeof callbackFn === 'function') {
                        callbackFn(customElm, block);
                    }
                    wrapper.appendChild(customElm);
                    return {
                        dom: wrapper
                    };
                },
                parseFn: () => {
                    return [
                        {
                            tag: `div[data-content-type=${blockType}]`,
                            node: blockType
                        },
                        {
                            tag: "a",
                            getAttrs: (element) => {
                                if (typeof element === "string") {
                                    return false;
                                }
                                const href = element.getAttribute('href');
                                if (href)
                                    return getData(href);
                                return false;
                            },
                            priority: 408,
                            node: blockType
                        },
                        {
                            tag: "p",
                            getAttrs: (element) => {
                                if (typeof element === "string") {
                                    return false;
                                }
                                const child = element.firstChild;
                                if (child?.nodeName === 'A' && child.getAttribute('href')) {
                                    const href = child.getAttribute('href');
                                    return getData(href);
                                }
                                return false;
                            },
                            priority: 409,
                            node: blockType
                        }
                    ];
                },
                toExternalHTML: (block, editor) => {
                    const link = document.createElement("a");
                    const url = (0, scom_blocknote_sdk_1.getWidgetEmbedUrl)({
                        type: blockType,
                        props: { ...(block.props || {}) }
                    }, moduleData);
                    link.setAttribute("href", url);
                    link.textContent = blockType;
                    const wrapper = document.createElement("p");
                    wrapper.appendChild(link);
                    return { dom: wrapper };
                },
                pasteRules: [
                    {
                        find: votingRegex,
                        handler(props) {
                            const { state, chain, range } = props;
                            const textContent = state.doc.resolve(range.from).nodeAfter?.textContent;
                            const widgetData = (0, scom_blocknote_sdk_1.parseUrl)(textContent);
                            if (!widgetData)
                                return null;
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
            });
            const VotingSlashItem = {
                name: "Voting",
                execute: (editor) => {
                    const block = {
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
            };
        }
        getConfigurators() {
            this.initModel();
            return this.model.getConfigurators();
        }
        getData() {
            return this.model.getData();
        }
        async setData(value) {
            this.model.setData(value);
        }
        getTag() {
            return this.tag;
        }
        async setTag(value) {
            this.model.setTag(value);
        }
        updateVoting() {
            const { title, backgroundImage, fontColor } = this.model.getData();
            this.lblTitle.caption = title || '';
            if (backgroundImage) {
                this.pnlContent.background = { image: backgroundImage };
            }
            else {
                this.pnlContent.background = { color: Theme.background.gradient };
            }
            this.lblTitle.font = {
                size: '1.75rem',
                color: fontColor || Theme.text.secondary,
                weight: 600,
                style: 'italic'
            };
            this.renderButtons();
        }
        renderButtons() {
            this.pnlButtons.clearInnerHTML();
            const { buttons } = this.model.getData();
            if (!buttons) {
                this.pnlButtons.visible = false;
                return;
            }
            this.pnlButtons.visible = true;
            for (let data of buttons) {
                const button = new components_2.Button(undefined, {
                    caption: data.label || data.value || '',
                    height: '2.25rem',
                    padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' },
                    border: { radius: '0.5rem' },
                    stack: { grow: '1' },
                    background: { color: Theme.colors.secondary.main },
                    font: { size: '0.875rem', color: Theme.colors.secondary.contrastText, weight: 400 }
                });
                button.onClick = (target) => {
                    this.handleButtonClick(target, data.value);
                };
                this.pnlButtons.appendChild(button);
            }
        }
        handleButtonClick(target, value) {
            if (typeof this.onButtonClicked === 'function')
                this.onButtonClicked(target, value);
        }
        initModel() {
            if (!this.model) {
                this.model = new model_1.Model(this);
                this.model.updateVoting = this.updateVoting.bind(this);
            }
        }
        render() {
            return (this.$render("i-panel", { width: "100%", height: "100%", border: { radius: '0.5rem' }, background: { color: Theme.action.disabledBackground }, overflow: "hidden" },
                this.$render("i-stack", { id: "pnlContent", class: index_css_1.votingStyle, direction: 'vertical', alignItems: 'center', justifyContent: 'center', background: { color: Theme.background.gradient } },
                    this.$render("i-label", { id: "lblTitle", font: { size: '1.75rem', color: Theme.text.secondary, weight: 600, style: 'italic' } })),
                this.$render("i-stack", { id: "pnlButtons", direction: "horizontal", alignItems: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, gap: "0.5rem", visible: false })));
        }
    };
    ScomVoting = ScomVoting_1 = __decorate([
        components_2.customModule,
        (0, components_2.customElements)('i-scom-voting')
    ], ScomVoting);
    exports.default = ScomVoting;
});
