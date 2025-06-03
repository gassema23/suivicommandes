import { NavigationTabs } from "@/components/ui/quebec/NavigationTabs";
import InformationForm from "./InformationForm";
import ProfileSecurityForm from "./ProfileSecurityForm";

export default function ProfileMenu({ data }) {
  return (
    <NavigationTabs
      defaultTab="information"
      tabs={[
        {
          id: "information",
          label: "Informations",
          content: () => <InformationForm user={data} />,
        },
        {
          id: "security",
          label: "Sécurité",
          content: () => <ProfileSecurityForm />,
        },
        {
          id: "notifications",
          label: "Notifications",
          content: () => <div>Contenu des notifications</div>,
        },
        {
          id: "settings",
          label: "Préférences",
          content: () => <div>Contenu des notifications</div>,
        },
      ]}
    />
  );
}
