import { redirect } from "next/navigation";

type LegacyMePageProps = {
  searchParams: Promise<{ upgrade?: string | string[] }>;
};

export default async function LegacyMePage({ searchParams }: LegacyMePageProps) {
  const query = await searchParams;
  const upgrade = Array.isArray(query.upgrade) ? query.upgrade[0] : query.upgrade;
  if (upgrade === "success" || upgrade === "pending" || upgrade === "failed") {
    redirect(`/profile/subscription?upgrade=${upgrade}`);
  }
  redirect("/profile");
}
