export type Hospital = {
  code: string;
  name: string;
  logo: string;
  /** intrinsic logo size, so the header reserves space before the image loads */
  width: number;
  height: number;
};

/** Hospitals the form can be issued for; the first one (group logo) is the default. */
export const HOSPITALS: Hospital[] = [
  { code: "PHG", name: "Primaya Hospital Group", logo: "/logos/PHG.png", width: 2575, height: 650 },
  { code: "PEVH", name: "Primaya Evasari Hospital", logo: "/logos/PEVH.png", width: 4165, height: 650 },
  { code: "PHBP", name: "Primaya Hospital Betang Pambelum", logo: "/logos/PHBP.png", width: 1592, height: 347 },
  { code: "PHBW", name: "Primaya Hospital Bhakti Wara", logo: "/logos/PHBW.png", width: 2260, height: 900 },
  { code: "PHPC", name: "Primaya Hospital PGI Cikini", logo: "/logos/PHPC.png", width: 2047, height: 900 },
  { code: "PHRA", name: "Primaya Rajawali Hospital", logo: "/logos/PHRA.png", width: 4577, height: 650 },
  { code: "PHSW", name: "Primaya Hospital Inco Sorowako", logo: "/logos/PHSW.png", width: 4338, height: 650 },
];

export const DEFAULT_HOSPITAL = HOSPITALS[0];

export const findHospital = (code: string | null | undefined) =>
  HOSPITALS.find((h) => h.code === code?.toUpperCase()) ?? DEFAULT_HOSPITAL;
