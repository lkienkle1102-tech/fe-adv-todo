import type { Metadata } from "next"

import { HomePage } from "@/features/home/components/home-page"
import { JsonLd } from "@/features/seo/components/json-ld"
import { createSeoMetadata } from "@/features/seo/create-seo-metadata"
import { getLocalizedUrl } from "@/features/seo/site-config"
import { locales, type Locale } from "@/i18n/locales"

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale
  const { title, description } = locales[locale].home.seo

  return createSeoMetadata({
    locale,
    title,
    description,
    path: "/",
  })
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale: localeParam } = await params
  const locale = localeParam as Locale
  const { description } = locales[locale].home.seo

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Advanced Todo",
          url: getLocalizedUrl(locale, "/").href,
          description,
          inLanguage: locale,
        }}
      />
      <HomePage />
    </>
  )
}
