import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface LoadingErrorAlertProps {
  error: string;
  onRetry?: () => void;
}

const LoadingErrorAlert: React.FC<LoadingErrorAlertProps> = ({ error, onRetry }) => {
  useEffect(() => {
    if (error) {
      console.log('Loading error detected:', error);
    }
  }, [error]);

  if (!error) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 max-w-sm">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 shadow-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              数据加载失败
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
              {error}
            </p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-600 dark:bg-yellow-700 text-white rounded hover:bg-yellow-700 dark:hover:bg-yellow-600 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              重试
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingErrorAlert;