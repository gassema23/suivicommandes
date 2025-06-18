import { LoadingProgress } from "@/components/ui/loader/LoadingProgress";
import { Button } from "@/components/ui/quebec/Button";
import { useAuthService } from "@/shared/auth/libs/useAuthService";
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
  const { refreshToken } = useAuthService();

  const handleClick = () => {
    setShow(false); // force un démontage/remontage
    setTimeout(() => setShow(true), 10);
  };

  return (
    <div className="p-8 flex flex-col gap-4 w-full">
      <div>
        <Button onClick={handleClick}>Lancer le loading progress</Button>
        {show && (
          <LoadingProgress
            duration={2000}
            color="var(--foreground)"
            height={6}
          />
        )}
      </div>
      <div>
        <Button onClick={() => refreshToken()}>Refresh token</Button>
      </div>
    </div>
  );
}
