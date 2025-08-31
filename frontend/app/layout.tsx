import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'PC Build Guides - Custom PC Building Made Easy',
  description: 'Build your perfect PC with our interactive configurator, compatibility checker, and comprehensive build guides. Expert recommendations for gaming, workstation, and budget builds.',
  keywords: 'PC building, custom PC, gaming PC, workstation, computer parts, compatibility checker',
  authors: [{ name: 'PC Build Guides Team' }],
  creator: 'PC Build Guides',
  publisher: 'PC Build Guides',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'PC Build Guides - Custom PC Building Made Easy',
    description: 'Build your perfect PC with our interactive configurator and compatibility checker.',
    siteName: 'PC Build Guides',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PC Build Guides - Custom PC Building Made Easy',
    description: 'Build your perfect PC with our interactive configurator and compatibility checker.',
    creator: '@pcbuildguides',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-secondary-50 antialiased">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-secondary-900 text-white py-12 mt-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">PC Build Guides</h3>
                <p className="text-secondary-300 mb-4">
                  Your ultimate resource for building custom PCs. From beginner guides to advanced configurations, we help you build the perfect computer for your needs.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="/guides" className="text-secondary-300 hover:text-white transition-colors">Build Guides</a></li>
                  <li><a href="/configurator" className="text-secondary-300 hover:text-white transition-colors">PC Configurator</a></li>
                  <li><a href="/components" className="text-secondary-300 hover:text-white transition-colors">Components</a></li>
                  <li><a href="/compatibility" className="text-secondary-300 hover:text-white transition-colors">Compatibility</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><a href="/contact" className="text-secondary-300 hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="/faq" className="text-secondary-300 hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="/community" className="text-secondary-300 hover:text-white transition-colors">Community</a></li>
                  <li><a href="/privacy" className="text-secondary-300 hover:text-white transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-secondary-800 mt-8 pt-8 text-center">
              <p className="text-secondary-400">
                © 2024 PC Build Guides. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
