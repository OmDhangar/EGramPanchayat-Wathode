export interface GalleryYear {
  id: number;
  year: string;
  description: string;
  eventCount: number;
  coverImage: string;
}

export interface Photo {
  url: string;
  caption: string;
}

export interface Event {
  id: number;
  name: string;
  date: string;
  description: string;
  photos: Photo[];
}

export interface YearGallery {
  year: string;
  description: string;
  events: Event[];
}

export const galleryYears: GalleryYear[] = [
  {
    id: 1,
    year: '2025',
    description: 'Capturing the progress and community events of our Gram Panchayat in 2025.',
    eventCount: 3,
    coverImage: 'https://images.unsplash.com/photo-1593526613712-7b4b8e8a64dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 2,
    year: '2024',
    description: 'A visual journey through the development projects and celebrations in 2024.',
    eventCount: 4,
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 3,
    year: '2023',
    description: 'Memorable moments from various initiatives and gatherings throughout 2023.',
    eventCount: 5,
    coverImage: 'https://images.unsplash.com/photo-1594708767771-a5f97143934a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 4,
    year: '2022',
    description: 'Highlights from our villages activities and achievements in 2022.',
    eventCount: 3,
    coverImage: 'https://images.unsplash.com/photo-1469571486292-b53601010b89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

const gallery2025: YearGallery = {
  year: '2025',
  description: 'A collection of photographs showcasing the various events, development projects, and community gatherings in our Gram Panchayat during 2025.',
  events: [
    {
      id: 1,
      name: 'Digital Literacy Workshop',
      date: 'March 15, 2025',
      description: 'A workshop conducted to enhance digital literacy among village residents of all age groups.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Seniors learning to use smartphones'
        },
        {
          url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Digital literacy training session'
        },
        {
          url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Youth participating in computer training'
        },
        {
          url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Group discussion on digital applications'
        }
      ]
    },
    {
      id: 2,
      name: 'New Community Center Inauguration',
      date: 'February 10, 2025',
      description: 'Inauguration ceremony of the newly constructed community center that will serve as a hub for various village activities.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Ribbon cutting ceremony'
        },
        {
          url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Community center building'
        },
        {
          url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Cultural performance at inauguration'
        },
        {
          url: 'https://images.unsplash.com/photo-1593526613712-7b4b8e8a64dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Community gathering'
        }
      ]
    },
    {
      id: 3,
      name: 'Village Cleanliness Drive',
      date: 'January 26, 2025',
      description: 'A community-led initiative to clean the village streets and public spaces on Republic Day.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1610575828349-43f195e95452?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Volunteers cleaning village pond'
        },
        {
          url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Street cleaning activity'
        },
        {
          url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Waste segregation awareness'
        },
        {
          url: 'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Community members with cleaning equipment'
        }
      ]
    }
  ]
};

const gallery2024: YearGallery = {
  year: '2024',
  description: 'Photographs from various events and development activities that took place in our Gram Panchayat during 2024.',
  events: [
    {
      id: 4,
      name: 'Farmers Training Program',
      date: 'November 12, 2024',
      description: 'Training program for farmers on modern agricultural techniques and organic farming.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Drone demonstration for crop monitoring'
        },
        {
          url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Farmers attending the training session'
        },
        {
          url: 'https://images.unsplash.com/photo-1592982573971-2c40ac8d85d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Organic farming techniques demonstration'
        },
        {
          url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Agricultural experts with farmers'
        }
      ]
    },
    {
      id: 5,
      name: 'Independence Day Celebration',
      date: 'August 15, 2024',
      description: 'Village-wide celebration of India 78th Independence Day with various cultural programs.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Flag hoisting ceremony'
        },
        {
          url: 'https://images.unsplash.com/photo-1604248324800-e9b4f1c4b8e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'School children parade'
        },
        {
          url: 'https://images.unsplash.com/photo-1596387451750-8a8a1f49a8ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Cultural dance performance'
        },
        {
          url: 'https://images.unsplash.com/photo-1469571486292-b53601010b89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Community gathering for celebrations'
        }
      ]
    },
    {
      id: 6,
      name: 'Water Conservation Project',
      date: 'June 5, 2024',
      description: 'Launch of a comprehensive water conservation project on World Environment Day.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Pond rejuvenation work'
        },
        {
          url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Rainwater harvesting structure installation'
        },
        {
          url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Tree plantation drive'
        },
        {
          url: 'https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Water conservation awareness program'
        }
      ]
    },
    {
      id: 7,
      name: 'Rural Sports Tournament',
      date: 'March 23, 2024',
      description: 'Annual sports tournament featuring traditional and modern sports competitions.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Kabaddi match'
        },
        {
          url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Running race'
        },
        {
          url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Volleyball tournament'
        },
        {
          url: 'https://images.unsplash.com/photo-1547941126-3d5322b218b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Prize distribution ceremony'
        }
      ]
    }
  ]
};

const gallery2023: YearGallery = {
  year: '2023',
  description: 'A visual record of the significant events, development projects, and community activities in our Gram Panchayat during 2023.',
  events: [
    {
      id: 8,
      name: 'Health Camp',
      date: 'December 10, 2023',
      description: 'Free health checkup camp organized for all village residents in collaboration with district hospital.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1594708767771-a5f97143934a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Doctors examining patients'
        },
        {
          url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Medical consultation'
        },
        {
          url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Blood pressure check'
        },
        {
          url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Medicine distribution'
        }
      ]
    },
    {
      id: 9,
      name: 'New Road Construction',
      date: 'October 5, 2023',
      description: 'Completion and inauguration of the newly constructed village road under PMGSY scheme.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Road inauguration ceremony'
        },
        {
          url: 'https://images.unsplash.com/photo-1506843592265-19b215c3a2c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Newly constructed road'
        },
        {
          url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Construction work in progress'
        },
        {
          url: 'https://images.unsplash.com/photo-1592833159057-6faccfc08633?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Officials inspecting the road'
        }
      ]
    },
    {
      id: 10,
      name: 'Gram Sabha Meeting',
      date: 'August 2, 2023',
      description: 'Quarterly Gram Sabha meeting to discuss village development plans and address community concerns.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1593526613712-7b4b8e8a64dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Community gathering for Gram Sabha'
        },
        {
          url: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Panchayat members addressing the meeting'
        },
        {
          url: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Villagers raising concerns'
        },
        {
          url: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Discussion on development projects'
        }
      ]
    },
    {
      id: 11,
      name: 'Women Self-Help Group Exhibition',
      date: 'May 15, 2023',
      description: 'Exhibition and sale of products made by village women self-help groups.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Women displaying handmade products'
        },
        {
          url: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Handicraft items on display'
        },
        {
          url: 'https://images.unsplash.com/photo-1509305717900-84f40e786d82?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Visitors at the exhibition'
        },
        {
          url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Self-help group meeting'
        }
      ]
    },
    {
      id: 12,
      name: 'Housing Project Completion',
      date: 'February 20, 2023',
      description: 'Completion of houses under Pradhan Mantri Awas Yojana and key handover ceremony.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Newly constructed houses'
        },
        {
          url: 'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Key handover ceremony'
        },
        {
          url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Beneficiary family in front of new home'
        },
        {
          url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Officials inspecting completed houses'
        }
      ]
    }
  ]
};

const gallery2022: YearGallery = {
  year: '2022',
  description: 'A collection of photographs from various events and activities that took place in our Gram Panchayat during 2022.',
  events: [
    {
      id: 13,
      name: 'Village School Renovation',
      date: 'December 5, 2022',
      description: 'Completion of the renovation project for the village primary school with improved facilities.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Renovated school building'
        },
        {
          url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'New classroom facilities'
        },
        {
          url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'School reopening ceremony'
        },
        {
          url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Students in the new library'
        }
      ]
    },
    {
      id: 14,
      name: 'Swachh Bharat Campaign',
      date: 'October 2, 2022',
      description: 'Special cleanliness drive conducted on Gandhi Jayanti as part of the Swachh Bharat Mission.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Volunteers cleaning village streets'
        },
        {
          url: 'https://images.unsplash.com/photo-1610575828349-43f195e95452?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Pond cleaning activity'
        },
        {
          url: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Awareness rally on cleanliness'
        },
        {
          url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Waste management demonstration'
        }
      ]
    },
    {
      id: 15,
      name: 'Diwali Celebration',
      date: 'October 24, 2022',
      description: 'Community Diwali celebration with cultural programs and lighting ceremony.',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Village decorated with lights'
        },
        {
          url: 'https://images.unsplash.com/photo-1604154894645-c96ba0fc6a45?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Diya lighting ceremony'
        },
        {
          url: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Cultural performance'
        },
        {
          url: 'https://images.unsplash.com/photo-1574265932999-5b64535a5c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          caption: 'Community feast'
        }
      ]
    }
  ]
};

// Combine all galleries
const allGalleries: YearGallery[] = [gallery2025, gallery2024, gallery2023, gallery2022];

export const getGalleryByYear = (year: string): YearGallery | null => {
  const filteredGallery = allGalleries.find(gallery => gallery.year === year);
  return filteredGallery || null;
};