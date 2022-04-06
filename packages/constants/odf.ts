import { TFunction } from 'i18next';

export const diskTypeDropdownItems = (t: TFunction) =>
  Object.freeze({
    All: t('plugin__odf-console~All'),
    SSD: t('plugin__odf-console~SSD / NVMe'),
    HDD: t('plugin__odf-console~HDD'),
});
