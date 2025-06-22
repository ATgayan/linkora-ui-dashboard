"use client"

import { useState } from "react"
import { Check, ChevronDown, Filter, MessageSquare, MoreHorizontal, Search, UserPlus, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardLayout } from "../dashboard-layout"

// Sample collaboration projects
const collaborationProjects = [
  {
    id: 1,
    title: "Mobile App Development",
    description: "Building a campus events app with React Native and Firebase",
    category: "Programming",
    skills: ["React Native", "Firebase", "UI/UX Design"],
    status: "active",
    progress: 65,
    members: [
      {
        id: 1,
        name: "Alex Johnson",
        role: "Project Lead",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        name: "Maya Patel",
        role: "UI Designer",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 3,
        name: "Jordan Lee",
        role: "Backend Developer",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    startDate: "2023-10-15",
    endDate: "2023-12-20",
  },
  {
    id: 2,
    title: "Music Production Collaboration",
    description: "Creating an original song for the university talent show",
    category: "Music",
    skills: ["Composition", "Vocals", "Audio Production"],
    status: "active",
    progress: 40,
    members: [
      {
        id: 4,
        name: "Taylor Smith",
        role: "Composer",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 5,
        name: "Sam Rodriguez",
        role: "Vocalist",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    startDate: "2023-11-01",
    endDate: "2023-12-10",
  },
  {
    id: 3,
    title: "Research Paper on Climate Change",
    description: "Collaborative research on climate change impacts on urban areas",
    category: "Research",
    skills: ["Research", "Academic Writing", "Data Analysis"],
    status: "pending",
    progress: 0,
    members: [
      {
        id: 6,
        name: "Jamie Wilson",
        role: "Lead Researcher",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    startDate: "2023-11-20",
    endDate: "2024-02-28",
  },
  {
    id: 4,
    title: "Photography Exhibition",
    description: "Organizing a campus-wide photography exhibition on cultural diversity",
    category: "Photography",
    skills: ["Photography", "Event Planning", "Graphic Design"],
    status: "active",
    progress: 80,
    members: [
      {
        id: 7,
        name: "Casey Brown",
        role: "Lead Photographer",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 8,
        name: "Riley Garcia",
        role: "Event Coordinator",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 9,
        name: "Avery Thompson",
        role: "Graphic Designer",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    startDate: "2023-09-10",
    endDate: "2023-11-30",
  },
  {
    id: 5,
    title: "Short Film Production",
    description: "Creating a short film for the university film festival",
    category: "Film",
    skills: ["Directing", "Cinematography", "Editing"],
    status: "completed",
    progress: 100,
    members: [
      {
        id: 10,
        name: "Morgan Kim",
        role: "Director",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 11,
        name: "Drew Patel",
        role: "Cinematographer",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 12,
        name: "Quinn Chen",
        role: "Editor",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    startDate: "2023-08-15",
    endDate: "2023-10-30",
  },
]

// Sample collaboration requests
const collaborationRequests = [
  {
    id: 1,
    projectId: 1,
    user: {
      id: 13,
      name: "Reese Martinez",
      role: "Mobile Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["React Native", "JavaScript", "UI Design"],
    },
    message:
      "I have experience with React Native and would love to join this project to help with the frontend development.",
    status: "pending",
    date: "2023-11-14",
  },
  {
    id: 2,
    projectId: 2,
    user: {
      id: 14,
      name: "Jordan Parker",
      role: "Audio Engineer",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["Audio Production", "Mixing", "Sound Design"],
    },
    message: "I'm an audio engineering student and would like to help with the production and mixing of the song.",
    status: "pending",
    date: "2023-11-13",
  },
  {
    id: 3,
    projectId: 4,
    user: {
      id: 15,
      name: "Cameron Wright",
      role: "Photographer",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["Photography", "Editing", "Composition"],
    },
    message:
      "I specialize in portrait photography and would love to contribute to the exhibition with my work on cultural diversity.",
    status: "pending",
    date: "2023-11-12",
  },
]

// Sample skill matches
const skillMatches = [
  {
    projectId: 1,
    project: "Mobile App Development",
    users: [
      {
        id: 16,
        name: "Skyler Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        matchedSkills: ["React Native", "Firebase"],
        matchPercentage: 85,
      },
      {
        id: 17,
        name: "Hayden Lee",
        avatar: "/placeholder.svg?height=40&width=40",
        matchedSkills: ["React Native", "UI/UX Design"],
        matchPercentage: 75,
      },
    ],
  },
  {
    projectId: 3,
    project: "Research Paper on Climate Change",
    users: [
      {
        id: 18,
        name: "Addison Taylor",
        avatar: "/placeholder.svg?height=40&width=40",
        matchedSkills: ["Research", "Academic Writing"],
        matchPercentage: 90,
      },
      {
        id: 19,
        name: "Riley Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
        matchedSkills: ["Data Analysis", "Research"],
        matchPercentage: 80,
      },
    ],
  },
]

export default function CollaborationBoard() {
  const [selectedTab, setSelectedTab] = useState("projects")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProjects = collaborationProjects.filter((project) => {
    // Filter by status
    if (statusFilter !== "all" && project.status !== statusFilter) return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.skills.some((skill) => skill.toLowerCase().includes(query)) ||
        project.members.some((member) => member.name.toLowerCase().includes(query))
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
    }).format(date)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-4 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Collaboration Board</h1>
              <p className="text-muted-foreground">Manage collaboration projects and connect students</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Collaboration Project</DialogTitle>
                    <DialogDescription>Set up a new project for students to collaborate on</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Project Title
                      </label>
                      <Input id="title" placeholder="Enter project title" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="description" className="text-sm font-medium">
                        Description
                      </label>
                      <textarea
                        id="description"
                        placeholder="Enter project description"
                        className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="category" className="text-sm font-medium">
                          Category
                        </label>
                        <Input id="category" placeholder="e.g., Programming" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="status" className="text-sm font-medium">
                          Status
                        </label>
                        <select
                          id="status"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="startDate" className="text-sm font-medium">
                          Start Date
                        </label>
                        <Input id="startDate" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="endDate" className="text-sm font-medium">
                          End Date
                        </label>
                        <Input id="endDate" type="date" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Required Skills</label>
                      <div className="flex flex-wrap gap-2">
                        <Input placeholder="Add a skill and press Enter" className="w-full" />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          React Native
                          <button className="ml-1 rounded-full hover:bg-muted">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          UI/UX Design
                          <button className="ml-1 rounded-full hover:bg-muted">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Firebase
                          <button className="ml-1 rounded-full hover:bg-muted">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Project</Button>
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
                  <DropdownMenuLabel>Filter By Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Projects</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects, skills, or members..."
                className="w-full pl-8 md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Tabs defaultValue="projects" onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="matches">Skill Matches</TabsTrigger>
            </TabsList>
            <TabsContent value="projects" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">{project.description}</CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Project</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Find Matches</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete Project</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="outline">{project.category}</Badge>
                        {project.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="outline" className="bg-primary/10">
                            {skill}
                          </Badge>
                        ))}
                        {project.skills.length > 2 && <Badge variant="outline">+{project.skills.length - 2}</Badge>}
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-1 text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                        <div>
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </div>
                        <Badge
                          variant={
                            project.status === "active"
                              ? "default"
                              : project.status === "completed"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((member) => (
                          <Avatar key={member.id} className="border-2 border-background">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {project.members.length > 3 && (
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-medium">
                            +{project.members.length - 3}
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="requests" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Collaboration Requests</CardTitle>
                  <CardDescription>Review and manage requests to join projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {collaborationRequests.map((request) => {
                      const project = collaborationProjects.find((p) => p.id === request.projectId)
                      return (
                        <div key={request.id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={request.user.avatar || "/placeholder.svg"} alt={request.user.name} />
                                <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold">{request.user.name}</h3>
                                <p className="text-sm text-muted-foreground">{request.user.role}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {request.user.skills.map((skill) => (
                                    <Badge key={skill} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end">
                              <Badge variant="outline">Project: {project?.title || "Unknown Project"}</Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                Requested on {formatDate(request.date)}
                              </p>
                            </div>
                          </div>
                          <p className="mt-4 text-sm">{request.message}</p>
                          <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <X className="mr-2 h-4 w-4" />
                              Decline
                            </Button>
                            <Button size="sm">
                              <Check className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="matches" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skill Matches</CardTitle>
                  <CardDescription>Suggested matches based on skills and interests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {skillMatches.map((match) => {
                      const project = collaborationProjects.find((p) => p.id === match.projectId)
                      return (
                        <div key={match.projectId} className="border rounded-lg p-4">
                          <h3 className="font-semibold">Project: {match.project}</h3>
                          <p className="text-sm text-muted-foreground">Skills needed: {project?.skills.join(", ")}</p>
                          <div className="mt-4 space-y-4">
                            {match.users.map((user) => (
                              <div key={user.id} className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  <Avatar>
                                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-medium">{user.name}</h4>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {user.matchedSkills.map((skill) => (
                                        <Badge key={skill} variant="outline" className="text-xs bg-primary/10">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <Badge
                                    variant="outline"
                                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  >
                                    {user.matchPercentage}% Match
                                  </Badge>
                                  <div className="flex gap-2 mt-2">
                                    <Button variant="outline" size="sm">
                                      View Profile
                                    </Button>
                                    <Button size="sm">Invite</Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
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
