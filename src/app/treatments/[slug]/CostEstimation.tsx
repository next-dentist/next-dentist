"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Cost } from "@prisma/client";

interface CostEstimationProps {
  cost: Cost;
}

export default function CostEstimation({ cost }: CostEstimationProps) {
  return (
    <TableRow key={cost.id}>
      <TableCell className="font-medium">{cost.title}</TableCell>

      <TableCell className="text-right">
        {cost.currency} {cost.priceMin}
      </TableCell>
      <TableCell className="text-right">
        {cost.currency} {cost.priceMax}
      </TableCell>
    </TableRow>
  );
}
