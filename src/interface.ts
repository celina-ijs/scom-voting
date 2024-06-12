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