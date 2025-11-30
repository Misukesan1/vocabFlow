import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { resetAll } from '../slices/listsSlice'
import { Trash2, AlertTriangle } from 'lucide-react'

export default function Settings() {
  const dispatch = useDispatch()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleReset = () => {
    dispatch(resetAll())
    setShowConfirmation(false)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Réglages</h1>

      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Réinitialiser l'application</h2>
            <p className="text-sm text-gray-600">Supprimer toutes les listes et tous les mots</p>
          </div>
          <button
            onClick={() => setShowConfirmation(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 size={18} />
            Réinitialiser
          </button>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Confirmer la réinitialisation</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir réinitialiser l'application ? Cette action supprimera définitivement toutes vos listes et tous vos mots. Cette action est irréversible.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
