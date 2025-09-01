'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { buildsAPI } from '@/lib/api';
import { formatPrice, formatDate, getUseCaseIcon, getComponentCategoryIcon } from '@/lib/utils';
import type { Build, BuildComponent } from '@/lib/types';

export default function BuildDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [build, setBuild] = useState<Build | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBuild = async () => {
      if (!params.id) return;
      
      setIsLoading(true);
      try {
        const response = await buildsAPI.getById(params.id as string);
        if (response.success && response.data) {
          setBuild(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch build:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuild();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin h-12 w-12 border-b-2 border-primary-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!build) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Build Not Found</h2>
          <Button onClick={() => router.push('/builds')}>
            Back to Builds
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="outline" onClick={() => router.push('/builds')} className="mb-6">
        ← Back to Builds
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Build Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Build Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">
                    {getUseCaseIcon(build.useCase || 'General')}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-secondary-900">{build.name}</h1>
                    <p className="text-lg text-secondary-600">
                      by {build.user?.username || 'Anonymous'} • {formatDate(build.createdAt)}
                    </p>
                  </div>
                </div>
                <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm">
                  {build.useCase || 'General'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-600 text-lg">
                {build.description || 'No description provided for this build.'}
              </p>
            </CardContent>
          </Card>

          {/* Components List */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-secondary-900">Components</h2>
              <p className="text-secondary-600">
                {build.components?.length || 0} components selected
              </p>
            </CardHeader>
            <CardContent>
              {build.components && build.components.length > 0 ? (
                <div className="space-y-4">
                  {build.components.map((buildComponent: BuildComponent) => (
                    <div key={buildComponent.id} className="flex items-center space-x-4 p-4 border border-secondary-200 rounded-lg">
                      <div className="text-2xl flex-shrink-0">
                        {getComponentCategoryIcon(buildComponent.component.category?.name ?? '')}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-secondary-900">
                          {buildComponent.component.name}
                        </h3>
                        <p className="text-sm text-secondary-600">
                          {buildComponent.component.category?.displayName ?? 'Unknown Category'} • {buildComponent.component.brand}
                        </p>
                        {buildComponent.quantity > 1 && (
                          <p className="text-sm text-secondary-500">
                            Quantity: {buildComponent.quantity}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-primary-600">
                          {formatPrice(buildComponent.component.price)}
                        </p>
                        {buildComponent.quantity > 1 && (
                          <p className="text-sm text-secondary-500">
                            Total: {formatPrice((buildComponent.component.price || 0) * buildComponent.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-secondary-500">
                  No components added to this build yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Build Summary */}
          <Card className="sticky top-8">
            <CardHeader>
              <h3 className="text-xl font-semibold text-secondary-900">Build Summary</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Components:</span>
                  <span className="font-semibold text-secondary-900">
                    {build.components?.length || 0}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary-600">Use Case:</span>
                  <span className="font-semibold text-secondary-900">
                    {build.useCase || 'General'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary-600">Visibility:</span>
                  <span className="font-semibold text-secondary-900">
                    {build.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-secondary-600">Created:</span>
                  <span className="font-semibold text-secondary-900">
                    {formatDate(build.createdAt)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-secondary-900">Total Price:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(build.totalPrice)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" size="lg">
                  Clone This Build
                </Button>
                <Button variant="outline" className="w-full">
                  Save to Favorites
                </Button>
                <Button variant="outline" className="w-full">
                  Share Build
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Builder Info */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-secondary-900">Builder</h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">
                    {build.user?.username?.[0]?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-secondary-900">
                    {build.user?.username || 'Anonymous'}
                  </p>
                  <p className="text-sm text-secondary-600">
                    {build.user?.firstName && build.user?.lastName 
                      ? `${build.user.firstName} ${build.user.lastName}`
                      : 'Community Builder'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
