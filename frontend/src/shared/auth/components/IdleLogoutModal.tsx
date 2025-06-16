import { useIdleTimer } from "react-idle-timer";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/quebec/Button";
import { useAuthService } from "../libs/useAuthService";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";

export default function IdleLogoutModal() {

  const COUNTDOWN = 60; // 60 secondes
  const TIMEOUT = 4 * 60 * 1000; // 4 minutes

  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const { logout, refreshToken } = useAuthService();
  // Lance le compte à rebours quand le modal s'affiche
  useEffect(() => {
    if (showModal) {
      setCountdown(COUNTDOWN);
      countdownRef.current = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [showModal]);

  // Déconnexion auto si le compte à rebours atteint 0
  useEffect(() => {
    if (showModal && countdown <= 0) {
      logout();
    }
  }, [countdown, showModal, logout]);

  // Idle timer
  useIdleTimer({
    timeout: TIMEOUT,
    onIdle: () => setShowModal(true),
    debounce: 500,
  });

  const handleStay = () => {
    refreshToken();
    setShowModal(false);
  };
  const handleLogout = () => logout();
  // Empêche la fermeture par clic extérieur ou Escape
  const handleOpenChange = (open: boolean) => {
    if (!open && showModal) {
      setShowModal(true);
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Vous allez être déconnecté(e) bientôt</DialogTitle>
        </DialogHeader>
        <div>
          Pour protéger vos informations, vous serez déconnecté(e) dans{" "}
          <span className="font-semibold">{countdown} secondes</span>.
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
