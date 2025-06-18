import { useState } from "react";
import { Bell, Check, Archive, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/quebec/Button";
import { Badge } from "@/components/ui/quebec/Badge";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import { Checkbox } from "@/components/ui/shadcn/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";

const notifications = [
  {
    id: 1,
    title: "Nouvelle commande reçue",
    message:
      "Commande #CMD-2024-001 de 1,250€ reçue de Client ABC. Préparation en cours.",
    time: "Il y a 5 min",
    unread: true,
    type: "order",
    priority: "high",
    selected: false,
  },
  {
    id: 2,
    title: "Livraison en cours",
    message:
      "Commande #CMD-2024-002 expédiée par transporteur XYZ. Suivi disponible.",
    time: "Il y a 1h",
    unread: true,
    type: "delivery",
    priority: "medium",
    selected: false,
  },
  {
    id: 3,
    title: "Paiement confirmé",
    message:
      "Paiement de 850€ validé pour commande #CMD-2024-003. Facture générée.",
    time: "Il y a 2h",
    unread: false,
    type: "payment",
    priority: "low",
    selected: false,
  },
  {
    id: 4,
    title: "Retard de livraison",
    message:
      "Commande #CMD-2024-003 retardée - nouveau délai estimé: 2 jours ouvrés.",
    time: "Il y a 3h",
    unread: false,
    type: "alert",
    priority: "high",
    selected: false,
  },
  {
    id: 5,
    title: "Stock faible",
    message:
      "Article XYZ123 - Stock critique (5 unités restantes). Réapprovisionnement recommandé.",
    time: "Il y a 4h",
    unread: false,
    type: "alert",
    priority: "medium",
    selected: false,
  },
];

export default function HeaderNotification() {
  const [notificationList, setNotificationList] = useState(notifications);
  const [filter, setFilter] = useState("all");
  const unreadCount = notificationList.filter((n) => n.unread).length;

  const filteredNotifications = notificationList.filter((notification) => {
    if (filter === "unread") return notification.unread;
    if (filter === "read") return !notification.unread;
    if (filter !== "all") return notification.type === filter;
    return true;
  });

  const markAsRead = (id: number) => {
    setNotificationList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleSelection = (id: number) => {
    setNotificationList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, selected: !n.selected } : n))
    );
  };

  const selectedCount = notificationList.filter((n) => n.selected).length;

  const deleteSelected = () => {
    setNotificationList((prev) => prev.filter((n) => !n.selected));
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      order: "Commande",
      delivery: "Livraison",
      payment: "Paiement",
      alert: "Alerte",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "outline";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-transparent focus:hover:bg-transparent">
          <div className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <div
                className="bg-destructive  absolute -top-3 -right-3 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
              >
                {unreadCount}
              </div>
            )}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:min-w-4xl max-h-[80vh]">
        <DialogHeader className="my-4">
          <DialogTitle className="flex items-center justify-between" asChild>
            <div>
              <h1 className="section-title">Centre de notifications</h1>
              <Badge variant="warning">{unreadCount} non lues</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Actions Bar */}
          <div className="flex  flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex justify-between lg:justify-start items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="unread">Non lues</SelectItem>
                  <SelectItem value="read">Lues</SelectItem>
                  <SelectItem value="order">Commandes</SelectItem>
                  <SelectItem value="delivery">Livraisons</SelectItem>
                  <SelectItem value="payment">Paiements</SelectItem>
                  <SelectItem value="alert">Alertes</SelectItem>
                </SelectContent>
              </Select>

              {selectedCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedCount} sélectionnée(s)
                  </span>
                  <Button size="sm" variant="outline" onClick={deleteSelected}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              )}
            </div>

            <Button size="sm" variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-1" />
              Tout marquer comme lu
            </Button>
          </div>

          {/* Notifications List */}
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border hover:bg-accent/10 transition-colors ${
                    notification.unread
                      ? "bg-accent/10 border-accent"
                      : "bg-card"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={notification.selected}
                      onCheckedChange={() => toggleSelection(notification.id)}
                      className="mt-1"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-sm">
                            {notification.title}
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {getTypeLabel(notification.type)}
                          </Badge>
                          <Badge
                            variant={getPriorityColor(notification.priority)}
                          >
                            {notification.priority}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Marquer comme lu
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="h-4 w-4 mr-2" />
                                Archiver
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
