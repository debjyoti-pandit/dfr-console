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

const OBC_LIST_PATH =
  '/k8s/all-namespaces/' + referenceForModel(NooBaaObjectBucketClaimModel);
const BUCKET_CLASS_LIST_PATH =
  '/mcgms/cluster/resource/' + referenceForModel(NooBaaBucketClassModel);
const DATA_RESOURCE_LIST_PATH =
  '/mcgms/cluster/resource/' + referenceForModel(NooBaaNamespaceStoreModel);

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

const getGalleryItem = (
  t,
  listItems,
  listLoaded: boolean,
  listError,
  redirectPath: string,
  resource: string,
  statusMap,
  errorPopup: React.ReactNode,
  processingPopup: React.ReactNode
): React.ReactNode => {
  return (
    <GalleryItem className="inventory-card-item">
      {listLoaded && !listError ? (
        <>
          <div className="inventory-card-sub-item">
            <Link to={redirectPath}>
              {t('{{count}} {{resourceType}}', {
                count: listItems.length,
                resourceType: resource,
              })}
            </Link>
          </div>
          {statusMap && statusMap[PhaseType.ERROR] && (
            <div className="icons-container">
              <RedExclamationCircleIcon
                title={PhaseType.ERROR}
                className="icons"
              />
              {errorPopup}
            </div>
          )}
          {statusMap && statusMap[PhaseType.PROCESSING] && (
            <div>
              <BlueInProgressIcon
                title={PhaseType.PROCESSING}
                className="icons"
              />
              {processingPopup}
            </div>
          )}
        </>
      ) : (
        <Skeleton
          screenreaderText={t('Loading {{resourceType}}', {
            resourceType: resource,
          })}
        />
      )}
    </GalleryItem>
  );
};

const getBucketPopup = (
  t,
  type: PhaseType,
  statusmap,
  data
): React.ReactNode => {
  return (
    <BucketClassPopOver
      label={String(statusmap[type])}
      bucketClasses={data as string[]}
      headerContent={getHeaderHTMLElement(
        type,
        t('Buckets: {{type}}', {
          type: type,
        })
      )}
      trimContent
    />
  );
};

const getDataResourcePopup = (
  t,
  type: PhaseType,
  statusmap,
  data
): React.ReactNode => {
  return (
    <DataResourcesPopOver
      label={String(statusmap[type])}
      dataResources={data as string[]}
      headerContent={getHeaderHTMLElement(
        type,
        t('Data sources: {{type}}', {
          type: type,
        })
      )}
      trimContent
    />
  );
};

const getOBCPopup = (t, type: PhaseType, statusmap, data): React.ReactNode => {
  return (
    <OBCPopOver
      label={String(statusmap[type])}
      obcDetails={data as obcType[]}
      headerContent={getHeaderHTMLElement(
        type,
        t('ObjectBucketClaims: {{type}}', {
          type: type,
        })
      )}
      trimContent
    />
  );
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
            {getGalleryItem(
              t,
              buckets,
              bucketsLoaded,
              bucketsError,
              BUCKET_CLASS_LIST_PATH,
              t('Buckets'),
              bucketStatusMap,
              getBucketPopup(
                t,
                PhaseType.ERROR,
                bucketStatusMap,
                bucketClassErrorList
              ),
              getBucketPopup(
                t,
                PhaseType.PROCESSING,
                bucketStatusMap,
                bucketClassProcessingList
              )
            )}
            {getGalleryItem(
              t,
              dataResources,
              dataResourcesLoaded,
              dataResourcesError,
              DATA_RESOURCE_LIST_PATH,
              t('Data sources'),
              dataResourceStatusMap,
              getDataResourcePopup(
                t,
                PhaseType.ERROR,
                dataResourceStatusMap,
                dataResourceErrorList
              ),
              getDataResourcePopup(
                t,
                PhaseType.PROCESSING,
                dataResourceStatusMap,
                dataResourceProcessingList
              )
            )}
            {getGalleryItem(
              t,
              obc,
              obcLoaded,
              obcError,
              OBC_LIST_PATH,
              t('ObjectBucketClaims'),
              obClaimsStatusMap,
              getOBCPopup(t, PhaseType.ERROR, obClaimsStatusMap, obcErrorList),
              getOBCPopup(
                t,
                PhaseType.PROCESSING,
                obClaimsStatusMap,
                obcProcessingList
              )
            )}
          </Gallery>
        </HealthBody>
      </CardBody>
    </Card>
  );
};
