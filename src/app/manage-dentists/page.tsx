"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SectionTwo } from "@/components/SectionTwo";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Suspense } from "react";
import ManageDentistPage from "./ManageDentistPage";

const ManageDentists: React.FC = () => {
  const router = useRouter();
  return (
    <Suspense
      fallback={
        <div>
          <LoadingSpinner fullScreen />
        </div>
      }
    >
      <div className="">
        <div className="container mx-auto flex flex-row justify-between  items-center px-4 ">
          <Breadcrumbs />
          <div className="flex justify-end">
            <Button
              variant={"outline"}
              onClick={() => router.push("/dentists/add")}
            >
              <Plus className="w-4 h-4" />
              Add New Dentist
            </Button>
          </div>
        </div>
        <SectionTwo className=" gap-4">
          <ManageDentistPage />
        </SectionTwo>
      </div>
    </Suspense>
  );
};

export default ManageDentists;
