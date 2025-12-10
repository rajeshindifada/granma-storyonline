import { Article, Author } from './types';

export const CATEGORIES = [
  "Politics & Struggles",
  "Marxist",
  "Ambedkarite Thought",
  "Ecology",
  "Feminist Movement",
  "Youth & Students",
  "LGBTQ+ Rights",
  "Human Rights",
  "Nationality Freedom",
  "Native Culture",
  "Literature",
  "Science & Astronomy",
  "Sports",
];

export const MOCK_AUTHOR: Author = {
  id: '1',
  name: 'Arundhati V.',
  bio: 'Eco-socialist writer and activist covering the intersection of climate change and indigenous rights.',
  avatar: 'https://picsum.photos/100/100?random=99',
  socials: { twitter: '@arundhativ' }
};

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'the dialectics of climate change: why green capitalism fails',
    slug: 'dialectics-climate-change',
    subtitle: 'An analysis of how market-based solutions cannot solve the ecological rift.',
    author: MOCK_AUTHOR,
    category: 'Ecology',
    tags: ['eco-marxism', 'climate justice', 'capitalism'],
    publishDate: '2023-10-27',
    readTime: 12,
    imageUrl: 'https://picsum.photos/800/400?random=1',
    isPremium: false,
    views: 1240,
    content: [
      { type: 'paragraph', content: 'The ecological crisis is not merely a technical failure of industrial society, but a metabolic rift inherent in the capitalist mode of production...' },
      { type: 'heading', content: 'the carbon market illusion' },
      { type: 'quote', content: 'Nature is not a temple, but a workshop, and man is the laborer.', source: 'Turgenev (Critiqued)' },
      { type: 'paragraph', content: 'Carbon credits allow the global north to continue pollution while dispossessing indigenous lands in the global south under the guise of conservation.' },
      { type: 'stats', title: 'Carbon Emissions', value: '70%', desc: 'of emissions produced by top 100 companies.' }
    ]
  },
  {
    id: '2',
    title: 'ambedkar and the annihilation of caste in the digital age',
    slug: 'ambedkar-digital-age',
    subtitle: 'Revisiting the seminal text through the lens of algorithmic bias.',
    author: { ...MOCK_AUTHOR, name: 'Sujata G.' },
    category: 'Ambedkarite Thought',
    tags: ['caste', 'tech-ethics', 'social-justice'],
    publishDate: '2023-10-25',
    readTime: 8,
    imageUrl: 'https://picsum.photos/800/400?random=2',
    isPremium: true,
    views: 890,
    content: [
      { type: 'paragraph', content: 'Algorithms are not neutral. They inherit the biases of their creators and the historical datasets they are trained on.' }
    ]
  },
  {
    id: '3',
    title: 'stars over palestine: astronomy as resistance',
    slug: 'stars-over-palestine',
    subtitle: 'How amateur astronomers in occupied territories are reclaiming the sky.',
    author: { ...MOCK_AUTHOR, name: 'Rami K.' },
    category: 'Science & Astronomy',
    tags: ['science', 'liberation', 'astronomy'],
    publishDate: '2023-10-20',
    readTime: 6,
    imageUrl: 'https://picsum.photos/800/400?random=3',
    isPremium: false,
    views: 3200,
    content: [
      { type: 'paragraph', content: 'Light pollution is political. In Gaza, the darkness is forced, but the stars remain a symbol of unbordered freedom.' }
    ]
  },
  {
    id: '4',
    title: 'women in sports: breaking the binary',
    slug: 'women-sports-binary',
    subtitle: 'Trans rights are human rights on and off the field.',
    author: { ...MOCK_AUTHOR, name: 'Elena R.' },
    category: 'Sports',
    tags: ['lgbtq+', 'sports', 'feminism'],
    publishDate: '2023-10-18',
    readTime: 5,
    imageUrl: 'https://picsum.photos/800/400?random=4',
    isPremium: false,
    views: 1500,
    content: [
      { type: 'paragraph', content: 'The biological essentialism arguments used to exclude trans women from sports harm all women by policing femininity.' }
    ]
  }
];