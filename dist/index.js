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
                                        },
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
define("@scom/scom-voting", ["require", "exports", "@ijstech/components", "@scom/scom-voting/index.css.ts", "@scom/scom-voting/formSchema.ts"], function (require, exports, components_2, index_css_1, formSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    let ScomVoting = class ScomVoting extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.data = {
                title: ''
            };
            this.tag = {};
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        async init() {
            super.init();
            this.onButtonClicked = this.getAttribute('onButtonClicked', true) || this.onButtonClicked;
        }
        getData() {
            return this.data;
        }
        async setData(value) {
            this.data = value;
            this.updateVoting();
        }
        getTag() {
            return this.tag;
        }
        async setTag(value) {
            this.tag = value;
        }
        updateVoting() {
            this.lblTitle.caption = this.data.title || '';
            if (this.data.backgroundImage) {
                this.pnlContent.background.image = this.data.backgroundImage;
            }
            this.renderButtons();
        }
        renderButtons() {
            this.pnlButtons.clearInnerHTML();
            if (!this.data.buttons) {
                this.pnlButtons.visible = false;
                return;
            }
            this.pnlButtons.visible = true;
            for (let data of this.data.buttons) {
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
        render() {
            return (this.$render("i-panel", { width: "100%", height: "100%", border: { radius: '0.5rem' }, background: { color: Theme.action.disabledBackground }, overflow: "hidden" },
                this.$render("i-stack", { id: "pnlContent", class: index_css_1.votingStyle, direction: 'vertical', alignItems: 'center', justifyContent: 'center', background: { color: Theme.background.gradient } },
                    this.$render("i-label", { id: "lblTitle", font: { size: '1.75rem', color: Theme.text.secondary, weight: 600 } })),
                this.$render("i-stack", { id: "pnlButtons", direction: "horizontal", alignItems: "center", padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, gap: "0.5rem", visible: false })));
        }
    };
    ScomVoting = __decorate([
        components_2.customModule,
        (0, components_2.customElements)('i-scom-voting')
    ], ScomVoting);
    exports.default = ScomVoting;
});
