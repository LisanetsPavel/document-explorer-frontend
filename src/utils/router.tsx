import { createHashRouter } from 'react-router-dom';
import MainLayout from '../components/MainLayout/MainLayout.tsx';
import Home from '../pages/Home/Home.tsx';
import SelectDocument from '../pages/SelectDocument/SelectDocument.tsx';
import QuestionAnswering from '../pages/QuestionAnswering/QuestionAnswering.tsx';

export enum RouterPath {
    MAIN = '/',
    SELECT_DOCUMENT = '/select-document',
    QUESTION_ANSWERING = '/question-answering',
}

const QUESTION_ANSWERING_PARAM = ':historyId';

export const router = createHashRouter([
    {
        path: RouterPath.MAIN,
        element: <MainLayout />,
        children: [
            {
                path: RouterPath.MAIN,
                element: <Home />,
            },
            {
                path: RouterPath.SELECT_DOCUMENT,
                element: <SelectDocument />,
            },
            {
                path: RouterPath.QUESTION_ANSWERING,
                element: <QuestionAnswering />,
                children: [{ path: QUESTION_ANSWERING_PARAM, element: <QuestionAnswering /> }],
            },
        ],
    },
]);

export const navLinkClassName = ({ isActive }: { isActive: boolean }) => (isActive ? 'font-bold' : '');
