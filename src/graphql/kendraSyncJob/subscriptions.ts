import { Subscription } from '../../types/Api.ts';

export const updateIngestionJobStatusSubscription = `subscription OnUpdateIngestionJobStatus($ingestionjobid: ID!) {
  updateIngestionJobStatus(ingestionjobid: $ingestionjobid) {
    ingestionjobid
    files {
      name
      status
    }
  }
}` as Subscription<{ ingestionjobid: string }, { updateIngestionJobStatus: { files: { name: string; status: string }[] } }>;

export const updateDataSourceSyncStatusSubscription = `subscription OnUpdateDataSourceSyncStatus($data: UpdateDataSourceSyncStatusInput!) {
  updateDataSourceSyncStatus(data: $data) {
    KendraJobExecId
    KendraJobStatus
    status
  }
}` as Subscription<{ data: DataSourceSyncStatus }, DataSourceSyncStatus>;

type DataSourceSyncStatus = {
    KendraJobExecId: string;
    KendraJobStatus?: string;
    status?: string;
};
