import CrispChat from '@app/components/CrispChat';
import Dashboard from './components/Dashboard';

export default function Page({ callApi }: { callApi: (path: string, options?: RequestInit) => Promise<Response> }) {
  return (
    <>
      <Dashboard callApi={callApi} />
      <CrispChat />
    </>
  );
}
