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
                    backgroundColor: item.color,
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

// Bar Chart Component
const BarChart = ({ data }: { data: SkillData }) => {
  const maxCount = Math.max(...data.map((item) => item.count));
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.name} className="flex items-center gap-3">
          <div className="w-20 text-sm font-medium text-right">{item.name}</div>
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
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let cumulativePercentage = 0;

  const segments = data.map((item) => {
    const percentage = (item.count / total) * 100;
    const startAngle = cumulativePercentage * 3.6;
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
        <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
          <circle cx="100" cy="100" r="80" fill="transparent" />
          {segments.map((segment, index) => {
            const { startAngle, endAngle, color } = segment;
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
            const x1 = 100 + 80 * Math.cos(startAngleRad);
            const y1 = 100 + 80 * Math.sin(startAngleRad);
            const x2 = 100 + 80 * Math.cos(endAngleRad);
            const y2 = 100 + 80 * Math.sin(endAngleRad);

            return (
              <path
                key={index}
                d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
      <div className="space-y-2">
        {segments.map((segment) => (
          <div key={segment.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
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

export default function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [genderData, setGenderData] = useState<GenderData>([]);
  const [yearData, setYearData] = useState<YearData>([]);
  const [topSkills, setTopSkills] = useState<SkillData>([]);
  const [topInterests, setTopInterests] = useState<InterestData>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityData>([]);

  const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetch(`${baseurl}/admin/dashboard`,{
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserCount(data.userCount ?? 0);
        setGenderData(data.gender ?? []);
        setYearData(data.year ?? []);
        setTopSkills(data.skills ?? []);
        setTopInterests(data.interests ?? []);
        setRecentActivity(data.activity ?? []);
      })
      .catch((err) => console.error("Failed to load dashboard data", err));
  }, []);
  console.log(userCount)
  console.log(genderData)
  console.log(yearData)
  console.log(topSkills)
  console.log(topInterests)
  console.log(recentActivity)
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-4 md:p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening on your platform.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>User demographics breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <PercentageBar data={genderData} />
              </CardContent>
            </Card>

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

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Most Common Skills</CardTitle>
                <CardDescription>Popular skills among users</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart data={topSkills} />
              </CardContent>
            </Card>

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
