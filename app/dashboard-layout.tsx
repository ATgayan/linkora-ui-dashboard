"use client";

import type React from "react";
import { useState, useCallback, useEffect, useRef, useMemo, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  ChevronDown,
  FileText,
  Flag,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
  Users2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-provider";


interface AdminProfile {
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  location: string;
  bio: string;
  joinDate: string;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin", // Changed from "/" to "/admin"
    icon: LayoutDashboard,
  },
  {
    title: "Manage Users",
    href: "/admin/manage-users", // Added /admin prefix
    icon: Users,
  },
  {
    title: "Reports",
    href: "/admin/reports", // Added /admin prefix
    icon: Flag,
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Dialog state completely isolated from profile data
  const [open, setOpen] = useState(false); // Mobile sheet state
  const [profileOpen, setProfileOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Prevent any external interference
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth(); // Use useAuth hook

  // Single source-of-truth original profile (does NOT change while editing)
  const [originalProfile, setOriginalProfile] = useState<AdminProfile>(() => ({
    name: "Admin User",
    email: "admin@linkora.com",
    role: "System Administrator",
    department: "IT Department",
    phone: "+94 77 123 4567",
    location: "Colombo, Sri Lanka",
    bio: "Experienced system administrator managing the Linkora platform with expertise in user management and system operations.",
    joinDate: "January 2024",
  }));

  // Editable working copy
  const [profile, setProfile] = useState<AdminProfile>(originalProfile);

  // Remove useEffect that depends on userEmail since we don't need it anymore
  // The profile will use the default email from originalProfile

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stable change detection function
  const checkForChanges = useCallback(
    (newProfile: typeof profile) => {
      const hasChanged = Object.keys(newProfile).some(
        (key) =>
          newProfile[key as keyof typeof profile] !==
          originalProfile[key as keyof typeof profile]
      );
      setHasChanges(hasChanged);
    },
    [originalProfile]
  );

  // Stable profile input component with no re-renders
  const StableInput = memo(
    ({
      id,
      type = "text",
      value,
      onChange,
      placeholder,
      required = false,
      disabled = false,
      className = "",
    }: {
      id: string;
      type?: string;
      value: string;
      onChange: (value: string) => void;
      placeholder: string;
      required?: boolean;
      disabled?: boolean;
      className?: string;
    }) => {
      const [localValue, setLocalValue] = useState(value);
      const timeoutRef = useRef<NodeJS.Timeout | null>(null);

      // Sync with prop value when it changes externally
      useEffect(() => {
        if (value !== localValue) {
          setLocalValue(value);
        }
      }, [value, localValue]); // Fixed: Added localValue to dependency

      const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          setLocalValue(newValue);

          // Only propagate changes if not disabled and value actually changed
          if (!disabled && timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          if (!disabled) {
            timeoutRef.current = setTimeout(() => {
              onChange(newValue);
            }, 150); // Slightly longer debounce
          }
        },
        [onChange, disabled]
      );

      useEffect(() => {
        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }, []);

      return (
        <Input
          id={id}
          type={type}
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={className}
        />
      );
    }
  );

  StableInput.displayName = "StableInput";

  // Stable textarea component
  const StableTextarea = memo(
    ({
      id,
      value,
      onChange,
      placeholder,
      rows = 4,
      className = "",
    }: {
      id: string;
      value: string;
      onChange: (value: string) => void;
      placeholder: string;
      rows?: number;
      className?: string;
    }) => {
      const [localValue, setLocalValue] = useState(value);
      const timeoutRef = useRef<NodeJS.Timeout | null>(null);

      // Sync with prop value when it changes externally
      useEffect(() => {
        if (value !== localValue) {
          setLocalValue(value);
        }
      }, [value, localValue]); // Fixed: Added localValue to dependency

      const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const newValue = e.target.value;
          setLocalValue(newValue);

          // Only propagate changes and clear existing timeouts
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(() => {
            onChange(newValue);
          }, 150); // Slightly longer debounce
        },
        [onChange]
      );

      useEffect(() => {
        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }, []);

      return (
        <Textarea
          id={id}
          value={localValue}
          onChange={handleChange}
          rows={rows}
          placeholder={placeholder}
          className={className}
        />
      );
    }
  );

  StableTextarea.displayName = "StableTextarea";

  // Optimized profile field update with better debouncing & no dialog side-effects
  const updateProfileField = useCallback(
    (field: keyof AdminProfile, value: string) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      setProfile((prev) => {
        if (prev[field] === value) return prev; // no-op
        const next = { ...prev, [field]: value };
        debounceTimerRef.current = setTimeout(() => {
          checkForChanges(next);
        }, 180);
        return next;
      });
    },
    [checkForChanges]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Save profile changes with useCallback for better performance
  const handleSaveProfile = useCallback(async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear any pending debounce
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      // Persist working copy as new original
      setOriginalProfile(profile);
      setHasChanges(false);
      setProfileOpen(false);
      setIsEditing(false);

      // In a real app, you would make an API call here
      console.log("Profile saved successfully:", profile);

      // You could add a toast notification here
    } catch (error) {
      console.error("Error saving profile:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSaving(false);
    }
  }, [profile]);

  // Cancel profile changes with useCallback
  const handleCancelProfile = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    // Revert edits
    setProfile(originalProfile);
    setHasChanges(false);
    setProfileOpen(false);
    setIsEditing(false);
  }, [originalProfile]);

  const handleNavigation = useCallback(
    (path: string) => {
      setOpen(false);
      router.push(path);
    },
    [router]
  );

  const isActive = useCallback(
    (path: string) => {
      return pathname === path;
    },
    [pathname]
  );

  const handleLogout = useCallback(() => { // Fixed: Added useCallback
    logout();
  }, [logout]);

  const handleProfileClick = useCallback(() => { // Fixed: Added useCallback
    setProfileOpen(true);
    setIsEditing(true);
  }, []);

  // Profile Popup Component - Fixed: Moved outside render to avoid recreation
  const ProfilePopup = useMemo(() => (
    <Dialog
      open={profileOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (hasChanges) {
            // Show confirmation dialog if there are unsaved changes
            const confirmClose = window.confirm(
              "You have unsaved changes. Are you sure you want to close?"
            );
            if (!confirmClose) return;
            handleCancelProfile();
          } else {
            setProfileOpen(false);
            setIsEditing(false);
          }
        }
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-950/95 text-gray-800 dark:text-white border-gray-200/80 dark:border-gray-800/80 shadow-2xl backdrop-blur-md rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-50/20 to-purple-50/20 dark:from-gray-950/80 dark:via-blue-950/10 dark:to-purple-950/10 -z-10 rounded-2xl" />
        <DialogHeader className="space-y-4 pb-6 border-b border-gray-200/50 dark:border-gray-800/50">
          <DialogTitle className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-blue-100 dark:ring-blue-900/50 shadow-lg">
              <AvatarImage
                src="/placeholder-user.jpg"
                alt={profile.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
                <Users2 className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {profile.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {profile.role}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Online
                </span>
              </div>
            </div>
            {hasChanges && (
              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-300 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-200 dark:border-yellow-700/50 shadow-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                  Unsaved changes
                </span>
              </div>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            Manage your profile information and settings. Changes will be saved
            when you click "Save Changes".
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Profile Information */}
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-foreground dark:text-white"
                >
                  Full Name{" "}
                  <span className="text-red-500 dark:text-red-400">*</span>
                </Label>
                <StableInput
                  id="name"
                  value={profile.name}
                  onChange={(value) => updateProfileField("name", value)}
                  placeholder="Enter your full name"
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-foreground dark:text-white"
                >
                  Email{" "}
                  <span className="text-red-500 dark:text-red-400">*</span>
                </Label>
                <StableInput
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(value) => updateProfileField("email", value)}
                  placeholder="Enter your email address"
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-foreground dark:text-white"
                >
                  Role
                </Label>
                <StableInput
                  id="role"
                  value={profile.role}
                  onChange={(value) => updateProfileField("role", value)}
                  placeholder="Enter your role"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="department"
                  className="text-foreground dark:text-white"
                >
                  Department
                </Label>
                <StableInput
                  id="department"
                  value={profile.department}
                  onChange={(value) => updateProfileField("department", value)}
                  placeholder="Enter your department"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-foreground dark:text-white"
                >
                  Phone
                </Label>
                <StableInput
                  id="phone"
                  value={profile.phone}
                  onChange={(value) => updateProfileField("phone", value)}
                  placeholder="Enter your phone number"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-foreground dark:text-white"
                >
                  Location
                </Label>
                <StableInput
                  id="location"
                  value={profile.location}
                  onChange={(value) => updateProfileField("location", value)}
                  placeholder="Enter your location"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-foreground dark:text-white">
                Bio
              </Label>
              <StableTextarea
                id="bio"
                value={profile.bio}
                onChange={(value) => updateProfileField("bio", value)}
                placeholder="Tell us about yourself..."
                className="resize-none bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500"
              />
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                {profile.bio.length}/500 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="joinDate"
                className="text-foreground dark:text-white"
              >
                Member Since
              </Label>
              <StableInput
                id="joinDate"
                value={profile.joinDate}
                onChange={() => {}} // No-op since it's disabled
                placeholder=""
                disabled
                className="bg-muted border-border text-muted-foreground cursor-not-allowed dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400"
              />
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                This field cannot be edited
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-border dark:border-gray-700">
            <div className="flex items-center gap-2">
              {hasChanges && (
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  You have unsaved changes
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancelProfile}
                disabled={isSaving}
                className="border-border text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={
                  !hasChanges ||
                  isSaving ||
                  !profile.name.trim() ||
                  !profile.email.trim()
                }
                className="min-w-[120px] bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:bg-muted dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white dark:disabled:bg-gray-700"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin dark:border-white/30 dark:border-t-white" />
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ), [profileOpen, hasChanges, profile, isSaving, handleCancelProfile, handleSaveProfile, updateProfileField]); // Fixed: Added dependencies

  return (

    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30">
      <ProfilePopup />

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-18 items-center gap-4 border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-md px-4 md:hidden border-gray-200/80 dark:border-gray-800/80 shadow-lg">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-gray-200 dark:border-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 rounded-xl transition-all duration-300 h-11 w-11"
            >
              <div>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 p-0 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-950 dark:to-gray-900 border-gray-200/80 dark:border-gray-800/80"
          >
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center border-b px-6 border-gray-200/80 dark:border-gray-800/80 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-950/80 dark:to-gray-900/80">
                <Link

                  href="/"
                  className="flex items-center gap-3 font-semibold group"

                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-green-600 dark:from-blue-400 dark:via-purple-400 dark:to-green-400 bg-clip-text text-transparent">
                      Linkora
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Admin Dashboard
                    </div>
                  </div>
                </Link>
              </div>
              <nav className="flex-1 space-y-3 p-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => handleNavigation(item.href)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300 transform hover:scale-[1.02] border-l-4 group relative overflow-hidden ${
                        isActive(item.href)
                          ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25 border-red-300 dark:from-red-600 dark:to-pink-600 dark:shadow-red-600/30"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950/30 dark:hover:to-pink-950/30 hover:text-red-600 dark:hover:text-red-400 hover:shadow-md hover:shadow-red-500/10 border-transparent hover:border-red-400 dark:hover:border-red-500"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 transition-all duration-300 ${
                          isActive(item.href)
                            ? "scale-110"
                            : "group-hover:scale-110"
                        }`}
                      />
                      <span className="font-medium">{item.title}</span>
                      {isActive(item.href) && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg animate-pulse" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                    </Link>
                  );
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 shadow-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-green-600 dark:from-blue-400 dark:via-purple-400 dark:to-green-400 bg-clip-text text-transparent">
              Linkora
            </span>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Admin Dashboard
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <SidebarProvider defaultOpen>
          {/* Desktop Sidebar */}

          <Sidebar className="hidden border-r md:flex bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-950 dark:to-gray-900 border-gray-200/80 dark:border-gray-800/80 shadow-xl dark:shadow-2xl">
            <SidebarHeader className="border-b p-6 border-gray-200/80 dark:border-gray-800/80 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-950/80 dark:to-gray-900/80 backdrop-blur-sm">
              <Link
                href="/"
                className="flex items-center gap-3 font-semibold group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-green-600 dark:from-blue-400 dark:via-purple-400 dark:to-green-400 bg-clip-text text-transparent">
                    Linkora
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Admin Dashboard
                  </div>

                </div>
              </Link>
            </SidebarHeader>
            <SidebarContent className="bg-gradient-to-b from-white/50 to-gray-50/50 dark:from-gray-950/50 dark:to-gray-900/50 backdrop-blur-sm p-4">
              <SidebarGroup>
                <SidebarGroupLabel className="text-gray-600 dark:text-gray-300 font-semibold text-xs uppercase tracking-wider mb-4">
                  Navigation
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(item.href)}
                            className={`transition-all duration-300 transform hover:scale-[1.02] rounded-xl ${
                              isActive(item.href)
                                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25 dark:from-red-600 dark:to-pink-600 dark:shadow-red-600/30"
                                : "hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 hover:shadow-md hover:shadow-red-500/10 text-foreground dark:text-gray-300 dark:hover:from-red-950/30 dark:hover:to-pink-950/30 dark:hover:text-red-400"
                            } group relative overflow-hidden`}
                          >
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 w-full border-l-4 border-transparent hover:border-red-400 transition-all duration-300 dark:hover:border-red-500 p-3 relative z-10"
                            >
                              <Icon
                                className={`h-5 w-5 transition-all duration-300 ${
                                  isActive(item.href)
                                    ? "scale-110"
                                    : "group-hover:scale-110"
                                }`}
                              />
                              <span className="font-medium">{item.title}</span>
                              {isActive(item.href) && (
                                <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg animate-pulse" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t p-4 border-gray-200/80 dark:border-gray-800/80 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-950/80 dark:to-gray-900/80 backdrop-blur-sm"></SidebarFooter>
          </Sidebar>

          <div className="flex flex-1 flex-col">
            {/* Desktop Top Navigation */}
            <header className="sticky top-0 z-30 hidden h-20 items-center gap-4 border-b bg-gradient-to-r from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 px-6 md:flex border-gray-200/80 dark:border-gray-800/80 shadow-lg dark:shadow-2xl backdrop-blur-sm">
              <div className="flex flex-1 items-center gap-4">
                <div className="relative flex-1 max-w-md">

                  {/* Enhanced search bar - currently commented */}
                  {/* <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                    <Input 
                      type="search" 
                      placeholder="Search users, collaborations..." 
                      className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:shadow-md transition-all duration-200" 
                    />
                  </div> */}

                </div>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 transition-all duration-300 rounded-xl p-4 h-12 w-12 group"
                >
                  <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                  <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs text-white flex items-center justify-center animate-pulse shadow-lg font-semibold">
                    3
                  </span>
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 transition-all duration-300 rounded-xl p-4 h-14 group"
                    >
                      <Avatar className="h-12 w-12 ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-400 dark:group-hover:ring-blue-500 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-300">
                          <Users2 className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden text-left lg:block">

                        <p className="text-base font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          Admin User
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 font-medium">
                          {userEmail}

                        </p>
                      </div>
                      <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-all duration-300 group-hover:rotate-180 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 bg-white/95 dark:bg-gray-950/95 border-gray-200/80 dark:border-gray-800/80 shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 rounded-xl p-2"
                    sideOffset={12}
                  >
                    <DropdownMenuLabel className="text-gray-800 dark:text-white font-semibold text-base py-3 px-3">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700 my-2" />
                    <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 hover:text-blue-700 dark:hover:text-blue-400 focus:bg-gradient-to-r focus:from-blue-50 focus:to-purple-50 dark:focus:from-blue-950/30 dark:focus:to-purple-950/30 cursor-pointer transition-all duration-300 rounded-lg p-3 group">
                      <Settings className="mr-3 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                      <div>
                        <div className="font-medium">Settings</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Manage preferences
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleProfileClick}
                      className="text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-950/30 dark:hover:to-emerald-950/30 hover:text-green-700 dark:hover:text-green-400 focus:bg-gradient-to-r focus:from-green-50 focus:to-emerald-50 dark:focus:from-green-950/30 dark:focus:to-emerald-950/30 cursor-pointer transition-all duration-300 rounded-lg p-3 group"
                    >
                      <Users className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                      <div>
                        <div className="font-medium">Profile</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          View and edit profile
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700 my-2" />
                    <DropdownMenuItem
                      className="text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950/30 dark:hover:to-pink-950/30 hover:text-red-700 dark:hover:text-red-300 focus:bg-gradient-to-r focus:from-red-50 focus:to-pink-50 dark:focus:from-red-950/30 dark:focus:to-pink-950/30 cursor-pointer transition-all duration-300 rounded-lg p-3 group"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      <div>
                        <div className="font-medium">Sign out</div>
                        <div className="text-xs text-red-500 dark:text-red-400">
                          End your session
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 dark:from-gray-950/50 dark:via-gray-900 dark:to-blue-950/20 backdrop-blur-sm">
              <div className="h-full bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}

export default DashboardLayout;