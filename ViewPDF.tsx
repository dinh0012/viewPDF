import * as React from 'react';
import { Document, Page, pdfjs } from 'react-pdf/dist/entry.webpack';
import Pagination from 'components/pagination/Pagination';
import * as css from './viewPDF.scss';
import PageView from 'components/pagination/PageView';

interface Props {
  file: string;
  isShowPagination?: boolean;
}
const ViewPDF = (props: Props) => {
  const [ currentPage, setCurrentPage ] = React.useState(1);
  const [ pagesRendered, setPagesRendered ] = React.useState([
    { page: 1, scrollTopMin: 0, scrollTopMax: 0 }
  ]);
  const [ numPages, setNumPages ] = React.useState(0);
  const useLayoutEffect = React.useLayoutEffect;
  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const handleScrollViewPDF = (e) => {
    const containerViewPDF = e.target;
    const { clientHeight, scrollHeight, scrollTop } = containerViewPDF;
    const pages = [ ...pagesRendered ];
    if (currentPage < numPages && clientHeight + scrollTop === scrollHeight) {
      const index = pages.findIndex((page) => {
        return page.scrollTopMax === 0;
      });
      if (index !== -1) {
        pages[index].scrollTopMax = scrollTop;
      }
      if (pages.length < numPages) {
        pages.push({
          page: currentPage + 1,
          scrollTopMin: scrollTop,
          scrollTopMax: 0
        });
        setPagesRendered(pages);
      }

      setCurrentPage(currentPage + 1);
    }
    const currentPageScroll = pages.find((page) => {
      return (
        page.scrollTopMin < scrollTop &&
        (page.scrollTopMax > scrollTop || page.scrollTopMax === 0)
      );
    });
    if (currentPageScroll) {
      setCurrentPage(currentPageScroll.page);
    }
  };

  useLayoutEffect(() => {
    const containerViewPDF = document.getElementById('preview-pdf');
    if (!containerViewPDF) {
      return;
    }
    containerViewPDF.addEventListener('scroll', handleScrollViewPDF);
    return () => {
      containerViewPDF.removeEventListener('scroll', handleScrollViewPDF);
    };
  }, [ currentPage, numPages, pagesRendered ]);
  const { file, isShowPagination = false } = props;
  const containerViewPDF = document.getElementById('preview-pdf');
  return (
    <>
      <div id="preview-pdf" className={css.contentPdf}>
        <Document file={`${file}`} onLoadSuccess={handleLoadSuccess}>
          {pagesRendered.map((page, key) => (
            <Page key={key} pageNumber={page.page} scale={1.5} />
          ))}
        </Document>
      </div>
      <PageView totalPages={numPages} currentPage={currentPage} />
      {isShowPagination && (
        <Pagination
          currentPage={currentPage}
          onPageChange={(page) => {
            const currentPageScroll = pagesRendered.find((p) => {
              return p.page === page;
            });
            if (containerViewPDF && currentPageScroll) {
              containerViewPDF.scrollTop = currentPageScroll.scrollTopMax;
            }
            setCurrentPage(page);
          }}
          totalPages={numPages}
        />
      )}
    </>
  );
};
export default ViewPDF;
