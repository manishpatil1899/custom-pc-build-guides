import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Build Your Perfect PC
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Interactive configurator with real-time compatibility checking and expert guides for every budget
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/configurator">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 text-lg">
                  Start Building
                </Button>
              </Link>
              <Link href="/guides">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg">
                  Browse Guides
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Why Choose PC Build Guides?
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Our comprehensive platform makes PC building accessible to everyone, from first-time builders to enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold mb-4">Interactive Configurator</h3>
              <p className="text-secondary-600">
                Step-by-step component selection with real-time compatibility checking and price tracking.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-4">Compatibility Checker</h3>
              <p className="text-secondary-600">
                Automated validation ensures all your components work together perfectly.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-4">Expert Guides</h3>
              <p className="text-secondary-600">
                Comprehensive tutorials for every skill level and use case.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-4">Price Optimization</h3>
              <p className="text-secondary-600">
                Find the best deals and optimize your build for any budget.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-4">Community Builds</h3>
              <p className="text-secondary-600">
                Share your builds and get inspiration from the community.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-4">Mobile Friendly</h3>
              <p className="text-secondary-600">
                Access all features on any device, anywhere.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Build Categories */}
      <section className="py-20 bg-secondary-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Popular Build Categories
            </h2>
            <p className="text-xl text-secondary-600">
              Find the perfect configuration for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-4">🎮</div>
                <h3 className="font-semibold mb-2">Gaming</h3>
                <p className="text-sm text-secondary-600 mb-4">High-performance builds for 1080p to 4K gaming</p>
                <p className="text-sm font-medium text-primary-600">From $800</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-4">💼</div>
                <h3 className="font-semibold mb-2">Workstation</h3>
                <p className="text-sm text-secondary-600 mb-4">Professional builds for content creation</p>
                <p className="text-sm font-medium text-primary-600">From $1200</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-4">💰</div>
                <h3 className="font-semibold mb-2">Budget</h3>
                <p className="text-sm text-secondary-600 mb-4">Great performance without breaking the bank</p>
                <p className="text-sm font-medium text-primary-600">From $500</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-4">🏢</div>
                <h3 className="font-semibold mb-2">Office</h3>
                <p className="text-sm text-secondary-600 mb-4">Efficient builds for productivity tasks</p>
                <p className="text-sm font-medium text-primary-600">From $400</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Build Your Dream PC?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Start with our interactive configurator or browse our comprehensive guides
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/configurator">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4">
                  Launch Configurator
                </Button>
              </Link>
              <Link href="/builds">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4">
                  View Sample Builds
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">10,000+</div>
              <div className="text-secondary-600">PC Components</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-secondary-600">Build Guides</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">25,000+</div>
              <div className="text-secondary-600">Community Builds</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">99.9%</div>
              <div className="text-secondary-600">Compatibility Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
