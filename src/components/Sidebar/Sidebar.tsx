import { Card, Typography, List, ListItem, ListItemPrefix } from '@material-tailwind/react';
import { HomeIcon, DocumentIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';
import { NavLink } from 'react-router-dom';
import SidebarFooter from '../SidebarFooter/SidebarFooter.tsx';
import { navLinkClassName, RouterPath } from '../../utils/router.tsx';
import HistoryPanel from '../HistoryPanel/HistoryPanel.tsx';

export function Sidebar() {
    return (
        <Card className="h-auto w-full min-h-screen max-w-[20rem] rounded-none p-4 shadow-xl shadow-blue-gray-900/5 bg-primary">
            <div className="mb-2 p-4">
                <Typography variant="h5" color="blue-gray">
                    Document explorer
                </Typography>
            </div>
            <List>
                <NavLink to={RouterPath.MAIN} className={navLinkClassName}>
                    <ListItem>
                        <ListItemPrefix>
                            <HomeIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Home
                    </ListItem>
                </NavLink>
                <NavLink to={RouterPath.SELECT_DOCUMENT} className={navLinkClassName}>
                    <ListItem>
                        <ListItemPrefix>
                            <DocumentIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Select document
                    </ListItem>
                </NavLink>
                <NavLink to={RouterPath.QUESTION_ANSWERING} className={navLinkClassName}>
                    <ListItem>
                        <ListItemPrefix>
                            <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Q&A
                    </ListItem>
                </NavLink>
                <hr className="my-2 border-blue-gray-100" />
                <HistoryPanel />
            </List>
            <SidebarFooter />
        </Card>
    );
}
