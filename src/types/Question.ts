export type PostQuestionOutput = {
    postQuestion: {
        success: boolean;
        message: string;
        conversation_id: string;
        answer: string;
    };
};

export type PostQuestionInput = {
    questionInput: {
        question: string;
        conversationId?: string;
    };
};
