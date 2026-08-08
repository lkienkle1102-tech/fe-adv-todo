export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#f7f9ff] p-4 py-16 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#6574d50a_1px,transparent_1px),linear-gradient(to_bottom,#6574d50a_1px,transparent_1px)] bg-[size:44px_44px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-24 size-[32rem] rounded-full bg-[#b9efff]/50 blur-3xl"
      />
      {children}
    </div>
  )
}
