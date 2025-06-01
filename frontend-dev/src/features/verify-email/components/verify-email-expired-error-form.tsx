import { Button } from "@/components/ui/quebec/Button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";

export default function VerifyEmailExpiredErrorForm() {
  return (
    <div>
      <h1 className="section-title">Besoin d’un nouveau départ ?</h1>
      <p className="subtitle">
        Votre session a expiré. Pas d’inquiétude, entrez simplement votre
        adresse courriel pour continuer.
      </p>
      <form action="">
        <Label className="block mb-2">Adresse courriel</Label>
        <Input type="email" />
        <Button type="submit" className="mt-4">
          Réinitialiser
        </Button>
      </form>
    </div>
  );
}
