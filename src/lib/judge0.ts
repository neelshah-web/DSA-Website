const JUDGE0_API_KEY = 'ea16c1d898mshea31f37d680ae2ap130b39jsn1a2e0bad5164';
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

export async function runTestCases(
  code: string,
  language: string,
  testCases: { input: string; expectedOutput: string }[]
): Promise<string> {
  let output = '';
  let passedTests = 0;

  output += `🧪 Running ${testCases.length} test cases...\n\n`;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    
    try {
      output += `Test Case ${i + 1}:\n`;
      output += `Input: ${testCase.input}\n`;
      
      const result = await executeCode(code, language, testCase.input);
      
      if (result.status.id === 3) { // Accepted
        const actualOutput = result.stdout?.trim() || '';
        const expectedOutput = testCase.expectedOutput.trim();
        
        if (actualOutput === expectedOutput) {
          output += `✅ PASSED\n`;
          output += `Expected: ${expectedOutput}\n`;
          output += `Got: ${actualOutput}\n\n`;
          passedTests++;
        } else {
          output += `❌ FAILED\n`;
          output += `Expected: ${expectedOutput}\n`;
          output += `Got: ${actualOutput}\n\n`;
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
      }
    } catch (error) {
      output += `❌ EXECUTION ERROR\n`;
      output += `${error}\n\n`;
    }
  }

  output += `\n📊 Results: ${passedTests}/${testCases.length} test cases passed\n`;
  
  if (passedTests === testCases.length) {
    output += '🎉 All test cases passed! Great job!';
  } else {
    output += '💡 Some test cases failed. Check your logic and try again.';
  }

  return output;
}