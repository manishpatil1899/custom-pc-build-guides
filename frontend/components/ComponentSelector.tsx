'use client';

import { useState, useEffect } from 'react';
import { componentsAPI } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { formatPrice, getComponentCategoryIcon } from '@/lib/utils';
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
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    if (isActive) {
      fetchComponents();
    }
  }, [isActive, searchTerm, sortBy, priceRange, category.id]);

  const fetchComponents = async () => {
    try {
      setIsLoading(true);
      const response = await componentsAPI.getByCategory(category.id, {
        search: searchTerm || undefined,
        sortBy,
        priceMin: priceRange.min ? parseFloat(priceRange.min) : undefined,
        priceMax: priceRange.max ? parseFloat(priceRange.max) : undefined,
        limit: 20,
      });
      
      if (response.success && response.data) {
        setComponents(response.data.components || []);
      }
    } catch (error) {
      console.error('Failed to fetch components:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceRangeChange = (field: 'min' | 'max', value: string) => {
    setPriceRange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader 
        className={`cursor-pointer transition-colors ${
          isActive ? 'bg-primary-50 border-primary-200' : 'hover:bg-secondary-50'
        }`}
        onClick={onSetActive}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {getComponentCategoryIcon(category.name)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                {category.displayName}
              </h3>
              <p className="text-sm text-secondary-600">
                {category.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedComponent && (
              <div className="text-right">
                <p className="font-medium text-secondary-900 truncate max-w-32">
                  {selectedComponent.name}
                </p>
                <p className="text-sm text-primary-600">
                  {formatPrice(selectedComponent.price)}
                </p>
              </div>
            )}
            
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              selectedComponent 
                ? 'bg-green-100' 
                : 'bg-secondary-200'
            }`}>
              {selectedComponent ? (
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <div className="w-2 h-2 bg-secondary-400 rounded-full"></div>
              )}
            </div>
            
            <svg 
              className={`w-5 h-5 text-secondary-400 transition-transform ${
                isActive ? 'transform rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </CardHeader>

      {isActive && (
        <CardContent className="p-0">
          {/* Filters */}
          <div className="p-4 border-b border-secondary-200 bg-secondary-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder={`Search ${category.displayName.toLowerCase()}...`}
                value={searchTerm}
                onChange={handleSearchChange}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low-High)</option>
                <option value="price-desc">Price (High-Low)</option>
              </select>
              
              <Input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              />
              
              <Input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              />
            </div>
          </div>

          {/* Component List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-secondary-600">Loading components...</p>
              </div>
            ) : components.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-secondary-600">
                  No components found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-secondary-200">
                {selectedComponent && (
                  <div className="p-4 bg-red-50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onComponentSelect(null)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-100"
                    >
                      Remove {category.displayName}
                    </Button>
                  </div>
                )}
                
                {components.map((component) => (
                  <div
                    key={component.id}
                    className={`p-4 hover:bg-secondary-50 cursor-pointer transition-colors ${
                      selectedComponent?.id === component.id 
                        ? 'bg-primary-50 border-l-4 border-primary-500' 
                        : ''
                    }`}
                    onClick={() => onComponentSelect(component)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-secondary-900 truncate">
                            {component.name}
                          </h4>
                          <span className="text-xs text-secondary-500 bg-secondary-100 px-2 py-1 rounded">
                            {component.brand}
                          </span>
                          {!component.inStock && (
                            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        
                        {component.description && (
                          <p className="text-sm text-secondary-600 mb-2 line-clamp-2">
                            {component.description}
                          </p>
                        )}
                        
                        {/* Key Specifications */}
                        {component.specifications && (
                          <div className="flex flex-wrap gap-2 text-xs text-secondary-600">
                            {Object.entries(component.specifications)
                              .slice(0, 3)
                              .map(([key, value]) => (
                                <span key={key} className="bg-secondary-100 px-2 py-1 rounded">
                                  {key}: {String(value)}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 text-right">
                        <p className="font-semibold text-lg text-primary-600">
                          {formatPrice(component.price)}
                        </p>
                        
                        {selectedComponent?.id === component.id ? (
                          <div className="flex items-center text-green-600 text-sm">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Selected
                          </div>
                        ) : (
                          <Button size="sm" variant="outline">
                            Select
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
