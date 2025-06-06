import LoadingPage from "@/components/ui/loader/LoadingPage";
import FormError from "@/components/ui/shadcn/form-error";
import { QUERY_KEYS } from "@/features/common/constants/query-key.constant";
import ProfileBanner from "@/features/profile/components/ProfileBanner";
import ProfileMenu from "@/features/profile/components/ProfileMenu";
import { getProfile } from "@/features/profile/services/get-profile.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const profileQueryOptions = queryOptions({
  queryKey: QUERY_KEYS.PROFILE,
  queryFn: () => getProfile(),
});

export const Route = createFileRoute("/_authenticated/profile/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(profileQueryOptions),
  errorComponent: ({ error }) => (
    <FormError
      title="Erreur lors du chargement du profile"
      message={error.message}
    />
  ),
  staticData: {
    title: "Profile",
    breadcrumb: [
      { label: "Tableau de bord", href: "/" },
      { label: "Profile", href: "/profile", isCurrent: true },
    ],
  },
  pendingComponent: () => <LoadingPage />,
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(profileQueryOptions);
  return (
    <div>
      <ProfileBanner data={data.user} />
      <div className="mt-4">
        <ProfileMenu data={data.user} />
      </div>
    </div>
  );
}
