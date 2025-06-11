import LoadingPage from "@/components/ui/loader/LoadingPage";
import { useQuery } from "@tanstack/react-query";

type ProfilesMap = Record<string, string[]>;

const FOLDER_LABELS: Record<string, string> = {
  boy: "Garçons",
  girl: "Filles",
  astronomer: "Astonomes",
  chef: "Chefs",
  doctor: "Médecins",
  engineer: "Ingénieurs",
  firefighters: "Pompiers",
  police: "Policiers",
  teacher: "Enseignants",
  farmer: "Agriculteurs",
  lawyer: "Avocats",
  operator: "Opérateurs",
  designer: "Designers",
};

export default function UserAvatarList({
  onSelect,
  selected,
}: {
  onSelect: (url: string) => void;
  selected?: string;
}) {
  const {
    data: profiles = {},
    isLoading,
    isError,
  } = useQuery<ProfilesMap>({
    queryKey: ["avatars"],
    queryFn: async () => {
      const res = await fetch("/profiles/index.json");
      if (!res.ok) throw new Error("Erreur lors du chargement des avatars");
      return res.json();
    },
  });

  if (isLoading) return <LoadingPage />;
  if (isError) return <div>Erreur lors du chargement des avatars.</div>;

  return (
    <div className="space-y-6 mt-4">
      {Object.entries(profiles)
      .sort(([a], [b]) => (FOLDER_LABELS[a] || a).localeCompare(FOLDER_LABELS[b] || b, "fr"))
      .map(([folder, images]) => (
        <div key={folder}>
          <h3 className="font-bold mb-2 capitalize">
            {FOLDER_LABELS[folder] || folder}
          </h3>
          <div className="flex flex-wrap gap-2">
            {images
              .slice()
              .sort((a, b) => a.localeCompare(b, "fr"))
              .map((img) => {
                const url = `/profiles/${folder}/${img}`;
                return (
                  <button
                    key={img}
                    type="button"
                    className={`border-2 rounded-full p-1 ${
                      selected === url ? "border-accent" : "border-transparent"
                    }`}
                    onClick={() => onSelect(url)}
                    aria-label={`Choisir ${img}`}
                  >
                    <img
                      src={url}
                      alt={img}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
