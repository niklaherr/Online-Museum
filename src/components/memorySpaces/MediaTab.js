// Medien-Tab-Komponente
const MediaTab = ({ activeTab, media }) => {
  if (!media || media.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Keine Medien vorhanden</h3>
        <p className="mt-1 text-gray-500">
          Füge Bilder, Videos oder andere Medien hinzu, um den Erinnerungsraum zu gestalten.
        </p>
      </div>
    );
  }

  // Filter nach Medientyp basierend auf dem aktiven Tab
  const filteredMedia = activeTab === 'all' 
    ? media 
    : media.filter(item => item.type === activeTab);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredMedia.map(item => (
        <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {item.type === 'image' && (
            <div className="relative h-48">
              <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          {item.type === 'video' && (
            <div className="relative h-48 bg-gray-100 flex items-center justify-center">
              <div className="flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          )}
          
          {item.type === 'audio' && (
            <div className="relative h-48 bg-blue-50 flex items-center justify-center">
              <div className="flex items-center justify-center">
                <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            </div>
          )}
          
          {item.type === 'document' && (
            <div className="relative h-48 bg-gray-50 flex items-center justify-center">
              <div className="flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          )}
          
          <div className="p-3">
            <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(item.date).toLocaleDateString('de-DE')} • {item.location || 'Kein Ort angegeben'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};