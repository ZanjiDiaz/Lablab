import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const ppMori = localFont({
  src: [
    {
      path: '../../public/font/PPMori-Extralight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/font/PPMori-ExtralightItalic.otf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../../public/font/PPMori-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/font/PPMori-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/font/PPMori-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/font/PPMori-SemiBoldItalic.otf',
      weight: '600',
      style: 'italic',
    },
  ],
  variable: "--font-ppmori",
});

export const metadata: Metadata = {
  title: "🎁 Happy Birthday, Love!",
  description: "A special birthday message for you",
  icons: {
    icon: {
      url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍉</text></svg>',
      type: 'image/svg+xml',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ppMori.variable} font-ppmori antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
