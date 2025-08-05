"use client";

import HeaderHOne from "@/components/Headers/HeaderHOne";
import HeaderHThree from "@/components/Headers/HeaderHThree";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { WhiteRoundedBox } from "@/components/WhiteRoundedBox";
import { Dentist } from "@prisma/client";
import {
  Calendar,
  CheckCircle,
  Edit,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Star,
  User,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DentistViewModelProps {
  dentist: Dentist;
}

const DentistViewModel = ({ dentist }: DentistViewModelProps) => {
  const getStatusBadge = (status: string | null) => {
    if (status === "verified") {
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Verified
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <XCircle className="mr-1 h-3 w-3" />
          {status || "Pending"}
        </div>
      );
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-xs cursor-pointer hover:underline">View</span>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 overflow-hidden sm:max-h-[90vh] max-h-[95vh] flex flex-col">
        {/* Close button - Fixed to avoid button nesting */}
        <DialogClose asChild className="absolute top-4 right-4 z-10">
          <button className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogClose>

        {/* Content with scrolling */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Left column - Profile image and basic info */}
            <div className="bg-primary/10 p-6 flex flex-col items-center text-center">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
                {dentist.image ? (
                  <Image
                    src={dentist.image}
                    alt={dentist.name || "Dentist profile"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              <HeaderHOne title={dentist.name || "Unnamed Dentist"} />
              <p className="text-primary font-medium mt-1">
                {dentist.speciality}
              </p>

              <div className="mt-4">{getStatusBadge(dentist.status)}</div>

              <Separator className="my-4" />

              <div className="w-full flex flex-col gap-3 items-start text-sm">
                <div className="flex items-center w-full">
                  <Phone className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                  <span className="truncate">
                    {dentist.phone || "No phone number"}
                  </span>
                </div>
                <div className="flex items-center w-full">
                  <Mail className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                  <span className="truncate">
                    {dentist.email || "No email address"}
                  </span>
                </div>
                <div className="flex items-center w-full">
                  <MapPin className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                  <span className="break-words">
                    {[
                      dentist.address,
                      dentist.city,
                      dentist.state,
                      dentist.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "No address provided"}
                  </span>
                </div>
                {dentist.website && (
                  <div className="flex items-center w-full">
                    <Globe className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                    <span className="truncate">{dentist.website}</span>
                  </div>
                )}
                <div className="flex items-center w-full">
                  <Calendar className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                  <span className="truncate">
                    Joined: {formatDate(dentist.createdAt)}
                  </span>
                </div>
              </div>

              <div className="mt-6 w-full">
                <Link
                  href={`/dentist/${dentist.slug}`}
                  target="_blank"
                  className="inline-flex items-center justify-center text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Public Profile
                </Link>
              </div>
            </div>

            {/* Right column - Detailed info */}
            <div className="col-span-1 lg:col-span-2 p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Dentist Profile
                </DialogTitle>
                <DialogDescription>
                  Comprehensive information about this dentist.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                <WhiteRoundedBox className="p-4">
                  <HeaderHThree title="Professional Information" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm text-gray-500">Speciality</p>
                      <p className="font-medium">
                        {dentist.speciality || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">
                        {dentist.experience
                          ? `${dentist.experience} years`
                          : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium">
                        {dentist.gender || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fees</p>
                      <p className="font-medium">
                        {dentist.priceStart
                          ? `₹${dentist.priceStart}`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </WhiteRoundedBox>

                <WhiteRoundedBox className="p-4">
                  <HeaderHThree title="Clinic Information" />
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium break-words">
                      {[
                        dentist.address,
                        dentist.city,
                        dentist.state,
                        dentist.zipCode,
                        dentist.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "No address provided"}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Start Price</p>
                        <p className="font-medium">
                          {dentist.priceStart
                            ? `₹${dentist.priceStart}`
                            : "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Clinic Rating</p>
                        <div className="flex items-center">
                          <Star
                            className="h-4 w-4 text-yellow-400 mr-1"
                            fill="currentColor"
                          />
                          <span className="font-medium">
                            {dentist.rating || "No ratings yet"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </WhiteRoundedBox>

                {dentist.shortBio && (
                  <WhiteRoundedBox className="p-4">
                    <HeaderHThree title="Biography" />
                    <p className="mt-2 text-gray-700">{dentist.shortBio}</p>
                  </WhiteRoundedBox>
                )}

                {dentist.longBio && (
                  <WhiteRoundedBox className="p-4">
                    <HeaderHThree title="Extended Biography" />
                    <p className="mt-2 text-gray-700">{dentist.longBio}</p>
                  </WhiteRoundedBox>
                )}

                <Separator />

                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/admin/dentists/edit/${dentist.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Dentist
                    </Link>
                  </Button>

                  <Button
                    variant={
                      dentist.status === "verified" ? "outline" : "default"
                    }
                    className={
                      dentist.status === "verified" ? "text-green-600" : ""
                    }
                  >
                    {dentist.status === "verified" ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {dentist.status === "verified"
                      ? "Verified"
                      : "Verify Dentist"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DentistViewModel;
