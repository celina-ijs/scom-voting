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
            };
        };
        uiSchema: {
            type: string;
            elements: {
                type: string;
                elements: {
                    type: string;
                    elements: {
                        type: string;
                        label: string;
                        elements: ({
                            type: string;
                            elements: {
                                type: string;
                                scope: string;
                            }[];
                            label?: undefined;
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
            }[];
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-voting" />
declare module "@scom/scom-voting" {
    import { Module, Container, ControlElement, Control } from '@ijstech/components';
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
    export default class ScomVoting extends Module {
        private pnlContent;
        private lblTitle;
        private pnlButtons;
        private data;
        tag: any;
        onButtonClicked: callbackType;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomVotingElement, parent?: Container): Promise<ScomVoting>;
        init(): Promise<void>;
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
                    };
                };
                userInputUISchema: {
                    type: string;
                    elements: {
                        type: string;
                        elements: {
                            type: string;
                            elements: {
                                type: string;
                                label: string;
                                elements: ({
                                    type: string;
                                    elements: {
                                        type: string;
                                        scope: string;
                                    }[];
                                    label?: undefined;
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
