import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

const FILENAME = 'WATHODE NAMUNA NO  9 2025-26 MSPRABHIYAN GP WATHODE.xlsx';
const WORKBOOK_FILE = `/pdf/${encodeURIComponent(FILENAME)}`;
const HEADER_ROW_COUNT = 4; // Number of rows considered as headers

type SheetCell = string | number | boolean | null;

const VariousDocuments = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<SheetCell[][]>([]);
  const [sheetName, setSheetName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const abortController = new AbortController();

    const loadWorkbook = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(WORKBOOK_FILE, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Unable to load workbook (${response.status} ${response.statusText})`);
        }

        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        
        if (!workbook.SheetNames.length) {
          throw new Error('The workbook is empty.');
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const sheetRows = XLSX.utils.sheet_to_json<SheetCell[]>(worksheet, {
          header: 1,
          blankrows: false,
          defval: null,
        });

        setSheetName(firstSheetName);
        setRows(sheetRows);
      } catch (workbookError) {
        if ((workbookError as Error).name === 'AbortError') {
          return; // Ignore abort errors
        }
        setError(
          workbookError instanceof Error
            ? workbookError.message
            : 'An unknown error occurred while reading the workbook.'
        );
      } finally {
        setLoading(false);
      }
    };

    void loadWorkbook();

    return () => {
      abortController.abort(); // Cancel fetch on unmount
    };
  }, []);

  const columnCount = useMemo(
    () => rows.reduce((max, row) => Math.max(max, row.length), 0),
    [rows]
  );

  // Separate headers from body for semantic HTML and sticky positioning
  const headerRows = rows.slice(0, HEADER_ROW_COUNT);
  const bodyRows = rows.slice(HEADER_ROW_COUNT);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-tiro-marathi">
      <Helmet>
        <title>{t('variousDocumentsPage.title')} | Gram Panchayat</title>
      </Helmet>

      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('variousDocumentsPage.title')}
            </h1>
            <p className="text-sm text-gray-500 mt-1 line-clamp-1" title={FILENAME}>
              {t('variousDocumentsPage.previewOf')} {FILENAME}
            </p>
          </div>

          <a
            href={WORKBOOK_FILE}
            download={FILENAME}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('variousDocumentsPage.downloadExcelFile')}
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Metadata Banner */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">{t('variousDocumentsPage.sheet')}:</span>
            <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{sheetName || '---'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">{t('variousDocumentsPage.totalRows')}:</span>
            <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{rows.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">{t('variousDocumentsPage.totalColumns')}:</span>
            <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{columnCount}</span>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-auto max-h-[70vh] relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>{t('variousDocumentsPage.loading')}</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">{t('variousDocumentsPage.failedToLoad')}</h3>
                <p className="mt-1 text-red-600">{error}</p>
              </div>
            ) : rows.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                {t('variousDocumentsPage.noData')}
              </div>
            ) : (
              <table className="min-w-max w-full border-collapse text-sm text-left">
                <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
                  {headerRows.map((row, rowIndex) => (
                    <tr key={`header-${rowIndex}`}>
                      {Array.from({ length: columnCount }).map((_, colIndex) => {
                        const cellValue = row[colIndex];
                        return (
                          <th
                            key={`header-${rowIndex}-${colIndex}`}
                            className={`border-b border-r border-gray-200 px-4 py-3 font-semibold text-gray-800 whitespace-pre-wrap align-top ${
                              colIndex < 3 ? 'min-w-[12rem]' : 'min-w-[8rem]'
                            }`}
                          >
                            {cellValue ?? ''}
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bodyRows.map((row, rowIndex) => (
                    <tr key={`body-${rowIndex}`} className="hover:bg-gray-50 transition-colors">
                      {Array.from({ length: columnCount }).map((_, colIndex) => {
                        const cellValue = row[colIndex];
                        return (
                          <td
                            key={`body-${rowIndex}-${colIndex}`}
                            className="border-r border-gray-200 px-4 py-2.5 text-gray-700 whitespace-pre-wrap align-top"
                          >
                            {cellValue ?? ''}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VariousDocuments;