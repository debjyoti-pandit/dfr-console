import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import { K8sModel } from "@openshift-console/dynamic-plugin-sdk/lib/api/common-types";
import * as _ from 'lodash';
import { nsSpecProvider, nsSpecType } from "../../constants";
import { GetAPIVersionForModel } from "../../types";

type GetStringProperty<T = K8sResourceCommon> = (resource: T) => string;

export const getName: GetStringProperty = (resource) =>
  resource?.metadata?.name;

export type PersistentVolumeClaimKind = K8sResourceCommon & {
  spec: {
    accessModes: string[];
    resources: {
      requests: {
        storage: string;
      };
    };
    storageClassName: string;
    volumeMode?: string;
    /* Parameters in a cloned PVC */
    dataSource?: {
      name: string;
      kind: string;
      apiGroup: string;
    };
    /**/
  };
  status?: {
    phase: string;
  };
};

export type SecretKind = {
  data?: { [key: string]: string };
  stringData?: { [key: string]: string };
  type?: string;
} & K8sResourceCommon;

export type NamespaceStoreKind = K8sResourceCommon & {
  spec: {
    [key in nsSpecProvider]: {
      [key: string]: string;
    };
  } & {
    type: nsSpecType;
  };
};

export const getUID: GetStringProperty = (resource) => resource?.metadata?.uid;

export const hasLabel = (obj: K8sResourceCommon, label: string): boolean =>
  _.has(obj, ['metadata', 'labels', label]);

export const getLabel = <A extends K8sResourceCommon = K8sResourceCommon>(
    value: A,
    label: string,
    defaultValue?: string,
  ) => (_.has(value, 'metadata.labels') ? value.metadata.labels[label] : defaultValue);

export const getNamespace = <A extends K8sResourceCommon = K8sResourceCommon>(value: A) =>
  _.get(value, 'metadata.namespace') as K8sResourceCommon['metadata']['namespace'];

export const getAnnotations = <A extends K8sResourceCommon = K8sResourceCommon>(
    value: A,
    defaultValue?: K8sResourceCommon['metadata']['annotations'],
) => (_.has(value, 'metadata.annotations') ? value.metadata.annotations : defaultValue);


export type K8sResourceKind = K8sResourceCommon & {
  spec?: {
    [key: string]: any;
  };
  status?: { [key: string]: any };
  data?: { [key: string]: any };
};

export const PersistentVolumeClaimModel: K8sModel = {
  label: 'PersistentVolumeClaim',
  // t('public~PersistentVolumeClaim')
  labelKey: 'public~PersistentVolumeClaim',
  apiVersion: 'v1',
  plural: 'persistentvolumeclaims',
  abbr: 'PVC',
  namespaced: true,
  kind: 'PersistentVolumeClaim',
  id: 'persistentvolumeclaim',
  labelPlural: 'PersistentVolumeClaims',
  // t('public~PersistentVolumeClaims')
  labelPluralKey: 'public~PersistentVolumeClaims',
};


/**
 * Provides apiVersion for a k8s model.
 * @param model k8s model
 * @returns The apiVersion for the model i.e `group/version`.
 * */
 export const getAPIVersionForModel: GetAPIVersionForModel = (model) =>
 !model?.apiGroup ? model.apiVersion : `${model.apiGroup}/${model.apiVersion}`;
