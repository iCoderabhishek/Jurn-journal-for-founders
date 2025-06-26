import React from "react";
import {
  Calendar,
  BookOpen,
  TrendingUp,
  Award,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Import data
import dummyData from "@/lib/dummyDataDashboard.json";
import { redirect } from "next/navigation";

interface TimelineProps {}

const Timeline: React.FC<TimelineProps> = () => {
  // Generate timeline data for the past 12 weeks
  const generateTimelineData = () => {
    const weeks = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - i * 7);

      const weekNumber = 12 - i;
      const entriesCount = Math.floor(Math.random() * 7) + 1; // 1-7 entries per week
      const avgMood = ["😊", "🤔", "😌", "💼", "🙂"][
        Math.floor(Math.random() * 5)
      ];

      weeks.push({
        week: weekNumber,
        date: weekStart,
        entries: entriesCount,
        avgMood,
        highlight:
          i === 0
            ? "Current Week"
            : i === 1
              ? "Last Week"
              : weekNumber === 5
                ? "First 30 Days!"
                : weekNumber === 8
                  ? "Breakthrough Week"
                  : null,
        completionRate: Math.floor(Math.random() * 40) + 60, // 60-100%
      });
    }

    return weeks;
  };

  const timelineData = generateTimelineData();
  const totalEntries = timelineData.reduce(
    (sum, week) => sum + week.entries,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-2">
              Your Journey 🗓️
            </h1>
            <p className="text-xl text-muted-foreground">
              Track your journaling progress over time
            </p>
          </div>
          <Button variant="outline" size="lg" className="hidden sm:flex">
            View Insights
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-6 w-6 text-blue-500" />
            <div>
              <div className="text-3xl font-bold">{totalEntries}</div>
              <p className="text-sm text-muted-foreground">Total Entries</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-green-500" />
            <div>
              <div className="text-3xl font-bold">12</div>
              <p className="text-sm text-muted-foreground">Weeks Tracked</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-purple-500" />
            <div>
              <div className="text-3xl font-bold">78%</div>
              <p className="text-sm text-muted-foreground">Consistency</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <Award className="h-6 w-6 text-orange-500" />
            <div>
              <div className="text-3xl font-bold">3</div>
              <p className="text-sm text-muted-foreground">Milestones</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Timeline Visualization */}
      <Card className="p-8">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold flex items-center">
            <span className="mr-3">📈</span>
            Weekly Progress Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-6">
            {/* Timeline Line */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

              <div className="space-y-8">
                {timelineData.map((week, index) => (
                  <div
                    key={week.week}
                    className="relative flex items-start space-x-6"
                  >
                    {/* Timeline Dot */}
                    <div
                      className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${
                        week.highlight
                          ? "bg-primary border-primary"
                          : "bg-background border-border"
                      }`}
                    >
                      <span className="text-lg font-bold">{week.week}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-8">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">
                            Week {week.week}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {week.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        {week.highlight && (
                          <Badge variant="secondary" className="text-sm">
                            {week.highlight}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">
                            <span className="font-semibold">
                              {week.entries}
                            </span>{" "}
                            entries
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{week.avgMood}</span>
                          <span className="text-sm text-muted-foreground">
                            avg mood
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">
                            <span className="font-semibold">
                              {week.completionRate}%
                            </span>{" "}
                            complete
                          </span>
                        </div>
                      </div>

                      <Progress value={week.completionRate} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold">Want deeper insights?</h3>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Discover patterns, track your growth, and get personalized
              recommendations in your detailed insights dashboard.
            </p>
            <Button
              size="lg"
              className="mt-6 cursor-pointer"
              onClick={() => redirect("/dashboard/insights")}
            >
              View Detailed Insights
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timeline;
