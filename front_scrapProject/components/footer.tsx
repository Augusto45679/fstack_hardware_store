import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">HardwareTrack</h3>
            <p className="text-sm text-muted-foreground">
              Track hardware prices and make informed purchasing decisions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <div className="space-y-2 text-sm">
              <Link href="#" className="block hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Comparison
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-sm">
              <Link href="#" className="block hover:text-primary transition-colors">
                About
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="#" className="block hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="space-y-2 text-sm">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-primary transition-colors"
              >
                GitHub
              </a>
              <a href="mailto:info@hardwaretrack.com" className="block hover:text-primary transition-colors">
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted-foreground text-center">© 2025 HardwareTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
