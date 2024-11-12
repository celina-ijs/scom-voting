/// <amd-module name="@scom/scom-voting/index.css.ts" />
declare module "@scom/scom-voting/index.css.ts" {
    export const votingStyle: string;
}
/// <amd-module name="@scom/scom-voting/interface.ts" />
declare module "@scom/scom-voting/interface.ts" {
    export interface IVoting {
        title: string;
        backgroundImage?: string;
        buttons?: IVotingButton[];
        fontColor?: string;
    }
    export interface IVotingButton {
        value: string;
        label: string;
    }
}
/// <amd-module name="@scom/scom-voting/formSchema.ts" />
declare module "@scom/scom-voting/formSchema.ts" {
    const _default: {
        dataSchema: {
            type: string;
            properties: {
                title: {
                    type: string;
                    label: string;
                    required: boolean;
                };
                backgroundImage: {
                    type: string;
                    label: string;
                };
                buttons: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            value: {
                                type: string;
                                required: boolean;
                            };
                            label: {
                                type: string;
                                required: boolean;
                            };
                        };
                    };
                };
                fontColor: {
                    type: string;
                    format: string;
                };
            };
        };
        uiSchema: {
            type: string;
            elements: {
                type: string;
                elements: {
                    type: string;
                    elements: ({
                        type: string;
                        label: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                scope: string;
                            }[];
                        }[];
                    } | {
                        type: string;
                        label: string;
                        elements: {
                            type: string;
                            scope: string;
                            options: {
                                detail: {
                                    type: string;
                                };
                            };
                        }[];
                    })[];
                }[];
            }[];
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-voting" />
declare module "@scom/scom-voting" {
    import { Module, Container, ControlElement, Control } from '@ijstech/components';
    import { BlockNoteEditor, BlockNoteSpecs, callbackFnType, executeFnType } from '@scom/scom-blocknote-sdk';
    type callbackType = (target: Control, value: string) => void;
    interface ScomVotingElement extends ControlElement {
        onButtonClicked?: callbackType;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-voting"]: ScomVotingElement;
            }
        }
    }
    export default class ScomVoting extends Module implements BlockNoteSpecs {
        private pnlContent;
        private lblTitle;
        private pnlButtons;
        private data;
        tag: any;
        onButtonClicked: callbackType;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomVotingElement, parent?: Container): Promise<ScomVoting>;
        init(): Promise<void>;
        addBlock(blocknote: any, executeFn: executeFnType, callbackFn?: callbackFnType): {
            block: any;
            slashItem: {
                name: string;
                execute: (editor: BlockNoteEditor) => void;
                aliases: string[];
                group: string;
                icon: {
                    name: string;
                };
                hint: string;
            };
            moduleData: {
                name: string;
                localPath: string;
            };
        };
        private getData;
        private setData;
        private getTag;
        private setTag;
        private updateVoting;
        private renderButtons;
        private handleButtonClick;
        getConfigurators(): {
            name: string;
            target: string;
            getActions: () => {
                name: string;
                icon: string;
                command: (builder: any, userInputData: any) => {
                    execute: () => void;
                    undo: () => void;
                    redo: () => void;
                };
                userInputDataSchema: {
                    type: string;
                    properties: {
                        title: {
                            type: string;
                            label: string;
                            required: boolean;
                        };
                        backgroundImage: {
                            type: string;
                            label: string;
                        };
                        buttons: {
                            type: string;
                            items: {
                                type: string;
                                properties: {
                                    value: {
                                        type: string;
                                        required: boolean;
                                    };
                                    label: {
                                        type: string;
                                        required: boolean;
                                    };
                                };
                            };
                        };
                        fontColor: {
                            type: string;
                            format: string;
                        };
                    };
                };
                userInputUISchema: {
                    type: string;
                    elements: {
                        type: string;
                        elements: {
                            type: string;
                            elements: ({
                                type: string;
                                label: string;
                                elements: {
                                    type: string;
                                    elements: {
                                        type: string;
                                        scope: string;
                                    }[];
                                }[];
                            } | {
                                type: string;
                                label: string;
                                elements: {
                                    type: string;
                                    scope: string;
                                    options: {
                                        detail: {
                                            type: string;
                                        };
                                    };
                                }[];
                            })[];
                        }[];
                    }[];
                };
            }[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        private _getActions;
        render(): any;
    }
}
