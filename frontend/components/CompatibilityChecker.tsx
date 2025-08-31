'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import type { CompatibilityCheck } from '@/lib/types';

interface CompatibilityCheckerProps {
  result: CompatibilityCheck;
}

export function CompatibilityChecker({ result }: CompatibilityCheckerProps) {
  const getStatusIcon = () => {
    if (result.isCompatible && result.warnings.length === 0) {
      return {
        icon: (
          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ),
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        status: 'Fully Compatible'
      };
    } else if (result.isCompatible && result.warnings.length > 0) {
      return {
        icon: (
          <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ),
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        status: 'Compatible with Warnings'
      };
    } else {
      return {
        icon: (
          <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        ),
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        status: 'Compatibility Issues'
      };
    }
  };

  const statusInfo = getStatusIcon();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${statusInfo.bgColor}`}>
          {statusInfo.icon}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-secondary-900">
            Compatibility Check
          </h2>
          <p className={`text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.status}
          </p>
        </div>
      </div>

      {/* Errors */}
      {result.errors.length > 0 && (
        <Card className={`border-2 ${statusInfo.borderColor} ${statusInfo.bgColor}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-red-800">
                Critical Issues ({result.errors.length})
              </h3>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {result.errors.map((error, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></span>
                  <span className="text-sm text-red-800">{error}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-yellow-800">
                Warnings ({result.warnings.length})
              </h3>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {result.warnings.map((warning, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2"></span>
                  <span className="text-sm text-yellow-800">{warning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-blue-800">
                Recommendations ({result.recommendations.length})
              </h3>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></span>
                  <span className="text-sm text-blue-800">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {result.isCompatible && result.warnings.length === 0 && result.errors.length === 0 && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  Perfect Compatibility!
                </h3>
                <p className="text-sm text-green-700">
                  All selected components are fully compatible with each other. Your build is ready to go!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <div className="bg-secondary-50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-secondary-900">
              {result.componentCount || 0}
            </div>
            <div className="text-sm text-secondary-600">Components</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${result.errors.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {result.errors.length}
            </div>
            <div className="text-sm text-secondary-600">Errors</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${result.warnings.length > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
              {result.warnings.length}
            </div>
            <div className="text-sm text-secondary-600">Warnings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {result.recommendations.length}
            </div>
            <div className="text-sm text-secondary-600">Suggestions</div>
          </div>
        </div>
      </div>
    </div>
  );
}
