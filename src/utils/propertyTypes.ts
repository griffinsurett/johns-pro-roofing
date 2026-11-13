// src/utils/propertyTypes.ts
/**
 * The kinds of home a residential service page can speak to. One definition,
 * shared by the content schema (offerings `propertyTypes`, the comparison
 * column ids), OfferingsVariant's filter, OfferingCard's labels and ComparisonVariant's highlight.
 *
 * The id doubles as the URL hash (/services/home-remodeling#condo) and the
 * value the bottom form's `homeType` question is prefilled with is `label`.
 */
export const PROPERTY_TYPE_IDS = ["house", "townhouse", "condo"] as const;

export type PropertyTypeId = (typeof PROPERTY_TYPE_IDS)[number];

export const PROPERTY_TYPES: Record<PropertyTypeId, { label: string; plural: string }> = {
  house: { label: "House", plural: "Houses" },
  townhouse: { label: "Townhouse", plural: "Townhouses" },
  condo: { label: "Condo", plural: "Condos" },
};
