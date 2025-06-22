"use client"

import { Badge } from "@/components/ui/badge"

import { Checkbox } from "@/components/ui/checkbox"

import { useState } from "react"
import { Check, Copy, Globe, Lock, Save, Shield, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardLayout } from "../dashboard-layout"

export default function Settings() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-4 md:p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your platform settings and preferences</p>
          </div>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5 md:w-auto">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure general platform settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" defaultValue="Linkora" />
                    <p className="text-sm text-muted-foreground">
                      This is the name that will be displayed throughout the platform.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-description">Platform Description</Label>
                    <Textarea
                      id="platform-description"
                      defaultValue="Linkora is a social networking platform for university students to connect based on skills and interests."
                    />
                    <p className="text-sm text-muted-foreground">
                      This description will be used in meta tags and for SEO purposes.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" type="email" defaultValue="support@linkora.edu" />
                    <p className="text-sm text-muted-foreground">
                      This email will be used for system notifications and user support.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Timezones</SelectLabel>
                          <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                          <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                          <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                          <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                          <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      The default timezone for displaying dates and times.
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        When enabled, the platform will be inaccessible to regular users.
                      </p>
                    </div>
                    <Switch id="maintenance-mode" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="user-registration">User Registration</Label>
                      <p className="text-sm text-muted-foreground">Allow new users to register on the platform.</p>
                    </div>
                    <Switch id="user-registration" defaultChecked />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Email Settings</CardTitle>
                  <CardDescription>Configure email delivery settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input id="smtp-host" defaultValue="smtp.example.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">SMTP Port</Label>
                      <Input id="smtp-port" defaultValue="587" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-encryption">Encryption</Label>
                      <Select defaultValue="tls">
                        <SelectTrigger id="smtp-encryption">
                          <SelectValue placeholder="Select encryption" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                          <SelectItem value="tls">TLS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">SMTP Username</Label>
                    <Input id="smtp-username" defaultValue="notifications@linkora.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">SMTP Password</Label>
                    <Input id="smtp-password" type="password" defaultValue="••••••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from-email">From Email</Label>
                    <Input id="from-email" defaultValue="no-reply@linkora.edu" />
                    <p className="text-sm text-muted-foreground">
                      This email will be used as the sender for all outgoing emails.
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Enable or disable all email notifications.</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Test Connection</Button>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="appearance" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Settings</CardTitle>
                  <CardDescription>Customize the look and feel of your platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Color Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-5 w-5" />
                        </div>
                        <span className="text-sm">Default</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white">
                          <div className="h-5 w-5" />
                        </div>
                        <span className="text-sm">Purple</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                          <div className="h-5 w-5" />
                        </div>
                        <span className="text-sm">Blue</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Mode</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border text-foreground">
                          <div className="h-5 w-5" />
                        </div>
                        <span className="text-sm">Light</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-50">
                          <Check className="h-5 w-5" />
                        </div>
                        <span className="text-sm">Dark</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-900 text-slate-900">
                          <div className="h-5 w-5" />
                        </div>
                        <span className="text-sm">System</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo-upload">Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-10 w-10 text-primary"
                        >
                          <path d="M6.5 6.5h11v11h-11z" />
                          <path d="M3 10h18" />
                          <path d="M10 3v18" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <Input id="logo-upload" type="file" />
                        <p className="text-sm text-muted-foreground mt-1">
                          Recommended size: 512x512px. Max file size: 2MB.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="favicon-upload">Favicon</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6 text-primary"
                        >
                          <path d="M6.5 6.5h11v11h-11z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <Input id="favicon-upload" type="file" />
                        <p className="text-sm text-muted-foreground mt-1">
                          Recommended size: 32x32px. Max file size: 1MB.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-css">Custom CSS</Label>
                    <Textarea id="custom-css" placeholder=":root { --custom-color: #6366f1; }" className="font-mono" />
                    <p className="text-sm text-muted-foreground">Add custom CSS to override the default styles.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Layout Settings</CardTitle>
                  <CardDescription>Configure the layout of your platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sidebar-collapsed">Sidebar Collapsed by Default</Label>
                      <p className="text-sm text-muted-foreground">
                        When enabled, the sidebar will be collapsed by default.
                      </p>
                    </div>
                    <Switch id="sidebar-collapsed" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="fluid-layout">Fluid Layout</Label>
                      <p className="text-sm text-muted-foreground">
                        When enabled, the layout will expand to fill the entire screen.
                      </p>
                    </div>
                    <Switch id="fluid-layout" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">When enabled, UI elements will be more compact.</p>
                    </div>
                    <Switch id="compact-mode" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="security" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure security settings for your platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require administrators to use two-factor authentication.
                      </p>
                    </div>
                    <Switch id="two-factor" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="session-timeout">Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically log out users after a period of inactivity.
                      </p>
                    </div>
                    <Select defaultValue="60">
                      <SelectTrigger id="session-timeout" className="w-[180px]">
                        <SelectValue placeholder="Select timeout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="password-policy">Password Policy</Label>
                      <p className="text-sm text-muted-foreground">Set the minimum requirements for user passwords.</p>
                    </div>
                    <Select defaultValue="strong">
                      <SelectTrigger id="password-policy" className="w-[180px]">
                        <SelectValue placeholder="Select policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                        <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                        <SelectItem value="strong">Strong (8+ chars, mixed case, numbers)</SelectItem>
                        <SelectItem value="very-strong">
                          Very Strong (12+ chars, mixed case, numbers, symbols)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="content-filter">Content Filtering</Label>
                      <p className="text-sm text-muted-foreground">Automatically filter inappropriate content.</p>
                    </div>
                    <Select defaultValue="moderate">
                      <SelectTrigger id="content-filter" className="w-[180px]">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="off">Off</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="strict">Strict</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ip-blocking">IP Blocking</Label>
                      <p className="text-sm text-muted-foreground">Block access from suspicious IP addresses.</p>
                    </div>
                    <Switch id="ip-blocking" defaultChecked />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Configure privacy settings for your platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-collection">Data Collection</Label>
                      <p className="text-sm text-muted-foreground">
                        Collect anonymous usage data to improve the platform.
                      </p>
                    </div>
                    <Switch id="data-collection" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cookie-consent">Cookie Consent</Label>
                      <p className="text-sm text-muted-foreground">Show cookie consent banner to users.</p>
                    </div>
                    <Switch id="cookie-consent" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="user-profiles">Public User Profiles</Label>
                      <p className="text-sm text-muted-foreground">Allow user profiles to be publicly accessible.</p>
                    </div>
                    <Switch id="user-profiles" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="privacy-policy">Privacy Policy URL</Label>
                    <Input id="privacy-policy" defaultValue="https://linkora.edu/privacy-policy" />
                    <p className="text-sm text-muted-foreground">Link to your privacy policy page.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terms-of-service">Terms of Service URL</Label>
                    <Input id="terms-of-service" defaultValue="https://linkora.edu/terms-of-service" />
                    <p className="text-sm text-muted-foreground">Link to your terms of service page.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="users" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management Settings</CardTitle>
                  <CardDescription>Configure user management settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-verification">Email Verification</Label>
                      <p className="text-sm text-muted-foreground">Require users to verify their email address.</p>
                    </div>
                    <Switch id="email-verification" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-approve">Auto-Approve New Users</Label>
                      <p className="text-sm text-muted-foreground">Automatically approve new user registrations.</p>
                    </div>
                    <Switch id="auto-approve" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="university-email">Require University Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Only allow registrations with university email domains.
                      </p>
                    </div>
                    <Switch id="university-email" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allowed-domains">Allowed Email Domains</Label>
                    <Textarea
                      id="allowed-domains"
                      defaultValue="harvard.edu
stanford.edu
mit.edu
berkeley.edu
ucla.edu
columbia.edu
nyu.edu"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter one domain per line. Only users with these email domains will be allowed to register.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-role">Default User Role</Label>
                    <Select defaultValue="student">
                      <SelectTrigger id="default-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">The default role assigned to new users.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Role Permissions</CardTitle>
                  <CardDescription>Configure permissions for each user role</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Student</h3>
                    </div>
                    <div className="ml-7 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="student-create-posts">Create Posts</Label>
                        <Switch id="student-create-posts" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="student-comment">Comment on Posts</Label>
                        <Switch id="student-comment" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="student-create-projects">Create Collaboration Projects</Label>
                        <Switch id="student-create-projects" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="student-report">Report Content</Label>
                        <Switch id="student-report" defaultChecked />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Moderator</h3>
                    </div>
                    <div className="ml-7 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="moderator-review-reports">Review Reports</Label>
                        <Switch id="moderator-review-reports" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="moderator-remove-content">Remove Content</Label>
                        <Switch id="moderator-remove-content" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="moderator-warn-users">Warn Users</Label>
                        <Switch id="moderator-warn-users" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="moderator-temp-ban">Temporary Ban Users</Label>
                        <Switch id="moderator-temp-ban" defaultChecked />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Admin</h3>
                    </div>
                    <div className="ml-7 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-manage-users">Manage Users</Label>
                        <Switch id="admin-manage-users" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-manage-roles">Manage Roles</Label>
                        <Switch id="admin-manage-roles" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-system-settings">System Settings</Label>
                        <Switch id="admin-system-settings" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-permanent-ban">Permanently Ban Users</Label>
                        <Switch id="admin-permanent-ban" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="api" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Settings</CardTitle>
                  <CardDescription>Manage API access and keys</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="api-enabled">Enable API Access</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow external applications to access the platform via API.
                      </p>
                    </div>
                    <Switch id="api-enabled" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="api-key"
                        value="sk_live_51NzKh8JkLIEYvGJ6Xt5kNgMzkXQV"
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard("sk_live_51NzKh8JkLIEYvGJ6Xt5kNgMzkXQV")}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span className="sr-only">Copy API key</span>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This key grants full access to the API. Keep it secure and do not share it.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-rate-limit">Rate Limit</Label>
                    <Select defaultValue="1000">
                      <SelectTrigger id="api-rate-limit">
                        <SelectValue placeholder="Select rate limit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 requests per minute</SelectItem>
                        <SelectItem value="500">500 requests per minute</SelectItem>
                        <SelectItem value="1000">1,000 requests per minute</SelectItem>
                        <SelectItem value="5000">5,000 requests per minute</SelectItem>
                        <SelectItem value="10000">10,000 requests per minute</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Maximum number of API requests allowed per minute.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Allowed Origins</Label>
                    <Textarea
                      placeholder="https://example.com
https://app.example.com"
                      defaultValue="https://linkora.edu
https://app.linkora.edu"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter one origin per line. Only requests from these origins will be allowed.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <Input placeholder="https://example.com/webhook" defaultValue="https://linkora.edu/api/webhook" />
                    <p className="text-sm text-muted-foreground">
                      URL to receive webhook notifications for platform events.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Webhook Events</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="webhook-user-created" defaultChecked />
                        <label htmlFor="webhook-user-created" className="text-sm">
                          User Created
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="webhook-post-created" defaultChecked />
                        <label htmlFor="webhook-post-created" className="text-sm">
                          Post Created
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="webhook-report-submitted" defaultChecked />
                        <label htmlFor="webhook-report-submitted" className="text-sm">
                          Report Submitted
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="webhook-collaboration-created" defaultChecked />
                        <label htmlFor="webhook-collaboration-created" className="text-sm">
                          Collaboration Created
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Regenerate API Key</Button>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                  <CardDescription>Access and manage API documentation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>API Documentation URL</Label>
                    <div className="flex items-center gap-2">
                      <Input value="https://api.linkora.edu/docs" readOnly />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard("https://api.linkora.edu/docs")}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span className="sr-only">Copy URL</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="public-docs">Public Documentation</Label>
                      <p className="text-sm text-muted-foreground">Make API documentation publicly accessible.</p>
                    </div>
                    <Switch id="public-docs" defaultChecked />
                  </div>
                  <div className="rounded-md bg-muted p-4">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Available Endpoints</h3>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="flex items-center justify-between">
                        <span>GET /api/users</span>
                        <Badge variant="outline">Enabled</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>POST /api/users</span>
                        <Badge variant="outline">Enabled</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>GET /api/posts</span>
                        <Badge variant="outline">Enabled</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>POST /api/posts</span>
                        <Badge variant="outline">Enabled</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>GET /api/collaborations</span>
                        <Badge variant="outline">Enabled</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>POST /api/collaborations</span>
                        <Badge variant="outline">Enabled</Badge>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">View Full Documentation</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ThemeProvider>
  )
}
