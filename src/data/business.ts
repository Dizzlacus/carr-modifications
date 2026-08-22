export const business = {
  name: "Carr Modifications",
  legalName: "Carr Modifications",
  tagline: "PIERCING ARTIST",
  kicker: "Body piercing artist.",
  description:
    "Carr Modifications is a piercing studio. Hours, location, and booking details are stand-ins until the studio is ready to publish.",
  telephone: "00000 000000",
  email: "hello@example.com",
  instagram: {
    handle: "@handle-tbd",
    url: "https://www.instagram.com/",
  },
  address: {
    streetAddress: "Studio TBD",
    addressLocality: "City TBD",
    postalCode: "00000",
    addressCountry: "GB",
  },
  mapsUrl: "https://www.google.com/maps",
  artist: {
    name: "Artist TBD",
    bio: "Artist name and bio are stand-ins until the piercer profile is ready to publish.",
  },
} as const;

export const businessInstagram = business.instagram;
