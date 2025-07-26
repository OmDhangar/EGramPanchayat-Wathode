export interface SchemeYear {
  id: number;
  year: string;
  description: string;
}

export interface Scheme {
  id: number;
  name: string;
  description: string;
  year: string;
  launchDate: string;
  eligibility: string;
  agency: string;
  imageUrl: string;
}

export const schemeYears: SchemeYear[] = [
  {
    id: 1,
    year: '2025',
    description: 'Latest government schemes launched in 2025 focusing on digital infrastructure and sustainable development.'
  },
  {
    id: 2,
    year: '2024',
    description: 'Government schemes from 2024 with emphasis on rural employment and agricultural innovation.'
  },
  {
    id: 3,
    year: '2023',
    description: 'Schemes from 2023 focusing on healthcare, education, and social welfare for rural communities.'
  },
  {
    id: 4,
    year: '2022',
    description: 'Government initiatives from 2022 aimed at post-pandemic recovery and rural infrastructure development.'
  },
  {
    id: 5,
    year: '2021',
    description: 'Schemes launched in 2021 to address pandemic challenges and boost rural economy.'
  },
  {
    id: 6,
    year: '2020',
    description: 'Government programs from 2020 focusing on emergency response and essential services.'
  }
];

const schemes2025: Scheme[] = [
  {
    id: 1,
    name: 'Digital Gram Initiative',
    description: 'A comprehensive program to digitize all Gram Panchayat services and improve digital literacy among rural citizens.',
    year: '2025',
    launchDate: 'January 2025',
    eligibility: 'All rural citizens',
    agency: 'Ministry of Electronics & Information Technology',
    imageUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 2,
    name: 'Rural Startup Ecosystem',
    description: 'Financial and mentorship support for rural entrepreneurs to establish innovative startups addressing local challenges.',
    year: '2025',
    launchDate: 'March 2025',
    eligibility: 'Rural entrepreneurs aged 18-45',
    agency: 'Ministry of Skill Development and Entrepreneurship',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 3,
    name: 'Green Village Mission',
    description: 'Promoting sustainable practices in villages through renewable energy adoption, waste management, and ecological conservation.',
    year: '2025',
    launchDate: 'April 2025',
    eligibility: 'All Gram Panchayats',
    agency: 'Ministry of Environment, Forest and Climate Change',
    imageUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

const schemes2024: Scheme[] = [
  {
    id: 4,
    name: 'Kisan Drone Yojana',
    description: 'Subsidizing drone technology for farmers to monitor crops, spray pesticides, and improve agricultural productivity.',
    year: '2024',
    launchDate: 'February 2024',
    eligibility: 'Small and marginal farmers',
    agency: 'Ministry of Agriculture & Farmers Welfare',
    imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 5,
    name: 'Rural Skills Enhancement Program',
    description: 'Comprehensive skill development initiative focusing on market-relevant skills for rural youth.',
    year: '2024',
    launchDate: 'May 2024',
    eligibility: 'Rural youth aged 18-35',
    agency: 'Ministry of Skill Development and Entrepreneurship',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 6,
    name: 'Gram Swaraj Water Conservation',
    description: 'Community-led water conservation projects including rainwater harvesting, pond rejuvenation, and groundwater recharge.',
    year: '2024',
    launchDate: 'July 2024',
    eligibility: 'All Gram Panchayats',
    agency: 'Ministry of Jal Shakti',
    imageUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

const schemes2023: Scheme[] = [
  {
    id: 7,
    name: 'Pradhan Mantri Awas Yojana - Gramin (Phase III)',
    description: 'Housing for all rural families who are homeless or living in kutcha houses, with basic amenities.',
    year: '2023',
    launchDate: 'April 2023',
    eligibility: 'Rural households with inadequate housing',
    agency: 'Ministry of Rural Development',
    imageUrl: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 8,
    name: 'Ayushman Bharat Health Infrastructure Mission',
    description: 'Strengthening rural healthcare infrastructure including PHCs, CHCs, and wellness centers.',
    year: '2023',
    launchDate: 'January 2023',
    eligibility: 'All rural citizens',
    agency: 'Ministry of Health and Family Welfare',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 9,
    name: 'Mahatma Gandhi NREGA Enhancement',
    description: 'Enhanced livelihood security in rural areas by providing at least 100 days of wage employment with increased daily wages.',
    year: '2023',
    launchDate: 'February 2023',
    eligibility: 'Adult members of rural households willing to do unskilled manual work',
    agency: 'Ministry of Rural Development',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

// Combine all schemes
const allSchemes: Scheme[] = [...schemes2025, ...schemes2024, ...schemes2023];

export const getSchemesByYear = (year: string): Scheme[] | null => {
  const filteredSchemes = allSchemes.filter(scheme => scheme.year === year);
  return filteredSchemes.length > 0 ? filteredSchemes : null;
};