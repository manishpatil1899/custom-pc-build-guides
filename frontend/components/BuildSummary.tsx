'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { formatPrice, getComponentCategoryIcon, calculateTotalPrice } from '@/lib/utils';
import { buildsAPI } from '@/lib/api';
import type { Component, CompatibilityCheck } from '@/lib/types';

interface BuildSummaryProps {
  selectedComponents: Record<string, Component | null>;
  compatibilityResult: CompatibilityCheck | null;
  onComponentRemove: (category: string) => void;
}

export function BuildSummary({
  selectedComponents,
  compatibilityResult,
  onComponentRemove,
}: BuildSummaryProps) {
  const [buildName, setBuildName] = useState('My Custom Build');
  const [description, setDescription] = useState('');
  const [useCase, setUseCase] = useState('Gaming');
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const componentsArray = Object.entries(selectedComponents)
    .map(([category, comp]) => ({ category, comp }))
    .filter(({ comp }) => comp) as { category: string; comp: Component }[];

  const totalPrice = calculateTotalPrice(componentsArray.map(({ comp }) => ({ price: comp.price })));

  const handleSave = async () => {
    if (componentsArray.length === 0) {
      alert('Select at least one component before saving.');
      return;
    }
    setIsSaving(true);
    try {
      const buildData = {
        name: buildName,
        description,
        useCase,
        isPublic,
        components: componentsArray.map(({ comp }) => ({ componentId: comp.id, quantity: 1 })),
      };
      await buildsAPI.create(buildData);
      alert('Build saved successfully!');
    } catch (error) {
      console.error('Save build error:', error);
      alert('Failed to save the build.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Build Summary</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-secondary-600">Components:</span>
            <span className="font-medium">{componentsArray.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Total Price:</span>
            <span className="font-semibold text-lg text-primary-600">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Compatibility:</span>
            <span className={`flex items-center space-x-1 ${
              compatibilityResult?.isCompatible ? 'text-green-600' : 'text-red-600'
            }`}>
              <span
                className={`w-2 h-2 rounded-full ${
                  compatibilityResult?.isCompatible ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></span>
              <span className="text-sm">
                {compatibilityResult
                  ? compatibilityResult.isCompatible
                    ? 'Compatible'
                    : 'Issues ✓'
                  : 'Not checked'}
              </span>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Selected Components */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Selected Components</h3>
        </CardHeader>
        <CardContent>
          {componentsArray.length === 0 ? (
            <div className="text-center py-8 text-secondary-500">
              No components selected.
            </div>
          ) : (
            <div className="space-y-3">
              {componentsArray.map(({ category, comp }) => (
                <div
                  key={category}
                  className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="text-xl">{getComponentCategoryIcon(category)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-secondary-900 truncate">
                        {comp.name}
                      </h4>
                      <p className="text-sm text-secondary-600">
                        {category} • {formatPrice(comp.price)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onComponentRemove(category)}
                    className="text-red-600 hover:text-red-700"
                  >
                    &times;
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Section */}
      {componentsArray.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Save Your Build</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Build Name"
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              placeholder="Enter build name"
            />
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
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
                id="public"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="public" className="text-sm text-secondary-700">
                Make public
              </label>
            </div>
            <Button
              onClick={handleSave}
              isLoading={isSaving}
              disabled={!buildName.trim() || isSaving}
              className="w-full"
            >
              {isSaving ? 'Saving...' : 'Save Build'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
