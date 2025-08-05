"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import ManageDentistCard from "@/components/ManageDentistCard";
import useDentistByUserId from "@/hooks/useDentistByUserId";
import { useSession } from "next-auth/react";
import React from "react";

const ManageDentistPage: React.FC = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const { data, isLoading, error } = useDentistByUserId(userId);

  // Handle loading states
  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (!session) {
    return <div>Please sign in to access this page</div>;
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    // make grid of 5 columns big screen 3 columns, medium screen 2 columns, small screen 1 column
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 lg:grid-cols-5">
      {/* map through data and render a ManageDentistCard for each dentist */}
      {data?.map((dentist) => (
        <ManageDentistCard key={dentist.id} {...dentist} />
      ))}
    </div>
  );
};

export default ManageDentistPage;
