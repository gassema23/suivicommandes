import { Slider } from "@/components/ui/shadcn/slider";

interface DateSliderProps {
  value: number | number[];
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
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 jour</span>
              <span>90 jours</span>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="text-sm text-muted-foreground text-end">
            <span className="font-bold text-primary">{sliderValue[0]}</span>{" "}
            jour{sliderValue[0] > 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </>
  );
}
