// src/utils/addressValidation.ts

export interface AddressValidationErrors {
  recipientName?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  additionalInfo?: string;
  state?: string;
}

export interface AddressFormData {
  recipientName: string;
  street: string;
  additionalInfo?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// Common countries for quick selection
export const commonCountries = [
  'Spain',
  'United States',
  'United Kingdom',
  'France',
  'Germany',
  'Italy',
  'Portugal',
  'Netherlands',
  'Belgium',
  'Canada',
  'Australia',
  'Japan',
  'Mexico',
  'Brazil',
  'Argentina',
];

// Phone number validation regex (matches pattern from contract: ^[+]?[0-9\s-()]{7,20}$)
const PHONE_REGEX = /^[+]?[0-9\s\-()]{7,20}$/;

export const validateAddress = (data: AddressFormData): AddressValidationErrors => {
  const errors: AddressValidationErrors = {};

  // Required fields validation
  if (!data.recipientName?.trim()) {
    errors.recipientName = 'Recipient name is required';
  } else if (data.recipientName.length > 255) {
    errors.recipientName = 'Recipient name must not exceed 255 characters';
  }

  if (!data.street?.trim()) {
    errors.street = 'Street address is required';
  } else if (data.street.length > 255) {
    errors.street = 'Street address must not exceed 255 characters';
  }

  if (!data.city?.trim()) {
    errors.city = 'City is required';
  } else if (data.city.length > 100) {
    errors.city = 'City must not exceed 100 characters';
  }

  if (!data.postalCode?.trim()) {
    errors.postalCode = 'Postal code is required';
  } else if (data.postalCode.length > 20) {
    errors.postalCode = 'Postal code must not exceed 20 characters';
  }

  if (!data.country?.trim()) {
    errors.country = 'Country is required';
  } else if (data.country.length > 100) {
    errors.country = 'Country must not exceed 100 characters';
  }

  // Optional fields validation
  if (data.additionalInfo && data.additionalInfo.length > 500) {
    errors.additionalInfo = 'Additional info must not exceed 500 characters';
  }

  if (data.state && data.state.length > 100) {
    errors.state = 'State must not exceed 100 characters';
  }

  if (data.phone && data.phone.trim()) {
    if (!PHONE_REGEX.test(data.phone)) {
      errors.phone = 'Invalid phone format. Use: +1 234 567-8900 or similar';
    }
  }

  return errors;
};

// Helper to check if form has errors
export const hasValidationErrors = (errors: AddressValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

// Helper to format address for display
export const formatAddressDisplay = (address: {
  street: string;
  additionalInfo?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
}): string => {
  const parts = [
    address.street,
    address.additionalInfo,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
};
