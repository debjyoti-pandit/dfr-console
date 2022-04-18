import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

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

export const SecretModel: K8sModel = {
  apiVersion: 'v1',
  label: 'Secret',
  // t('plugin__odf-console~Secret')
  labelKey: 'plugin__odf-console~Secret',
  plural: 'secrets',
  abbr: 'S',
  namespaced: true,
  kind: 'Secret',
  id: 'secret',
  labelPlural: 'Secrets',
  // t('plugin__odf-console~Secrets')
  labelPluralKey: 'plugin__odf-console~Secrets',
};
