import React from 'react';
import { Dialog, DialogPanel, Button } from '@tremor/react';
import SnakeGame from './SnakeGame';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface SnakeGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SnakeGameModal: React.FC<SnakeGameModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      static={true}
    >
      <DialogPanel className="max-w-xl p-6 bg-white rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-800">🎮 Easter Egg: Snake Game!</h3>
          <Button
            variant="light"
            color="gray"
            onClick={onClose}
          >
            Schließen
          </Button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-gray-700">
            Du hast ein Easter Egg gefunden! Anstatt des PDF-Handbuchs haben wir für dich ein Snake Game :D
            Viel Spaß beim Spielen!
          </p>
        </div>
        
        

        <div>
          {/* Content visible only on large screens and up */}
          <div className="hidden lg:block">
            <SnakeGame />
          </div>

          {/* Message for smaller screens */}
          <div className="block lg:hidden flex flex-col items-center justify-center text-center p-6">
            <ExclamationCircleIcon className="w-12 h-12 text-yellow-500 mb-4" />
            <p className="text-lg font-semibold">Bitte verwenden Sie einen größeren Bildschirm, um diese Funktion zu nutzen.</p>
          </div>
        </div>

        
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>
            Zurück zur Hilfeseite
          </Button>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default SnakeGameModal;