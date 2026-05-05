-- =========================================
-- Her Clinic — initial seed data
-- Run AFTER 0001_init.sql in the Supabase SQL editor.
-- All cases are inserted unpublished so the site keeps using
-- translation defaults until you upload images and publish them.
-- =========================================

-- Cases (unpublished by default; upload images and publish from /admin/content/cases)
insert into public.before_after_cases
  (slug, title_en, title_ar, description_en, description_ar, position, published)
values
  ('skin', 'Skin Glow Revival', 'إشراقة البشرة',
   'A tailored programme of medical-grade peels and facials that restored a radiant, even complexion in just six weeks.',
   'برنامج مخصص من التقشير والعلاجات الطبية أعاد إشراقة البشرة وتوحيد لونها خلال ستة أسابيع فقط.', 1, false),
  ('lips', 'Lip Enhancement', 'تكبير الشفاه',
   'Soft, balanced lip artistry — adding hydration and definition while keeping a natural, kissable finish.',
   'نحت ناعم ومتوازن للشفاه يضيف الترطيب والامتلاء مع الحفاظ على مظهر طبيعي وأنثوي.', 2, false),
  ('laser', 'Laser Hair Removal', 'إزالة الشعر بالليزر',
   'A complete laser cycle delivering smooth, hair-free skin with comfort and precision.',
   'دورة كاملة من جلسات الليزر لبشرة ناعمة وخالية من الشعر، براحة ودقة عالية.', 3, false),
  ('contour', 'Facial Contouring', 'نحت الوجه',
   'Subtle filler artistry refining facial harmony — lifted cheeks, sculpted jawline and a fresh, rested look.',
   'نحت دقيق بالفيلر يُعيد التوازن للملامح: خدود مرفوعة، خط فك متناسق وإطلالة منتعشة.', 4, false)
on conflict (slug) do nothing;

-- Services
insert into public.services
  (slug, icon, title_en, title_ar, description_en, description_ar, position, published)
values
  ('skincare', 'Droplet', 'Skin Care', 'العناية بالبشرة',
   'Advanced facials, chemical peels, and rejuvenation rituals for a luminous, healthy complexion.',
   'تنظيف عميق، تقشير كيميائي وعلاجات تجديدية لبشرة مشرقة، صحية ومفعمة بالحيوية.', 1, true),
  ('aesthetics', 'Sparkles', 'Aesthetic Treatments', 'علاجات تجميلية',
   'Refined non-surgical enhancements — fillers, Botox and contouring — for results that feel like you, only better.',
   'تحسينات غير جراحية راقية من الفيلر والبوتوكس ونحت الملامح لنتائج طبيعية تشبهكِ تماماً.', 2, true),
  ('laser', 'Zap', 'Laser Treatments', 'علاجات الليزر',
   'State-of-the-art laser technologies for hair removal, skin resurfacing and even-toned radiance.',
   'أحدث تقنيات الليزر لإزالة الشعر، تجديد سطح البشرة وتوحيد لونها بأمان وراحة.', 3, true),
  ('wellness', 'Leaf', 'Wellness Programs', 'برامج العافية',
   'Holistic wellness journeys with nutrition guidance and IV vitamin therapies that nourish from within.',
   'رحلات عافية متكاملة تشمل الإرشاد الغذائي والعلاج بالفيتامينات لتغذي جمالكِ من الداخل.', 4, true),
  ('body', 'Activity', 'Body Treatments', 'علاجات الجسم',
   'Body sculpting, cellulite refinement and slimming protocols for a silhouette you''ll love.',
   'نحت الجسم، تقليل السيلوليت وعلاجات تنحيف لتحصلي على القوام الذي تحلمين به.', 5, true),
  ('hair', 'Scissors', 'Hair Treatments', 'علاجات الشعر',
   'PRP, mesotherapy and restorative hair rituals to revive density, shine and vitality.',
   'البلازما، الميزوثيرابي وعلاجات استعادة الشعر لكثافة ولمعان وحيوية مذهلة.', 6, true)
on conflict (slug) do nothing;

-- Testimonials
insert into public.testimonials
  (name, role_en, role_ar, quote_en, quote_ar, rating, position, published)
values
  ('Yasmine A.', 'Skin & Lips', 'بشرة وشفاه',
   'Dr. Reham didn''t just enhance my features — she made me feel like the most confident version of myself. The clinic feels like a sanctuary.',
   'الدكتورة ريهام لم تجعلني أبدو أجمل فحسب، بل جعلتني أشعر بأفضل نسخة من نفسي. العيادة كأنها واحة من الفخامة والاحتواء.', 5, 1, true),
  ('Layla M.', 'Aesthetic Treatments', 'علاجات تجميلية',
   'I''ve never trusted a clinic so deeply. Every detail is luxurious, every result is natural. Truly an artist.',
   'لم أثق بعيادة بهذا العمق من قبل. كل تفصيلة فاخرة، وكل نتيجة طبيعية. حقاً فنانة في عملها.', 5, 2, true),
  ('Nour H.', 'Wellness & Skin', 'عافية وبشرة',
   'The before-and-after speaks for itself, but the experience is what made me a forever client. Pure elegance.',
   'صور قبل وبعد تتحدث عن نفسها، لكن التجربة هي ما جعلني عميلة دائمة. أناقة خالصة.', 5, 3, true);

-- Site settings
insert into public.site_settings (key, value) values
  ('branding', '{"logo_url":"/logo.svg","logo_mark_url":"/logo-mark.svg"}'::jsonb),
  ('contact_info', '{"phone":"+20 123 456 7890","email":"info@drrehammohamed.com","location_en":"Cairo, Egypt","location_ar":"القاهرة، مصر"}'::jsonb),
  ('working_hours', '{"en":"Sat – Thu · 10:00 AM – 8:00 PM","ar":"السبت – الخميس · ١٠:٠٠ صباحاً – ٨:٠٠ مساءً"}'::jsonb),
  ('social_links', '{"instagram":"","facebook":"","whatsapp":"","email":"mailto:info@drrehammohamed.com"}'::jsonb)
on conflict (key) do nothing;
