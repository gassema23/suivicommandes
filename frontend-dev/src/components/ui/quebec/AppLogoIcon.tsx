import { HTMLAttributes } from "react";

export default function AppLogoIcon(props: HTMLAttributes<HTMLSpanElement>) {
  return (
    <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center shadow shrink-0 tracking-tight text-xl">
      <span {...props}>SC</span>
    </div>
  );
}
