import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function Apps() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portal GeHfer</h1>
            <div className="flex items-center space-x-6">
              <ThemeToggle />
              <div className="flex items-center space-x-4">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.avatar}
                  alt={user?.name}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/quality"
            className="group relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col items-center"
          >
            <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <ClipboardList className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Qualidade</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
              Gestão de não conformidades e controle de qualidade
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}