import { ArchiveClient } from "@/components/ArchiveClient";

export const metadata = {
  title: "Reflection Archive | Hikma",
  description: "Revisit your journey and trace your inner themes.",
};

export default function ArchivePage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl text-primary mb-2">
          The Reflection Ledger
        </h1>
        <p className="text-lg text-muted-foreground">
          Trace your movement and recognize recurring inner themes.
        </p>
      </div>
      <ArchiveClient />
    </div>
  );
}
