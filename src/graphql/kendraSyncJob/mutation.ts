import { Mutation } from '../../types/Api.ts';

export const startKendraSyncJob = /* GraphQL */ `mutation StartKendraSyncJob {
  startKendraSyncJob {
    CreatedOn
    ErrorMessage
    KendraJobExecId
    Status
    StepFunctionExecArn
  }
}
` as Mutation<
    void,
    {
        startKendraSyncJob: {
            CreatedOn: string;
            ErrorMessage: string;
            KendraJobExecId: string;
            Status: string;
            StepFunctionExecArn: string;
        };
    }
>;
