import type { Node, Opt, RequiredField, Section } from '../types'

/* ------------------------------------------------------------------ */
/* Reusable option sets (wording exactly as in the source document)    */
/* ------------------------------------------------------------------ */

const YA: Opt = { v: 'ya', l: 'Ya (_Yes_)' }
const TIDAK: Opt = { v: 'tidak', l: 'Tidak (_No_)' }
const YN: Opt[] = [YA, TIDAK]
const YNU: Opt[] = [YA, TIDAK, { v: 'tidak_tahu', l: 'Tidak Tahu (_Unknown_)' }]
const yaWith = (detail: Opt['detail'], l = 'Ya (_Yes_),'): Opt[] => [{ v: 'ya', l, detail }, TIDAK]

const FREQ5: Opt[] = [
  { v: 'selalu', l: 'Selalu (_Always_)' },
  { v: 'sering', l: 'Sering (_Often_)' },
  { v: 'kadang', l: 'Kadang-kadang (_Sometimes_)' },
  { v: 'jarang', l: 'Jarang (_Seldom_)' },
  { v: 'tidak_pernah', l: 'Tidak pernah (_Never_)' },
]

const ACTIVITY: Opt[] = [
  {
    v: 'sedentari',
    l: 'Banyak duduk/melakukan sedikit/tidak ada kegiatan fisik/sedentari\n_Prolonged sitting/little to no physical activity/sedentary lifestyle_',
  },
  {
    v: 'aktif',
    l: 'Aktif/banyak kegiatan berdiri dan berjalan/bergerak\n_Active/many activity must to stand/walk/move_',
  },
]

const yn = (key: string, l: string, extra: Partial<Extract<Node, { t: 'radio' }>> = {}): Node => ({
  t: 'radio',
  key,
  l,
  opts: YN,
  row: true,
  ...extra,
})
const ynu = (key: string, l: string): Node => ({ t: 'radio', key, l, opts: YNU, row: true })

/* ------------------------------------------------------------------ */
/* Table data                                                          */
/* ------------------------------------------------------------------ */

export const PMH_ROWS: { key: string; l: string; nameField?: boolean }[] = [
  { key: 'dm', l: 'Diabetes Mellitus\n(_Diabetes Mellitus_)' },
  { key: 'ht', l: 'Hipertensi (_Hypertension_)' },
  { key: 'dl', l: 'Dislipidemia (_Dyslipidemia_)' },
  { key: 'jantung', l: 'Penyakit Jantung (_Heart Disease_)' },
  { key: 'stroke', l: 'Stroke (_Stroke_)' },
  { key: 'asma', l: 'Asma (_Asthma_)' },
  { key: 'tbc', l: 'TBC (_Tuberculosis_)' },
  { key: 'tiroid', l: 'Penyakit Tiroid (_Thyroid disease_)' },
  { key: 'epilepsi', l: 'Epilepsi/Ayan (_Epilepsy_)' },
  { key: 'maag', l: 'Maag / Gastritis (_Indigestion_)' },
  { key: 'kanker', l: 'Kanker (_Cancer_)' },
  { key: 'luka', l: 'Riwayat Luka (_Previous Injury_)' },
  { key: 'dirawat', l: 'Riwayat Dirawat\n_Hospitalization History_' },
  { key: 'operasi', l: 'Riwayat Operasi/Tindakan\n_Surgical Procedures History_' },
  { key: 'lain', l: 'Kondisi Lain (_Other Conditions_)', nameField: true },
]

export const FAMILY_DISEASES: { key: string; l: string }[] = [
  { key: 'dm', l: '_Diabetes Mellitus\nDiabetes Mellitus_' },
  { key: 'ht', l: '_Hipertensi\nHyper\u00ADtension_' },
  { key: 'jantung', l: '_Penyakit Jantung\nHeart Disease_' },
  { key: 'stroke', l: '_Stroke\nStroke_' },
  { key: 'kolesterol', l: '_Kolesterol\nChole\u00ADsterol_' },
  { key: 'kanker', l: '_Kanker\nCancer_' },
]
/** Short labels for the stacked (mobile) layout and the summary */
export const FAMILY_DISEASE_SHORT: Record<string, string> = {
  dm: 'Diabetes Mellitus (_Diabetes Mellitus_)',
  ht: 'Hipertensi (_Hypertension_)',
  jantung: 'Penyakit Jantung (_Heart Disease_)',
  stroke: 'Stroke (_Stroke_)',
  kolesterol: 'Kolesterol (_Cholesterol_)',
  kanker: 'Kanker (_Cancer_)',
}
export const FAMILY_MEMBERS: { key: string; l: string; freeCondition?: boolean }[] = [
  { key: 'ayah', l: '_Ayah\nFather_' },
  { key: 'ibu', l: '_Ibu\nMother_' },
  { key: 'kakek', l: '_Kakek\nGrandfather_' },
  { key: 'nenek', l: '_Nenek\nGrandmother_' },
  { key: 'saudara', l: '_Saudara\nBrother/​Sister_' },
  { key: 'saudara_lain', l: '_Saudara lainnya\nOther relatives_' },
  { key: 'lain', l: '_Other family member_', freeCondition: true },
]
export const FAMILY_SUBROWS: { key: string; l: string }[] = [
  { key: 'dx', l: '_Usia mulai terdiagnosis\nAge at diagnosis_' },
  { key: 'death', l: '_Usia meninggal\nAge of Death_' },
]

export const VACCINES: { key: string; l: string; nameField?: boolean }[] = [
  { key: 'hepb', l: 'Hepatitis B (_Hepatitis B_)' },
  { key: 'hepa', l: 'Hepatitis A (_Hepatitis A_)' },
  { key: 'polio', l: 'Polio (_Polio_)' },
  { key: 'dpt', l: 'DPT (_T-Dap_)' },
  { key: 'bcg', l: 'BCG (_BCG_)' },
  { key: 'tifoid', l: 'Tifoid (_Typhoid_)' },
  { key: 'campak', l: 'Campak (_Measles_)' },
  { key: 'tetanus', l: 'Tetanus (_Tetanus_)' },
  { key: 'covid', l: 'Covid-19 (_Covid-19_)' },
  { key: 'hpv', l: 'HPV (_HPV_)' },
  { key: 'lain', l: 'Vaksin lain (_Other Vaccine_)', nameField: true },
]

export const MEALS: { key: string; l: string; schedule: Opt[] }[] = [
  {
    key: 'sarapan',
    l: 'Sarapan\n_Breakfast_',
    schedule: [
      { v: 'lt6', l: 'Sebelum 06:00\n_Before 06:00_' },
      { v: '6-7', l: '06:00 – 07:00' },
      { v: '7-8', l: '07:00 – 08:00' },
      { v: '8-9', l: '08:00 – 09:00' },
      { v: 'gt9', l: 'Setelah 09:00 (_After 09:00_)' },
    ],
  },
  {
    key: 'siang',
    l: 'Makan siang\n_Lunch_',
    schedule: [
      { v: '11-12', l: '11:00 – 12:00' },
      { v: '12-13', l: '12:00 – 13:00' },
      { v: '13-14', l: '13:00 – 14:00' },
      { v: 'gt14', l: 'Setelah 14:00 (_After 14:00_)' },
    ],
  },
  {
    key: 'malam',
    l: 'Makan malam\n_Dinner_',
    schedule: [
      { v: 'lt18', l: 'Sebelum 18:00\n_Before 18:00_' },
      { v: '18-19', l: '18:00 – 19:00' },
      { v: '19-20', l: '19:00 – 20:00' },
      { v: 'gt20', l: 'Setelah 20:00 (_After 20:00_)' },
    ],
  },
  {
    key: 'cemilan',
    l: 'Cemilan\n_Snack_',
    schedule: [
      { v: '1x', l: '1x (_once per day_)' },
      { v: '2x', l: '2x (_twice per day_)' },
      { v: '3x', l: '3x (_three times per day_)' },
      { v: 'gt3x', l: '> 3x\n_More than 3 times per day_' },
    ],
  },
]
export const MEAL_REGULAR: Opt[] = [
  { v: 'ya', l: 'Ya (_Yes_)' },
  { v: 'tidak', l: 'Tidak (_No_)' },
]

export const FOOD_QUALITY: { key: string; l: string }[] = [
  { key: 'gula', l: 'Makanan tinggi gula\n_High-sugar food_' },
  { key: 'garam', l: 'Makanan tinggi garam\n_High-salt food_' },
  { key: 'protein', l: 'Protein (Daging/ikan/telur/tahu/tempe/susu)\n_Protein (Meat/dairy/fish/poultry/tofu/tempe)_' },
  { key: 'sayur', l: 'Sayur (_Vegetables_)' },
  { key: 'buah', l: 'Buah (_Fruit_)' },
  { key: 'gandum', l: 'Gandum utuh vs karbohidrat olahan\n_Whole grains vs refined carbohydrates_' },
  { key: 'ultra', l: 'Makanan ultra-proses (_Ultra-processed food_)' },
]

export const WATER_OPTS: Opt[] = [
  { v: 'lt1', l: '< 1 L' },
  { v: '1-2', l: '1-2 L' },
  { v: '2-3', l: '2-3 L' },
  { v: 'gt3', l: '> 3 L' },
]

export const MED_ROWS = 10

/* ------------------------------------------------------------------ */
/* Sections, in the order of the source document                       */
/* ------------------------------------------------------------------ */

export const SECTIONS: Section[] = [
  {
    id: 'identitas',
    title: 'Identitas Pasien (_Patient Identity_)',
    nodes: [{ t: 'identity' }],
  },
  {
    id: 'pekerjaan',
    title: 'Pekerjaan (_Work_)',
    nodes: [
      {
        t: 'radio',
        key: 'jenis_pekerjaan',
        l: 'Jenis pekerjaan (_Type of work_)',
        labelStyle: 'bold',
        cols: 2,
        opts: [
          { v: 'shift', l: 'Shift (_Shift_)' },
          { v: 'non_shift', l: 'Non-shift (_Non-shift_)' },
        ],
      },
      {
        t: 'radio',
        key: 'kriteria_pekerjaan',
        l: 'Kriteria pekerjaan (_Working criteria_)',
        labelStyle: 'bold',
        cols: 3,
        opts: [
          { v: 'wfh', l: 'Kerja dari rumah (_Work from Home_/WFH)' },
          { v: 'offline', l: 'Offline (_Offline_)' },
          { v: 'gabungan', l: 'Gabungan (_Combination_)' },
        ],
      },
      {
        t: 'radio',
        key: 'lokasi_pekerjaan',
        l: 'Lokasi pekerjaan (_Workplace_)',
        labelStyle: 'bold',
        cols: 3,
        opts: [
          { v: 'kantor', l: 'Di kantor (_At the office_)' },
          { v: 'rumah', l: 'Di rumah (_Remote work_)' },
          { v: 'travel', l: 'Sering bepergian (_Often travel_)' },
        ],
      },
    ],
  },
  {
    id: 'riwayat',
    title: 'Keluhan & Riwayat Penyakit (_Complaints & Medical History_)',
    nodes: [
      { t: 'field', key: 'keluhan', l: 'Gejala atau keluhan saat ini (_Present complaints_) :', type: 'textarea', labelStyle: 'marker' },
      { t: 'field', key: 'riwayat_sekarang', l: 'Riwayat penyakit sekarang (_Present medical history_) :', type: 'textarea', labelStyle: 'marker' },
      { t: 'h2', l: 'Riwayat penyakit dahulu (_Past medical History_) :', marker: true },
      { t: 'table', kind: 'pmh' },
      {
        t: 'radio',
        key: 'energi',
        l: 'Tingkat Energi & Vitalitas (_Energy & Vitality Level_):',
        labelStyle: 'marker',
        opts: [
          { v: 'sangat_baik', l: 'Sangat baik - merasa berenergi hampir setiap hari (_Very good - feel energetic most days_)' },
          { v: 'baik', l: 'Baik - umumnya merasa sehat (_Good - generally feeling healthy_)' },
          { v: 'cukup', l: 'Cukup - sering merasa lelah (_Moderate - often feel tired_)' },
          { v: 'buruk', l: 'Buruk - terus-menerus merasa sangat lelah (_Poor - constantly feeling very tired_)' },
        ],
      },
    ],
  },
  {
    id: 'keluarga',
    title: 'Riwayat Penyakit Keluarga (_Family Medical History_)',
    heading: {
      l: 'Riwayat Penyakit Keluarga – Asesmen Risiko Longevity',
      en: 'Family Medical History – Longevity Risk Assessment',
    },
    nodes: [
      {
        t: 'p',
        l: 'Riwayat kesehatan keluarga membantu memprediksi risiko kesehatan yang Anda warisi dan menjadi panduan untuk strategi pencegahan.',
        en: 'Family medical history helps predict inherited health risks and serves as a guide for prevention strategies.',
      },
      { t: 'table', kind: 'family' },
    ],
  },
  {
    id: 'alergi',
    title: 'Alergi (_Allergy_)',
    nodes: [
      { t: 'h2', l: 'Alergi (_Allergy_)' },
      ...(['makanan', 'obat', 'lainnya'] as const).map(
        (k): Node => ({
          t: 'radio',
          key: `alergi_${k}`,
          l: { makanan: 'Makanan (_Food_) :', obat: 'Obat (_Drugs_) :', lainnya: 'Lainnya (_Other_) :' }[k],
          bullet: true,
          cols: 2,
          opts: [TIDAK, { v: 'ya', l: 'Ada (_Yes_),', detail: { placeholder: 'sebutkan', width: 'lg' } }],
        }),
      ),
    ],
  },
  {
    id: 'vaksinasi',
    title: 'Riwayat Vaksinasi (_Vaccination History_)',
    nodes: [{ t: 'h2', l: 'Riwayat Vaksinasi (_Vaccination History_)' }, { t: 'table', kind: 'vaccine' }],
  },
  {
    id: 'menstruasi',
    title: 'Riwayat Menstruasi dan Kehamilan (_Menstrual and Pregnancy History_)',
    show: (s) => s.jenis_kelamin === 'P',
    nodes: [
      { t: 'h2', l: 'Riwayat Menstruasi dan Kehamilan (untuk pasien perempuan)\n_Menstrual and Pregnancy History for female patients_', badge: '(tidak wajib diisi)', badgeTone: 'red' },
      { t: 'field', key: 'haid_usia', l: 'Usia haid pertama (_Age of first menstruation_) :', type: 'number', suffix: 'tahun (_years old_)', width: 'xs' },
      { t: 'field', key: 'haid_hpht', l: 'Hari pertama haid terakhir (_First day of last period_) :', type: 'date', suffix: '(_dd/mm/yy_)', width: 'md' },
      { t: 'field', key: 'haid_lama', l: 'Lama haid (_Menstrual period_) :', type: 'number', suffix: 'hari (_days_)', width: 'xs' },
      {
        t: 'radio',
        key: 'haid_siklus',
        l: 'Siklus haid (_Menstrual cycle_) :',
        row: true,
        opts: [
          { v: 'teratur', l: 'Teratur (_Regular_)' },
          { v: 'tidak_teratur', l: 'Tidak teratur (_Irregular_)' },
        ],
      },
      yn('haid_nyeri', 'Nyeri haid (_Menstrual pain_) :'),
      { t: 'field', key: 'hamil_jumlah', l: 'Jumlah kehamilan (_Number of pregnancies_) :', type: 'number', suffix: 'x (_times_)', width: 'xs' },
      { t: 'field', key: 'lahir_jumlah', l: 'Jumlah kelahiran (_Number of births_) :', type: 'number', suffix: 'x (_times_)', width: 'xs' },
      { t: 'field', key: 'keguguran_jumlah', l: 'Jumlah keguguran (_Number of miscarriages_) :', type: 'number', suffix: 'x (_times_)', width: 'xs' },
      { t: 'field', key: 'menopause_usia', l: 'Menopause usia (_Menopause at age_) :', type: 'number', suffix: 'tahun (_years old_)', width: 'xs' },
      {
        t: 'radio',
        key: 'kb',
        l: 'Penggunaan KB (_Use of contraception_) :',
        cols: 2,
        opts: yaWith({ prefix: 'pada usia (_at age_)', type: 'number', suffix: 'tahun (_years old_)', width: 'xs' }),
      },
      {
        t: 'radio',
        key: 'kb_masalah',
        l: 'Masalah akibat kontrasepsi (_Problems resulting from contraception_) :',
        cols: 2,
        opts: yaWith({ placeholder: 'sebutkan', width: 'lg' }),
      },
      {
        t: 'radio',
        key: 'papsmear',
        l: 'Riwayat pap smear (_History of pap smear examination_) :',
        cols: 2,
        opts: yaWith({ prefix: 'pada tahun (_in_)', type: 'number', width: 'xs' }),
      },
      {
        t: 'radio',
        key: 'mammografi',
        l: 'Riwayat mammografi/USG payudara (_History of mammography/breast ultrasound_) :',
        cols: 2,
        opts: yaWith({ prefix: 'pada tahun (_in_)', type: 'number', width: 'xs' }),
      },
    ],
  },
  {
    id: 'nutrisi',
    title: 'Nutrisi & Pola Makan (_Nutrition & Dietary Habits_)',
    heading: {
      l: 'Nutrisi & Pola Makan – Asesmen Pola Makan untuk Longevity',
      en: 'Nutrition & Dietary Habits for Longevity',
    },
    nodes: [
      {
        t: 'p',
        l: 'Pola makan memiliki dampak yang signifikan terhadap kesehatan metabolik, peradangan, dan rentang usia sehat.',
        en: 'Dietary habits have a significant impact on metabolic health, inflammation, and healthy lifespan.',
      },
      { t: 'h2', l: 'Waktu makan & frekuensi (_Meal timing & frequency_)', marker: true },
      { t: 'table', kind: 'meals' },
      {
        t: 'field',
        key: 'intermitten',
        type: 'textarea',
        l: 'Apakah Anda melakukan puasa intermiten? Mohon dicatat periode jendela makan dan sudah berapa lama Anda melakukannya.\n_Do you practice intermittent fasting? Please note the eating window and how long you have been doing it._',
      },
      { t: 'h2', l: 'Kualitas makanan dan pilihan (_Food quality and choice_)' },
      { t: 'table', kind: 'foodq' },
      {
        t: 'radio',
        key: 'lapar',
        l: 'Rasa lapar di antara waktu makan (_Feeling hungry between meals_)',
        cols: 2,
        colMajor: true,
        opts: [
          { v: 'tidak_pernah', l: 'Tidak pernah (_Never_)' },
          { v: 'jarang', l: 'Jarang (_Seldom_)' },
          { v: 'sering', l: 'Sering (_Often_)' },
          { v: 'selalu', l: 'Selalu (_Always_)' },
        ],
      },
      {
        t: 'radio',
        key: 'pembatasan_makanan',
        l: 'Pembatasan makanan (_Food restriction_)',
        cols: 2,
        opts: yaWith({ placeholder: 'sebutkan', width: 'lg' }, 'Ya (_Yes_) ,'),
      },
      { t: 'h2', l: 'Minum (_Drink_)' },
      { t: 'table', kind: 'drinks' },
    ],
  },
  {
    id: 'aktivitas',
    title: 'Aktivitas Fisik & Pergerakan (_Physical Activity & Movement_)',
    heading: {
      l: 'Aktivitas Fisik & Pergerakan – Kebugaran untuk Longevity',
      en: 'Physical Activity & Movement – Fitness for Longevity',
    },
    nodes: [
      {
        t: 'p',
        l: 'Pergerakan yang teratur merupakan salah satu prediktor terkuat dari rentang usia sehat dan harapan hidup.',
        en: 'Regular activity is one of the strongest predictors of healthy lifespan and life expectancy.',
      },
      { t: 'h2', l: 'Olahraga (_Exercise_)' },
      { t: 'field', key: 'olahraga_frek', l: 'Frekuensi/minggu (_Frequency/week_) :', type: 'number', suffix: 'x/minggu (_x/week_)', bullet: true, width: 'xs' },
      yn('olahraga_teratur', 'Teratur (_Regular_) :', { bullet: true }),
      { t: 'field', key: 'olahraga_durasi', l: 'Durasi/lama olahraga (_Duration of exercise_) :', type: 'number', suffix: 'menit/x (_minutes/times_)', bullet: true, width: 'xs' },
      {
        t: 'check',
        key: 'olahraga_jenis',
        l: 'Jenis olahraga (_Type of exercise_) :',
        bullet: true,
        cols: 2,
        opts: [
          { v: 'aerobik', l: 'Aerobik/kardio (_Aerobic/cardio_)' },
          { v: 'kekuatan', l: 'Latihan kekuatan/resistensi (_Strength/resistance training_)' },
          { v: 'yoga', l: 'Fleksibilitas/yoga (_Flexibility/yoga_)' },
          { v: 'renang', l: 'Renang (_Swim_)' },
          { v: 'lainnya', l: 'Lainnya (_Others_),', detail: { placeholder: 'sebutkan', width: 'md' } },
        ],
      },
      { t: 'h2', l: 'Aktivitas harian (_Daily activity_)' },
      { t: 'radio', key: 'aktivitas_kerja', l: 'Aktivitas kerja (_Work activity_) :', opts: ACTIVITY },
      { t: 'radio', key: 'aktivitas_rumah', l: 'Aktivitas di rumah (_Home activity_) :', opts: ACTIVITY },
      {
        t: 'radio',
        key: 'langkah',
        l: 'Langkah/hari (_Number of steps/day_) :',
        cols: 3,
        colMajor: true,
        opts: [
          { v: 'lt3000', l: '< 3000' },
          { v: '3000-5000', l: '3000 – 5000' },
          { v: '5000-7000', l: '5000 – 7000' },
          { v: '7000-10000', l: '7000 – 10.000' },
          { v: 'gt10000', l: '>10.000' },
        ],
      },
      { t: 'label', l: 'Waktu Sedentari (_Sedentary Time_)' },
      { t: 'field', key: 'sedentari_duduk', l: 'Duduk/pekerjaan meja (_Sitting/desk job_) :', type: 'number', suffix: 'jam/hari (_hours/day_)', bullet: true, width: 'xs' },
      { t: 'field', key: 'sedentari_layar', l: 'Waktu layar (_Screentime_) :', type: 'number', suffix: 'jam/hari (_hours/day_)', bullet: true, width: 'xs' },
      { t: 'field', key: 'sedentari_mengemudi', l: 'Mengemudi (_Driving_) :', type: 'number', suffix: 'jam/hari (_hours/day_)', bullet: true, width: 'xs' },
      { t: 'label', l: 'Kebugaran Fungsional (_Functional Fitness_) :' },
      yn('fit_jalan', 'Apakah Anda dapat berjalan 2 km tanpa berhenti? (_Can you walk 2 km without stopping?_)', { bullet: true }),
      yn('fit_tangga', 'Naik tangga 3 lantai tanpa berhenti? (_Climb 3 flights of stairs without stopping?_)', { bullet: true }),
      yn('fit_bangun', 'Bangun dari lantai tanpa menggunakan tangan? (_Get up from the floor without using your hands?_)', { bullet: true }),
    ],
  },
  {
    id: 'tidur',
    title: 'Kualitas Tidur (_Quality of sleep_)',
    heading: { l: 'Kualitas Tidur (_Quality of sleep_)' },
    nodes: [
      { t: 'h2', l: 'Pola Tidur (_Sleep Pattern_) :' },
      yn('tidur_sulit', 'Apakah Anda kesulitan untuk mulai tidur? (_Do you find it hard to fall asleep?_)'),
      ynu('tidur_dengkur', 'Apakah Anda mendengkur saat tidur? (_Do you snore while you sleep?_)'),
      {
        t: 'radio',
        key: 'tidur_waktu',
        l: 'Waktu tidur (_Bedtime_) :',
        cols: 3,
        opts: [
          { v: '20', l: '20:00' },
          { v: '21', l: '21:00' },
          { v: '22', l: '22:00' },
          { v: '23', l: '23:00' },
          { v: 'gt23', l: '> 23:00' },
        ],
      },
      {
        t: 'radio',
        key: 'tidur_konsistensi',
        l: 'Konsistensi waktu tidur (_Bedtime consistency_) :',
        cols: 2,
        opts: [
          { v: 'teratur', l: 'Teratur (_Regular_)' },
          { v: 'tidak_teratur', l: 'Tidak teratur (_Irregular_)' },
        ],
      },
      { t: 'field', key: 'tidur_durasi_jam', l: 'Durasi tidur (_Duration of sleep_) :', type: 'number', suffix: 'jam (_hours_)', width: 'xs' },
      {
        t: 'radio',
        key: 'tidur_durasi',
        cols: 2,
        colMajor: true,
        opts: [
          { v: 'lt4', l: '< 4 jam (_< 4 hours_)' },
          { v: '4-5', l: '4-5 jam (_4-5 hours_)' },
          { v: '5-6', l: '5-6 jam (_5-6 hours_)' },
          { v: '6-7', l: '6-7 jam (_6-7 hours_)' },
          { v: '7-8', l: '7-8 jam (_7-8 hours_)' },
          { v: 'gt8', l: '> 8 jam (_> 8 hours_)' },
        ],
      },
      {
        t: 'radio',
        key: 'tidur_kualitas',
        l: 'Kualitas tidur (_Quality of sleep_) :',
        cols: 2,
        opts: [
          { v: 'dalam', l: 'Dalam/Nyenyak (_Deep sleep_)' },
          { v: 'dangkal', l: 'Dangkal/Tidak nyenyak (_Light sleep_)' },
        ],
      },
      {
        t: 'radio',
        key: 'tidur_terbangun',
        l: 'Terbangun di malam hari (_Waking up during the night_) :',
        cols: 2,
        opts: yaWith({ type: 'number', suffix: 'x/malam (_times/night_)', width: 'xs' }),
      },
      {
        t: 'radio',
        key: 'tidur_perasaan',
        l: 'Perasaan saat bangun tidur (_Feeling when waking up_)',
        cols: 2,
        opts: [
          { v: 'segar', l: 'Segar (_Fresh_)' },
          { v: 'lelah', l: 'Lelah (_Tired_)' },
        ],
      },
      {
        t: 'radio',
        key: 'tidur_siang',
        l: 'Tidur siang (_Nap time_)',
        cols: 2,
        opts: yaWith({ prefix: 'pada (_at_)', type: 'time', width: 'sm' }),
      },
      { t: 'label', l: 'Lingkungan tidur (_Sleep environment_)' },
      yn('lingkungan_gelap', 'Gelap (_Dark_) :', { bullet: true }),
      yn('lingkungan_tenang', 'Tenang (_Quiet_) :', { bullet: true }),
      yn('lingkungan_sejuk', 'Suhu sejuk (_Cool temperature_) :', { bullet: true }),
      yn('lingkungan_bebas_layar', 'Bebas layar (_Gadget-free_) :', { bullet: true }),
      {
        t: 'field',
        key: 'stop_gadget',
        l: 'Waktu berhenti menggunakan gadget sebelum tidur (_Time to stop using gadgets before sleep_) :',
        type: 'number',
        suffix: 'menit sebelum tidur (_minutes before sleep_)',
        bullet: true,
        width: 'xs',
      },
    ],
  },
  {
    id: 'stres',
    title: 'Stres dan Kesejahteraan Mental (_Stress and Mental Well-being_)',
    heading: {
      l: 'Stres dan Kesejahteraan Mental - Psikologis & Longevity',
      en: 'Stress and Mental Well-being – Psychology & Longevity',
    },
    nodes: [
      {
        t: 'p',
        l: 'Stres kronis dan kesehatan mental yang buruk sangat memengaruhi penuaan biologis.',
        en: 'Chronic stress and poor mental health strongly affect biological aging.',
      },
      { t: 'h2', l: 'Skrining kesehatan mental (_Mental health screening_)' },
      {
        t: 'radio',
        key: 'mental_bahagia',
        l: 'Seberapa sering Anda merasa bahagia atau puas dengan hidup Anda?\n_How often do you feel happy or satisfied with your life?_',
        cols: 2,
        colMajor: true,
        opts: FREQ5,
      },
      {
        t: 'radio',
        key: 'mental_cemas',
        l: 'Seberapa sering Anda merasa cemas atau sangat khawatir?\n_How often do you feel anxious or very worried?_',
        cols: 2,
        colMajor: true,
        opts: FREQ5,
      },
      {
        t: 'radio',
        key: 'mental_lelah',
        l: 'Seberapa sering Anda merasa lelah secara mental atau emosional?\n_How often do you feel mentally or emotionally exhausted?_',
        cols: 2,
        colMajor: true,
        opts: FREQ5,
      },
      {
        t: 'radio',
        key: 'aktivitas_tenang',
        l: 'Apakah Anda memiliki aktivitas yang membuat Anda merasa tenang dan bahagia?\n_Do you have any activity that makes you feel happy and calm?_',
        cols: 2,
        opts: yaWith({ placeholder: 'sebutkan', width: 'lg' }),
      },
      {
        t: 'radio',
        key: 'dukungan',
        l: 'Apakah Anda memiliki sistem dukungan yang baik? (_Do you have a good support system?_)',
        cols: 2,
        opts: yaWith({ placeholder: 'sebutkan', width: 'lg' }),
      },
      { t: 'h2', l: 'Stres terkait pekerjaan (_Work-Related Stress_)', badge: '(tidak wajib diisi)', badgeTone: 'red' },
      yn('ks_beban', 'Beban kerja melebihi waktu/kapasitas (_Work load exceeds time or capacity_)'),
      yn('ks_keterampilan', 'Pekerjaan tidak sesuai keterampilan (_Work doesn’t match skills_)'),
      yn('ks_role', 'Tugas/peran kerja tidak jelas (_Unclear job duties/roles_)'),
      yn('ks_karier', 'Hambatan pengembangan karier (_Barriers to career development_)'),
      yn('ks_shift', 'Kerja shift (_Shift work_)'),
      yn('ks_rekan', 'Konflik dengan rekan kerja (_Conflicts with colleagues_)'),
      yn('ks_keluarga', 'Konflik keluarga (_Family conflicts_)'),
      { t: 'h2', l: 'Strategi Pengelolaan Stres (_Stress Management Strategies_) :' },
      {
        t: 'field',
        key: 'strategi_stres',
        l: 'Apa yang Anda lakukan untuk mengelola stres? (_What do you do to manage stress?_)',
        type: 'textarea',
        req: true,
      },
      {
        t: 'radio',
        key: 'koneksi_sosial',
        l: 'Koneksi sosial (_Social connection_) :',
        cols: 3,
        opts: [
          { v: 'kuat', l: 'Kuat (_Strong_)' },
          { v: 'sedang', l: 'Sedang (_Moderate_)' },
          { v: 'terbatas', l: 'Terbatas (_Limited_)' },
        ],
      },
      {
        t: 'radio',
        key: 'tujuan_hidup',
        l: 'Tujuan/makna hidup (_Purpose/meaning of life_) :',
        cols: 3,
        opts: [
          { v: 'kuat', l: 'Kuat (_Strong_)' },
          { v: 'cukup', l: 'Cukup (_Moderate_)' },
          { v: 'tidak_jelas', l: 'Tidak jelas (_Unclear_)' },
        ],
      },
    ],
  },
  {
    id: 'zat',
    title: 'Penggunaan Zat & Paparan Toksin (_Substance Use and Toxin Exposure_)',
    heading: { l: 'Penggunaan Zat & Paparan Toksin (_Substance Use and Toxin Exposure_)' },
    nodes: [
      {
        t: 'radio',
        key: 'merokok',
        l: 'Merokok (_Smoking_)',
        opts: [
          {
            v: 'ya',
            l: 'Ya (_Yes_),',
            detail: { suffix: 'batang/hari atau vape/iqos (_sticks/day or vape/iqos_)', width: 'sm' },
          },
          TIDAK,
          {
            v: 'mantan',
            l: 'Mantan perokok (_former smoker_), tahun berhenti (_time of quitting smoking_)',
            detail: { type: 'number', width: 'sm', placeholder: 'tahun' },
          },
          {
            v: 'pasif',
            l: 'Perokok pasif/orang yang tidak merokok tetapi terkena paparan asap rokok dari perokok di sekitarnya\n_Passive smoker/person who does not smoke but is exposed to cigarette smoke from smokers around them_',
          },
        ],
      },
      {
        t: 'label',
        l: 'Obat & Suplemen (_Drugs and Supplements_), Mohon dicantumkan nama obat dan dosis (_please note the name and dose_) :',
      },
      { t: 'table', kind: 'meds' },
    ],
  },
  {
    id: 'matahari',
    title: 'Paparan Sinar Matahari & Kesehatan Kulit (_Sun Exposure & Skin Health_)',
    nodes: [
      { t: 'h2', l: 'Paparan Sinar matahari & Kesehatan Kulit (_Sun Exposure & Skin Health_)' },
      {
        t: 'radio',
        key: 'matahari_pola',
        l: 'Pola paparan sinar matahari (_Sun exposure pattern_) :',
        cols: 2,
        colMajor: true,
        opts: [
          { v: 'setiap_hari', l: 'Setiap hari (_Everyday_)' },
          { v: 'kadang', l: 'Kadang-kadang (_Sometimes_)' },
          { v: 'jarang', l: 'Jarang (_Seldom_)' },
          { v: 'tidak_pernah', l: 'Tidak pernah (_Never_)' },
        ],
      },
      {
        t: 'radio',
        key: 'matahari_waktu',
        l: 'Waktu berjemur (_Sunbathing time_) :',
        cols: 3,
        opts: [
          { v: '7-9', l: '07:00 – 09:00' },
          { v: '10-15', l: '10:00 – 15:00' },
          { v: '15-17', l: '15:00 – 17:00' },
        ],
      },
      {
        t: 'radio',
        key: 'sunscreen',
        l: 'Penggunaan pelindung matahari (_Use of sunscreen_) :',
        cols: 2,
        opts: yaWith({ placeholder: 'sebutkan', width: 'lg' }),
      },
    ],
  },
  {
    id: 'kerja',
    title: 'Kesehatan Kerja & Penilaian Risiko Ergonomis (_Occupational Health & Ergonomic Risk Assessment_)',
    heading: {
      l: 'Kesehatan Kerja & Penilaian Risiko Ergonomis',
      en: 'Occupational Health & Ergonomic Risk Assessment',
    },
    nodes: [
      { t: 'h2', l: 'Paparan Fisik (_Physical Exposure_) :', badge: '_(opsional sampai paling terakhir)_', badgeTone: 'red' },
      yn('fisik_bising', 'Kebisingan (_Noise_) :'),
      yn('fisik_panas', 'Panas/Bekerja pada suhu > 26 °C (_Heat/Work at temperature >26 °C_) :'),
      yn('fisik_dingin', 'Dingin/Bekerja pada suhu < 23°C (_Cold/Work at temperature <23 °C_) :'),
      yn('fisik_rad_non', 'Radiasi (non-ionisasi) (_Non-ionized radiation_) :'),
      yn('fisik_rad_ion', 'Radiasi (ionisasi) (_Ionized radiation_) :'),
      yn('fisik_getar_lokal', 'Getaran (lokal) (_Local vibration_) :'),
      yn('fisik_getar_tubuh', 'Getaran (seluruh tubuh) (_Whole body vibration_) :'),
      yn('fisik_tekanan_tinggi', 'Tekanan udara tinggi (_High pressure_) :'),
      yn('fisik_tekanan_rendah', 'Tekanan udara rendah (_Low pressure_) :'),
      { t: 'h2', l: 'Paparan Kimia (_Chemical exposure_) :' },
      ynu('kimia_debu_anorganik', 'Debu anorganik (_Inorganic dust_) :'),
      ynu('kimia_debu_organik', 'Debu organik (_Organic dust_) :'),
      ynu('kimia_berbahaya', 'Bahan kimia berbahaya (_Hazardous chemicals_) :'),
      ynu('kimia_asap', 'Asap/uap (_Fume_) :'),
      ynu('kimia_logam_berat', 'Logam berat (_Heavy metal_) :'),
      ynu('kimia_pelarut', 'Pelarut organik (_Organic solvent_) :'),
      ynu('kimia_asam', 'Iritan asam (_Acid irritant_) :'),
      ynu('kimia_basa', 'Iritan basa (_Alkaline irritant_) :'),
      ynu('kimia_pembersih', 'Cairan pembersih (_Cleaning fluid_) :'),
      ynu('kimia_pestisida', 'Pestisida (_Pesticide_) :'),
      ynu('kimia_uap_logam', 'Uap logam (_Metal vapor_) :'),
      ynu('kimia_asbes', 'Asbes (_Asbestos_) :'),
      { t: 'h2', l: 'Paparan Biologis (_Biological Exposure_) :' },
      yn('bio_mikroba', 'Bakteri/virus/jamur/parasit (_Bacteria/Virus/Fungus/Parasite_) :'),
      yn('bio_darah', 'Darah/cairan tubuh (_Blood/body fluids_) :'),
      yn('bio_serangga', 'Nyamuk/serangga (_Mosquitoes/insects_) :'),
      yn('bio_limbah', 'Limbah manusia/hewan (_Human/animal waste_) :'),
      { t: 'h2', l: 'Risiko Ergonomik (_Ergonomic Risk_):' },
      yn('ergo_tangan', 'Gerakan tangan berulang (_Repetitive hand movement_) :'),
      yn('ergo_duduk', 'Duduk lama (> 4 jam terus-menerus) (_Prolonged sitting > 4 hours continuously_) :'),
      yn('ergo_berdiri', 'Berdiri lama (> 4 jam terus-menerus) (_Standing for long periods > 4 hours continuously_) :'),
      yn('ergo_angkat', 'Mengangkat/membawa beban berat (_Lifting/carrying heavy loads_) :'),
      yn('ergo_posisi', 'Posisi tubuh yang tidak ergonomis (_Non-ergonomic body position_) :'),
      yn('ergo_cahaya', 'Pencahayaan buruk (_Poor lighting_) :'),
      yn('ergo_layar', 'Pekerjaan dengan layar (>4 jam/hari) (_Work with screen > 4 hours/day_) :'),
      yn('ergo_ketinggian', 'Bekerja di ketinggian (_Working at height_) :'),
    ],
  },
  {
    id: 'persetujuan',
    title: 'Persetujuan Medis (_Medical Approval_)',
    heading: { l: 'Persetujuan Medis (_Medical Approval_) :' },
    nodes: [{ t: 'consent' }],
  },
]

/* ------------------------------------------------------------------ */
/* Identity table (page 1)                                             */
/* ------------------------------------------------------------------ */

export interface IdentityRow {
  key: string
  l: string
  type: 'text' | 'date' | 'tel' | 'email' | 'textarea' | 'gender' | 'emergency' | 'select'
  req?: boolean
  placeholder?: string
  /** options for `type: 'select'` */
  opts?: Opt[]
}

export const MARITAL_OPTS: Opt[] = [
  { v: 'belum_menikah', l: 'Belum Menikah (_Single_)' },
  { v: 'menikah', l: 'Menikah (_Married_)' },
  { v: 'cerai_hidup', l: 'Cerai Hidup (_Divorced_)' },
  { v: 'cerai_mati', l: 'Cerai Mati (_Widowed_)' },
]

/** Relationship of the emergency contact to the patient */
export const RELATION_OPTS: Opt[] = [
  { v: 'pasangan', l: 'Suami/Istri (_Spouse_)' },
  { v: 'orang_tua', l: 'Orang Tua (_Parent_)' },
  { v: 'anak', l: 'Anak (_Child_)' },
  { v: 'saudara', l: 'Saudara Kandung (_Sibling_)' },
  { v: 'kerabat', l: 'Kerabat Lain (_Other relative_)' },
  { v: 'teman', l: 'Teman (_Friend_)' },
  { v: 'lainnya', l: 'Lainnya (_Other_)' },
]

export const IDENTITY: IdentityRow[] = [
  { key: 'nama', l: 'Nama (_Name_)', type: 'text', req: true },
  { key: 'no_rm', l: 'Nomor Rekam Medis\n_Medical Record Number_', type: 'text', placeholder: 'Kosongkan bila belum memiliki' },
  { key: 'tgl_lahir', l: 'Tanggal lahir (_Date of Birth_)', type: 'date', req: true },
  { key: 'jenis_kelamin', l: 'Jenis Kelamin (_Gender_)', type: 'gender', req: true },
  { key: 'alamat', l: 'Alamat (_Address_)', type: 'textarea' },
  { key: 'telepon', l: 'Telepon (_Phone_)', type: 'tel', req: true },
  { key: 'email', l: 'Email (_Email_)', type: 'email' },
  { key: 'tempat_bekerja', l: 'Tempat Bekerja (_Work Place_)', type: 'text' },
  { key: 'jabatan', l: 'Jabatan (_Position_)', type: 'text' },
  { key: 'status_nikah', l: 'Status Pernikahan\n_Marital Status_', type: 'select', opts: MARITAL_OPTS },
  { key: 'kontak_darurat', l: 'Kontak Darurat\n_Emergency Contact_', type: 'emergency' },
  { key: 'tgl_mcu', l: 'Tanggal MCU (_Date of MCU_)', type: 'date', req: true },
  { key: 'dokter_mcu', l: 'Dokter MCU (_MCU Doctor_)', type: 'text' },
  { key: 'paket', l: 'Program/ Paket _Programme/Package_', type: 'text' },
]

export const GENDER_OPTS: Opt[] = [
  { v: 'L', l: 'Laki-laki (_Male_)' },
  { v: 'P', l: 'Perempuan (_Female_)' },
]

/* ------------------------------------------------------------------ */
/* Required fields                                                     */
/* ------------------------------------------------------------------ */

export const plain = (t: string) => t.replace(/[_*]/g, '').replace(/\s*\n\s*/g, ' / ').trim()

export const REQUIRED: RequiredField[] = [
  ...IDENTITY.filter((r) => r.req).map((r) => ({ key: r.key, label: plain(r.l), anchor: `f-${r.key}` })),
  { key: 'strategi_stres', label: 'Strategi Pengelolaan Stres (Stress Management Strategies)', anchor: 'f-strategi_stres' },
  { key: 'consent_setuju', label: 'Persetujuan Medis — pernyataan persetujuan', anchor: 'f-consent_setuju' },
  { key: 'consent_tempat', label: 'Persetujuan Medis — tempat', anchor: 'f-consent_tempat' },
  { key: 'consent_tanggal', label: 'Persetujuan Medis — tanggal', anchor: 'f-consent_tanggal' },
  { key: 'consent_nama', label: 'Nama yang memberikan keterangan', anchor: 'f-consent_nama' },
  { key: 'consent_ttd', label: 'Tanda tangan yang memberikan keterangan', anchor: 'f-consent_ttd' },
]
export const REQUIRED_KEYS = new Set(REQUIRED.map((r) => r.key))
