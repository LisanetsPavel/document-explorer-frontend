import { useState } from 'react';
import { Document, Page } from 'react-pdf';

interface PDFViewerProps {
    url?: string;
}

export function PDFViewer({ url }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number>();

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <div className="h-full min-h-screen overflow-y-auto overflow-x-hidden">
            <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) => {
                    console.error('PDF loading error', error);
                }}
                className="h-full"
            >
                {Array.from(new Array(numPages), (_, index) => (
                    <Page scale={2.4} key={`page_${index + 1}`} pageNumber={index + 1} renderTextLayer={false} renderAnnotationLayer={false} />
                ))}
            </Document>
        </div>
    );
}
