export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-6xl rounded-lg bg-white lg:p-8 shadow">
        {children}
      </div>
    </div>
  );
}