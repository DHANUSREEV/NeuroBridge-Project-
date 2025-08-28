import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NeuroTypeCardProps {
  title: string;
  emoji: string;
  description: string;
  examples: string[];
  variant: "cognitive" | "sensory" | "motor";
  icon: string;
  onSelect: () => void;
}

export function NeuroTypeCard({
  title,
  emoji,
  description,
  examples,
  variant,
  icon,
  onSelect,
}: NeuroTypeCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group"
    >
      <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 card-hover bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative p-6 text-center space-y-4">
          {/* Icon and emoji */}
          <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden shadow-card">
            <img 
              src={icon} 
              alt={`${title} category`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm">
              <span className="text-4xl" role="img" aria-label={title}>
                {emoji}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">
              {title}
            </h3>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>

            {/* Example badges */}
            <div className="flex flex-wrap gap-2 justify-center">
              {examples.slice(0, 3).map((example, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-background/50 hover:bg-background/80 transition-colors"
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action button */}
          <Button
            variant={variant}
            className="w-full mt-4 font-medium"
            onClick={onSelect}
          >
            Start Your Journey {emoji}
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Card>
    </motion.div>
  );
}