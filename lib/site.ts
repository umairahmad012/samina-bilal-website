// Single source of truth for site-wide content. Edit here, it updates everywhere.

export const site = {
  name: "Samina Bilal",
  tagline: "Make Yourself at Home",
  brokerage: "RE/MAX Galaxy",
  phone: "(703) 973-7036",
  phoneHref: "tel:+17039737036",
  email: "samina@saminarealtor.com", // placeholder — confirm
  emailHref: "mailto:samina@saminarealtor.com",
  office: {
    street: "4500 Pond Way, Suite #100",
    cityStateZip: "Woodbridge, VA 22192",
  },
  licenses: {
    va: "0225256757",
    md: "[license pending]",
  },
  social: {
    instagram: "https://www.instagram.com/homewithsamina/",
    facebook: "https://www.facebook.com/SaminaBilalRealtor/",
    tiktok: "https://www.tiktok.com/@samina.realtor",
  },
};

export const nav = [
  { label: "About", href: "/about" },
  {
    label: "Communities",
    href: "/communities",
    children: [
      { label: "Woodbridge", href: "/communities/woodbridge" },
      { label: "Dumfries", href: "/communities/dumfries" },
      { label: "Ashburn", href: "/communities/ashburn" },
      { label: "Lorton", href: "/communities/lorton" },
      { label: "Stafford", href: "/communities/stafford" },
      { label: "Manassas", href: "/communities/manassas" },
    ],
  },
  { label: "Path to Ownership", href: "/path-to-ownership" },
  { label: "Recent Closings", href: "/closings" },
  { label: "Sellers", href: "/sellers" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export const heroStats = [
  { value: "5.0★", label: "Across Zillow, Google & Realtor.com" },
  { value: "42+", label: "Five-Star Client Reviews" },
  { value: "2", label: "States Licensed (VA & MD)" },
];
