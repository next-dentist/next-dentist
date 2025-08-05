"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AccordionSingleProps {
  faqs: {
    id: number;
    title: string;
    content: string;
  }[];
}

export function AccordionSingle({ faqs }: AccordionSingleProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-primary/10 rounded-3xl px-4 py-2"
    >
      {faqs.map((faq) => (
        <AccordionItem value={faq.id.toString()} key={faq.id}>
          <AccordionTrigger className="text-slate-700 text-lg font-semibold">
            {faq.title}
          </AccordionTrigger>
          <AccordionContent>{faq.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
