type PricingItemBase = {
  name: string;
  note?: string;
};

export type PricingItem =
  | (PricingItemBase & { amount: number })
  | (PricingItemBase & { pair: { single: number; both: number } });

export interface PricingCategory {
  id: string;
  name: string;
  items: PricingItem[];
}

export const pricingCategories: PricingCategory[] = [
  {
    id: "ear",
    name: "Ear piercings",
    items: [
      { name: "Ear lobes", note: "single or both", pair: { single: 30, both: 50 } },
      { name: "Helix", amount: 30 },
      { name: "Flat", amount: 30 },
      { name: "Conch", amount: 30 },
      { name: "Daith", amount: 32 },
      { name: "Tragus", amount: 32 },
      { name: "Rook", amount: 32 },
      { name: "Forward helix", amount: 32 },
    ],
  },
  {
    id: "body",
    name: "Body piercings",
    items: [
      { name: "Nipple", note: "single or both", pair: { single: 32, both: 55 } },
      { name: "Nostril", note: "single or both", pair: { single: 30, both: 50 } },
      { name: "Septum", amount: 35 },
      { name: "Navel", amount: 35 },
    ],
  },
  {
    id: "additional",
    name: "Additional services",
    items: [
      { name: "Install + upgrade jewellery", amount: 10 },
      { name: "Checkup / downsize", amount: 10 },
      { name: "Piercemed aftercare", amount: 10 },
    ],
  },
];

export const pricingNotes: string[] = [
  "Prices are set with standard jewellery.",
  "Jewellery upgrades available at an additional cost.",
  "All piercings are anatomy-dependent and require an anatomy consultation before piercing.",
];

export function formatItemPrice(item: PricingItem): string {
  if ("pair" in item) {
    return `£${item.pair.single} single / £${item.pair.both} both`;
  }

  return `£${item.amount}`;
}
