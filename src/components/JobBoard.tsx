import React, { useMemo, useState } from 'react';
import { Briefcase, Building2, Mail, MapPin, Phone, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { JobType } from '../types';

const labels: Record<JobType, { ar: string; fr: string; en: string }> = {
  full_time: { ar: 'دوام كامل', fr: 'Plein temps', en: 'Full-time' },
  part_time: { ar: 'دوام جزئي', fr: 'Temps partiel', en: 'Part-time' },
  contract: { ar: 'عقد', fr: 'Contrat', en: 'Contract' },
  temporary: { ar: 'مؤقت', fr: 'Temporaire', en: 'Temporary' },
  internship: { ar: 'تدريب', fr: 'Stage', en: 'Internship' }
};

export const JobBoard: React.FC = () => {
  const { jobs, language } = useApp();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'all' | JobType>('all');
  const text = (value: { ar: string; fr: string; en: string }) => value[language] || value.ar;
  const visible = useMemo(() => jobs.filter(job => {
    if (!job.isActive || (type !== 'all' && job.jobType !== type)) return false;
    const haystack = [job.title, job.company, job.sector, job.description]
      .flatMap(value => [value.ar, value.fr, value.en]).join(' ').toLowerCase();
    return haystack.includes(search.trim().toLowerCase());
  }), [jobs, search, type]);

  return <section className="space-y-4">
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-400/15 px-3 py-1 text-xs font-bold text-indigo-200">
            <Briefcase className="h-4 w-4" />
            {language === 'ar' ? 'فرص محلية موثوقة' : language === 'fr' ? 'Opportunités locales vérifiées' : 'Verified local opportunities'}
          </p>
          <h2 className="text-2xl font-black">{language === 'ar' ? 'عروض العمل بمدينة الدروة' : language === 'fr' ? "Offres d'emploi à Deroua" : 'Jobs in Deroua'}</h2>
        </div>
        <a className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold hover:bg-white/20" href="mailto:derouaservices@gmail.com?subject=طلب نشر عرض عمل بمدينة الدروة">
          <Mail className="h-4 w-4" />
          {language === 'ar' ? 'انشر عرض عمل' : language === 'fr' ? 'Publier une offre' : 'Post a job'}
        </a>
      </div>
    </div>

    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-[1fr_auto]">
      <label className="relative">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input aria-label="Search jobs" value={search} onChange={event => setSearch(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 ps-10 pe-3 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder={language === 'ar' ? 'ابحث عن وظيفة أو شركة...' : language === 'fr' ? 'Rechercher un poste...' : 'Search jobs...'} />
      </label>
      <select aria-label="Job type" value={type} onChange={event => setType(event.target.value as 'all' | JobType)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-800">
        <option value="all">{language === 'ar' ? 'كل العقود' : language === 'fr' ? 'Tous les contrats' : 'All types'}</option>
        {(Object.keys(labels) as JobType[]).map(value => <option value={value} key={value}>{labels[value][language]}</option>)}
      </select>
    </div>

    {visible.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
      <Briefcase className="mx-auto mb-3 h-10 w-10 text-slate-400" />
      <p className="font-bold">{language === 'ar' ? 'لا توجد عروض منشورة حالياً.' : language === 'fr' ? 'Aucune offre publiée actuellement.' : 'No jobs are published right now.'}</p>
    </div> : <div className="grid gap-4 md:grid-cols-2">
      {visible.map(job => <article key={job.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div><h3 className="text-lg font-black">{text(job.title)}</h3><p className="mt-1 flex items-center gap-2 text-sm text-slate-500"><Building2 className="h-4 w-4" />{text(job.company)}</p></div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{labels[job.jobType][language]}</span>
        </div>
        <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{text(job.description)}</p>
        <p className="mb-4 flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4" />{text(job.location)}</p>
        <div className="flex flex-wrap gap-2">
          {job.phone && <a href={`tel:${job.phone}`} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white dark:bg-sky-600"><Phone className="h-4 w-4" />{job.phone}</a>}
          {job.email && <a href={`mailto:${job.email}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700"><Mail className="h-4 w-4" />{language === 'ar' ? 'التقديم بالبريد' : 'Apply by email'}</a>}
        </div>
      </article>)}
    </div>}
  </section>;
};
