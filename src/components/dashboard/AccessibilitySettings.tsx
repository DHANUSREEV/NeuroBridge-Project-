import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Eye, Volume2, Mouse, Palette } from 'lucide-react';

interface AccessibilityPreferences {
  highContrast?: boolean;
  reducedMotion?: boolean;
  fontSize?: number;
  colorTheme?: string;
  soundEnabled?: boolean;
  keyboardNavigation?: boolean;
}

interface AccessibilitySettingsProps {
  preferences: AccessibilityPreferences;
  onUpdate: (preferences: AccessibilityPreferences) => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  preferences,
  onUpdate,
}) => {
  const updatePreference = (key: keyof AccessibilityPreferences, value: any) => {
    onUpdate({ ...preferences, [key]: value });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Accessibility Settings
        </CardTitle>
        <CardDescription>
          Customize your interface for optimal comfort and accessibility
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Settings */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Visual Preferences
          </h4>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast">High Contrast Mode</Label>
            <Switch
              id="high-contrast"
              checked={preferences.highContrast || false}
              onCheckedChange={(checked) => updatePreference('highContrast', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="reduced-motion">Reduce Motion</Label>
            <Switch
              id="reduced-motion"
              checked={preferences.reducedMotion || false}
              onCheckedChange={(checked) => updatePreference('reducedMotion', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Font Size</Label>
            <Slider
              value={[preferences.fontSize || 16]}
              onValueChange={(value) => updatePreference('fontSize', value[0])}
              max={24}
              min={12}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Small (12px)</span>
              <span>Large (24px)</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color-theme">Color Theme</Label>
            <Select
              value={preferences.colorTheme || 'default'}
              onValueChange={(value) => updatePreference('colorTheme', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select color theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="warm">Warm (Yellow/Orange)</SelectItem>
                <SelectItem value="cool">Cool (Blue/Green)</SelectItem>
                <SelectItem value="monochrome">Monochrome</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Audio Preferences
          </h4>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-enabled">Enable Sound Feedback</Label>
            <Switch
              id="sound-enabled"
              checked={preferences.soundEnabled || false}
              onCheckedChange={(checked) => updatePreference('soundEnabled', checked)}
            />
          </div>
        </div>

        {/* Navigation Settings */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Mouse className="h-4 w-4" />
            Navigation Preferences
          </h4>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="keyboard-nav">Enhanced Keyboard Navigation</Label>
            <Switch
              id="keyboard-nav"
              checked={preferences.keyboardNavigation || false}
              onCheckedChange={(checked) => updatePreference('keyboardNavigation', checked)}
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Accessibility Tips:</strong>
            <br />
            • Use Tab key to navigate between form fields
            • Press Space to activate buttons and checkboxes
            • Use arrow keys in dropdown menus
            • Enable screen reader if you use assistive technology
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilitySettings;