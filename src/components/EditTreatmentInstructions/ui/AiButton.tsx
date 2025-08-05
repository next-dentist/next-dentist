import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface AiButtonProps {
  fieldName: string;
  onClick: (fieldName: string) => void;
  isLoading: boolean;
  isTargeted: boolean;
}

export function AiButton({
  fieldName,
  onClick,
  isLoading,
  isTargeted,
}: AiButtonProps) {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="h-8 w-8 rounded-full"
      onClick={() => onClick(fieldName)}
      disabled={isLoading || isTargeted}
    >
      {isTargeted ? (
        <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4 text-muted-foreground" />
      )}
      <span className="sr-only">Generate with AI</span>
    </Button>
  );
}
