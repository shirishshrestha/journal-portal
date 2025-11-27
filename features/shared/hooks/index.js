import { useGetRoleList } from "./query/useGetRoleList";
import { clearStoredRole, useCurrentRole } from "./useCurrentRole";
import useRoleRedirect from "./useRoleRedirect";
import { useToggle } from "./useToggle";
import { useGetJournals } from "./useGetJournals";
import { useGetTaxonomyTree } from "./useGetTaxonomyTree";
import { useGetMyAnalytics } from "./useGetMyAnalytics";
import { useSaveSuperdocDocument } from "./mutation/useSaveSuperdocDocument";
import { useGetMe } from "./useGetMe";
import { useDownloadDocument } from "./useDownloadDocument";
import { useGetRORInstitution } from "./useGetRORInstitution";

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
};
