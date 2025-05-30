import { QuebecLink } from "./QuebecLink";

export function QuebecFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="px-8 py-4 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-lg font-bold mb-4">À propos</h2>
            <ul className="space-y-2">
              <li>
                <QuebecLink
                  href="#"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground no-underline"
                >
                  Accessibilité
                </QuebecLink>
              </li>
              <li>
                <QuebecLink
                  href="#"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground no-underline"
                >
                  Politique de confidentialité
                </QuebecLink>
              </li>
              <li>
                <QuebecLink
                  href="#"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground no-underline"
                >
                  Conditions d&apos;utilisation
                </QuebecLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">Ressources</h2>
            <ul className="space-y-2">
              <li>
                <QuebecLink
                  href="#"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground no-underline"
                >
                  Documentation
                </QuebecLink>
              </li>
              <li>
                <QuebecLink
                  href="#"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground no-underline"
                >
                  Téléchargements
                </QuebecLink>
              </li>
              <li>
                <QuebecLink
                  href="#"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground no-underline"
                >
                  Mises à jour
                </QuebecLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">Contact</h2>
            <ul className="space-y-2">
              <li>
                <QuebecLink
                  href="#"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground no-underline"
                >
                  Nous joindre
                </QuebecLink>
              </li>
              <li>
                <QuebecLink
                  href="#"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground no-underline"
                >
                  Signaler un problème
                </QuebecLink>
              </li>
              <li>
                <QuebecLink
                  href="#"
                  className="text-secondary-foreground/80 hover:text-secondary-foreground no-underline"
                >
                  Contribuer
                </QuebecLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-foreground/20 text-center text-secondary-foreground/60 text-sm">
          <p>© Gouvernement du Québec, {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
