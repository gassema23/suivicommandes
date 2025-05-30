import { APP_NAME } from "@/config";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      {
        name: "description",
        content: "",
      },
      {
        title: `Tableau de bord | ${APP_NAME}`,
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/_authenticated/"!
    </div>
  );
}
