import { AlertTriangle, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

type FormAlertVariant = "error" | "success" | "warning" | "info";

const variantStyles: Record<
  FormAlertVariant,
  { icon: React.ReactNode; bg: string; text: string }
> = {
  error: {
    icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
    bg: "bg-destructive/20",
    text: "text-destructive",
  },
  success: {
    icon: <CheckCircle2 className="h-6 w-6 text-success" />,
    bg: "bg-success/20",
    text: "text-success",
  },
  warning: {
    icon: <AlertCircle className="h-6 w-6 text-warning" />,
    bg: "bg-warning/20",
    text: "text-warning",
  },
  info: {
    icon: <Info className="h-6 w-6 text-info" />,
    bg: "bg-info/20",
    text: "text-info",
  },
};

export default function FormError({
  title,
  message,
  variant = "error",
}: {
  title: string;
  message: string;
  variant?: FormAlertVariant;
}) {
  const { icon, bg, text } = variantStyles[variant];
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={`border flex gap-4 my-4`}
    >
      <div
        className={`${bg} ${text} py-4 px-2 flex items-center justify-between w-fit`}
      >
        {icon}
      </div>
      <div className="py-4">
        <div className="font-semibold">{title}</div>
        <div className={`${text} text-sm`}>{message}</div>
      </div>
    </motion.div>
  );
}