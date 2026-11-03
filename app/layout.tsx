import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LAST NIGHT OF THE YEAR GIRLS",
  description: "Последняя большая ночь этого года. Только девочки, красивые образы и истории, которые останутся с нами. 19 декабря 2026, Санкт-Петербург.",
  openGraph: {
    title: "LAST NIGHT OF THE YEAR GIRLS",
    description: "Закрытая девичья вечеринка · 19 декабря 2026 · Санкт-Петербург",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Dancing+Script:wght@400;600;700&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
