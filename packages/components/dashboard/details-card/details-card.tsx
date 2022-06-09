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
import { DATA_FEDERATION_NAMESPACE, MCG_DEPLOYER } from '../../../constants';
import { ClusterServiceVersionModel } from '../../../models';
import { ClusterServiceVersionKind } from '../../../types';
import { referenceForModel } from '../../../utils';
import ResourceLink from '../../../utils/generics/resource-link';
import { operatorResource } from '../../resources';
import './details-card.scss';

export const DetailsCard: React.FC = () => {
  const { t } = useTranslation();
  const [csvData, csvLoaded, csvError] =
    useK8sWatchResource<ClusterServiceVersionKind[]>(operatorResource);
  const operator = React.useMemo(
    () => csvData?.find((csv) => csv?.metadata?.name.startsWith(MCG_DEPLOYER)),
    [csvData]
  );
  const operatorVersion = operator?.spec?.version;
  const operatorName = operator?.metadata?.name;
  const path = `/k8s/ns/${DATA_FEDERATION_NAMESPACE}/${referenceForModel(
    ClusterServiceVersionModel
  )}/${operatorName}`;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Details')}</CardTitle>
      </CardHeader>
      <CardBody>
        <HealthBody>
          <Gallery
            className="co-overview-status__health details-card-body"
            hasGutter
          >
            <GalleryItem className="details-card-item">
              <div className="details-card-sub-item">Operator name</div>
              <div>
                {operatorName ? (
                  <ResourceLink
                    resourceModel={ClusterServiceVersionModel}
                    resourceName={t('Data Federation')}
                    {...(csvLoaded && !csvError && { link: path })}
                    hideIcon
                  />
                ) : (
                  t('Data Federation')
                )}
              </div>
            </GalleryItem>
            <GalleryItem className="details-card-item">
              <div className="details-card-sub-item">{t('Version')}</div>
              {csvLoaded && !csvError ? (
                <div>{operatorVersion}</div>
              ) : (
                <Skeleton
                  screenreaderText={t('Version of the cluster service')}
                />
              )}
            </GalleryItem>
          </Gallery>
        </HealthBody>
      </CardBody>
    </Card>
  );
};
