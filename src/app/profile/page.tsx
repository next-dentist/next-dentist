'use client';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import LoadingSpinner from '@/components/LoadingSpinner';
import { SectionTwo } from '@/components/SectionTwo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import {
  Activity,
  Bell,
  Calendar,
  Camera,
  Edit3,
  Heart,
  Mail,
  Settings,
  Shield,
  Star,
  User,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Suspense, useState } from 'react';
import BasicInfo from './BasicInfo';
import NotificationSettings from './NotificationSettings';
import ProfilePreferences from './ProfilePreferences';
import SecuritySettings from './SecuritySettings';

export default function Profile() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('profile');

  const getUserInitials = () => {
    if (!session?.user?.name) return 'U';
    return session.user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const profileStats = [
    { label: 'Appointments', value: '12', icon: Calendar },
    { label: 'Reviews', value: '8', icon: Star },
    { label: 'Favorites', value: '5', icon: Heart },
    { label: 'Profile Views', value: '24', icon: Activity },
  ];

  return (
    <Suspense
      fallback={
        <div>
          <LoadingSpinner fullScreen />
        </div>
      }
    >
      <SectionTwo>
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <Breadcrumbs />

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <Card className="relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-secondary)]/10 to-[var(--color-tertiary)]/10" />
              <div className="absolute top-0 right-0 h-64 w-64 translate-x-32 -translate-y-32 rounded-full bg-gradient-to-bl from-[var(--color-primary)]/20 to-transparent" />

              <CardContent className="relative p-6 md:p-8">
                <div className="flex flex-col items-start space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-6">
                  {/* Avatar Section */}
                  <div className="group relative">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg md:h-32 md:w-32">
                      <AvatarImage
                        src={session?.user?.image || ''}
                        alt={session?.user?.name || 'User'}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white md:text-2xl">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute -right-1 -bottom-1 h-8 w-8 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Camera className="h-4 w-4 text-[var(--color-primary)]" />
                    </Button>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                          {session?.user?.name || 'User Name'}
                        </h1>
                        <div className="mt-1 flex items-center space-x-4 text-gray-600">
                          <div className="flex items-center">
                            <Mail className="mr-1 h-4 w-4 text-[var(--color-muted-foreground)]" />
                            <span className="text-sm">
                              {session?.user?.email}
                            </span>
                          </div>
                          {session?.user?.role && (
                            <Badge variant="secondary" className="capitalize">
                              <Shield className="mr-1 h-3 w-3 text-[var(--color-primary)]" />
                              {session.user.role.toLowerCase()}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button variant="outline" className="mt-4 md:mt-0">
                        <Edit3 className="mr-2 h-4 w-4 text-[var(--color-primary)]" />
                        Edit Profile
                      </Button>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                      {profileStats.map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="rounded-lg border bg-white/50 p-3 text-center"
                        >
                          <stat.icon className="mx-auto mb-1 h-5 w-5 text-[var(--color-primary)]" />
                          <div className="text-xl font-bold text-gray-900">
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-600">
                            {stat.label}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <div className="border-b border-gray-200">
                <TabsList className="grid h-auto w-full grid-cols-2 bg-transparent p-0 md:grid-cols-4">
                  <TabsTrigger
                    value="profile"
                    className="rounded-none px-4 pb-4 data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-primary)] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <User className="mr-2 h-4 w-4 text-[var(--color-primary)]" />
                    <span className="hidden sm:inline">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="preferences"
                    className="rounded-none px-4 pb-4 data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-primary)] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <Settings className="mr-2 h-4 w-4 text-[var(--color-primary)]" />
                    <span className="hidden sm:inline">Preferences</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="rounded-none px-4 pb-4 data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-primary)] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <Shield className="mr-2 h-4 w-4 text-[var(--color-primary)]" />
                    <span className="hidden sm:inline">Security</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="rounded-none px-4 pb-4 data-[state=active]:border-b-2 data-[state=active]:border-[var(--color-primary)] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <Bell className="mr-2 h-4 w-4 text-[var(--color-primary)]" />
                    <span className="hidden sm:inline">Notifications</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <TabsContent value="profile" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BasicInfo />
                </motion.div>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProfilePreferences />
                </motion.div>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SecuritySettings />
                </motion.div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <NotificationSettings />
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </SectionTwo>
    </Suspense>
  );
}
