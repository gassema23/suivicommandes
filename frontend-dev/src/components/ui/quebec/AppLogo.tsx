import AppLogoIcon from "./AppLogoIcon";

export default function AppLogo() {
    return (
        <div className="flex items-center">
            <div className="">
                <AppLogoIcon />
            </div>
            <div className="ml-1 grid flex-1">
                <span className="text-2xl leading-none font-bold tracking-tight">
                    Suivi<span className="text-primary">Commandes</span>
                </span>
            </div>
        </div>
    );
}
