import {
  OwnerReference,
  GroupVersionKind
} from "@openshift-console/dynamic-plugin-sdk";
import { K8sModel } from "@openshift-console/dynamic-plugin-sdk/lib/api/common-types";
import { GetAPIVersionForModel } from "../types";

export const LAST_LANGUAGE_LOCAL_STORAGE_KEY = "bridge/last-language";

export const getAPIVersionForModel: GetAPIVersionForModel = (model) =>
  !model?.apiGroup ? model.apiVersion : `${model.apiGroup}/${model.apiVersion}`;

export const groupVersionFor = (apiVersion: string) => ({
  group: apiVersion.split("/").length === 2 ? apiVersion.split("/")[0] : "core",
  version:
    apiVersion.split("/").length === 2 ? apiVersion.split("/")[1] : apiVersion
});

export const referenceForOwnerRef = (
  ownerRef: OwnerReference
): GroupVersionKind =>
  referenceForGroupVersionKind(groupVersionFor(ownerRef.apiVersion).group)(
    groupVersionFor(ownerRef.apiVersion).version
  )(ownerRef.kind);

export const referenceForModel = (model: K8sModel) =>
  `${model.apiGroup}~${model.apiVersion}~${model.kind}`;

export const referenceForGroupVersionKind =
  (group: string) => (version: string) => (kind: string) =>
    [group, version, kind].join("~");
