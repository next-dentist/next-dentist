// hooks/useCurrencyConversion.ts
import { convert, parseCost } from '@/lib/utils';
import { CostTableFormValues } from '@/schemas';
import { useEffect } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';

export const useCurrencyConversion = (
  form: UseFormReturn<CostTableFormValues>,
  row = 0,
) => {
  const costOne         = useWatch({ control: form.control, name: `costTables.${row}.costOne` });
  const currencyOne     = useWatch({ control: form.control, name: `costTables.${row}.currencyOne` });
  const currencyTwo     = useWatch({ control: form.control, name: `costTables.${row}.currencyTwo` });
  const currencyThree   = useWatch({ control: form.control, name: `costTables.${row}.currencyThree` });

  useEffect(() => {
    if (!costOne || !currencyOne) return;
    const parsed = parseCost(costOne);
    if (!parsed) return;

    if (currencyTwo) {
      form.setValue(`costTables.${row}.costTwo`,   convert(parsed, currencyOne, currencyTwo));
    }
    if (currencyThree) {
      form.setValue(`costTables.${row}.costThree`, convert(parsed, currencyOne, currencyThree));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [costOne, currencyOne, currencyTwo, currencyThree]);
};
