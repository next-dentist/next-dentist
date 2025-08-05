"use client";
import type { Treatments } from "@prisma/client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

interface TreatmentSingleBoxProps {
  treatment: Treatments;
  index: number;
}

const TreatmentSingleBox: React.FC<TreatmentSingleBoxProps> = (props) => {
  return (
    <motion.div
      className="flex flex-col grow gap-2 justify-center items-center bg-[#f1fafa] rounded-xl p-5 text-center min-w-[80px]"
      key={props.treatment.name}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{
        opacity: { duration: 1, delay: props.index * 0.1, ease: "easeOut" },
        y: { duration: 0.5, delay: props.index * 0.05, ease: "easeOut" },
      }}
    >
      <Link
        href={`/treatments/${props.treatment.slug || ""}`}
        className="text-black flex flex-col gap-2 justify-center items-center text-tiny "
      >
        <Image
          src={props.treatment.image || ""}
          alt={props.treatment.name || ""}
          width={75}
          height={75}
          className="rounded-full"
        />
        <div className="flex flex-col gap-2">
          <span className="text-sm">{props.treatment.name}</span>
        </div>
      </Link>
      <Button className="w-full" size="sm">
        Book Now
      </Button>
    </motion.div>
  );
};

export default TreatmentSingleBox;
