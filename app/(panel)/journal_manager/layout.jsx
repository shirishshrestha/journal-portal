'use client';

import { RoleBasedRoute } from '@/features';

export default function JournalManagerLayout({ children }) {
  return <RoleBasedRoute allowedRoles={['JOURNAL_MANAGER']}>{children}</RoleBasedRoute>;
}
