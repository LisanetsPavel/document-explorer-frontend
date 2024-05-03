import { Card, Typography, CardBody, Spinner, Button, CardFooter, CardHeader, Input } from '@material-tailwind/react';
import { useContext, useMemo, useState } from 'react';
import { DataSourceObject } from '../../types/DataSourceObject.ts';
import { AppContext, AppDispatchContext } from '../../store/AppContext.ts';
import { generatePresignedUrl } from '../../graphql/presignedUrl/mutations.ts';
import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { OperationType, PresignedUrlMutation } from '../../types/PresignedUrl.ts';
import { AppState } from '../../store/AppReducer.ts';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useFileSorting } from './hooks.tsx';
import { SELECT_FILE, SET_FILE_PREVIEW } from '../../store/actions.ts';

const TABLE_HEAD = ['File Name', 'Size', 'Last Modified', ''];

interface FileSelectionProps {
    fileList: DataSourceObject[];
    loading?: boolean;
}

const client = generateClient();

const PAGE_SIZE = 5;

export default function FileSelection({ fileList, loading }: FileSelectionProps) {
    const { selectedFile } = useContext<AppState>(AppContext);

    const [previewLoading, setPreviewLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const dispatch = useContext(AppDispatchContext);

    const filteredFileList = useMemo(
        () => fileList?.filter((file) => file.Name?.toLowerCase().includes(searchTerm.toLowerCase())) || [],
        [fileList, searchTerm]
    );

    const { handleSort, getSortIcon, sortedList } = useFileSorting(filteredFileList);

    const totalPages = Math.ceil(sortedList?.length / PAGE_SIZE);

    const rows =
        sortedList?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((file) => {
            return {
                filename: file.Name,
                size: file.Size,
                date: file.LastModified,
            };
        }) || [];

    const handleSelect = (fileName: string) => {
        dispatch({ type: SELECT_FILE, payload: fileName });
    };

    const handlePreview = async (filename: string) => {
        const operationType: OperationType = 'get_object';
        setPreviewLoading(true);
        const result = (await client.graphql({
            query: generatePresignedUrl,
            variables: { fileName: filename, operation: operationType },
        })) as GraphQLResult<PresignedUrlMutation>;
        const previewUrl = result.data.generatePresignedUrl.url;
        dispatch({ type: SET_FILE_PREVIEW, payload: { url: previewUrl, filename } });
        setPreviewLoading(false);
    };

    return (
        <div className="shadow-md p-2 bg-gray-100">
            <h2 className="mb-4">Choose document</h2>
            <Card className="h-90 w-full">
                {(loading || previewLoading) && (
                    <div className="absolute w-full h-full bg-gray-100 opacity-50">
                        <Spinner color="indigo" className="absolute top-1/2 left-1/2" />
                    </div>
                )}
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row pt-4">
                        <div className="w-full md:w-72">
                            <Input
                                label="Search"
                                onChange={(event) => setSearchTerm(event.target.value)}
                                value={searchTerm}
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-auto p-0">
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head, index) => (
                                    <th
                                        onClick={handleSort(head)}
                                        key={head}
                                        className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-100/50 p-2"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between font-normal leading-none opacity-70 my-2"
                                        >
                                            {head}
                                            {index !== TABLE_HEAD.length - 1 && getSortIcon(head)}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(({ filename, size, date }, index) => {
                                const isLast = index === rows.length - 1;
                                const classes = isLast ? 'p-3' : 'p-3 border-b border-blue-gray-50';

                                return (
                                    <tr
                                        key={filename}
                                        className={` ${selectedFile !== filename ? 'hover:bg-gray-100' : ''} ${selectedFile === filename ? 'bg-primaryLight' : ''}`}
                                        onClick={() => handleSelect(filename)}
                                    >
                                        <td className={`${classes} w-2/5`}>
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                                        {filename}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`${classes} w-1/6`}>
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {`${(size / 1024).toFixed(2)} kb`}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {date}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            {filename.endsWith('.pdf') && (
                                                <Button
                                                    variant="text"
                                                    color="indigo"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        handlePreview(filename);
                                                    }}
                                                >
                                                    Preview
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                        Page {page} of {totalPages}
                    </Typography>
                    <div className="flex gap-2">
                        {page > 1 && (
                            <Button variant="outlined" size="sm" onClick={() => setPage(page - 1)}>
                                Previous
                            </Button>
                        )}
                        {page < totalPages && (
                            <Button variant="outlined" size="sm" onClick={() => setPage(page + 1)}>
                                Next
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
