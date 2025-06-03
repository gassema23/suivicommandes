import { useRouter } from "@tanstack/react-router";
import { useCallback } from "react";

export const useNavigationHistory = () => {
  const router = useRouter();

  const getPreviousPath = useCallback(() => {
    const history = router.history;
    if (history.length > 1) {
      return history[history.length - 2]?.pathname || '/';
    }
    return '/';
  }, [router.history]);

  const goToPreviousOrDashboard = useCallback(() => {
    const previousPath = getPreviousPath();
    return previousPath;
  }, [getPreviousPath]);

  return {
    getPreviousPath,
    goToPreviousOrDashboard
  };
};