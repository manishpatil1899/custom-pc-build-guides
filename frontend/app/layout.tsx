import './globals.css';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PC Build Guides - Build Your Perfect PC',
  description: 'Interactive PC configurator with real-time compatibility checking and expert guides.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">PC Build Guides</h3>
                <p className="text-gray-400">
                  Making PC building accessible to everyone with expert guidance and smart tools.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Tools</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/configurator" className="hover:text-white">PC Configurator</a></li>
                  <li><a href="/components" className="hover:text-white">Component Database</a></li>
                  <li><a href="/builds" className="hover:text-white">Build Gallery</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Learn</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/guides" className="hover:text-white">Build Guides</a></li>
                  <li><a href="/guides?difficulty=beginner" className="hover:text-white">Beginner Guides</a></li>
                  <li><a href="/guides?difficulty=advanced" className="hover:text-white">Advanced Tips</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/contact" className="hover:text-white">Contact</a></li>
                  <li><a href="/faq" className="hover:text-white">FAQ</a></li>
                  <li><a href="/help" className="hover:text-white">Help Center</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 PC Build Guides. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
