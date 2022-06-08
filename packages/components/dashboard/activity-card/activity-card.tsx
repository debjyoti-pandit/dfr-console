import * as React from 'react';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { RecentEventsBody } from '@openshift-console/dynamic-plugin-sdk-internal';
import { EventKind } from '@openshift-console/dynamic-plugin-sdk-internal/lib/api/internal-types';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, CardTitle } from '@patternfly/react-core';
import { eventsResource } from '../../resources';
import './activity-card.scss';

const ActivityCard: React.FC = () => {
  const { t } = useTranslation();
  const [data, loaded, loadError] =
    useK8sWatchResource<EventKind[]>(eventsResource);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Activity')}</CardTitle>
      </CardHeader>
      <CardBody className="activity-card-body ">
        <RecentEventsBody
          events={{
            data,
            loaded,
            loadError,
          }}
        />
      </CardBody>
    </Card>
  );
};

export default ActivityCard;
