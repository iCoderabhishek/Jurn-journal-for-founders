"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  Sparkles,
  TrendingUp,
  Heart,
  Target,
  BookOpen,
  Lightbulb,
  Users,
  Calendar,
  Award,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AIResponseProps {
  question: string;
  onClose?: () => void;
}

interface InsightData {
  type: "pattern" | "emotional" | "growth" | "recommendation";
  title: string;
  content: string;
  metrics?: {
    label: string;
    value: string | number;
    trend?: "up" | "down" | "stable";
  }[];
  recommendations?: string[];
  confidence: number;
}

const AIResponse: React.FC<AIResponseProps> = ({ question, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [copied, setCopied] = useState(false);

  // Generate contextual AI response based on question
  const generateResponse = (question: string): InsightData[] => {
    const lowerQuestion = question.toLowerCase();

    if (
      lowerQuestion.includes("pattern") ||
      lowerQuestion.includes("writing")
    ) {
      return [
        {
          type: "pattern",
          title: "Writing Pattern Analysis",
          content:
            "Your writing shows a strong preference for morning sessions (9-11 AM), with 73% of your most insightful entries created during this time. You tend to write longer, more reflective pieces on Tuesdays and Wednesdays.",
          metrics: [
            { label: "Peak Writing Time", value: "9:30 AM", trend: "stable" },
            { label: "Average Session", value: "12 min", trend: "up" },
            { label: "Weekly Consistency", value: "85%", trend: "up" },
          ],
          recommendations: [
            "Block 9-11 AM for your most important writing",
            "Consider shorter sessions on weekends to maintain momentum",
            "Use Tuesday energy for tackling complex topics",
          ],
          confidence: 92,
        },
      ];
    }

    if (lowerQuestion.includes("mood") || lowerQuestion.includes("emotional")) {
      return [
        {
          type: "emotional",
          title: "Emotional Intelligence Insights",
          content:
            "Your emotional awareness has increased 28% over the past month. You show strong resilience patterns, with challenging days typically followed by reflective, growth-oriented entries within 2-3 days.",
          metrics: [
            { label: "Emotional Range", value: "Balanced", trend: "up" },
            { label: "Recovery Time", value: "2.3 days", trend: "up" },
            { label: "Positivity Score", value: "82%", trend: "up" },
          ],
          recommendations: [
            "Continue documenting emotional triggers for better self-awareness",
            "Your reflection practice is accelerating emotional processing",
            "Consider exploring the connection between sleep and mood patterns",
          ],
          confidence: 88,
        },
      ];
    }

    if (lowerQuestion.includes("goal") || lowerQuestion.includes("progress")) {
      return [
        {
          type: "growth",
          title: "Goal Achievement Analysis",
          content:
            "You're making excellent progress on leadership development goals. Your entries show increased strategic thinking and team-focused problem-solving. Goal completion rate has improved 34% this quarter.",
          metrics: [
            { label: "Goal Completion", value: "67%", trend: "up" },
            { label: "Strategic Thinking", value: "+34%", trend: "up" },
            { label: "Team Focus", value: "High", trend: "up" },
          ],
          recommendations: [
            "Set more specific milestones for Q1 objectives",
            "Document decision-making processes for future reference",
            "Consider adding weekly team reflection sessions",
          ],
          confidence: 91,
        },
      ];
    }

    if (
      lowerQuestion.includes("leadership") ||
      lowerQuestion.includes("team")
    ) {
      return [
        {
          type: "growth",
          title: "Leadership Development Insights",
          content:
            "Your leadership style is evolving toward collaborative decision-making. Recent entries show 45% more team-focused language and increased empathy in conflict resolution approaches.",
          metrics: [
            { label: "Team Mentions", value: "+45%", trend: "up" },
            { label: "Collaborative Language", value: "High", trend: "up" },
            { label: "Decision Confidence", value: "89%", trend: "up" },
          ],
          recommendations: [
            "Document successful team interventions for future reference",
            "Consider regular one-on-one reflection sessions",
            "Explore delegation strategies in your next entries",
          ],
          confidence: 94,
        },
      ];
    }

    // Default comprehensive response
    return [
      {
        type: "recommendation",
        title: "Personalized Insights",
        content:
          "Based on your recent journaling patterns, you're developing strong self-awareness and strategic thinking skills. Your writing shows consistent growth in emotional intelligence and leadership capabilities.",
        metrics: [
          { label: "Self-Awareness", value: "+28%", trend: "up" },
          { label: "Writing Consistency", value: "85%", trend: "up" },
          { label: "Reflection Depth", value: "Deep", trend: "stable" },
        ],
        recommendations: [
          "Continue your current writing schedule for optimal results",
          "Consider exploring specific leadership challenges in more detail",
          "Document key learnings at the end of each week",
        ],
        confidence: 87,
      },
    ];
  };

  useEffect(() => {
    // Simulate AI processing time
    const timer = setTimeout(() => {
      setInsights(generateResponse(question));
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [question]);

  const handleCopy = async () => {
    const responseText = insights
      .map(
        (insight) =>
          `${insight.title}\n\n${insight.content}\n\nRecommendations:\n${insight.recommendations?.map((rec) => `• ${rec}`).join("\n")}`
      )
      .join("\n\n---\n\n");

    try {
      await navigator.clipboard.writeText(responseText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "pattern":
        return <BookOpen className="h-6 w-6 text-blue-500" />;
      case "emotional":
        return <Heart className="h-6 w-6 text-red-500" />;
      case "growth":
        return <TrendingUp className="h-6 w-6 text-green-500" />;
      case "recommendation":
        return <Lightbulb className="h-6 w-6 text-yellow-500" />;
      default:
        return <Brain className="h-6 w-6 text-purple-500" />;
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/10 dark:to-pink-950/10 border-purple-200 dark:border-purple-800">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">
              AI is analyzing your question...
            </h3>
            <p className="text-base text-muted-foreground">
              Processing your journal data for insights
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
            <span className="text-base">Analyzing writing patterns...</span>
          </div>
          <div className="flex items-center space-x-3">
            <div
              className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <span className="text-base">Processing emotional data...</span>
          </div>
          <div className="flex items-center space-x-3">
            <div
              className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"
              style={{ animationDelay: "0.4s" }}
            ></div>
            <span className="text-base">Generating recommendations...</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/10 dark:to-pink-950/10 border-purple-200 dark:border-purple-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">AI Analysis Complete</h3>
              <p className="text-base text-muted-foreground">
                Based on your question: "{question}"
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="text-sm"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Insights */}
      {insights.map((insight, index) => (
        <Card key={index} className="p-8">
          <CardHeader className="px-0 pt-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center">
                {getIconForType(insight.type)}
                <span className="ml-3">{insight.title}</span>
              </CardTitle>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {insight.confidence}% confidence
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="px-0 space-y-6">
            {/* Main Content */}
            <p className="text-lg leading-relaxed text-muted-foreground">
              {insight.content}
            </p>

            {/* Metrics */}
            {insight.metrics && insight.metrics.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Key Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {insight.metrics.map((metric, metricIndex) => (
                    <div
                      key={metricIndex}
                      className="p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          {metric.label}
                        </span>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="text-xl font-bold">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {insight.recommendations && insight.recommendations.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-500" />
                  Recommendations
                </h4>
                <div className="space-y-3">
                  {insight.recommendations.map((rec, recIndex) => (
                    <div
                      key={recIndex}
                      className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <ChevronRight className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-base">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confidence Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analysis Confidence</span>
                <span>{insight.confidence}%</span>
              </div>
              <Progress value={insight.confidence} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Follow-up Suggestions */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <div className="text-center space-y-4">
          <div className="text-3xl">💡</div>
          <h4 className="text-xl font-semibold">Want to explore further?</h4>
          <p className="text-base text-muted-foreground">
            Ask follow-up questions or explore different aspects of your
            journaling journey
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge
              variant="outline"
              className="text-sm px-3 py-1 cursor-pointer hover:bg-muted"
            >
              "How can I improve this?"
            </Badge>
            <Badge
              variant="outline"
              className="text-sm px-3 py-1 cursor-pointer hover:bg-muted"
            >
              "Show me more patterns"
            </Badge>
            <Badge
              variant="outline"
              className="text-sm px-3 py-1 cursor-pointer hover:bg-muted"
            >
              "What should I focus on next?"
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIResponse;
