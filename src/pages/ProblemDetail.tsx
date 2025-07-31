import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProblemById } from "@/lib/data";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, AlertCircle } from "lucide-react";

export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(id ? getProblemById(id) : null);
  const [activeTab, setActiveTab] = useState<string>("description");

  // Navigate back to problems list if problem not found
  useEffect(() => {
    if (!problem && id) {
      navigate("/problems");
    }
  }, [problem, navigate, id]);

  if (!problem) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container py-6 mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/problems")}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Problems
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left panel: Problem description, examples, etc. */}
        <div className="flex flex-col h-[calc(100vh-160px)] overflow-hidden">
          <div className="mb-4 pb-4 border-b">
            <h1 className="text-2xl font-bold">{problem.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                className={`
                  ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300' : ''}
                  ${problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                  ${problem.difficulty === 'Hard' ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300' : ''}
                `}
              >
                {problem.difficulty}
              </Badge>
              {problem.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-grow flex flex-col overflow-hidden"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="solutions">Solutions</TabsTrigger>
            </TabsList>

            <TabsContent 
              value="description" 
              className="flex-grow overflow-auto px-1 py-4"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-lg font-medium">Problem</h2>
                  <p className="whitespace-pre-line">{problem.description}</p>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-lg font-medium">Constraints</h2>
                  <ul className="list-disc pl-6 space-y-1">
                    {problem.constraints.map((constraint, index) => (
                      <li key={index}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent 
              value="examples" 
              className="flex-grow overflow-auto px-1 py-4"
            >
              <div className="space-y-6">
                {problem.examples.map((example, index) => (
                  <div key={index} className="p-4 border rounded-md space-y-3">
                    <h3 className="font-medium">Example {index + 1}</h3>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Input:</p>
                        <pre className="bg-muted/40 p-3 rounded-md overflow-auto text-sm">{example.input}</pre>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Output:</p>
                        <pre className="bg-muted/40 p-3 rounded-md overflow-auto text-sm">{example.output}</pre>
                      </div>
                      {example.explanation && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Explanation:</p>
                          <p className="text-sm">{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent 
              value="solutions" 
              className="flex-grow overflow-auto px-1 py-4"
            >
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Try to solve the problem first before checking the solution!
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                {Object.entries(problem.solution).map(([language, code]) => (
                  <div key={language} className="space-y-2">
                    <h3 className="font-medium capitalize">{language} Solution</h3>
                    <pre className="bg-muted/40 p-3 rounded-md overflow-auto text-sm">
                      {code}
                    </pre>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right panel: Code editor */}
        <div className="h-[calc(100vh-160px)]">
          <CodeEditor
            problemId={problem.id}
            starterCode={problem.starterCode}
            testCases={problem.examples.map(ex => ({
              input: ex.input,
              expectedOutput: ex.output
            }))}
          />
        </div>
      </div>
    </div>
  );
}