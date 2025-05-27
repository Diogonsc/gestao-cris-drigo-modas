import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
}

export function SEO({
  title,
  description = "Sistema de Gestão Cris Drigo Modas - Gerenciamento completo para sua loja",
  keywords = ["moda", "gestão", "loja", "vendas", "cupom fiscal"],
  image = "/logo.png",
  url = "https://crisdrigomodas.com.br",
  type = "website",
}: SEOProps) {
  const siteTitle = "Cris Drigo Modas";

  return (
    <Helmet>
      {/* Basic */}
      <title>{`${title} | ${siteTitle}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={`${title} | ${siteTitle}`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | ${siteTitle}`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Favicon */}
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* PWA */}
      <meta name="theme-color" content="#ffffff" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Helmet>
  );
}
