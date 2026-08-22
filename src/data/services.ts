import type { ImageMetadata } from "astro";
import ear from "../assets/services/ear.png";
import nose from "../assets/services/nose.png";
import belly from "../assets/services/belly.png";
import eyebrow from "../assets/services/eyebrow.png";

export interface Service {
  id: string;
  name: string;
  blurb: string;
  image: ImageMetadata;
  alt: string;
}

export const services: Service[] = [
  {
    id: "ear",
    name: "Ear",
    blurb: "Lobes, helix, and stacked work.",
    image: ear,
    alt: "Gold conch star stud with a connecting helix chain and lobe piercing.",
  },
  {
    id: "nose",
    name: "Nose",
    blurb: "Nostril, septum, and bridge.",
    image: nose,
    alt: "Paired nostril jewellery with a connecting chain and an ornate septum piece.",
  },
  {
    id: "belly",
    name: "Belly",
    blurb: "Navel jewellery and placements.",
    image: belly,
    alt: "Fresh navel piercing with a curved barbell and prong-set gemstones.",
  },
  {
    id: "eyebrow",
    name: "Eyebrow",
    blurb: "Vertical and horizontal brow.",
    image: eyebrow,
    alt: "Vertical eyebrow piercing with a silver barbell above the eyelid.",
  },
];
