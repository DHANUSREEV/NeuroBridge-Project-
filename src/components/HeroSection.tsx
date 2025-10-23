import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart, Star } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={heroBanner} 
          alt="Diverse neurodivergent individuals celebrating their unique strengths"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/80" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 text-primary/30"
        >
          <Sparkles size={24} />
        </motion.div>
        
        <motion.div
          animate={{
            y: [10, -10, 10],
            x: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-1/3 text-accent/40"
        >
          <Heart size={20} />
        </motion.div>

        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/3 left-1/5 text-success/30"
        >
          <Star size={16} />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success border-success/20">
              <Sparkles size={16} />
              Inclusive • Accessible • Empowering
            </Badge>
          </motion.div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Your uniqueness
            </span>
            <br />
            <span style={{ fontSize: '4rem', fontWeight: 'bold', color: 'black' }}>
              is your
            </span>
            <br />
            <span className="bg-gradient-success bg-clip-text text-transparent">
              strength
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover your abilities through fun, gamified quizzes designed for neurodivergent minds. 
            Then watch as we transform your results into a professional resume that showcases your true potential.
          </p>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6"
        >
          <Button 
            variant="hero" 
            size="lg"
            onClick={onGetStarted}
            className="text-lg px-8 py-4 h-auto shadow-elevated"
          >
            Start Your Journey ✨
          </Button>

          <p className="text-sm text-muted-foreground">
            Free • No downloads • Accessible design • Your data stays private
          </p>
        </motion.div>

        {/* Stats or features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Inclusive Design</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-success">Gamified</div>
            <div className="text-sm text-muted-foreground">Fun Learning</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-accent">Professional</div>
            <div className="text-sm text-muted-foreground">Resume Output</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
