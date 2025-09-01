'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { buildsAPI, authAPI } from '@/lib/api';
import type { ComponentCategory, Component } from '@/lib/types';

interface SelectedComponent {
  category: ComponentCategory;
  component: Component;
  quantity: number;
}

interface SaveBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedComponents: SelectedComponent[];
  totalPrice: number;
  onSaveSuccess: (buildId: string) => void;
}

export default function SaveBuildModal({ 
  isOpen, 
  onClose, 
  selectedComponents, 
  totalPrice, 
  onSaveSuccess 
}: SaveBuildModalProps) {
  const [buildName, setBuildName] = useState('');
  const [description, setDescription] = useState('');
  const [useCase, setUseCase] = useState('Gaming');
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useCaseOptions = [
    'Gaming',
    'Workstation',
    'Budget',
    'Office',
    'Content Creation',
    'General',
  ];

  const handleSave = async () => {
    if (!buildName.trim()) {
      setError('Build name is required');
      return;
    }

    if (selectedComponents.length === 0) {
      setError('Please select at least one component');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Check if user is authenticated
      const userResponse = await authAPI.getCurrentUser();
      if (!userResponse.success) {
        setError('Please sign in to save builds');
        setIsSaving(false);
        return;
      }

      // Prepare build data
      const buildData = {
        name: buildName.trim(),
        description: description.trim(),
        useCase,
        isPublic,
        components: selectedComponents.map(sc => ({
          componentId: sc.component.id,
          quantity: sc.quantity,
        })),
      };

      console.log('Saving build with data:', buildData);

      // Save the build
      const response = await buildsAPI.create(buildData);
      
      if (response.success && response.data) {
        console.log('Build saved successfully:', response.data);
        onSaveSuccess(response.data.id);
        onClose();
        
        // Reset form
        setBuildName('');
        setDescription('');
        setUseCase('Gaming');
        setIsPublic(false);
      } else {
        setError(response.message || 'Failed to save build');
      }
    } catch (error) {
      console.error('Error saving build:', error);
      setError('Failed to save build. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Save Your Build</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Build Summary */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="font-medium text-gray-900 mb-2">Build Summary</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Components:</span>
                  <span>{selectedComponents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Price:</span>
                  <span className="font-semibold text-blue-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Build Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Build Name *
              </label>
              <input
                type="text"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                placeholder="My Gaming PC"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your build..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={500}
              />
            </div>

            {/* Use Case */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Use Case
              </label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {useCaseOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Privacy Setting */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Make this build public (others can view it)
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? 'Saving...' : 'Save Build'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}