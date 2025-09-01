'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getDifficultyColor, getUseCaseIcon } from '@/lib/utils';

// Mock data - replace with actual API call
const mockGuides = [
  {
    id: 1,
    title: 'First-Time Builder Guide',
    description: 'Complete step-by-step guide for building your first PC',
    difficulty: 'Beginner',
    useCase: 'General',
    views: 1250,
    createdAt: '2 years ago',
    icon: '💻',
    estimatedTime: '2-3 hours',
    components: 8,
  },
  {
    id: 2,
    title: 'Gaming PC Build Guide',
    description: 'How to build the ultimate gaming machine',
    difficulty: 'Intermediate',
    useCase: 'Gaming',
    views: 2100,
    createdAt: '2 years ago',
    icon: '🎮',
    estimatedTime: '3-4 hours',
    components: 10,
  },
  {
    id: 3,
    title: 'Workstation Build Guide',
    description: 'Professional workstation for content creators',
    difficulty: 'Advanced',
    useCase: 'Workstation',
    views: 890,
    createdAt: '2 years ago',
    icon: '💼',
    estimatedTime: '4-5 hours',
    components: 12,
  },
  {
    id: 4,
    title: 'Budget Gaming Build',
    description: 'High performance gaming on a budget',
    difficulty: 'Beginner',
    useCase: 'Gaming',
    views: 1850,
    createdAt: '1 year ago',
    icon: '💰',
    estimatedTime: '2-3 hours',
    components: 7,
  },
  {
    id: 5,
    title: 'Office PC Build',
    description: 'Perfect for productivity and office work',
    difficulty: 'Beginner',
    useCase: 'General',
    views: 950,
    createdAt: '1 year ago',
    icon: '🏢',
    estimatedTime: '1-2 hours',
    components: 6,
  },
];

export default function GuidesPage() {
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [useCaseFilter, setUseCaseFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique difficulties and use cases for filter options
  const difficulties = ['all', ...Array.from(new Set(mockGuides.map(g => g.difficulty)))];
  const useCases = ['all', ...Array.from(new Set(mockGuides.map(g => g.useCase)))];

  // Filter guides based on selected filters
  const filteredGuides = useMemo(() => {
    return mockGuides.filter(guide => {
      // Check difficulty filter
      const matchesDifficulty = difficultyFilter === 'all' || guide.difficulty === difficultyFilter;
      
      // Check use case filter  
      const matchesUseCase = useCaseFilter === 'all' || guide.useCase === useCaseFilter;
      
      // Check search term
      const matchesSearch = searchTerm === '' || 
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesDifficulty && matchesUseCase && matchesSearch;
    });
  }, [difficultyFilter, useCaseFilter, searchTerm]);

  // Get popular guides (separate from filtered guides)
  const popularGuides = mockGuides
    .sort((a, b) => b.views - a.views)
    .slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">PC Build Guides</h1>
        <p className="text-lg text-secondary-600 max-w-3xl">
          Learn how to build PCs with our comprehensive step-by-step guides. From beginner tutorials to advanced techniques.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="difficulty" className="text-sm font-medium text-secondary-700">
            Difficulty:
          </label>
          <select
            id="difficulty"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? 'All Levels' : difficulty}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="usecase" className="text-sm font-medium text-secondary-700">
            Category:
          </label>
          <select
            id="usecase"
            value={useCaseFilter}
            onChange={(e) => setUseCaseFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            {useCases.map(useCase => (
              <option key={useCase} value={useCase}>
                {useCase === 'all' ? 'All Categories' : useCase}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Search guides..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />

        {/* Clear filters button */}
        {(difficultyFilter !== 'all' || useCaseFilter !== 'all' || searchTerm) && (
          <Button
            variant="outline"
            onClick={() => {
              setDifficultyFilter('all');
              setUseCaseFilter('all');
              setSearchTerm('');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Results summary */}
      <div className="mb-6">
        <p className="text-secondary-600">
          Showing {filteredGuides.length} of {mockGuides.length} guides
          {difficultyFilter !== 'all' && (
            <span className="ml-1">• {difficultyFilter} level</span>
          )}
          {useCaseFilter !== 'all' && (
            <span className="ml-1">• {useCaseFilter} category</span>
          )}
          {searchTerm && (
            <span className="ml-1">• matching "{searchTerm}"</span>
          )}
        </p>
      </div>

      {/* Filtered Guides Grid */}
      {filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredGuides.map((guide) => (
            <Card key={guide.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="text-2xl">{guide.icon}</div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(guide.difficulty)}`}>
                    {guide.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mt-2">
                  {guide.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600 text-sm mb-4">
                  {guide.description}
                </p>
                
                <div className="space-y-2 text-xs text-secondary-500">
                  <div className="flex justify-between">
                    <span>{guide.useCase}</span>
                    <span>{guide.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{guide.estimatedTime}</span>
                    <span>{guide.components} components</span>
                  </div>
                  <div className="text-right">
                    <span>{guide.createdAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">
            No guides found
          </h3>
          <p className="text-secondary-600 mb-4">
            Try adjusting your filters or search terms to find more guides.
          </p>
          <Button
            onClick={() => {
              setDifficultyFilter('all');
              setUseCaseFilter('all');
              setSearchTerm('');
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Popular Guides Section */}
      <div className="border-t pt-12">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6 text-center">
          Popular Guides
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="text-center p-6">
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-xl font-semibold mb-2">First-Time Builder?</h3>
            <p className="text-secondary-600 mb-4">
              New to PC building? Start with our comprehensive beginner guide that covers everything from component selection to troubleshooting.
            </p>
            <Button>Start Learning</Button>
          </Card>
          
          <Card className="text-center p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Quick Reference</h3>
            <p className="text-secondary-600 mb-4">
              Already experienced? Check out our quick reference guides for specific components and common troubleshooting tips.
            </p>
            <Button variant="outline">Browse References</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
