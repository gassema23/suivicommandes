import { z } from "zod";

export const trackingOrderSchema = z.object({
  requisitionTypeId: z
    .string()
    .min(1, "Le type de réquisition est requis")
    .uuid("Le format du type de réquisition est invalide"),

  clientId: z
    .string()
    .min(1, "Le client est requis")
    .uuid("Le format du client est invalide"),

  subdivisionClientId: z
    .string()
    .min(1, "La subdivision du client est requise")
    .uuid("Le format de la subdivision du client est invalide"),

  order_number: z.string().min(1, "Le numéro de commande est requis"),
  requisition_number: z.string().min(1, "Le numéro de réquisition est requis"),

  sectorId: z
    .string()
    .min(1, "Le secteur est requis")
    .uuid("Le format du secteur est invalide"),

  serviceId: z
    .string()
    .min(1, "Le service est requis")
    .uuid("Le format du service est invalide"),

  serviceCategoryId: z
    .string()
    .min(1, "La catégorie de service est requise")
    .uuid("Le format de la catégorie de service est invalide"),

  requestTypeServiceCategoryId: z
    .string()
    .min(1, "Le type de demande est requis")
    .uuid("Le format du type de demande est invalide"),

  requestTypeDelayId: z
    .string()
    .uuid("Le format du délai est invalide")
    .optional()
    .or(z.literal("")),

  order_registration_at: z
    .string()
    .min(1, "La date d'enregistrement est requise")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),

  order_registration_time: z
    .string()
    .min(1, "L'heure d'enregistrement est requise")
    .regex(/^\d{2}:\d{2}$/, "Format d'heure invalide (HH:MM)"),
});

export type TrackingOrderFormData = z.infer<typeof trackingOrderSchema>;
