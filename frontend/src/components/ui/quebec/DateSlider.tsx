import { Slider } from "@/components/ui/shadcn/slider";

interface DateSliderProps {
  value: number | number[] | null | undefined;
  onChange: (value: number) => void;
  name: string;
  max?: number;
}

export default function DateSlider({
  value,
  onChange,
  name,
  max = 90,
}: DateSliderProps) {
  const sliderValue = Array.isArray(value) ? value : [value ?? 1];

  const min = 0;
  return (
    <>
      <div className="grid items-start grid-cols-12 w-full gap-x-4">
        <div className="col-span-10">
          <div className="px-1">
            <Slider
              id={name}
              value={sliderValue}
              onValueChange={(arr) => onChange(arr[0])}
              max={max}
              min={min}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
              <span>{min} jour</span>
              <span>{max} jours</span>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="text-sm text-muted-foreground text-end flex items-center justify-end">
            <span className="font-bold text-primary mr-2">
              {sliderValue[0]}
            </span>
            <span>jour{sliderValue[0] > 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>
    </>
  );
}
