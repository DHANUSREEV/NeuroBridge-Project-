import { Eye, Palette, Volume2, Navigation, Sun, Moon, Settings, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAccessibility } from '@/hooks/useAccessibility';

const AccessibilitySettings = () => {
  const { settings, updateSetting, playFeedbackSound } = useAccessibility();

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    updateSetting(key, value);
    playFeedbackSound();
  };

  const handleSliderChange = (value: number[]) => {
    updateSetting('fontSize', value[0]);
    playFeedbackSound();
  };

  const handleSelectChange = (value: string) => {
    updateSetting('colorTheme', value as any);
    playFeedbackSound();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Eye className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              NeuroBridge Accessibility
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Personalize your experience with advanced accessibility features designed for everyone
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              <Settings className="w-3 h-3 mr-1" />
              {Object.values(settings).filter(v => v === true).length} active features
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Visual Preferences */}
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                Visual Preferences
              </CardTitle>
              <CardDescription>
                Customize colors, contrast, and visual effects for better readability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* High Contrast Mode */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <label className="text-base font-medium text-foreground">High Contrast Mode</label>
                  <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                </div>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => handleToggle('highContrast', checked)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {/* Reduce Motion */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <label className="text-base font-medium text-foreground">Reduce Motion</label>
                  <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                </div>
                <Switch
                  checked={settings.reduceMotion}
                  onCheckedChange={(checked) => handleToggle('reduceMotion', checked)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {/* Font Size */}
              <div className="space-y-4 p-4 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium text-foreground">Font Size</label>
                  <Badge variant="outline">{settings.fontSize}px</Badge>
                </div>
                <div className="space-y-3">
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={handleSliderChange}
                    max={24}
                    min={12}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Small (12px)</span>
                    <span>Default (16px)</span>
                    <span>Large (24px)</span>
                  </div>
                </div>
              </div>

              {/* Color Theme */}
              <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                <label className="text-base font-medium text-foreground">Color Theme</label>
                <Select value={settings.colorTheme} onValueChange={handleSelectChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Default Colors
                      </div>
                    </SelectItem>
                    <SelectItem value="monochrome">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Monochrome
                      </div>
                    </SelectItem>
                    <SelectItem value="high-contrast">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        High Contrast
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Audio & Navigation Preferences */}
          <div className="space-y-6">
            {/* Audio Preferences */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Volume2 className="w-5 h-5 text-primary" />
                  </div>
                  Audio Preferences
                </CardTitle>
                <CardDescription>
                  Configure audio feedback and sound settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <label className="text-base font-medium text-foreground">Sound Feedback</label>
                    <p className="text-sm text-muted-foreground">Play sounds when interacting with elements</p>
                  </div>
                  <Switch
                    checked={settings.soundFeedback}
                    onCheckedChange={(checked) => handleToggle('soundFeedback', checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Navigation Preferences */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Navigation className="w-5 h-5 text-primary" />
                  </div>
                  Navigation Preferences
                </CardTitle>
                <CardDescription>
                  Enhance keyboard and assistive technology support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <label className="text-base font-medium text-foreground">Enhanced Keyboard Navigation</label>
                    <p className="text-sm text-muted-foreground">Improved focus indicators and keyboard shortcuts</p>
                  </div>
                  <Switch
                    checked={settings.keyboardNavigation}
                    onCheckedChange={(checked) => handleToggle('keyboardNavigation', checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Accessibility Tips */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Info className="w-5 h-5 text-primary" />
              </div>
              Accessibility Tips & Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Keyboard Navigation</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="px-2 py-1 text-xs">Tab</Badge>
                    Navigate between interactive elements
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="px-2 py-1 text-xs">Space</Badge>
                    Activate buttons and checkboxes
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="px-2 py-1 text-xs">↑↓</Badge>
                    Navigate dropdown menus
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Assistive Technology</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Screen readers are fully supported</li>
                  <li>• All images have descriptive text</li>
                  <li>• High contrast mode improves visibility</li>
                  <li>• Motion can be reduced for comfort</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <strong>Need help?</strong> These settings are automatically saved and will persist across sessions. 
                Contact our support team if you need additional accessibility accommodations.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 py-6">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Reset to Defaults
          </Button>
          <Button 
            onClick={playFeedbackSound}
            className="flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Test Sound Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;