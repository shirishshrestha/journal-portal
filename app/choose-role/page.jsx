'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { PenTool, CheckCircle2, ArrowRight, FileText, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Full list of roles
const ROLES = [
  {
    id: 'EDITOR',
    title: 'Editor',
    description:
      'Manage journal submissions, oversee review process, and handle publication workflows',
    icon: FileText,
    color: 'from-blue-500/20 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/10',
    borderColor:
      'border-blue-400/40 hover:border-blue-500/60 dark:border-blue-500/30 dark:hover:border-blue-400/50',
    iconBoxColor:
      'bg-blue-200/50 text-blue-600 group-hover:bg-blue-300/50 group-hover:text-blue-700 dark:bg-blue-700/50 dark:text-blue-300 dark:group-hover:bg-blue-600/50 dark:group-hover:text-blue-200',
  },
  {
    id: 'AUTHOR',
    title: 'Author',
    description: 'Submit manuscripts, track publication status, and manage your submissions',
    icon: PenTool,
    color: 'from-amber-500/20 to-amber-600/10 dark:from-amber-500/20 dark:to-amber-600/10',
    borderColor:
      'border-amber-400/40 hover:border-amber-500/60 dark:border-amber-500/30 dark:hover:border-amber-400/50',
    iconBoxColor:
      'bg-amber-200/50 text-amber-600 group-hover:bg-amber-300/50 group-hover:text-amber-700 dark:bg-amber-700/50 dark:text-amber-300 dark:group-hover:bg-amber-600/50 dark:group-hover:text-amber-200',
  },
  {
    id: 'REVIEWER',
    title: 'Reviewer',
    description: 'Review journal submissions, provide peer feedback, and contribute to science',
    icon: CheckCircle2,
    color: 'from-emerald-500/20 to-emerald-600/10 dark:from-emerald-500/20 dark:to-emerald-600/10',
    borderColor:
      'border-emerald-400/40 hover:border-emerald-500/60 dark:border-emerald-500/30 dark:hover:border-emerald-400/50',
    iconBoxColor:
      'bg-emerald-200/50 text-emerald-600 group-hover:bg-emerald-300/50 group-hover:text-emerald-700 dark:bg-emerald-700/50 dark:text-emerald-300 dark:group-hover:bg-emerald-600/50 dark:group-hover:text-emerald-200',
  },
  {
    id: 'JOURNAL_MANAGER',
    title: 'Journal Manager',
    description: 'Manage journal settings, staff members, and editor-in-chief assignments',
    icon: BookOpen,
    color: 'from-purple-500/20 to-purple-600/10 dark:from-purple-500/20 dark:to-purple-600/10',
    borderColor:
      'border-purple-400/40 hover:border-purple-500/60 dark:border-purple-500/30 dark:hover:border-purple-400/50',
    iconBoxColor:
      'bg-purple-200/50 text-purple-600 group-hover:bg-purple-300/50 group-hover:text-purple-700 dark:bg-purple-700/50 dark:text-purple-300 dark:group-hover:bg-purple-600/50 dark:group-hover:text-purple-200',
  },
];

export default function ChooseRole() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Get roles from Redux
  const userRoles = useSelector((state) => state.auth?.userData?.roles || []);

  // Filter ROLES based on user's actual roles
  const availableRoles = ROLES.filter((role) => userRoles.includes(role.id));

  // Helper function to determine grid layout classes based on number of roles
  const getGridLayoutClasses = (roleCount) => {
    if (roleCount === 2) return 'md:grid-cols-2 mx-auto';
    if (roleCount === 3) return 'md:grid-cols-2 lg:grid-cols-3';
    return 'md:grid-cols-2 lg:grid-cols-4';
  };

  // Redirect to unauthorized if user doesn't have multiple roles
  useEffect(() => {
    if (userRoles.length <= 2) {
      router.push('/unauthorized');
    }
  }, [userRoles.length, router]);

  const handleRoleSelect = async (roleId) => {
    setSelectedRole(roleId);
    setIsLoading(true);

    // Simulate a brief delay for smooth transition
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!roleId) return;

    router.push(`/${roleId.toLowerCase()}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="relative z-10 w-full container mx-auto ">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl pt-12 sm:pt-0 md:text-5xl font-semibold text-slate-900 dark:text-white mb-4 text-balance">
            Choose Your Role
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Select how you&apos;d like to access the Journal Management System. Each role provides
            dedicated tools and workflows for managing journals, handling submissions, coordinating
            peer reviews, and supporting the publication process.
          </p>
        </div>

        {/* Role Cards */}
        <div className={`grid ${getGridLayoutClasses(availableRoles.length)} gap-6 mb-12`}>
          {availableRoles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const isOtherSelected = selectedRole && selectedRole !== role.id;

            return (
              <button
                key={role.id}
                onClick={() => !isLoading && handleRoleSelect(role.id)}
                disabled={isLoading && !isSelected}
                className="relative flex-1 group text-left transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed"
              >
                <Card
                  className={`h-full p-6 border-2 transition-all duration-300 relative backdrop-blur-sm
                    ${
                      isSelected
                        ? 'border-blue-500 bg-linear-to-br from-blue-500/30 to-blue-600/20 shadow-lg shadow-blue-500/20 dark:border-blue-400 dark:from-blue-500/30 dark:to-blue-600/20 dark:shadow-blue-500/20'
                        : isOtherSelected
                          ? 'border-slate-300 bg-slate-100/50 opacity-50 dark:border-slate-700 dark:bg-slate-800/50'
                          : `${role.borderColor} bg-linear-to-br ${role.color} hover:shadow-lg hover:shadow-slate-300/10 dark:hover:shadow-slate-500/10`
                    }
                  `}
                >
                  {/* Checkmark */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white dark:text-slate-950"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Icon */}
                  <div className="mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300
                      ${
                        isSelected
                          ? 'bg-blue-500/30 text-blue-600 dark:bg-blue-400/30 dark:text-blue-300'
                          : isOtherSelected
                            ? 'bg-slate-300/30 text-slate-600 dark:bg-slate-700/30 dark:text-slate-500'
                            : role.iconBoxColor
                      }
                    `}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3
                    className={`text-xl font-semibold mb-2 transition-colors duration-300
                    ${
                      isSelected
                        ? 'text-blue-700 dark:text-blue-200'
                        : isOtherSelected
                          ? 'text-slate-600 dark:text-slate-500'
                          : 'text-slate-900 group-hover:text-slate-800 dark:text-white dark:group-hover:text-slate-100'
                    }
                  `}
                  >
                    {role.title}
                  </h3>
                  <p
                    className={`text-sm transition-colors duration-300
                    ${
                      isSelected
                        ? 'text-blue-600/70 dark:text-blue-100/70'
                        : isOtherSelected
                          ? 'text-slate-600 dark:text-slate-500'
                          : 'text-slate-600 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300'
                    }
                  `}
                  >
                    {role.description}
                  </p>

                  {isSelected && (
                    <div className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-300 text-sm font-medium">
                      <span>Proceeding</span>
                      <ArrowRight className="w-4 h-4 animate-pulse" />
                    </div>
                  )}
                </Card>
              </button>
            );
          })}
        </div>
        {/* Action Button */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => selectedRole && handleRoleSelect(selectedRole)}
            disabled={!selectedRole || isLoading}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Proceeding...
              </>
            ) : (
              <>
                Continue as {selectedRole && ROLES.find((r) => r.id === selectedRole)?.title}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>You can change your role anytime from the dashboard navigation menu.</p>
        </div>
      </div>
    </div>
  );
}
