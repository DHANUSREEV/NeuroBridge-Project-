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
      title: "Cognitive & Learning Differences",
      emoji: "🎓",
      description: "Unique ways of processing information, learning, and thinking that create different cognitive patterns and strengths.",
      examples: ["Autism Spectrum", "ADHD", "Dyslexia", "Dyscalculia"],
      variant: "cognitive" as const,
      icon: cognitiveIcon,
    },
    {
      id: "sensory",
      title: "Sensory & Processing Differences", 
      emoji: "🎧",
      description: "Distinctive ways of processing sensory information that can create both challenges and unique perceptual strengths.",
      examples: ["Sensory Processing", "OCD", "Autism (Sensory)"],
      variant: "sensory" as const,
      icon: sensoryIcon,
    },
    {
      id: "motor",
      title: "Motor & Coordination Differences",
      emoji: "🕹️", 
      description: "Variations in movement, coordination, and motor skills that showcase different approaches to physical tasks.",
      examples: ["Dyspraxia", "Tourette Syndrome", "Motor Skills"],
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