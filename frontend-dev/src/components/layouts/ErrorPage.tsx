import { QuebecLink } from "../ui/quebec/QuebecLink";
import b2rt from "@/assets/b2rt.svg";
import krem from "@/assets/krem.svg";
import m11a from "@/assets/m11a.svg";
import syuz from "@/assets/syuz.svg";

type ErrorType = "404" | "401" | "403" | "500" | "generic";

interface ErrorPageProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  actionText?: string;
  actionLink?: string;
}

export function ErrorPage({
  type = "generic",
  title,
  message,
  actionText = "Retour à l'accueil",
  actionLink = "/",
}: ErrorPageProps) {
  // Définir les valeurs par défaut en fonction du type d'erreur
  let defaultTitle = "Une erreur est survenue";
  let defaultMessage =
    "Nous sommes désolés, une erreur inattendue s'est produite.";
  let image = b2rt;

  switch (type) {
    case "404":
      defaultTitle = "Page introuvable";
      defaultMessage =
        "La page que vous recherchez n'existe pas ou a été déplacée.";
      image = b2rt;
      break;
    case "401":
      defaultTitle = "Authentification requise";
      defaultMessage = "Vous devez vous connecter pour accéder à cette page.";
      image = m11a;
      break;
    case "403":
      defaultTitle = "Accès refusé";
      defaultMessage =
        "Vous n'avez pas les permissions nécessaires pour accéder à cette page.";
      image = krem;
      break;
    case "500":
      defaultTitle = "Erreur serveur";
      defaultMessage =
        "Nous sommes désolés, une erreur est survenue sur notre serveur.";
      image = syuz;
      break;
  }

  // Utiliser les valeurs fournies ou les valeurs par défaut
  const errorTitle = title || defaultTitle;
  const errorMessage = message || defaultMessage;

  return (
    <div className="quebec-error-container py-5 w-full h-screen flex flex-col items-center justify-center">
      <div className="quebec-error-icon">
        <img src={image} height={250} width={400} alt="Page erreur" />
      </div>
      <div className="quebec-error-code">{type !== "generic" ? type : ""}</div>
      <h1 className="quebec-error-title">{errorTitle}</h1>
      <p className="quebec-error-message">{errorMessage}</p>
      <div className="quebec-error-actions">
        <QuebecLink href={actionLink} variant="button">
          {actionText}
        </QuebecLink>
      </div>
    </div>
  );
}
