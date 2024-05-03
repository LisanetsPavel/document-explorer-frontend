export type DataSourceObjectsList = {
    success: boolean;
    message: string;
    objects: DataSourceObject[];
    count: number;
};

export type DataSourceObject = {
    Name: string;
    LastModified: string;
    Size: number;
};

export type DataSourceObjectsOutput = {
    dataSourceObjectsList: DataSourceObjectsList;
};
