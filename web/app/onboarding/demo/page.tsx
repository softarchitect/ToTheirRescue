import { redirect } from "next/navigation"

export default function OnboardingDemoRedirectPage() {
  redirect("/onboarding?demo=1")
}
