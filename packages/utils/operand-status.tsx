import * as React from 'react';
import * as _ from 'lodash';
import { Status } from '../shared/status/Status';
import { SuccessStatus } from '../shared/status/statuses';
import { K8sResourceCondition, K8sResourceKind } from '../types';

type OperandStatusType = {
  type: string;
  value: string;
};

const getOperandStatus = (obj: K8sResourceKind): OperandStatusType => {
  const { phase, status, state, conditions } = obj?.status || {};

  if (phase && _.isString(phase)) {
    return {
      type: 'Phase',
      value: phase,
    };
  }

  if (status && _.isString(status)) {
    return {
      type: 'Status',
      value: status,
    };
  }

  if (state && _.isString(state)) {
    return {
      type: 'State',
      value: state,
    };
  }

  const trueConditions = conditions?.filter(
    (c: K8sResourceCondition) => c.status === 'True'
  );
  if (trueConditions?.length) {
    const types = trueConditions.map((c: K8sResourceCondition) => c.type);
    return {
      type: types.length === 1 ? 'Condition' : 'Conditions',
      value: types.join(', '),
    };
  }

  return null;
};

type OperandStatusProps = {
  operand: K8sResourceKind;
};

export const OperandStatus: React.FC<OperandStatusProps> = ({ operand }) => {
  const status: OperandStatusType = getOperandStatus(operand);
  if (!status) {
    return <>-</>;
  }

  const { type, value } = status;
  return (
    <span className="co-icon-and-text">
      {type}:{' '}
      {value === 'Running' ? (
        <SuccessStatus title={value} />
      ) : (
        <Status status={value} />
      )}
    </span>
  );
};
