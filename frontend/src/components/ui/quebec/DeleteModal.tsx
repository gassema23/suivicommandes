import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/shadcn/dialog";
import { Button } from "@/components/ui/quebec/Button";
import { useEffect, useState } from "react";
import { API_ROUTE } from "@/constants/api-route.constant";
import { useCsrf } from "@/providers/csrf.provider";
import { formatErrorMessage } from "@/lib/utils";

interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deletePageName: string;
  onSuccess?: () => void;
  title?: string;
  description?: string;
  deleteId: string | null;
}

export function DeleteModal({
  open,
  onOpenChange,
  deletePageName,
  deleteId,
  onSuccess,
  title = "Confirmer la suppression",
  description = "Êtes-vous sûr de vouloir supprimer cette donnée ? Cette action est irréversible.",
}: DeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { ensureCsrfToken } = useCsrf();

  const handleDelete = async () => {
    if (!deleteId || !deletePageName) {
      setError("Erreur interne : ressource à supprimer inconnue.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const csrfToken = await ensureCsrfToken();
      const res = await fetch(`${API_ROUTE}/${deletePageName}/${deleteId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message ?? "Erreur lors de la suppression");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {error && <div className="text-destructive text-sm mb-2">{error}</div>}

        <DialogFooter className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            isLoading={loading}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
