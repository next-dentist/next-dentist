'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import {
  Eye,
  Globe,
  MapPin,
  Moon,
  Palette,
  Save,
  Sun,
  Volume2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfilePreferences() {
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC+05:30',
    currency: 'INR',
    theme: 'light',
    emailNotifications: true,
    pushNotifications: false,
    soundEnabled: true,
    autoLocation: true,
    marketingEmails: false,
    weeklyDigest: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Preferences updated successfully!');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const preferenceCards = [
    {
      title: 'Language & Region',
      description: 'Set your preferred language and regional settings',
      icon: Globe,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={preferences.language}
              onValueChange={value =>
                setPreferences(prev => ({ ...prev, language: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={preferences.timezone}
              onValueChange={value =>
                setPreferences(prev => ({ ...prev, timezone: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC+05:30">UTC+05:30 (India)</SelectItem>
                <SelectItem value="UTC+00:00">UTC+00:00 (GMT)</SelectItem>
                <SelectItem value="UTC-05:00">UTC-05:00 (EST)</SelectItem>
                <SelectItem value="UTC-08:00">UTC-08:00 (PST)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={preferences.currency}
              onValueChange={value =>
                setPreferences(prev => ({ ...prev, currency: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">₹ Indian Rupee</SelectItem>
                <SelectItem value="USD">$ US Dollar</SelectItem>
                <SelectItem value="EUR">€ Euro</SelectItem>
                <SelectItem value="GBP">£ British Pound</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      title: 'Appearance',
      description: 'Customize your visual experience',
      icon: Palette,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={preferences.theme}
              onValueChange={value =>
                setPreferences(prev => ({ ...prev, theme: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center">
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center">
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center">
                    <Eye className="mr-2 h-4 w-4" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      title: 'Notifications',
      description: 'Control how you receive notifications',
      icon: Volume2,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-muted-foreground text-sm">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.emailNotifications}
              onCheckedChange={checked =>
                setPreferences(prev => ({
                  ...prev,
                  emailNotifications: checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-muted-foreground text-sm">
                Receive push notifications on your device
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences.pushNotifications}
              onCheckedChange={checked =>
                setPreferences(prev => ({
                  ...prev,
                  pushNotifications: checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound-enabled">Sound</Label>
              <p className="text-muted-foreground text-sm">
                Play sounds for notifications
              </p>
            </div>
            <Switch
              id="sound-enabled"
              checked={preferences.soundEnabled}
              onCheckedChange={checked =>
                setPreferences(prev => ({ ...prev, soundEnabled: checked }))
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">Marketing Emails</Label>
              <p className="text-muted-foreground text-sm">
                Receive promotional emails and updates
              </p>
            </div>
            <Switch
              id="marketing-emails"
              checked={preferences.marketingEmails}
              onCheckedChange={checked =>
                setPreferences(prev => ({ ...prev, marketingEmails: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-digest">Weekly Digest</Label>
              <p className="text-muted-foreground text-sm">
                Get a weekly summary of your activity
              </p>
            </div>
            <Switch
              id="weekly-digest"
              checked={preferences.weeklyDigest}
              onCheckedChange={checked =>
                setPreferences(prev => ({ ...prev, weeklyDigest: checked }))
              }
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Privacy & Location',
      description: 'Manage your privacy and location settings',
      icon: MapPin,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-location">Auto-detect Location</Label>
              <p className="text-muted-foreground text-sm">
                Automatically detect your location for better search results
              </p>
            </div>
            <Switch
              id="auto-location"
              checked={preferences.autoLocation}
              onCheckedChange={checked =>
                setPreferences(prev => ({ ...prev, autoLocation: checked }))
              }
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {preferenceCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <card.icon className="mr-2 h-5 w-5 text-blue-600" />
                {card.title}
              </CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>{card.content}</CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
