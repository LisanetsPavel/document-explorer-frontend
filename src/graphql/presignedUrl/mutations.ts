import * as APITypes from '../../types/PresignedUrl.ts';
import { Mutation } from '../../types/Api.ts';

export const generatePresignedUrl = /* GraphQL */ `mutation GeneratePresignedUrl($fileName: String!, $operation: String!) {
  generatePresignedUrl(fileName: $fileName, operation: $operation) {
    url
    fileName
    success
    message
    __typename
  }
}
` as Mutation<APITypes.PresignedUrlMutationVariables, APITypes.PresignedUrlMutation>;
