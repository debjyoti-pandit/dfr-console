import * as _ from "lodash";
import { SecretModel } from "../models";
import { getAPIVersion } from "../shared/selectors/common";
import { BC_PROVIDERS } from "./providers";

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

export const NOOBAA_TYPE_MAP = {
  [BC_PROVIDERS.AWS]: 'aws-s3' as const,
  [BC_PROVIDERS.S3]: 's3-compatible' as const,
  [BC_PROVIDERS.AZURE]: 'azure-blob' as const,
  [BC_PROVIDERS.GCP]: 'google-cloud-storage' as const,
  [BC_PROVIDERS.PVC]: 'pv-pool' as const,
  [BC_PROVIDERS.IBM]: 'ibm-cos' as const,
  [BC_PROVIDERS.FILESYSTEM]: 'nsfs' as const,
};

export const NS_NOOBAA_TYPE_MAP = _.pick(
  NOOBAA_TYPE_MAP,
  BC_PROVIDERS.AWS,
  BC_PROVIDERS.S3,
  BC_PROVIDERS.AZURE,
  BC_PROVIDERS.IBM,
);

export type nsSpecProvider = typeof NS_PROVIDERS_NOOBAA_MAP[keyof typeof NS_PROVIDERS_NOOBAA_MAP];
export type nsSpecType = typeof NS_NOOBAA_TYPE_MAP[keyof typeof NS_NOOBAA_TYPE_MAP];

export const secretPayloadCreator = (
  provider: string,
  namespace: string,
  secretName: string,
  field1: string,
  field2 = '',
) => {
  const payload = {
    apiVersion: getAPIVersion(SecretModel),
    kind: SecretModel.kind,
    stringData: {},
    metadata: {
      name: secretName,
      namespace,
    },
    type: 'Opaque',
  };

  switch (provider) {
    case BC_PROVIDERS.AZURE:
      payload.stringData = {
        AccountName: field1,
        AccountKey: field2,
      };
      break;
    case BC_PROVIDERS.IBM:
      payload.stringData = {
        IBM_COS_ACCESS_KEY_ID: field1,
        IBM_COS_SECRET_ACCESS_KEY: field2,
      };
      break;
    default:
      payload.stringData = {
        AWS_ACCESS_KEY_ID: field1,
        AWS_SECRET_ACCESS_KEY: field2,
      };
      break;
  }
  return payload;
};
