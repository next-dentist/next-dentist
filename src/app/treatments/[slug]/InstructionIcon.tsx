"use client";

import IconBox from "@/components/IconBox";
import { Instruction } from "@prisma/client";
interface InstructionIconProps {
  instruction: Instruction[];
}

export default function InstructionIcon({ instruction }: InstructionIconProps) {
  const preTreatmentInstructions = instruction.filter(
    (instruction) => instruction.type === "pre"
  );
  const postTreatmentInstructions = instruction.filter(
    (instruction) => instruction.type === "post"
  );
  const duringTreatmentInstructions = instruction.filter(
    (instruction) => instruction.type === "during"
  );
  return (
    <>
      <div className="flex flex-col gap-10">
        {preTreatmentInstructions.length > 0 && (
          <>
            <h3 className="text-lg font-bold">Pre-Treatment Instructions</h3>
            {/* create grid 4 columns in desktop and 2 columns in mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {preTreatmentInstructions.map((instruction) => (
                <IconBox
                  key={instruction.id}
                  id={instruction.id}
                  icon={instruction.icon || "FileCheck2"}
                  title={instruction.title}
                  content={instruction.content}
                />
              ))}
            </div>
          </>
        )}
        {duringTreatmentInstructions.length > 0 && (
          <>
            <h3 className="text-lg font-bold">During-Treatment Instructions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {duringTreatmentInstructions.map((instruction) => (
                <IconBox
                  key={instruction.id}
                  id={instruction.id}
                  icon={instruction.icon || "FileCheck2"}
                  title={instruction.title}
                  content={instruction.content}
                />
              ))}
            </div>
          </>
        )}

        {postTreatmentInstructions.length > 0 && (
          <>
            <h3 className="text-lg font-bold">Post-Treatment Instructions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {postTreatmentInstructions.map((instruction) => (
                <IconBox
                  key={instruction.id}
                  id={instruction.id}
                  icon={instruction.icon || "FileCheck2"}
                  title={instruction.title}
                  content={instruction.content}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
