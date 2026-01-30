export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  description: string;
}

export interface SponsorTier {
  name: string;
  price: string;
  color: string;
  features: string[];
  isPopular?: boolean;
}

export interface BoothTier {
  name: string;
  price: string;
  dimensions: string;
  features: string[];
}

export interface SponsorLogo {
  id: number;
  name: string;
  url: string; // Using picsum or placeholder
}