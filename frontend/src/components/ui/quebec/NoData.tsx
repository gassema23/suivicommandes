import NoDataIcon from "./NoDataIcon";

export default function NoData(
  props: React.PropsWithChildren<{ withImage?: boolean }>
) {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <NoDataIcon withImage={props.withImage} />
      <h2 className="text-foreground text-center font-bold text-sm">
        Aucune donnée disponible
      </h2>
      <p className="mt-1 text-sm text-muted-foreground text-center">
        {props.children
          ? props.children
          : "Il n'y a pas de données à afficher pour le moment."}
      </p>
    </div>
  );
}
