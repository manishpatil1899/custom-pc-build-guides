'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { formatPrice, getComponentCategoryIcon } from '@/lib/utils';
import { buildsAPI } from '@/lib/api';
import type { Component, CompatibilityCheck } from '@/lib/types';

interface BuildSummaryProps {
  selectedComponents: Record<string, Component | null>;
  totalPrice: number;
  compatibilityResult: CompatibilityCheck | null;
  onComponentRemove: (category: string) => void;
}

export function BuildSummary({
  selectedComponents,
  totalPrice,
  compatibilityResult,
  onComponentRemove,
}: BuildSummaryProps) {
  const [buildName, setBuildName] = useState('My Custom Build');
  const [buildDescription, setBuildDescription] = useState('');
  const [useCase, setUseCase] = useState('Gaming');
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const components = Object.entries(selectedComponents).filter(([_, component]) => component !== null);
  const componentCount = components.length;

  const handleSaveBuild = async () => {
    if (componentCount === 0) {
      alert('Please select at least one component before saving.');
      return;
    }

    try {
      setIsSaving(true);
      
      const buildData = {
        name: buildName,
        description: buildDescription,
        useCase,
        isPublic,
        components: components.map(([_, component]) => ({
          componentId: component!.id,
          quantity: 1,
        })),
      };

      await buildsAPI.create(buildData);
      alert('Build saved successfully!');
    } catch (error) {
      console.error('Failed to save build:', error);
      alert('Failed to save build. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getCompatibilityIcon = () => {
    if (!compatibilityResult) {
      return (
        <div className="w-3 h-3 bg-secondary-300 rounded-full"></div>
      );
    }

    if (compatibilityResult.isCompatible && compatibilityResult.warnings.length === 0) {
      return (
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      );
    } else if (compatibilityResult.isCompatible) {
      return (
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
      );
    } else {
      return (
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
      );
    }
  };

  const getCompatibilityText = () => {
    if (!compatibilityResult) return 'Not checked';
    
    if (compatibilityResult.isCompatible && compatibilityResult.warnings.length === 0) {
      return 'Fully compatible';
    } else if (compatibilityResult.isCompatible) {
      return 'Compatible with warnings';
    } else {
      return 'Has compatibility issues';
    }
  };

  return (
    <div className="space-y-6">
      {/* Build Overview */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-secondary-900">
            Build Summary
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-secondary-200">
            <span className="text-secondary-600">Components:</span>
            <span className="font-semibold">{componentCount}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-secondary-200">
            <span className="text-secondary-600">Total Price:</span>
            <span className="font-semibold text-lg text-primary-600">
              {formatPrice(totalPrice)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-secondary-600">Compatibility:</span>
            <div className="flex items-center space-x-2">
              {getCompatibilityIcon()}
              <span className="text-sm font-medium">
                {getCompatibilityText()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Components */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-secondary-900">
            Selected Components
          </h3>
        </CardHeader>
        <CardContent>
          {componentCount === 0 ? (
            <div className="text-center py-8 text-secondary-500">
              <div className="text-4xl mb-2">🔧</div>
              <p>No components selected yet</p>
              <p className="text-sm">Start building by selecting components above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {components.map(([category, component]) => (
                <div
                  key={category}
                  className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="text-lg">
                      {getComponentCategoryIcon(category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-secondary-900 truncate">
                        {component!.name}
                      </h4>
                      <p className="text-sm text-secondary-600">
                        {category} • {formatPrice(component!.price)}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onComponentRemove(category)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Build */}
      {componentCount > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-secondary-900">
              Save Your Build
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Build Name"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              placeholder="Enter a name for your build"
            />
            
            <Textarea
              label="Description (Optional)"
              value={buildDescription}
              onChange={(e) => setBuildDescription(e.target.value)}
              placeholder="Describe your build..."
              rows={3}
            />
            
            <Select
              label="Use Case"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
            >
              <option value="Gaming">Gaming</option>
              <option value="Workstation">Workstation</option>
              <option value="Budget">Budget</option>
              <option value="Office">Office</option>
              <option value="HTPC">HTPC</option>
              <option value="Server">Server</option>
              <option value="Other">Other</option>
            </Select>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="isPublic" className="text-sm text-secondary-700">
                Make this build public
              </label>
            </div>
            
            <div className="pt-4 border-t border-secondary-200">
              <Button
                onClick={handleSaveBuild}
                isLoading={isSaving}
                disabled={!buildName.trim() || componentCount === 0}
                className="w-full"
              >
                {isSaving ? 'Saving Build...' : 'Save Build'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardContent className="py-4">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="text-xs">
              Share Build
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Export List
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Reset Build
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Load Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
