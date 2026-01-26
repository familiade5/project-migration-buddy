import { useEffect, useRef } from 'react';
import { useActivityLog } from './useActivityLog';

/**
 * Hook to log when a user accesses a specific module
 * Logs entry only once per component mount
 */
export function useModuleActivity(moduleName: string, details?: Record<string, unknown>) {
  const { logActivity } = useActivityLog();
  const loggedRef = useRef(false);

  useEffect(() => {
    if (!loggedRef.current) {
      loggedRef.current = true;
      logActivity('module_access', 'module', undefined, {
        module: moduleName,
        ...details,
      });
    }
  }, [moduleName, logActivity, details]);
}

/**
 * Hook to log when a user performs an action within a module
 */
export function useActionLogger() {
  const { logActivity } = useActivityLog();

  const logAction = (
    action: string,
    moduleName: string,
    details?: Record<string, unknown>
  ) => {
    logActivity(action, 'module', undefined, {
      module: moduleName,
      ...details,
    });
  };

  return { logAction };
}
