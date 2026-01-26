import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CreateWordModal = ({ isOpen, onClose, onCreateWord, category = 'words' }) => {
  const MAX_LENGTH = 200;

  // Détermine les champs nécessaires selon la catégorie
  const getFieldsForCategory = (cat) => {
    switch(cat) {
      case 'words':
        return ['kanji', 'romaji', 'meaning'];
      case 'kanji':
        return ['kanji', 'kunReading', 'kunExample', 'onReading', 'onExample', 'meaning'];
      case 'verbs':
        return ['infinitive', 'progressive', 'politeForm', 'meaning'];
      default:
        return ['kanji', 'romaji', 'meaning'];
    }
  };

  const fields = getFieldsForCategory(category);

  // État dynamique basé sur les champs
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
  );
  const [errors, setErrors] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
  );

  // Réinitialiser le formulaire quand la catégorie change
  useEffect(() => {
    const newFields = getFieldsForCategory(category);
    setFormData(newFields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
    setErrors(newFields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
  }, [category]);

  // Labels pour chaque champ
  const getFieldLabel = (field) => {
    const labels = {
      kanji: 'Kanji / Hiragana / Katakana',
      romaji: 'Romaji (alphabet latin)',
      meaning: 'Signification',
      kunReading: 'Lecture kun + romaji',
      kunExample: 'Exemple kun',
      onReading: 'Lecture on + romaji',
      onExample: 'Exemple on',
      infinitive: 'Verbe infinitif',
      progressive: 'Verbe en action (en train de...)',
      politeForm: 'Forme polie (masu)',
    };
    return labels[field] || field;
  };

  // Placeholders pour chaque champ (adapté selon la catégorie)
  const getFieldPlaceholder = (field) => {
    // Placeholders spécifiques pour la catégorie kanji
    if (category === 'kanji') {
      const kanjiPlaceholders = {
        kanji: 'Ex: 行',
        kunReading: 'Ex: い.く / iku',
        kunExample: 'Ex: 行く（いく）→ aller',
        onReading: 'Ex: コウ / kō',
        onExample: 'Ex: 旅行（りょこう / ryokō）→ voyage',
        meaning: 'Ex: aller ; se déplacer ; effectuer',
      };
      return kanjiPlaceholders[field] || `Ex: ${field}`;
    }

    // Placeholders spécifiques pour la catégorie verbs
    if (category === 'verbs') {
      const verbsPlaceholders = {
        infinitive: 'Ex: 食べる',
        progressive: 'Ex: 食べている',
        politeForm: 'Ex: 食べます',
        meaning: 'Ex: manger',
      };
      return verbsPlaceholders[field] || `Ex: ${field}`;
    }

    const placeholders = {
      kanji: 'Ex: こんにちは',
      romaji: 'Ex: konnichiwa',
      meaning: 'Ex: Bonjour',
    };
    return placeholders[field] || `Ex: ${field}`;
  };

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
    const newErrors = {};
    fields.forEach(field => {
      newErrors[field] = validateField(field, formData[field]);
    });
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: validateField(field, value) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAllFields()) {
      const trimmedData = {};
      fields.forEach(field => {
        trimmedData[field] = formData[field].trim();
      });
      onCreateWord(trimmedData);

      // Reset form
      const resetData = fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {});
      setFormData(resetData);
      setErrors(fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
      onClose();
    }
  };

  const handleClose = () => {
    const resetData = fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {});
    setFormData(resetData);
    setErrors(fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-700">
            Ajouter un {category === 'words' ? 'mot' : category === 'kanji' ? 'kanji' : 'verbe'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg transition-all active:scale-95 text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div key={field} className="mb-4">
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {getFieldLabel(field)}
              </label>
              <input
                id={field}
                type="text"
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={getFieldPlaceholder(field)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors[field]
                    ? 'border-red-300 focus:ring-red-600'
                    : 'border-gray-200 focus:ring-purple-600'
                }`}
                autoFocus={index === 0}
              />
              {errors[field] && (
                <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">
                {formData[field].length}/{MAX_LENGTH} caractères
              </p>
            </div>
          ))}

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
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWordModal;
