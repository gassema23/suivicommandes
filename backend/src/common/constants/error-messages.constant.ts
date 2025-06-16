export const ERROR_MESSAGES = {
  // Erreurs liées aux opérations CRUD
  CREATE: 'Enregistrement impossible :',
  UPDATE: 'Mise à jour impossible :',
  DELETE: 'Suppression impossible :',
  FETCH: 'Récupération impossible :',
  FETCH_ALL: 'Récupération de tous les enregistrements impossible :',
  // Erreurs générales
  NOT_FOUND: 'Aucun enregistrement trouvé avec cet identifiant.',
  INVALID_UUID: "L'identifiant n'est pas valide.",
  INVALID_INPUT: 'Entrée invalide. Veuillez vérifier les données fournies.',
  UNAUTHORIZED:
    "Action non autorisée. Vous n'avez pas les permissions nécessaires.",
  SERVER_ERROR: 'Une erreur serveur est survenue. Veuillez réessayer plus tard',
  // Erreurs spécifiques aux entités
  UNIQUE_CONSTRAINT: 'Un enregistrement avec ces informations existe déjà.',
  TOO_MANY_ATTEMPTS: (attempt: number) =>
    `Trop de tentatives, réessayez dans ${attempt} minutes.`,
  INVALID_CREDENTIALS: 'Identifiants invalides. Veuillez réessayer.',
  IS_EMAIL_VERIFIED:
    'Veuillez vérifier votre adresse email avant de vous connecter.',
  TWO_FA_ERROR: 'Erreur lors de la vérification 2FA. Veuillez réessayer.',
};
