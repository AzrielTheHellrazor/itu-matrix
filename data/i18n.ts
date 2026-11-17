import type { Lang } from "@/components/site-preferences";
import type {
  HeritageMilestone,
  LabFocusArea,
  ResearchProject,
  SubteamDivision,
} from "@/data/materials-data";

export interface SiteCopy {
  nav: {
    subtitle: string;
    overview: string;
    research: string;
    subteams: string;
    achievements: string;
    partners: string;
    toggleMenu: string;
    switchToLight: string;
    switchToDark: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subcopy: string;
    ctaResearch: string;
    ctaSubteams: string;
    loadingUnitCell: string;
    resetCamera: string;
    pauseRotation: string;
    resumeRotation: string;
  };
  research: {
    eyebrow: string;
    title: string;
    subtitle: string;
    projects: ResearchProject[];
  };
  subteams: {
    eyebrow: string;
    title: string;
    subtitle: string;
    divisions: SubteamDivision[];
  };
  achievements: {
    eyebrow: string;
    title: string;
    subtitle: string;
    milestones: HeritageMilestone[];
    labDomainsLabel: string;
    labAreas: LabFocusArea[];
  };
  footer: {
    eyebrow: string;
    title: string;
    description: string;
    brandLine: string;
    campus: string;
  };
}

export const TRANSLATIONS: Record<Lang, SiteCopy> = {
  en: {
    nav: {
      subtitle: "Materials Science",
      overview: "Overview",
      research: "Research",
      subteams: "Divisions",
      achievements: "Heritage",
      partners: "Affiliation",
      toggleMenu: "Toggle navigation menu",
      switchToLight: "Switch to light theme",
      switchToDark: "Switch to dark theme",
    },
    hero: {
      eyebrow: "İTÜ · Metallurgy & Materials Science",
      headline:
        "Engineering Matter from Atomic Lattice to Structural Performance",
      subcopy:
        "ITU Matrix is a student-led metallurgy and materials science team at Istanbul Technical University advancing alloy design, composite matrices, and microstructural characterization.",
      ctaResearch: "Explore Research",
      ctaSubteams: "View Divisions",
      loadingUnitCell: "Loading Unit Cell",
      resetCamera: "Reset 3D lattice camera",
      pauseRotation: "Pause lattice rotation",
      resumeRotation: "Resume lattice rotation",
    },
    research: {
      eyebrow: "Materials Research",
      title: "Structure, Processing, and Property Correlation",
      subtitle:
        "Four focused materials engineering tracks linking thermodynamic alloy design with laboratory characterization at İTÜ.",
      projects: [
        {
          id: "alloy-metallurgy",
          code: "MAT-01",
          title: "Alloy Design & Physical Metallurgy",
          domain: "Physical Metallurgy",
          summary:
            "Multi-component metallic alloy formulation, phase-diagram evaluation, solidification, and controlled heat-treatment routes.",
          metrics: [
            { label: "Focus", value: "Phase Stability" },
            { label: "Process", value: "Heat Treatment" },
          ],
          accent: "cyan",
        },
        {
          id: "matrix-composites",
          code: "MAT-02",
          title: "Metal & Polymer Matrix Composites",
          domain: "Composite Matrices",
          summary:
            "Particle- and fiber-reinforced matrix systems engineered for specific stiffness, interfacial bonding, and thermal resistance.",
          metrics: [
            { label: "Focus", value: "Interface Bonding" },
            { label: "Scope", value: "Matrix Laminates" },
          ],
          accent: "violet",
        },
        {
          id: "powder-ceramics",
          code: "MAT-03",
          title: "Powder Metallurgy & Ceramics",
          domain: "Particulate Processing",
          summary:
            "Metallic and ceramic fabrication through particulate blending, uniaxial compaction, and controlled-atmosphere sintering.",
          metrics: [
            { label: "Focus", value: "Densification" },
            { label: "Process", value: "Sintering Cycles" },
          ],
          accent: "amber",
        },
        {
          id: "characterization-analysis",
          code: "MAT-04",
          title: "Characterization & Phase Analysis",
          domain: "Microscopy & Testing",
          summary:
            "Structure-property correlation via optical metallography, electron microscopy, X-ray diffraction, and mechanical testing.",
          metrics: [
            { label: "Methods", value: "SEM / XRD" },
            { label: "Scope", value: "Tribology & Wear" },
          ],
          accent: "cyan",
        },
      ],
    },
    subteams: {
      eyebrow: "Technical Divisions",
      title: "Five Specialized Engineering Groups",
      subtitle:
        "Organized across metallurgical synthesis, composite manufacturing, ceramic sintering, microscopy, and academic operations.",
      divisions: [
        {
          id: "alloy-design",
          name: "Alloy Design & Physical Metallurgy",
          focus: "Thermodynamics & Casting",
          description:
            "Phase-equilibrium modeling, melting and casting workflows, and heat-treatment optimization.",
          colSpan: "md:col-span-2",
        },
        {
          id: "composites",
          name: "Composites & Polymer Matrices",
          focus: "Matrix Formulation",
          description:
            "Matrix-reinforcement selection, composite processing, and thermal-structural characterization.",
        },
        {
          id: "powder-ceramics",
          name: "Powder Metallurgy & Ceramics",
          focus: "Particulate Synthesis",
          description:
            "Powder preparation, compaction tooling, sintering kinetics, and technical ceramic systems.",
        },
        {
          id: "characterization",
          name: "Characterization & Phase Analysis",
          focus: "Microscopy & XRD",
          description:
            "Metallographic sample preparation, electron microscopy, phase identification, and hardness evaluation.",
        },
        {
          id: "operations",
          name: "Academic Coordination & Outreach",
          focus: "Lab & Industry Links",
          description:
            "Departmental laboratory coordination, material supply logistics, and academic-industry outreach.",
        },
      ],
    },
    achievements: {
      eyebrow: "Institutional Heritage",
      title: "Grounded in İTÜ Metallurgy Tradition",
      subtitle:
        "Built within Turkey's oldest engineering university and its pioneering Department of Metallurgical and Materials Engineering.",
      milestones: [
        {
          id: "itu-1773",
          year: "1773",
          title: "Foundation of Istanbul Technical University",
          context: "Institutional Heritage",
          outcome:
            "Over two and a half centuries of engineering education anchored at the Ayazağa Campus in Maslak, Istanbul.",
        },
        {
          id: "chair-1961",
          year: "1961–1962",
          title: "First Metallurgy Engineering Education in Turkey",
          context: "İTÜ Mining Faculty",
          outcome:
            "Pioneered formal metallurgy engineering instruction in Turkey, graduating its first cohort in 1963–1964.",
        },
        {
          id: "faculty-1982",
          year: "1982",
          title: "Faculty of Chemical and Metallurgical Engineering",
          context: "Kimya-Metalurji Fakültesi",
          outcome:
            "Consolidated Turkey's first Metallurgy Faculty (1977) and Chemical Engineering into an interdisciplinary faculty.",
        },
        {
          id: "dept-1998",
          year: "1998",
          title: "Department of Metallurgical and Materials Engineering",
          context: "Ayazağa Campus Laboratories",
          outcome:
            "Expanded research and teaching across physical metallurgy, particulate processing, ceramics, composites, and microscopy.",
        },
      ],
      labDomainsLabel: "Departmental Laboratory Domains",
      labAreas: [
        {
          id: "phys-met",
          name: "Physical Metallurgy & Heat Treatment",
          scope: "Alloys & Casting",
        },
        {
          id: "particulate",
          name: "Particulate Materials & Sintering",
          scope: "Powder & Ceramics",
        },
        {
          id: "composites-lab",
          name: "Composite & Polymer Matrices",
          scope: "Reinforced Systems",
        },
        {
          id: "sem-xrd",
          name: "Electron Microscopy & XRD",
          scope: "Phase Characterization",
        },
      ],
    },
    footer: {
      eyebrow: "Academic Affiliation",
      title: "ITU Matrix",
      description:
        "Operating within the academic ecosystem of Istanbul Technical University (İTÜ, est. 1773) — Faculty of Chemical and Metallurgical Engineering, Department of Metallurgical and Materials Engineering, Ayazağa Campus, Maslak, Istanbul.",
      brandLine: "ITU Matrix — Metallurgy & Materials Science",
      campus: "Ayazağa Campus, Maslak, Istanbul",
    },
  },
  tr: {
    nav: {
      subtitle: "Malzeme Bilimi",
      overview: "Genel Bakış",
      research: "Araştırma",
      subteams: "Birimler",
      achievements: "Tarihçe",
      partners: "Bağlılık",
      toggleMenu: "Gezinme menüsünü aç/kapat",
      switchToLight: "Açık temaya geç",
      switchToDark: "Koyu temaya geç",
    },
    hero: {
      eyebrow: "İTÜ · Metalurji ve Malzeme Bilimi",
      headline:
        "Atomik Kafesten Yapısal Performansa Malzeme Mühendisliği",
      subcopy:
        "İTÜ Matrix, İstanbul Teknik Üniversitesi bünyesinde alaşım tasarımı, kompozit matrisler ve mikroyapı karakterizasyonu alanlarında çalışan öğrenci odaklı bir metalurji ve malzeme bilimi takımıdır.",
      ctaResearch: "Araştırmaları İncele",
      ctaSubteams: "Birimleri Gör",
      loadingUnitCell: "Birim Hücre Yükleniyor",
      resetCamera: "3B kafes kamerasını sıfırla",
      pauseRotation: "Kafes dönüşünü duraklat",
      resumeRotation: "Kafes dönüşünü sürdür",
    },
    research: {
      eyebrow: "Malzeme Araştırmaları",
      title: "Yapı, İşlem ve Özellik İlişkisi",
      subtitle:
        "İTÜ bünyesinde termodinamik alaşım tasarımını laboratuvar karakterizasyonuyla birleştiren dört temel malzeme mühendisliği alanı.",
      projects: [
        {
          id: "alloy-metallurgy",
          code: "MAT-01",
          title: "Alaşım Tasarımı ve Fiziksel Metalurji",
          domain: "Fiziksel Metalurji",
          summary:
            "Çok bileşenli metalik alaşım formülasyonu, faz diyagramı analizi, katılaşma ve kontrollü ısıl işlem süreçleri.",
          metrics: [
            { label: "Odak", value: "Faz Kararlılığı" },
            { label: "Süreç", value: "Isıl İşlem" },
          ],
          accent: "cyan",
        },
        {
          id: "matrix-composites",
          code: "MAT-02",
          title: "Metal ve Polimer Matrisli Kompozitler",
          domain: "Kompozit Matrisler",
          summary:
            "Özgül rijitlik, arayüzey bağlanması ve ısıl dayanım için tasarlanmış parçacık ve fiber takviyeli matris sistemleri.",
          metrics: [
            { label: "Odak", value: "Arayüzey Bağı" },
            { label: "Kapsam", value: "Matris Katmanları" },
          ],
          accent: "violet",
        },
        {
          id: "powder-ceramics",
          code: "MAT-03",
          title: "Toz Metalurjisi ve Seramikler",
          domain: "Parçacık İşleme",
          summary:
            "Toz harmanlama, tek eksenli presleme ve kontrollü atmosferde sinterleme yoluyla metalik ve seramik üretim.",
          metrics: [
            { label: "Odak", value: "Yoğunlaşma" },
            { label: "Süreç", value: "Sinterleme" },
          ],
          accent: "amber",
        },
        {
          id: "characterization-analysis",
          code: "MAT-04",
          title: "Karakterizasyon ve Faz Analizi",
          domain: "Mikroskopi ve Test",
          summary:
            "Optik metalografi, elektron mikroskopisi, X-ışını kırınımı ve mekanik testlerle yapı-özellik korelasyonu.",
          metrics: [
            { label: "Yöntem", value: "SEM / XRD" },
            { label: "Kapsam", value: "Triboloji ve Aşınma" },
          ],
          accent: "cyan",
        },
      ],
    },
    subteams: {
      eyebrow: "Teknik Birimler",
      title: "Beş Uzmanlaşmış Mühendislik Grubu",
      subtitle:
        "Metalurjik sentez, kompozit üretimi, seramik sinterleme, mikroskopi ve akademik koordinasyon alanlarında yapılandırılmıştır.",
      divisions: [
        {
          id: "alloy-design",
          name: "Alaşım Tasarımı ve Fiziksel Metalurji",
          focus: "Termodinamik ve Döküm",
          description:
            "Faz dengesi modelleme, ergitme ve döküm süreçleri ile ısıl işlem optimizasyonu.",
          colSpan: "md:col-span-2",
        },
        {
          id: "composites",
          name: "Kompozitler ve Polimer Matrisler",
          focus: "Matris Formülasyonu",
          description:
            "Matris-takviye seçimi, kompozit üretimi ve ısıl-yapısal karakterizasyon.",
        },
        {
          id: "powder-ceramics",
          name: "Toz Metalurjisi ve Seramikler",
          focus: "Parçacık Sentezi",
          description:
            "Toz hazırlama, presleme kalıpları, sinterleme kinetiği ve teknik seramik sistemleri.",
        },
        {
          id: "characterization",
          name: "Karakterizasyon ve Faz Analizi",
          focus: "Mikroskopi ve XRD",
          description:
            "Metalografik numune hazırlama, elektron mikroskopisi, faz tayini ve sertlik ölçümü.",
        },
        {
          id: "operations",
          name: "Akademik Koordinasyon ve İletişim",
          focus: "Lab ve Sanayi Bağlantıları",
          description:
            "Bölüm laboratuvar koordinasyonu, malzeme tedarik lojistiği ve akademik-sanayi iletişimi.",
        },
      ],
    },
    achievements: {
      eyebrow: "Kurumsal Miras",
      title: "İTÜ Metalurji Geleneğine Dayalı",
      subtitle:
        "Türkiye'nin en köklü mühendislik üniversitesi ve öncü Metalurji ve Malzeme Mühendisliği Bölümü bünyesinde konumlanmıştır.",
      milestones: [
        {
          id: "itu-1773",
          year: "1773",
          title: "İstanbul Teknik Üniversitesi'nin Kuruluşu",
          context: "Kurumsal Miras",
          outcome:
            "Maslak Ayazağa Yerleşkesi merkezli iki buçuk yüzyılı aşkın mühendislik eğitimi geleneği.",
        },
        {
          id: "chair-1961",
          year: "1961–1962",
          title: "Türkiye'de İlk Metalurji Mühendisliği Eğitimi",
          context: "İTÜ Maden Fakültesi",
          outcome:
            "Türkiye'de örgün metalurji mühendisliği eğitimine öncülük ederek ilk mezunlarını 1963–1964'te verdi.",
        },
        {
          id: "faculty-1982",
          year: "1982",
          title: "Kimya-Metalurji Fakültesi",
          context: "Kimya-Metalurji Fakültesi",
          outcome:
            "Türkiye'nin ilk Metalurji Fakültesi (1977) ile Kimya Mühendisliği disiplinlerarası bir çatı altında birleştirildi.",
        },
        {
          id: "dept-1998",
          year: "1998",
          title: "Metalurji ve Malzeme Mühendisliği Bölümü",
          context: "Ayazağa Yerleşkesi Laboratuvarları",
          outcome:
            "Fiziksel metalurji, toz işleme, seramikler, kompozitler ve mikroskopi alanlarında araştırma ve eğitim genişletildi.",
        },
      ],
      labDomainsLabel: "Bölüm Laboratuvar Alanları",
      labAreas: [
        {
          id: "phys-met",
          name: "Fiziksel Metalurji ve Isıl İşlem",
          scope: "Alaşımlar ve Döküm",
        },
        {
          id: "particulate",
          name: "Parçacıklı Malzemeler ve Sinterleme",
          scope: "Toz ve Seramik",
        },
        {
          id: "composites-lab",
          name: "Kompozit ve Polimer Matrisler",
          scope: "Takviyeli Sistemler",
        },
        {
          id: "sem-xrd",
          name: "Elektron Mikroskopisi ve XRD",
          scope: "Faz Karakterizasyonu",
        },
      ],
    },
    footer: {
      eyebrow: "Akademik Bağlılık",
      title: "İTÜ Matrix",
      description:
        "İstanbul Teknik Üniversitesi (İTÜ, kur. 1773) akademik ekosistemi içinde — Kimya-Metalurji Fakültesi, Metalurji ve Malzeme Mühendisliği Bölümü, Ayazağa Yerleşkesi, Maslak, İstanbul.",
      brandLine: "İTÜ Matrix — Metalurji ve Malzeme Bilimi",
      campus: "Ayazağa Yerleşkesi, Maslak, İstanbul",
    },
  },
};
