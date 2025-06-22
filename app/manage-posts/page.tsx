"use client"

import { useState } from "react"
import { AlertCircle, ChevronDown, Eye, Filter, MoreHorizontal, Search, Trash } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardLayout } from "../dashboard-layout"

// Sample post data
const posts = [
  {
    id: 1,
    title: "Looking for a coding partner for a mobile app project",
    content:
      "Hi everyone! I'm looking for someone to collaborate with on a mobile app project. I have experience with React Native and would love to work with someone who knows backend development. Let me know if you're interested!",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Collaboration",
    tags: ["Programming", "Mobile App", "React Native"],
    status: "published",
    likes: 24,
    comments: 8,
    reported: false,
    createdAt: "2023-11-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Photography workshop this weekend",
    content:
      "I'm hosting a photography workshop this weekend at the campus garden. We'll cover basic techniques, composition, and editing. Bring your camera or smartphone! Limited to 15 participants.",
    author: {
      name: "Maya Patel",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Event",
    tags: ["Photography", "Workshop", "Campus Event"],
    status: "published",
    likes: 42,
    comments: 15,
    reported: false,
    createdAt: "2023-11-14T14:45:00Z",
  },
  {
    id: 3,
    title: "Need feedback on my latest music composition",
    content:
      "I just finished a new piano composition for my music theory class. Would love to get some feedback from other music students before I submit it. Link to listen in the comments!",
    author: {
      name: "Jordan Lee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Feedback",
    tags: ["Music", "Composition", "Piano"],
    status: "published",
    likes: 18,
    comments: 7,
    reported: false,
    createdAt: "2023-11-13T09:15:00Z",
  },
  {
    id: 4,
    title: "Inappropriate content - please remove",
    content:
      "This post contains content that violates community guidelines with offensive language and personal attacks against other students.",
    author: {
      name: "Anonymous User",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Discussion",
    tags: ["Campus Life"],
    status: "flagged",
    likes: 3,
    comments: 12,
    reported: true,
    createdAt: "2023-11-12T16:20:00Z",
  },
  {
    id: 5,
    title: "Study group for final exams",
    content:
      "I'm organizing a study group for the upcoming Computer Science finals. We'll meet at the library every Tuesday and Thursday from 6-8pm. All CS majors welcome!",
    author: {
      name: "Taylor Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Study Group",
    tags: ["Computer Science", "Finals", "Study Group"],
    status: "published",
    likes: 35,
    comments: 22,
    reported: false,
    createdAt: "2023-11-11T11:50:00Z",
  },
  {
    id: 6,
    title: "Spam post with external links",
    content:
      "Check out these amazing products for students! [Multiple suspicious links to external websites with questionable offers]",
    author: {
      name: "Unknown User",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Other",
    tags: ["Deals", "Products"],
    status: "flagged",
    likes: 0,
    comments: 2,
    reported: true,
    createdAt: "2023-11-10T08:30:00Z",
  },
]

export default function ManagePosts() {
  const [selectedPosts, setSelectedPosts] = useState<number[]>([])
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = posts.filter((post) => {
    // Filter by tab
    if (selectedTab === "published" && post.status !== "published") return false
    if (selectedTab === "flagged" && post.status !== "flagged") return false
    if (selectedTab === "reported" && !post.reported) return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return true
  })

  const toggleSelectPost = (postId: number) => {
    setSelectedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const toggleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(filteredPosts.map((post) => post.id))
    }
  }

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
              <h1 className="text-3xl font-bold tracking-tight">Manage Posts</h1>
              <p className="text-muted-foreground">Review and moderate content on the Linkora platform</p>
            </div>
          </div>
          <Card>
            <CardHeader className="p-4 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search posts..."
                      className="w-full pl-8 md:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                        <span className="sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Category</DropdownMenuItem>
                      <DropdownMenuItem>Tags</DropdownMenuItem>
                      <DropdownMenuItem>Date Posted</DropdownMenuItem>
                      <DropdownMenuItem>Engagement</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setSelectedTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All Posts</TabsTrigger>
                    <TabsTrigger value="flagged">Flagged</TabsTrigger>
                    <TabsTrigger value="reported">Reported</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50">
                    <tr>
                      <th scope="col" className="p-4">
                        <Checkbox
                          checked={filteredPosts.length > 0 && selectedPosts.length === filteredPosts.length}
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all posts"
                        />
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Post
                      </th>
                      <th scope="col" className="px-6 py-3 hidden md:table-cell">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                        Engagement
                      </th>
                      <th scope="col" className="px-6 py-3 hidden md:table-cell">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 hidden lg:table-cell">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedPosts.includes(post.id)}
                            onCheckedChange={() => toggleSelectPost(post.id)}
                            aria-label={`Select post ${post.id}`}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="mt-1">
                              <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium line-clamp-1">{post.title}</div>
                              <div className="text-xs text-muted-foreground">By {post.author.name}</div>
                              <div className="text-xs line-clamp-1 mt-1 max-w-md">{post.content}</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {post.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <Badge variant="outline">{post.category}</Badge>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 text-muted-foreground"
                              >
                                <path d="M7 10v12" />
                                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                              </svg>
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 text-muted-foreground"
                              >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                              </svg>
                              <span>{post.comments}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                post.status === "published"
                                  ? "default"
                                  : post.status === "flagged"
                                    ? "destructive"
                                    : "outline"
                              }
                            >
                              {post.status}
                            </Badge>
                            {post.reported && (
                              <Badge
                                variant="outline"
                                className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              >
                                reported
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">{formatDate(post.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Post Details</DialogTitle>
                                  <DialogDescription>Review post content and take action</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="flex items-start gap-4">
                                    <Avatar>
                                      <AvatarImage
                                        src={post.author.avatar || "/placeholder.svg"}
                                        alt={post.author.name}
                                      />
                                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="font-semibold">{post.author.name}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        Posted on {formatDate(post.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-semibold">{post.title}</h2>
                                    <div className="flex flex-wrap gap-2 my-2">
                                      <Badge variant="outline">{post.category}</Badge>
                                      {post.tags.map((tag) => (
                                        <Badge key={tag} variant="outline">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                    <p className="mt-2 text-sm whitespace-pre-line">{post.content}</p>
                                  </div>
                                  {post.reported && (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-800">
                                      <div className="flex items-start gap-2">
                                        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                        <div>
                                          <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                                            This post has been reported
                                          </h4>
                                          <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                            Reason: Violates community guidelines - inappropriate content
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                      >
                                        <path d="M7 10v12" />
                                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                                      </svg>
                                      <span>{post.likes} likes</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                      >
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                      </svg>
                                      <span>{post.comments} comments</span>
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                  {post.status === "flagged" && (
                                    <Button variant="outline" className="sm:mr-auto">
                                      Approve Post
                                    </Button>
                                  )}
                                  <Button variant="outline">Send Warning</Button>
                                  {post.status !== "flagged" ? (
                                    <Button variant="destructive">Flag Post</Button>
                                  ) : (
                                    <Button variant="destructive">Delete Post</Button>
                                  )}
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
                                <DropdownMenuItem>Edit Post</DropdownMenuItem>
                                {post.status === "flagged" ? (
                                  <DropdownMenuItem>Approve Post</DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>Flag Post</DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Contact Author</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Delete Post</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedPosts.length > 0 && (
                <div className="flex items-center justify-between bg-muted/50 p-4">
                  <p className="text-sm">
                    {selectedPosts.length} post{selectedPosts.length > 1 ? "s" : ""} selected
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedPosts([])}>
                      Clear Selection
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm">
                          Bulk Actions
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Approve Selected</DropdownMenuItem>
                        <DropdownMenuItem>Flag Selected</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Selected
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ThemeProvider>
  )
}
