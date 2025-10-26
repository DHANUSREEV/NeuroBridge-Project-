// src/api/test-api.ts - GPT-4 TEST UTILITY
import { generateQuiz, isOpenRouterConfigured } from './openrouter';

export async function testOpenRouterConnection() {
  console.clear();
  console.log('🧪 ===== GPT-4 CONNECTION TEST =====\n');
  
  // Check API Key
  console.log('Step 1: Checking API Key...');
  if (!isOpenRouterConfigured()) {
    console.error('❌ FAILED: No API key found\n');
    console.log('📋 Setup Instructions:');
    console.log('1. Get key: https://openrouter.ai/keys');
    console.log('2. Add credits: https://openrouter.ai/credits (min $5)');
    console.log('3. Edit .env file: VITE_OPENROUTER_API_KEY=sk-or-v1-...');
    console.log('4. Restart: npm run dev\n');
    return false;
  }
  console.log('✅ API Key found\n');

  // Test Generation
  console.log('Step 2: Testing GPT-4 Quiz Generation...');
  console.log('⏳ This takes 15-30 seconds...\n');
  
  try {
    const start = Date.now();
    const quiz = await generateQuiz('JavaScript Basics', 'easy', 3);
    const duration = ((Date.now() - start) / 1000).toFixed(1);
    
    if (quiz?.questions?.length > 0) {
      console.log(`✅ SUCCESS! Generated in ${duration}s\n`);
      console.log('📊 Quiz Details:');
      console.log(`   Title: ${quiz.title}`);
      console.log(`   Questions: ${quiz.questions.length}\n`);
      console.log('📝 Sample Question:');
      console.log(`   Q: ${quiz.questions[0].question}`);
      console.log(`   Options: ${quiz.questions[0].options.join(', ')}`);
      console.log(`   Answer: ${quiz.questions[0].options[quiz.questions[0].correctAnswer]}`);
      console.log(`   Explanation: ${quiz.questions[0].explanation}\n`);
      console.log('🎉 TEST PASSED! GPT-4 is working!\n');
      console.log('💡 Next: Navigate to /quiz in your app');
      return true;
    } else {
      console.error('❌ FAILED: Empty quiz returned');
      return false;
    }
  } catch (error: any) {
    console.error('❌ FAILED\n');
    console.error('Error:', error.message, '\n');
    
    if (error.message?.includes('credits')) {
      console.log('💳 Solution: Add credits at https://openrouter.ai/credits');
      console.log('   Minimum: $5 (gets ~100-150 quizzes)');
    } else if (error.message?.includes('Invalid API key')) {
      console.log('🔑 Solution: Check API key at https://openrouter.ai/keys');
    } else if (error.message?.includes('rate limit')) {
      console.log('⏳ Solution: Wait 60 seconds and try again');
    }
    
    return false;
  }
}

(window as any).testOpenRouterConnection = testOpenRouterConnection;

console.log('✅ Test function ready!');
console.log('📝 Run: testOpenRouterConnection()');