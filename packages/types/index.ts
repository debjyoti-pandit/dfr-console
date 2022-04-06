import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import { K8sModel } from "@openshift-console/dynamic-plugin-sdk/lib/api/common-types";

export type Payload = K8sResourceCommon & {
  spec: {
    type: string;
    ssl: boolean;
    [key: string]: any;
  };
};



export type GetAPIVersionForModel = (model: K8sModel) => string;
