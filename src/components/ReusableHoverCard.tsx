"use client";
import { CalendarIcon } from "lucide-react";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ReusableHoverCardProps {
  title: string;
  description?: string;
  image?: string;
  date?: string;
  icon?: React.ReactNode;
  className?: string;
}

const ReusableHoverCard: React.FC<ReusableHoverCardProps> = ({
  title,
  description,
  image,
  date,
  icon,
  className,
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button className={className} variant="link" size="sm">
          {icon}
          {title}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage src={image} />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm">{description}</p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">{date}</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ReusableHoverCard;
