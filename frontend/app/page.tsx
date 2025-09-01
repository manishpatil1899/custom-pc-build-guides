import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Build Your Perfect PC
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90 leading-relaxed">
            Interactive configurator with real-time compatibility checking and expert guides for every budget
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/configurator">
            <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-white/20 font-semibold px-8 py-4"
              >
                Start Building
              </Button>
            </Link>
            <Link href="/guides">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-black hover:bg-white/20 font-semibold px-8 py-4"
              >
                Explore Guides
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Why Choose PC Build Guides?
          </h2>
          <p className="text-lg text-center mb-12 text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform makes PC building accessible to everyone, from first-time builders to enthusiasts.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary-600">🔧</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Interactive Configurator
              </h3>
              <p className="text-gray-600">
                Step-by-step component selection with live compatibility checks and dynamic pricing.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary-600">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Smart Compatibility
              </h3>
              <p className="text-gray-600">
                Advanced logic ensures every component works together before you finalize your build.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary-600">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Expert Guides
              </h3>
              <p className="text-gray-600">
                In-depth tutorials and best-practice tips from seasoned builders to guide you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
);
}
