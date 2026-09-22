import { useEffect, useState } from 'react';
import { servicesApi } from '../lib/firebase';
import { useApp } from '../context/AppContext';
import type { ServiceItem } from '../types';

export function GuardDutyEditor() {
  const { language, refreshData } = useApp();
  const [pharmacies, setPharmacies] = useState<ServiceItem[]>([]);
  const [id, setId] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [source, setSource] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const ar = language === 'ar';
  useEffect(() => {
    let active = true;
    servicesApi.getAll(true).then(items => {
      if (active) setPharmacies(items.filter(item => item.category === 'pharmacy' && item.status === 'approved'));
    }).catch(() => { if (active) setMessage(ar ? 'تعذر تحميل الصيدليات.' : 'Could not load pharmacies.'); });
    return () => { active = false; };
  }, [ar]);
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true); setMessage('');
    try {
      await servicesApi.updateGuard(id, new Date(start).toISOString(), new Date(end).toISOString(), source);
      await refreshData();
      setMessage(ar ? 'تم حفظ فترة الحراسة ومصدرها.' : 'Duty period and source saved.');
    } catch {
      setMessage(ar ? 'تعذر الحفظ. تحقق من الفترة والصلاحيات والاتصال.' : 'Save failed. Check dates, permissions and connection.');
    } finally { setSaving(false); }
  }
  return <details className="border-b p-3 shrink-0 max-h-72 overflow-auto">
    <summary className="cursor-pointer font-bold">{ar ? 'إدارة جدول حراسة الصيدليات' : 'Pharmacy duty schedule'}</summary>
    <form onSubmit={save} className="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
      <label>{ar ? 'الصيدلية المعتمدة' : 'Approved pharmacy'}
        <select required value={id} onChange={event => setId(event.target.value)} className="block border rounded p-2 w-full bg-white text-slate-900">
          <option value="">{ar ? 'اختر صيدلية' : 'Select a pharmacy'}</option>
          {pharmacies.map(item => <option key={item.id} value={item.id}>{item.name[language]}</option>)}
        </select>
      </label>
      <label>{ar ? 'مصدر تأكيد الحراسة' : 'Duty confirmation source'}
        <input required value={source} onChange={event => setSource(event.target.value)} className="block border rounded p-2 w-full bg-white text-slate-900" />
      </label>
      <label>{ar ? 'بداية الحراسة (توقيت جهازك)' : 'Start (your device time)'}
        <input required type="datetime-local" value={start} onChange={event => setStart(event.target.value)} className="block border rounded p-2 w-full bg-white text-slate-900" />
      </label>
      <label>{ar ? 'نهاية الحراسة (توقيت جهازك)' : 'End (your device time)'}
        <input required type="datetime-local" value={end} onChange={event => setEnd(event.target.value)} className="block border rounded p-2 w-full bg-white text-slate-900" />
      </label>
      {!pharmacies.length && <p>{ar ? 'أضف الصيدلية إلى قاعدة البيانات واعتمدها أولًا؛ سجلات الدليل الثابت لا تتغير من هذه اللوحة.' : 'Add and approve a database pharmacy first. Static directory entries are managed in source.'}</p>}
      <button disabled={saving || !id} className="p-2 rounded bg-sky-600 text-white disabled:opacity-50">{ar ? 'حفظ الجدول' : 'Save schedule'}</button>
      {message && <p role="status">{message}</p>}
    </form>
  </details>;
}
