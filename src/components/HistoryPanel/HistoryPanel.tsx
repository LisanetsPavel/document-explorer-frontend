import { Accordion, AccordionBody, AccordionHeader, List, ListItem, ListItemPrefix, Typography } from '@material-tailwind/react';
import { ArchiveBoxIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { useContext, useState } from 'react';
import { AppState } from '../../store/AppReducer.ts';
import { AppContext } from '../../store/AppContext.ts';
import { NavLink } from 'react-router-dom';
import { navLinkClassName, RouterPath } from '../../utils/router.tsx';

export default function HistoryPanel() {
    const [isHistoryOpen, setIsHistoryOpen] = useState(true);
    const { history } = useContext<AppState>(AppContext);

    const historyEntries = Object.entries(history);

    if (historyEntries.length === 0) {
        return null;
    }

    return (
        <Accordion
            open={isHistoryOpen}
            icon={<ChevronDownIcon strokeWidth={2.5} className={`mx-auto h-4 w-4 transition-transform ${isHistoryOpen ? 'rotate-180' : ''}`} />}
        >
            <ListItem className="p-0">
                <AccordionHeader onClick={() => setIsHistoryOpen(!isHistoryOpen)} className="border-b-0 p-3">
                    <ListItemPrefix>
                        <ArchiveBoxIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <Typography color="blue-gray" className="mr-auto font-normal">
                        History
                    </Typography>
                </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
                <List className="p-0">
                    {historyEntries.map(([key, value]) => (
                        <NavLink to={`${RouterPath.QUESTION_ANSWERING}/${key}`} className={navLinkClassName}>
                            <ListItem key={key} className="text-ellipsis whitespace-nowrap block overflow-hidden">
                                {value[0].text}
                            </ListItem>
                        </NavLink>
                    ))}
                </List>
            </AccordionBody>
        </Accordion>
    );
}
