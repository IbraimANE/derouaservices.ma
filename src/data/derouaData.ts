import { ServiceItem, NoticeItem, TransportRoute } from '../types.ts';

export const DEROUA_NEIGHBORHOODS = [
  { id: 'all', ar: 'كل الأحياء', fr: 'Tous les quartiers', en: 'All neighborhoods' },
  { id: 'centre', ar: 'مركز الدروة', fr: 'Deroua Centre', en: 'Deroua Center' },
  { id: 'wifaq', ar: 'حي الوفاق', fr: 'Hay Al Wifaq', en: 'Al Wifaq' },
  { id: 'amal', ar: 'حي الأمل', fr: 'Hay Al Amal', en: 'Al Amal' },
  { id: 'nassim', ar: 'حي النسيم', fr: 'Hay An-Nassim', en: 'An-Nassim' },
  { id: 'kasbah', ar: 'حي القصبة', fr: 'Hay Kasbah', en: 'Kasbah' },
  { id: 'jnane', ar: 'جنان الدروة', fr: 'Jnane Deroua', en: 'Jnane Deroua' },
  { id: 'saada', ar: 'حي السعادة', fr: 'Hay Saada', en: 'Saada' },
  { id: 'airport_zone', ar: 'منطقة المطار / النواصر', fr: 'Zone Aéroport / Nouaceur', en: 'Airport Area' }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  // Emergencies
  {
    id: 'emg-ambulance-deroua',
    category: 'emergency',
    name: {
      ar: 'خدمة الإسعاف جماعة الدروة',
      fr: 'Ambulance - Commune de Deroua',
      en: 'Ambulance - Deroua Municipality'
    },
    tradeOrRole: {
      ar: 'عبد العالي: 0666752258 | عبد الرزاق: 0660625487 | توفيق: 0626056477',
      fr: 'Abdelali: 0666752258 | Abdelrazzak: 0660625487 | Toufik: 0626056477',
      en: 'Abdelali: 0666752258 | Abdelrazzak: 0660625487 | Toufik: 0626056477'
    },
    phone: '0666752258',
    secondaryPhone: '0660625487',
    whatsapp: '212626056477',
    address: {
      ar: 'مقر جماعة الدروة، إقليم برشيد',
      fr: 'Commune Urbaine de Deroua, Province de Berrechid',
      en: 'Deroua Municipality, Berrechid'
    },
    neighborhood: {
      ar: 'مركز الدروة',
      fr: 'Deroua Centre',
      en: 'Deroua Center'
    },
    is24_7: true,
    isOpenNow: true,
    isEmergency: true,
    verified: true,
    description: {
      ar: 'خدمة سيارة الإسعاف التابعة لجماعة الدروة لنقل المرضى والحالات المستعجلة (عبد العالي: 0666752258 / عبد الرزاق: 0660625487 / توفيق: 0626056477)',
      fr: 'Service d\'ambulance municipale (Abdelali: 0666752258 / Abdelrazzak: 0660625487 / Toufik: 0626056477)',
      en: 'Deroua Municipal Ambulance Service (Abdelali: 0666752258 / Abdelrazzak: 0660625487 / Toufik: 0626056477)'
    },
    workingHours: { ar: 'متاح 24/24', fr: '24h/24', en: '24/7' }
  },
  {
    id: 'emg-1',
    category: 'emergency',
    name: {
      ar: 'الوقاية المدنية (رجال الإطفاء والإسعاف)',
      fr: 'Protection Civile (Pompiers & Ambulance)',
      en: 'Civil Protection (Firefighters & Ambulance)'
    },
    tradeOrRole: {
      ar: 'طوارئ وإسعافات مستعجلة',
      fr: 'Urgences secours',
      en: 'Emergency Services'
    },
    phone: '15',
    secondaryPhone: '0522337325',
    address: {
      ar: 'شارع الحسن الثاني، مدخل الدروة',
      fr: 'Boulevard Hassan II, Entrée de Deroua',
      en: 'Hassan II Blvd, Deroua Entrance'
    },
    neighborhood: {
      ar: 'مركز الدروة',
      fr: 'Deroua Centre',
      en: 'Deroua Center'
    },
    is24_7: true,
    isOpenNow: true,
    isEmergency: true,
    verified: true,
    description: {
      ar: 'خدمة التدخل السريع في حالات الحوادث، الحرائق، والإسعاف المستعجل على مدار 24 ساعة.',
      fr: 'Interventions d\'urgence incendies, accidents et secours médicaux 24h/24.',
      en: 'Rapid response for accidents, fires, and urgent medical emergencies 24/7.'
    },
    workingHours: { ar: 'متاح 24/24 - طيلة أيام الأسبوع', fr: '24h/24 - 7j/7', en: '24/7 Open' },
    mapQuery: 'Protection Civile Deroua'
  },
  {
    id: 'emg-2',
    category: 'emergency',
    name: {
      ar: 'مركز الدرك الملكي بالدروة',
      fr: 'Gendarmerie Royale Deroua',
      en: 'Royal Gendarmerie Deroua'
    },
    tradeOrRole: {
      ar: 'الأمن والسلامة العمومية',
      fr: 'Sécurité publique',
      en: 'Public Safety'
    },
    phone: '177',
    secondaryPhone: '0522530018',
    address: {
      ar: 'الطريق الوطنية رقم 9، الدروة',
      fr: 'Route Nationale 9 (RN9), Deroua',
      en: 'National Road 9, Deroua'
    },
    neighborhood: {
      ar: 'مركز الدروة',
      fr: 'Deroua Centre',
      en: 'Deroua Center'
    },
    is24_7: true,
    isOpenNow: true,
    isEmergency: true,
    verified: true,
    description: {
      ar: 'حفظ الأمن، استقبال الشكايات، التدخلات الفورية ودوريات السلامة بالدروة والنواحي.',
      fr: 'Maintien de l\'ordre, plaintes citoyennes, interventions immédiates et sécurité.',
      en: 'Law enforcement, complaint registration, and 24/7 patrol response.'
    },
    workingHours: { ar: 'مفتوح 24/24', fr: '24h/24', en: '24/7' },
    mapQuery: 'Gendarmerie Royale Deroua'
  },

  // Pharmacies
  {
    id: 'ph-1',
    category: 'pharmacy',
    name: {
      ar: 'صيدلية الوفاق',
      fr: 'Pharmacie Al Wifaq',
      en: 'Al Wifaq Pharmacy'
    },
    tradeOrRole: {
      ar: 'صيدلية',
      fr: 'Pharmacie',
      en: 'Pharmacy'
    },
    phone: '0522532411',
    whatsapp: '212660123456',
    address: {
      ar: 'شارع محمد السادس، تجزئة الوفاق رقم 42',
      fr: 'Bd Mohammed VI, Lotissement Al Wifaq N°42',
      en: 'Mohammed VI Blvd, Al Wifaq Lot 42'
    },
    neighborhood: {
      ar: 'حي الوفاق',
      fr: 'Hay Al Wifaq',
      en: 'Al Wifaq'
    },
    is24_7: false,
    isOpenNow: false,
    isGuardPharmacy: false,
    rating: 4.8,
    reviewsCount: 34,
    verified: true,
    description: {
      ar: 'أدوية، مستلزمات طبية، وقياس الضغط والسكر.',
      fr: 'Médicaments et matériel médical.',
      en: 'Full medication and medical supplies.'
    },
    workingHours: { ar: 'اتصل للتحقق من المواعيد', fr: 'Appelez pour confirmer les horaires', en: 'Call to confirm opening hours' },
    mapQuery: 'Pharmacie Al Wifaq Deroua'
  },
  {
    id: 'ph-2',
    category: 'pharmacy',
    name: {
      ar: 'صيدلية الدروة المركزية',
      fr: 'Pharmacie Centrale Deroua',
      en: 'Deroua Central Pharmacy'
    },
    tradeOrRole: {
      ar: 'صيدلية',
      fr: 'Pharmacie',
      en: 'Pharmacy'
    },
    phone: '0522530489',
    address: {
      ar: 'الطريق الرئيسية قبالة مقر الجماعة، الدروة',
      fr: 'Route Principale face à la Commune, Deroua',
      en: 'Main Road opposite City Hall, Deroua'
    },
    neighborhood: {
      ar: 'مركز الدروة',
      fr: 'Deroua Centre',
      en: 'Deroua Center'
    },
    is24_7: false,
    isOpenNow: true,
    rating: 4.6,
    reviewsCount: 28,
    verified: true,
    workingHours: { ar: '08:30 - 21:00 (الإثنين - السبت)', fr: '08:30 - 21:00 (Lun - Sam)', en: '08:30 - 21:00 (Mon - Sat)' },
    description: {
      ar: 'أقدم صيدلية بالدروة، مخزون كامل من الأدوية، استشارات صيدلانية ومكملات غذائية.',
      fr: 'Grande pharmacie centrale, large choix de médicaments, parapharmacie et conseils.',
      en: 'Major central pharmacy, comprehensive prescriptions and healthcare goods.'
    }
  },
  {
    id: 'ph-3',
    category: 'pharmacy',
    name: {
      ar: 'صيدلية الأمل',
      fr: 'Pharmacie Al Amal',
      en: 'Al Amal Pharmacy'
    },
    tradeOrRole: {
      ar: 'صيدلية',
      fr: 'Pharmacie',
      en: 'Pharmacy'
    },
    phone: '0522531280',
    address: {
      ar: 'تجزئة الأمل 2، زنقة 14 رقم 19',
      fr: 'Lotissement Al Amal 2, Rue 14 N°19',
      en: 'Al Amal 2, Street 14 No. 19'
    },
    neighborhood: {
      ar: 'حي الأمل',
      fr: 'Hay Al Amal',
      en: 'Al Amal'
    },
    is24_7: false,
    isOpenNow: true,
    rating: 4.7,
    reviewsCount: 19,
    verified: true,
    workingHours: { ar: '09:00 - 21:30', fr: '09:00 - 21:30', en: '09:00 - 21:30' }
  },
  {
    id: 'ph-4',
    category: 'pharmacy',
    name: {
      ar: 'صيدلية النسيم',
      fr: 'Pharmacie An-Nassim',
      en: 'An-Nassim Pharmacy'
    },
    tradeOrRole: {
      ar: 'صيدلية',
      fr: 'Pharmacie',
      en: 'Pharmacy'
    },
    phone: '0522534590',
    address: {
      ar: 'شارع النصر، إقامة النسيم، الدروة',
      fr: 'Avenue Annasr, Résidence Annassim',
      en: 'Annasr Ave, Annassim Residence'
    },
    neighborhood: {
      ar: 'حي النسيم',
      fr: 'Hay An-Nassim',
      en: 'An-Nassim'
    },
    is24_7: false,
    isOpenNow: false,
    rating: 4.5,
    reviewsCount: 15,
    verified: true,
    workingHours: { ar: '09:00 - 21:00', fr: '09:00 - 21:00', en: '09:00 - 21:00' }
  },

  // Healthcare
  {
    id: 'hlth-1',
    category: 'health',
    name: {
      ar: 'المركز الصحي الحضري بالدروة',
      fr: 'Centre de Santé Urbain Deroua',
      en: 'Deroua Urban Health Center'
    },
    tradeOrRole: {
      ar: 'مركز صحي عمومي ومستوصف',
      fr: 'Dispensaire & Soins de base',
      en: 'Public Clinic & Basic Care'
    },
    phone: '0522531022',
    address: {
      ar: 'قرب دار الشباب ومقر الباشوية، الدروة',
      fr: 'Près de la Maison des Jeunes, Deroua',
      en: 'Near Youth Center, Deroua'
    },
    neighborhood: {
      ar: 'مركز الدروة',
      fr: 'Deroua Centre',
      en: 'Deroua Center'
    },
    is24_7: false,
    isOpenNow: true,
    verified: true,
    description: {
      ar: 'تلقيح الأطفال، متابعة الحوامل، استشارات الطب العام، وتوزيع أدوية الأمراض المزمنة (السكري والضغط).',
      fr: 'Vaccinations, consultations médecine générale, suivi de grossesse et maladies chroniques.',
      en: 'Childhood vaccines, maternal care, general consultations, and chronic disease medication.'
    },
    workingHours: { ar: '08:30 - 16:30 (الإثنين - الجمعة)', fr: '08:30 - 16:30 (Lun - Ven)', en: '08:30 - 16:30 (Mon - Fri)' }
  },
  {
    id: 'hlth-2',
    category: 'health',
    name: {
      ar: 'د. خالد التازي - طب عام ومستعجلات',
      fr: 'Dr. Khalid Tazi - Médecin Généraliste',
      en: 'Dr. Khalid Tazi - General Practitioner'
    },
    tradeOrRole: {
      ar: 'طبيب عام',
      fr: 'Médecine générale',
      en: 'General Practice'
    },
    phone: '0522533321',
    whatsapp: '212670112233',
    address: {
      ar: 'عمارة النخيل، الطابق الأول، شارع محمد السادس',
      fr: 'Immeuble Ennakhil, 1er étage, Bd Mohammed VI',
      en: 'Ennakhil Bldg, 1st Floor, Mohammed VI Blvd'
    },
    neighborhood: {
      ar: 'حي الوفاق',
      fr: 'Hay Al Wifaq',
      en: 'Al Wifaq'
    },
    is24_7: false,
    isOpenNow: true,
    rating: 4.9,
    reviewsCount: 42,
    verified: true,
    description: {
      ar: 'فحص البالغين والأطفال، تخطيط القلب، شهادات طبية، ومتابعة الأمراض الحادة والمزمنة.',
      fr: 'Consultations adultes et pédiatriques, ECG, certificats et suivi médical.',
      en: 'Adult and pediatric care, ECG, medical certificates, and acute care.'
    },
    workingHours: { ar: '09:00 - 19:00', fr: '09:00 - 19:00', en: '09:00 - 19:00' }
  },
  {
    id: 'hlth-3',
    category: 'health',
    name: {
      ar: 'د. مريم الناصري - جراحة وطب الأسنان',
      fr: 'Dr. Meryem Naciri - Chirurgien Dentiste',
      en: 'Dr. Meryem Naciri - Dental Surgeon'
    },
    tradeOrRole: {
      ar: 'طبيبة أسنان',
      fr: 'Chirurgien-dentiste',
      en: 'Dentist'
    },
    phone: '0522534412',
    address: {
      ar: 'شارع الجيش الملكي، عمارة السلام رقم 8',
      fr: 'Avenue des FAR, Immeuble Essalam N°8',
      en: 'FAR Ave, Essalam Bldg No. 8'
    },
    neighborhood: {
      ar: 'مركز الدروة',
      fr: 'Deroua Centre',
      en: 'Deroua Center'
    },
    is24_7: false,
    isOpenNow: true,
    rating: 4.8,
    reviewsCount: 31,
    verified: true,
    workingHours: { ar: '09:00 - 18:30', fr: '09:00 - 18:30', en: '09:00 - 18:30' }
  },
  {
    id: 'hlth-4',
    category: 'health',
    name: {
      ar: 'مختبر التحاليل الطبية الدروة',
      fr: 'Laboratoire d\'Analyses Médicales Deroua',
      en: 'Deroua Medical Analysis Laboratory'
    },
    tradeOrRole: {
      ar: 'مختبر تحاليل',
      fr: 'Laboratoire d\'analyses',
      en: 'Clinical Laboratory'
    },
    phone: '0522532299',
    address: {
      ar: 'مدار الطريق الوطنية قبالة البنك الشعبي',
      fr: 'Rond-point RN9, face à Banque Populaire',
      en: 'RN9 Roundabout, opposite Banque Populaire'
    },
    neighborhood: {
      ar: 'مركز الدروة',
      fr: 'Deroua Centre',
      en: 'Deroua Center'
    },
    is24_7: false,
    isOpenNow: true,
    rating: 4.7,
    reviewsCount: 22,
    verified: true,
    workingHours: { ar: '07:30 - 17:00 (السبت 07:30 - 13:00)', fr: '07:30 - 17:00 (Sam 07:30 - 13:00)', en: '07:30 - 17:00 (Sat 07:30 - 13:00)' }
  },

  // Artisans & Home Services
  {
    id: 'art-1',
    category: 'artisan',
    name: {
      ar: 'المعلم حسن العمراني - ترصيص صحي وسخانات',
      fr: 'Hassan El Amrani - Plomberie & Chauffage',
      en: 'Hassan El Amrani - Plumbing & Heating'
    },
    tradeOrRole: {
      ar: 'ترصيص صحي (بلومبيي)',
      fr: 'Plombier sanitaire',
      en: 'Plumber'
    },
    phone: '0661984512',
    whatsapp: '212661984512',
    address: {
      ar: 'حي الوفاق، زنقة الأدارسة، الدروة',
      fr: 'Hay Al Wifaq, Rue des Idrissides',
      en: 'Al Wifaq, Idrissides St'
    },
    neighborhood: {
      ar: 'حي الوفاق',
      fr: 'Hay Al Wifaq',
      en: 'Al Wifaq'
    },
    is24_7: true,
    isOpenNow: true,
    isEmergency: true,
    rating: 4.9,
    reviewsCount: 57,
    verified: true,
    description: {
      ar: 'إصلاح تسربات المياه العاجلة، تركيب سخانات الماء، تسريح البالوعات، وتركيب الحمامات والمطابخ.',
      fr: 'Dépannage fuites d\'eau 24/7, chauffe-eaux, débouchage et installations sanitaires.',
      en: '24/7 emergency water leak repair, water heaters, and sanitary installations.'
    },
    workingHours: { ar: 'تدخلات عاجلة 24/24', fr: 'Urgences 24h/24', en: '24/7 Urgent service' }
  },
  {
    id: 'art-2',
    category: 'artisan',
    name: {
      ar: 'المعلم يوسف برادة - كهرباء منزلية وصناعية',
      fr: 'Youssef Berrada - Électricité Générale',
      en: 'Youssef Berrada - Electrician'
    },
    tradeOrRole: {
      ar: 'كهربائي (إلكتريسيان)',
      fr: 'Électricien bâtiment',
      en: 'Electrician'
    },
    phone: '0663456789',
    whatsapp: '212663456789',
    address: {
      ar: 'حي الأمل، قرب مدرسة النخيل',
      fr: 'Hay Al Amal, près de l\'école Ennakhil',
      en: 'Hay Al Amal, near Ennakhil school'
    },
    neighborhood: {
      ar: 'حي الأمل',
      fr: 'Hay Al Amal',
      en: 'Al Amal'
    },
    is24_7: false,
    isOpenNow: true,
    rating: 4.8,
    reviewsCount: 41,
    verified: true,
    description: {
      ar: 'إصلاح انقطاع التيار، تجديد شبكات الكهرباء، تركيب لوحات التوزيع والأضواء الليد والإنترفون.',
      fr: 'Dépannage court-circuit, rénovation réseau électrique, disjoncteurs et interphones.',
      en: 'Circuit repair, rewiring, breaker boxes, LED lighting, and interphone.'
    },
    workingHours: { ar: '08:00 - 20:00', fr: '08:00 - 20:00', en: '08:00 - 20:00' }
  },
  {
    id: 'art-3',
    category: 'artisan',
    name: {
      ar: 'ورشة الأمل للألمنيوم والنجارة العصرية',
      fr: 'Atelier Al Amal - Aluminium & Menuiserie',
      en: 'Al Amal Aluminium & Carpentry'
    },
    tradeOrRole: {
      ar: 'ألمنيوم ونجارة عصرية',
      fr: 'Menuiserie alu & PVC',
      en: 'Aluminium & PVC Windows'
    },
    phone: '0665123478',
    whatsapp: '212665123478',
    address: {
      ar: 'الحي الصناعي الحرفي، طريق برشيد، الدروة',
      fr: 'Zone Artisanale, Route de Berrechid',
      en: 'Crafts Zone, Berrechid Road'
    },
    neighborhood: {
      ar: 'مركز الدروة',
      fr: 'Deroua Centre',
      en: 'Deroua Center'
    },
    is24_7: false,
    isOpenNow: true,
    rating: 4.7,
    reviewsCount: 29,
    verified: true,
    description: {
      ar: 'تفصيل وتركيب نوافذ وأبواب الألمنيوم، الستائر الكهربائية (Rideaux)، والمطابخ العصرية.',
      fr: 'Fabrication fenêtres alu, volets roulants électriques et placards de cuisine.',
      en: 'Custom aluminum windows, electric shutters, and fitted kitchen cabinets.'
    },
    workingHours: { ar: '08:30 - 19:30', fr: '08:30 - 19:30', en: '08:30 - 19:30' }
  },
  {
    id: 'art-4',
    category: 'artisan',
    name: {
      ar: 'رشيد للأقفال وفتح الأبواب العالقّة 24/24',
      fr: 'Rachid Serrurerie Express (Dépannage 24/7)',
      en: 'Rachid Locksmith Express 24/7'
    },
    tradeOrRole: {
      ar: 'أقفال ومفاتيح (سيروريي)',
      fr: 'Serrurier dépanneur',
      en: 'Emergency Locksmith'
    },
    phone: '0662778899',
    whatsapp: '212662778899',
    address: {
      ar: 'تنقل فوري لجميع أحياء الدروة والنواصر',
      fr: 'Intervention mobile rapide sur tout Deroua',
      en: 'Mobile service across Deroua & Nouaceur'
    },
    neighborhood: {
      ar: 'حي النسيم',
      fr: 'Hay An-Nassim',
      en: 'An-Nassim'
    },
    is24_7: true,
    isOpenNow: true,
    isEmergency: true,
    rating: 4.9,
    reviewsCount: 38,
    verified: true,
    description: {
      ar: 'فتح الأبواب المغلقة والمصفحة دون إتلاف، تغيير الكوالين، ونسخ المفاتيح المشفرة.',
      fr: 'Ouverture de portes claquées ou blindées sans dégât, changement de cylindres 24h/24.',
      en: 'Non-destructive door unlocking, lock replacements, emergency access 24/7.'
    },
    workingHours: { ar: 'متاح 24/24', fr: '24h/24', en: '24/7' }
  },
  {
    id: 'art-5',
    category: 'artisan',
    name: {
      ar: 'إغاثة وسحب السيارات على الطريق الوطنية 9 (الديباناج)',
      fr: 'Dépannage & Remorquage Auto RN9 Deroua',
      en: 'Deroua RN9 Auto Towing Service'
    },
    tradeOrRole: {
      ar: 'سحب وإغاثة السيارات (ديباناج)',
      fr: 'Remorquage auto 24/7',
      en: 'Car Towing & Roadside Aid'
    },
    phone: '0661554433',
    whatsapp: '212661554433',
    address: {
      ar: 'مفترق الدروة - المطار - الطريق السيار',
      fr: 'Échangeur Deroua - Aéroport Mohammed V',
      en: 'Deroua - Airport Interchange'
    },
    neighborhood: {
      ar: 'منطقة المطار / النواصر',
      fr: 'Zone Aéroport / Nouaceur',
      en: 'Airport Area'
    },
    is24_7: true,
    isOpenNow: true,
    isEmergency: true,
    rating: 4.8,
    reviewsCount: 46,
    verified: true,
    description: {
      ar: 'شاحنات إغاثة مجهزة لنقل السيارات المعطلة وحوادث السير على الطريق الوطنية وطريق المطار.',
      fr: 'Dépanneuses rapides pour pannes et accidents sur RN9 et axe aéroport.',
      en: 'Tow trucks ready for breakdowns and accident recovery on RN9 and airport routes.'
    },
    workingHours: { ar: '24/24 طيلة الأسبوع', fr: '24h/24 - 7j/7', en: '24/7 Service' }
  },

  // Municipal & Administration
  {
    id: 'mun-1',
    category: 'municipal',
    name: {
      ar: 'مقر جماعة الدروة (البلدية)',
      fr: 'Commune Urbaine de Deroua',
      en: 'Deroua Municipal Council'
    },
    tradeOrRole: {
      ar: 'إدارة محلية ومصالح عمومية',
      fr: 'Administration communale',
      en: 'City Hall'
    },
    phone: '0522530044',
    address: {
      ar: 'شارع الاستقلال، وسط مدينة الدروة',
      fr: 'Avenue de l\'Indépendance, Centre Deroua',
      en: 'Independence Ave, Deroua Center'
    },
    neighborhood: {
      ar: 'مركز الدروة',
      fr: 'Deroua Centre',
      en: 'Deroua Center'
    },
    is24_7: false,
    isOpenNow: true,
    verified: true,
    description: {
      ar: 'الحالة المدنية، تصحيح الإمضاءات، مطابقة النسخ، رخص البناء والتعمير، والشؤون الاجتماعية.',
      fr: 'État civil, légalisation de signatures, permis de construire et services municipaux.',
      en: 'Civil status, document legalization, construction permits, and municipal services.'
    },
    workingHours: { ar: '08:30 - 16:30 (الإثنين - الجمعة)', fr: '08:30 - 16:30 (Lun - Ven)', en: '08:30 - 16:30 (Mon - Fri)' },
    mapQuery: 'Commune de Deroua'
  },
  {
    id: 'mun-2',
    category: 'municipal',
    name: {
      ar: 'بريد المغرب - وكالة الدروة',
      fr: 'Poste Maroc (Barid Al Maghrib) Deroua',
      en: 'Morocco Post Deroua'
    },
    tradeOrRole: {
      ar: 'خدمات بريدية وبنكية وطرود',
      fr: 'Services postaux & Barid Bank',
      en: 'Postal & Banking Services'
    },
    phone: '0522530101',
    secondaryPhone: '0802003232',
    address: {
      ar: 'شارع محمد الخامس، قرب السوق النموذجي',
      fr: 'Avenue Mohammed V, près du Marché',
      en: 'Mohammed V Ave, near Market'
    },
    neighborhood: {
      ar: 'مركز الدروة',
      fr: 'Deroua Centre',
      en: 'Deroua Center'
    },
    is24_7: false,
    isOpenNow: true,
    verified: true,
    workingHours: { ar: '08:15 - 16:00 (الإثنين - الجمعة)', fr: '08:15 - 16:00 (Lun - Ven)', en: '08:15 - 16:00 (Mon - Fri)' }
  },
    {
    id: 'mun-srm-deroua',
    category: 'municipal',
    name: {
      ar: 'الشركة الجهوية متعددة الخدمات (SRM)',
      fr: 'Société Régionale Multiservices (SRM)',
      en: 'Regional Multiservices Company (SRM)'
    },
    tradeOrRole: {
      ar: 'خدمات وتوزيع الماء الصالح للشرب والكهرباء والتطهير السائل',
      fr: 'Distribution Eau Potable, Électricité & Assainissement',
      en: 'Water, Electricity Distribution & Sanitation'
    },
    phone: '0522530230',
    secondaryPhone: '0801000777',
    address: {
      ar: 'مركز الدروة، إقليم برشيد (وكالة خدمات الزبناء SRM)',
      fr: 'Centre de Deroua, Agence SRM',
      en: 'Deroua Center, SRM Agency'
    },
    neighborhood: {
      ar: 'مركز الدروة',
      fr: 'Deroua Centre',
      en: 'Deroua Center'
    },
    mapQuery: 'https://maps.app.goo.gl/amkGwhEwMb4wnsGP6',
    is24_7: false,
    isOpenNow: true,
    verified: true,
    description: {
      ar: 'الشركة الجهوية متعددة الخدمات لجهة الدار البيضاء سطات - وكالة الدروة لتدبير وتوزيع قطاعي الماء والكهرباء (الهاتف الثابت: 0522530230 / طوارئ ومركز الاتصال: 0801000777).',
      fr: 'Société Régionale Multiservices (SRM Casablanca-Settat) - Agence Deroua (Tél: 0522530230 / Dépannage: 0801000777).',
      en: 'Regional Multiservices Company (SRM) managing drinking water and electricity in Deroua.'
    },
    workingHours: { ar: '08:30 - 16:30 (الإثنين - الجمعة) | طوارئ 24/24', fr: '08h30 - 16h30 (Lun - Ven) | Urgences 24h/24', en: '08:30 - 16:30 (Mon - Fri) | Emergencies 24/7' }
  },

  // Transport
  {
    id: 'tr-1',
    category: 'transport',
    name: {
      ar: 'محطة سيارات الأجرة الكبيرة (طاكسي كبير) الدروة - البيضاء',
      fr: 'Station Grands Taxis Deroua - Casablanca',
      en: 'Deroua - Casablanca Grand Taxi Station'
    },
    tradeOrRole: {
      ar: 'نقل ركاب بين المدن (البيضاء - سيدي معروف - الوازيس)',
      fr: 'Transport interurbain Casablanca',
      en: 'Intercity Transport to Casablanca'
    },
    phone: '0661112244',
    address: {
      ar: 'المحطة الطرقية الرئيسية، مدار الطريق الوطنية 9',
      fr: 'Station Principale, Rond-point RN9',
      en: 'Main Taxi Station, RN9 Roundabout'
    },
    neighborhood: {
      ar: 'مركز الدروة',
      fr: 'Deroua Centre',
      en: 'Deroua Center'
    },
    is24_7: true,
    isOpenNow: true,
    verified: true,
    description: {
      ar: 'رحلات مستمرة بين الدروة والدار البيضاء (سيدي معروف، محطة قطار الوازيس، والحي الحسني).',
      fr: 'Départs continus vers Casablanca (Sidi Maarouf, Oasis, Hay Hassani). Tarif habituel: 12-15 DH.',
      en: 'Frequent direct departures to Casablanca (Sidi Maarouf, Oasis). Fare approx 12-15 MAD.'
    },
    workingHours: { ar: '05:30 - 23:00 (رحلات مستمرة)', fr: '05:30 - 23:00 (Départs continus)', en: '05:30 - 23:00' }
  },
  {
    id: 'tr-2',
    category: 'transport',
    name: {
      ar: 'محطة طاكسي كبير: الدروة - برشيد',
      fr: 'Station Taxis Deroua - Berrechid',
      en: 'Deroua - Berrechid Grand Taxi'
    },
    tradeOrRole: {
      ar: 'نقل بين المدن نحو برشيد',
      fr: 'Transport vers Berrechid',
      en: 'Transport to Berrechid'
    },
    phone: '0662334455',
    address: {
      ar: 'مخرج الدروة باتجاه برشيد، قبالة محطة إفريقيا',
      fr: 'Sortie Sud Deroua vers Berrechid, face à Station Afriquia',
      en: 'South Exit towards Berrechid, opposite Afriquia'
    },
    neighborhood: {
      ar: 'مركز الدروة',
      fr: 'Deroua Centre',
      en: 'Deroua Center'
    },
    is24_7: false,
    isOpenNow: true,
    verified: true,
    workingHours: { ar: '06:00 - 21:00', fr: '06:00 - 21:00', en: '06:00 - 21:00' }
  },
  {
    id: 'tr-3',
    category: 'transport',
    name: {
      ar: 'طاكسي الدروة - النواصر ومطار محمد الخامس',
      fr: 'Liaison Taxi Deroua - Nouaceur & Aéroport CMN',
      en: 'Deroua - Nouaceur & Airport CMN Taxi'
    },
    tradeOrRole: {
      ar: 'نقل نحو منطقة المطار والمنطقة الحرة',
      fr: 'Navette zone aéroportuaire & Technopole',
      en: 'Airport and Tech Park Shuttle'
    },
    phone: '0663778811',
    address: {
      ar: 'طريق المطار، ملتقى الدروة - النواصر',
      fr: 'Axe Nouaceur - Aéroport Med V',
      en: 'Nouaceur - Med V Airport axis'
    },
    neighborhood: {
      ar: 'منطقة المطار / النواصر',
      fr: 'Zone Aéroport / Nouaceur',
      en: 'Airport Area'
    },
    is24_7: true,
    isOpenNow: true,
    verified: true,
    workingHours: { ar: '24/24 حسب مواعيد الرحلات', fr: '24h/24 selon vols', en: '24/7' }
  },

];

export const DEROUA_NOTICES: NoticeItem[] = [];

export const TRANSPORT_ROUTES: TransportRoute[] = [
  {
    id: 'rt-1',
    from: { ar: 'الدروة (المحطة المركزية)', fr: 'Deroua (Station)', en: 'Deroua Station' },
    to: { ar: 'الدار البيضاء (سيدي معروف / الكليات)', fr: 'Casablanca (Sidi Maarouf)', en: 'Casablanca (Sidi Maarouf)' },
    type: 'grand_taxi',
    fare: '12 - 15 DH',
    station: { ar: 'مدار الطريق الوطنية 9', fr: 'Rond-point RN9', en: 'RN9 Roundabout' },
    frequency: { ar: 'كل 5 إلى 10 دقائق', fr: 'Toutes les 5 à 10 min', en: 'Every 5 to 10 min' },
    operatingHours: { ar: '05:30 - 23:00', fr: '05:30 - 23:00', en: '05:30 - 23:00' }
  },
  {
    id: 'rt-2',
    from: { ar: 'الدروة', fr: 'Deroua', en: 'Deroua' },
    to: { ar: 'برشيد (المحطة الطرقية)', fr: 'Berrechid (Station)', en: 'Berrechid Station' },
    type: 'grand_taxi',
    fare: '10 DH',
    station: { ar: 'مخرج الدروة الجنوبي', fr: 'Sortie Sud Deroua', en: 'South Exit Deroua' },
    frequency: { ar: 'كل 10 دقائق', fr: 'Toutes les 10 min', en: 'Every 10 min' },
    operatingHours: { ar: '06:00 - 21:00', fr: '06:00 - 21:00', en: '06:00 - 21:00' }
  },
  {
    id: 'rt-3',
    from: { ar: 'الدروة', fr: 'Deroua', en: 'Deroua' },
    to: { ar: 'مطار محمد الخامس الدولي (المحطة 1 و 2)', fr: 'Aéroport Mohammed V (T1 & T2)', en: 'Mohammed V Airport (T1 & T2)' },
    type: 'grand_taxi',
    fare: '10 - 15 DH',
    station: { ar: 'طريق النواصر', fr: 'Route de Nouaceur', en: 'Nouaceur Road' },
    frequency: { ar: 'مستمر عند امتلاء السيارة', fr: 'Départs réguliers', en: 'Regular departures' },
    operatingHours: { ar: '24/24', fr: '24h/24', en: '24/7' }
  },
  {
    id: 'rt-4',
    from: { ar: 'الدروة', fr: 'Deroua', en: 'Deroua' },
    to: { ar: 'الدار البيضاء (عبر مديونة)', fr: 'Casablanca (via Médiouna)', en: 'Casablanca (via Mediouna)' },
    type: 'bus',
    lineOrNumber: 'Ligne 310 Casabus',
    fare: '8 DH',
    station: { ar: 'محطات بشارع الحسن الثاني', fr: 'Arrêts Bd Hassan II', en: 'Hassan II stops' },
    frequency: { ar: 'كل 25 دقيقة', fr: 'Toutes les 25 min', en: 'Every 25 min' },
    operatingHours: { ar: '06:00 - 20:30', fr: '06:00 - 20:30', en: '06:00 - 20:30' }
  }
];

export const APP_TRANSLATIONS = {
  ar: {
    appName: 'خدمات الدروة',
    tagline: 'دليلك الموثوق لخدمات مدينة الدروة والنواحي',
    searchPlaceholder: 'ابحث عن طبيب، صيدلية، بلومبيي، كهربائي، أو إدارة...',
    allCategories: 'الكل',
    emergency: 'طوارئ عاجلة',
    pharmacy: 'صيدليات',
    health: 'صحة وعيادات',
    artisan: 'حرفيون ومهن',
    municipal: 'إدارات وخدمات',
    transport: 'مواصلات ونقل',
    commerce: 'أسواق وتجارة',
    guardPharmacyNow: 'صيدلية الحراسة الآن',
    guardPharmacySubtitle: 'خدمة 24/24 لتلبية احتياجاتكم الطبية بالدروة',
    callNow: 'اتصال مباشر',
    whatsappChat: 'محادثة واتساب',
    verifiedService: 'خدمة معتمدة',
    openNow: 'مفتوح الآن',
    closedNow: 'مغلق',
    open247: 'مفتوح 24/24',
    dutyPharmacyBadge: 'صيدلية حراسة هذا الأسبوع',
    neighborhoodLabel: 'الحي',
    filterByNeighborhood: 'تصفية حسب الحي',
    emergencyNumbersQuick: 'أرقام الطوارئ السريعة',
    addServiceBtn: 'إضافة خدمة أو حرفي',
    noticeBoardTitle: 'إعلانات وأخبار الدروة',
    jobsTitle: 'فرص العمل',
    transportTitle: 'دليل النقل وسيارات الأجرة',
    privacyPolicy: 'سياسة الخصوصية',
    aboutWebsite: 'حول الموقع',
    favorites: 'المفضلة',
    noFavoritesYet: 'لم تقم بحفظ أي خدمة في المفضلة بعد.',
    noResultsFound: 'لم يتم العثور على أي نتيجة مطابقة لبحثك.',
    resetFilters: 'إعادة ضبط الفلاتر',
    shareApp: 'مشاركة الموقع',
    darkMode: 'الوضع الليلي',
    lightMode: 'الوضع النهاري',
    offlineStatus: 'أنت في وضع عدم الاتصال بالإنترنت - البيانات محفوظة محلياً',
    copyNumber: 'نسخ الرقم',
    numberCopied: 'تم نسخ الرقم بنجاح!',
    totalServices: 'خدمة مسجلة بالدروة',
    communityPortal: 'بوابة الدروة الإلكترونية',
    adminPortal: 'لوحة الإدارة',
    adminTitle: 'إدارة الأنشطة والخدمات',
    verifiedBadge: 'العلامة الزرقاء',
    grantBadge: 'منح العلامة الزرقاء',
    revokeBadge: 'إلغاء العلامة',
    advertisingSection: 'المساحة الإعلانية والشركاء',
    advertiseWithUs: 'أعلن معنا في الدروة'
  },
  fr: {
    appName: 'Deroua Services',
    tagline: 'L\'annuaire communautaire de référence pour la ville de Deroua',
    searchPlaceholder: 'Rechercher médecin, pharmacie, plombier, taxi, mairie...',
    allCategories: 'Tous',
    emergency: 'Urgences',
    pharmacy: 'Pharmacies',
    health: 'Santé & Soins',
    artisan: 'Artisans & Métiers',
    municipal: 'Services Publics',
    transport: 'Transports & Taxis',
    commerce: 'Commerces & Souk',
    guardPharmacyNow: 'Pharmacie de garde active',
    guardPharmacySubtitle: 'Service 24h/24 disponible à Deroua cette semaine',
    callNow: 'Appeler',
    whatsappChat: 'WhatsApp',
    verifiedService: 'Service vérifié',
    openNow: 'Ouvert actuellement',
    closedNow: 'Fermé',
    open247: '24h/24',
    dutyPharmacyBadge: 'Pharmacie de garde cette semaine',
    neighborhoodLabel: 'Quartier',
    filterByNeighborhood: 'Filtrer par quartier',
    emergencyNumbersQuick: 'Numéros d\'urgence rapides',
    addServiceBtn: 'Ajouter un service',
    noticeBoardTitle: 'Avis & Actualités de Deroua',
    jobsTitle: 'Emplois',
    transportTitle: 'Guide des Transports & Taxis',
    privacyPolicy: 'Politique de confidentialité',
    aboutWebsite: 'À propos du site',
    favorites: 'Favoris',
    noFavoritesYet: 'Aucun contact enregistré en favori.',
    noResultsFound: 'Aucun service ne correspond à votre recherche.',
    resetFilters: 'Réinitialiser les filtres',
    shareApp: 'Partager le site web',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    offlineStatus: 'Mode hors-ligne actif - Les numéros restent accessibles',
    copyNumber: 'Copier',
    numberCopied: 'Numéro copié !',
    totalServices: 'services répertoriés à Deroua',
    communityPortal: 'Portail web de Deroua',
    adminPortal: 'Espace Administration',
    adminTitle: 'Gestion des activités & services',
    verifiedBadge: 'Badge Bleu Vérifié',
    grantBadge: 'Attribuer le badge bleu',
    revokeBadge: 'Retirer le badge',
    advertisingSection: 'Espace Publicitaire & Partenaires',
    advertiseWithUs: 'Annoncez ici à Deroua'
  },
  en: {
    appName: 'Deroua Services',
    tagline: 'Your reliable community and services directory for Deroua, Morocco',
    searchPlaceholder: 'Search doctor, pharmacy, plumber, taxi, city hall...',
    allCategories: 'All',
    emergency: 'Emergencies',
    pharmacy: 'Pharmacies',
    health: 'Health & Clinics',
    artisan: 'Artisans & Trades',
    municipal: 'Public Services',
    transport: 'Transport & Taxis',
    commerce: 'Markets & Commerce',
    guardPharmacyNow: 'Active Guard Pharmacy',
    guardPharmacySubtitle: '24/7 on-duty service available in Deroua this week',
    callNow: 'Call Now',
    whatsappChat: 'WhatsApp',
    verifiedService: 'Verified Service',
    openNow: 'Open Now',
    closedNow: 'Closed',
    open247: '24/7 Open',
    dutyPharmacyBadge: 'On-duty Pharmacy this week',
    neighborhoodLabel: 'Neighborhood',
    filterByNeighborhood: 'Filter by neighborhood',
    emergencyNumbersQuick: 'Quick Emergency Numbers',
    addServiceBtn: 'Add a Service',
    noticeBoardTitle: 'Deroua Notices & Community Updates',
    jobsTitle: 'Jobs',
    transportTitle: 'Transport & Taxi Guide',
    privacyPolicy: 'Privacy Policy',
    aboutWebsite: 'About Website',
    favorites: 'Favorites',
    noFavoritesYet: 'No saved contacts in favorites yet.',
    noResultsFound: 'No services match your search.',
    resetFilters: 'Reset filters',
    shareApp: 'Share Website',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    offlineStatus: 'Offline mode active - Cached numbers remain accessible',
    copyNumber: 'Copy',
    numberCopied: 'Phone number copied!',
    totalServices: 'services listed in Deroua',
    communityPortal: 'Deroua Web Portal',
    adminPortal: 'Admin Portal',
    adminTitle: 'Activity & Service Management',
    verifiedBadge: 'Blue Verified Badge',
    grantBadge: 'Grant Blue Badge',
    revokeBadge: 'Revoke Badge',
    advertisingSection: 'Advertising & Local Partners',
    advertiseWithUs: 'Advertise With Us'
  }
};

export const INITIAL_ADVERTISEMENTS: import('../types.ts').AdvertisementItem[] = [];

export const INITIAL_USER_SUBMISSIONS: ServiceItem[] = [
  {
    id: 'user-sub-1',
    category: 'artisan',
    name: {
      ar: 'كهربائي منازل وإلكترونيات - كمال الشاوي',
      fr: 'Électricien Bâtiment - Kamal Chaoui',
      en: 'Building Electrician - Kamal Chaoui'
    },
    tradeOrRole: {
      ar: 'كهربائي معتمد وإصلاح الأجهزة',
      fr: 'Électricien Bâtiment & Dépannage',
      en: 'Certified Electrician'
    },
    phone: '0661294812',
    whatsapp: '0661294812',
    address: {
      ar: 'تجزئة الأمل 2، رقم 44، قرب صيدلية النور',
      fr: 'Lotissement Al Amal 2, N° 44',
      en: 'Al Amal 2 Subdiv, No. 44'
    },
    neighborhood: {
      ar: 'حي الأمل',
      fr: 'Hay Al Amal',
      en: 'Hay Al Amal'
    },
    is24_7: true,
    isOpenNow: true,
    verified: false,
    isUserSubmitted: true,
    createdAt: '2026-09-15T09:42:00.000Z',
    description: {
      ar: 'تركيب وصيانة كهرباء المنازل، الكاميرات، والإنارة الذكية بالدروة والنواحي.',
      fr: 'Installation et maintenance électrique domestique, caméras de surveillance.',
      en: 'Residential electrical installations and maintenance.'
    },
    workingHours: { ar: '24/24 طيلة الأسبوع', fr: '24h/24 7j/7', en: '24/7' }
  },
  {
    id: 'user-sub-2',
    category: 'health',
    name: {
      ar: 'عيادة التمريض المنزلي والعلاجات المستعجلة',
      fr: 'Cabinet de Soins Infirmiers à Domicile',
      en: 'Home Nursing & Urgent Care'
    },
    tradeOrRole: {
      ar: 'ممرض مجاز - حقن وتضميد وتتبع السكري',
      fr: 'Infirmier Diplômé d\'État',
      en: 'Registered Nurse'
    },
    phone: '0663451299',
    whatsapp: '0663451299',
    address: {
      ar: 'عمارة النخيل، الطابق 1، شارع الحسن الثاني',
      fr: 'Immeuble An-Nakhil, 1er étage, Bd Hassan II',
      en: 'An-Nakhil Bldg, 1st Floor, Hassan II Blvd'
    },
    neighborhood: {
      ar: 'حي الوفاق',
      fr: 'Hay Al Wifaq',
      en: 'Hay Al Wifaq'
    },
    is24_7: false,
    isOpenNow: true,
    verified: false,
    isUserSubmitted: true,
    createdAt: '2026-09-14T16:20:00.000Z',
    description: {
      ar: 'حقن طبية، تضميد الجروح، تتبع مرضى السكري والضغط، وسحب عينات الدم بالمنزل.',
      fr: 'Injections, pansements, surveillance tension/diabète et prélèvements à domicile.',
      en: 'Home injections, wound dressing, blood pressure monitoring.'
    },
    workingHours: { ar: '08:00 - 21:00 يومياً', fr: '08:00 - 21:00 7j/7', en: '08:00 - 21:00' }
  },
  {
    id: 'user-sub-3',
    category: 'transport',
    name: {
      ar: 'نقل البضائع والرحيل بالدروة والدار البيضاء',
      fr: 'Transport de Marchandises & Déménagement',
      en: 'Goods & Relocation Transport'
    },
    tradeOrRole: {
      ar: 'سائق شاحنة هوندا لنقل البضائع والأثاث',
      fr: 'Transporteur utilitaire',
      en: 'Utility Mover'
    },
    phone: '0672108845',
    whatsapp: '0672108845',
    address: {
      ar: 'قرب محطة سيارات الأجرة الكبيرة، مركز الدروة',
      fr: 'Près de la station Grand Taxi, Centre',
      en: 'Near Grand Taxi station, Center'
    },
    neighborhood: {
      ar: 'مركز الدروة',
      fr: 'Deroua Centre',
      en: 'Deroua Center'
    },
    is24_7: true,
    isOpenNow: true,
    verified: true,
    isUserSubmitted: true,
    createdAt: '2026-09-13T11:15:00.000Z',
    description: {
      ar: 'شاحنة صغيرة لنقل الأثاث والسلع بين الدروة، المطار، برشيد، والدار البيضاء مع عمال للتحميل.',
      fr: 'Petit camion de déménagement et transport Deroua - Casa - Berrechid.',
      en: 'Moving truck and transport service.'
    },
    workingHours: { ar: '24/24 متاح بالطلب', fr: '24h/24 sur appel', en: '24/7 on call' }
  },
  {
    id: 'user-sub-4',
    category: 'commerce',
    name: {
      ar: 'مخبزة وحلويات الأصيل الفاسية',
      fr: 'Boulangerie Pâtisserie Al Assil',
      en: 'Al Assil Bakery & Pastry'
    },
    tradeOrRole: {
      ar: 'مخبزة عصرية وحلويات مغربية وفرنسية',
      fr: 'Boulangerie Pâtisserie Artisanale',
      en: 'Artisan Bakery & Pastry'
    },
    phone: '0522530188',
    whatsapp: '0665443322',
    address: {
      ar: 'شارع محمد السادس، قرب مدرسة السعادة',
      fr: 'Avenue Mohammed VI, près de l\'école Saada',
      en: 'Mohammed VI Ave, near Saada school'
    },
    neighborhood: {
      ar: 'حي السعادة',
      fr: 'Hay Saada',
      en: 'Hay Saada'
    },
    is24_7: false,
    isOpenNow: true,
    verified: false,
    isUserSubmitted: true,
    createdAt: '2026-09-15T06:10:00.000Z',
    description: {
      ar: 'خبز تقليدي، كرواسون، حلويات مغربية للمناسبات والأفراح، وتوصيل الطلبيات بالدروة.',
      fr: 'Pains artisanaux, viennoiseries, gâteaux marocains pour cérémonies et livraison.',
      en: 'Artisan bread, pastries, Moroccan cakes for events and catering.'
    },
    workingHours: { ar: '06:00 - 22:30 يومياً', fr: '06:00 - 22:30 7j/7', en: '06:00 - 22:30' }
  }
];
