import { SectionTwo } from '@/components/SectionTwo';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/config';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const AdminPage: React.FC = () => {
  return (
    <SectionTwo className="flex flex-col items-center justify-center px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {siteConfig.adminLinks.map(link => (
          <Link href={link.href} key={link.href} className="block">
            <Card className="transition-shadow duration-200 hover:shadow-lg">
              <CardContent className="flex items-center justify-between p-6">
                <span className="text-xl font-medium">{link.name}</span>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </SectionTwo>
  );
};

export default AdminPage;
