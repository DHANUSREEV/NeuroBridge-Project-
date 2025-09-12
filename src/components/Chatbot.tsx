import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial welcome message
      const welcomeMessage = getWelcomeMessage();
      setMessages([{
        id: Date.now().toString(),
        type: 'bot',
        content: welcomeMessage,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, profile]);

  const getWelcomeMessage = () => {
    if (profile?.role === 'candidate') {
      return "Hello! Welcome to NEUROBRIDGE! 🌟 I'm here to help you understand our inclusive skills discovery platform. After logging in, you'll see your personalized dashboard where you can track your progress and access skill-based quizzes designed just for you. The platform helps you build confidence with engaging challenges, badges, and positive feedback. You can also create a professional resume and use tools that support your mental well-being. Would you like to know more about any specific feature?";
    } else if (profile?.role === 'manager') {
      return "Hello, Manager! Welcome to NEUROBRIDGE! 👋 Once you're logged in, you'll have access to all candidate profiles, quiz attendance, and performance summaries. You can generate detailed reports and send them directly to the data team or head office for further review. The portal also offers analytics and filtering tools to help you identify the right candidates and support them more effectively. How can I assist you today?";
    } else {
      return "Welcome to NEUROBRIDGE! 🎉 I'm your AI assistant here to help you understand our inclusive neurodivergent skills discovery platform. Whether you're a candidate looking to discover your strengths or a manager seeking talented individuals, I'm here to guide you through our features. What would you like to know?";
    }
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    const userRole = profile?.role;

    // Common keywords and responses
    if (input.includes('quiz') || input.includes('test') || input.includes('assessment')) {
      if (userRole === 'candidate') {
        return "Great question! Our quizzes are tailored to help you discover your unique strengths. You'll need to log in first to access them. Once logged in, you can choose from different neurotype categories (Cognitive, Sensory, Motor) and select specific domains to test. Each quiz is gamified with encouraging feedback and badges to make the experience enjoyable! Would you like to start your quiz now?";
      } else {
        return "Our assessment system includes skill-based quizzes across different neurotype categories. As a manager, you can view all candidate quiz results, attendance records, and performance analytics through your dashboard. This helps you understand each candidate's strengths and potential.";
      }
    }

    if (input.includes('login') || input.includes('sign in') || input.includes('register')) {
      return "To access all features, you'll need to create an account or sign in. We support email/password authentication with different roles (Candidate or Manager). Once logged in, you'll be redirected to your personalized dashboard with role-specific features. Click the 'Sign In / Register' button to get started!";
    }

    if (input.includes('dashboard') || input.includes('profile')) {
      if (userRole === 'candidate') {
        return "Your candidate dashboard is your personal hub! Here you can update your professional profile, track quiz progress, view achievements with badges, and access tools for resume building and mental health support. It's designed with neurodivergent-friendly features like accessible fonts and calming colors.";
      } else if (userRole === 'manager') {
        return "Your manager dashboard provides comprehensive oversight of all candidates. You can view profiles, quiz results, add performance remarks, generate reports, and use analytics tools. There's also a dedicated Reports section where you can export data and send candidate information to external platforms like LinkedIn, Naukri, and Unstop.";
      } else {
        return "Our dashboards are role-specific! Candidates get a personal space to manage their profile and track progress, while managers get analytical tools to review candidates and generate reports. Both are designed with accessibility and user experience in mind.";
      }
    }

    if (input.includes('report') || input.includes('analytics') || input.includes('export')) {
      if (userRole === 'manager') {
        return "Perfect! The Reports section is one of our key features for managers. You can generate detailed candidate reports, export data as CSV files, filter candidates by status, and send reports directly to your data team or external platforms like LinkedIn, Naukri, and Unstop. You'll also see analytics showing total candidates, recommendations, and average ratings.";
      } else {
        return "Reports and analytics are available for managers to track candidate progress and generate insights. As a candidate, you can view your own performance and progress through your personal dashboard.";
      }
    }

    if (input.includes('accessibility') || input.includes('neurodivergent') || input.includes('inclusive')) {
      return "Accessibility is at the heart of NEUROBRIDGE! 💙 Our platform features dyslexia-friendly fonts, calming color palettes, high contrast options, keyboard navigation support, screen reader compatibility, and customizable themes. We've designed everything to be inclusive and supportive of neurodivergent users. You can adjust these settings in your dashboard's accessibility preferences.";
    }

    if (input.includes('resume') || input.includes('cv')) {
      return "Our resume builder helps you create professional resumes that highlight your unique strengths! After completing quizzes, you can generate a resume that showcases your skills, experience, and quiz results in a way that emphasizes your neurodivergent advantages. It's designed to help you present your best self to potential employers.";
    }

    if (input.includes('mental health') || input.includes('support') || input.includes('wellness')) {
      return "We care about your mental well-being! 🌱 Our platform includes mental health support tools, positive reinforcement through gamification, stress-reducing design elements, and encouraging feedback. We believe in building confidence and supporting your journey of self-discovery in a safe, supportive environment.";
    }

    if (input.includes('badge') || input.includes('achievement') || input.includes('gamification')) {
      return "Our gamification system makes learning fun! 🏆 You earn badges for completing quizzes, achieving high scores, and reaching milestones. These achievements help build confidence and motivation while celebrating your progress. Each badge represents a skill or accomplishment you can be proud of!";
    }

    if (input.includes('help') || input.includes('support') || input.includes('how')) {
      return "I'm here to help! 😊 I can explain features for candidates (quizzes, dashboard, resume builder, accessibility settings) or managers (candidate oversight, reports, analytics). Just ask me about any specific feature you'd like to know more about. You can also try asking about 'getting started' if you're new to the platform!";
    }

    if (input.includes('start') || input.includes('begin') || input.includes('getting started')) {
      if (userRole === 'candidate') {
        return "Let's get you started! 🚀 First, make sure you're logged in to access all features. Then visit your dashboard to complete your profile. Once that's done, you can start taking quizzes to discover your strengths. Would you like to start with your profile or jump into a quiz?";
      } else if (userRole === 'manager') {
        return "Welcome aboard! 👥 Start by exploring your manager dashboard where you can see all registered candidates. Review their profiles, check quiz results, and add remarks as needed. Don't forget to explore the Reports section for analytics and export options. Need help with any specific feature?";
      } else {
        return "Great! To get started with NEUROBRIDGE: 1) Sign up or log in with your role (Candidate/Manager), 2) Complete your profile, 3) If you're a candidate, start with quizzes; if you're a manager, explore candidate profiles and reports. Which role describes you best?";
      }
    }

    // Default responses
    const defaultResponses = [
      "That's an interesting question! I can help you with information about quizzes, dashboards, reports, accessibility features, or getting started. What would you like to know more about?",
      "I'm here to help you navigate NEUROBRIDGE! You can ask me about candidate features (quizzes, profiles, resume building) or manager tools (reports, analytics, candidate oversight). What interests you most?",
      "Great question! I can explain our inclusive features, quiz system, dashboard capabilities, or accessibility options. Feel free to ask about any aspect of the platform you'd like to explore!"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>

      {/* Chatbot Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="h-full flex flex-col shadow-xl border-2">
              {/* Header */}
              <div className="p-4 border-b bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">NEUROBRIDGE Assistant</h3>
                    <p className="text-xs text-muted-foreground">Here to help you navigate</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto text-xs">Online</Badge>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.type === 'bot' && (
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="h-3 w-3 text-primary" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.content}
                      </div>

                      {message.type === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="h-3 w-3 text-accent-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2 justify-start"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-3 w-3 text-primary" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse delay-75"></div>
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse delay-150"></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me about NEUROBRIDGE features..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Ask about quizzes, dashboards, reports, or accessibility features
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;