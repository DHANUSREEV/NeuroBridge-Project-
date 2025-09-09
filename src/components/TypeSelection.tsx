import { NeuroTypeCard } from "./NeuroTypeCard";
import cognitiveIcon from "@/assets/cognitive-icon.jpg";
import sensoryIcon from "@/assets/sensory-icon.jpg";
import motorIcon from "@/assets/motor-icon.jpg";

interface TypeSelectionProps {
  onTypeSelect: (type: string) => void;
}

export function TypeSelection({ onTypeSelect }: TypeSelectionProps) {
  const neuroTypes = [
    {
      id: "cognitive",
      title: "🧑‍🎓 Cognitive & Learning Differences (Learning Quests)",
      emoji: "🎓",
      description: "Choose your path of learning quests! Unlock knowledge step by step, with hints, checkpoints, and rewards as you master each stage.",
      examples: ["Learning Levels", "Progress Badges", "Power-up Hints", "Knowledge Unlocks"],
      variant: "cognitive" as const,
      icon: cognitiveIcon,
    },
    {
      id: "sensory",
      title: "🎧 Sensory & Processing Differences (Sensory Adventure Mode)", 
      emoji: "🎧",
      description: "Enter Sensory Adventure Mode! Adjust your environment — lower sound, soften visuals, or activate 'calm mode' to collect focus points as you progress.",
      examples: ["Calm Mode Toggle", "Focus Points", "Sensory Shields", "Environment Control"],
      variant: "sensory" as const,
      icon: sensoryIcon,
    },
    {
      id: "motor",
      title: "🎮 Motor & Coordination Differences (Control Mastery Challenge)",
      emoji: "🕹️", 
      description: "Join the Control Mastery Challenge! Use keyboard shortcuts, voice commands, or assistive tools as your superpowers to move ahead and earn achievement stars.",
      examples: ["Keyboard Shortcuts", "Voice Commands", "Achievement Stars", "Adaptive Controls"],
      variant: "motor" as const,
      icon: motorIcon,
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="text-center space-y-6 mb-12">
        <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Choose Your Path
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Every neurodivergent journey is unique. Select the category that best represents your experience to unlock personalized quizzes and discover your strengths.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {neuroTypes.map((type) => (
          <NeuroTypeCard
            key={type.id}
            title={type.title}
            emoji={type.emoji}
            description={type.description}
            examples={type.examples}
            variant={type.variant}
            icon={type.icon}
            onSelect={() => onTypeSelect(type.id)}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Don't see your exact experience? That's okay! Choose the category that feels most similar - you can always explore others later.
        </p>
      </div>
    </section>
  );
}