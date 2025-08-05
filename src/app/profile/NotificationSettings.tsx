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
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Bell,
  Calendar,
  Clock,
  Mail,
  MessageSquare,
  Save,
  Smartphone,
  Star,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    // General Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,

    // Appointment Notifications
    appointmentReminders: true,
    appointmentConfirmations: true,
    appointmentCancellations: true,
    appointmentRescheduling: true,

    // Review & Rating Notifications
    newReviews: true,
    reviewResponses: true,
    ratingUpdates: true,

    // Account & Security
    accountSecurity: true,
    loginAlerts: true,
    passwordChanges: true,
    profileUpdates: false,

    // Marketing & Updates
    promotionalEmails: false,
    newsletterUpdates: true,
    newFeatures: true,
    surveyInvitations: false,

    // Social Features
    newFollowers: true,
    favorites: true,
    recommendations: true,

    // Timing Settings
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',

    // Delivery Preferences
    emailFrequency: 'immediate',
    digestFrequency: 'weekly',
  });

  const [isSaving, setIsSaving] = useState(false);

  const updateNotification = (key: string, value: boolean | string) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification preferences updated successfully!');
    } catch (error) {
      toast.error('Failed to update notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const notificationCategories = [
    {
      title: 'General Communication',
      description: 'Choose how you want to receive notifications',
      icon: Bell,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={notifications.emailNotifications}
              onCheckedChange={checked =>
                updateNotification('emailNotifications', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-green-500" />
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Receive notifications on your device
                </p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={notifications.pushNotifications}
              onCheckedChange={checked =>
                updateNotification('pushNotifications', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <div className="space-y-0.5">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Receive important updates via SMS
                </p>
              </div>
            </div>
            <Switch
              id="sms-notifications"
              checked={notifications.smsNotifications}
              onCheckedChange={checked =>
                updateNotification('smsNotifications', checked)
              }
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Appointment Notifications',
      description: 'Stay updated about your appointments',
      icon: Calendar,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appointment-reminders">
                Appointment Reminders
              </Label>
              <p className="text-muted-foreground text-sm">
                Get reminded before your appointments
              </p>
            </div>
            <Switch
              id="appointment-reminders"
              checked={notifications.appointmentReminders}
              onCheckedChange={checked =>
                updateNotification('appointmentReminders', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appointment-confirmations">
                Appointment Confirmations
              </Label>
              <p className="text-muted-foreground text-sm">
                Receive confirmation when appointments are booked
              </p>
            </div>
            <Switch
              id="appointment-confirmations"
              checked={notifications.appointmentConfirmations}
              onCheckedChange={checked =>
                updateNotification('appointmentConfirmations', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appointment-cancellations">
                Cancellation Notifications
              </Label>
              <p className="text-muted-foreground text-sm">
                Get notified when appointments are cancelled
              </p>
            </div>
            <Switch
              id="appointment-cancellations"
              checked={notifications.appointmentCancellations}
              onCheckedChange={checked =>
                updateNotification('appointmentCancellations', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appointment-rescheduling">
                Rescheduling Updates
              </Label>
              <p className="text-muted-foreground text-sm">
                Receive updates when appointments are rescheduled
              </p>
            </div>
            <Switch
              id="appointment-rescheduling"
              checked={notifications.appointmentRescheduling}
              onCheckedChange={checked =>
                updateNotification('appointmentRescheduling', checked)
              }
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Reviews & Ratings',
      description: 'Notifications about reviews and feedback',
      icon: Star,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-reviews">New Reviews</Label>
              <p className="text-muted-foreground text-sm">
                Get notified when someone reviews your experience
              </p>
            </div>
            <Switch
              id="new-reviews"
              checked={notifications.newReviews}
              onCheckedChange={checked =>
                updateNotification('newReviews', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="review-responses">Review Responses</Label>
              <p className="text-muted-foreground text-sm">
                Notifications when dentists respond to your reviews
              </p>
            </div>
            <Switch
              id="review-responses"
              checked={notifications.reviewResponses}
              onCheckedChange={checked =>
                updateNotification('reviewResponses', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="rating-updates">Rating Updates</Label>
              <p className="text-muted-foreground text-sm">
                Updates about overall rating changes
              </p>
            </div>
            <Switch
              id="rating-updates"
              checked={notifications.ratingUpdates}
              onCheckedChange={checked =>
                updateNotification('ratingUpdates', checked)
              }
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Account & Security',
      description: 'Important security and account notifications',
      icon: AlertCircle,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="account-security">Security Alerts</Label>
              <p className="text-muted-foreground text-sm">
                Critical security notifications (always enabled)
              </p>
            </div>
            <Switch
              id="account-security"
              checked={notifications.accountSecurity}
              onCheckedChange={checked =>
                updateNotification('accountSecurity', checked)
              }
              disabled
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="login-alerts">Login Alerts</Label>
              <p className="text-muted-foreground text-sm">
                Get notified about new login attempts
              </p>
            </div>
            <Switch
              id="login-alerts"
              checked={notifications.loginAlerts}
              onCheckedChange={checked =>
                updateNotification('loginAlerts', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="password-changes">Password Changes</Label>
              <p className="text-muted-foreground text-sm">
                Notifications when your password is changed
              </p>
            </div>
            <Switch
              id="password-changes"
              checked={notifications.passwordChanges}
              onCheckedChange={checked =>
                updateNotification('passwordChanges', checked)
              }
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Notification Categories */}
      {notificationCategories.map((category, index) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <category.icon className="mr-2 h-5 w-5 text-blue-600" />
                {category.title}
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>{category.content}</CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Quiet Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {notifications.quietHoursEnabled ? (
                <VolumeX className="mr-2 h-5 w-5 text-blue-600" />
              ) : (
                <Volume2 className="mr-2 h-5 w-5 text-blue-600" />
              )}
              Quiet Hours
            </CardTitle>
            <CardDescription>
              Set times when you don't want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                <p className="text-muted-foreground text-sm">
                  Silence non-urgent notifications during specified hours
                </p>
              </div>
              <Switch
                id="quiet-hours"
                checked={notifications.quietHoursEnabled}
                onCheckedChange={checked =>
                  updateNotification('quietHoursEnabled', checked)
                }
              />
            </div>

            {notifications.quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <Select
                    value={notifications.quietHoursStart}
                    onValueChange={value =>
                      updateNotification('quietHoursStart', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0') + ':00';
                        return (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quiet-end">End Time</Label>
                  <Select
                    value={notifications.quietHoursEnd}
                    onValueChange={value =>
                      updateNotification('quietHoursEnd', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0') + ':00';
                        return (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Delivery Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              Delivery Preferences
            </CardTitle>
            <CardDescription>
              Control how often you receive different types of notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email-frequency">Email Frequency</Label>
                <Select
                  value={notifications.emailFrequency}
                  onValueChange={value =>
                    updateNotification('emailFrequency', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="digest-frequency">Newsletter Frequency</Label>
                <Select
                  value={notifications.digestFrequency}
                  onValueChange={value =>
                    updateNotification('digestFrequency', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
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
              Save Notification Settings
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
