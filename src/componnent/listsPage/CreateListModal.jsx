import { useState } from 'react';
import { X } from 'lucide-react';

const CreateListModal = ({ isOpen, onClose, onCreateList }) => {
  const [listName, setListName] = useState('');
  const [error, setError] = useState('');

  const MAX_LENGTH = 200;

  const validateInput = (value) => {
    if (!value.trim()) {
      setError('Le nom de la liste ne peut pas être vide');
      return false;
    }
    if (value.length > MAX_LENGTH) {
      setError(`Le nom ne peut pas dépasser ${MAX_LENGTH} caractères`);
      return false;
    }
    setError('');
    return true;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setListName(value);
    if (error) {
      validateInput(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInput(listName)) {
      return; // Arrêter ici si la validation échoue
    }
    onCreateList(listName.trim());
    setListName('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setListName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-700">
            Créer une nouvelle liste
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg transition-all active:scale-95 text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="listName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nom de la liste
            </label>
            <input
              id="listName"
              type="text"
              value={listName}
              onChange={handleInputChange}
              placeholder="Ex: Vocabulaire N5"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                error
                  ? 'border-red-300 focus:ring-red-600'
                  : 'border-gray-200 focus:ring-purple-600'
              }`}
              autoFocus
            />
            {error && (
              <p className="mt-1 text-xs text-red-600">{error}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {listName.length}/{MAX_LENGTH} caractères
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg transition-all active:scale-95 hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg transition-all active:scale-95 hover:bg-purple-700"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListModal;
