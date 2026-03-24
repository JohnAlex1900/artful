import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSiteContent } from "@/lib/cms";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content-defaults";
import type { SiteContent } from "@/lib/site-content-schema";

const CmsPreviewContext = createContext<SiteContent | null>(null);

type CmsPreviewProviderProps = {
  content: SiteContent;
  children: ReactNode;
};

export function CmsPreviewProvider({ content, children }: CmsPreviewProviderProps) {
  return <CmsPreviewContext.Provider value={content}>{children}</CmsPreviewContext.Provider>;
}

export function useResolvedSiteContent(): SiteContent {
  const previewContent = useContext(CmsPreviewContext);

  const { data } = useQuery({
    queryKey: ["site-content"],
    queryFn: getSiteContent,
    enabled: !previewContent,
    staleTime: Infinity,
  });

  return previewContent ?? data ?? DEFAULT_SITE_CONTENT;
}
