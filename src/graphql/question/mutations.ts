import { Mutation } from '../../types/Api.ts';
import { PostQuestionInput, PostQuestionOutput } from '../../types/Question.ts';

export const postQuestion = /* GraphQL */ `mutation PostQuestion($questionInput: QuestionInput!) {
  postQuestion(questionInput: $questionInput) {
    success
    message
    conversation_id
    answer
  }
}
` as Mutation<PostQuestionInput, PostQuestionOutput>;
