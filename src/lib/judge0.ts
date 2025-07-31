const JUDGE0_API_KEY = 'd0c6d4d91emshc76d6590d156a23p12ba57jsnb0e94deb0ccb';
const JUDGE0_BASE_URL = 'https://judge0-ce.p.rapidapi.com';

// Language IDs for Judge0
export const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  java: 62,       // Java
  cpp: 54,        // C++
  c: 50,          // C
  csharp: 51,     // C#
  go: 60,         // Go
  rust: 73,       // Rust
  php: 68,        // PHP
  ruby: 72,       // Ruby
  swift: 83,      // Swift
  kotlin: 78,     // Kotlin
  typescript: 74, // TypeScript
};

export interface SubmissionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string | null;
  memory: number | null;
}

export async function executeCode(
  code: string,
  language: string,
  input?: string
): Promise<SubmissionResult> {
  const languageId = LANGUAGE_IDS[language as keyof typeof LANGUAGE_IDS];
  
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  try {
    // Create submission
    const submissionResponse = await fetch(`${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=false`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: input || '',
      }),
    });

    if (!submissionResponse.ok) {
      const errorText = await submissionResponse.text();
      throw new Error(`Failed to submit code: ${submissionResponse.status} ${submissionResponse.statusText} - ${errorText}`);
    }

    const submission = await submissionResponse.json();
    const token = submission.token;

    if (!token) {
      throw new Error('No token received from submission');
    }

    // Poll for result
    let result: SubmissionResult;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout

    do {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const resultResponse = await fetch(`${JUDGE0_BASE_URL}/submissions/${token}?base64_encoded=false`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      });

      if (!resultResponse.ok) {
        const errorText = await resultResponse.text();
        throw new Error(`Failed to get result: ${resultResponse.status} ${resultResponse.statusText} - ${errorText}`);
      }

      result = await resultResponse.json();
      attempts++;
      
      console.log(`Attempt ${attempts}: Status ${result.status.id} - ${result.status.description}`);
      
    } while (result.status.id <= 2 && attempts < maxAttempts); // Status 1 = In Queue, 2 = Processing

    if (attempts >= maxAttempts) {
      throw new Error('Code execution timeout - please try again');
    }

    return result;
  } catch (error) {
    console.error('Judge0 API Error:', error);
    throw error;
  }
}

export function formatExecutionResult(result: SubmissionResult): string {
  let output = '';

  if (result.status.id === 3) { // Accepted
    output += '✅ Success!\n\n';
    if (result.stdout) {
      output += `Output:\n${result.stdout}\n\n`;
    } else {
      output += 'No output produced.\n\n';
    }
  } else {
    output += `❌ ${result.status.description}\n\n`;
    
    if (result.stderr) {
      output += `Runtime Error:\n${result.stderr}\n\n`;
    }
    
    if (result.compile_output) {
      output += `Compilation Output:\n${result.compile_output}\n\n`;
    }
  }

  if (result.time) {
    output += `⏱️ Execution Time: ${result.time}s\n`;
  }
  
  if (result.memory) {
    output += `💾 Memory Used: ${result.memory} KB\n`;
  }

  return output;
}

export async function validateSolution(
  code: string,
  language: string,
  testCases: { input: string; expectedOutput: string }[],
  functionName?: string
): Promise<string> {
  let output = '';
  let passedTests = 0;
  const results = [];

  output += `🧪 Running ${testCases.length} test cases...\n\n`;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    
    try {
      output += `Test Case ${i + 1}:\n`;
      output += `Input: ${testCase.input}\n`;
      
      // Create executable code with test case
      const executableCode = createExecutableCode(code, language, testCase.input, functionName);
      const result = await executeCode(executableCode, language);
      
      if (result.status.id === 3) { // Accepted
        const actualOutput = result.stdout?.trim() || '';
        const expectedOutput = testCase.expectedOutput.trim();
        
        if (actualOutput === expectedOutput) {
          output += `✅ PASSED\n`;
          output += `Expected: ${expectedOutput}\n`;
          output += `Got: ${actualOutput}\n\n`;
          passedTests++;
          results.push({ passed: true, runtime: result.time, memory: result.memory });
        } else {
          output += `❌ FAILED\n`;
          output += `Expected: ${expectedOutput}\n`;
          output += `Got: ${actualOutput}\n\n`;
          results.push({ passed: false, expected: expectedOutput, actual: actualOutput });
        }
      } else {
        output += `❌ ERROR - ${result.status.description}\n`;
        if (result.stderr) {
          output += `Error: ${result.stderr}\n`;
        }
        if (result.compile_output) {
          output += `Compilation: ${result.compile_output}\n`;
        }
        output += '\n';
        results.push({ passed: false, error: result.status.description });
      }
    } catch (error) {
      output += `❌ EXECUTION ERROR\n`;
      output += `${error}\n\n`;
      results.push({ passed: false, error: String(error) });
    }
  }

  output += `\n📊 Results: ${passedTests}/${testCases.length} test cases passed\n`;
  
  if (passedTests === testCases.length) {
    output += '🎉 All test cases passed! Solution accepted!';
  } else {
    output += '💡 Some test cases failed. Check your logic and try again.';
  }

  return output;
}

// Helper function to create executable code with test input
function createExecutableCode(userCode: string, language: string, testInput: string, functionName?: string): string {
  if (language === 'javascript') {
    // Extract function name from code if not provided
    if (!functionName) {
      const functionMatch = userCode.match(/function\s+(\w+)/);
      if (functionMatch) {
        functionName = functionMatch[1];
      } else {
        // Check for arrow function or variable assignment
        const varMatch = userCode.match(/(?:var|let|const)\s+(\w+)\s*=/);
        if (varMatch) {
          functionName = varMatch[1];
        }
      }
    }

    if (!functionName) {
      throw new Error('Could not determine function name from code');
    }

    // Parse test input to extract parameters
    const params = parseTestInput(testInput);
    
    return `${userCode}

// Test execution
try {
  const result = ${functionName}(${params});
  console.log(JSON.stringify(result));
} catch (error) {
  console.error('Runtime Error:', error.message);
}`;
  } else if (language === 'python') {
    // For Python, we need to create a class instance and call the method
    const params = parseTestInputPython(testInput);
    
    return `${userCode}

# Test execution
try:
    solution = Solution()
    result = solution.twoSum(${params})
    print(result)
except Exception as error:
    print(f"Runtime Error: {error}")`;
  } else if (language === 'java') {
    // For Java, we need to create a main method
    const params = parseTestInputJava(testInput);
    
    return userCode.replace(/class Solution \{/, `class Solution {
    public static void main(String[] args) {
        try {
            Solution solution = new Solution();
            int[] result = solution.twoSum(${params});
            System.out.println(java.util.Arrays.toString(result));
        } catch (Exception error) {
            System.out.println("Runtime Error: " + error.getMessage());
        }
    }`);
  }
  
  return userCode;
}

// Helper functions to parse test input for different languages
function parseTestInput(input: string): string {
  // Parse input like "nums = [2,7,11,15], target = 9"
  const match = input.match(/nums\s*=\s*\[(.*?)\].*?target\s*=\s*(\d+)/);
  if (match) {
    const nums = `[${match[1]}]`;
    const target = match[2];
    return `${nums}, ${target}`;
  }
  return input;
}

function parseTestInputPython(input: string): string {
  // Parse input like "nums = [2,7,11,15], target = 9"
  const match = input.match(/nums\s*=\s*\[(.*?)\].*?target\s*=\s*(\d+)/);
  if (match) {
    const nums = `[${match[1]}]`;
    const target = match[2];
    return `${nums}, ${target}`;
  }
  return input;
}

function parseTestInputJava(input: string): string {
  // Parse input like "nums = [2,7,11,15], target = 9"
  const match = input.match(/nums\s*=\s*\[(.*?)\].*?target\s*=\s*(\d+)/);
  if (match) {
    const nums = `new int[]{${match[1]}}`;
    const target = match[2];
    return `${nums}, ${target}`;
  }
  return input;
}