// src/api/openrouter.ts - FINAL GPT-4 VERSION
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

async function callOpenRouter(
  messages: OpenRouterMessage[],
  model: string = 'openai/gpt-4-turbo',
  temperature: number = 0.7,
  maxTokens: number = 3000
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not found. Add VITE_OPENROUTER_API_KEY to .env file');
  }

  console.log('🚀 Calling GPT-4 via OpenRouter...');

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'NeuroBridge Quiz System',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    console.log('📡 API Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Error:', errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Check your key at https://openrouter.ai/keys');
      } else if (response.status === 402 || response.status === 403) {
        throw new Error('Insufficient credits. Add credits at https://openrouter.ai/credits');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Wait 60 seconds and try again');
      }
      
      throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ GPT-4 Response received');
    
    const content = data.choices[0]?.message?.content || '';
    if (!content) {
      throw new Error('Empty response from GPT-4');
    }
    
    return content;
  } catch (error) {
    console.error('💥 OpenRouter Error:', error);
    throw error;
  }
}

export async function generateQuiz(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  numberOfQuestions: number = 10
): Promise<QuizData | null> {
  console.log(`📝 Generating ${difficulty} quiz: "${topic}" (${numberOfQuestions} questions)`);
  
  const systemPrompt = `You are an expert quiz generator specializing in technical and soft skills assessments. Create high-quality, accurate, professional questions. Return ONLY valid JSON - no markdown, no code blocks, no extra text.`;

  const userPrompt = `Create a ${difficulty}-level quiz about "${topic}" with exactly ${numberOfQuestions} multiple-choice questions.

REQUIREMENTS:
- Each question: exactly 4 options
- correctAnswer: index 0-3 of correct option
- Clear, professional questions
- Practical, job-relevant content
- Include detailed explanations

RETURN ONLY THIS JSON STRUCTURE:
{
  "title": "${topic.charAt(0).toUpperCase() + topic.slice(1)} Quiz - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level",
  "questions": [
    {
      "question": "Your question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct and others are wrong."
    }
  ]
}

Generate all ${numberOfQuestions} questions. Return ONLY the JSON.`;

  try {
    const response = await callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      'openai/gpt-4-turbo',
      0.7,
      3000
    );

    console.log('🔍 Parsing GPT-4 response...');

    // Clean response
    let jsonText = response.trim();
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Extract JSON
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    // Parse
    const quizData: QuizData = JSON.parse(jsonText);
    console.log('✅ Quiz parsed successfully');

    // Validate
    if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      throw new Error('Invalid quiz structure: no questions found');
    }

    // Validate each question
    quizData.questions.forEach((q, idx) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
          typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        throw new Error(`Invalid question at index ${idx}`);
      }
    });

    console.log(`🎉 Generated ${quizData.questions.length} questions successfully`);
    return quizData;

  } catch (error) {
    console.error('❌ Quiz generation failed:', error);
    if (error instanceof SyntaxError) {
      console.error('JSON parsing error - GPT-4 did not return valid JSON');
    }
    return null;
  }
}

export function evaluateQuiz(
  questions: QuizQuestion[],
  userAnswers: number[]
): {
  score: number;
  totalQuestions: number;
  percentage: number;
  correctAnswers: boolean[];
} {
  if (!questions || !userAnswers || questions.length !== userAnswers.length) {
    throw new Error('Invalid evaluation data');
  }

  const correctAnswers = questions.map((q, i) => q.correctAnswer === userAnswers[i]);
  const score = correctAnswers.filter(Boolean).length;
  const percentage = Math.round((score / questions.length) * 100);

  return { score, totalQuestions: questions.length, percentage, correctAnswers };
}

export async function generateQuizFeedback(
  score: number,
  totalQuestions: number,
  topic: string
): Promise<string> {
  const percentage = Math.round((score / totalQuestions) * 100);
  console.log(`💬 Generating feedback: ${percentage}% on ${topic}`);
  
  const systemPrompt = `You are a supportive educational coach. Provide brief, encouraging, neurodiversity-affirming feedback.`;

  const userPrompt = `Student scored ${score}/${totalQuestions} (${percentage}%) on a ${topic} quiz.

Write 2-3 encouraging sentences:
- Acknowledge their achievement
- Highlight strengths
- If below 100%, offer one actionable tip
- Keep warm and professional

Write feedback now (plain text, no JSON):`;

  try {
    const feedback = await callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      'openai/gpt-4-turbo',
      0.8,
      300
    );

    console.log('✅ Feedback generated');
    return feedback.trim();

  } catch (error) {
    console.error('❌ Feedback generation failed:', error);
    
    // Fallback
    if (percentage >= 90) {
      return `Outstanding work on this ${topic} quiz! You scored ${score}/${totalQuestions}, demonstrating excellent mastery. Keep up the great work!`;
    } else if (percentage >= 80) {
      return `Great job! You scored ${score}/${totalQuestions} on the ${topic} quiz. Review the explanations to strengthen your knowledge further.`;
    } else if (percentage >= 70) {
      return `Good effort on the ${topic} quiz! You got ${score}/${totalQuestions} correct. Take time to review the explanations provided.`;
    } else if (percentage >= 60) {
      return `You completed the ${topic} quiz with ${score}/${totalQuestions}. Review each question carefully to improve your understanding.`;
    } else {
      return `You scored ${score}/${totalQuestions} on the ${topic} quiz. This is a learning opportunity - review all explanations carefully. Keep practicing!`;
    }
  }
}

export function isOpenRouterConfigured(): boolean {
  const configured = Boolean(OPENROUTER_API_KEY && OPENROUTER_API_KEY.length > 0);
  console.log('⚙️ OpenRouter:', configured ? '✅ Configured' : '❌ Not configured');
  return configured;
}

export type { QuizQuestion, QuizData };