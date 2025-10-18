import { Helmet } from 'react-helmet-async';
import { MessagePage } from '@/components/shared/MessagePage';

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 - Not Found - SWStarter</title>
      </Helmet>

      <MessagePage
        icon="🔍"
        title="404"
        subtitle="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved to a galaxy far, far away."
        primaryAction={{
          label: 'BACK TO SEARCH',
        }}
        secondaryAction={{
          label: 'GO BACK',
        }}
      />
    </>
  );
}