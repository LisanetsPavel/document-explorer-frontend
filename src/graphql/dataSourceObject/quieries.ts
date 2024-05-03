import { DataSourceObjectsOutput } from '../../types/DataSourceObject.ts';
import { Query } from '../../types/Api.ts';

export const dataSourceObjectsList = /* GraphQL */ `query DataSourceObjectsList
{
  dataSourceObjectsList
   {
    count
    message
    objects {
      Name
      LastModified
      Size
    }
    success
  }
}
` as Query<void, DataSourceObjectsOutput>;
