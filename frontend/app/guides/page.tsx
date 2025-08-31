'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Select } from '@/components/ui/Input';
import { guidesAPI } from '@/lib/api';
import { formatRelativeTime, getDifficultyColor, getUseCaseIcon } from '@/lib/utils';
import type { BuildGuide } from '@/lib/types';

export default function GuidesPage() {
  const [guides, setGuides] = useState<BuildGuide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: '',
    useCase: '',
  });

  useEffect(() => {
    fetchGuides();
  }, [filters]);

  const fetchGuides = async () => {
    try {
      setIsLoading(true);
      const response = await guidesAPI.getAll({
        difficulty: filters.difficulty || undefined,
        useCase: filters.useCase || undefined,
      });
      
      if (response.success && response.data) {
        setGuides(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch guides:', error);
      // Mock data for demonstration
      setGuides([
        {
          id: '1',
          title: 'First-Time Builder Guide',
          description: 'Complete step-by-step guide for building your first PC',
          content: '',
          difficulty: 'Beginner',
          useCase: 'General',
          isPublished: true,
          views: 1250,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          title: 'Gaming PC Build Guide',
          description: 'How to build the ultimate gaming machine',
          content: '',
          difficulty: 'Intermediate',
          useCase: 'Gaming',
          isPublished: true,
          views: 2100,
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-10T10:00:00Z',
        },
        {
          id: '3',
          title: 'Workstation Build Guide',
          description: 'Professional workstation for content creators',
          content: '',
          difficulty: 'Advanced',
          useCase: 'Workstation',
          isPublished: true,
          views: 890,
          createdAt: '2024-01-05T10:00:00Z',
          updatedAt: '2024-01-05T10:00:00Z',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          PC Build Guides
        </h1>
        <p className="text-lg text-secondary-600 max-w-3xl">
          Learn how to build PCs with our comprehensive step-by-step guides. 
          From beginner tutorials to advanced techniques.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <div className="w-48">
          <Select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            placeholder="All Levels"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Select>
        </div>

        <div className="w-48">
          <Select
            value={filters.useCase}
            onChange={(e) => handleFilterChange('useCase', e.target.value)}
            placeholder="All Categories"
          >
            <option value="">All Categories</option>
            <option value="Gaming">Gaming</option>
            <option value="Workstation">Workstation</option>
            <option value="Budget">Budget</option>
            <option value="Office">Office</option>
            <option value="General">General</option>
          </Select>
        </div>
      </div>

      {/* Guides Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-secondary-200 rounded mb-2"></div>
                <div className="h-3 bg-secondary-200 rounded mb-4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-secondary-200 rounded mb-2"></div>
                <div className="h-3 bg-secondary-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : guides.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">
            No guides found
          </h3>
          <p className="text-secondary-600">
            Try adjusting your filters or check back later for new guides.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Link key={guide.id} href={`/guides/${guide.id}`}>
              <Card hover className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">
                      {getUseCaseIcon(guide.useCase)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-secondary-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {guide.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-600 text-sm line-clamp-3 mb-4">
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-secondary-500">
                    <span>{guide.useCase}</span>
                    <span>{guide.views.toLocaleString()} views</span>
                  </div>
                  <div className="text-xs text-secondary-400 mt-2">
                    {formatRelativeTime(guide.createdAt)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Featured Guides */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-secondary-900 mb-8 text-center">
          Popular Guides
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="text-center p-8">
            <div className="text-4xl mb-4">🔰</div>
            <h3 className="text-xl font-semibold mb-4">First-Time Builder?</h3>
            <p className="text-secondary-600 mb-6">
              New to PC building? Start with our comprehensive beginner guide that covers everything from selecting parts to troubleshooting.
            </p>
            <Link href="/guides/beginner">
              <button className="btn-primary">
                Start Learning
              </button>
            </Link>
          </Card>

          <Card className="text-center p-8">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-4">Quick Reference</h3>
            <p className="text-secondary-600 mb-6">
              Already experienced? Check out our quick reference guides for specific components and common troubleshooting scenarios.
            </p>
            <Link href="/guides/reference">
              <button className="btn-secondary">
                Browse Reference
              </button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
