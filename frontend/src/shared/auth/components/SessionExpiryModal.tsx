import { Button } from "@/components/ui/quebec/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/quebec/Card";

export function SessionExpiryModal({
  open,
  timer,
  onLogout,
  onContinue,
}: {
  open: boolean;
  timer: number;
  onLogout: () => void;
  onContinue: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40">
      <Card elevation={1}>
        <CardHeader>
          <CardTitle>Votre session va expirer</CardTitle>
          <CardDescription>
            Pour des raisons de sécurité, votre session va bientôt expirer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Il vous reste <b>{timer}</b> seconde{timer > 1 ? "s" : ""} avant la
            déconnexion automatique.
          </p>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2 justify-end w-full">
            <Button variant="destructive" onClick={onLogout}>
              Me déconnecter
            </Button>
            <Button onClick={onContinue}>Rester connecté</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
