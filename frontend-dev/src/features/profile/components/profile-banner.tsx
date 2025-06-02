import { Button } from "@/components/ui/quebec/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/quebec/Card";
import {
  AvatarImage,
  Avatar,
  AvatarFallback,
} from "@/components/ui/shadcn/avatar";

interface UserType {
  data: {
    initials: string;
    fullName: string;
    email: string;
  };
}

export default function ProfileBanner({ data }: UserType) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Avatar" />
          <AvatarFallback>{data.initials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{data.fullName}</CardTitle>
          <CardDescription>{data.email}</CardDescription>
        </div>
        <Button className="ml-auto" size="sm" variant="outline">
          Modifier la photo
        </Button>
      </CardHeader>
    </Card>
  );
}
