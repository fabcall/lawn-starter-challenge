import { createBrowserRouter } from 'react-router';

import { MainLayout } from '@/components/layout/MainLayout';
import { NotFoundPage } from '@/components/shared/NotFoundPage';
import { SearchPage } from '@/pages/SearchPage';
import { CharacterDetailPage } from '@/pages/CharacterDetailPage';
import { MovieDetailPage } from '@/pages/MovieDetailPage';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <SearchPage />,
      },
      {
        path: 'character/:id',
        element: <CharacterDetailPage />,
      },
      {
        path: 'movie/:id',
        element: <MovieDetailPage />,
      },
    ],
    errorElement: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);