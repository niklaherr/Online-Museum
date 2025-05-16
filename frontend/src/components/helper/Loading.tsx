const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="max-w-lg text-center p-6 bg-white rounded-lg shadow-md">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Keine Inhalte</h1>
        <p className="mt-4 text-gray-600">
          Für ihre Suche gibt es keine Inhalte
        </p>
      </div>
    </div>
  );
};

export default Loading;