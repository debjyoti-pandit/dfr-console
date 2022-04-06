import * as _ from 'lodash';

export enum BC_PROVIDERS {
  AWS = 'AWS S3',
  S3 = 'S3 Compatible',
  PVC = 'PVC',
  GCP = 'Google Cloud Storage',
  AZURE = 'Azure Blob',
  IBM = 'IBM COS',
  FILESYSTEM = 'Filesystem',
}


export const AWS_REGIONS = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'ca-central-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-north-1',
  'ap-east-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-northeast-3',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-south-1',
  'me-south-1',
  'sa-east-1',
];


export const PROVIDERS_NOOBAA_MAP = {
  [BC_PROVIDERS.AWS]: 'awsS3' as const,
  [BC_PROVIDERS.S3]: 's3Compatible' as const,
  [BC_PROVIDERS.AZURE]: 'azureBlob' as const,
  [BC_PROVIDERS.GCP]: 'googleCloudStorage' as const,
  [BC_PROVIDERS.PVC]: 'pvPool' as const,
  [BC_PROVIDERS.IBM]: 'ibmCos' as const,
  [BC_PROVIDERS.FILESYSTEM]: 'nsfs' as const,
};

export const NS_PROVIDERS_NOOBAA_MAP = _.pick(
  PROVIDERS_NOOBAA_MAP,
  BC_PROVIDERS.AWS,
  BC_PROVIDERS.S3,
  BC_PROVIDERS.AZURE,
  BC_PROVIDERS.IBM,
  BC_PROVIDERS.FILESYSTEM,
);

export const BUCKET_LABEL_NOOBAA_MAP = {
  [BC_PROVIDERS.AWS]: 'targetBucket',
  [BC_PROVIDERS.S3]: 'targetBucket',
  [BC_PROVIDERS.AZURE]: 'targetBlobContainer',
  [BC_PROVIDERS.GCP]: 'targetBucket',
  [BC_PROVIDERS.IBM]: 'targetBucket',
};
