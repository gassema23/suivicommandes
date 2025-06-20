import { NavigationTabs } from "@/components/ui/quebec/NavigationTabs";
import InformationForm from "./InformationForm";
import ProfileSecurityForm from "./ProfileSecurityForm";
import SettingsForm from "./SettingsForm";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  initials: string;
}

export default function ProfileMenu({ data }: { data: User }) {
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
          content: () => <ProfileSecurityForm userId={data.id} />,
        },
        {
          id: "notifications",
          label: "Notifications",
          content: () => <div>Contenu des notifications</div>,
        },
        {
          id: "settings",
          label: "Préférences",
          content: () => <SettingsForm />,
        },
      ]}
    />
  );
}
