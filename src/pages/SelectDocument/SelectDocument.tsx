import FileUpload from '../../components/FileUpload/FileUpload.tsx';
import FileSelection from '../../components/FileSelection/FileSelection.tsx';
import { useEffect, useState } from 'react';
import { DataSourceObject, DataSourceObjectsOutput } from '../../types/DataSourceObject.ts';
import { dataSourceObjectsList } from '../../graphql/dataSourceObject/quieries.ts';
import { GraphQLResult, generateClient } from 'aws-amplify/api';
import FilePreview from '../../components/FilePreview/FilePreview.tsx';

const client = generateClient();

export default function SelectDocument() {
    const [fileList, setFileList] = useState<DataSourceObject[]>([]);
    const [fileListLoading, setFileListLoading] = useState<boolean>(false);

    async function fetchFileList() {
        setFileListLoading(true);
        const result = (await client.graphql({
            query: dataSourceObjectsList,
        })) as GraphQLResult<DataSourceObjectsOutput>;
        setFileListLoading(false);
        setFileList(result.data.dataSourceObjectsList.objects);
    }

    useEffect(() => {
        fetchFileList();
    }, []);

    return (
        <div className="p-6 w-full flex flex-col gap-6">
            <FileUpload fetchFileList={fetchFileList} />
            <FileSelection fileList={fileList} loading={fileListLoading} />
            <FilePreview />
        </div>
    );
}
