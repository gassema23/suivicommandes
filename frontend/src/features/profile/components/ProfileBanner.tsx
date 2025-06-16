import { Button } from "@/components/ui/quebec/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/quebec/Card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import UserAvatarList from "./UserAvatarList";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SUCCESS_MESSAGES } from "@/constants/messages.constant";
import { DialogClose } from "@radix-ui/react-dialog";
import FormError from "@/components/ui/shadcn/form-error";
import { API_ROUTE } from "@/constants/api-route.constant";
import { QUERY_KEYS } from "@/constants/query-key.constant";
import UserAvatar from "@/components/ui/quebec/UserAvatar";
import { apiFetch } from "@/hooks/useApiFetch";

interface UserType {
  data: User;
}

interface User {
  id: string;
  initials: string;
  fullName: string;
  email: string;
  profileImage?: string;
}

export default function ProfileBanner({ data }: UserType) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  // Mutation pour enregistrer l'avatar
  const saveAvatarMutation = useMutation({
    mutationFn: async (avatarUrl: string) => {
      setSaving(true);
      const res = await apiFetch(`${API_ROUTE}/users/${data.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileImage: avatarUrl }),
      });
      setSaving(false);
      if (!res.ok)
        throw new Error("Erreur lors de l'enregistrement de l'avatar");
      return res.json();
    },
    onSuccess: () => {
      setSelectedAvatar(undefined); // Réinitialiser la sélection après succès
      // invalidateQueries pour rafraîchir les données du profil
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ME,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROFILE,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USERS,
      });
      toast.success(SUCCESS_MESSAGES.update("photo de profil"));
      setDialogOpen(false);
    },
  });

  const handleSave = () => {
    if (selectedAvatar) {
      saveAvatarMutation.mutate(selectedAvatar);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <UserAvatar user={data} size="xl" />
        <div>
          <CardTitle>{data.fullName}</CardTitle>
          <CardDescription>{data.email}</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="ml-auto"
              size="sm"
              variant="outline"
              onClick={() => setDialogOpen(true)}
            >
              Modifier la photo
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full lg:min-w-3xl">
            <DialogHeader>
              <DialogTitle>Modifier votre photo de profil</DialogTitle>
              <DialogDescription asChild>
                <div>
                  Sélectionnez une nouvelle image pour mettre à jour votre photo
                  de profil
                  {saveAvatarMutation.isError && (
                    <FormError
                      message={(saveAvatarMutation.error as Error).message}
                    />
                  )}
                  <div className="max-h-96 overflow-y-auto mt-4">
                    <UserAvatarList
                      selected={selectedAvatar}
                      onSelect={setSelectedAvatar}
                    />
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button
                isLoading={saving}
                disabled={!selectedAvatar || saving}
                onClick={handleSave}
              >
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
    </Card>
  );
}
