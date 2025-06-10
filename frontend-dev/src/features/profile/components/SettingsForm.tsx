import { Button } from "@/components/ui/quebec/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import { useState } from "react";

export default function SettingsForm() {
  const [qrCodeValue, setQrCodeValue] = useState<string>("");
  return (
    <div>
      <h3 className="title-md">Authentification à deux facteurs</h3>
      <p className="subtitle">
        Ajoutez une couche de sécurité supplémentaire à votre compte.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Configurer l'authentification à deux facteurs</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Authentification à deux facteurs</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 flex flex-col">
                <p>
                  Pour configurer l'authentification à deux facteurs, veuillez
                  suivre les instructions suivantes :
                </p>
                <ol className="list-decimal pl-8 space-y-2">
                  <li>Téléchargez une application d'authentification.</li>
                  <li>
                    Scannez le code QR affiché ou entrez le code manuellement.
                  </li>
                  <li>
                    Entrez le code généré par l'application pour vérifier la
                    configuration.
                  </li>
                  <li>
                    Une fois vérifié, l'authentification à deux facteurs sera
                    activée pour votre compte.
                  </li>
                </ol>
                {qrCodeValue && <img src={qrCodeValue} className="w-54" />}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
