import { Menu, MenuHandler, MenuItem, MenuList, Typography } from '@material-tailwind/react';
import { useContext } from 'react';
import { AppState } from '../../store/AppReducer.ts';
import { AppContext, AppDispatchContext } from '../../store/AppContext.ts';
import { XCircleIcon, EyeIcon } from '@heroicons/react/24/outline';
import { generatePresignedUrl } from '../../graphql/presignedUrl/mutations.ts';
import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { OperationType, PresignedUrlMutation } from '../../types/PresignedUrl.ts';
import { useNavigate } from 'react-router-dom';
import { PowerIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { RouterPath } from '../../utils/router.tsx';
import { SELECT_FILE, SET_FILE_PREVIEW } from '../../store/actions.ts';

const client = generateClient();

export default function Header() {
    const { selectedFile } = useContext<AppState>(AppContext);
    const dispatch = useContext(AppDispatchContext);
    const navigate = useNavigate();
    const { signOut } = useAuthenticator((context) => [context.user]);

    const handleSignOut = () => {
        signOut();
        navigate(RouterPath.MAIN);
    };

    const handleRemoveSelectedFile = () => {
        dispatch({ type: SELECT_FILE, payload: undefined });
    };

    const handlePreview = async () => {
        const operationType: OperationType = 'get_object';
        const result = (await client.graphql({
            query: generatePresignedUrl,
            variables: { fileName: selectedFile, operation: operationType },
        })) as GraphQLResult<PresignedUrlMutation>;
        const previewUrl = result.data.generatePresignedUrl.url;
        dispatch({ type: SET_FILE_PREVIEW, payload: { url: previewUrl, filename: selectedFile } });
        navigate(RouterPath.SELECT_DOCUMENT);
    };

    return (
        <header className="flex justify-between items-center px-6 h-16 bg-gray-100 shadow border-b w-full sticky top-0 z-10">
            {selectedFile && (
                <Typography className="font-normal flex items-center gap-5">
                    {`Selected file: ${selectedFile}`}
                    <XCircleIcon
                        onClick={handleRemoveSelectedFile}
                        title="Remove selected document"
                        color="indigo"
                        className="h-5 w-5 cursor-pointer"
                    />
                    <EyeIcon onClick={handlePreview} title="Preview selected document" color="indigo" className="h-5 w-5 cursor-pointer" />
                </Typography>
            )}
            {!selectedFile && 'File is not selected'}
            <Menu>
                <MenuHandler>
                    <UserCircleIcon className="h-8 w-8 cursor-pointer" color="indigo" />
                </MenuHandler>
                <MenuList>
                    <MenuItem className="flex gap-2 items-center" onClick={handleSignOut}>
                        <PowerIcon className="h-5 w-5" /> Log Out
                    </MenuItem>
                </MenuList>
            </Menu>
        </header>
    );
}
