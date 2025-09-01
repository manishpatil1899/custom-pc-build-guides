'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { buildsAPI } from '@/lib/api';
import { formatPrice, formatDate, getUseCaseIcon } from '@/lib/utils';
import type { Build } from '@/lib/types';

export default function BuildsPage() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'date-desc' | 'date-asc'>('date-desc');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const itemsPerPage = 9;

  // Fetch builds
  useEffect(() => {
    const fetchBuilds = async () => {
      setIsLoading(true);
      try {
        const response = await buildsAPI.getAll();
        if (response.success && response.data) {
          setBuilds(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch builds:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuilds();
  }, []);

  // Get unique use cases
  const useCases = useMemo(() => {
    const unique = [...new Set(builds.map(build => build.useCase).filter(Boolean))];
    return ['all', ...unique];
  }, [builds]);

  // Filter and sort builds
  const filteredAndSortedBuilds = useMemo(() => {
    let filtered = [...builds];

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(build => 
        build.name.toLowerCase().includes(searchLower) ||
        build.description?.toLowerCase().includes(searchLower) ||
        build.user?.username?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by use case
    if (selectedUseCase !== 'all') {
      filtered = filtered.filter(build => build.useCase === selectedUseCase);
    }

    // Filter by price range
    if (priceRange.min) {
      const minPrice = Number(priceRange.min);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(build => {
          const price = typeof build.totalPrice === 'string' ? parseFloat(build.totalPrice) : build.totalPrice || 0;
          return !isNaN(price) && price >= minPrice;
        });
      }
    }

    if (priceRange.max) {
      const maxPrice = Number(priceRange.max);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(build => {
          const price = typeof build.totalPrice === 'string' ? parseFloat(build.totalPrice) : build.totalPrice || 0;
          return !isNaN(price) && price <= maxPrice;
        });
      }
    }

    // Sort builds
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc': {
          const priceA = typeof a.totalPrice === 'string' ? parseFloat(a.totalPrice) : a.totalPrice || 0;
          const priceB = typeof b.totalPrice === 'string' ? parseFloat(b.totalPrice) : b.totalPrice || 0;
          return priceA - priceB;
        }
        case 'price-desc': {
          const priceA = typeof a.totalPrice === 'string' ? parseFloat(a.totalPrice) : a.totalPrice || 0;
          const priceB = typeof b.totalPrice === 'string' ? parseFloat(b.totalPrice) : b.totalPrice || 0;
          return priceB - priceA;
        }
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [builds, searchTerm, selectedUseCase, sortBy, priceRange]);

  // Paginate builds
  const paginatedBuilds = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedBuilds.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedBuilds, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedBuilds.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedUseCase, sortBy, priceRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedUseCase('all');
    setSortBy('date-desc');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">Community Builds</h1>
        <p className="text-lg text-secondary-600 max-w-3xl">
          Explore PC builds shared by our community. Get inspiration for your next build or share your own configuration with others.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mb-8 flex flex-wrap gap-4">
        <Button onClick={() => router.push('/configurator')}>
          Create New Build
        </Button>
        <Button variant="outline">
          My Builds
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search and Use Case Row */}
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search builds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[250px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          
          <select
            value={selectedUseCase}
            onChange={(e) => setSelectedUseCase(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[150px]"
          >
            {useCases.map(useCase => (
              <option key={useCase} value={useCase}>
                {useCase === 'all' ? 'All Categories' : useCase}
              </option>
            ))}
          </select>
        </div>

        {/* Sort and Price Range Row */}
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="price-asc">Price Low–High</option>
            <option value="price-desc">Price High–Low</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />

          {(searchTerm || selectedUseCase !== 'all' || sortBy !== 'date-desc' || priceRange.min || priceRange.max) && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-secondary-600">
          Showing {Math.min(itemsPerPage, filteredAndSortedBuilds.length - (currentPage - 1) * itemsPerPage)} of {filteredAndSortedBuilds.length} builds
          {selectedUseCase !== 'all' && (
            <span className="ml-2 text-primary-600">
              for {selectedUseCase}
            </span>
          )}
        </p>
        
        {totalPages > 1 && (
          <p className="text-secondary-600">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-12 w-12 border-b-2 border-primary-600 rounded-full"></div>
        </div>
      )}

      {/* Builds Grid */}
      {!isLoading && (
        <>
          {paginatedBuilds.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No builds found
              </h3>
              <p className="text-secondary-600 mb-4">
                Try adjusting your filters or be the first to share a build!
              </p>
              <div className="space-x-4">
                <Button onClick={() => router.push('/configurator')}>
                  Create Build
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedBuilds.map((build) => (
                <Card key={build.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/builds/${build.id}`)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl">
                        {getUseCaseIcon(build.useCase || 'General')}
                      </div>
                      <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
                        {build.useCase || 'General'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-secondary-900 line-clamp-1">
                      {build.name}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      by {build.user?.username || 'Anonymous'}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-secondary-600 line-clamp-2">
                        {build.description || 'No description provided.'}
                      </p>
                      
                      {/* Build Stats */}
                      <div className="text-xs text-secondary-500 space-y-1">
                        <div className="flex justify-between">
                          <span>Components:</span>
                          <span>{build.components?.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Created:</span>
                          <span>{formatDate(build.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-secondary-100">
                        <span className="text-lg font-bold text-primary-600">
                          {formatPrice(build.totalPrice)}
                        </span>
                        <Button size="sm" onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/builds/${build.id}`);
                        }}>
                          View Build
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                First
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              
              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                Last
              </Button>
            </div>
          )}
        </>
      )}

      {/* Build Statistics */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl mb-2">🏗️</div>
            <h4 className="font-semibold text-secondary-900">Total Builds</h4>
            <p className="text-2xl font-bold text-primary-600 mt-1">{builds.length}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl mb-2">💰</div>
            <h4 className="font-semibold text-secondary-900">Avg. Price</h4>
            <p className="text-2xl font-bold text-primary-600 mt-1">
              {formatPrice(builds.reduce((sum, build) => {
                const price = typeof build.totalPrice === 'string' ? parseFloat(build.totalPrice) : build.totalPrice || 0;
                return sum + price;
              }, 0) / builds.length || 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl mb-2">🎮</div>
            <h4 className="font-semibold text-secondary-900">Gaming Builds</h4>
            <p className="text-2xl font-bold text-primary-600 mt-1">
              {builds.filter(build => build.useCase === 'Gaming').length}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl mb-2">💼</div>
            <h4 className="font-semibold text-secondary-900">Workstation</h4>
            <p className="text-2xl font-bold text-primary-600 mt-1">
              {builds.filter(build => build.useCase === 'Workstation').length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
