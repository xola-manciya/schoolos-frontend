import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  canonical?: string
}

export function SEO({
  title = 'SchoolOS - Modern School Management Platform',
  description = 'Streamline your school operations with SchoolOS. Comprehensive school management system for student records, staff management, payment tracking, and reporting.',
  keywords = 'school management system, student management software, staff management, school administration, education software',
  ogImage = 'https://schoolos.pages.dev/og-image.png',
  canonical,
}: SEOProps) {
  const fullTitle = title.includes('SchoolOS') ? title : `${title} | SchoolOS`
  const url = canonical || 'https://schoolos.pages.dev'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  )
}
