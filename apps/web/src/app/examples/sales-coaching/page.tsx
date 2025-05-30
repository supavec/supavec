import SalesCoachingClient from "./sales-coaching-client";

export const metadata = {
  title: "Sales Coaching AI Example",
  description:
    "Upload a call transcript to get instant coaching insights powered by Supavec RAG.",
  alternates: {
    canonical: "/examples/sales-coaching",
  },
};

export default function SalesCoachingExample() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sales Coaching AI Example</h1>
        <p className="text-muted-foreground">
          Upload a call transcript or paste a Fireflies URL to get instant
          coaching insights powered by Supavec RAG.
        </p>
      </div>

      <SalesCoachingClient />
    </div>
  );
}
