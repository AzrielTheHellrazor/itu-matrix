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
    explodeLayers: string;
    collapseLayers: string;
    mfcReadout: string;
    mfcLegendMatrix: string;
    mfcLegendFibril: string;
    mfcLegendClay: string;
  };
  research: {
    eyebrow: string;
    title: string;
    subtitle: string;
    caseStudyCta: string;
    caseStudy: {
      badge: string;
      title: string;
      problemLabel: string;
      problem: string;
      methodLabel: string;
      method: string;
      resultLabel: string;
      result: string;
      teamLabel: string;
      team: string;
      guidanceLabel: string;
      guidance: string;
      close: string;
    };
    ashby: {
      eyebrow: string;
      title: string;
      xAxis: string;
      yAxis: string;
      domains: {
        id: "sustainability" | "aerospace" | "energy";
        label: string;
        material: string;
        summary: string;
      }[];
    };
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
      subtitle: "Materials R&D Team",
      overview: "Overview",
      research: "Research",
      subteams: "Team",
      achievements: "Achievements",
      partners: "Affiliation",
      toggleMenu: "Toggle navigation menu",
      switchToLight: "Switch to light theme",
      switchToDark: "Switch to dark theme",
    },
    hero: {
      eyebrow: "İTÜ · Materials R&D and Innovative Solutions Team",
      headline:
        "Engineering Matter from Atomic Lattice to Structural Performance",
      subcopy:
        "ITU MATRIX (İTÜ Malzeme Araştırma Geliştirme ve İnovatif Çözümler Takımı) is a student-led research team at Istanbul Technical University advancing sustainable composites, aerospace, energy, and advanced materials.",
      ctaResearch: "Explore Research",
      ctaSubteams: "Meet the Team",
      loadingUnitCell: "Loading Unit Cell",
      resetCamera: "Reset 3D lattice camera",
      pauseRotation: "Pause lattice rotation",
      resumeRotation: "Resume lattice rotation",
      explodeLayers: "Explode composite layers",
      collapseLayers: "Collapse composite layers",
      mfcReadout: "rPET/PP · Nanoclay MFC",
      mfcLegendMatrix: "PP Matrix",
      mfcLegendFibril: "rPET Microfibrils",
      mfcLegendClay: "Nanoclay Platelets",
    },
    research: {
      eyebrow: "Research & Focus Areas",
      title: "From Sustainable Composites to Aerospace & Energy",
      subtitle:
        "Anchored by our EELISA Special Award-winning nanoclay rPET/PP composite research and expanding into aerospace, energy, and advanced materials.",
      caseStudyCta: "Case Study",
      caseStudy: {
        badge: "MAT-01 · 4th EELISA Scientific Student Competition · Madrid",
        title: "Production and Performance Evaluation of Nanoclay Reinforced rPET/PP Microfibrillated Composites",
        problemLabel: "Challenge",
        problem:
          "Recycled PET (rPET) and polypropylene (PP) are thermodynamically immiscible, causing weak interfacial adhesion and degraded mechanical reliability in upcycled polymer blends.",
        methodLabel: "Approach",
        method:
          "In-situ microfibrillated composite (MFC) drawing aligns rPET fibrils inside the PP matrix while intercalated nanoclay platelets reinforce the interface and barrier structure.",
        resultLabel: "Outcome & Recognition",
        result:
          "Awarded the Special Award at the 4th EELISA Scientific Student Competition (21–22 May, Madrid) with İTÜ BAP LÖKAP-E funding support.",
        teamLabel: "Sustainable Materials Group",
        team: "Gökberk Gök, Selim Özbek, Cemre Haccacoğlu, Sudenaz Karadeniz, Atahan Akman, Şevval Çapak",
        guidanceLabel: "Academic Guidance",
        guidance: "Prof. Dr. M. Reza Nofar, Merve Güçlü & SGPL Team",
        close: "Close",
      },
      ashby: {
        eyebrow: "Materials Selection Matrix",
        title: "Conceptual Ashby Positioning",
        xAxis: "Thermal Stability & Circularity",
        yAxis: "Specific Strength / Stiffness",
        domains: [
          {
            id: "sustainability",
            label: "Sustainability",
            material: "rPET/PP + Nanoclay MFC",
            summary:
              "Upcycled polymer matrix reinforced via microfibrillation and nanoclay platelets for circular structural performance.",
          },
          {
            id: "aerospace",
            label: "Aerospace",
            material: "Lightweight Alloys & Composites",
            summary:
              "High strength-to-weight structural systems engineered for fatigue resistance and extreme-load reliability.",
          },
          {
            id: "energy",
            label: "Energy",
            material: "Functional & Thermal Materials",
            summary:
              "Materials tailored for clean energy conversion, thermal management, and next-generation storage systems.",
          },
        ],
      },
      projects: [
        {
          id: "eelisa-rpet-pp",
          code: "MAT-01",
          title:
            "Nanoclay Reinforced rPET/PP Microfibrillated Composites",
          domain: "Sustainable Materials · Madrid",
          summary:
            "Production and performance evaluation of nanoclay-reinforced recycled PET/PP microfibrillated composites. Awarded Special Award at the 4th EELISA Scientific Student Competition (21–22 May, Madrid) with İTÜ BAP LÖKAP-E support.",
          metrics: [
            { label: "Award", value: "EELISA Special Award" },
            { label: "Funding", value: "İTÜ BAP LÖKAP-E" },
          ],
          accent: "cyan",
        },
        {
          id: "aerospace-materials",
          code: "MAT-02",
          title: "Aerospace Materials",
          domain: "Target Focus",
          summary:
            "Lightweight structural alloys and high-performance matrix systems tailored for aerospace engineering applications.",
          metrics: [
            { label: "Domain", value: "Aerospace" },
            { label: "Status", value: "Active Roadmap" },
          ],
          accent: "violet",
        },
        {
          id: "energy-materials",
          code: "MAT-03",
          title: "Energy Materials",
          domain: "Target Focus",
          summary:
            "Next-generation functional materials supporting clean energy conversion, thermal stability, and storage architectures.",
          metrics: [
            { label: "Domain", value: "Energy Systems" },
            { label: "Status", value: "Active Roadmap" },
          ],
          accent: "amber",
        },
        {
          id: "advanced-materials",
          code: "MAT-04",
          title: "Advanced & Sustainable Materials",
          domain: "Core R&D",
          summary:
            "Circular polymer/metal matrix engineering and microstructural characterization representing İTÜ on national and international stages.",
          metrics: [
            { label: "Guidance", value: "SGPL & Faculty" },
            { label: "Mission", value: "Global Representation" },
          ],
          accent: "cyan",
        },
      ],
    },
    subteams: {
      eyebrow: "Team Structure & Academic Leadership",
      title: "People Behind ITU MATRIX",
      subtitle:
        "A multidisciplinary student research team of 15+ members guided by İTÜ Metallurgical and Materials Engineering faculty.",
      divisions: [
        {
          id: "sustainable-materials-group",
          name: "Sustainable Materials Group (EELISA Madrid)",
          focus: "Research Team",
          description:
            "Gökberk Gök, Selim Özbek, Cemre Haccacoğlu, Sudenaz Karadeniz, Atahan Akman, and Şevval Çapak — winners of the 4th EELISA Scientific Student Competition Special Award.",
          colSpan: "md:col-span-2",
        },
        {
          id: "team-captain",
          name: "S. Gökberk Gök",
          focus: "Team Captain",
          description:
            "Leading ITU MATRIX student research operations, competition strategy, and cross-disciplinary coordination.",
        },
        {
          id: "team-advisor",
          name: "Prof. Dr. Murat Baydoğan",
          focus: "Team Advisor",
          description:
            "Academic advisor guiding metallurgical research standards and institutional project development at İTÜ.",
        },
        {
          id: "supporting-dean",
          name: "Prof. Dr. Sebahattin Gürmen",
          focus: "Supporting Dean",
          description:
            "Faculty-level academic support enabling student-led materials research and international competition participation.",
        },
        {
          id: "project-guidance",
          name: "Prof. Dr. M. Reza Nofar, Merve Güçlü & SGPL",
          focus: "EELISA Project Guidance",
          description:
            "Scientific mentorship and laboratory guidance for the nanoclay reinforced rPET/PP microfibrillated composites project.",
        },
      ],
    },
    achievements: {
      eyebrow: "Achievements & Institutional Heritage",
      title: "Milestones & İTÜ Tradition",
      subtitle:
        "International recognition at EELISA Madrid built on Istanbul Technical University's 250+ year engineering heritage.",
      milestones: [
        {
          id: "eelisa-madrid",
          year: "21–22 May",
          title: "4th EELISA Scientific Student Competition — Special Award",
          context: "Madrid · İTÜ BAP LÖKAP-E",
          outcome:
            "Sustainable Materials Group earned the Special Award in Madrid for 'Production and Performance Evaluation of Nanoclay Reinforced rPET/PP Microfibrillated Composites'.",
        },
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
          id: "dept-1998",
          year: "1998",
          title: "Department of Metallurgical and Materials Engineering",
          context: "Ayazağa Campus Laboratories",
          outcome:
            "Expanded research across physical metallurgy, composites, ceramics, and microstructural characterization.",
        },
      ],
      labDomainsLabel: "Strategic Focus & Research Pillars",
      labAreas: [
        {
          id: "sustainable-mat",
          name: "Sustainable Materials",
          scope: "rPET/PP & Nanoclay Composites",
        },
        {
          id: "aerospace-mat",
          name: "Aerospace Materials",
          scope: "Lightweight Structural Systems",
        },
        {
          id: "energy-mat",
          name: "Energy Materials",
          scope: "Conversion & Storage",
        },
        {
          id: "advanced-mat",
          name: "Advanced Materials",
          scope: "Characterization & R&D",
        },
      ],
    },
    footer: {
      eyebrow: "Academic Affiliation",
      title: "ITU MATRIX",
      description:
        "İTÜ Malzeme Araştırma Geliştirme ve İnovatif Çözümler Takımı — Non-profit student research team operating within Istanbul Technical University (est. 1773), Ayazağa Campus, Maslak, Istanbul.",
      brandLine: "ITU MATRIX — Materials R&D and Innovative Solutions Team",
      campus: "Ayazağa Campus, Maslak, Istanbul",
    },
  },
  tr: {
    nav: {
      subtitle: "Malzeme Ar-Ge Takımı",
      overview: "Genel Bakış",
      research: "Araştırma",
      subteams: "Ekip",
      achievements: "Başarılar",
      partners: "Bağlılık",
      toggleMenu: "Gezinme menüsünü aç/kapat",
      switchToLight: "Açık temaya geç",
      switchToDark: "Koyu temaya geç",
    },
    hero: {
      eyebrow: "İTÜ · Malzeme Araştırma Geliştirme ve İnovatif Çözümler Takımı",
      headline:
        "Atomik Kafesten Yapısal Performansa Malzeme Mühendisliği",
      subcopy:
        "İTÜ MATRIX, İstanbul Teknik Üniversitesi bünyesinde sürdürülebilir kompozitler, havacılık, enerji ve ileri malzemeler alanlarında projeler üreten kâr amacı gütmeyen bir öğrenci araştırma takımıdır.",
      ctaResearch: "Araştırmaları İncele",
      ctaSubteams: "Ekibi Tanı",
      loadingUnitCell: "Birim Hücre Yükleniyor",
      resetCamera: "3B kafes kamerasını sıfırla",
      pauseRotation: "Kafes dönüşünü duraklat",
      resumeRotation: "Kafes dönüşünü sürdür",
      explodeLayers: "Kompozit katmanlarını ayır",
      collapseLayers: "Kompozit katmanlarını birleştir",
      mfcReadout: "rPET/PP · Nanokil MFC",
      mfcLegendMatrix: "PP Matris",
      mfcLegendFibril: "rPET Mikrofibriller",
      mfcLegendClay: "Nanokil Plakaları",
    },
    research: {
      eyebrow: "Araştırma ve Hedef Alanlar",
      title: "Sürdürülebilir Kompozitlerden Havacılık ve Enerjiye",
      subtitle:
        "Madrid'de EELISA Special Award kazanan nanokil takviyeli rPET/PP kompozit projemizden havacılık, enerji ve ileri malzemelere uzanan Ar-Ge vizyonu.",
      caseStudyCta: "Vaka İncelemesi",
      caseStudy: {
        badge: "MAT-01 · 4th EELISA Scientific Student Competition · Madrid",
        title: "Nanokil Takviyeli rPET/PP Mikrofibrillenmiş Kompozitlerin Üretimi ve Performans Değerlendirmesi",
        problemLabel: "Mühendislik Problemi",
        problem:
          "Geri dönüştürülmüş PET (rPET) ve polipropilen (PP) termodinamik olarak karışmaz; bu durum geri kazanılmış polimer harmanlarında zayıf arayüzey bağına ve mekanik performans kaybına yol açar.",
        methodLabel: "Yöntem",
        method:
          "Yerinde mikrofibrillenmiş kompozit (MFC) çekme süreci rPET fibrillerini PP matris içinde hizalarken, nanokil plakaları arayüzeyi ve bariyer yapısını güçlendirir.",
        resultLabel: "Sonuç ve Takdir",
        result:
          "İTÜ BAP LÖKAP-E desteğiyle katılınan 4th EELISA Scientific Student Competition'da (21–22 Mayıs, Madrid) Special Award kazanıldı.",
        teamLabel: "Sürdürülebilir Malzemeler Grubu",
        team: "Gökberk Gök, Selim Özbek, Cemre Haccacoğlu, Sudenaz Karadeniz, Atahan Akman, Şevval Çapak",
        guidanceLabel: "Akademik Rehberlik",
        guidance: "Prof. Dr. M. Reza Nofar, Merve Güçlü ve SGPL Ekibi",
        close: "Kapat",
      },
      ashby: {
        eyebrow: "Malzeme Seçim Matrisi",
        title: "Kavramsal Ashby Konumlandırması",
        xAxis: "Isıl Kararlılık ve Döngüsellik",
        yAxis: "Özgül Mukavemet / Rijitlik",
        domains: [
          {
            id: "sustainability",
            label: "Sürdürülebilirlik",
            material: "rPET/PP + Nanokil MFC",
            summary:
              "Mikrofibrilasyon ve nanokil plakaları ile güçlendirilmiş, döngüsel yapısal performans sunan geri dönüştürülmüş polimer matris.",
          },
          {
            id: "aerospace",
            label: "Havacılık",
            material: "Hafif Alaşımlar ve Kompozitler",
            summary:
              "Yorulma dayanımı ve yüksek yük altında güvenilirlik için tasarlanan yüksek mukavemet/ağırlık oranlı sistemler.",
          },
          {
            id: "energy",
            label: "Enerji",
            material: "Fonksiyonel ve Isıl Malzemeler",
            summary:
              "Temiz enerji dönüşümü, ısıl yönetim ve yeni nesil depolama sistemleri için geliştirilen malzemeler.",
          },
        ],
      },
      projects: [
        {
          id: "eelisa-rpet-pp",
          code: "MAT-01",
          title:
            "Nanokil Takviyeli rPET/PP Mikrofibrillenmiş Kompozitler",
          domain: "Sürdürülebilir Malzemeler · Madrid",
          summary:
            "Nanokil ile güçlendirilmiş geri dönüştürülmüş PET/PP mikrofibrillenmiş kompozitlerin üretimi ve performans değerlendirmesi. İTÜ BAP LÖKAP-E desteğiyle 4th EELISA Scientific Student Competition'da (21–22 Mayıs, Madrid) Special Award kazandı.",
          metrics: [
            { label: "Ödül", value: "EELISA Special Award" },
            { label: "Destek", value: "İTÜ BAP LÖKAP-E" },
          ],
          accent: "cyan",
        },
        {
          id: "aerospace-materials",
          code: "MAT-02",
          title: "Havacılık Malzemeleri",
          domain: "Hedef Alan",
          summary:
            "Havacılık ve uzay mühendisliği uygulamalarına yönelik hafif yapısal alaşımlar ve yüksek performanslı matris sistemleri.",
          metrics: [
            { label: "Alan", value: "Havacılık" },
            { label: "Durum", value: "Aktif Hedef" },
          ],
          accent: "violet",
        },
        {
          id: "energy-materials",
          code: "MAT-03",
          title: "Enerji Malzemeleri",
          domain: "Hedef Alan",
          summary:
            "Temiz enerji dönüşümü, ısıl kararlılık ve enerji depolama mimarilerini destekleyen yeni nesil fonksiyonel malzemeler.",
          metrics: [
            { label: "Alan", value: "Enerji Sistemleri" },
            { label: "Durum", value: "Aktif Hedef" },
          ],
          accent: "amber",
        },
        {
          id: "advanced-materials",
          code: "MAT-04",
          title: "İleri ve Sürdürülebilir Malzemeler",
          domain: "Temel Ar-Ge",
          summary:
            "İTÜ'yü ulusal ve uluslararası platformlarda temsil eden döngüsel polimer/metal matris mühendisliği ve mikroyapı karakterizasyonu.",
          metrics: [
            { label: "Rehberlik", value: "SGPL & Akademi" },
            { label: "Misyon", value: "Uluslararası Temsil" },
          ],
          accent: "cyan",
        },
      ],
    },
    subteams: {
      eyebrow: "Ekip Yapısı ve Akademik Rehberlik",
      title: "İTÜ MATRIX Kadrosu",
      subtitle:
        "İTÜ Metalurji ve Malzeme Mühendisliği akademisyenlerinin rehberliğinde çalışan 15+ kişilik öğrenci araştırma ekibi.",
      divisions: [
        {
          id: "sustainable-materials-group",
          name: "Sürdürülebilir Malzemeler Grubu (EELISA Madrid)",
          focus: "Araştırma Ekibi",
          description:
            "Gökberk Gök, Selim Özbek, Cemre Haccacoğlu, Sudenaz Karadeniz, Atahan Akman ve Şevval Çapak — 4th EELISA Scientific Student Competition Special Award sahipleri.",
          colSpan: "md:col-span-2",
        },
        {
          id: "team-captain",
          name: "S. Gökberk Gök",
          focus: "Takım Kaptanı",
          description:
            "İTÜ MATRIX öğrenci araştırma faaliyetleri, yarışma stratejisi ve disiplinlerarası koordinasyonu yürütmektedir.",
        },
        {
          id: "team-advisor",
          name: "Prof. Dr. Murat Baydoğan",
          focus: "Takım Danışmanı",
          description:
            "İTÜ bünyesinde metalurjik araştırma standartlarına ve kurumsal proje gelişimine akademik danışmanlık sağlamaktadır.",
        },
        {
          id: "supporting-dean",
          name: "Prof. Dr. Sebahattin Gürmen",
          focus: "Destekleyen Dekan",
          description:
            "Öğrenci odaklı malzeme araştırmalarını ve uluslararası yarışma katılımlarını fakülte düzeyinde desteklemektedir.",
        },
        {
          id: "project-guidance",
          name: "Prof. Dr. M. Reza Nofar, Merve Güçlü ve SGPL",
          focus: "EELISA Proje Rehberliği",
          description:
            "Nanokil takviyeli rPET/PP mikrofibrillenmiş kompozitler projesine bilimsel mentorluk ve laboratuvar rehberliği.",
        },
      ],
    },
    achievements: {
      eyebrow: "Başarılar ve Kurumsal Miras",
      title: "Ödüller ve İTÜ Geleneği",
      subtitle:
        "İstanbul Teknik Üniversitesi'nin 250 yılı aşkın mühendislik mirası üzerinde yükselen uluslararası EELISA Madrid başarısı.",
      milestones: [
        {
          id: "eelisa-madrid",
          year: "21–22 Mayıs",
          title: "4th EELISA Scientific Student Competition — Special Award",
          context: "Madrid · İTÜ BAP LÖKAP-E",
          outcome:
            "Sürdürülebilir Malzemeler Grubu, 'Production and Performance Evaluation of Nanoclay Reinforced rPET/PP Microfibrillated Composites' projesiyle Madrid'de Special Award kazandı.",
        },
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
          id: "dept-1998",
          year: "1998",
          title: "Metalurji ve Malzeme Mühendisliği Bölümü",
          context: "Ayazağa Yerleşkesi Laboratuvarları",
          outcome:
            "Fiziksel metalurji, kompozitler, seramikler ve mikroyapı karakterizasyonu alanlarında araştırma ve eğitim genişletildi.",
        },
      ],
      labDomainsLabel: "Stratejik Odak ve Araştırma Alanları",
      labAreas: [
        {
          id: "sustainable-mat",
          name: "Sürdürülebilir Malzemeler",
          scope: "rPET/PP ve Nanokil Kompozitler",
        },
        {
          id: "aerospace-mat",
          name: "Havacılık Malzemeleri",
          scope: "Hafif Yapısal Sistemler",
        },
        {
          id: "energy-mat",
          name: "Enerji Malzemeleri",
          scope: "Dönüşüm ve Depolama",
        },
        {
          id: "advanced-mat",
          name: "İleri Malzemeler",
          scope: "Karakterizasyon ve Ar-Ge",
        },
      ],
    },
    footer: {
      eyebrow: "Akademik Bağlılık",
      title: "İTÜ MATRIX",
      description:
        "İTÜ Malzeme Araştırma Geliştirme ve İnovatif Çözümler Takımı — İstanbul Teknik Üniversitesi (kur. 1773) bünyesinde kâr amacı gütmeyen öğrenci araştırma takımı, Ayazağa Yerleşkesi, Maslak, İstanbul.",
      brandLine: "İTÜ MATRIX — Malzeme Araştırma Geliştirme ve İnovatif Çözümler Takımı",
      campus: "Ayazağa Yerleşkesi, Maslak, İstanbul",
    },
  },
};
