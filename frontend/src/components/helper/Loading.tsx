import { useEffect, useState } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

// Loading component displays a spinner, then a message if loading takes too long
const Loading = () => {
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Set a timeout to switch from spinner to message after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center p-12 text-center">
      {/* Show spinner before timeout, otherwise show fallback message */}
      {!timeoutReached ? (
        <div className="text-blue-500">
          {/* Animated loading spinner */}
          <svg
            className="animate-spin h-10 w-10"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
              5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 
              5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="text-gray-500 flex flex-col items-center">
          {/* Fallback message with icon if loading takes too long */}
          <ExclamationCircleIcon className="w-10 h-10 mb-2 text-gray-400" />
          <p className="text-lg font-semibold">Fehler beim Laden</p>
          <p className="text-sm text-gray-400 mt-1">Versuche, die Seite neu zu laden oder prüfe deine Verbindung.</p>
        </div>
      )}
    </div>
  );
};

export default Loading;
