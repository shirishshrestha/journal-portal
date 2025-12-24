import { useGetRoleList } from './query/useGetRoleList';
import { clearStoredRole, useCurrentRole } from './useCurrentRole';
import useRoleRedirect from './useRoleRedirect';
import { useToggle } from './useToggle';
import { useGetJournals } from './useGetJournals';
import { useGetTaxonomyTree } from './useGetTaxonomyTree';
import { useGetMyAnalytics } from './useGetMyAnalytics';
import { useSaveSuperdocDocument } from './mutation/useSaveSuperdocDocument';
import { useGetMe } from './useGetMe';
import { useDownloadDocument } from './useDownloadDocument';
import { useGetRORInstitution } from './useGetRORInstitution';

// Achievement hooks
import { useGetBadges } from './query/useGetBadges';
import { useGetMyBadges } from './query/useGetMyBadges';
import { useGetAwards } from './query/useGetAwards';
import { useGetLeaderboards } from './query/useGetLeaderboards';
import { useGetTopReviewers } from './query/useGetTopReviewers';
import { useGetMyCertificates } from './query/useGetMyCertificates';
import { useGetBestReviewer } from './query/useGetBestReviewer';
import { useGetResearcherOfYear } from './query/useGetResearcherOfYear';
import { useVerifyCertificate } from './query/useVerifyCertificate';
import { useGenerateAwardCertificate } from './mutation/useGenerateAwardCertificate';
import { useGenerateCertificatePDF } from './mutation/useGenerateCertificatePDF';
import { useUpdateLeaderboards } from './mutation/useUpdateLeaderboards';

export {
  useToggle,
  useRoleRedirect,
  useGetRoleList,
  useCurrentRole,
  clearStoredRole,
  useGetJournals,
  useGetTaxonomyTree,
  useGetMyAnalytics,
  useSaveSuperdocDocument,
  useGetMe,
  useDownloadDocument,
  useGetRORInstitution,
  // Achievements
  useGetBadges,
  useGetMyBadges,
  useGetAwards,
  useGetLeaderboards,
  useGetTopReviewers,
  useGetMyCertificates,
  useGetBestReviewer,
  useGetResearcherOfYear,
  useVerifyCertificate,
  useGenerateAwardCertificate,
  useGenerateCertificatePDF,
  useUpdateLeaderboards,
};
