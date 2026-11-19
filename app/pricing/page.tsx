import { redirect } from "next/navigation";

type LegacyPricingPageProps = {
  searchParams: Promise<{ upgrade?: string | string[] }>;
};

export default async function LegacyPricingPage({ searchParams }: LegacyPricingPageProps) {
  const query = await searchParams;
  const upgrade = Array.isArray(query.upgrade) ? query.upgrade[0] : query.upgrade;
  if (upgrade === "success" || upgrade === "pending" || upgrade === "failed") {
    redirect(`/profile/subscription?upgrade=${upgrade}`);
  }
  redirect("/profile/subscription");
}
