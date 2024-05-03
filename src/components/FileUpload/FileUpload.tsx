import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { generatePresignedUrl } from '../../graphql/presignedUrl/mutations.ts';
import { generateClient, GraphQLResult } from 'aws-amplify/api';
import axios from 'axios';
import { Progress } from '@material-tailwind/react';
import { startKendraSyncJob } from '../../graphql/kendraSyncJob/mutation.ts';
import { OperationType, PresignedUrlMutation } from '../../types/PresignedUrl.ts';

const client = generateClient();

interface FileUploadProps {
    fetchFileList: () => void;
}

interface FileUploadState {
    [key: string]: { progress?: number; error?: string };
}

export default function FileUpload({ fetchFileList }: FileUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const [uploadProgress, setUploadProgress] = useState<FileUploadState>({});

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const selectedFileNames = selectedFiles.map((file) => file.name);
            const filteredAcceptedFiles = acceptedFiles.filter((file) => !selectedFileNames.includes(file.name));
            setSelectedFiles([...selectedFiles, ...filteredAcceptedFiles]);
        },
        [selectedFiles]
    );

    const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({ onDrop });

    const dynamicStyle = `
    ${isFocused ? 'border-blue-500' : ''}
    ${isDragAccept ? 'border-green-500' : ''}
    ${isDragReject ? 'border-red-500' : ''}
  `;

    const handleUpload = async () => {
        const operationType: OperationType = 'put_object';
        await Promise.allSettled(
            selectedFiles.map(async (file) => {
                const result = (await client.graphql({
                    query: generatePresignedUrl,
                    variables: { fileName: file.name, operation: operationType },
                })) as GraphQLResult<PresignedUrlMutation>;
                const uploadUrl = result.data.generatePresignedUrl.url;

                if (!uploadUrl) {
                    setUploadProgress((prevState) => ({ ...prevState, [file.name]: { error: result.data.generatePresignedUrl.message } }));
                    return Promise.reject(result.data.generatePresignedUrl.message);
                }

                return axios
                    .request({
                        url: uploadUrl,
                        method: 'PUT',
                        headers: {
                            'Content-type': file.type,
                        },
                        data: file,
                        onUploadProgress: (p) => {
                            if (p && p.progress) {
                                const progress = p.progress * 100;
                                setUploadProgress((prevState) => ({ ...prevState, [file.name]: { progress } }));
                            }
                        },
                    })
                    .catch((error) => {
                        console.error('File upload failed', error);
                        setUploadProgress((prevState) => ({ ...prevState, [file.name]: { error: error } }));
                    });
            })
        );

        fetchFileList();

        await client.graphql({
            query: startKendraSyncJob,
        });

        /*   TODO subscription API doesn't work on BE now, implement it*/

        /*        const updateSub = client
            .graphql({
                query: updateDataSourceSyncStatusSubscription,
                variables: { data: {KendraJobExecId: result.data.startKendraSyncJob.KendraJobExecId}}
            })
            .subscribe({
                next: (data: never) => {
                    // TODO: implement progress
                    console.log('subscribe', data);
                },
                error: (error: never) => console.warn(error)
            });

        console.log('updateSub', updateSub);*/

        setSelectedFiles([]);
        setUploadProgress({});
    };

    return (
        <div className="shadow-md p-2 bg-gray-100">
            <h2 className="mb-4">Upload file</h2>
            <section className="pt-2">
                <div
                    {...getRootProps({
                        className: `flex flex-col items-center p-5 border-2 border-dashed rounded border-gray-200 bg-gray-50 text-gray-400 outline-none transition-all duration-75 ${dynamicStyle}`,
                    })}
                >
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                </div>

                <aside className="m-2 text-left">
                    <h3 className="m-2">Files to upload: </h3>
                    <ul>
                        {selectedFiles.map((file) => (
                            <li key={file.name} className="mt-2">
                                <div className="flex flex-row items-baseline">
                                    <div className="w-1/4">
                                        {file.name} - {file.size} bytes
                                    </div>
                                    <div className="w-3/4">
                                        {uploadProgress[file.name]?.error ? (
                                            <div className="text-red-500">Error: {uploadProgress[file.name]?.error}</div>
                                        ) : (
                                            <Progress value={uploadProgress[file.name]?.progress} color="indigo" />
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>
                <button
                    onClick={handleUpload}
                    disabled={selectedFiles.length === 0}
                    className="bg-primary hover:bg-primaryHover disabled:bg-primaryLight disabled:hover:bg-primaryLight text-white font-bold py-2 px-4 rounded"
                >
                    Upload
                </button>
            </section>
        </div>
    );
}
