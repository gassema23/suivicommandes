export default function UserInformationCard({
  icon: Icon,
  information,
}: {
  icon: React.ElementType;
  information: string;
}) {
  if (!information) return null;
  return (
    <div className="grid grid-cols-12 items-center gap-8">
      <div className="col-span-1 text-muted-foreground">
        <Icon className="inline-block w-5 h-5" />
      </div>
      <div className="text-sm text-muted-foreground col-span-11 mt-1">
        {information}
      </div>
    </div>
  );
}
