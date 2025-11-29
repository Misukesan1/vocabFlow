import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditWordModal = ({ isOpen, onClose, onUpdateWord, word }) => {
  const [kanji, setKanji] = useState('');
  const [romaji, setRomaji] = useState('');
  const [meaning, setMeaning] = useState('');
  const [errors, setErrors] = useState({
    kanji: '',
    romaji: '',
    meaning: '',
  });

  useEffect(() => {
    if (word) {
      setKanji(word.kanji);
      setRomaji(word.romaji);
      setMeaning(word.meaning);
    }
  }, [word]);

  const MAX_LENGTH = 200;

  const validateField = (fieldName, value) => {
    if (!value.trim()) {
      return 'Ce champ ne peut pas être vide';
    }
    if (value.length > MAX_LENGTH) {
      return `Ne peut pas dépasser ${MAX_LENGTH} caractères`;
    }
    return '';
  };

  const validateAllFields = () => {
    const newErrors = {
      kanji: validateField('kanji', kanji),
      romaji: validateField('romaji', romaji),
      meaning: validateField('meaning', meaning),
    };
    setErrors(newErrors);
    return !newErrors.kanji && !newErrors.romaji && !newErrors.meaning;
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case 'kanji':
        setKanji(value);
        if (errors.kanji) {
          setErrors({ ...errors, kanji: validateField('kanji', value) });
        }
        break;
      case 'romaji':
        setRomaji(value);
        if (errors.romaji) {
          setErrors({ ...errors, romaji: validateField('romaji', value) });
        }
        break;
      case 'meaning':
        setMeaning(value);
        if (errors.meaning) {
          setErrors({ ...errors, meaning: validateField('meaning', value) });
        }
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAllFields()) {
      onUpdateWord({
        kanji: kanji.trim(),
        romaji: romaji.trim(),
        meaning: meaning.trim(),
      });
      setErrors({ kanji: '', romaji: '', meaning: '' });
      onClose();
    }
  };

  const handleClose = () => {
    setKanji('');
    setRomaji('');
    setMeaning('');
    setErrors({ kanji: '', romaji: '', meaning: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-700">
            Modifier le mot
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
              htmlFor="edit-kanji"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Kanji / Hiragana / Katakana
            </label>
            <input
              id="edit-kanji"
              type="text"
              value={kanji}
              onChange={(e) => handleInputChange('kanji', e.target.value)}
              placeholder="Ex: こんにちは"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                errors.kanji
                  ? 'border-red-300 focus:ring-red-600'
                  : 'border-gray-200 focus:ring-purple-600'
              }`}
              autoFocus
            />
            {errors.kanji && (
              <p className="mt-1 text-xs text-red-600">{errors.kanji}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {kanji.length}/{MAX_LENGTH} caractères
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="edit-romaji"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Romaji (alphabet latin)
            </label>
            <input
              id="edit-romaji"
              type="text"
              value={romaji}
              onChange={(e) => handleInputChange('romaji', e.target.value)}
              placeholder="Ex: konnichiwa"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                errors.romaji
                  ? 'border-red-300 focus:ring-red-600'
                  : 'border-gray-200 focus:ring-purple-600'
              }`}
            />
            {errors.romaji && (
              <p className="mt-1 text-xs text-red-600">{errors.romaji}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {romaji.length}/{MAX_LENGTH} caractères
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="edit-meaning"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Signification
            </label>
            <input
              id="edit-meaning"
              type="text"
              value={meaning}
              onChange={(e) => handleInputChange('meaning', e.target.value)}
              placeholder="Ex: Bonjour"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                errors.meaning
                  ? 'border-red-300 focus:ring-red-600'
                  : 'border-gray-200 focus:ring-purple-600'
              }`}
            />
            {errors.meaning && (
              <p className="mt-1 text-xs text-red-600">{errors.meaning}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {meaning.length}/{MAX_LENGTH} caractères
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
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWordModal;
