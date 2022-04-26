import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import * as _ from 'lodash';

export const getAPIVersion = <A extends K8sResourceCommon = K8sResourceCommon>(value: A) =>
  _.get(value, 'apiVersion') as K8sResourceCommon['apiVersion'];
