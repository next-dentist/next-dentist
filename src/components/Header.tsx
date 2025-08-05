'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { siteConfig } from '@/config';
import { headerConfig, type MenuItem } from '@/config-header';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronRight,
  LogOut,
  Mail,
  Menu,
  MessageSquareText,
  Phone,
  Shield,
  Star,
  X,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const userRole = session?.user?.role;

  // Helper role checks
  const isAdmin = isAuthenticated && userRole === 'ADMIN';
  const isDentist = isAuthenticated && userRole === 'DENTIST';
  const isUser = isAuthenticated && userRole === 'USER';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const getUserInitials = () => {
    if (!session?.user?.name) return 'U';
    return session.user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b transition-all duration-300',
          scrolled
            ? 'bg-white/95 shadow-lg backdrop-blur-md'
            : 'bg-white shadow-sm'
        )}
      >
        <nav className="container mx-auto flex items-center justify-between px-4 py-3 lg:px-6">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={siteConfig.logoLight}
              alt={siteConfig.logoAlt}
              width={150}
              height={40}
              className="h-8 w-auto sm:h-10"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                {headerConfig.navLinks.map(item => (
                  <NavigationMenuItem key={item.name}>
                    {item.submenu ? (
                      <>
                        <NavigationMenuTrigger className="h-9 px-4 py-2">
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[600px] gap-3 p-6 md:w-[700px] lg:w-[800px] lg:grid-cols-2">
                            <div className="row-span-3">
                              <NavigationMenuLink asChild>
                                {item.image ? (
                                  <div className="relative flex h-full w-full flex-col justify-end overflow-hidden rounded-2xl p-6 no-underline outline-none select-none focus:shadow-md">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      sizes="(max-width: 768px) 300px, (max-width: 1024px) 350px, 400px"
                                      className="absolute inset-0 z-0 rounded-2xl object-cover"
                                      priority
                                    />
                                    {/* Gradient overlay on top of the image for better text readability */}
                                    <div className="from-primary/10 to-primary/20 absolute inset-0 z-10 rounded-2xl bg-gradient-to-b"></div>
                                    {/* Content positioned above the image and gradient */}
                                    <div className="relative z-20 rounded-2xl bg-white/90 p-6">
                                      <item.icon className="text-primary h-8 w-8" />
                                      <div className="text-primary mt-4 mb-2 text-lg font-medium">
                                        {item.name}
                                      </div>
                                      <p className="text-primary text-sm leading-tight">
                                        {item.description}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="from-primary/10 to-primary/20 flex h-full w-full flex-col justify-end rounded-2xl bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md">
                                    <item.icon className="text-primary h-8 w-8" />
                                    <div className="text-primary mt-4 mb-2 text-lg font-medium">
                                      {item.name}
                                    </div>
                                    <p className="text-primary text-sm leading-tight">
                                      {item.description}
                                    </p>
                                  </div>
                                )}
                              </NavigationMenuLink>
                            </div>
                            <div className="grid gap-2">
                              {item.submenu.map(subItem => (
                                <NavigationMenuLink asChild key={subItem.name}>
                                  <Link
                                    href={subItem.href}
                                    className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-2xl p-3 leading-none no-underline transition-colors outline-none select-none"
                                  >
                                    <div className="flex items-center">
                                      {subItem.icon && (
                                        <subItem.icon className="mr-2 h-4 w-4" />
                                      )}
                                      <div className="text-sm leading-none font-medium">
                                        {subItem.name}
                                      </div>
                                    </div>
                                    {subItem.description && (
                                      <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                        {subItem.description}
                                      </p>
                                    )}
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="group bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-9 w-max items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                        >
                          <div className="flex items-center">
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          {/* Professional Dashboard Button */}

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* ADMIN only: Admin Dashboard */}
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/admin')}
                className="hidden sm:flex"
              >
                <Shield className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Button>
            )}

            {/* DENTIST and ADMIN: Professional Dashboard */}
            {(isAdmin || isDentist) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/manage-dentists')}
                className="hidden sm:flex"
              >
                <Shield className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            )}

            {/* USER: No dashboard button */}
            {(isDentist || isAdmin) && (
              <Button
                onClick={() => router.push('/chat')}
                className="cursor-pointer"
                variant="outline"
                size="sm"
              >
                <MessageSquareText className="mr-2 h-4 w-4" />
              </Button>
            )}

            {/* Authentication Section */}
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/login')}
                >
                  Log in
                </Button>
                <Button size="sm" onClick={() => router.push('/register')}>
                  Sign up
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full border-2 border-transparent hover:border-blue-200"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session?.user?.image || ''}
                        alt={session?.user?.name || 'User'}
                      />
                      <AvatarFallback className="bg-blue-100 text-xs font-medium text-blue-700">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {session?.user?.name}
                      </p>
                      <p className="text-muted-foreground text-xs leading-none">
                        {session?.user?.email}
                      </p>
                      {userRole && (
                        <div className="mt-1 flex items-center">
                          <Star className="mr-1 h-3 w-3 text-yellow-500" />
                          <span className="text-xs font-medium text-yellow-600 capitalize">
                            {userRole.toLowerCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* User menu items: show for all authenticated users */}
                  {headerConfig.userMenuItems.map(item => (
                    <DropdownMenuItem
                      key={item.name}
                      onClick={() => router.push(item.href)}
                      className="cursor-pointer"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        {item.description && (
                          <span className="text-muted-foreground text-xs">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}

                  {/* DENTIST and ADMIN: Professional Dashboard */}
                  {(isAdmin || isDentist) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => router.push('/manage-dentists')}
                        className="cursor-pointer"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Professional Dashboard</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* ADMIN only: Admin Dashboard in dropdown */}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => router.push('/admin')}
                        className="cursor-pointer"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                <Image
                  src={siteConfig.logoLight}
                  alt={siteConfig.logoAlt}
                  width={150}
                  height={40}
                  className="h-8 w-auto sm:h-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex h-full flex-col overflow-y-auto">
                {/* User Section */}
                {isAuthenticated && (
                  <div className="border-b bg-gray-50 p-6">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={session?.user?.image || ''}
                          alt={session?.user?.name || 'User'}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {session?.user?.name}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {session?.user?.email}
                        </p>
                        {userRole && (
                          <div className="mt-1 flex items-center">
                            <Star className="mr-1 h-3 w-3 text-yellow-500" />
                            <span className="text-xs font-medium text-yellow-600 capitalize">
                              {userRole.toLowerCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex-1 space-y-2 px-6 py-4">
                  {headerConfig.navLinks.map(item => (
                    <MobileNavItem
                      key={item.name}
                      item={item}
                      onNavigate={toggleSidebar}
                    />
                  ))}
                </div>

                {/* Bottom Section */}
                <div className="space-y-4 border-t bg-gray-50 p-6">
                  {/* ADMIN and DENTIST: Professional Dashboard */}
                  {(isAdmin || isDentist) && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push('/manage-dentists');
                        toggleSidebar();
                      }}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Professional Dashboard
                    </Button>
                  )}

                  {/* ADMIN only: Admin Dashboard */}
                  {isAdmin && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push('/admin');
                        toggleSidebar();
                      }}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  )}

                  {/* USER: No dashboard buttons */}

                  {/* Auth Buttons */}
                  {!isAuthenticated ? (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          router.push('/login');
                          toggleSidebar();
                        }}
                      >
                        Log in
                      </Button>
                      <Button
                        className="w-full"
                        onClick={() => {
                          router.push('/register');
                          toggleSidebar();
                        }}
                      >
                        Sign up
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        handleSignOut();
                        toggleSidebar();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  )}

                  {/* Contact Info */}
                  <Separator />
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      <a
                        href={`tel:${headerConfig.contactInfo.phone}`}
                        className="hover:text-blue-600"
                      >
                        {headerConfig.contactInfo.phone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      <a
                        href={`mailto:${headerConfig.contactInfo.email}`}
                        className="hover:text-blue-600"
                      >
                        {headerConfig.contactInfo.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Mobile Navigation Item Component
function MobileNavItem({
  item,
  onNavigate,
}: {
  item: MenuItem;
  onNavigate: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (href: string) => {
    if (href !== '#') {
      router.push(href);
      onNavigate();
    }
  };

  if (item.submenu) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left hover:bg-gray-100">
          <div className="flex items-center">
            <item.icon className="mr-3 h-5 w-5 text-gray-500" />
            <span className="font-medium">{item.name}</span>
          </div>
          <ChevronRight
            className={cn(
              'h-4 w-4 transition-transform',
              isOpen && 'rotate-90'
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 pt-2 pl-8">
          {item.submenu.map(subItem => (
            <button
              key={subItem.name}
              onClick={() => handleNavigation(subItem.href)}
              className="flex w-full items-start rounded-lg px-3 py-2 text-left hover:bg-gray-100"
            >
              <div>
                <div className="flex items-center">
                  {subItem.icon && (
                    <subItem.icon className="mr-2 h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm font-medium">{subItem.name}</span>
                </div>
                {subItem.description && (
                  <p className="mt-1 text-xs text-gray-500">
                    {subItem.description}
                  </p>
                )}
              </div>
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <button
      onClick={() => handleNavigation(item.href)}
      className="flex w-full items-center rounded-lg px-3 py-2 text-left hover:bg-gray-100"
    >
      <item.icon className="mr-3 h-5 w-5 text-gray-500" />
      <div>
        <span className="font-medium">{item.name}</span>
        {item.description && (
          <p className="text-xs text-gray-500">{item.description}</p>
        )}
      </div>
    </button>
  );
}
