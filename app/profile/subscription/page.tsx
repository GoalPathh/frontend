import { SubscriptionSettings } from "@/components/profile/subscription-settings";

type SubscriptionPageProps = {
  searchParams: Promise<{ upgrade?: string | string[] }>;
};

export default async function SubscriptionPage({ searchParams }: SubscriptionPageProps) {
  const query = await searchParams;
  const upgrade = Array.isArray(query.upgrade) ? query.upgrade[0] : query.upgrade;
  return <SubscriptionSettings upgradeStatus={upgrade} />;
}
