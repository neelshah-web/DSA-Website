import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRoadmapById, getProblemById } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, BookOpen, Video, FileText, Code, ExternalLink, Clock, Check } from "lucide-react";

export default function RoadmapDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(id ? getRoadmapById(id) : null);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    // Set first topic as active by default
    if (roadmap && roadmap.topics.length > 0) {
      setActiveItem(roadmap.topics[0].id);
    }
  }, [roadmap]);

  // Navigate back to roadmaps list if roadmap not found
  useEffect(() => {
    if (!roadmap && id) {
      navigate("/roadmaps");
    }
  }, [roadmap, navigate, id]);

  if (!roadmap) {
    return null; // Will redirect in useEffect
  }

  // Get resource icon based on type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Article':
        return <FileText className="h-4 w-4" />;
      case 'Video':
        return <Video className="h-4 w-4" />;
      case 'Book':
        return <BookOpen className="h-4 w-4" />;
      case 'Practice':
        return <Code className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="container py-6 mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/roadmaps")}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Roadmaps
        </Button>
      </div>

      {/* Roadmap Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{roadmap.title}</h1>
        <div className="flex items-center gap-3 mb-4">
          <Badge 
            className={`
              ${roadmap.level === 'Beginner' ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300' : ''}
              ${roadmap.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300' : ''}
              ${roadmap.level === 'Advanced' ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300' : ''}
            `}
          >
            {roadmap.level}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            {roadmap.estimatedTime}
          </div>
        </div>
        <p className="text-muted-foreground max-w-3xl">
          {roadmap.description}
        </p>
      </div>

      {/* Progress Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Completion</span>
                <span>0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-muted/40 rounded-md text-center">
                <div className="text-2xl font-bold">0/{roadmap.topics.length}</div>
                <div className="text-sm text-muted-foreground">Topics Completed</div>
              </div>
              <div className="p-4 bg-muted/40 rounded-md text-center">
                <div className="text-2xl font-bold">0%</div>
                <div className="text-sm text-muted-foreground">Resources Studied</div>
              </div>
              <div className="p-4 bg-muted/40 rounded-md text-center">
                <div className="text-2xl font-bold">0/0</div>
                <div className="text-sm text-muted-foreground">Problems Solved</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Topics List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Topics</h2>
          <div className="space-y-2">
            {roadmap.topics.map((topic, index) => (
              <Button
                key={topic.id}
                variant={activeItem === topic.id ? "default" : "outline"}
                className="w-full justify-start text-left"
                onClick={() => setActiveItem(topic.id)}
              >
                <div className="flex items-center">
                  <div className="bg-muted w-6 h-6 rounded-full flex items-center justify-center mr-3">
                    {index + 1}
                  </div>
                  <span className="truncate">{topic.title}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Topic Content */}
        <div className="lg:col-span-2">
          {roadmap.topics.map((topic) => (
            <div 
              key={topic.id} 
              className={activeItem === topic.id ? "block" : "hidden"}
            >
              <h2 className="text-2xl font-semibold mb-2">{topic.title}</h2>
              <p className="text-muted-foreground mb-6">{topic.description}</p>
              
              {/* Resources */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Learning Resources</h3>
                <div className="space-y-3">
                  {topic.resources.map((resource) => (
                    <a 
                      key={resource.id}
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start p-4 border rounded-md hover:bg-muted/40 transition-colors"
                    >
                      <div className="mr-4 mt-1 p-2 bg-primary/10 rounded-md">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium">{resource.title}</h4>
                          <Badge variant="outline">{resource.type}</Badge>
                        </div>
                        {resource.estimatedTime && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {resource.estimatedTime}
                          </div>
                        )}
                      </div>
                      <ExternalLink className="h-4 w-4 ml-2 flex-shrink-0 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Practice Problems */}
              {topic.problems && topic.problems.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Practice Problems</h3>
                  <div className="space-y-3">
                    {topic.problems.map((problemId) => {
                      const problem = getProblemById(problemId);
                      if (!problem) return null;
                      
                      return (
                        <Link
                          key={problemId}
                          to={`/problems/${problemId}`}
                          className="flex items-start p-4 border rounded-md hover:bg-muted/40 transition-colors"
                        >
                          <div className="mr-4 mt-1 p-2 bg-primary/10 rounded-md">
                            <Code className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center mb-1">
                              <h4 className="font-medium mr-2">{problem.title}</h4>
                              <Badge 
                                className={`
                                  ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                                  ${problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                                  ${problem.difficulty === 'Hard' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                                `}
                              >
                                {problem.difficulty}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {problem.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}