import { useCallback } from 'react';

import { useSearchParams } from 'react-router';

interface UsePagePersistenceReturn {
  currentPage: number;
  setPage: (page: number) => void;
  getPageParam: () => string;
}

export function usePagePersistence(
  defaultPage: number = 1
): UsePagePersistenceReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(
    searchParams.get('page') || String(defaultPage),
    10
  );

  const setPage = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (page === 1) {
          newParams.delete('page');
        } else {
          newParams.set('page', String(page));
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  const getPageParam = useCallback(() => {
    return currentPage > 1 ? `?page=${currentPage}` : '';
  }, [currentPage]);

  return {
    currentPage,
    setPage,
    getPageParam,
  };
}
