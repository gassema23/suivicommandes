import { useIdleTimer } from "react-idle-timer";
import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/quebec/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { useAuth } from "@/providers/auth.provider";

const LOGOUT_TIMEOUT = 45; // secondes

export default function IdleLogoutModal() {
  const { logout } = useAuth();
  const [showIdleModal, setShowIdleModal] = useState(false);
  const [countdown, setCountdown] = useState(LOGOUT_TIMEOUT);
  const countdownRef = useRef<number>(LOGOUT_TIMEOUT);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    countdownRef.current = LOGOUT_TIMEOUT;
  }, []);

  const startCountdown = useCallback(() => {
    // Reset countdown
    countdownRef.current = LOGOUT_TIMEOUT;
    setCountdown(LOGOUT_TIMEOUT);

    // Countdown every second
    intervalRef.current = setInterval(async () => {
      countdownRef.current -= 1;
      setCountdown(countdownRef.current);
      if (countdownRef.current <= 0) {
        await logout();
        clearTimers();
      }
    }, 1000);
  }, [logout, clearTimers]);

  const onIdle = useCallback(() => {
    setShowIdleModal(true);
  }, []);

  const onActive = useCallback(() => {
    setShowIdleModal(false);
    clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    if (showIdleModal) {
      startCountdown();
    } else {
      clearTimers();
    }
    return clearTimers;
  }, [showIdleModal, startCountdown, clearTimers]);

  const { reset } = useIdleTimer({
    timeout: 4 * 60 * 1000, // 4 minutes
    onIdle,
    onActive,
    debounce: 500,
    stopOnIdle: true,
    crossTab: true,
  });

  const handleStay = () => {
    setShowIdleModal(false);
    clearTimers();
    reset();
  };

  const handleLogout = () => {
    setShowIdleModal(false);
    clearTimers();
    logout();
  };

  return (
    <Dialog open={showIdleModal} onOpenChange={setShowIdleModal}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Vous allez être déconnecté(e) bientôt</DialogTitle>
        </DialogHeader>
        <div>
          Pour protéger vos informations, vous serez automatiquement
          déconnecté(e) dans{" "}
          <span className="font-semibold text-destructive">
            {countdown} seconde{countdown > 1 ? "s" : ""}
          </span>{" "}
          si aucune action n'est effectuée.
        </div>
        <DialogFooter>
          <Button onClick={handleLogout} variant="link">
            Se déconnecter
          </Button>
          <Button onClick={handleStay}>Rester connecté(e)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
