import * as React from 'react';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { HealthBody } from '@openshift-console/dynamic-plugin-sdk-internal';
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
import {
  NOOBAA_PROVIDER_MAP,
  NS_PROVIDERS_NOOBAA_MAP,
} from '../../../constants';
import { NamespaceStoreKind } from '../../../types';
import { nameSpaceStoreResource } from '../../resources';
import './resource-provider-card.scss';

export const ResourceProviderCard: React.FC = () => {
  const { t } = useTranslation();
  const [dataResources, dataResourcesLoaded, dataResourcesError] =
    useK8sWatchResource<NamespaceStoreKind[]>(nameSpaceStoreResource);

  const providerCount = React.useMemo((): { [key: string]: number } => {
    const initialCount: { [key: string]: number } = Object.entries(
      NS_PROVIDERS_NOOBAA_MAP
    ).reduce((p, [k, v]) => Object.assign(p, { [k]: 0 }), {});
    return dataResourcesLoaded && !dataResourcesError
      ? dataResources?.reduce((drMap, dr) => {
          const provider = dr?.spec?.type;
          drMap[NOOBAA_PROVIDER_MAP[provider]] =
            drMap[NOOBAA_PROVIDER_MAP[provider]] + 1;
          return drMap;
        }, initialCount)
      : initialCount;
  }, [dataResources, dataResourcesLoaded, dataResourcesError]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Resources Providers')}</CardTitle>
      </CardHeader>
      <CardBody>
        <HealthBody>
          <Gallery
            className="co-overview-status__health resource_provider-card-body"
            hasGutter
          >
            {Object.entries(providerCount).map(([key, value]) => (
              <GalleryItem className="resource_provider-card-item" key={key}>
                {dataResourcesLoaded && !dataResourcesError ? (
                  <>
                    {value} {key}
                  </>
                ) : (
                  <Skeleton
                    screenreaderText={t('Loading resource providers')}
                  />
                )}
              </GalleryItem>
            ))}
          </Gallery>
        </HealthBody>
      </CardBody>
    </Card>
  );
};
