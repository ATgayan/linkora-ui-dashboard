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

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Users",
    href: "/manage-users",
    icon: Users,
  },

  {
    title: "Reports",
    href: "/reports",
    icon: Flag,
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { userEmail, logout } = useAuth();

  // Stable original profile data (memoized to prevent recreations)
  const originalProfile = useMemo(
    () => ({
      name: "Admin User",
      email: userEmail || "admin@linkora.com",
      role: "System Administrator",
      department: "IT Department",
      phone: "+94 77 123 4567",
      location: "Colombo, Sri Lanka",
      bio: "Experienced system administrator managing the Linkora platform with expertise in user management and system operations.",
      joinDate: "January 2024",
    }),
    [userEmail]
  );

  // Current profile state (editable)
  const [profile, setProfile] = useState(originalProfile);

  // Update profile when originalProfile changes
  useEffect(() => {
    setProfile(originalProfile);
    setHasChanges(false);
  }, [originalProfile]);

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

  // Completely stable input component - prevents ALL re-renders during typing
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
      const isTypingRef = useRef(false);

      // Only sync external changes when NOT typing
      useEffect(() => {
        if (!isTypingRef.current && value !== localValue) {
          setLocalValue(value);
        }
      }, [value, localValue]);

      const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          isTypingRef.current = true;
          setLocalValue(newValue);

          // Clear existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Debounce the parent update
          timeoutRef.current = setTimeout(() => {
            isTypingRef.current = false;
            onChange(newValue);
          }, 300); // Increased debounce for better stability
        },
        [onChange]
      );

      const handleFocus = useCallback(() => {
        isTypingRef.current = true;
      }, []);

      const handleBlur = useCallback(() => {
        // Immediate update on blur and stop typing flag
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        isTypingRef.current = false;
        onChange(localValue);
      }, [onChange, localValue]);

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
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={className}
        />
      );
    },
    // Prevent re-renders by comparing only essential props
    (prevProps, nextProps) => {
      return (
        prevProps.id === nextProps.id &&
        prevProps.type === nextProps.type &&
        prevProps.placeholder === nextProps.placeholder &&
        prevProps.required === nextProps.required &&
        prevProps.disabled === nextProps.disabled &&
        prevProps.className === nextProps.className &&
        prevProps.onChange === nextProps.onChange
        // Deliberately exclude 'value' to prevent re-renders during typing
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
      const isTypingRef = useRef(false);

      // Only sync external changes when NOT typing
      useEffect(() => {
        if (!isTypingRef.current && value !== localValue) {
          setLocalValue(value);
        }
      }, [value, localValue]);

      const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const newValue = e.target.value;
          isTypingRef.current = true;
          setLocalValue(newValue);

          // Clear existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Debounce the parent update
          timeoutRef.current = setTimeout(() => {
            isTypingRef.current = false;
            onChange(newValue);
          }, 300); // Increased debounce for better stability
        },
        [onChange]
      );

      const handleFocus = useCallback(() => {
        isTypingRef.current = true;
      }, []);

      const handleBlur = useCallback(() => {
        // Immediate update on blur and stop typing flag
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        isTypingRef.current = false;
        onChange(localValue);
      }, [onChange, localValue]);

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
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={rows}
          placeholder={placeholder}
          className={className}
        />
      );
    },
    // Prevent re-renders by comparing only essential props
    (prevProps, nextProps) => {
      return (
        prevProps.id === nextProps.id &&
        prevProps.placeholder === nextProps.placeholder &&
        prevProps.rows === nextProps.rows &&
        prevProps.className === nextProps.className &&
        prevProps.onChange === nextProps.onChange
        // Deliberately exclude 'value' to prevent re-renders during typing
      );
    }
  );

  StableTextarea.displayName = "StableTextarea";

  // Optimized profile field update with better debouncing
  const updateProfileField = useCallback(
    (field: keyof typeof profile, value: string) => {
      setProfile((prev) => {
        // Only update if value actually changed
        if (prev[field] === value) return prev;

        const newProfile = { ...prev, [field]: value };

        // Clear any existing timeout
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // Debounce change detection with longer delay for stability
        debounceTimerRef.current = setTimeout(() => {
          checkForChanges(newProfile);
        }, 500); // Increased to 500ms for maximum stability

        return newProfile;
      });
    },
    [checkForChanges]
  );

  // Create stable callback refs for each field to prevent re-renders
  const nameChangeCallback = useCallback((value: string) => updateProfileField("name", value), [updateProfileField]);
  const emailChangeCallback = useCallback((value: string) => updateProfileField("email", value), [updateProfileField]);
  const roleChangeCallback = useCallback((value: string) => updateProfileField("role", value), [updateProfileField]);
  const departmentChangeCallback = useCallback((value: string) => updateProfileField("department", value), [updateProfileField]);
  const phoneChangeCallback = useCallback((value: string) => updateProfileField("phone", value), [updateProfileField]);
  const locationChangeCallback = useCallback((value: string) => updateProfileField("location", value), [updateProfileField]);
  const bioChangeCallback = useCallback((value: string) => updateProfileField("bio", value), [updateProfileField]);

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

      setHasChanges(false);
      setProfileOpen(false);

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
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setProfile(originalProfile);
    setHasChanges(false);
    setProfileOpen(false);
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

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    setProfileOpen(true);
  };

  // Profile Popup Component
  const ProfilePopup = () => (
    <Dialog
      open={profileOpen}
      onOpenChange={(open) => {
        if (!open && hasChanges) {
          // Show confirmation dialog if there are unsaved changes
          const confirmClose = window.confirm(
            "You have unsaved changes. Are you sure you want to close?"
          );
          if (!confirmClose) return;
          handleCancelProfile();
        } else {
          setProfileOpen(open);
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black text-white border-gray-700 shadow-2xl">
        <div className="absolute inset-0 bg-black/95 -z-10" />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder-user.jpg" alt={profile.name} />
              <AvatarFallback className="bg-gray-800 text-white">
                <Users2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {profile.name}
              </h3>
              <p className="text-sm text-gray-400">{profile.role}</p>
            </div>
            {hasChanges && (
              <div className="ml-auto">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200 border border-yellow-700">
                  Unsaved changes
                </span>
              </div>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Manage your profile information and settings. Changes will be saved
            when you click "Save Changes".
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Profile Information */}
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Full Name <span className="text-red-400">*</span>
                </Label>
                <StableInput
                  id="name"
                  value={profile.name}
                  onChange={nameChangeCallback}
                  placeholder="Enter your full name"
                  required
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email <span className="text-red-400">*</span>
                </Label>
                <StableInput
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={emailChangeCallback}
                  placeholder="Enter your email address"
                  required
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-white">
                  Role
                </Label>
                <StableInput
                  id="role"
                  value={profile.role}
                  onChange={roleChangeCallback}
                  placeholder="Enter your role"
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-white">
                  Department
                </Label>
                <StableInput
                  id="department"
                  value={profile.department}
                  onChange={departmentChangeCallback}
                  placeholder="Enter your department"
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  Phone
                </Label>
                <StableInput
                  id="phone"
                  value={profile.phone}
                  onChange={phoneChangeCallback}
                  placeholder="Enter your phone number"
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-white">
                  Location
                </Label>
                <StableInput
                  id="location"
                  value={profile.location}
                  onChange={locationChangeCallback}
                  placeholder="Enter your location"
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">
                Bio
              </Label>
              <StableTextarea
                id="bio"
                value={profile.bio}
                onChange={bioChangeCallback}
                placeholder="Tell us about yourself..."
                className="resize-none bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
              />
              <p className="text-xs text-gray-400">
                {profile.bio.length}/500 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="joinDate" className="text-white">
                Member Since
              </Label>
              <StableInput
                id="joinDate"
                value={profile.joinDate}
                onChange={() => {}} // No-op since it's disabled
                placeholder=""
                disabled
                className="bg-gray-900 border-gray-700 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400">
                This field cannot be edited
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              {hasChanges && (
                <p className="text-sm text-gray-400">
                  You have unsaved changes
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancelProfile}
                disabled={isSaving}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50"
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
                className="min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:bg-gray-700"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ProfilePopup />
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center border-b px-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Linkora Admin
                  </span>
                </Link>
              </div>
              <nav className="flex-1 space-y-2 p-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => handleNavigation(item.href)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 transform hover:scale-105 border-l-4 ${
                        isActive(item.href)
                          ? "bg-red-600 text-white shadow-lg border-red-400"
                          : "text-muted-foreground hover:bg-red-100 hover:text-red-600 hover:shadow-md border-transparent hover:border-red-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Linkora Admin
          </span>
        </div>
      </header>

      <div className="flex flex-1">
        <SidebarProvider defaultOpen>
          {/* Desktop Sidebar */}
          <Sidebar className="hidden border-r md:flex">
            <SidebarHeader className="border-b p-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Linkora Admin
                </span>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(item.href)}
                            className={`transition-all duration-200 transform hover:scale-105 ${
                              isActive(item.href)
                                ? "bg-red-600 text-white hover:bg-red-700 shadow-lg"
                                : "hover:bg-red-100 hover:text-red-600 hover:shadow-md"
                            }`}
                          >
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 w-full border-l-4 border-transparent hover:border-red-600 transition-all duration-200"
                            >
                              <Icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t p-4"></SidebarFooter>
          </Sidebar>

          <div className="flex flex-1 flex-col">
            {/* Desktop Top Navigation */}
            <header className="sticky top-0 z-30 hidden h-16 items-center gap-4 border-b bg-background px-6 md:flex bg-black">
              <div className="flex flex-1 items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />*/}

                  {/*<Input type="search" placeholder="Search users, collaborations..." className="w-full pl-8 bg-black" />*/}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-800 transition-colors duration-200"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center animate-pulse">
                    3
                  </span>
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-gray-800 transition-colors duration-200"
                    >
                      <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-gray-600 transition-all duration-200">
                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                        <AvatarFallback className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200">
                          <Users2 className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden text-left lg:block">
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-xs text-muted-foreground">
                          {userEmail}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-black border-gray-700 shadow-2xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="text-white">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="text-gray-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white cursor-pointer transition-colors duration-200">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleProfileClick}
                      className="text-gray-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white cursor-pointer transition-colors duration-200"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem
                      className="text-red-400 hover:bg-red-900 hover:text-red-300 focus:bg-red-900 focus:text-red-300 cursor-pointer transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}

export default DashboardLayout;
