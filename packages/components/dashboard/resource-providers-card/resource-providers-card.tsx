import * as React from 'react';
import { PrometheusResponse } from '@openshift-console/dynamic-plugin-sdk';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Gallery,
  GalleryItem,
  Skeleton,
} from '@patternfly/react-core';
import { MCG_MS_PROMETHEUS_URL } from '../../../constants';
import { getMetric } from '../../../utils';
import { useCustomPrometheusPoll } from '../../../utils/hooks/custom-prometheus-poll';
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
  const [
    unhealthyProvidersTypesQueryResult,
    unhealthyProvidersTypesQueryResultError,
  ] = useCustomPrometheusPoll({
    query: RESOURCE_PROVIDERS_QUERY.UNHEALTHY_PROVIDERS_TYPES,
    endpoint: 'api/v1/query' as any,
    basePath: MCG_MS_PROMETHEUS_URL,
  });
  const [resourcesLinksResponse, resourcesLinksResponseError] =
    useCustomPrometheusPoll({
      query: RESOURCE_PROVIDERS_QUERY.RESOURCES_LINK_QUERY,
      endpoint: 'api/v1/query' as any,
      basePath: MCG_MS_PROMETHEUS_URL,
    });
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
  const hasProviders = !_.isEmpty(allProviders);
  const isLoading =
    !error &&
    !(providersTypesQueryResult && unhealthyProvidersTypesQueryResult);

  console.log("*****************************************************");
  console.log("isLoading", isLoading);
  console.log("error", error);
  console.log("hasProviders", hasProviders);
  console.log(providerTypes);
  console.log(providersTypesQueryResult);
  console.log(unhealthyProvidersTypesQueryResult);
  console.log("noobaaResourcesLink", noobaaResourcesLink);
  console.log(allProviders);
  console.log(unhealthyProviders);
  console.log("*****************************************************");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Resource Providers')}</CardTitle>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <Skeleton />
        ) : error || hasProviders ? (
          <div className="nb-resource-providers-card__not-available text-secondary">
            {t('Not available')}
          </div>
        ) : (
          <Gallery hasGutter>
            {providerTypes.map((provider) => {
              return (
                <GalleryItem key={provider}>
                  <ResourceProvidersItem
                    count={allProviders[provider]}
                    key={provider}
                    link={noobaaResourcesLink}
                    title={provider}
                    unhealthyProviders={unhealthyProviders}
                  />
                </GalleryItem>
              );
            })}
          </Gallery>
        )}
      </CardBody>
    </Card>
  );
};

type ProviderPrometheusData = {
  metric: { [key: string]: any };
  value?: [number, string | number];
};

export const ResourceProvidersCard = ResourceProviders;
