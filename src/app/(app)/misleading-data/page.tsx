import { FalseRumorsFeed } from "@/components/tracker/false-rumors-feed";

export default function MisleadingDataPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Misleading Data Feed</h1>
        <p className="text-muted-foreground">
          A live feed of all claims identified as misinformation across the platform.
        </p>
      </div>
      <FalseRumorsFeed />
    </div>
  );
}
