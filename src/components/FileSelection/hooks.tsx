import { useMemo, useState } from 'react';
import { ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { DataSourceObject } from '../../types/DataSourceObject.ts';

export const useFileSorting = (fileList: DataSourceObject[]) => {
    const [sorting, setSorting] = useState<{ column: string; direction: 'asc' | 'desc' } | undefined>({ column: 'File Name', direction: 'asc' });

    const handleSort = (column: string) => () => {
        if (sorting?.column === column) {
            setSorting({ column, direction: sorting.direction === 'asc' ? 'desc' : 'asc' });
        } else {
            setSorting({ column, direction: 'asc' });
        }
    };

    const getSortIcon = (columnName: string) => {
        if (columnName === sorting?.column) {
            return (
                <ChevronDownIcon
                    strokeWidth={2}
                    className="h-4 w-4"
                    style={{ transform: `rotate(${sorting.direction === 'desc' ? '180' : '0'}deg)` }}
                />
            );
        }

        return <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />;
    };

    const sortedList = useMemo(
        () =>
            sorting
                ? fileList?.sort((a, b) => {
                      if (sorting?.column === 'File Name') {
                          return sorting?.direction === 'asc' ? a.Name?.localeCompare(b.Name || '') : b.Name?.localeCompare(a.Name || '');
                      }

                      if (sorting?.column === 'Size') {
                          return sorting?.direction === 'asc' ? a.Size - b.Size : b.Size - a.Size;
                      }

                      if (sorting?.column === 'Last Modified') {
                          return sorting?.direction === 'asc'
                              ? new Date(a.LastModified).getTime() - new Date(b.LastModified).getTime()
                              : new Date(b.LastModified).getTime() - new Date(a.LastModified).getTime();
                      }

                      return 0;
                  })
                : fileList,
        [fileList, sorting]
    );

    return { handleSort, getSortIcon, sortedList };
};
