'use client';

import { useState, useEffect, useMemo } from 'react';
import { componentsAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatPrice, debounce } from '@/lib/utils';
import type { Component, ComponentCategory } from '@/lib/types';

interface ComponentSelectorProps {
  category: ComponentCategory;
  selectedComponent: Component | null;
  onComponentSelect: (component: Component | null) => void;
  isActive: boolean;
  onSetActive: () => void;
}

export function ComponentSelector({
  category,
  selectedComponent,
  onComponentSelect,
  isActive,
  onSetActive,
}: ComponentSelectorProps) {
  const [allComponents, setAllComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name-asc'|'name-desc'|'price-asc'|'price-desc'>('name-asc');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Fetch all components for this category (without search filter)
  const fetchAllComponents = async () => {
    if (!isActive) return;
    
    setIsLoading(true);
    try {
      const response = await componentsAPI.getByCategory(category.id, {
        // Don't pass search to API, we'll filter client-side
        sortBy: 'name-asc', // Get all in default order
      });
      if (response.success && response.data) {
        setAllComponents(response.data.components || []);
      }
    } catch (error) {
      console.error('Failed to fetch components:', error);
      setAllComponents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side filtering and sorting
  const filteredAndSortedComponents = useMemo(() => {
    let filtered = [...allComponents];

    // Apply search filter (search in name and brand)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(comp => 
        comp.name.toLowerCase().includes(searchLower) ||
        comp.brand.toLowerCase().includes(searchLower)
      );
    }

    // Apply price range filter
    if (priceRange.min) {
      const minPrice = Number(priceRange.min);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(comp => {
          const price = typeof comp.price === 'string' ? parseFloat(comp.price) : comp.price;
          return !isNaN(price) && price >= minPrice;
        });
      }
    }

    if (priceRange.max) {
      const maxPrice = Number(priceRange.max);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(comp => {
          const price = typeof comp.price === 'string' ? parseFloat(comp.price) : comp.price;
          return !isNaN(price) && price <= maxPrice;
        });
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc': {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price || 0;
          const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price || 0;
          return priceA - priceB;
        }
        case 'price-desc': {
          const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price || 0;
          const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price || 0;
          return priceB - priceA;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [allComponents, searchTerm, sortBy, priceRange.min, priceRange.max]);

  // Fetch components when category becomes active
  useEffect(() => {
    if (isActive) {
      fetchAllComponents();
    }
  }, [isActive, category.id]);

  return (
    <Card>
      <CardHeader onClick={onSetActive} className="cursor-pointer">
        <h3 className="text-lg font-semibold text-secondary-900">{category.displayName}</h3>
        <p className="text-sm text-secondary-600">{category.description}</p>
      </CardHeader>
      
      {isActive && (
        <CardContent className="p-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
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
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Clear filters button */}
          {(searchTerm || priceRange.min || priceRange.max) && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setPriceRange({ min: '', max: '' });
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Results count */}
          {!isLoading && (
            <div className="text-sm text-secondary-600">
              {filteredAndSortedComponents.length} of {allComponents.length} components shown
              {searchTerm && (
                <span className="ml-2">
                  (filtered by "{searchTerm}")
                </span>
              )}
            </div>
          )}

          {/* Component List */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-b-2 border-primary-600 rounded-full"></div>
            </div>
          ) : (
            <div className="divide-y divide-secondary-200 max-h-96 overflow-y-auto border rounded-lg">
              {filteredAndSortedComponents.length === 0 ? (
                <div className="p-8 text-center text-secondary-500">
                  {allComponents.length === 0 ? (
                    "No components available in this category."
                  ) : (
                    <>
                      No components found matching your filters.
                      {searchTerm && (
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchTerm('')}
                          >
                            Clear search
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                filteredAndSortedComponents.map((comp) => {
                  const isSelected = selectedComponent?.id === comp.id;
                  return (
                    <div
                      key={comp.id}
                      className={`p-4 flex justify-between items-center transition-colors ${
                        isSelected ? 'bg-primary-50' : 'hover:bg-secondary-50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-secondary-900 truncate">
                          {/* Highlight search term in name */}
                          {searchTerm ? (
                            <HighlightedText text={comp.name} highlight={searchTerm} />
                          ) : (
                            comp.name
                          )}
                        </h4>
                        <p className="text-sm text-secondary-600">
                          {/* Highlight search term in brand */}
                          {searchTerm ? (
                            <HighlightedText text={comp.brand} highlight={searchTerm} />
                          ) : (
                            comp.brand
                          )}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-primary-600">
                          {formatPrice(comp.price)}
                        </span>
                        <Button
                          size="sm"
                          variant={isSelected ? 'outline' : 'default'}
                          onClick={() => onComponentSelect(isSelected ? null : comp)}
                        >
                          {isSelected ? 'Deselect' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// Helper component to highlight search terms
function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) return <>{text}</>;

  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 text-secondary-900 px-1 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
