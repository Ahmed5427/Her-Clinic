-- =========================================
-- Her Clinic — chatbot + FAQ
-- Apply AFTER 0001_init.sql in the Supabase SQL editor.
-- =========================================

-- =========================================
-- faq
-- =========================================
create table if not exists public.faq (
  id           uuid primary key default uuid_generate_v4(),
  question_en  text not null,
  question_ar  text not null,
  answer_en    text not null,
  answer_ar    text not null,
  position     int not null default 0,
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_faq_position on public.faq(position);

drop trigger if exists trg_faq_touch on public.faq;
create trigger trg_faq_touch before update on public.faq
  for each row execute procedure public.touch_updated_at();

alter table public.faq enable row level security;

drop policy if exists faq_public_read on public.faq;
create policy faq_public_read on public.faq
  for select using (published = true or public.is_admin());

drop policy if exists faq_admin_write on public.faq;
create policy faq_admin_write on public.faq
  for all using (public.is_admin()) with check (public.is_admin());

-- =========================================
-- Default chatbot settings (stored in site_settings as JSON)
-- Key: 'chatbot' — { enabled, greeting_en, greeting_ar, persona_en,
--                    persona_ar, suggested_en[], suggested_ar[] }
-- =========================================
insert into public.site_settings (key, value) values
  ('chatbot', '{
    "enabled": true,
    "greeting_en": "Hi, beautiful! I''m Reham — Dr. Reham''s clinic concierge. Ask me anything about treatments, results, prices, or booking.",
    "greeting_ar": "أهلاً يا جميلة! أنا ريهام، الكونسيرج الرقمي لعيادة د. ريهام. اسأليني عن أي علاج، نتائج، أسعار أو حجز.",
    "persona_en": "You are a warm, elegant beauty concierge for Dr. Reham Mohamed''s clinic. Tone: refined, feminine, supportive. Always answer briefly (2–4 sentences) unless the user asks for detail. Encourage booking a consultation when appropriate.",
    "persona_ar": "أنتِ كونسيرج جمالي راقي لعيادة الدكتورة ريهام محمد. النبرة: راقية، أنثوية، داعمة. أجيبي بإيجاز (٢-٤ جمل) إلا إذا طلبت العميلة التفصيل. شجعيها على حجز استشارة عند المناسبة.",
    "suggested_en": [
      "What services do you offer?",
      "How much does laser hair removal cost?",
      "What are your working hours?",
      "Can I see before & after results?"
    ],
    "suggested_ar": [
      "ما هي الخدمات المتوفرة؟",
      "كم تكلفة إزالة الشعر بالليزر؟",
      "ما هي ساعات العمل؟",
      "هل يمكنني رؤية نتائج قبل وبعد؟"
    ]
  }'::jsonb)
on conflict (key) do nothing;

-- Seed example FAQ rows (admin can edit / add more)
insert into public.faq (question_en, question_ar, answer_en, answer_ar, position, published)
values
  (
    'Do you offer free consultations?',
    'هل تقدمون استشارة مجانية؟',
    'Yes — your first consultation with Dr. Reham is complimentary. Book through the contact form or WhatsApp.',
    'نعم — الاستشارة الأولى مع الدكتورة ريهام مجانية. احجزي عبر نموذج التواصل أو واتساب.',
    1, true
  ),
  (
    'How long does a typical treatment take?',
    'كم تستغرق الجلسة العادية؟',
    'Most aesthetic and skin treatments take between 30 and 60 minutes, including the consultation.',
    'معظم جلسات التجميل والبشرة تستغرق بين ٣٠ و٦٠ دقيقة شاملةً الاستشارة.',
    2, true
  ),
  (
    'Are the results natural?',
    'هل النتائج طبيعية؟',
    'Absolutely. Dr. Reham specializes in subtle, natural-looking results that enhance — never change — your features.',
    'بالتأكيد. الدكتورة ريهام متخصصة في نتائج طبيعية ناعمة تُبرز ملامحك دون تغييرها.',
    3, true
  )
on conflict do nothing;
