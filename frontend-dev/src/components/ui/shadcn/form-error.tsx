import { AlertTriangle } from "lucide-react";

export default function FormError({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="border flex gap-4 my-4">
      <div className="bg-destructive/20 text-destructive py-4 px-2 flex items-center justify-between w-fit">
        <AlertTriangle className="inline h-6 w-6 text-destructive" />
      </div>
      <div className="py-4">
        <div className="font-semibold">{title}</div>
        <div className="text-destructive text-sm">{message}</div>
      </div>
    </div>
  );
}
