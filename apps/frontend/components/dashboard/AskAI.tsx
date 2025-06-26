import React, { useState } from "react";
import {
  Brain,
  MessageCircle,
  Sparkles,
  Send,
  Lightbulb,
  Target,
  Heart,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { aiAPI, CreateAIQueryData, AIQuery } from "@/config/axios";
import { useMutation } from "@/hooks/useAPI";

interface AskAIProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

// Icon mapping for dynamic rendering
const iconMap = {
  Lightbulb,
  Target,
  Heart,
  Users,
};

// Utility classes for consistency
const cardPadding = "p-8";
const iconSize = "h-6 w-6";
const buttonIconSize = "h-5 w-5";
const textLarge = "text-lg";
const textXLarge = "text-xl";

interface AIPromptCategory {
  category: string;
  icon: keyof typeof iconMap;
  color: string;
  prompts: string[];
}

const AskAI: React.FC<AskAIProps> = ({ isOpen, onToggle }) => {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Use mutation hook for AI queries
  const { mutate: createQuery, loading: isLoading } = useMutation<
    AIQuery,
    CreateAIQueryData
  >(aiAPI.createQuery);

  const aiPrompts: AIPromptCategory[] = [
    {
      category: "Writing Insights",
      icon: "Lightbulb",
      color: "text-yellow-500",
      prompts: [
        "What patterns do you see in my writing style?",
        "How has my writing evolved over time?",
        "What topics do I write about most frequently?",
        "When am I most productive in my writing?",
      ],
    },
    {
      category: "Emotional Analysis",
      icon: "Heart",
      color: "text-red-500",
      prompts: [
        "What emotional patterns emerge from my entries?",
        "How do my moods correlate with my productivity?",
        "What triggers positive vs challenging days?",
        "How can I improve my emotional resilience?",
      ],
    },
    {
      category: "Growth & Goals",
      icon: "Target",
      color: "text-blue-500",
      prompts: [
        "What progress am I making toward my goals?",
        "What obstacles keep appearing in my entries?",
        "How can I accelerate my personal growth?",
        "What should I focus on next quarter?",
      ],
    },
    {
      category: "Leadership Insights",
      icon: "Users",
      color: "text-purple-500",
      prompts: [
        "How has my leadership style evolved?",
        "What team challenges do I mention most?",
        "How do I handle difficult decisions?",
        "What leadership skills should I develop?",
      ],
    },
  ];

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setError(null);

    try {
      const result = await createQuery({
        question: question.trim(),
        category: "general",
      });

      if (result) {
        setQuestion("");
        // TODO: Show success message or navigate to AI response
        console.log("AI query created:", result);
      }
    } catch (err) {
      setError("Failed to submit question. Please try again.");
    }
  };

  const handlePromptClick = (prompt: string) => {
    setQuestion(prompt);
    setError(null);
  };

  const renderIcon = (iconName: keyof typeof iconMap, className: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  return (
    <div className="space-y-6">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={isOpen ? "ask-ai" : undefined}
        onValueChange={(value) => onToggle && onToggle()}
      >
        <AccordionItem value="ask-ai" className="border rounded-lg">
          <AccordionTrigger
            className={`${cardPadding} hover:no-underline`}
            aria-label="Toggle AI assistant section"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold">
                  Get More From Your Journal
                </h3>
                <p className={`${textLarge} text-muted-foreground`}>
                  Ask our AI for insights, prompts, and personalized
                  recommendations
                </p>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-8 pb-8">
            <div className="space-y-8">
              {/* AI Prompt Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiPrompts.map((category, categoryIndex) => (
                  <Card
                    key={categoryIndex}
                    className="p-6 border-dashed hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      {renderIcon(
                        category.icon,
                        `${iconSize} ${category.color}`
                      )}
                      <h4 className={`${textXLarge} font-semibold`}>
                        {category.category}
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {category.prompts.map((prompt, promptIndex) => (
                        <Button
                          key={promptIndex}
                          variant="ghost"
                          className={`w-full text-left justify-start h-auto p-3 ${textLarge} hover:bg-muted/50 transition-colors`}
                          onClick={() => handlePromptClick(prompt)}
                          aria-label={`Use prompt: ${prompt}`}
                          disabled={isLoading}
                        >
                          <MessageCircle
                            className={`${buttonIconSize} mr-3 flex-shrink-0`}
                          />
                          <span className="text-left">{prompt}</span>
                        </Button>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Question Input */}
              <Card
                className={`${cardPadding} bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800`}
              >
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Sparkles className={`${iconSize} text-purple-500`} />
                    <h4 className="text-2xl font-semibold">
                      Ask Your AI Journal Assistant
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <Textarea
                      placeholder="Ask about patterns, prompts, or insights..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className={`min-h-[120px] ${textLarge} resize-none`}
                      aria-label="Ask AI assistant a question"
                      disabled={isLoading}
                    />

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-base text-muted-foreground">
                        <MessageCircle className={buttonIconSize} />
                        <span>AI responses based on your journal patterns</span>
                      </div>

                      <Button
                        onClick={handleAskQuestion}
                        disabled={!question.trim() || isLoading}
                        size="lg"
                        className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 ${textLarge} px-8 py-3 transition-all`}
                        aria-label="Send question to AI assistant"
                      >
                        {isLoading ? (
                          <>
                            <Loader2
                              className={`animate-spin ${buttonIconSize} mr-3`}
                            />
                            Thinking...
                          </>
                        ) : (
                          <>
                            <Send className={`${buttonIconSize} mr-3`} />
                            Ask AI
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div
                    className="text-4xl mb-3"
                    role="img"
                    aria-label="Target icon"
                  >
                    🎯
                  </div>
                  <h5 className={`${textXLarge} font-semibold mb-2`}>
                    Personalized
                  </h5>
                  <p className={`${textLarge} text-muted-foreground`}>
                    Insights tailored to your unique writing style and patterns
                  </p>
                </div>

                <div className="text-center p-6">
                  <div
                    className="text-4xl mb-3"
                    role="img"
                    aria-label="Lightning bolt icon"
                  >
                    ⚡
                  </div>
                  <h5 className={`${textXLarge} font-semibold mb-2`}>
                    Instant
                  </h5>
                  <p className={`${textLarge} text-muted-foreground`}>
                    Get immediate responses and actionable recommendations
                  </p>
                </div>

                <div className="text-center p-6">
                  <div
                    className="text-4xl mb-3"
                    role="img"
                    aria-label="Lock icon"
                  >
                    🔒
                  </div>
                  <h5 className={`${textXLarge} font-semibold mb-2`}>
                    Private
                  </h5>
                  <p className={`${textLarge} text-muted-foreground`}>
                    Your journal data stays secure and confidential
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AskAI;
