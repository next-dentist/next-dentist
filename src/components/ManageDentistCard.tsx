'use client';

import { Dentist, DentistStatus } from '@prisma/client';
import clsx from 'clsx';
import {
  Ban,
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';
import { WhiteRoundedBox2 } from './WhiteRoundedBox2';

// Status badge component
const statusMap: Record<
  DentistStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: <Clock className="mr-1 h-4 w-4 text-yellow-500" />,
  },
  verified: {
    label: 'Verified',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: <XCircle className="mr-1 h-4 w-4 text-red-500" />,
  },
  banned: {
    label: 'Banned',
    color: 'bg-red-200 text-red-900 border-red-400',
    icon: <Ban className="mr-1 h-4 w-4 text-red-700" />,
  },
  deleted: {
    label: 'Deleted',
    color: 'bg-gray-200 text-gray-600 border-gray-300',
    icon: <Trash2 className="mr-1 h-4 w-4 text-gray-500" />,
  },
  suspended: {
    label: 'Suspended',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    icon: <Ban className="mr-1 h-4 w-4 text-orange-500" />,
  },
  closed: {
    label: 'Closed',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    icon: <Ban className="mr-1 h-4 w-4 text-gray-400" />,
  },
};

type ManageDentistCardProps = Pick<Dentist, 'id' | 'name' | 'image' | 'status'>;

const ManageDentistCard: React.FC<ManageDentistCardProps> = ({
  name,
  image,
  id,
  status,
}) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/manage-dentists/${id}/dashboard`);
  };

  const statusInfo = statusMap[status];

  return (
    <WhiteRoundedBox2 className="border-border/30 hover:border-primary flex flex-col items-center justify-center gap-4 border-2 p-4 transition-all duration-300">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-lg font-bold">{name}</h3>
        <span
          className={clsx(
            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
            statusInfo.color
          )}
          title={statusInfo.label}
        >
          {statusInfo.icon}
          {statusInfo.label}
        </span>
      </div>
      <Image
        src={image || '/images/default-dentist.png'}
        alt={name || 'Dentist Image'}
        width={100}
        height={100}
        className="rounded-full border object-cover"
      />
      <div className="flex w-full flex-row justify-between gap-2">
        <Button
          onClick={handleEdit}
          className="hover:bg-primary/80 w-full"
          variant={'outline'}
          disabled={status === 'deleted' || status === 'banned'}
        >
          <Pencil className="h-4 w-4" />
          Manage
        </Button>
      </div>
    </WhiteRoundedBox2>
  );
};

export default ManageDentistCard;
