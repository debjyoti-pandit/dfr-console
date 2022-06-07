import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Button,
  Divider,
  Popover,
  PopoverPosition,
} from '@patternfly/react-core';
import {
  NooBaaBucketClassModel,
  NooBaaNamespaceStoreModel,
  NooBaaObjectBucketClaimModel,
} from '../../models';
import { referenceForModel } from '../../utils';
import ResourceLink from '../../utils/generics/resource-link';
import './resources.scss';

const OBC_LIST_PATH =
  '/k8s/all-namespaces/objectbucket.io~v1alpha1~ObjectBucketClaim';
const BUCKET_CLASS_LIST_PATH =
  '/mcgms/cluster/resource/noobaa.io~v1alpha1~BucketClass';
const DATA_RESOURCE_LIST_PATH =
  '/mcgms/cluster/resource/noobaa.io~v1alpha1~NamespaceStore';
const MAX_NO_OF_RESOURCE_DISPLAY = 5;

const ResourcePopOver: React.FC<ResourcePopOverProps> = ({
  position,
  children,
  label,
  title,
  headerContent,
}) => {
  return (
    <Popover
      position={position || PopoverPosition.auto}
      headerContent={headerContent ? headerContent : title}
      bodyContent={children}
      aria-label={title}
    >
      <Button variant="link" isInline>
        {label}
      </Button>
    </Popover>
  );
};

export const BucketClassPopOver: React.FC<BucketClassPopOverProps> = ({
  label,
  bucketClasses,
  headerContent,
}) => {
  const { t } = useTranslation();

  return (
    <ResourcePopOver
      label={label}
      headerContent={headerContent}
      title={t('Connected data sources')}
    >
      <div className="resource-pop-over">
        {(bucketClasses?.length > MAX_NO_OF_RESOURCE_DISPLAY
          ? bucketClasses.slice(0, MAX_NO_OF_RESOURCE_DISPLAY)
          : bucketClasses
        )?.map((resourceName) => (
          <ResourceLink
            link={`/mcgms/resource/${referenceForModel(
              NooBaaBucketClassModel
            )}/${resourceName}`}
            resourceName={resourceName}
            key={resourceName}
            hideIcon
            className="resource-items-link"
          />
        ))}
      </div>
      {bucketClasses.length > MAX_NO_OF_RESOURCE_DISPLAY && (
        <>
          <Divider />
          <div className="view-more-popup">
            <Link to={BUCKET_CLASS_LIST_PATH}>{t('View more')}</Link>
          </div>
        </>
      )}
    </ResourcePopOver>
  );
};

export const DataResourcesPopOver: React.FC<DataResourcesPopOverProps> = ({
  label,
  dataResources,
  headerContent,
}) => {
  const { t } = useTranslation();

  return (
    <ResourcePopOver
      label={label}
      headerContent={headerContent}
      title={t('Connected data sources')}
    >
      <div className="resource-pop-over">
        {(dataResources?.length > MAX_NO_OF_RESOURCE_DISPLAY
          ? dataResources.slice(0, MAX_NO_OF_RESOURCE_DISPLAY)
          : dataResources
        )?.map((resourceName) => (
          <ResourceLink
            link={`/mcgms/resource/${referenceForModel(
              NooBaaNamespaceStoreModel
            )}/${resourceName}`}
            resourceName={resourceName}
            key={resourceName}
            hideIcon
            className="resource-items-link"
          />
        ))}
      </div>
      {dataResources.length > MAX_NO_OF_RESOURCE_DISPLAY && (
        <>
          <Divider />
          <div className="view-more-popup">
            <Link to={DATA_RESOURCE_LIST_PATH}>{t('View more')}</Link>
          </div>
        </>
      )}
    </ResourcePopOver>
  );
};

export const OBCPopOver: React.FC<OBCPopOverProps> = ({
  label,
  obcDetails,
  headerContent,
}) => {
  const { t } = useTranslation();

  return (
    <ResourcePopOver
      label={label}
      headerContent={headerContent}
      title={t('Connected ObjectBucketClaims')}
    >
      <div className="resource-pop-over">
        {(obcDetails?.length > MAX_NO_OF_RESOURCE_DISPLAY
          ? obcDetails.slice(0, MAX_NO_OF_RESOURCE_DISPLAY)
          : obcDetails
        )?.map((obcObj) => (
          <ResourceLink
            link={`/k8s/ns/${obcObj.ns}/${referenceForModel(
              NooBaaObjectBucketClaimModel
            )}/${obcObj.name}`}
            resourceName={obcObj.name}
            key={obcObj.name}
            hideIcon
            className="resource-items-link"
          />
        ))}
      </div>
      {obcDetails.length > MAX_NO_OF_RESOURCE_DISPLAY && (
        <>
          <Divider />
          <div className="view-more-popup">
            <Link to={OBC_LIST_PATH}>{t('View more')}</Link>
          </div>
        </>
      )}
    </ResourcePopOver>
  );
};

type ResourcePopOverProps = {
  label: string;
  position?: PopoverPosition;
  title?: string;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
};

type BucketClassPopOverProps = {
  label: string;
  bucketClasses: string[];
  headerContent?: React.ReactNode;
};

type DataResourcesPopOverProps = {
  label: string;
  dataResources: string[];
  headerContent?: React.ReactNode;
};

type OBCPopOverProps = {
  label: string;
  obcDetails: {
    name: string;
    ns: string;
  }[];
  headerContent?: React.ReactNode;
};
