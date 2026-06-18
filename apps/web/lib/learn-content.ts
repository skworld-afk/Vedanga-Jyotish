export type SubTopic = {
  id: string;
  title: string;
  slug: string;
};

export type Topic = {
  id: string;
  title: string;
  subtitle: string;
  subTopics: SubTopic[];
};

export const LEARN_MODULES: Topic[] = [
  {
    id: "intro",
    title: "Introduction & Definition",
    subtitle: "The Science of Light & Karma",
    subTopics: [
      { id: "intro-meaning", title: "Meaning of Jyotiṣa", slug: "intro-meaning" },
      { id: "intro-karma", title: "Karma and Destiny", slug: "intro-karma" },
    ]
  },
  {
    id: "origins",
    title: "Origins & Evolution",
    subtitle: "Vedic & Epic Literature",
    subTopics: [
      { id: "origins-vedas", title: "Vedas & Vedāṅga", slug: "origins-vedas" },
      { id: "origins-epics", title: "Rāmāyaṇa & Mahābhārata", slug: "origins-epics" },
    ]
  },
  {
    id: "texts",
    title: "Core Extant Texts",
    subtitle: "The Pillars of Jyotiṣa",
    subTopics: [
      { id: "texts-bphs", title: "Bṛhat Parāśara Horā Śāstra", slug: "texts-bphs" },
      { id: "texts-surya", title: "Sūrya Siddhānta & Sārāvalī", slug: "texts-surya" },
    ]
  }
];