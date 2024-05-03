import { PDFViewer } from '../PDFViewer/PDFViewer.tsx';
import { Card } from '@material-tailwind/react';
import React, { useContext, useEffect } from 'react';
import { AppState } from '../../store/AppReducer.ts';
import { AppContext } from '../../store/AppContext.ts';

export default function FilePreview() {
    const ref = React.useRef<HTMLDivElement>(null);
    const { previewFile } = useContext<AppState>(AppContext);

    useEffect(() => {
        if (ref.current && previewFile) {
            ref.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
    }, [previewFile]);

    if (!previewFile) {
        return null;
    }

    return (
        <div ref={ref} className="shadow-md p-2 bg-gray-100 scroll-mt-14">
            <h2 className="m-5">{previewFile?.filename}</h2>
            <Card className="overflow-x-hidden">
                <PDFViewer url={previewFile?.url} />
            </Card>
        </div>
    );
}
