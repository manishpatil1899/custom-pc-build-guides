'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import SaveBuildModal from '@/components/SaveBuildModal';
import { categoriesAPI, componentsAPI, compatibilityAPI } from '@/lib/api';
import { formatPrice, getComponentCategoryIcon } from '@/lib/utils';
import type { Component, ComponentCategory, CompatibilityCheck } from '@/lib/types';

interface SelectedComponent {
  category: ComponentCategory;
  component: Component;
  quantity: number;
}

export default function ConfiguratorPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ComponentCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponent[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingComponents, setIsLoadingComponents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // NEW: compatibility state (auto-checking like in the other configurator)
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityCheck | null>(null);
  const [isCheckingCompatibility, setIsCheckingCompatibility] = useState(false);
  // New search/sort/filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('name-asc');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });


  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setError(null);
      try {
        const response = await categoriesAPI.getAll();
        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          setError('Failed to load categories');
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setError('Failed to connect to server');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch components for selected category
  useEffect(() => {
    const fetchComponents = async () => {
      if (!selectedCategory) return;

      setIsLoadingComponents(true);
      setError(null);
      try {
        const response = await componentsAPI.getByCategory(selectedCategory.id);
        if (response.success && response.data) {
          setComponents(response.data.components || []);
        } else {
          setComponents([]);
          setError(`No components found for ${selectedCategory.displayName}`);
        }
      } catch (error) {
        console.error('Failed to fetch components:', error);
        setComponents([]);
        setError('Failed to load components');
      } finally {
        setIsLoadingComponents(false);
      }
    };

    fetchComponents();
  }, [selectedCategory]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const handleCategorySelect = (category: ComponentCategory) => {
    setSelectedCategory(category);
    setComponents([]);
    setError(null);
    // Reset filters when switching category
    setSearchTerm('');
    setSortBy('name-asc');
    setPriceRange({ min: '', max: '' });
  };

  const handleComponentSelect = (component: Component) => {
    const existingIndex = selectedComponents.findIndex(sc => sc.category.id === selectedCategory?.id);

    const newSelection: SelectedComponent = {
      category: selectedCategory!,
      component,
      quantity: 1,
    };

    if (existingIndex !== -1) {
      const newSelectedComponents = [...selectedComponents];
      newSelectedComponents[existingIndex] = newSelection;
      setSelectedComponents(newSelectedComponents);
    } else {
      setSelectedComponents([...selectedComponents, newSelection]);
    }
  };

  const handleComponentRemove = (categoryId: string) => {
    setSelectedComponents(selectedComponents.filter(sc => sc.category.id !== categoryId));
  };

  const totalPrice = selectedComponents.reduce((total, sc) => {
    const price = typeof sc.component.price === 'string' ? parseFloat(sc.component.price) : sc.component.price || 0;
    return total + price * (sc.quantity || 1);
  }, 0);

  const selectedComponentsByCategory = useMemo(() => {
    return selectedComponents.reduce((acc, sc) => {
      acc[sc.category.id] = sc;
      return acc;
    }, {} as Record<string, SelectedComponent>);
  }, [selectedComponents]);

  const handleSaveBuild = () => {
    if (selectedComponents.length === 0) {
      setError('Please select at least one component before saving');
      return;
    }
    setShowSaveModal(true);
  };

  const handleSaveSuccess = (buildId: string) => {
    setSaveSuccess(`Build saved successfully! You can view it in your builds.`);
    console.log('Build saved with ID:', buildId);
    // Optionally redirect to builds page
    // router.push('/builds');
  };

  const handleViewMyBuilds = () => {
    router.push('/builds');
  };

  // --- Automatic compatibility checking (parity with the other configurator) ---
  const checkCompatibility = async () => {
    const items = selectedComponents.map(sc => ({ componentId: sc.component.id, quantity: sc.quantity || 1 }));

    if (items.length < 2) {
      // need at least two parts to evaluate meaningful compatibility
      setCompatibilityResult(null);
      return;
    }

    setIsCheckingCompatibility(true);
    try {
      const response = await compatibilityAPI.checkBuild(items);
      if (response.success && response.data) {
        setCompatibilityResult(response.data as CompatibilityCheck);
      }
    } catch (err) {
      console.error('Compatibility check failed:', err);
      // keep prior result; do not surface as blocking error in UI
    } finally {
      setIsCheckingCompatibility(false);
    }
  };

  // Filtering + Sorting logic for components in selected category
const filteredAndSortedComponents = useMemo(() => {
  let filtered = [...components];

  // Search
  if (searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase().trim();
    filtered = filtered.filter(comp =>
      comp.name.toLowerCase().includes(searchLower) ||
      comp.brand.toLowerCase().includes(searchLower) ||
      comp.model.toLowerCase().includes(searchLower)
    );
  }

  // Price range
  if (priceRange.min) {
    const minPrice = Number(priceRange.min);
    if (!isNaN(minPrice)) {
              filtered = filtered.filter(comp => {
          const price = typeof comp.price === 'string' ? parseFloat(comp.price) : comp.price || 0;
          return !isNaN(price) && price >= minPrice;
        });
    }
  }
  if (priceRange.max) {
    const maxPrice = Number(priceRange.max);
    if (!isNaN(maxPrice)) {
              filtered = filtered.filter(comp => {
          const price = typeof comp.price === 'string' ? parseFloat(comp.price) : comp.price || 0;
          return !isNaN(price) && price <= maxPrice;
        });
    }
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'name-asc': return a.name.localeCompare(b.name);
      case 'name-desc': return b.name.localeCompare(a.name);
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
      default: return 0;
    }
  });

  return filtered;
}, [components, searchTerm, sortBy, priceRange]);

  // Trigger automatic check whenever the selection changes
  useEffect(() => {
    // fire-and-forget; result will render in sidebar
    checkCompatibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponents]);

  // Debug information
  console.log('Current state:', {
    categoriesCount: categories.length,
    selectedCategory: selectedCategory?.name,
    componentsCount: components.length,
    selectedComponentsCount: selectedComponents.length,
    error,
    compatibility: compatibilityResult
      ? { ok: compatibilityResult.isCompatible, errors: compatibilityResult.errors.length, warnings: compatibilityResult.warnings.length }
      : null,
  });

  const progressPct = categories.length > 0 ? (selectedComponents.length / categories.length) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">PC Configurator</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Build your perfect PC step by step. Select components for each category and get real-time compatibility checking.
        </p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-green-500 mr-3">✅</div>
            <p className="text-green-700">{saveSuccess}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleViewMyBuilds}>
            View My Builds
          </Button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {selectedComponents.length} of {categories.length} components selected
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Component Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Component Categories</h2>
            </CardHeader>
            <CardContent>
              {isLoadingCategories ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No categories found</p>
                  <p className="text-sm mt-2">Check your backend connection</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map(category => {
                    const isSelected = selectedCategory?.id === category.id;
                    const hasComponent = !!selectedComponentsByCategory[category.id];

                    // OPTIONAL: tiny per-category issue indicator if the selected component appears in errors
                    const sc = selectedComponentsByCategory[category.id];
                    const compName = sc?.component?.name?.toLowerCase?.() || '';
                    const hasIssue = !!(
                      compName && compatibilityResult?.errors?.some(e => e.toLowerCase().includes(compName))
                    );

                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                          isSelected
                            ? 'bg-blue-100 border-blue-500 border-2'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div className="text-2xl">{getComponentCategoryIcon(category.name)}</div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                            {category.displayName}
                          </p>
                          {hasComponent && <p className="text-sm text-green-600">✓ Selected</p>}
                        </div>
                        {/* tiny status dot (only when a component is chosen in this category) */}
                        {hasComponent && (
                          <span
                            className={`ml-2 h-2 w-2 rounded-full ${
                              hasIssue ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            aria-hidden
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Component Selection Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedCategory ? selectedCategory.displayName : 'Select a Category'}
              </h2>
              {selectedCategory && <p className="text-gray-600">{selectedCategory.description}</p>}
            </CardHeader>
            <CardContent>
              {!selectedCategory ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">🔧</div>
                  <p className="text-lg font-medium mb-2">Choose a component category</p>
                  <p>Select a category from the left to view available components</p>
                </div>
              ) : isLoadingComponents ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="h-6 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                        </div>
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : components.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">📦</div>
                  <p className="text-lg font-medium mb-2">No components available</p>
                  <p>No components found in this category</p>
                </div>
              ) : (
                <><>
                        {/* Filters */}
                        <div className="mb-4 flex flex-wrap items-center gap-4">
                          <input
                            type="text"
                            placeholder="Search components..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg" />
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
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
                            className="w-28 px-2 py-2 border border-gray-300 rounded-lg" />
                          <input
                            type="number"
                            placeholder="Max Price"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                            className="w-28 px-2 py-2 border border-gray-300 rounded-lg" />
                        </div>
                      </><div className="space-y-4">
                          {filteredAndSortedComponents.map(component => {

                            const isSelected = selectedComponentsByCategory[selectedCategory.id]?.component.id === component.id;
                            return (

                              <div
                                key={component.id}
                                className={`border rounded-lg p-4 transition-all ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">{component.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{component.brand} • {component.model}</p>
                                    <p className="text-sm text-gray-700 mb-3">{component.description}</p>
                                    {component.specifications && (
                                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                        {Object.entries(component.specifications).slice(0, 4).map(([key, value]) => (
                                          <div key={key}>
                                            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>{' '}
                                            {String(value)}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right ml-4">
                                    <p className="font-bold text-lg text-blue-600 mb-2">{formatPrice(component.price || 0)}</p>
                                    <Button onClick={() => handleComponentSelect(component)} variant={isSelected ? 'outline' : 'primary'} size="sm">
                                      {isSelected ? 'Selected ✓' : 'Select'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div></>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Build Summary + Compatibility Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Build Summary</h2>
            </CardHeader>
            <CardContent>
              
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Components:</span>
                  <span className="font-semibold">{selectedComponents.length}</span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="font-bold text-xl text-blue-600">{formatPrice(totalPrice)}</span>
                </div>

                {/* Selected Components List */}
                <div className="space-y-3">
                  {selectedComponents.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No components selected yet</p>
                  ) : (
                    selectedComponents.map(sc => (
                      <div key={sc.category.id} className="p-2 bg-gray-50 rounded">
                        {/* UPDATED: Grid layout with tooltip for long names */}
                        <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                          <div className="flex items-center space-x-2 min-w-0">
                            <span className="text-lg">{getComponentCategoryIcon(sc.category?.name || '')}</span>
                            <div className="min-w-0">
                              <p
                                className="text-sm font-medium truncate max-w-[140px]"
                                title={sc.component.name}
                              >
                                {sc.component.name}
                              </p>
                              <p className="text-xs text-gray-500">{formatPrice(sc.component.price || 0)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleComponentRemove(sc.category.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Compatibility Status (auto-updating) */}
                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Compatibility</h3>
                    <div className="flex items-center space-x-2">
                      {isCheckingCompatibility && <span className="text-xs text-gray-500">Checking…</span>}
                      <span
                        className={`inline-block h-3 w-3 rounded-full ${
                          compatibilityResult
                            ? compatibilityResult.isCompatible
                              ? 'bg-green-500'
                              : 'bg-red-500'
                            : 'bg-gray-300'
                        }`}
                        aria-label="compatibility-indicator"
                      />
                    </div>
                  </div>

                  {compatibilityResult && (
                    <div className="space-y-3">
                      {!compatibilityResult.isCompatible && compatibilityResult.errors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="text-sm font-medium text-red-800 mb-2">
                            {compatibilityResult.errors.length} Error(s):
                          </div>
                          <ul className="text-xs text-red-700 space-y-1">
                            {compatibilityResult.errors.map((err, i) => (
                              <li key={i} className="flex items-start">
                                <span className="inline-block w-1 h-1 rounded-full bg-red-400 mt-1.5 mr-2 flex-shrink-0" />
                                {err}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {compatibilityResult.warnings.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="text-sm font-medium text-yellow-800 mb-2">
                            {compatibilityResult.warnings.length} Warning(s):
                          </div>
                          <ul className="text-xs text-yellow-700 space-y-1">
                            {compatibilityResult.warnings.map((warn, i) => (
                              <li key={i} className="flex items-start">
                                <span className="inline-block w-1 h-1 rounded-full bg-yellow-400 mt-1.5 mr-2 flex-shrink-0" />
                                {warn}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                  <Button className="w-full" onClick={handleSaveBuild} disabled={selectedComponents.length === 0}>
                    Save Build
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={checkCompatibility}
                    disabled={selectedComponents.length === 0 || isCheckingCompatibility}
                  >
                    {isCheckingCompatibility ? 'Checking…' : 'Check Compatibility'}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleViewMyBuilds}>
                    View My Builds
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Build Modal */}
      <SaveBuildModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        selectedComponents={selectedComponents}
        totalPrice={totalPrice}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}
