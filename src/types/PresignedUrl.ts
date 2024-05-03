export type OperationType = 'get_object' | 'put_object';

export type PresignedUrlMutationVariables = {
    fileName: string;
    operation: OperationType;
};

export type PresignedUrlMutation = {
    generatePresignedUrl: {
        url: string;
        fileName: string;
        success: boolean;
        message: string;
    };
};
