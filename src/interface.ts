export interface IVoting {
    title: string;
    backgroundImage?: string;
    buttons?: IVotingButton[];
}

export interface IVotingButton {
    value: string;
    label: string;
}