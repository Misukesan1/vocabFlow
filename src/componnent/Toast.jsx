import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeToast } from '../slices/toastSlice';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ id, message, type, duration }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(id));
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, dispatch]);

  const handleClose = () => {
    dispatch(removeToast(id));
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/50';
      case 'error':
        return 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/50';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/50';
      default:
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/50';
    }
  };

  return (
    <div
      className={`
        ${getStyles()}
        flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg
        backdrop-blur-sm border border-white/20
        animate-[slideIn_0.3s_ease-out]
        hover:scale-105 transition-transform duration-200
        min-w-[280px] max-w-[400px]
      `}
      style={{
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <p className="flex-1 text-sm font-medium">
        {message}
      </p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
