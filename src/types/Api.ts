export type Mutation<InputType, OutputType> = string & {
    __mutationInput: InputType;
    __mutationOutput: OutputType;
};

export type Query<InputType, OutputType> = string & {
    __queryInput: InputType;
    __queryOutput: OutputType;
};

export type Subscription<InputType, OutputType> = string & {
    __mutationInput: InputType;
    __mutationOutput: OutputType;
};
