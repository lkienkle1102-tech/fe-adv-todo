export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-b from-primary/10 via-background to-background p-8">
      {children}
    </div>
  )
}
