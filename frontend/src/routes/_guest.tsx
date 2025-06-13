import { createFileRoute, Outlet } from '@tanstack/react-router'
import authImage from "@/assets/auth-image.jpg";
import AppLogo from "@/components/ui/quebec/AppLogo";

export const Route = createFileRoute('/_guest')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 w-full">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <AppLogo />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-4xl"><Outlet /></div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={authImage}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
