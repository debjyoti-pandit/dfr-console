import * as React from 'react';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { HealthBody } from '@openshift-console/dynamic-plugin-sdk-internal';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Gallery,
  GalleryItem,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@patternfly/react-core';
import {
  BucketClassPhaseMap,
  NamespaceStorePhaseMap,
  ObjectBucketClaimPhaseMap,
  PhaseType,
} from '../../../constants';
import {
  NooBaaBucketClassModel,
  NooBaaNamespaceStoreModel,
  NooBaaObjectBucketClaimModel,
} from '../../../models';
import {
  BucketClassKind,
  K8sResourceKind,
  NamespaceStoreKind,
} from '../../../types';
import { referenceForModel } from '../../../utils';
import {
  RedExclamationCircleIcon,
  BlueInProgressIcon,
} from '../../../utils/status/icons';
import {
  BucketClassPopOver,
  DataResourcesPopOver,
  OBCPopOver,
} from '../../resource-pages/ResourcePopOver';
import {
  bucketClassResource,
  nameSpaceStoreResource,
  bucketClaimResource,
} from '../../resources';
import './inventory-card.scss';

type obcType = { name: string; ns: string };
type displayItems = {
  statusMap: { [key: string]: number };
  errorList: string[] | obcType[];
  processingList: string[] | obcType[];
};

const getHeaderHTMLElement = (
  popUpType: PhaseType,
  headerText: string
): React.ReactNode => {
  if (popUpType === PhaseType.ERROR) {
    return (
      <>
        <RedExclamationCircleIcon className="popup-header-icon" />
        {headerText}
      </>
    );
  }
  if (popUpType === PhaseType.PROCESSING) {
    return (
      <>
        <BlueInProgressIcon className="popup-header-icon" />
        {headerText}
      </>
    );
  }
  return <></>;
};

export const InventoryCard: React.FC = () => {
  const { t } = useTranslation();
  const [buckets, bucketsLoaded, bucketsError] =
    useK8sWatchResource<BucketClassKind[]>(bucketClassResource);
  const [dataResources, dataResourcesLoaded, dataResourcesError] =
    useK8sWatchResource<NamespaceStoreKind[]>(nameSpaceStoreResource);
  const [obc, obcLoaded, obcError] =
    useK8sWatchResource<K8sResourceKind[]>(bucketClaimResource);

  const {
    statusMap: bucketStatusMap,
    errorList: bucketClassErrorList,
    processingList: bucketClassProcessingList,
  } = React.useMemo((): displayItems => {
    const errorList = [];
    const processingList = [];
    const statusMap =
      bucketsLoaded && !bucketsError
        ? buckets?.reduce((bucketMap, bc) => {
            const bucketStatus = BucketClassPhaseMap[bc?.status?.phase];
            const bucketClassName = bc?.metadata?.name;
            if (bucketStatus === PhaseType.ERROR) {
              errorList.push(bucketClassName);
            } else if (bucketStatus === PhaseType.PROCESSING) {
              processingList.push(bucketClassName);
            }
            bucketMap[bucketStatus] = bucketMap[bucketStatus] + 1 || 1;
            return bucketMap;
          }, {})
        : {};
    return {
      statusMap,
      errorList,
      processingList,
    };
  }, [buckets, bucketsLoaded, bucketsError]);

  const {
    statusMap: dataResourceStatusMap,
    errorList: dataResourceErrorList,
    processingList: dataResourceProcessingList,
  } = React.useMemo((): displayItems => {
    const errorList = [];
    const processingList = [];
    const statusMap =
      dataResourcesLoaded && !dataResourcesError
        ? dataResources?.reduce((drMap, dr) => {
            const dataResourceStatus =
              NamespaceStorePhaseMap[dr?.status?.phase];
            const dataResourceName = dr?.metadata?.name;
            if (dataResourceStatus === PhaseType.ERROR) {
              errorList.push(dataResourceName);
            } else if (dataResourceStatus === PhaseType.PROCESSING) {
              processingList.push(dataResourceName);
            }
            drMap[dataResourceStatus] = drMap[dataResourceStatus] + 1 || 1;
            return drMap;
          }, {})
        : {};
    return {
      statusMap,
      errorList,
      processingList,
    };
  }, [dataResources, dataResourcesLoaded, dataResourcesError]);

  const {
    statusMap: obClaimsStatusMap,
    errorList: obcErrorList,
    processingList: obcProcessingList,
  } = React.useMemo((): displayItems => {
    const errorList = [];
    const processingList = [];
    const statusMap =
      obcLoaded && !obcError
        ? obc?.reduce((obcMap, obc) => {
            const obClaimsStatus =
              ObjectBucketClaimPhaseMap[obc?.status?.phase];
            const obcResource: obcType = {
              name: obc?.metadata?.name,
              ns: obc?.metadata?.namespace,
            };
            if (obClaimsStatus === PhaseType.ERROR) {
              errorList.push(obcResource);
            } else if (obClaimsStatus === PhaseType.PROCESSING) {
              processingList.push(obcResource);
            }
            obcMap[obClaimsStatus] = obcMap[obClaimsStatus] + 1 || 1;
            return obcMap;
          }, {} as { [key: string]: number })
        : {};

    return {
      statusMap,
      errorList,
      processingList,
    };
  }, [obc, obcLoaded, obcError]);

  const OBC_LIST_PATH =
    '/k8s/all-namespaces/' + referenceForModel(NooBaaObjectBucketClaimModel);
  const BUCKET_CLASS_LIST_PATH =
    '/mcgms/cluster/resource/' + referenceForModel(NooBaaBucketClassModel);
  const DATA_RESOURCE_LIST_PATH =
    '/mcgms/cluster/resource/' + referenceForModel(NooBaaNamespaceStoreModel);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Inventory')}</CardTitle>
      </CardHeader>
      <CardBody>
        <HealthBody>
          <Gallery
            className="co-overview-status__health inventory-card-body"
            hasGutter
          >
            <GalleryItem className="inventory-card-item">
              {bucketsLoaded && !bucketsError ? (
                <>
                  <div className="inventory-card-sub-item">
                    <Link to={BUCKET_CLASS_LIST_PATH}>
                      {t('{{bucketCount}} Buckets', {
                        bucketCount: buckets.length,
                      })}
                    </Link>
                  </div>
                  {bucketStatusMap && bucketStatusMap[PhaseType.ERROR] && (
                    <div className="icons-container">
                      <RedExclamationCircleIcon
                        title={PhaseType.ERROR}
                        className="icons"
                      />
                      <BucketClassPopOver
                        label={String(bucketStatusMap[PhaseType.ERROR])}
                        bucketClasses={bucketClassErrorList as string[]}
                        headerContent={getHeaderHTMLElement(
                          PhaseType.ERROR,
                          t('Buckets: Error')
                        )}
                      />
                    </div>
                  )}
                  {bucketStatusMap && bucketStatusMap[PhaseType.PROCESSING] && (
                    <div>
                      <BlueInProgressIcon
                        title={PhaseType.PROCESSING}
                        className="icons"
                      />
                      <BucketClassPopOver
                        label={String(bucketStatusMap[PhaseType.PROCESSING])}
                        bucketClasses={bucketClassProcessingList as string[]}
                        headerContent={getHeaderHTMLElement(
                          PhaseType.PROCESSING,
                          t('Buckets: Processing')
                        )}
                      />
                    </div>
                  )}
                </>
              ) : (
                <Skeleton screenreaderText="Loading buckets" />
              )}
            </GalleryItem>
            <GalleryItem className="inventory-card-item">
              {dataResourcesLoaded && !dataResourcesError ? (
                <>
                  <div className="inventory-card-sub-item">
                    <Link to={DATA_RESOURCE_LIST_PATH}>
                      {t('{{dataResourcesCount}} Data sources', {
                        dataResourcesCount: dataResources.length,
                      })}
                    </Link>
                  </div>
                  {dataResourcesLoaded &&
                    dataResourceStatusMap &&
                    dataResourceStatusMap[PhaseType.ERROR] && (
                      <div className="icons-container">
                        <RedExclamationCircleIcon
                          title={PhaseType.ERROR}
                          className="icons"
                        />
                        <DataResourcesPopOver
                          label={String(dataResourceStatusMap[PhaseType.ERROR])}
                          dataResources={dataResourceErrorList as string[]}
                          headerContent={getHeaderHTMLElement(
                            PhaseType.ERROR,
                            t('Data sources: Error')
                          )}
                        />
                      </div>
                    )}
                  {dataResourcesLoaded &&
                    dataResourceStatusMap &&
                    dataResourceStatusMap[PhaseType.PROCESSING] && (
                      <div>
                        <BlueInProgressIcon
                          title={PhaseType.PROCESSING}
                          className="icons"
                        />
                        <DataResourcesPopOver
                          label={String(
                            dataResourceStatusMap[PhaseType.PROCESSING]
                          )}
                          dataResources={dataResourceProcessingList as string[]}
                          headerContent={getHeaderHTMLElement(
                            PhaseType.PROCESSING,
                            t('Data sources: Processing')
                          )}
                        />
                      </div>
                    )}
                </>
              ) : (
                <Skeleton screenreaderText="Loading data resources" />
              )}
            </GalleryItem>
            <GalleryItem className="inventory-card-item">
              {obcLoaded && !obcError ? (
                <>
                  <div className="inventory-card-sub-item">
                    <Link to={OBC_LIST_PATH}>
                      {t('{{obcCount}} Object bucket claims', {
                        obcCount: obc.length,
                      })}
                    </Link>
                  </div>
                  {obClaimsStatusMap && obClaimsStatusMap[PhaseType.ERROR] && (
                    <div className="icons-container">
                      <RedExclamationCircleIcon
                        title={PhaseType.ERROR}
                        className="icons"
                      />
                      <OBCPopOver
                        label={String(obClaimsStatusMap[PhaseType.ERROR])}
                        obcDetails={obcErrorList as obcType[]}
                        headerContent={getHeaderHTMLElement(
                          PhaseType.ERROR,
                          t('ObjectBucketClaims: Error')
                        )}
                      />
                    </div>
                  )}
                  {obClaimsStatusMap &&
                    obClaimsStatusMap[PhaseType.PROCESSING] && (
                      <div>
                        <BlueInProgressIcon
                          title={PhaseType.PROCESSING}
                          className="icons"
                        />
                        <OBCPopOver
                          label={String(
                            obClaimsStatusMap[PhaseType.PROCESSING]
                          )}
                          obcDetails={obcProcessingList as obcType[]}
                          headerContent={getHeaderHTMLElement(
                            PhaseType.PROCESSING,
                            t('ObjectBucketClaims: Processing')
                          )}
                        />
                      </div>
                    )}
                </>
              ) : (
                <Skeleton screenreaderText="Loading object bucket claims" />
              )}
            </GalleryItem>
          </Gallery>
        </HealthBody>
      </CardBody>
    </Card>
  );
};
