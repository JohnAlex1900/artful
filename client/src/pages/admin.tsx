import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Plus, Save, Trash2, LogOut, ShieldAlert, Upload } from "lucide-react";
import { auth, firebaseMissingConfig, isFirebaseConfigured } from "@/lib/firebase";
import {
  getCmsHistory,
  getSiteContent,
  isUserAdmin,
  restoreSiteContentFromHistory,
  seedSiteContentIfMissing,
  saveSiteContent,
} from "@/lib/cms";
import { siteContentSchema, type SiteContent, type ServiceNode } from "@/lib/site-content-schema";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content-defaults";
import { uploadCmsImage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type FlatServiceNode = {
  path: number[];
  title: string;
  description: string;
  images: string[];
};

function flattenServices(nodes: ServiceNode[], prefix: number[] = []): FlatServiceNode[] {
  return nodes.flatMap((node, index) => {
    const path = [...prefix, index];
    const current: FlatServiceNode = {
      path,
      title: node.title,
      description: node.description,
      images: node.images,
    };

    const children = node.subServices?.length
      ? flattenServices(node.subServices, path)
      : [];

    return [current, ...children];
  });
}

function updateServiceByPath(
  services: ServiceNode[],
  path: number[],
  updater: (node: ServiceNode) => ServiceNode
): ServiceNode[] {
  if (path.length === 0) {
    return services;
  }

  const [head, ...tail] = path;
  return services.map((service, index) => {
    if (index !== head) {
      return service;
    }

    if (tail.length === 0) {
      return updater(service);
    }

    return {
      ...service,
      subServices: updateServiceByPath(service.subServices ?? [], tail, updater),
    };
  });
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (toIndex < 0 || toIndex >= items.length) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdminVerified, setIsAdminVerified] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<
    "home" | "portfolio" | "services" | "about" | "contact" | "servicesLanding" | "history"
  >("home");
  const [showAdvancedJson, setShowAdvancedJson] = useState(false);

  const [draft, setDraft] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [jsonDraft, setJsonDraft] = useState(JSON.stringify(DEFAULT_SITE_CONTENT, null, 2));

  const editorSections = [
    { id: "home", label: "Home Page" },
    { id: "portfolio", label: "Portfolio" },
    { id: "services", label: "Service Details" },
    { id: "about", label: "About Page" },
    { id: "contact", label: "Contact Page" },
    { id: "servicesLanding", label: "Services Page" },
    { id: "history", label: "Version History" },
  ] as const;

  const allowedAdminEmails = useMemo(() => {
    const raw = import.meta.env.VITE_ADMIN_EMAILS as string | undefined;
    if (!raw) {
      return [];
    }
    return raw
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean);
  }, []);

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setIsAdminVerified(false);
        setAuthLoading(false);
        return;
      }

      const emailAllowed =
        allowedAdminEmails.length === 0 ||
        (nextUser.email ? allowedAdminEmails.includes(nextUser.email.toLowerCase()) : false);

      if (!emailAllowed) {
        if (auth) {
          await signOut(auth);
        }
        setIsAdminVerified(false);
        setAuthLoading(false);
        toast({
          title: "Access denied",
          description: "This account is not listed as an administrator.",
          variant: "destructive",
        });
        return;
      }

      try {
        const adminAccess = await isUserAdmin(nextUser.uid);
        setIsAdminVerified(adminAccess);

        if (!adminAccess) {
          toast({
            title: "Not authorized",
            description:
              `Add Firestore document admins/${nextUser.uid} with active: true, then refresh this page.`,
            variant: "destructive",
          });
        }
      } catch (error) {
        setIsAdminVerified(false);
        toast({
          title: "Admin check failed",
          description: "Could not verify admin access from Firestore.",
          variant: "destructive",
        });
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [allowedAdminEmails, toast]);

  const siteContentQuery = useQuery({
    queryKey: ["site-content"],
    queryFn: getSiteContent,
    enabled: isFirebaseConfigured && isAdminVerified,
  });

  const historyQuery = useQuery({
    queryKey: ["cms-history"],
    queryFn: () => getCmsHistory(25),
    enabled: isFirebaseConfigured && isAdminVerified,
  });

  useEffect(() => {
    if (!isFirebaseConfigured || !isAdminVerified || !user?.email) {
      return;
    }

    const adminEmail = user.email;

    void (async () => {
      try {
        const seeded = await seedSiteContentIfMissing(adminEmail);
        if (!seeded) {
          return;
        }

        toast({
          title: "Initial CMS data created",
          description: "Existing website defaults were seeded into Firestore.",
        });

        await queryClient.invalidateQueries({ queryKey: ["site-content"] });
        await queryClient.invalidateQueries({ queryKey: ["cms-history"] });
      } catch {
        toast({
          title: "Initial seed failed",
          description: "Could not seed Firestore defaults. Check Firebase rules.",
          variant: "destructive",
        });
      }
    })();
  }, [isAdminVerified, queryClient, toast, user?.email]);

  useEffect(() => {
    if (siteContentQuery.data) {
      setDraft(siteContentQuery.data);
      setJsonDraft(JSON.stringify(siteContentQuery.data, null, 2));
    }
  }, [siteContentQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (content: SiteContent) => {
      if (!user?.email) {
        throw new Error("No authenticated admin user found");
      }
      await saveSiteContent(content, user.email);
    },
    onSuccess: async () => {
      toast({
        title: "Saved",
        description: "Website content has been updated successfully.",
      });
      await queryClient.invalidateQueries({ queryKey: ["site-content"] });
      await queryClient.invalidateQueries({ queryKey: ["cms-history"] });
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "Could not save CMS content. Check Firebase settings and rules.",
        variant: "destructive",
      });
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (historyId: string) => {
      if (!user?.email) {
        throw new Error("No authenticated admin user found");
      }

      await restoreSiteContentFromHistory(historyId, user.email);
    },
    onSuccess: async () => {
      toast({
        title: "Version restored",
        description: "Selected version has been restored and saved as a new version.",
      });

      await queryClient.invalidateQueries({ queryKey: ["site-content"] });
      await queryClient.invalidateQueries({ queryKey: ["cms-history"] });
    },
    onError: () => {
      toast({
        title: "Restore failed",
        description: "Could not restore this version. Please try again.",
        variant: "destructive",
      });
    },
  });

  const login = async () => {
    if (!auth) {
      toast({
        title: "Firebase not configured",
        description: "Add the Firebase env variables before signing in.",
        variant: "destructive",
      });
      return;
    }

    try {
      setAuthLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setPassword("");
    } catch {
      setAuthLoading(false);
      toast({
        title: "Sign in failed",
        description: "Check email/password and ensure this user exists in Firebase Auth.",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    if (!auth) {
      return;
    }
    await signOut(auth);
    setIsAdminVerified(false);
  };

  const addHeroSlide = () => {
    setDraft((prev) => ({
      ...prev,
      home: {
        ...prev.home,
        heroSlides: [
          ...prev.home.heroSlides,
          {
            image: "https://images.unsplash.com/photo-1523419409543-7df8c4d0205d",
            headline: "New Headline",
            subheadline: "New subheadline",
            ctaText: "Explore",
            ctaLink: "/portfolio",
          },
        ],
      },
    }));
  };

  const addProject = () => {
    setDraft((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        projects: [
          ...prev.portfolio.projects,
          {
            id: `project-${Date.now()}`,
            title: "New Project",
            category: "residential",
            categoryLabel: "RESIDENTIAL",
            images: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd"],
            description: "Describe this project.",
            location: "Nairobi",
            size: "1,000 sq ft",
            duration: "1 month",
            client: "Private Client",
          },
        ],
      },
    }));
  };

  const addServiceLandingCard = () => {
    setDraft((prev) => ({
      ...prev,
      servicesLanding: {
        ...prev.servicesLanding,
        cards: [
          ...prev.servicesLanding.cards,
          {
            id: `service-card-${Date.now()}`,
            title: "New Service",
            subtitle: "Short subtitle",
            description: "Describe this service offering.",
            icon: "building",
            image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
            features: ["Feature 1"],
            process: ["Step 1"],
          },
        ],
      },
    }));
  };

  const saveVisualDraft = () => {
    const parsed = siteContentSchema.safeParse(draft);
    if (!parsed.success) {
      toast({
        title: "Validation error",
        description: parsed.error.issues[0]?.message ?? "Invalid content payload.",
        variant: "destructive",
      });
      return;
    }

    setJsonDraft(JSON.stringify(parsed.data, null, 2));
    saveMutation.mutate(parsed.data);
  };

  const saveJsonDraft = () => {
    try {
      const parsed = siteContentSchema.parse(JSON.parse(jsonDraft));
      setDraft(parsed);
      saveMutation.mutate(parsed);
    } catch {
      toast({
        title: "Invalid JSON",
        description: "Fix the JSON payload before saving.",
        variant: "destructive",
      });
    }
  };

  const uploadImage = async (
    file: File,
    fieldKey: string,
    folder: string,
    applyUrl: (url: string) => void
  ) => {
    if (!user) {
      toast({
        title: "Upload blocked",
        description: "Sign in to upload images.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingField(fieldKey);
      const url = await uploadCmsImage(file, folder, user.uid);
      applyUrl(url);
      toast({
        title: "Upload complete",
        description: "Image uploaded and URL applied to this field.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not upload this image.",
        variant: "destructive",
      });
    } finally {
      setUploadingField((current) => (current === fieldKey ? null : current));
    }
  };

  const flatServices = useMemo(() => flattenServices(draft.services), [draft.services]);

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-charcoal-900 text-cream-100 p-6 md:p-12">
        <div className="max-w-4xl mx-auto bg-charcoal-800/80 border border-charcoal-700 rounded-3xl p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-6 h-6 text-gold-500" />
            <h1 className="font-serif text-3xl font-bold">Admin Setup Required</h1>
          </div>
          <p className="text-cream-200 mb-6">
            Firebase is not configured. Fill client/.env from client/.env.example and restart the dev server.
          </p>
          <p className="text-cream-300 text-sm">Missing keys: {firebaseMissingConfig.join(", ")}</p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return <div className="min-h-screen bg-cream-50 grid place-items-center">Loading admin...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f5ede0,_#f1e4cd_40%,_#e9d7bb_80%)] p-6 md:p-12">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-gold-100">
          <h1 className="font-serif text-3xl text-charcoal-800 mb-2">Admin Login</h1>
          <p className="text-charcoal-600 mb-6">Sign in to manage images and website content.</p>

          <div className="space-y-4">
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@yourcompany.com"
              type="email"
            />
            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              type="password"
            />
            <Button className="w-full bg-charcoal-800 hover:bg-charcoal-700" onClick={login}>
              Sign In
            </Button>
          </div>

          <p className="text-xs text-charcoal-500 mt-4">
            Add this user to Firestore admins/{`{uid}`} with active: true.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdminVerified) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f5ede0,_#f1e4cd_40%,_#e9d7bb_80%)] p-6 md:p-12">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-gold-100 space-y-4">
          <h1 className="font-serif text-3xl text-charcoal-800">Admin Access Setup</h1>
          <p className="text-charcoal-600">
            You are signed in, but this account is not yet granted admin access in Firestore.
          </p>
          <div className="bg-cream-50 border border-cream-200 rounded-xl p-4 text-sm space-y-2">
            <p className="text-charcoal-700">
              <span className="font-semibold">Email:</span> {user.email ?? "No email"}
            </p>
            <p className="text-charcoal-700 break-all">
              <span className="font-semibold">UID:</span> {user.uid}
            </p>
          </div>
          <div className="text-sm text-charcoal-700 space-y-1">
            <p>1. Open Firestore and create collection: admins</p>
            <p>2. Create document ID: {user.uid}</p>
            <p>3. Add field active = true (boolean)</p>
            <p>4. Refresh this page</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-cream-200">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl text-charcoal-800">Artful CMS Admin</h1>
            <p className="text-sm text-charcoal-600">Manage hero slides, portfolio, and all services images in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8 space-y-10">
        {siteContentQuery.isLoading ? <p>Loading content...</p> : null}

        <section className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
          <h2 className="font-serif text-2xl text-charcoal-800 mb-2">Simple Website Editor</h2>
          <p className="text-sm text-charcoal-600 mb-5">
            Choose one website page below, make your updates, then click Save All Changes.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {editorSections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "outline"}
                className={activeSection === section.id ? "bg-charcoal-800 hover:bg-charcoal-700" : ""}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </Button>
            ))}
          </div>
        </section>

        <section className={`bg-white rounded-2xl p-6 shadow-sm border border-cream-200 ${activeSection !== "home" ? "hidden" : ""}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl text-charcoal-800">Home Page Banners</h2>
              <p className="text-sm text-charcoal-600">Update headline banners shown on your homepage.</p>
            </div>
            <Button onClick={addHeroSlide} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add New Banner
            </Button>
          </div>

          <div className="space-y-8">
            {draft.home.heroSlides.map((slide, index) => (
              <div key={`slide-${index}`} className="border border-cream-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-charcoal-800">Banner {index + 1}</h3>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setDraft((prev) => ({
                        ...prev,
                        home: {
                          ...prev.home,
                          heroSlides: prev.home.heroSlides.filter((_, i) => i !== index),
                        },
                      }));
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Banner
                  </Button>
                </div>

                <div className="grid lg:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <div className="rounded-xl overflow-hidden border border-cream-200 bg-cream-50">
                      <img
                        src={slide.image}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-charcoal-800">Banner Image Link</label>
                      <Input
                        value={slide.image}
                        onChange={(event) => {
                          const value = event.target.value;
                          setDraft((prev) => ({
                            ...prev,
                            home: {
                              ...prev.home,
                              heroSlides: prev.home.heroSlides.map((current, i) =>
                                i === index ? { ...current, image: value } : current
                              ),
                            },
                          }));
                        }}
                        placeholder="Paste image URL"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-charcoal-800">Or Upload Image</label>
                      <Input
                        type="file"
                        accept="image/*"
                        disabled={uploadingField === `hero-${index}`}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) {
                            return;
                          }

                          void uploadImage(file, `hero-${index}`, "cms/home/hero", (url) => {
                            setDraft((prev) => ({
                              ...prev,
                              home: {
                                ...prev.home,
                                heroSlides: prev.home.heroSlides.map((current, i) =>
                                  i === index ? { ...current, image: url } : current
                                ),
                              },
                            }));
                          });
                          event.target.value = "";
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-charcoal-800">Main Heading</label>
                      <Input
                        value={slide.headline}
                        onChange={(event) => {
                          const value = event.target.value;
                          setDraft((prev) => ({
                            ...prev,
                            home: {
                              ...prev.home,
                              heroSlides: prev.home.heroSlides.map((current, i) =>
                                i === index ? { ...current, headline: value } : current
                              ),
                            },
                          }));
                        }}
                        placeholder="Example: Luxury Interior Design in Kenya"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-charcoal-800">Short Description</label>
                      <Textarea
                        value={slide.subheadline}
                        onChange={(event) => {
                          const value = event.target.value;
                          setDraft((prev) => ({
                            ...prev,
                            home: {
                              ...prev.home,
                              heroSlides: prev.home.heroSlides.map((current, i) =>
                                i === index ? { ...current, subheadline: value } : current
                              ),
                            },
                          }));
                        }}
                        placeholder="One clear line that explains this banner"
                        className="min-h-24"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold text-charcoal-800">Button Text</label>
                        <Input
                          value={slide.ctaText}
                          onChange={(event) => {
                            const value = event.target.value;
                            setDraft((prev) => ({
                              ...prev,
                              home: {
                                ...prev.home,
                                heroSlides: prev.home.heroSlides.map((current, i) =>
                                  i === index ? { ...current, ctaText: value } : current
                                ),
                              },
                            }));
                          }}
                          placeholder="Explore Our Work"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-charcoal-800">Button Link</label>
                        <Input
                          value={slide.ctaLink}
                          onChange={(event) => {
                            const value = event.target.value;
                            setDraft((prev) => ({
                              ...prev,
                              home: {
                                ...prev.home,
                                heroSlides: prev.home.heroSlides.map((current, i) =>
                                  i === index ? { ...current, ctaLink: value } : current
                                ),
                              },
                            }));
                          }}
                          placeholder="/portfolio"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={`bg-white rounded-2xl p-6 shadow-sm border border-cream-200 ${activeSection !== "portfolio" ? "hidden" : ""}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl text-charcoal-800">Portfolio Projects</h2>
              <p className="text-sm text-charcoal-600">Manage project cards shown in your public portfolio.</p>
            </div>
            <Button onClick={addProject} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add New Project
            </Button>
          </div>

          <div className="space-y-8">
            {draft.portfolio.projects.map((project, index) => (
              <div key={project.id} className="border border-cream-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-charcoal-800">Project {index + 1}</h3>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setDraft((prev) => ({
                        ...prev,
                        portfolio: {
                          ...prev.portfolio,
                          projects: prev.portfolio.projects.filter((_, i) => i !== index),
                        },
                      }));
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Project
                  </Button>
                </div>

                {project.images[0] ? (
                  <div className="rounded-xl overflow-hidden border border-cream-200 bg-cream-50">
                    <img src={project.images[0]} alt={project.title} className="w-full h-52 object-cover" />
                  </div>
                ) : null}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-charcoal-800">Project Code</label>
                    <Input
                      value={project.id}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDraft((prev) => ({
                          ...prev,
                          portfolio: {
                            ...prev.portfolio,
                            projects: prev.portfolio.projects.map((current, i) =>
                              i === index ? { ...current, id: value } : current
                            ),
                          },
                        }));
                      }}
                      placeholder="project-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-charcoal-800">Project Title</label>
                    <Input
                      value={project.title}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDraft((prev) => ({
                          ...prev,
                          portfolio: {
                            ...prev.portfolio,
                            projects: prev.portfolio.projects.map((current, i) =>
                              i === index ? { ...current, title: value } : current
                            ),
                          },
                        }));
                      }}
                      placeholder="Elegant Living Room Redesign"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-charcoal-800">Category Key</label>
                    <Input
                      value={project.category}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDraft((prev) => ({
                          ...prev,
                          portfolio: {
                            ...prev.portfolio,
                            projects: prev.portfolio.projects.map((current, i) =>
                              i === index ? { ...current, category: value } : current
                            ),
                          },
                        }));
                      }}
                      placeholder="residential"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-charcoal-800">Category Name</label>
                    <Input
                      value={project.categoryLabel}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDraft((prev) => ({
                          ...prev,
                          portfolio: {
                            ...prev.portfolio,
                            projects: prev.portfolio.projects.map((current, i) =>
                              i === index ? { ...current, categoryLabel: value } : current
                            ),
                          },
                        }));
                      }}
                      placeholder="RESIDENTIAL"
                    />
                  </div>
                </div>

                <Textarea
                  value={project.description}
                  onChange={(event) => {
                    const value = event.target.value;
                    setDraft((prev) => ({
                      ...prev,
                      portfolio: {
                        ...prev.portfolio,
                        projects: prev.portfolio.projects.map((current, i) =>
                          i === index ? { ...current, description: value } : current
                        ),
                      },
                    }));
                  }}
                  placeholder="Project description"
                  className="min-h-28"
                />

                <div className="grid md:grid-cols-4 gap-4">
                  <Input
                    value={project.location}
                    onChange={(event) => {
                      const value = event.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        portfolio: {
                          ...prev.portfolio,
                          projects: prev.portfolio.projects.map((current, i) =>
                            i === index ? { ...current, location: value } : current
                          ),
                        },
                      }));
                    }}
                    placeholder="Location"
                  />
                  <Input
                    value={project.size}
                    onChange={(event) => {
                      const value = event.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        portfolio: {
                          ...prev.portfolio,
                          projects: prev.portfolio.projects.map((current, i) =>
                            i === index ? { ...current, size: value } : current
                          ),
                        },
                      }));
                    }}
                    placeholder="Size"
                  />
                  <Input
                    value={project.duration}
                    onChange={(event) => {
                      const value = event.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        portfolio: {
                          ...prev.portfolio,
                          projects: prev.portfolio.projects.map((current, i) =>
                            i === index ? { ...current, duration: value } : current
                          ),
                        },
                      }));
                    }}
                    placeholder="Duration"
                  />
                  <Input
                    value={project.client}
                    onChange={(event) => {
                      const value = event.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        portfolio: {
                          ...prev.portfolio,
                          projects: prev.portfolio.projects.map((current, i) =>
                            i === index ? { ...current, client: value } : current
                          ),
                        },
                      }));
                    }}
                    placeholder="Client"
                  />
                </div>

                <div className="space-y-2">
                  {project.images.map((image, imageIndex) => (
                    <div className="space-y-2" key={`${project.id}-image-${imageIndex}`}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-500">
                        Project Image {imageIndex + 1}
                      </p>
                      <div className="rounded-lg overflow-hidden border border-cream-200 bg-cream-50">
                        <img src={image} alt={`${project.title} ${imageIndex + 1}`} className="w-full h-44 object-cover" />
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={image}
                          onChange={(event) => {
                            const value = event.target.value;
                            setDraft((prev) => ({
                              ...prev,
                              portfolio: {
                                ...prev.portfolio,
                                projects: prev.portfolio.projects.map((current, i) =>
                                  i === index
                                    ? {
                                        ...current,
                                        images: current.images.map((currentImage, i2) =>
                                          i2 === imageIndex ? value : currentImage
                                        ),
                                      }
                                    : current
                                ),
                              },
                            }));
                          }}
                          placeholder="Image URL"
                        />
                        <Button
                          variant="outline"
                          disabled={imageIndex === 0}
                          onClick={() => {
                            setDraft((prev) => ({
                              ...prev,
                              portfolio: {
                                ...prev.portfolio,
                                projects: prev.portfolio.projects.map((current, i) =>
                                  i === index
                                    ? { ...current, images: moveItem(current.images, imageIndex, imageIndex - 1) }
                                    : current
                                ),
                              },
                            }));
                          }}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          disabled={imageIndex === project.images.length - 1}
                          onClick={() => {
                            setDraft((prev) => ({
                              ...prev,
                              portfolio: {
                                ...prev.portfolio,
                                projects: prev.portfolio.projects.map((current, i) =>
                                  i === index
                                    ? { ...current, images: moveItem(current.images, imageIndex, imageIndex + 1) }
                                    : current
                                ),
                              },
                            }));
                          }}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setDraft((prev) => ({
                              ...prev,
                              portfolio: {
                                ...prev.portfolio,
                                projects: prev.portfolio.projects.map((current, i) =>
                                  i === index
                                    ? {
                                        ...current,
                                        images: current.images.filter((_, i2) => i2 !== imageIndex),
                                      }
                                    : current
                                ),
                              },
                            }));
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-charcoal-500" />
                        <Input
                          type="file"
                          accept="image/*"
                          disabled={uploadingField === `portfolio-${project.id}-${imageIndex}`}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (!file) {
                              return;
                            }

                            void uploadImage(
                              file,
                              `portfolio-${project.id}-${imageIndex}`,
                              `cms/portfolio/${project.id}`,
                              (url) => {
                                setDraft((prev) => ({
                                  ...prev,
                                  portfolio: {
                                    ...prev.portfolio,
                                    projects: prev.portfolio.projects.map((current, i) =>
                                      i === index
                                        ? {
                                            ...current,
                                            images: current.images.map((currentImage, i2) =>
                                              i2 === imageIndex ? url : currentImage
                                            ),
                                          }
                                        : current
                                    ),
                                  },
                                }));
                              }
                            );
                            event.target.value = "";
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDraft((prev) => ({
                        ...prev,
                        portfolio: {
                          ...prev.portfolio,
                          projects: prev.portfolio.projects.map((current, i) =>
                            i === index
                              ? {
                                  ...current,
                                  images: [...current.images, "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd"],
                                }
                              : current
                          ),
                        },
                      }));
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                </div>

              </div>
            ))}
          </div>
        </section>

        <section className={`bg-white rounded-2xl p-6 shadow-sm border border-cream-200 ${activeSection !== "services" ? "hidden" : ""}`}>
          <h2 className="font-serif text-2xl text-charcoal-800 mb-6">Services Image Manager</h2>
          <p className="text-sm text-charcoal-600 mb-6">
            This updates image galleries used in all service detail pages.
          </p>

          <div className="space-y-6 max-h-[42rem] overflow-auto pr-2">
            {flatServices.map((service) => (
              <div key={service.path.join("-")} className="border border-cream-200 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-charcoal-800">{service.title}</h3>
                <Textarea
                  value={service.description}
                  onChange={(event) => {
                    const value = event.target.value;
                    setDraft((prev) => ({
                      ...prev,
                      services: updateServiceByPath(prev.services, service.path, (node) => ({
                        ...node,
                        description: value,
                      })),
                    }));
                  }}
                  className="min-h-20"
                />

                <div className="space-y-2">
                  {service.images.map((image, imageIndex) => (
                    <div className="space-y-2" key={`${service.path.join("-")}-${imageIndex}`}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-500">
                        Service Image {imageIndex + 1}
                      </p>
                      <div className="rounded-lg overflow-hidden border border-cream-200 bg-cream-50">
                        <img src={image} alt={`${service.title} ${imageIndex + 1}`} className="w-full h-40 object-cover" />
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={image}
                          onChange={(event) => {
                            const value = event.target.value;
                            setDraft((prev) => ({
                              ...prev,
                              services: updateServiceByPath(prev.services, service.path, (node) => ({
                                ...node,
                                images: node.images.map((currentImage, i) => (i === imageIndex ? value : currentImage)),
                              })),
                            }));
                          }}
                        />
                        <Button
                          variant="outline"
                          disabled={imageIndex === 0}
                          onClick={() => {
                            setDraft((prev) => ({
                              ...prev,
                              services: updateServiceByPath(prev.services, service.path, (node) => ({
                                ...node,
                                images: moveItem(node.images, imageIndex, imageIndex - 1),
                              })),
                            }));
                          }}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          disabled={imageIndex === service.images.length - 1}
                          onClick={() => {
                            setDraft((prev) => ({
                              ...prev,
                              services: updateServiceByPath(prev.services, service.path, (node) => ({
                                ...node,
                                images: moveItem(node.images, imageIndex, imageIndex + 1),
                              })),
                            }));
                          }}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setDraft((prev) => ({
                              ...prev,
                              services: updateServiceByPath(prev.services, service.path, (node) => ({
                                ...node,
                                images: node.images.filter((_, i) => i !== imageIndex),
                              })),
                            }));
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-charcoal-500" />
                        <Input
                          type="file"
                          accept="image/*"
                          disabled={uploadingField === `service-${service.path.join("-")}-${imageIndex}`}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (!file) {
                              return;
                            }

                            void uploadImage(
                              file,
                              `service-${service.path.join("-")}-${imageIndex}`,
                              `cms/services/${service.path.join("-")}`,
                              (url) => {
                                setDraft((prev) => ({
                                  ...prev,
                                  services: updateServiceByPath(prev.services, service.path, (node) => ({
                                    ...node,
                                    images: node.images.map((currentImage, i) => (i === imageIndex ? url : currentImage)),
                                  })),
                                }));
                              }
                            );
                            event.target.value = "";
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setDraft((prev) => ({
                      ...prev,
                      services: updateServiceByPath(prev.services, service.path, (node) => ({
                        ...node,
                        images: [...node.images, "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd"],
                      })),
                    }));
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service Image
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className={`bg-white rounded-2xl p-6 shadow-sm border border-cream-200 ${activeSection !== "about" ? "hidden" : ""}`}>
          <h2 className="font-serif text-2xl text-charcoal-800 mb-2">About Page</h2>
          <p className="text-sm text-charcoal-600 mb-6">Tell visitors your story, mission, and show your studio image.</p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-charcoal-800">Main Page Title</label>
              <Input
                value={draft.about.heroTitle}
                onChange={(event) => {
                  setDraft((prev) => ({
                    ...prev,
                    about: { ...prev.about, heroTitle: event.target.value },
                  }));
                }}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-charcoal-800">Intro Text</label>
              <Textarea
                value={draft.about.heroSubtitle}
                onChange={(event) => {
                  setDraft((prev) => ({
                    ...prev,
                    about: { ...prev.about, heroSubtitle: event.target.value },
                  }));
                }}
                className="min-h-20"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-charcoal-800">Story Section Title</label>
              <Input
                value={draft.about.journeyTitle}
                onChange={(event) => {
                  setDraft((prev) => ({
                    ...prev,
                    about: { ...prev.about, journeyTitle: event.target.value },
                  }));
                }}
              />
            </div>
            {draft.about.journeyStory.map((story, index) => (
              <div key={`story-${index}`}>
                <label className="text-sm font-semibold text-charcoal-800">Story Paragraph {index + 1}</label>
                <Textarea
                  value={story}
                  onChange={(event) => {
                    const value = event.target.value;
                    setDraft((prev) => ({
                      ...prev,
                      about: {
                        ...prev.about,
                        journeyStory: prev.about.journeyStory.map((s, i) => (i === index ? value : s)),
                      },
                    }));
                  }}
                  className="min-h-24"
                />
              </div>
            ))}
            <div>
              <label className="text-sm font-semibold text-charcoal-800">Studio Image</label>
              <div className="rounded-xl overflow-hidden border border-cream-200 bg-cream-50 mb-2">
                <img src={draft.about.studioImage} alt="Studio preview" className="w-full h-52 object-cover" />
              </div>
              <div className="space-y-2">
                <Input
                  value={draft.about.studioImage}
                  onChange={(event) => {
                    setDraft((prev) => ({
                      ...prev,
                      about: { ...prev.about, studioImage: event.target.value },
                    }));
                  }}
                  placeholder="Paste studio image URL"
                />
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-charcoal-500" />
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={uploadingField === "about-studio-image"}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }

                      void uploadImage(file, "about-studio-image", "cms/about", (url) => {
                        setDraft((prev) => ({
                          ...prev,
                          about: { ...prev.about, studioImage: url },
                        }));
                      });
                      event.target.value = "";
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-charcoal-800">Mission Statement</label>
              <Textarea
                value={draft.about.missionStatement}
                onChange={(event) => {
                  setDraft((prev) => ({
                    ...prev,
                    about: { ...prev.about, missionStatement: event.target.value },
                  }));
                }}
                className="min-h-24"
              />
            </div>
          </div>
        </section>

        <section className={`bg-white rounded-2xl p-6 shadow-sm border border-cream-200 ${activeSection !== "contact" ? "hidden" : ""}`}>
          <h2 className="font-serif text-2xl text-charcoal-800 mb-2">Contact Page</h2>
          <p className="text-sm text-charcoal-600 mb-6">Control the phone numbers, offices, email, and social links shown to clients.</p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-charcoal-800 mb-4">Phone Contacts</h3>
              <div className="space-y-4">
                {draft.contact.people.map((person, index) => (
                  <div key={`person-${index}`} className="border border-cream-200 rounded-lg p-4 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-500">Contact {index + 1}</p>
                    <label className="text-sm font-semibold text-charcoal-800">Name</label>
                    <Input
                      value={person.name}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDraft((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            people: prev.contact.people.map((p, i) =>
                              i === index ? { ...p, name: value } : p
                            ),
                          },
                        }));
                      }}
                      placeholder="Name"
                    />
                    <label className="text-sm font-semibold text-charcoal-800">Phone Number</label>
                    <Input
                      value={person.phone}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDraft((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            people: prev.contact.people.map((p, i) =>
                              i === index ? { ...p, phone: value } : p
                            ),
                          },
                        }));
                      }}
                      placeholder="Phone"
                    />
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setDraft((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            people: prev.contact.people.filter((_, i) => i !== index),
                          },
                        }));
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setDraft((prev) => ({
                    ...prev,
                    contact: {
                      ...prev.contact,
                      people: [...prev.contact.people, { name: "", phone: "" }],
                    },
                  }));
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Phone Contact
              </Button>
            </div>

            <div>
              <label className="text-sm font-semibold text-charcoal-800">Public Email</label>
              <Input
                value={draft.contact.email}
                onChange={(event) => {
                  setDraft((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, email: event.target.value },
                  }));
                }}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-charcoal-800">Working Hours</label>
              <Input
                value={draft.contact.officeHours}
                onChange={(event) => {
                  setDraft((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, officeHours: event.target.value },
                  }));
                }}
              />
            </div>

            <div>
              <h3 className="font-semibold text-charcoal-800 mb-4">Office Locations</h3>
              <div className="space-y-4">
                {draft.contact.offices.map((office, index) => (
                  <div key={`office-${index}`} className="border border-cream-200 rounded-lg p-4 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-500">Office {index + 1}</p>
                    <label className="text-sm font-semibold text-charcoal-800">Office Name / City</label>
                    <Input
                      value={office.city}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDraft((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            offices: prev.contact.offices.map((o, i) =>
                              i === index ? { ...o, city: value } : o
                            ),
                          },
                        }));
                      }}
                      placeholder="City/Office Name"
                    />
                    <label className="text-sm font-semibold text-charcoal-800">Address</label>
                    <Input
                      value={office.address}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDraft((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            offices: prev.contact.offices.map((o, i) =>
                              i === index ? { ...o, address: value } : o
                            ),
                          },
                        }));
                      }}
                      placeholder="Address"
                    />
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setDraft((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            offices: prev.contact.offices.filter((_, i) => i !== index),
                          },
                        }));
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setDraft((prev) => ({
                    ...prev,
                    contact: {
                      ...prev.contact,
                      offices: [...prev.contact.offices, { city: "", address: "" }],
                    },
                  }));
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Office Location
              </Button>
            </div>

            <div>
              <h3 className="font-semibold text-charcoal-800 mb-4">Social Media Links</h3>
              <div className="space-y-4">
                {draft.contact.socialLinks.map((link, index) => (
                  <div key={`social-${index}`} className="border border-cream-200 rounded-lg p-4 space-y-2">
                    <label className="text-sm font-semibold text-charcoal-800">Platform Name</label>
                    <Input
                      value={link.name}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDraft((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            socialLinks: prev.contact.socialLinks.map((l, i) =>
                              i === index ? { ...l, name: value } : l
                            ),
                          },
                        }));
                      }}
                      placeholder="Platform name"
                    />
                    <label className="text-sm font-semibold text-charcoal-800">Profile Link</label>
                    <Input
                      value={link.url}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDraft((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            socialLinks: prev.contact.socialLinks.map((l, i) =>
                              i === index ? { ...l, url: value } : l
                            ),
                          },
                        }));
                      }}
                      placeholder="URL"
                    />
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setDraft((prev) => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            socialLinks: prev.contact.socialLinks.filter((_, i) => i !== index),
                          },
                        }));
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setDraft((prev) => ({
                    ...prev,
                    contact: {
                      ...prev.contact,
                      socialLinks: [...prev.contact.socialLinks, { name: "", url: "" }],
                    },
                  }));
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Social Link
              </Button>
            </div>
          </div>
        </section>

        <section className={`bg-white rounded-2xl p-6 shadow-sm border border-cream-200 ${activeSection !== "servicesLanding" ? "hidden" : ""}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl text-charcoal-800">Services Page Cards</h2>
              <p className="text-sm text-charcoal-600">These cards appear on the main services page.</p>
            </div>
            <Button variant="outline" onClick={addServiceLandingCard}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service Card
            </Button>
          </div>

          <div className="space-y-8 max-h-[50rem] overflow-auto">
            {draft.servicesLanding.cards.map((card, index) => (
              <div key={card.id} className="border border-cream-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-charcoal-800">Service Card {index + 1}</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    value={card.id}
                    onChange={(event) => {
                      const value = event.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        servicesLanding: {
                          ...prev.servicesLanding,
                          cards: prev.servicesLanding.cards.map((c, i) =>
                            i === index ? { ...c, id: value } : c
                          ),
                        },
                      }));
                    }}
                    placeholder="Card ID"
                  />
                  <Input
                    value={card.title}
                    onChange={(event) => {
                      const value = event.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        servicesLanding: {
                          ...prev.servicesLanding,
                          cards: prev.servicesLanding.cards.map((c, i) =>
                            i === index ? { ...c, title: value } : c
                          ),
                        },
                      }));
                    }}
                    placeholder="Title"
                  />
                  <Input
                    value={card.subtitle}
                    onChange={(event) => {
                      const value = event.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        servicesLanding: {
                          ...prev.servicesLanding,
                          cards: prev.servicesLanding.cards.map((c, i) =>
                            i === index ? { ...c, subtitle: value } : c
                          ),
                        },
                      }));
                    }}
                    placeholder="Subtitle"
                  />
                </div>

                <Textarea
                  value={card.description}
                  onChange={(event) => {
                    const value = event.target.value;
                    setDraft((prev) => ({
                      ...prev,
                      servicesLanding: {
                        ...prev.servicesLanding,
                        cards: prev.servicesLanding.cards.map((c, i) =>
                          i === index ? { ...c, description: value } : c
                        ),
                      },
                    }));
                  }}
                  placeholder="Description"
                  className="min-h-24"
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    value={card.icon}
                    onChange={(event) => {
                      const value = event.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        servicesLanding: {
                          ...prev.servicesLanding,
                          cards: prev.servicesLanding.cards.map((c, i) =>
                            i === index ? { ...c, icon: value } : c
                          ),
                        },
                      }));
                    }}
                    placeholder="Icon name"
                  />
                  <div className="space-y-2">
                    <div className="rounded-lg overflow-hidden border border-cream-200 bg-cream-50">
                      <img src={card.image} alt={card.title} className="w-full h-40 object-cover" />
                    </div>
                    <Input
                      value={card.image}
                      onChange={(event) => {
                        const value = event.target.value;
                        setDraft((prev) => ({
                          ...prev,
                          servicesLanding: {
                            ...prev.servicesLanding,
                            cards: prev.servicesLanding.cards.map((c, i) =>
                              i === index ? { ...c, image: value } : c
                            ),
                          },
                        }));
                      }}
                      placeholder="Image URL"
                    />
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-charcoal-500" />
                      <Input
                        type="file"
                        accept="image/*"
                        disabled={uploadingField === `services-landing-${card.id}`}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) {
                            return;
                          }

                          void uploadImage(file, `services-landing-${card.id}`, `cms/services-landing/${card.id}`, (url) => {
                            setDraft((prev) => ({
                              ...prev,
                              servicesLanding: {
                                ...prev.servicesLanding,
                                cards: prev.servicesLanding.cards.map((c, i) =>
                                  i === index ? { ...c, image: url } : c
                                ),
                              },
                            }));
                          });
                          event.target.value = "";
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-charcoal-800 mb-2">Features</h4>
                  <div className="space-y-2">
                    {card.features.map((feature, featureIndex) => (
                      <div key={`${card.id}-feature-${featureIndex}`} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(event) => {
                            const value = event.target.value;
                            setDraft((prev) => ({
                              ...prev,
                              servicesLanding: {
                                ...prev.servicesLanding,
                                cards: prev.servicesLanding.cards.map((c, i) =>
                                  i === index
                                    ? {
                                        ...c,
                                        features: c.features.map((f, fi) => (fi === featureIndex ? value : f)),
                                      }
                                    : c
                                ),
                              },
                            }));
                          }}
                        />
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setDraft((prev) => ({
                              ...prev,
                              servicesLanding: {
                                ...prev.servicesLanding,
                                cards: prev.servicesLanding.cards.map((c, i) =>
                                  i === index
                                    ? {
                                        ...c,
                                        features: c.features.filter((_, fi) => fi !== featureIndex),
                                      }
                                    : c
                                ),
                              },
                            }));
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDraft((prev) => ({
                        ...prev,
                        servicesLanding: {
                          ...prev.servicesLanding,
                          cards: prev.servicesLanding.cards.map((c, i) =>
                            i === index ? { ...c, features: [...c.features, ""] } : c
                          ),
                        },
                      }));
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>

                <div>
                  <h4 className="font-semibold text-charcoal-800 mb-2">Process Steps</h4>
                  <div className="space-y-2">
                    {card.process.map((step, stepIndex) => (
                      <div key={`${card.id}-step-${stepIndex}`} className="flex gap-2">
                        <Input
                          value={step}
                          onChange={(event) => {
                            const value = event.target.value;
                            setDraft((prev) => ({
                              ...prev,
                              servicesLanding: {
                                ...prev.servicesLanding,
                                cards: prev.servicesLanding.cards.map((c, i) =>
                                  i === index
                                    ? {
                                        ...c,
                                        process: c.process.map((p, pi) => (pi === stepIndex ? value : p)),
                                      }
                                    : c
                                ),
                              },
                            }));
                          }}
                        />
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setDraft((prev) => ({
                              ...prev,
                              servicesLanding: {
                                ...prev.servicesLanding,
                                cards: prev.servicesLanding.cards.map((c, i) =>
                                  i === index
                                    ? {
                                        ...c,
                                        process: c.process.filter((_, pi) => pi !== stepIndex),
                                      }
                                    : c
                                ),
                              },
                            }));
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDraft((prev) => ({
                        ...prev,
                        servicesLanding: {
                          ...prev.servicesLanding,
                          cards: prev.servicesLanding.cards.map((c, i) =>
                            i === index ? { ...c, process: [...c.process, ""] } : c
                          ),
                        },
                      }));
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Process Step
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => {
                    setDraft((prev) => ({
                      ...prev,
                      servicesLanding: {
                        ...prev.servicesLanding,
                        cards: prev.servicesLanding.cards.filter((_, i) => i !== index),
                      },
                    }));
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Card
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className={`bg-white rounded-2xl p-6 shadow-sm border border-cream-200 ${activeSection !== "history" ? "hidden" : ""}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl text-charcoal-800">Version History</h2>
            <Button
              variant="outline"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["cms-history"] })}
            >
              Refresh History
            </Button>
          </div>
          <p className="text-sm text-charcoal-600 mb-4">
            Every save creates a snapshot. Restoring a version creates a new restore snapshot.
          </p>

          <div className="space-y-3 max-h-72 overflow-auto pr-2">
            {historyQuery.isLoading ? <p className="text-sm text-charcoal-600">Loading history...</p> : null}
            {!historyQuery.isLoading && historyQuery.data?.length === 0 ? (
              <p className="text-sm text-charcoal-600">No saved versions yet.</p>
            ) : null}
            {historyQuery.data?.map((entry) => (
              <div
                key={entry.id}
                className="border border-cream-200 rounded-xl p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-medium text-charcoal-800">
                    {entry.action === "restore"
                      ? "Restore"
                      : entry.action === "seed"
                        ? "Seed"
                        : "Save"} by {entry.updatedBy}
                  </p>
                  <p className="text-xs text-charcoal-600">
                    {entry.createdAtMs ? new Date(entry.createdAtMs).toLocaleString() : "Timestamp pending"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  disabled={restoreMutation.isPending}
                  onClick={() => restoreMutation.mutate(entry.id)}
                >
                  Restore This Version
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl text-charcoal-800">Advanced Tools</h2>
              <p className="text-sm text-charcoal-600">Only use this if you are comfortable editing JSON.</p>
            </div>
            <Button variant="outline" onClick={() => setShowAdvancedJson((prev) => !prev)}>
              {showAdvancedJson ? "Hide JSON Editor" : "Show JSON Editor"}
            </Button>
          </div>

          {showAdvancedJson ? (
            <div className="mt-4">
              <Textarea
                value={jsonDraft}
                onChange={(event) => setJsonDraft(event.target.value)}
                className="min-h-[20rem] font-mono text-sm"
              />
              <div className="mt-4 flex gap-3">
                <Button onClick={saveJsonDraft} className="bg-charcoal-800 hover:bg-charcoal-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save JSON
                </Button>
              </div>
            </div>
          ) : null}
        </section>

        <div className="sticky bottom-6 flex justify-end">
          <Button
            onClick={saveVisualDraft}
            className="bg-gold-500 hover:bg-gold-600 text-white px-8"
            disabled={saveMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </main>
    </div>
  );
}
