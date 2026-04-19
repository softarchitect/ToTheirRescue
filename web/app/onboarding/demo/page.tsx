import { redirect } from "next/navigation"

export default function OnboardingDemoRedirectPage() {
  redirect("/onboarding?onboardingMode=guided")
}
