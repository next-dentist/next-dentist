"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@prisma/client";

interface FAQProps {
  faq: FAQ;
}

const FAQ: React.FC<FAQProps> = ({ faq }) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="text-lg border-b-2 border-secondary"
    >
      <AccordionItem value={faq.id} className="text-lg">
        <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
        <AccordionContent className="text-lg">{faq.answer}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FAQ;
