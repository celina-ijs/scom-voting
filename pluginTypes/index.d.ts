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
/// <amd-module name="@scom/scom-voting/model.ts" />
declare module "@scom/scom-voting/model.ts" {
    import { Module } from '@ijstech/components';
    import { IVoting } from "@scom/scom-voting/interface.ts";
    export class Model {
        private module;
        private data;
        updateVoting: () => void;
        constructor(module: Module);
        getData(): IVoting;
        setData(value: IVoting): Promise<void>;
        getTag(): any;
        setTag(value: any): Promise<void>;
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
    }
}
/// <amd-module name="@scom/scom-voting" />
declare module "@scom/scom-voting" {
    import { Module, Container, ControlElement, Control } from '@ijstech/components';
    import { IVoting } from "@scom/scom-voting/interface.ts";
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
        private model;
        private pnlContent;
        private lblTitle;
        private pnlButtons;
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
        getData(): IVoting;
        private setData;
        getTag(): any;
        setTag(value: any): Promise<void>;
        private updateVoting;
        private renderButtons;
        private handleButtonClick;
        private initModel;
        render(): any;
    }
}
