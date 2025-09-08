export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-screen-2xl">
        {children}
      </div>
    </main>
  );
}
