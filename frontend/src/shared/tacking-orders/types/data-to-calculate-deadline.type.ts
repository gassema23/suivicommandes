
export type DataToCalculateDeadline = {
  requestTypeServiceCategoryId: string;
  requestTypeDelayId?: string;
};

export type RequestTypeDataToCalculateDeadline = {
  availableDelay: number;
  isAutoCalculate: boolean;
  isConformity: boolean;
  isMultiLink: boolean;
  isMultiProvider: boolean;
  isRequiredExpertise: boolean;
  minimumRequiredDelay: number;
  sectorClientTimeEnd: string;
  sectorProviderTimeEnd: string;
  serviceActivationDelay: number;
};
