'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Eye,
  EyeOff,
  Globe,
  Key,
  MapPin,
  Monitor,
  Shield,
  Smartphone,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Mock active sessions data
  const activeSessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      lastActive: new Date('2024-01-15T10:30:00'),
      current: true,
      ip: '192.168.1.1',
    },
    {
      id: 2,
      device: 'Mobile App on iOS',
      location: 'Delhi, India',
      lastActive: new Date('2024-01-14T18:45:00'),
      current: false,
      ip: '192.168.1.50',
    },
    {
      id: 3,
      device: 'Safari on macOS',
      location: 'Bangalore, India',
      lastActive: new Date('2024-01-13T14:20:00'),
      current: false,
      ip: '192.168.1.100',
    },
  ];

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Password updated successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTerminateSession = async (sessionId: number) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Session terminated successfully');
    } catch (error) {
      toast.error('Failed to terminate session');
    }
  };

  const enable2FA = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorEnabled(true);
      toast.success('Two-factor authentication enabled');
    } catch (error) {
      toast.error('Failed to enable 2FA');
    }
  };

  const securityCards = [
    {
      title: 'Password Security',
      description: 'Change your password and manage password settings',
      icon: Key,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={e =>
                  setPasswordForm(prev => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={e =>
                  setPasswordForm(prev => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                placeholder="Enter new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={e =>
                setPasswordForm(prev => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              placeholder="Confirm new password"
            />
          </div>

          <Button
            onClick={handlePasswordChange}
            disabled={
              isChangingPassword ||
              !passwordForm.currentPassword ||
              !passwordForm.newPassword
            }
            className="w-full"
          >
            {isChangingPassword ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </div>
      ),
    },
    {
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      icon: Smartphone,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {twoFactorEnabled ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              )}
              <div>
                <p className="font-medium">
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </p>
                <p className="text-muted-foreground text-sm">
                  {twoFactorEnabled
                    ? 'Your account is protected with 2FA'
                    : 'Secure your account with two-factor authentication'}
                </p>
              </div>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={
                twoFactorEnabled ? setTwoFactorEnabled : enable2FA
              }
            />
          </div>

          {!twoFactorEnabled && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-start">
                <AlertTriangle className="mt-0.5 mr-3 h-5 w-5 text-orange-600" />
                <div>
                  <h4 className="font-medium text-orange-800">
                    Recommended Security Enhancement
                  </h4>
                  <p className="mt-1 text-sm text-orange-700">
                    Enable two-factor authentication to significantly improve
                    your account security.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Login & Security Alerts',
      description: 'Get notified about account activity',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="login-alerts">Login Alerts</Label>
              <p className="text-muted-foreground text-sm">
                Get notified when someone signs into your account
              </p>
            </div>
            <Switch
              id="login-alerts"
              checked={loginAlerts}
              onCheckedChange={setLoginAlerts}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Security Cards */}
      {securityCards.map((card, index) => (
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

      {/* Active Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="mr-2 h-5 w-5 text-blue-600" />
              Active Sessions
            </CardTitle>
            <CardDescription>
              Manage devices and locations where you're signed in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeSessions.map((session, index) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-start space-x-3">
                    <Monitor className="mt-1 h-5 w-5 text-gray-500" />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{session.device}</p>
                        {session.current && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground space-y-1 text-sm">
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {session.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          Last active:{' '}
                          {format(session.lastActive, 'MMM dd, yyyy HH:mm')}
                        </div>
                        <div className="flex items-center">
                          <Globe className="mr-1 h-3 w-3" />
                          IP: {session.ip}
                        </div>
                      </div>
                    </div>
                  </div>

                  {!session.current && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTerminateSession(session.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Terminate
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="text-center">
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Sign out of all other sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
