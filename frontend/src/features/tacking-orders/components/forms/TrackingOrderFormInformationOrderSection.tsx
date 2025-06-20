import FormTitle from "../FormTitle";

export default function TrackingOrderFormInformationOrderSection() {
  return (
    <div>
      <FormTitle title="Informations" />
      <div className="grid grid-cols-12 w-full gap-4 px-4 py-2 divide-x">
        <div className="col-span-12 xl:col-span-4">
          <div className="font-medium">Section #1</div>
          <p className="text-sm text-muted-foreground">
            This is the first section of the form.
          </p>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <div className="font-medium">Section #2</div>
          <p className="text-sm text-muted-foreground">
            This is the second section of the form.
          </p>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <div className="font-medium">Section #3</div>
          <p className="text-sm text-muted-foreground">
            This is the third section of the form.
          </p>
        </div>
      </div>
    </div>
  );
}
