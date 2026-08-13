import type { Metadata } from "next";
import { Fraunces, Work_Sans, Caveat } from "next/font/google";
import { LoginModalProvider } from "@/components/home/LoginModalProvider";
import { SITE_URL, SITE_NAME } from "@/content/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin", "latin-ext"],
  weight: ["600"],
  variable: "--font-caveat",
  display: "swap",
});

const title = "4FF Nieruchomości — Biuro nieruchomości Łódzkie";
const description =
  "Rodzinne biuro nieruchomości działające na terenie województwa łódzkiego. Sprzedaż i zakup nieruchomości bez stresu i zbędnych formalności.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: SITE_NAME,
    locale: "pl_PL",
    type: "website",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${workSans.variable} ${caveat.variable}`}
    >
      <body>
        <LoginModalProvider>{children}</LoginModalProvider>
      </body>
    </html>
  );
}
