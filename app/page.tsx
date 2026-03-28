import { HomeCtaSection } from "@/components/home/home-cta-section"
import { HomeFeaturesSection } from "@/components/home/home-features-section"
import { HomeFooter } from "@/components/home/home-footer"
import { HomeHeader } from "@/components/home/home-header"
import { HomeHeroSection } from "@/components/home/home-hero-section"
import { HomeProcessSection } from "@/components/home/home-process-section"

export default function Page() {
  return (
    <main className="carbon-page">
      <HomeHeader />
      <HomeHeroSection />
      <HomeFeaturesSection />
      <HomeProcessSection />
      <HomeCtaSection />
      <HomeFooter />
    </main>
  )
}
