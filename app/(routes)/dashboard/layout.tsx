export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="w-full flex-1">
        <div>{children}</div>
      </div>
    </div>
  );
}