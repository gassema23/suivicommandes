import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";

export function FormHeaderActions() {
  const handleDownload = () => {
    // TODO: Implémenter le téléchargement
    console.log("Download clicked");
  };

  const handlePrint = () => {
    // TODO: Implémenter l'impression
    console.log("Print clicked");
  };

  return (
    <div className="flex items-center justify-end mb-4 gap-x-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleDownload}
        type="button"
      >
        <Download />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={handlePrint}
        type="button"
      >
        <Printer />
      </Button>
    </div>
  );
}