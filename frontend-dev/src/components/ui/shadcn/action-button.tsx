import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "../quebec/Button";
import { useNavigate } from "@tanstack/react-router";

export default function ActionButton({ to }: { to?: string }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!to) return null;

  const handleClick = async () => {
    setLoading(true);
    try {
      await navigate({ to });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button size="sm" onClick={handleClick} disabled={loading}>
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Plus className="w-4 h-4 mr-2" />
        )}
        Ajouter
      </Button>
    </div>
  );
}