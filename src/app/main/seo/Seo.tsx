import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  jsonLd?: object | object[];
  children?: React.ReactNode;
  keywords?: string[];
  robots?: string;
}

export default function Seo({
  title,
  description,
  url,
  image,
  jsonLd,
  children,
  keywords,
  robots,
}: SeoProps) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />

        <meta name="robots" content={robots ?? "index, follow"} />
        <link rel="canonical" href={url} />
        <link rel="alternate" hrefLang="x-default" href={url} />

        {image && <meta property="og:image" content={image} />}
        {image && <meta property="og:image:secure_url" content={image} />}
        {image && <meta property="og:image:width" content="512" />}
        {image && <meta property="og:image:height" content="512" />}
        {image && <meta property="og:image:type" content="image/png" />}
        {image && <meta property="og:image:alt" content={title} />}

        {keywords && keywords.length > 0 && (
          <meta name="keywords" content={keywords.join(", ")} />
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@futballero" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {image && <meta name="twitter:image" content={image} />}
        {image && <meta name="twitter:image:alt" content={title} />}

        {jsonLd &&
          (Array.isArray(jsonLd) ? (
            jsonLd.map((schema, i) => (
              <script key={i} type="application/ld+json">
                {JSON.stringify(schema)}
              </script>
            ))
          ) : (
            <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
          ))}
      </Helmet>
      {children}
    </>
  );
}
