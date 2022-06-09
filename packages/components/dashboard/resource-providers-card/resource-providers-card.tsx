import * as React from 'react';
import { PrometheusResponse } from '@openshift-console/dynamic-plugin-sdk';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, CardTitle } from '@patternfly/react-core';
import { MCG_MS_PROMETHEUS_URL } from '../../../constants';
import { getMetric } from '../../../utils';
import { useCustomPrometheusPoll } from '../../../utils/hooks/custom-prometheus-poll';
import { ResourceProvidersBody } from './resource-providers-card-body';
import {
  ResourceProvidersItem,
  ProviderType,
} from './resource-providers-card-item';
import './resource-providers-card.scss';

const RESOURCE_PROVIDERS_QUERY = {
  PROVIDERS_TYPES: ' NooBaa_cloud_types',
  UNHEALTHY_PROVIDERS_TYPES: 'NooBaa_unhealthy_cloud_types',
  RESOURCES_LINK_QUERY: 'NooBaa_system_links',
};

const getProviderType = (provider: ProviderPrometheusData): string =>
  _.get(provider, 'metric.type', null);
const getProviderCount = (provider: ProviderPrometheusData): number =>
  Number(_.get(provider, 'value[1]', null));

const filterProviders = (allProviders: ProviderType): string[] => {
  return _.keys(allProviders).filter((provider) => allProviders[provider] > 0);
};

const createProvidersList = (data: PrometheusResponse): ProviderType => {
  const providers = _.get(data, 'data.result', null);
  const providersList: ProviderType = {};
  if (_.isNil(providers)) return {};
  providers.forEach((provider) => {
    providersList[getProviderType(provider)] = getProviderCount(provider);
  });
  return providersList;
};

const ResourceProviders: React.FC<{}> = () => {
  const { t } = useTranslation();

  const [providersTypesQueryResult, providersTypesQueryResultError] =
    useCustomPrometheusPoll({
      query: RESOURCE_PROVIDERS_QUERY.PROVIDERS_TYPES,
      endpoint: 'api/v1/query' as any,
      basePath: MCG_MS_PROMETHEUS_URL,
    });
  console.log('***********************************************************');
  console.log(providersTypesQueryResult);
  const [
    unhealthyProvidersTypesQueryResult,
    unhealthyProvidersTypesQueryResultError,
  ] = useCustomPrometheusPoll({
    query: RESOURCE_PROVIDERS_QUERY.UNHEALTHY_PROVIDERS_TYPES,
    endpoint: 'api/v1/query' as any,
    basePath: MCG_MS_PROMETHEUS_URL,
  });
  console.log(unhealthyProvidersTypesQueryResult);
  const [resourcesLinksResponse, resourcesLinksResponseError] =
    useCustomPrometheusPoll({
      query: RESOURCE_PROVIDERS_QUERY.RESOURCES_LINK_QUERY,
      endpoint: 'api/v1/query' as any,
      basePath: MCG_MS_PROMETHEUS_URL,
    });
  console.log(resourcesLinksResponse);
  console.log('***********************************************************');
  const error =
    !!providersTypesQueryResultError ||
    !!unhealthyProvidersTypesQueryResultError ||
    !!resourcesLinksResponseError;

  const noobaaResourcesLink = getMetric(resourcesLinksResponse, 'resources');

  const allProviders = createProvidersList(providersTypesQueryResult);
  const unhealthyProviders = createProvidersList(
    unhealthyProvidersTypesQueryResult
  );

  const providerTypes = filterProviders(allProviders);
  console.log(error);
  console.log(noobaaResourcesLink);
  console.log(allProviders);
  console.log(unhealthyProviders);
  console.log('hasprovider: ', !_.isEmpty(allProviders));
  console.log(providerTypes);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Resource Providers')}</CardTitle>
      </CardHeader>
      <CardBody>
        <ResourceProvidersBody
          isLoading={
            !error &&
            !(providersTypesQueryResult && unhealthyProvidersTypesQueryResult)
          }
          hasProviders={!_.isEmpty(allProviders)}
          error={error}
        >
          {providerTypes.map((provider) => {
            console.log(provider);
            return (
              <ResourceProvidersItem
                count={allProviders[provider]}
                key={provider}
                link={noobaaResourcesLink}
                title={provider}
                unhealthyProviders={unhealthyProviders}
              />
            );
          })}
        </ResourceProvidersBody>
      </CardBody>
    </Card>
  );
};

type ProviderPrometheusData = {
  metric: { [key: string]: any };
  value?: [number, string | number];
};

export const ResourceProvidersCard = ResourceProviders;
