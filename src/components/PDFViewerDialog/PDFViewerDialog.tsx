import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import { PDFViewer } from '../PDFViewer/PDFViewer.tsx';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface Props {
    handleClose: () => void;
    url?: string;
    fileName?: string;
}
// TODO: delete if not used
export default function PDFViewerDialog({ url, handleClose, fileName }: Props) {
    return (
        <div>
            <Dialog open={!!url} handler={handleClose} className="h-[96vh]">
                <DialogHeader className="flex justify-between">
                    {fileName} <XMarkIcon className="h-5 w-5 cursor-pointer" onClick={handleClose} />
                </DialogHeader>
                <DialogBody className="h-[90%]">
                    <PDFViewer url={url} />
                </DialogBody>
            </Dialog>
        </div>
    );
}
