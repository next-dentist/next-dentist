import Editor from '@/components/Editor';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Instruction } from '@prisma/client';
import { useInstructionAI } from './hooks/useInstructionAI';
import { useInstructionForm } from './hooks/useInstructionForm';
import { AiButton } from './ui/AiButton';

interface InstructionFormProps {
  treatmentId: string;
  initialData?: Instruction | null;
  onClose: () => void;
}

export function InstructionForm({
  treatmentId,
  initialData,
  onClose,
}: InstructionFormProps) {
  const {
    form,
    editorContent,
    setEditorContent,
    treatmentName,
    isPending,
    onSubmit,
  } = useInstructionForm(treatmentId, initialData, onClose);

  const { aiTarget, isAiLoading, generateAIContent } = useInstructionAI(
    form,
    treatmentName,
    setEditorContent
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <div className="col-span-full space-y-4 rounded-lg border p-4 md:col-span-1 md:p-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type (Optional)</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? ''}
                    disabled={!!aiTarget}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre">Pre</SelectItem>
                      <SelectItem value="post">Post</SelectItem>
                      <SelectItem value="during">During</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Title</FormLabel>
                  <AiButton
                    fieldName="title"
                    onClick={generateAIContent}
                    isLoading={isAiLoading}
                    isTargeted={aiTarget === 'title'}
                  />
                </div>
                <FormControl>
                  <Input
                    placeholder="Instruction Title"
                    {...field}
                    disabled={aiTarget === 'title'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Content</FormLabel>
                  <AiButton
                    fieldName="content"
                    onClick={generateAIContent}
                    isLoading={isAiLoading}
                    isTargeted={aiTarget === 'content'}
                  />
                </div>
                <FormControl>
                  <Editor
                    value={field.value}
                    onChange={newContent => {
                      setEditorContent(newContent);
                      field.onChange(newContent);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-full space-y-4 rounded-lg border p-4 md:col-span-1 md:p-2">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Icon Name (Optional)</FormLabel>
                  <AiButton
                    fieldName="icon"
                    onClick={generateAIContent}
                    isLoading={isAiLoading}
                    isTargeted={aiTarget === 'icon'}
                  />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g., CheckCircle, AlertTriangle (from lucide-react)"
                    {...field}
                    value={field.value ?? ''}
                    disabled={aiTarget === 'icon'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="buttonText"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Button Text (Optional)</FormLabel>
                  <AiButton
                    fieldName="buttonText"
                    onClick={generateAIContent}
                    isLoading={isAiLoading}
                    isTargeted={aiTarget === 'buttonText'}
                  />
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g., Learn More, Download PDF"
                    {...field}
                    value={field.value ?? ''}
                    disabled={aiTarget === 'buttonText'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="buttonLink"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Button Link (Optional)</FormLabel>
                  <AiButton
                    fieldName="buttonLink"
                    onClick={generateAIContent}
                    isLoading={isAiLoading}
                    isTargeted={aiTarget === 'buttonLink'}
                  />
                </div>
                <FormControl>
                  <Input
                    placeholder="https://example.com/resource"
                    {...field}
                    value={field.value ?? ''}
                    disabled={aiTarget === 'buttonLink'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-full flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={!!aiTarget}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !!aiTarget}>
            {isPending
              ? initialData
                ? 'Saving...'
                : 'Creating...'
              : initialData
                ? 'Save Changes'
                : 'Create Instruction'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
