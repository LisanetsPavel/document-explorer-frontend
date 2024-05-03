import { Sidebar } from '../Sidebar/Sidebar.tsx';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header.tsx';
import { useContext, useEffect } from 'react';
import { AppState } from '../../store/AppReducer.ts';
import { AppContext, AppDispatchContext } from '../../store/AppContext.ts';
import { RouterPath } from '../../utils/router.tsx';
import { REMOVE_FILE_PREVIEW } from '../../store/actions.ts';

export default function MainLayout() {
    const location = useLocation();
    const { previewFile } = useContext<AppState>(AppContext);
    const dispatch = useContext(AppDispatchContext);

    useEffect(() => {
        if (previewFile && location.pathname !== RouterPath.SELECT_DOCUMENT) {
            dispatch({ type: REMOVE_FILE_PREVIEW });
        }
    }, [dispatch, location, previewFile]);

    return (
        <div className="h-auto flex">
            <Sidebar />
            <div className="h-screen w-full overflow-auto">
                <Header />
                <Outlet />
            </div>
        </div>
    );
}
