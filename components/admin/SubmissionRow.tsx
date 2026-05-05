'use client';

import { useState, useTransition } from 'react';
import { Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import {
  updateSubmissionStatus,
  updateSubmissionNotes,
  deleteSubmission,
} from '@/app/admin/_actions/submissions';
import type { ContactSubmission, SubmissionStatus } from '@/lib/supabase/types';
import { formatDate } from '@/lib/utils';

interface Props {
  row: ContactSubmission;
}

export default function SubmissionRow({ row }: Props) {
  const [status, setStatus] = useState<SubmissionStatus>(row.status);
  const [notes, setNotes] = useState(row.notes ?? '');
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <tr>
        <td className="text-[var(--admin-muted)] text-xs whitespace-nowrap">
          {formatDate(row.created_at)}
        </td>
        <td className="font-medium">{row.name}</td>
        <td className="text-sm">
          <div>
            <a href={`mailto:${row.email}`} className="hover:text-[var(--admin-accent)]">
              {row.email}
            </a>
          </div>
          {row.phone ? (
            <div className="text-xs text-[var(--admin-muted)]">
              <a href={`tel:${row.phone}`} className="hover:text-[var(--admin-accent)]">
                {row.phone}
              </a>
            </div>
          ) : null}
        </td>
        <td className="text-sm">{row.service ?? '—'}</td>
        <td>
          <select
            value={status}
            onChange={(e) => {
              const next = e.target.value as SubmissionStatus;
              setStatus(next);
              startTransition(async () => {
                const r = await updateSubmissionStatus(row.id, next);
                if ('error' in r) toast.error(r.error);
                else toast.success('Status updated');
              });
            }}
            disabled={pending}
            className={`admin-pill admin-pill-${status} cursor-pointer border-0 outline-none bg-transparent`}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="archived">Archived</option>
          </select>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen((o) => !o)}
              className="admin-btn-secondary text-xs px-2 py-1"
            >
              {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                if (!confirm('Delete this submission?')) return;
                startTransition(async () => {
                  const r = await deleteSubmission(row.id);
                  if ('error' in r) toast.error(r.error);
                  else toast.success('Submission deleted');
                });
              }}
              disabled={pending}
              className="admin-btn-danger text-xs px-2 py-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
      {open ? (
        <tr>
          <td colSpan={6} className="bg-stone-50/60">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div>
                <div className="admin-label">Message</div>
                <div className="text-sm whitespace-pre-wrap text-[var(--admin-ink)]/80">
                  {row.message?.trim() || <span className="italic text-[var(--admin-muted)]">No message</span>}
                </div>
                <div className="mt-3 text-xs text-[var(--admin-muted)]">
                  Locale: <span className="font-medium">{row.locale.toUpperCase()}</span>
                </div>
              </div>
              <div>
                <label className="admin-label" htmlFor={`notes-${row.id}`}>Internal notes</label>
                <textarea
                  id={`notes-${row.id}`}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="admin-input"
                />
                <button
                  onClick={() =>
                    startTransition(async () => {
                      const r = await updateSubmissionNotes(row.id, notes);
                      if ('error' in r) toast.error(r.error);
                      else toast.success('Notes saved');
                    })
                  }
                  disabled={pending}
                  className="admin-btn-primary text-sm mt-2"
                >
                  <Save className="w-4 h-4" /> Save notes
                </button>
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
