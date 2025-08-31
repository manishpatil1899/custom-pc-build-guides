'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { categoriesAPI, componentsAPI, compatibilityAPI } from '@/lib/api';
import { formatPrice, getComponentCategoryIcon } from '@/lib/utils';
import type { ComponentCategory, Component, CompatibilityCheck } from '@/lib/types';

export default function ConfiguratorPage() {
  const [categories, setCategories] = useState<ComponentCategory[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<Record<string, Component | null>>({});
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityCheck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Check compatibility whenever components change
    const components = Object.values(selectedComponents).filter(Boolean);
    if (components.length >= 2) {
      checkCompatibility();
    } else {
      setCompatibilityResult(null);
    }
  }, [selectedComponents]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      if (response.success && response.data) {
        setCategories(response.data);
        // Set first category as active
        if (response.data.length > 0) {
          setActiveCategory(response.data[0].name);
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkCompatibility = async () => {
    try {
      const components = Object.values(selectedComponents)
        .filter(Boolean)
        .map(component => ({
          componentId: component!.id,
          quantity: 1
        }));

      if (components.length === 0) return;

      const response = await compatibilityAPI.checkBuild(components);
      if (response.success && response.data) {
        setCompatibilityResult(response.data);
      }
    } catch (error) {
      console.error('Compatibility check failed:', error);
    }
  };

  const handleComponentSelect = (categoryName: string, component: Component | null) => {
    setSelectedComponents(prev => ({
      ...prev,
      [categoryName]: component
    }));
  };

  const calculateTotalPrice = () => {
    return Object.values(selectedComponents)
      .filter(Boolean)
      .reduce((total, component) => total + (component?.price || 0), 0);
  };

  const getSelectedComponentsCount = () => {
    return Object.values(selectedComponents).filter(Boolean).length;
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          PC Configurator
        </h1>
        <p className="text-lg text-secondary-600 max-w-3xl">
          Build your perfect PC step by step. Select components for each category and get real-time compatibility checking.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="bg-secondary-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(getSelectedComponentsCount() / categories.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-secondary-600 mt-2">
          {getSelectedComponentsCount()} of {categories.length} components selected
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Category Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-secondary-900">Component Categories</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.name)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                      activeCategory === category.name
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-secondary-700 hover:bg-secondary-50'
                    }`}
                  >
                    <span className="text-xl">
                      {getComponentCategoryIcon(category.name)}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium">{category.displayName}</div>
                      {selectedComponents[category.name] && (
                        <div className="text-xs text-secondary-500 truncate">
                          {selectedComponents[category.name]?.name}
                        </div>
                      )}
                    </div>
                    {selectedComponents[category.name] ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-secondary-300 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Component Selection */}
        <div className="lg:col-span-2">
          {activeCategory && (
            <ComponentSelector
              categoryName={activeCategory}
              selectedComponent={selectedComponents[activeCategory]}
              onComponentSelect={(component) => handleComponentSelect(activeCategory, component)}
            />
          )}
        </div>

        {/* Build Summary */}
        <div className="lg:col-span-1">
          <div className="space-y-6 sticky top-8">
            {/* Build Overview */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-secondary-900">Build Summary</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Components:</span>
                    <span className="font-medium">{getSelectedComponentsCount()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Total Price:</span>
                    <span className="font-semibold text-lg text-primary-600">
                      {formatPrice(calculateTotalPrice())}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compatibility Status */}
            {compatibilityResult && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-secondary-900">Compatibility</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className={`flex items-center space-x-2 ${
                      compatibilityResult.isCompatible 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        compatibilityResult.isCompatible ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium">
                        {compatibilityResult.isCompatible ? 'Compatible' : 'Issues Found'}
                      </span>
                    </div>
                    
                    {compatibilityResult.errors.length > 0 && (
                      <div className="text-xs text-red-600">
                        {compatibilityResult.errors.length} error(s)
                      </div>
                    )}
                    
                    {compatibilityResult.warnings.length > 0 && (
                      <div className="text-xs text-yellow-600">
                        {compatibilityResult.warnings.length} warning(s)
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected Components */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-secondary-900">Selected Components</h3>
              </CardHeader>
              <CardContent>
                {getSelectedComponentsCount() === 0 ? (
                  <p className="text-secondary-500 text-sm text-center py-4">
                    No components selected yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(selectedComponents)
                      .filter(([_, component]) => component !== null)
                      .map(([categoryName, component]) => (
                        <div key={categoryName} className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-secondary-900 truncate">
                              {component!.name}
                            </div>
                            <div className="text-xs text-secondary-500">
                              {categoryName} • {formatPrice(component!.price)}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleComponentSelect(categoryName, null)}
                            className="text-red-600 hover:text-red-700 ml-2"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            {getSelectedComponentsCount() > 0 && (
              <div className="space-y-3">
                <Button className="w-full">
                  Save Build
                </Button>
                <Button variant="outline" className="w-full">
                  Share Build
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple ComponentSelector component for this example
function ComponentSelector({ 
  categoryName, 
  selectedComponent, 
  onComponentSelect 
}: {
  categoryName: string;
  selectedComponent: Component | null;
  onComponentSelect: (component: Component | null) => void;
}) {
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComponents();
  }, [categoryName]);

  const fetchComponents = async () => {
    try {
      setIsLoading(true);
      const response = await componentsAPI.getAll({ category: categoryName, limit: 10 });
      if (response.success && response.data) {
        setComponents(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch components:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-secondary-900">
          Select {categoryName}
        </h2>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedComponent && (
              <div className="p-4 bg-red-50 rounded-lg">
                <Button
                  variant="ghost"
                  onClick={() => onComponentSelect(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove {categoryName}
                </Button>
              </div>
            )}
            
            {components.map((component) => (
              <div
                key={component.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedComponent?.id === component.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
                onClick={() => onComponentSelect(component)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-secondary-900">{component.name}</h3>
                    <p className="text-sm text-secondary-600">{component.brand}</p>
                    {component.description && (
                      <p className="text-sm text-secondary-500 mt-1 line-clamp-2">
                        {component.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <div className="font-semibold text-primary-600">
                      {formatPrice(component.price)}
                    </div>
                    {selectedComponent?.id === component.id && (
                      <div className="text-xs text-green-600 mt-1">Selected</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
