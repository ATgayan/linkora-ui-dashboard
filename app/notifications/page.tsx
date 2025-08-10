"use client"

import { useState } from "react"
import { Bell, ChevronDown, Filter, MoreHorizontal, Plus, Search, Send } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardLayout } from "../dashboard"

// Sample notification data
const notifications = [
  {
    id: 1,
    title: "Platform Maintenance",
    content:
      "Linkora will be undergoing maintenance on November 20th from 2-4 AM EST. Some features may be unavailable during this time.",
    type: "announcement",
    status: "scheduled",
    audience: "all",
    sender: {
      name: "System Admin",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    scheduledFor: "2023-11-20T02:00:00Z",
    createdAt: "2023-11-15T10:30:00Z",
  },
  {
    id: 2,
    title: "New Feature: Collaboration Board",
    content:
      "We've launched a new Collaboration Board feature to help you find project partners based on skills and interests. Check it out now!",
    type: "announcement",
    status: "sent",
    audience: "all",
    sender: {
      name: "Product Team",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    sentAt: "2023-11-14T14:45:00Z",
    createdAt: "2023-11-14T14:45:00Z",
    stats: {
      delivered: 2853,
      opened: 1459,
      clicked: 876,
    },
  },
  {
    id: 3,
    title: "Your Post Has Been Flagged",
    content:
      "Your post 'Looking for study partners' has been flagged for review. Please check your content guidelines.",
    type: "alert",
    status: "sent",
    audience: "user",
    recipient: {
      name: "Jordan Lee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    sender: {
      name: "Moderation Team",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    sentAt: "2023-11-13T09:15:00Z",
    createdAt: "2023-11-13T09:15:00Z",
  },
  {
    id: 4,
    title: "Photography Workshop This Weekend",
    content:
      "Don't forget to sign up for the photography workshop happening this weekend at the campus garden. Limited spots available!",
    type: "event",
    status: "sent",
    audience: "interest",
    interestGroup: "Photography",
    sender: {
      name: "Events Team",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    sentAt: "2023-11-12T16:20:00Z",
    createdAt: "2023-11-12T16:20:00Z",
    stats: {
      delivered: 428,
      opened: 312,
      clicked: 189,
    },
  },
  {
    id: 5,
    title: "Welcome to Linkora!",
    content:
      "Welcome to Linkora, the platform for university students to connect based on skills and interests. Get started by completing your profile and exploring collaboration opportunities.",
    type: "onboarding",
    status: "template",
    audience: "new_users",
    sender: {
      name: "Linkora Team",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-11-11T11:50:00Z",
  },
]

export default function Notifications() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredNotifications = notifications.filter((notification) => {
    // Filter by tab
    if (selectedTab === "sent" && notification.status !== "sent") return false
    if (selectedTab === "scheduled" && notification.status !== "scheduled") return false
    if (selectedTab === "templates" && notification.status !== "template") return false

    // Filter by type
    if (typeFilter !== "all" && notification.type !== typeFilter) return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.content.toLowerCase().includes(query) ||
        (notification.audience && notification.audience.toLowerCase().includes(query))
      )
    }

    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-4 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
              <p className="text-muted-foreground">Manage and send notifications to Linkora users</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Send className="mr-2 h-4 w-4" />
                    New Notification
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Notification</DialogTitle>
                    <DialogDescription>Compose and send a notification to Linkora users</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Notification Title
                      </label>
                      <Input id="title" placeholder="Enter notification title" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="content" className="text-sm font-medium">
                        Content
                      </label>
                      <Textarea id="content" placeholder="Enter notification content" className="min-h-[100px]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="type" className="text-sm font-medium">
                          Notification Type
                        </label>
                        <Select defaultValue="announcement">
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Types</SelectLabel>
                              <SelectItem value="announcement">Announcement</SelectItem>
                              <SelectItem value="alert">Alert</SelectItem>
                              <SelectItem value="event">Event</SelectItem>
                              <SelectItem value="onboarding">Onboarding</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="audience" className="text-sm font-medium">
                          Audience
                        </label>
                        <Select defaultValue="all">
                          <SelectTrigger id="audience">
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Audience</SelectLabel>
                              <SelectItem value="all">All Users</SelectItem>
                              <SelectItem value="new_users">New Users</SelectItem>
                              <SelectItem value="interest">Interest Group</SelectItem>
                              <SelectItem value="user">Specific User</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="schedule" className="text-sm font-medium">
                        Schedule
                      </label>
                      <div className="flex items-center gap-2">
                        <Checkbox id="schedule-now" />
                        <label htmlFor="schedule-now" className="text-sm">
                          Send immediately
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="schedule-later" />
                        <label htmlFor="schedule-later" className="text-sm">
                          Schedule for later
                        </label>
                      </div>
                      <Input type="datetime-local" className="mt-2" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Save as Template</Button>
                    <Button>Send Notification</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter By Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTypeFilter("all")}>All Types</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter("announcement")}>Announcements</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter("alert")}>Alerts</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter("event")}>Events</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter("onboarding")}>Onboarding</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notifications..."
                className="w-full pl-8 md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Tabs defaultValue="all" onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4 md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Notifications</CardTitle>
                  <CardDescription>View and manage all notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredNotifications.map((notification) => (
                      <div key={notification.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-2 rounded-full ${
                                notification.type === "announcement"
                                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                  : notification.type === "alert"
                                    ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                                    : notification.type === "event"
                                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                      : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                              }`}
                            >
                              <Bell className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{notification.title}</h3>
                                <Badge
                                  variant={
                                    notification.status === "sent"
                                      ? "default"
                                      : notification.status === "scheduled"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {notification.status}
                                </Badge>
                              </div>
                              <p className="text-sm mt-1 line-clamp-2">{notification.content}</p>
                              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                <span>
                                  {notification.status === "sent"
                                    ? `Sent on ${formatDate(notification.sentAt || notification.createdAt)}`
                                    : notification.status === "scheduled"
                                      ? `Scheduled for ${formatDate(notification.scheduledFor || "")}`
                                      : `Created on ${formatDate(notification.createdAt)}`}
                                </span>
                                <span>•</span>
                                <span>
                                  Audience:{" "}
                                  {notification.audience === "all"
                                    ? "All Users"
                                    : notification.audience === "user"
                                      ? "Specific User"
                                      : notification.audience === "interest"
                                        ? `Interest: ${notification.interestGroup}`
                                        : notification.audience === "new_users"
                                          ? "New Users"
                                          : notification.audience}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Notification Details</DialogTitle>
                                  <DialogDescription>View and manage notification</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="text-sm font-medium">Type</h3>
                                      <Badge variant="outline" className="mt-1">
                                        {notification.type}
                                      </Badge>
                                    </div>
                                    <div>
                                      <h3 className="text-sm font-medium">Status</h3>
                                      <Badge
                                        variant={
                                          notification.status === "sent"
                                            ? "default"
                                            : notification.status === "scheduled"
                                              ? "secondary"
                                              : "outline"
                                        }
                                        className="mt-1"
                                      >
                                        {notification.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Title</h3>
                                    <p className="text-sm mt-1">{notification.title}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Content</h3>
                                    <p className="text-sm mt-1 whitespace-pre-line">{notification.content}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="text-sm font-medium">Sender</h3>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage
                                            src={notification.sender.avatar || "/placeholder.svg"}
                                            alt={notification.sender.name}
                                          />
                                          <AvatarFallback>{notification.sender.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{notification.sender.name}</span>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="text-sm font-medium">Audience</h3>
                                      <p className="text-sm mt-1">
                                        {notification.audience === "all"
                                          ? "All Users"
                                          : notification.audience === "user"
                                            ? "Specific User"
                                            : notification.audience === "interest"
                                              ? `Interest: ${notification.interestGroup}`
                                              : notification.audience === "new_users"
                                                ? "New Users"
                                                : notification.audience}
                                      </p>
                                    </div>
                                  </div>
                                  {notification.status === "sent" && notification.stats && (
                                    <div className="bg-muted p-4 rounded-md">
                                      <h3 className="text-sm font-medium">Delivery Statistics</h3>
                                      <div className="grid grid-cols-3 gap-4 mt-2">
                                        <div>
                                          <p className="text-sm text-muted-foreground">Delivered</p>
                                          <p className="text-lg font-semibold">{notification.stats.delivered}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Opened</p>
                                          <p className="text-lg font-semibold">{notification.stats.opened}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Clicked</p>
                                          <p className="text-lg font-semibold">{notification.stats.clicked}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <DialogFooter>
                                  {notification.status === "template" && <Button>Use Template</Button>}
                                  {notification.status === "scheduled" && (
                                    <Button variant="destructive">Cancel Scheduled</Button>
                                  )}
                                  <Button variant="outline">Close</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More options</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {notification.status === "template" ? (
                                  <>
                                    <DropdownMenuItem>Use Template</DropdownMenuItem>
                                    <DropdownMenuItem>Edit Template</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">Delete Template</DropdownMenuItem>
                                  </>
                                ) : notification.status === "scheduled" ? (
                                  <>
                                    <DropdownMenuItem>Edit Scheduled</DropdownMenuItem>
                                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">Cancel Scheduled</DropdownMenuItem>
                                  </>
                                ) : (
                                  <>
                                    <DropdownMenuItem>View Analytics</DropdownMenuItem>
                                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Archive</DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sent" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sent Notifications</CardTitle>
                  <CardDescription>Notifications that have been sent to users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredNotifications
                      .filter((notification) => notification.status === "sent")
                      .map((notification) => (
                        <div key={notification.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div
                                className={`p-2 rounded-full ${
                                  notification.type === "announcement"
                                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                    : notification.type === "alert"
                                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                                      : notification.type === "event"
                                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                        : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                                }`}
                              >
                                <Bell className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{notification.title}</h3>
                                <p className="text-sm mt-1 line-clamp-2">{notification.content}</p>
                                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                  <span>Sent on {formatDate(notification.sentAt || notification.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            {notification.stats && (
                              <div className="flex items-center gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Delivered:</span>{" "}
                                  <span className="font-medium">{notification.stats.delivered}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Opened:</span>{" "}
                                  <span className="font-medium">{notification.stats.opened}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Clicked:</span>{" "}
                                  <span className="font-medium">{notification.stats.clicked}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="scheduled" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Notifications</CardTitle>
                  <CardDescription>Notifications scheduled to be sent in the future</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredNotifications
                      .filter((notification) => notification.status === "scheduled")
                      .map((notification) => (
                        <div key={notification.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div
                                className={`p-2 rounded-full ${
                                  notification.type === "announcement"
                                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                    : notification.type === "alert"
                                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                                      : notification.type === "event"
                                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                        : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                                }`}
                              >
                                <Bell className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{notification.title}</h3>
                                <p className="text-sm mt-1 line-clamp-2">{notification.content}</p>
                                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                  <span>Scheduled for {formatDate(notification.scheduledFor || "")}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="templates" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Notification Templates</CardTitle>
                    <CardDescription>Reusable notification templates</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Template
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredNotifications
                      .filter((notification) => notification.status === "template")
                      .map((notification) => (
                        <div key={notification.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div
                                className={`p-2 rounded-full ${
                                  notification.type === "announcement"
                                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                    : notification.type === "alert"
                                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                                      : notification.type === "event"
                                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                        : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                                }`}
                              >
                                <Bell className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{notification.title}</h3>
                                <p className="text-sm mt-1 line-clamp-2">{notification.content}</p>
                                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                  <span>Created on {formatDate(notification.createdAt)}</span>
                                  <span>•</span>
                                  <span>Type: {notification.type}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button size="sm">Use</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ThemeProvider>
  )
}
