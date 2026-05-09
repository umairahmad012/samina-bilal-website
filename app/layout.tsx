import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPortrait } from "@/lib/contentLoader";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Samina Bilal | Northern Virginia & Maryland Real Estate",
  description:
    "Make yourself at home. Samina Bilal is a licensed Realtor with RE/MAX Galaxy serving Virginia and Maryland — Woodbridge, Stafford, Lorton, Ashburn, Manassas, Dumfries.",
  openGraph: {
    title: "Samina Bilal | Northern Virginia & Maryland Real Estate",
    description:
      "Make yourself at home. Boutique real estate representation across Virginia and Maryland.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the portrait once at the layout level so Header/Footer/Logo/MenuDrawer
  // (all client components) can render the right image without each fetching.
  const portrait = await getPortrait();

  return (
    <html lang="en" className={montserrat.variable}>
      <body>
        <Header portraitAvatar={portrait.avatar} />
        <main>{children}</main>
        <Footer portraitAvatar={portrait.avatar} />
      </body>
    </html>
  );
}
