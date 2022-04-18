import { TFunction } from 'i18next';

export const diskTypeDropdownItems = (t: TFunction) =>
  Object.freeze({
    All: t('plugin__dfr-console~All'),
    SSD: t('plugin__dfr-console~SSD / NVMe'),
    HDD: t('plugin__dfr-console~HDD'),
});
