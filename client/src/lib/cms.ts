import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content-defaults";
import { siteContentSchema, type SiteContent } from "@/lib/site-content-schema";
import { db, isFirebaseConfigured } from "@/lib/firebase";

const CMS_COLLECTION = "cms";
const CMS_DOC_ID = "site-content";
const CMS_HISTORY_COLLECTION = "cms-admin-history";
const ADMINS_COLLECTION = "admins";

type CmsHistoryAction = "seed" | "save" | "restore";

export type CmsHistoryEntry = {
  id: string;
  content: SiteContent;
  updatedBy: string;
  action: CmsHistoryAction;
  createdAtMs: number | null;
};

function mergeWithDefaults(raw: unknown): SiteContent {
  const candidate = raw as Partial<SiteContent> | undefined;

  return siteContentSchema.parse({
    home: {
      heroSlides:
        candidate?.home?.heroSlides?.length
          ? candidate.home.heroSlides
          : DEFAULT_SITE_CONTENT.home.heroSlides,
    },
    portfolio: {
      projects:
        candidate?.portfolio?.projects?.length
          ? candidate.portfolio.projects
          : DEFAULT_SITE_CONTENT.portfolio.projects,
    },
    services:
      candidate?.services?.length
        ? candidate.services
        : DEFAULT_SITE_CONTENT.services,
    about: candidate?.about ?? DEFAULT_SITE_CONTENT.about,
    contact: candidate?.contact ?? DEFAULT_SITE_CONTENT.contact,
    servicesLanding:
      candidate?.servicesLanding ?? DEFAULT_SITE_CONTENT.servicesLanding,
    updatedAt: candidate?.updatedAt,
    updatedBy: candidate?.updatedBy,
  });
}

function firestoreOrThrow() {
  if (!db) {
    throw new Error("Firebase is not configured. Set client env vars first.");
  }
  return db;
}

function cmsDocRef() {
  const firestore = firestoreOrThrow();
  return doc(firestore, CMS_COLLECTION, CMS_DOC_ID);
}

function historyCollectionRef() {
  const firestore = firestoreOrThrow();
  return collection(firestore, CMS_HISTORY_COLLECTION);
}

async function writeContentAndHistory(
  content: SiteContent,
  updatedBy: string,
  action: CmsHistoryAction
): Promise<void> {
  const firestore = firestoreOrThrow();
  const parsed = siteContentSchema.parse(content);
  const historyRef = doc(historyCollectionRef());
  const batch = writeBatch(firestore);

  batch.set(cmsDocRef(), {
    ...parsed,
    updatedBy,
    updatedAt: serverTimestamp(),
  });

  batch.set(historyRef, {
    content: parsed,
    updatedBy,
    action,
    createdAt: serverTimestamp(),
  });

  await batch.commit();
}

export async function getSiteContent(): Promise<SiteContent> {
  if (!isFirebaseConfigured) {
    return DEFAULT_SITE_CONTENT;
  }

  const firestore = firestoreOrThrow();
  const snapshot = await getDoc(doc(firestore, CMS_COLLECTION, CMS_DOC_ID));

  if (!snapshot.exists()) {
    return DEFAULT_SITE_CONTENT;
  }

  return mergeWithDefaults(snapshot.data());
}

export async function seedSiteContentIfMissing(seedBy: string): Promise<boolean> {
  if (!isFirebaseConfigured) {
    return false;
  }

  const snapshot = await getDoc(cmsDocRef());
  if (snapshot.exists()) {
    return false;
  }

  await writeContentAndHistory(DEFAULT_SITE_CONTENT, seedBy, "seed");
  return true;
}

export async function saveSiteContent(
  content: SiteContent,
  updatedBy: string,
  action: CmsHistoryAction = "save"
): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new Error("Firebase is not configured");
  }

  await writeContentAndHistory(content, updatedBy, action);
}

export async function getCmsHistory(limitCount = 20): Promise<CmsHistoryEntry[]> {
  if (!isFirebaseConfigured) {
    return [];
  }

  const historyQuery = query(
    historyCollectionRef(),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(historyQuery);

  return snapshot.docs.map((entry) => {
    const data = entry.data() as {
      content?: unknown;
      updatedBy?: string;
      action?: CmsHistoryAction;
      createdAt?: { toMillis?: () => number };
    };

    return {
      id: entry.id,
      content: mergeWithDefaults(data.content),
      updatedBy: data.updatedBy ?? "unknown",
      action:
        data.action === "restore"
          ? "restore"
          : data.action === "seed"
            ? "seed"
            : "save",
      createdAtMs: data.createdAt?.toMillis?.() ?? null,
    };
  });
}

export async function restoreSiteContentFromHistory(
  historyId: string,
  restoredBy: string
): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new Error("Firebase is not configured");
  }

  const historyRef = doc(historyCollectionRef(), historyId);
  const historySnapshot = await getDoc(historyRef);

  if (!historySnapshot.exists()) {
    throw new Error("Selected version does not exist.");
  }

  const data = historySnapshot.data() as { content?: unknown };
  const content = mergeWithDefaults(data.content);

  await saveSiteContent(content, restoredBy, "restore");
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  if (!isFirebaseConfigured) {
    return false;
  }

  const firestore = firestoreOrThrow();
  const adminSnapshot = await getDoc(doc(firestore, ADMINS_COLLECTION, userId));

  if (!adminSnapshot.exists()) {
    return false;
  }

  const data = adminSnapshot.data() as { active?: boolean };
  return data.active !== false;
}
