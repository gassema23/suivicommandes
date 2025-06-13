import { QuebecLink } from "@/components/ui/quebec/QuebecLink";
import { createFileRoute } from "@tanstack/react-router";
import image from "@/assets/m11a.svg";

export const Route = createFileRoute("/unauthorized")({
  component: RouteComponent,
});

function RouteComponent() {
  // Utiliser les valeurs fournies ou les valeurs par défaut
  const errorTitle = "Accès refusé";
  const errorMessage =
    "Vous n'avez pas les permissions nécessaires pour accéder à cette page.";
  return (
    <div className="quebec-error-container py-5 w-full h-screen flex flex-col items-center justify-center">
      <div className="quebec-error-icon">
        <img src={image} height={250} width={400} alt="Page erreur" />
      </div>
      <div className="quebec-error-code">403</div>
      <h1 className="quebec-error-title">{errorTitle}</h1>
      <p className="quebec-error-message">{errorMessage}</p>
      <div className="quebec-error-actions">
        <QuebecLink href="/" variant="button">
          Retour à l'accueil
        </QuebecLink>
      </div>
    </div>
  );
}
