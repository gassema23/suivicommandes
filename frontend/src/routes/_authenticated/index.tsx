import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumb } from "@/components/ui/quebec/Breadcrumb";
import { Button } from "@/components/ui/quebec/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/quebec/Card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/quebec/Alert";
import { Badge } from "@/components/ui/quebec/Badge";
import { Info, AlertTriangle } from "lucide-react";
import { QuebecLink } from "@/components/ui/quebec/QuebecLink";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [{ title: "Tableau de bord" }],
  }),
  component: RouteComponent,
});

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Design", href: "/" },
  { label: "Composants", href: "/", isCurrent: true },
];

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} />

          <h1 className="section-title">Système de design</h1>
          <p className="subtitle">
            Démonstration des composants basés sur le système de design.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card elevation={1}>
              <CardHeader>
                <CardTitle>Composants</CardTitle>
                <CardDescription>
                  Éléments d'interface réutilisables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Les composants sont des éléments d'interface utilisateur
                  réutilisables qui respectent les normes du système de design
                  gouvernemental du Québec.
                </p>
              </CardContent>
              <CardFooter>
                <Button>Explorer</Button>
              </CardFooter>
            </Card>

            <Card elevation={2}>
              <CardHeader>
                <CardTitle>Typographie</CardTitle>
                <CardDescription>Polices et styles de texte</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  La typographie utilise principalement la police Roboto pour
                  les titres et le texte courant, avec Open Sans comme police
                  secondaire.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary">Explorer</Button>
              </CardFooter>
            </Card>

            <Card elevation={3}>
              <CardHeader>
                <CardTitle>Couleurs</CardTitle>
                <CardDescription>
                  Palette de couleurs officielle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  La palette de couleurs respecte l'identité visuelle du
                  gouvernement du Québec, avec le bleu PIV comme couleur
                  principale.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Explorer</Button>
              </CardFooter>
            </Card>
          </div>

          <h2>Alertes et notifications</h2>
          <div className="grid gap-4 mb-8">
            <Alert variant="info">
              <Info className="alert-icon h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                Ceci est une alerte d'information standard.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertTriangle className="alert-icon h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>
                Une erreur s'est produite lors du traitement de votre demande.
              </AlertDescription>
            </Alert>

            <Alert variant="warning">
              <AlertTriangle className="alert-icon h-4 w-4" />
              <AlertTitle>Avertissement</AlertTitle>
              <AlertDescription>
                Veuillez vérifier les informations saisies avant de continuer.
              </AlertDescription>
            </Alert>
          </div>

          <h2>Badges</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge>Par défaut</Badge>
            <Badge variant="secondary">Secondaire</Badge>
            <Badge variant="destructive">Erreur</Badge>
            <Badge variant="outline">Contour</Badge>
          </div>

          <h2>Liens</h2>
          <div className="space-y-4 mb-8">
            <div>
              <QuebecLink href="#">Lien standard</QuebecLink>
            </div>
            <div>
              <QuebecLink href="https://quebec.ca" linkType="external">
                Lien externe
              </QuebecLink>
            </div>
            <div>
              <QuebecLink
                href="/documents/exemple.pdf"
                linkType="document"
                fileSize="1,2 Mo"
              >
                Document PDF
              </QuebecLink>
            </div>
            <div>
              <QuebecLink href="#" variant="button">
                Lien bouton
              </QuebecLink>
            </div>
          </div>

          <h2>Boutons</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            <Button>Par défaut</Button>
            <Button variant="secondary">Secondaire</Button>
            <Button variant="destructive">Destructif</Button>
            <Button variant="outline">Contour</Button>
            <Button variant="ghost">Fantôme</Button>
            <Button variant="link">Lien</Button>
            <Button variant="success">Succès</Button>
            <Button variant="warning">Avertissement</Button>
          </div>

          <h2>Élévations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <div className="elevation-0 p-4 text-center">Élévation 0</div>
            <div className="elevation-1 p-4 text-center">Élévation 1</div>
            <div className="elevation-2 p-4 text-center">Élévation 2</div>
            <div className="elevation-3 p-4 text-center">Élévation 3</div>
            <div className="elevation-4 p-4 text-center">Élévation 4</div>
          </div>
        </div>
      </main>
    </div>
  );
}
