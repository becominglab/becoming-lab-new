import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ConditionalShell from "@/components/ConditionalShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://becominglab.life"),
  title: {
    default: "becoming lab | 更新を重ねる人生を",
    template: "%s | becoming lab",
  },
  description:
    "人生の途中にいる人が、自分の物語を語り、次の一歩を見つけていくための対話の場です。東京・神田錦町を拠点に、会う・整う・更新するを重ねています。",
  applicationName: "becoming lab",
  authors: [{ name: "大塚貴生" }, { name: "大塚昌代" }],
  creator: "becoming lab",
  publisher: "becoming lab",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://becominglab.life",
    siteName: "becoming lab",
    title: "becoming lab | 更新を重ねる人生を",
    description:
      "人は、いつからでも選び直せる。仲間がいれば、何度でも。東京・神田で、会う・整う・更新するを重ねているコミュニティです。",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "becoming lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "becoming lab | 更新を重ねる人生を",
    description: "人は、いつからでも選び直せる。仲間がいれば、何度でも。",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "grgFKqkwOPmHyXiBsIxG8o3Upo0FlbVa28IEjgc84jo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3XBHKC5RLM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3XBHKC5RLM');
          `}
        </Script>
      </head>
      <body className="antialiased bg-white text-gray-800 font-sans">
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
