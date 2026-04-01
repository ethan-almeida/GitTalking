import Spinner from '../components/LoadingSpin';

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto mt-20">
        <Spinner />
      </div>
    </main>
  );
}