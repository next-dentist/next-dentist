// components/CurrencyRow.tsx
import {
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
import { currencyConfig } from '@/config';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';
import { CostTableFormValues } from '@/schemas';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<CostTableFormValues>;
  row?: number;
}
export const CurrencyRow = ({ form, row = 0 }: Props) => {
  // plug-in the logic
  useCurrencyConversion(form, row);

  const picker = (
    fieldPath: `costTables.${number}.currency${'One' | 'Two' | 'Three'}`
  ) => (
    <Select
      onValueChange={val => form.setValue(fieldPath, val)}
      defaultValue={form.getValues(fieldPath)}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {currencyConfig.list.map(c => (
          <SelectItem key={c.id} value={c.id}>
            {c.name} ({c.symbol})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const text = (
    fieldPath: `costTables.${number}.cost${'One' | 'Two' | 'Three'}`,
    readOnly = false,
    placeholder = ''
  ) => (
    <Input
      {...form.register(fieldPath)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={readOnly ? 'bg-gray-50' : ''}
    />
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <FormField
        name={`costTables.${row}.currencyOne`}
        control={form.control}
        render={() => (
          <FormItem>
            <FormLabel>Currency One</FormLabel>
            {picker(`costTables.${row}.currencyOne`)}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={`costTables.${row}.currencyTwo`}
        control={form.control}
        render={() => (
          <FormItem>
            <FormLabel>Currency Two</FormLabel>
            {picker(`costTables.${row}.currencyTwo`)}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={`costTables.${row}.currencyThree`}
        control={form.control}
        render={() => (
          <FormItem>
            <FormLabel>Currency Three</FormLabel>
            {picker(`costTables.${row}.currencyThree`)}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name={`costTables.${row}.costOne`}
        control={form.control}
        render={() => (
          <FormItem>
            <FormLabel>Cost One</FormLabel>
            {text(`costTables.${row}.costOne`, false, '₹35,000 – ₹45,000')}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={`costTables.${row}.costTwo`}
        control={form.control}
        render={() => (
          <FormItem>
            <FormLabel>Cost Two (auto)</FormLabel>
            {text(`costTables.${row}.costTwo`, true)}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name={`costTables.${row}.costThree`}
        control={form.control}
        render={() => (
          <FormItem>
            <FormLabel>Cost Three (auto)</FormLabel>
            {text(`costTables.${row}.costThree`, true)}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
