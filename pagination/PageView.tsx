import * as React from 'react';
import { t } from 'common/utils/i18n';
import * as css from './PageView.scss';

interface Props {
  totalPages: number;
  currentPage: number;
}
const PageView = (props: Props) => {
  const { totalPages, currentPage } = props;
  return (
    <div className={`${css.PageView}`}>
      <div className="page-view">
        <div>{t('Page')}</div>
        <div>{currentPage}</div>
        <div>/</div>
        <div>{totalPages}</div>
      </div>
    </div>
  );
};
export default PageView;
