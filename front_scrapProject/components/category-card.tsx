import Link from "next/link"

interface CategoryCardProps {
  icon: string
  title: string
  subtitle: string
  href: string
}

export function CategoryCard({ icon, title, subtitle, href }: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group block p-6 bg-card border border-border rounded-lg hover:border-primary hover:shadow-lg transition-all duration-300"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-4 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Explore →
      </div>
    </Link>
  )
}
