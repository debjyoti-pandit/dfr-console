import { WatchK8sResource } from "@openshift-console/dynamic-plugin-sdk";
import { CEPH_STORAGE_NAMESPACE } from "../constants";
import { PersistentVolumeClaimModel, SecretModel } from "../models";

export const secretResource: WatchK8sResource = {
  isList: true,
  kind: SecretModel.kind,
  namespace: CEPH_STORAGE_NAMESPACE
};


export const pvcResource: WatchK8sResource = {
  isList: true,
  kind: PersistentVolumeClaimModel.kind,
  namespace: CEPH_STORAGE_NAMESPACE
};
