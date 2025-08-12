"use client";
import { BarChart3, Users, Users2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardLayout } from "./dashboard";

const ICON_MAP = { Users, Users2, TrendingUp };

type GenderData = { label: string; value: number; color: string }[];
type YearData = { label: string; value: number; color: string }[];
type SkillData = { name: string; count: number; color: string }[];
type InterestData = { name: string; count: number; color: string }[];
type ActivityData = {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: string;
  color: string;
}[];

type DashboardData = {
  genderData: GenderData;
  yearData: YearData;
  topSkills: SkillData;
  topInterests: InterestData;
  recentActivity: ActivityData;
  totalUsers: number;
  monthlyGrowth: string;
};

// Mock data for fallback
const dummyData: DashboardData = {
  genderData: [
    { label: "Male", value: 45, color: "bg-blue-500" },
    { label: "Female", value: 55, color: "bg-green-500" },
  ],
  yearData: [
    { label: "1st Year", value: 35, color: "bg-blue-400" },
    { label: "2nd Year", value: 28, color: "bg-blue-500" },
    { label: "3rd Year", value: 22, color: "bg-blue-600" },
    { label: "4th Year", value: 15, color: "bg-blue-700" },
  ],
  topSkills: [
    { name: "Programming", count: 234, color: "#3b82f6" },
    { name: "Design", count: 189, color: "#6366f1" },
    { name: "Writing", count: 156, color: "#8b5cf6" },
    { name: "Photography", count: 134, color: "#a855f7" },
    { name: "Music", count: 98, color: "#c084fc" },
    { name: "Research", count: 87, color: "#d8b4fe" },
  ],
  topInterests: [
    { name: "Technology", count: 298, color: "#10b981" },
    { name: "Arts", count: 245, color: "#06b6d4" },
    { name: "Sports", count: 198, color: "#8b5cf6" },
    { name: "Music", count: 167, color: "#f59e0b" },
    { name: "Travel", count: 134, color: "#ef4444" },
    { name: "Gaming", count: 123, color: "#84cc16" },
  ],
  recentActivity: [
    {
      id: 1,
      type: "user_joined",
      message: "New user Alex Johnson joined",
      time: "2 minutes ago",
      icon: "Users",
      color: "text-green-600",
    },
    {
      id: 2,
      type: "collaboration_created",
      message: "New collaboration 'Mobile App Project' created",
      time: "15 minutes ago",
      icon: "Users2",
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "report_submitted",
      message: "User reported for inappropriate content",
      time: "1 hour ago",
      icon: "TrendingUp",
      color: "text-red-600",
    },
    {
      id: 4,
      type: "user_approved",
      message: "User Maya Patel approved by admin",
      time: "2 hours ago",
      icon: "Users",
      color: "text-green-600",
    },
  ],
  totalUsers: 24,
  monthlyGrowth: "+12.5%",
};

// Percentage Bar Component
const PercentageBar = ({ data }: { data: GenderData | YearData }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const percentage = total ? ((item.value / total) * 100).toFixed(1) : 0;
        const barWidth = ((item.value / maxValue) * 100).toFixed(1);

        return (
          <div key={item.label} className="flex items-center gap-3">
            <div className="w-20 text-sm font-medium text-right">
              {item.label}
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-between px-2"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: item.color
                      .replace("bg-", "")
                      .replace("-500", ""),
                    background: item.color.includes("blue")
                      ? "#3b82f6"
                      : item.color.includes("pink")
                      ? "#ec4899"
                      : item.color.includes("purple")
                      ? "#8b5cf6"
                      : item.color.includes("green")
                      ? "#10b981"
                      : item.color.includes("orange")
                      ? "#f59e0b"
                      : item.color.includes("red")
                      ? "#ef4444"
                      : "#6b7280",
                  }}
                >
                  <span className="text-white text-xs font-medium">
                    {item.value}
                  </span>
                  <span className="text-white text-xs font-medium">
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function Dashboard() {
  // State variables
  const [genderData, setGenderData] = useState<GenderData>([]);
  const [yearData, setYearData] = useState<YearData>([]);
  const [topSkills, setTopSkills] = useState<SkillData>([]);
  const [topInterests, setTopInterests] = useState<InterestData>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityData>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [monthlyGrowth, setMonthlyGrowth] = useState<string>("0%");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
  // API call to fetch dashboard data
  const fetchDashboardData = async (): Promise<DashboardData | null> => {
    try {
      const response = await fetch(`${baseurl}/admin/dashboar`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DashboardData = await response.json();
      return data;
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiData = await fetchDashboardData();
        
        if (apiData) {
          // Use API data if successful
          setGenderData(apiData.genderData);
          setYearData(apiData.yearData);
          setTopSkills(apiData.topSkills);
          setTopInterests(apiData.topInterests);
          setRecentActivity(apiData.recentActivity);
          setTotalUsers(apiData.totalUsers);
          setMonthlyGrowth(apiData.monthlyGrowth);
          console.log('Dashboard data loaded from API successfully');
        } else {
          // Fallback to dummy data if API fails
          setGenderData(dummyData.genderData);
          setYearData(dummyData.yearData);
          setTopSkills(dummyData.topSkills);
          setTopInterests(dummyData.topInterests);
          setRecentActivity(dummyData.recentActivity);
          setTotalUsers(dummyData.totalUsers);
          setMonthlyGrowth(dummyData.monthlyGrowth);
          console.log('Using dummy data as fallback');
        }
      } catch (err) {
        console.error('Error in loadDashboardData:', err);
        // Use dummy data as final fallback
        setGenderData(dummyData.genderData);
        setYearData(dummyData.yearData);
        setTopSkills(dummyData.topSkills);
        setTopInterests(dummyData.topInterests);
        setRecentActivity(dummyData.recentActivity);
        setTotalUsers(dummyData.totalUsers);
        setMonthlyGrowth(dummyData.monthlyGrowth);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Bar Chart Component
  const BarChart = ({ data }: { data: SkillData }) => {
    const maxCount = Math.max(
      ...data.map((item: SkillData[number]) => item.count)
    );

    return (
      <div className="space-y-3">
        {data.map((item: SkillData[number]) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="w-20 text-sm font-medium text-right">
              {item.name}
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{
                    width: `${(item.count / maxCount) * 100}%`,
                    backgroundColor: item.color,
                  }}
                >
                  <span className="text-white text-xs font-medium">
                    {item.count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Pie Chart Component
  const PieChart = ({ data }: { data: InterestData }) => {
    const total = data.reduce(
      (sum: number, item: InterestData[number]) => sum + item.count,
      0
    );
    let cumulativePercentage = 0;

    const segments = data.map((item: InterestData[number]) => {
      const percentage = (item.count / total) * 100;
      const startAngle = cumulativePercentage * 3.6; // Convert to degrees
      cumulativePercentage += percentage;
      return {
        ...item,
        percentage,
        startAngle,
        endAngle: cumulativePercentage * 3.6,
      };
    });

    return (
      <div className="flex items-center gap-6">
        <div className="relative">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="transform -rotate-90"
          >
            <circle cx="100" cy="100" r="80" fill="transparent" />
            {segments.map(
              (segment: (typeof segments)[number], index: number) => {
                const { startAngle, endAngle, color } = segment;
                const startAngleRad = (startAngle * Math.PI) / 180;
                const endAngleRad = (endAngle * Math.PI) / 180;

                const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

                const x1 = 100 + 80 * Math.cos(startAngleRad);
                const y1 = 100 + 80 * Math.sin(startAngleRad);
                const x2 = 100 + 80 * Math.cos(endAngleRad);
                const y2 = 100 + 80 * Math.sin(endAngleRad);

                const pathData = [
                  `M 100 100`,
                  `L ${x1} ${y1}`,
                  `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  `Z`,
                ].join(" ");

                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                  />
                );
              }
            )}
          </svg>
        </div>
        <div className="space-y-2">
          {segments.map((segment: (typeof segments)[number]) => (
            <div key={segment.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm font-medium">{segment.name}</span>
              <span className="text-sm text-muted-foreground">
                {segment.count} ({segment.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <DashboardLayout>
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-lg font-medium">Loading dashboard...</p>
          </div>
        </DashboardLayout>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-4 md:p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening on your platform.

            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{monthlyGrowth}</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Gender Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>User demographics breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <PercentageBar data={genderData} />
              </CardContent>
            </Card>

            {/* University Year Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>University Year Distribution</CardTitle>
                <CardDescription>Students by academic year</CardDescription>
              </CardHeader>
              <CardContent>
                <PercentageBar data={yearData} />
              </CardContent>
            </Card>
          </div>

          {/* Skills and Interests Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Skills - Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Most Common Skills</CardTitle>
                <CardDescription>Popular skills among users</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart data={topSkills} />
              </CardContent>
            </Card>

            {/* Top Interests - Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Most Common Interests</CardTitle>
                <CardDescription>Popular interests among users</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart data={topInterests} />
              </CardContent>
            </Card>
          </div>

          
        </div>
      </DashboardLayout>
    </ThemeProvider>
  );
}