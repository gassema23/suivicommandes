import { LoadingProgress } from "@/components/ui/loader/LoadingProgress";
import { Button } from "@/components/ui/quebec/Button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [{ title: "Tableau de bord" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(false); // force un démontage/remontage
    setTimeout(() => setShow(true), 10);
  };

  return (
    <div className="p-8">
      <Button onClick={handleClick}>Lancer le loading progress</Button>
      {show && (
        <LoadingProgress duration={2000} color="var(--foreground)" height={6} />
      )}
    </div>
  );
}
