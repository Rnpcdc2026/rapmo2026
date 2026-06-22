import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Rencontres Annuelles Patrimoine et Maîtrise d'Ouvrage 2026 — CDC Habitat",
  description: 'Inscription au séminaire patrimoine Groupe des 8 & 9 octobre 2026 à Lyon.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anek+Latin:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
