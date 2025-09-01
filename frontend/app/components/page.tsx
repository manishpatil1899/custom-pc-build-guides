'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { componentsAPI, categoriesAPI } from '@/lib/api';
import { formatPrice, getComponentCategoryIcon } from '@/lib/utils';
import type { Component, ComponentCategory } from '@/lib/types';

export default function ComponentsPage() {
  const router = useRouter();
  const [components, setComponents] = useState<Component[]>([]);
  const [categories, setCategories] = useState<ComponentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('name-asc');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch categories and components
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesResponse, componentsResponse] = await Promise.all([
          categoriesAPI.getAll(),
          componentsAPI.getAll()
        ]);

        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }

        if (componentsResponse.success && componentsResponse.data) {
          // Now TS knows data.components exists
          setComponents(componentsResponse.data.components);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique brands
  const brands = useMemo(() => {
    const validBrands = components
      .map(c => c.brand)
      .filter((brand): brand is string => Boolean(brand));
    const unique = [...new Set(validBrands)];
    return ['all', ...unique.sort()];
  }, [components]);

  // Filter and sort components
  const filteredAndSortedComponents = useMemo(() => {
    let filtered = [...components];

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(component => 
        component.name.toLowerCase().includes(searchLower) ||
        component.brand?.toLowerCase().includes(searchLower) ||
        component.description?.toLowerCase().includes(searchLower) ||
        component.model?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(component => 
        component.category?.id === selectedCategory
      );
    }

    // Filter by brand
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(component => 
        component.brand === selectedBrand
      );
    }

    // Filter by price range
    if (priceRange.min) {
      const minPrice = Number(priceRange.min);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(component => {
          const price = typeof component.price === 'string' ? parseFloat(component.price) : (component.price ?? 0);
          return !isNaN(price) && price >= minPrice;
        });
      }
    }

    if (priceRange.max) {
      const maxPrice = Number(priceRange.max);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(component => {
          const price = typeof component.price === 'string' ? parseFloat(component.price) : (component.price ?? 0);
          return !isNaN(price) && price <= maxPrice;
        });
      }
    }

    // Sort components
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc': {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price) : (a.price ?? 0);
          const priceB = typeof b.price === 'string' ? parseFloat(b.price) : (b.price ?? 0);
          return priceA - priceB;
        }
        case 'price-desc': {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price) : (a.price ?? 0);
          const priceB = typeof b.price === 'string' ? parseFloat(b.price) : (b.price ?? 0);
          return priceB - priceA;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [components, searchTerm, selectedCategory, selectedBrand, sortBy, priceRange]);

  // Paginate components
  const paginatedComponents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedComponents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedComponents, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedComponents.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedBrand, sortBy, priceRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSortBy('name-asc');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">PC Components</h1>
        <p className="text-lg text-secondary-600 max-w-3xl">
          Browse our comprehensive database of PC components. Find the perfect parts for your build with detailed specifications and competitive pricing.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mb-8 flex flex-wrap gap-4">
        <Button onClick={() => router.push('/configurator')}>
          Build Your PC
        </Button>
        <Button variant="outline" onClick={() => router.push('/builds')}>
          View Community Builds
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search and Category Row */}
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[250px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[150px]"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.displayName}
              </option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white min-w-[130px]"
          >
            <option value="all">All Brands</option>
            {brands.slice(1).map(brand => (
              <option key={brand} value={brand}>
                {brand}
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

          {(searchTerm || selectedCategory !== 'all' || selectedBrand !== 'all' || sortBy !== 'name-asc' || priceRange.min || priceRange.max) && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-secondary-600">
          Showing {Math.min(itemsPerPage, filteredAndSortedComponents.length - (currentPage - 1) * itemsPerPage)} of {filteredAndSortedComponents.length} components
          {selectedCategory !== 'all' && (
            <span className="ml-2 text-primary-600">
              in {categories.find(c => c.id === selectedCategory)?.displayName}
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

      {/* Components Grid */}
      {!isLoading && (
        <>
          {paginatedComponents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No components found
              </h3>
              <p className="text-secondary-600 mb-4">
                Try adjusting your filters or search terms to find components.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedComponents.map((component) => (
                <Card key={component.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl">
                        {getComponentCategoryIcon(component.category?.name ?? 'component')}
                      </div>
                      <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
                        {component.category?.displayName ?? 'Component'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-secondary-900 line-clamp-2 min-h-[2.5rem]">
                      {component.name}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      {component.brand}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-secondary-600 line-clamp-2 min-h-[2.5rem]">
                        {component.description}
                      </p>
                      
                      {/* Key Specifications */}
                      {component.specifications && (
                        <div className="text-xs text-secondary-500 space-y-1">
                          {Object.entries(component.specifications).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="font-medium capitalize truncate">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="text-right ml-2 truncate">
                                {String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-2 border-t border-secondary-100">
                        <span className="text-lg font-bold text-primary-600">
                          {formatPrice(component.price)}
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm">
                            Add to Build
                          </Button>
                        </div>
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
              
              {/* Page Numbers - FIXED: Changed 'default' to 'primary' */}
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
                    variant={currentPage === pageNum ? 'primary' : 'outline'}
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

      {/* Category Statistics */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6">Component Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const categoryCount = components.filter(c => c.category?.id === category.id).length;
            
            return (
              <Card 
                key={category.id} 
                className="text-center cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setSelectedCategory(category.id);
                  setCurrentPage(1);
                }}
              >
                <CardContent className="p-4">
                  <div className="text-3xl mb-2">
                    {getComponentCategoryIcon(category.name)}
                  </div>
                  <h4 className="font-semibold text-secondary-900 mb-1 text-sm">
                    {category.displayName}
                  </h4>
                  <p className="text-lg font-bold text-primary-600">
                    {categoryCount}
                  </p>
                  <p className="text-xs text-secondary-500">
                    Components
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}