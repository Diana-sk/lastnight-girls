import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_ADMIN_URL || "https://lastnight-girls.ru"),
  title: "LAST NIGHT OF THE YEAR GIRLS · Закрытая новогодняя вечеринка в Санкт-Петербурге",
  description:
    "Последняя большая ночь этого года. Только девушки, роскошные образы, ролевая игра, подарок от организатора и шампанское. 19 декабря 2026, Санкт-Петербург.",
  openGraph: {
    title: "LAST NIGHT OF THE YEAR GIRLS",
    description: "Закрытый девичник · 19 декабря 2026 · Санкт-Петербург · 15 мест",
    type: "website",
    images: [
      {
        url: "/images/poster.jpg",
        width: 682,
        height: 1024,
        alt: "Last Night of the Year Girls Poster",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;0,6..96,700;0,6..96,900;1,6..96,400;1,6..96,600;1,6..96,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600;1,700&family=Marck+Script&family=Caveat:wght@400;500;600;700&family=Praise&family=Smooch&family=Inter:wght@300;400;500;600;700&display=swap&subset=cyrillic,cyrillic-ext,latin"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#090708] text-[#F9F6F0] selection:bg-[#7A0C1E] selection:text-white">
        {children}
      </body>
    </html>
  );
}
