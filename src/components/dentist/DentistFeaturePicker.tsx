'use client';

import { listAllFeatures } from '@/app/(actions)/dentist/listAll';
import { listDentistFeatures } from '@/app/(actions)/dentist/listForDentist';
import { setDentistFeatures } from '@/app/(actions)/dentist/setForDentist';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
export default function DentistFeaturePicker({
  dentistId,
}: {
  dentistId: string;
}) {
  const qc = useQueryClient();

  /* ---------- fetch master list & dentist selection ------------------- */
  const { data: all = [] } = useQuery({
    queryKey: ['feature'],
    queryFn: listAllFeatures,
    staleTime: Infinity,
  });

  const { data: selected, isLoading: loadingSel } = useQuery({
    queryKey: ['features', dentistId],
    queryFn: () => listDentistFeatures(dentistId),
  });

  /* ---------- local draft state --------------------------------------- */
  const [draft, setDraft] = useState<string[]>([]);

  // keep draft in sync with server on load - only update when selected actually changes
  useEffect(() => {
    if (selected && Array.isArray(selected)) {
      setDraft(selected);
    }
  }, [selected]);

  const toggle = (id: string) =>
    setDraft(d => (d.includes(id) ? d.filter(x => x !== id) : [...d, id]));

  /* ---------- save ----------------------------------------------------- */
  const { mutate, isPending: saving } = useMutation({
    mutationFn: (ids: string[]) => setDentistFeatures(dentistId, ids),
    onSuccess: () => {
      toast.success('Features updated');
      qc.invalidateQueries({ queryKey: ['features', dentistId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  /* ---------- render --------------------------------------------------- */
  if (loadingSel) return <p>Loading features…</p>;

  return (
    <section className="space-y-6 rounded-lg border p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Clinic Facilities</h3>

      {/* pill list */}
      <div className="flex flex-wrap gap-3">
        {all.map(f => {
          const active = draft.includes(f.id);
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => toggle(f.id)}
              className={clsx(
                'flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-sm transition',
                active
                  ? 'border-teal-600 bg-teal-50 text-teal-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              )}
            >
              {active && <Check size={14} />}
              {f.label}
            </button>
          );
        })}
      </div>

      {/* action buttons */}
      <div className="flex gap-3">
        <Button type="button" onClick={() => mutate(draft)} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setDraft(selected || [])}
          disabled={saving}
        >
          Reset
        </Button>
      </div>
    </section>
  );
}
