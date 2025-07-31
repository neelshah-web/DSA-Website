import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { canRunCode } from "@/lib/auth";
import { validateSolution, executeCode, formatExecutionResult } from "@/lib/judge0";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Play, Settings, RotateCcw, Terminal, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CodeEditorProps {
  problemId: string;
  starterCode: Record<string, string>;
  testCases?: { input: string; expectedOutput: string }[];
}

const languageMap: Record<string, string> = {
  javascript: "javascript",
  python: "python",
  java: "java",
  cpp: "cpp",
  typescript: "typescript"
};

const themeMap = {
  dark: "vs-dark",
  light: "light"
};

export function CodeEditor({ problemId, starterCode, testCases }: CodeEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>(starterCode[selectedLanguage] || "");
  const [output, setOutput] = useState<string>("");
  const [terminalOutput, setTerminalOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [fontSize, setFontSize] = useState<number>(14);
  const [activeTab, setActiveTab] = useState<string>("terminal");
  const editorRef = useRef<any>(null);

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    setCode(starterCode[value] || "");
    setOutput("");
    setTerminalOutput("");
    setError(null);
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      fontSize: fontSize,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Monaco, 'Inconsolata', 'Roboto Mono', monospace",
      fontLigatures: true,
      lineNumbers: "on",
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      minimap: { enabled: true },
      wordWrap: "on",
      tabSize: 2,
      insertSpaces: true,
      detectIndentation: false,
      folding: true,
      foldingHighlight: true,
      showFoldingControls: "always",
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true
      },
      suggest: {
        showKeywords: true,
        showSnippets: true,
        showClasses: true,
        showFunctions: true,
        showVariables: true
      },
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true
      }
    });

    // Add syntax validation
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    // Add custom keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runCode();
    });
  };

  const runCode = () => {
    if (!canRunCode()) {
      setError("You must be logged in to run code");
      setActiveTab("terminal");
      return;
    }

    setIsRunning(true);
    setError(null);
    setActiveTab("terminal");
    setTerminalOutput("Running code...\n");

    // Use Judge0 API for real code execution
    executeCodeWithJudge0();
  };

  const executeCodeWithJudge0 = async () => {
    try {
      // Validate code is not empty
      const trimmedCode = code.trim();
      if (!trimmedCode) {
        throw new Error("Code cannot be empty. Please write your solution.");
      }

      setTerminalOutput("Compiling and executing code...\n");

      if (testCases && testCases.length > 0) {
        // Run test cases validation
        const result = await validateSolution(trimmedCode, selectedLanguage, testCases);
        setTerminalOutput(`$ Executing solution with ${testCases.length} test cases\n\n${result}`);

        // Check if all tests passed
        const allPassed = result.includes('All test cases passed!');
        if (allPassed) {
          setOutput("✅ Success! All test cases passed.\n\nYour solution is correct!");
          setActiveTab("output");
        } else {
          setOutput("❌ Some test cases failed.\n\nPlease review your solution and try again.");
          setActiveTab("output");
        }
      } else {
        // Just run the code without test cases
        const result = await executeCode(trimmedCode, selectedLanguage);
        const formattedResult = formatExecutionResult(result);
        setTerminalOutput(`$ Executing code\n\n${formattedResult}`);

        if (result.status.id === 3) {
          setOutput("✅ Code executed successfully!");
        } else {
          setOutput(`❌ Execution failed: ${result.status.description}`);
        }
        setActiveTab("output");
      }
    } catch (err) {
      const errorMsg = `❌ Execution Error\n\n${err}\n\nPlease fix the error and try again.`;
      setTerminalOutput(errorMsg);
      setOutput(errorMsg);
      setError(String(err));
      setActiveTab("output");
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(starterCode[selectedLanguage] || "");
    setOutput("");
    setTerminalOutput("");
    setError(null);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(10, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: newSize });
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(starterCode).map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => adjustFontSize(-1)}
              className="h-8 w-8 p-0"
            >
              -
            </Button>
            <span className="text-xs px-2">{fontSize}px</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => adjustFontSize(1)}
              className="h-8 w-8 p-0"
            >
              +
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-8"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetCode}
            className="h-8"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            onClick={runCode}
            disabled={isRunning}
            className="h-8 px-4 bg-green-600 hover:bg-green-700"
          >
            {isRunning ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                Running...
              </div>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1" />
                Run
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content - Fixed Height Layout */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Code Editor - Takes 60% of available space */}
        <div className="flex-[3] min-h-0">
          <Editor
            height="100%"
            language={languageMap[selectedLanguage]}
            value={code}
            onChange={(value) => setCode(value || "")}
            onMount={handleEditorDidMount}
            theme={themeMap[theme]}
            options={{
              selectOnLineNumbers: true,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              fontSize: fontSize,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
              fontLigatures: true,
              lineNumbers: "on",
              minimap: { enabled: true },
              wordWrap: "on",
              tabSize: 2,
              insertSpaces: true,
              folding: true,
              bracketPairColorization: { enabled: true },
              suggest: {
                showKeywords: true,
                showSnippets: true
              }
            }}
          />
        </div>

        {/* Bottom Panel - Takes 40% of available space */}
        <div className="flex-[2] border-t bg-muted/20 min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-fit m-2 mb-0">
              <TabsTrigger value="terminal" className="text-xs flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                Terminal
              </TabsTrigger>
              <TabsTrigger value="output" className="text-xs flex items-center gap-1">
                {error ? <XCircle className="w-3 h-3 text-red-500" /> :
                  output ? <CheckCircle className="w-3 h-3 text-green-500" /> :
                    <AlertCircle className="w-3 h-3" />}
                Results
              </TabsTrigger>
              <TabsTrigger value="testcases" className="text-xs">Test Cases</TabsTrigger>
            </TabsList>

            <TabsContent value="terminal" className="flex-1 m-2 mt-2 min-h-0">
              <div className="bg-black text-green-400 border rounded-md h-full overflow-auto font-mono">
                <pre className="p-4 text-sm whitespace-pre-wrap leading-relaxed">
                  {terminalOutput || (
                    <span className="text-gray-500">
                      Terminal ready. Click "Run" to execute your code.
                      {'\n\n'}$ _
                    </span>
                  )}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="output" className="flex-1 m-2 mt-2 min-h-0">
              {error && (
                <Alert variant="destructive" className="mb-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="bg-background border rounded-md h-full overflow-auto">
                <pre className="p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                  {output || (
                    <span className="text-muted-foreground">
                      Test results will appear here after running your code.
                      {'\n\n'}Keyboard shortcut: Ctrl+Enter (Cmd+Enter on Mac)
                    </span>
                  )}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="testcases" className="flex-1 m-2 mt-2 overflow-auto min-h-0">
              <div className="space-y-3 h-full overflow-auto">
                {testCases && testCases.length > 0 ? (
                  testCases.map((testCase, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-background">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-sm">Test Case {index + 1}</h3>
                        <span className="text-xs text-muted-foreground">Public</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Input:</p>
                          <div className="bg-muted/50 rounded p-2">
                            <code className="text-xs font-mono">{testCase.input}</code>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Expected Output:</p>
                          <div className="bg-muted/50 rounded p-2">
                            <code className="text-xs font-mono">{testCase.expectedOutput}</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No test cases available for this problem.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
