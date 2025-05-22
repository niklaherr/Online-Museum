import React from 'react';
import { Dialog, DialogPanel, Button } from '@tremor/react';
import SnakeGame from './SnakeGame';

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
        
        <SnakeGame />
        
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