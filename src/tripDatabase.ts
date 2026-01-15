// Comprehensive Trip Database - 100+ curated travel experiences
// These trips span various categories, price points, and destinations worldwide

// Member engagement data for social features
export interface TripMemberData {
  signedUp: Array<{ name: string; avatar: string; date: string }>;
  booked: Array<{ name: string; avatar: string; date: string; spotsReserved: number }>;
  saved: Array<{ name: string; avatar: string; savedAt: string }>;
  totalSignups: number;
  totalBooked: number;
  totalSaved: number;
  spotsLeft: number;
  maxSpots: number;
}

// Ranking and popularity data
export interface TripRankingData {
  currentRank: number;
  previousRank: number;
  rankChange: 'up' | 'down' | 'same' | 'new';
  weeklyViews: number;
  monthlyBookings: number;
  trendingScore: number; // 0-100
  popularityHistory: Array<{ week: string; rank: number; bookings: number }>;
}

// Comprehensive Member Profile for Squad matching and filtering
export type InterestCategory = 'sports' | 'entertainment' | 'lifestyle';
export type SportInterest = 'skiing' | 'surfing' | 'nba' | 'nfl' | 'mlb' | 'nhl' | 'fifa' | 'golf' | 'tennis' | 'f1' | 'mma';
export type EntertainmentInterest = 'music-festivals' | 'concerts' | 'film' | 'theater' | 'gaming' | 'anime' | 'food-tours';
export type LifestyleInterest = 'wellness' | 'yoga' | 'photography' | 'art' | 'wine-tasting' | 'nightlife' | 'eco-travel';
export type RelationshipStatus = 'single' | 'couple' | 'married' | 'family' | 'looking';
export type MBTIType = 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';
export type GroupSizePreference = 'solo' | 'duo' | 'small' | 'medium' | 'large' | 'any';
export type BudgetRange = 'budget' | 'moderate' | 'premium' | 'luxury' | 'flexible';
export type TravelMonth = 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec' | 'flexible';

export interface MemberTripHistory {
  tripId: string;
  tripTitle: string;
  status: 'signed-up' | 'booked' | 'saved' | 'created' | 'completed';
  date: string;
  location: string;
  companions?: number;
}

export interface MemberProfile {
  id: string;
  name: string;
  avatar: string;
  age: number;
  location: string;
  nationality: string;
  bio: string;
  joinedDate: string;
  // Filter fields
  interests: {
    sports: SportInterest[];
    entertainment: EntertainmentInterest[];
    lifestyle: LifestyleInterest[];
  };
  relationshipStatus: RelationshipStatus;
  mbtiType: MBTIType;
  preferredGroupSize: GroupSizePreference;
  preferredTravelMonths: TravelMonth[];
  budgetRange: BudgetRange;
  // Trip history
  tripHistory: MemberTripHistory[];
  // Stats
  tripsCompleted: number;
  tripsUpcoming: number;
  squadMemberships: string[];
}

// 30 Comprehensive Member Profiles
export const memberProfiles: MemberProfile[] = [
  {
    id: 'member-1',
    name: 'Alex Chen',
    avatar: '👨‍💼',
    age: 32,
    location: 'San Francisco, CA',
    nationality: 'US',
    bio: 'Tech entrepreneur with a passion for powder and NBA courtside experiences. Always chasing the next adventure.',
    joinedDate: 'Mar 2023',
    interests: {
      sports: ['skiing', 'nba', 'golf'],
      entertainment: ['concerts', 'gaming'],
      lifestyle: ['photography', 'wine-tasting']
    },
    relationshipStatus: 'single',
    mbtiType: 'ENTP',
    preferredGroupSize: 'small',
    preferredTravelMonths: ['jan', 'feb', 'mar', 'jul'],
    budgetRange: 'premium',
    tripHistory: [
      { tripId: '1', tripTitle: 'Niseko Powder Paradise', status: 'completed', date: 'Jan 2024', location: 'Japan' },
      { tripId: '15', tripTitle: 'NBA All-Star Weekend LA', status: 'booked', date: 'Feb 2025', location: 'Los Angeles', companions: 3 },
      { tripId: '8', tripTitle: 'Augusta Masters Experience', status: 'saved', date: 'Apr 2025', location: 'Georgia' },
      { tripId: 'custom-1', tripTitle: 'Japan Ski & Sake Tour', status: 'created', date: 'Jan 2026', location: 'Hokkaido' }
    ],
    tripsCompleted: 8,
    tripsUpcoming: 2,
    squadMemberships: ['s1', 's4']
  },
  {
    id: 'member-2',
    name: 'Sarah Johnson',
    avatar: '👩‍🦰',
    age: 28,
    location: 'Sydney, Australia',
    nationality: 'AU',
    bio: 'Marketing exec turned travel addict. Surf by day, wine by night. Building my bucket list one trip at a time.',
    joinedDate: 'Jun 2023',
    interests: {
      sports: ['surfing', 'tennis', 'skiing'],
      entertainment: ['music-festivals', 'food-tours'],
      lifestyle: ['wellness', 'yoga', 'nightlife']
    },
    relationshipStatus: 'single',
    mbtiType: 'ENFP',
    preferredGroupSize: 'medium',
    preferredTravelMonths: ['jun', 'jul', 'aug', 'dec'],
    budgetRange: 'moderate',
    tripHistory: [
      { tripId: '5', tripTitle: 'Bali Surf & Soul Retreat', status: 'completed', date: 'Aug 2024', location: 'Bali' },
      { tripId: '2', tripTitle: 'Swiss Alps Hiking Adventure', status: 'booked', date: 'Jul 2025', location: 'Switzerland', companions: 2 },
      { tripId: '12', tripTitle: 'Australian Open Experience', status: 'signed-up', date: 'Jan 2025', location: 'Melbourne' },
      { tripId: '20', tripTitle: 'Coachella Music Festival', status: 'saved', date: 'Apr 2025', location: 'California' }
    ],
    tripsCompleted: 5,
    tripsUpcoming: 3,
    squadMemberships: ['s2', 's3']
  },
  {
    id: 'member-3',
    name: 'Marcus Smith',
    avatar: '👨‍🦱',
    age: 35,
    location: 'Chicago, IL',
    nationality: 'US',
    bio: 'Former college basketball player, now the ultimate sports fan. If there\'s a game, I\'m there.',
    joinedDate: 'Jan 2023',
    interests: {
      sports: ['nba', 'nfl', 'mlb'],
      entertainment: ['concerts', 'gaming'],
      lifestyle: ['nightlife', 'photography']
    },
    relationshipStatus: 'married',
    mbtiType: 'ESFJ',
    preferredGroupSize: 'large',
    preferredTravelMonths: ['feb', 'oct', 'nov'],
    budgetRange: 'premium',
    tripHistory: [
      { tripId: '15', tripTitle: 'NBA Finals Experience', status: 'completed', date: 'Jun 2024', location: 'Boston' },
      { tripId: '16', tripTitle: 'Super Bowl LVIII Las Vegas', status: 'completed', date: 'Feb 2024', location: 'Las Vegas' },
      { tripId: '17', tripTitle: 'World Series Chicago', status: 'booked', date: 'Oct 2025', location: 'Chicago', companions: 4 },
      { tripId: '18', tripTitle: 'NBA Draft Night NYC', status: 'signed-up', date: 'Jun 2025', location: 'New York' }
    ],
    tripsCompleted: 12,
    tripsUpcoming: 2,
    squadMemberships: ['s4']
  },
  {
    id: 'member-4',
    name: 'Emma Wilson',
    avatar: '👩',
    age: 31,
    location: 'London, UK',
    nationality: 'UK',
    bio: 'Finance professional with a weakness for good food and tennis. Wimbledon is my spiritual home.',
    joinedDate: 'Apr 2023',
    interests: {
      sports: ['tennis', 'golf', 'skiing'],
      entertainment: ['theater', 'food-tours', 'film'],
      lifestyle: ['wine-tasting', 'art', 'wellness']
    },
    relationshipStatus: 'couple',
    mbtiType: 'ESTJ',
    preferredGroupSize: 'duo',
    preferredTravelMonths: ['jun', 'jul', 'dec'],
    budgetRange: 'luxury',
    tripHistory: [
      { tripId: '11', tripTitle: 'Wimbledon Championships VIP', status: 'completed', date: 'Jul 2024', location: 'London' },
      { tripId: '8', tripTitle: 'Augusta Masters Experience', status: 'booked', date: 'Apr 2025', location: 'Georgia', companions: 1 },
      { tripId: '1', tripTitle: 'Niseko Powder Paradise', status: 'saved', date: 'Jan 2026', location: 'Japan' },
      { tripId: 'custom-2', tripTitle: 'French Open & Paris Food Tour', status: 'created', date: 'May 2025', location: 'Paris' }
    ],
    tripsCompleted: 6,
    tripsUpcoming: 2,
    squadMemberships: ['s2', 's5']
  },
  {
    id: 'member-5',
    name: 'James Lee',
    avatar: '👨',
    age: 29,
    location: 'Seoul, Korea',
    nationality: 'KR',
    bio: 'K-pop industry insider by day, F1 fanatic by weekends. Living life in the fast lane.',
    joinedDate: 'Sep 2023',
    interests: {
      sports: ['f1', 'fifa', 'mma'],
      entertainment: ['concerts', 'anime', 'gaming'],
      lifestyle: ['nightlife', 'photography']
    },
    relationshipStatus: 'single',
    mbtiType: 'ENFP',
    preferredGroupSize: 'small',
    preferredTravelMonths: ['mar', 'may', 'sep', 'nov'],
    budgetRange: 'premium',
    tripHistory: [
      { tripId: '10', tripTitle: 'Monaco Grand Prix VIP', status: 'completed', date: 'May 2024', location: 'Monaco' },
      { tripId: '22', tripTitle: 'Singapore Night Race', status: 'booked', date: 'Sep 2025', location: 'Singapore', companions: 2 },
      { tripId: '23', tripTitle: 'Japan Grand Prix Suzuka', status: 'signed-up', date: 'Oct 2025', location: 'Japan' },
      { tripId: '24', tripTitle: 'UFC Fight Night Seoul', status: 'saved', date: 'Dec 2025', location: 'Seoul' }
    ],
    tripsCompleted: 4,
    tripsUpcoming: 3,
    squadMemberships: ['s6']
  },
  {
    id: 'member-6',
    name: 'Olivia Brown',
    avatar: '👩‍🦳',
    age: 45,
    location: 'Palm Beach, FL',
    nationality: 'US',
    bio: 'Golf philanthropist and luxury travel connoisseur. Life is too short for bad wine and crowded courses.',
    joinedDate: 'Feb 2023',
    interests: {
      sports: ['golf', 'tennis'],
      entertainment: ['theater', 'food-tours'],
      lifestyle: ['wine-tasting', 'art', 'wellness']
    },
    relationshipStatus: 'married',
    mbtiType: 'ESFJ',
    preferredGroupSize: 'small',
    preferredTravelMonths: ['apr', 'may', 'sep', 'oct'],
    budgetRange: 'luxury',
    tripHistory: [
      { tripId: '8', tripTitle: 'Augusta Masters Experience', status: 'completed', date: 'Apr 2024', location: 'Georgia' },
      { tripId: '25', tripTitle: 'St Andrews Open Championship', status: 'booked', date: 'Jul 2025', location: 'Scotland', companions: 1 },
      { tripId: '26', tripTitle: 'Pebble Beach Pro-Am', status: 'signed-up', date: 'Feb 2025', location: 'California' },
      { tripId: 'custom-3', tripTitle: 'European Golf Tour: Spain & Portugal', status: 'created', date: 'Oct 2025', location: 'Europe' }
    ],
    tripsCompleted: 15,
    tripsUpcoming: 3,
    squadMemberships: ['s5']
  },
  {
    id: 'member-7',
    name: 'David Kim',
    avatar: '👨‍🦲',
    age: 38,
    location: 'Seattle, WA',
    nationality: 'US',
    bio: 'Software architect who codes by day and shreds powder by winter. Mindful living, maximum adventure.',
    joinedDate: 'Nov 2022',
    interests: {
      sports: ['skiing', 'golf', 'nba'],
      entertainment: ['gaming', 'anime'],
      lifestyle: ['wellness', 'yoga', 'photography']
    },
    relationshipStatus: 'married',
    mbtiType: 'INFJ',
    preferredGroupSize: 'small',
    preferredTravelMonths: ['jan', 'feb', 'mar'],
    budgetRange: 'premium',
    tripHistory: [
      { tripId: '1', tripTitle: 'Niseko Powder Paradise', status: 'completed', date: 'Jan 2024', location: 'Japan' },
      { tripId: '3', tripTitle: 'Chamonix Extreme Skiing', status: 'completed', date: 'Feb 2024', location: 'France' },
      { tripId: '27', tripTitle: 'Whistler Backcountry Week', status: 'booked', date: 'Feb 2025', location: 'Canada', companions: 1 },
      { tripId: '28', tripTitle: 'Utah Powder Highway', status: 'saved', date: 'Mar 2025', location: 'Utah' }
    ],
    tripsCompleted: 10,
    tripsUpcoming: 1,
    squadMemberships: ['s1', 's3']
  },
  {
    id: 'member-8',
    name: 'Sophie Taylor',
    avatar: '👱‍♀️',
    age: 27,
    location: 'Amsterdam, Netherlands',
    nationality: 'NL',
    bio: 'Sustainability consultant who believes travel can change the world. Eco-conscious adventures only.',
    joinedDate: 'May 2023',
    interests: {
      sports: ['surfing', 'skiing', 'tennis'],
      entertainment: ['music-festivals', 'film'],
      lifestyle: ['eco-travel', 'yoga', 'photography']
    },
    relationshipStatus: 'looking',
    mbtiType: 'ENFJ',
    preferredGroupSize: 'medium',
    preferredTravelMonths: ['may', 'jun', 'sep'],
    budgetRange: 'moderate',
    tripHistory: [
      { tripId: '5', tripTitle: 'Bali Surf & Soul Retreat', status: 'completed', date: 'Sep 2024', location: 'Bali' },
      { tripId: '29', tripTitle: 'Costa Rica Eco Adventure', status: 'booked', date: 'May 2025', location: 'Costa Rica', companions: 3 },
      { tripId: '30', tripTitle: 'Iceland Northern Lights', status: 'signed-up', date: 'Nov 2025', location: 'Iceland' },
      { tripId: '1', tripTitle: 'Niseko Powder Paradise', status: 'saved', date: 'Jan 2026', location: 'Japan' }
    ],
    tripsCompleted: 7,
    tripsUpcoming: 2,
    squadMemberships: ['s3']
  },
  {
    id: 'member-9',
    name: 'Michael Zhang',
    avatar: '🧑‍💼',
    age: 34,
    location: 'Hong Kong',
    nationality: 'HK',
    bio: 'Investment banker seeking escape from the desk. Football fanatic with Premier League allegiances.',
    joinedDate: 'Jul 2023',
    interests: {
      sports: ['fifa', 'golf', 'f1'],
      entertainment: ['food-tours', 'concerts'],
      lifestyle: ['wine-tasting', 'nightlife']
    },
    relationshipStatus: 'single',
    mbtiType: 'ENTJ',
    preferredGroupSize: 'small',
    preferredTravelMonths: ['aug', 'dec', 'mar'],
    budgetRange: 'luxury',
    tripHistory: [
      { tripId: '31', tripTitle: 'Manchester United Old Trafford', status: 'completed', date: 'Aug 2024', location: 'Manchester' },
      { tripId: '32', tripTitle: 'El Clasico Barcelona', status: 'booked', date: 'Mar 2025', location: 'Barcelona', companions: 2 },
      { tripId: '10', tripTitle: 'Monaco Grand Prix VIP', status: 'signed-up', date: 'May 2025', location: 'Monaco' },
      { tripId: '33', tripTitle: 'World Cup 2026 Final', status: 'saved', date: 'Jul 2026', location: 'USA' }
    ],
    tripsCompleted: 5,
    tripsUpcoming: 2,
    squadMemberships: ['s6']
  },
  {
    id: 'member-10',
    name: 'Jessica Martinez',
    avatar: '👩‍💻',
    age: 30,
    location: 'Miami, FL',
    nationality: 'US',
    bio: 'UX designer with an eye for beautiful places. Formula 1 obsessed, beach-life blessed.',
    joinedDate: 'Aug 2023',
    interests: {
      sports: ['f1', 'surfing', 'tennis'],
      entertainment: ['music-festivals', 'film', 'food-tours'],
      lifestyle: ['photography', 'nightlife', 'wellness']
    },
    relationshipStatus: 'couple',
    mbtiType: 'ISFP',
    preferredGroupSize: 'duo',
    preferredTravelMonths: ['may', 'oct', 'dec'],
    budgetRange: 'premium',
    tripHistory: [
      { tripId: '34', tripTitle: 'Miami Grand Prix Weekend', status: 'completed', date: 'May 2024', location: 'Miami' },
      { tripId: '10', tripTitle: 'Monaco Grand Prix VIP', status: 'booked', date: 'May 2025', location: 'Monaco', companions: 1 },
      { tripId: '35', tripTitle: 'Abu Dhabi Season Finale', status: 'signed-up', date: 'Dec 2025', location: 'Abu Dhabi' },
      { tripId: 'custom-4', tripTitle: 'F1 European Triple Header', status: 'created', date: 'Jul 2025', location: 'Europe' }
    ],
    tripsCompleted: 6,
    tripsUpcoming: 3,
    squadMemberships: ['s2']
  },
  {
    id: 'member-11',
    name: 'Ryan Park',
    avatar: '🧑',
    age: 26,
    location: 'Los Angeles, CA',
    nationality: 'US',
    bio: 'Content creator documenting sports adventures. If it\'s epic, I\'m filming it.',
    joinedDate: 'Oct 2023',
    interests: {
      sports: ['nba', 'surfing', 'mma'],
      entertainment: ['concerts', 'film', 'gaming'],
      lifestyle: ['photography', 'nightlife']
    },
    relationshipStatus: 'single',
    mbtiType: 'ESTP',
    preferredGroupSize: 'medium',
    preferredTravelMonths: ['jun', 'jul', 'nov'],
    budgetRange: 'moderate',
    tripHistory: [
      { tripId: '15', tripTitle: 'NBA All-Star Weekend', status: 'completed', date: 'Feb 2024', location: 'Indianapolis' },
      { tripId: '36', tripTitle: 'UFC International Fight Week', status: 'booked', date: 'Jul 2025', location: 'Las Vegas', companions: 4 },
      { tripId: '37', tripTitle: 'Hawaii Surf Camp', status: 'signed-up', date: 'Aug 2025', location: 'Hawaii' },
      { tripId: '38', tripTitle: 'Lakers vs Celtics Rivalry', status: 'saved', date: 'Dec 2025', location: 'Boston' }
    ],
    tripsCompleted: 8,
    tripsUpcoming: 2,
    squadMemberships: ['s4']
  },
  {
    id: 'member-12',
    name: 'Emily Davis',
    avatar: '👩‍🎨',
    age: 33,
    location: 'Portland, OR',
    nationality: 'US',
    bio: 'Photographer capturing quiet moments around the world. Slow travel, deep experiences.',
    joinedDate: 'Dec 2022',
    interests: {
      sports: ['skiing', 'surfing', 'tennis'],
      entertainment: ['film', 'theater'],
      lifestyle: ['photography', 'art', 'wellness', 'eco-travel']
    },
    relationshipStatus: 'couple',
    mbtiType: 'INFP',
    preferredGroupSize: 'duo',
    preferredTravelMonths: ['apr', 'may', 'sep', 'oct'],
    budgetRange: 'moderate',
    tripHistory: [
      { tripId: '29', tripTitle: 'Costa Rica Eco Adventure', status: 'completed', date: 'Oct 2024', location: 'Costa Rica' },
      { tripId: '39', tripTitle: 'Japan Photography Tour', status: 'booked', date: 'Apr 2025', location: 'Japan', companions: 1 },
      { tripId: '40', tripTitle: 'Iceland Landscapes', status: 'signed-up', date: 'Sep 2025', location: 'Iceland' },
      { tripId: 'custom-5', tripTitle: 'New Zealand South Island', status: 'created', date: 'Nov 2025', location: 'New Zealand' }
    ],
    tripsCompleted: 11,
    tripsUpcoming: 3,
    squadMemberships: ['s3']
  },
  {
    id: 'member-13',
    name: 'Daniel Wong',
    avatar: '👨‍🔬',
    age: 36,
    location: 'Singapore',
    nationality: 'SG',
    bio: 'Data scientist by trade, tennis enthusiast by passion. Chasing Grand Slams around the globe.',
    joinedDate: 'Mar 2023',
    interests: {
      sports: ['tennis', 'f1', 'golf'],
      entertainment: ['food-tours', 'concerts'],
      lifestyle: ['wine-tasting', 'wellness']
    },
    relationshipStatus: 'married',
    mbtiType: 'INTP',
    preferredGroupSize: 'small',
    preferredTravelMonths: ['jan', 'may', 'jun', 'sep'],
    budgetRange: 'premium',
    tripHistory: [
      { tripId: '12', tripTitle: 'Australian Open Experience', status: 'completed', date: 'Jan 2024', location: 'Melbourne' },
      { tripId: '11', tripTitle: 'Wimbledon Championships VIP', status: 'booked', date: 'Jul 2025', location: 'London', companions: 1 },
      { tripId: '41', tripTitle: 'US Open New York', status: 'signed-up', date: 'Sep 2025', location: 'New York' },
      { tripId: '22', tripTitle: 'Singapore Night Race', status: 'saved', date: 'Sep 2025', location: 'Singapore' }
    ],
    tripsCompleted: 7,
    tripsUpcoming: 2,
    squadMemberships: ['s5']
  },
  {
    id: 'member-14',
    name: 'Ava Thompson',
    avatar: '👩‍🏫',
    age: 29,
    location: 'Denver, CO',
    nationality: 'US',
    bio: 'Elementary school teacher with summers off for adventure. Ski bum at heart, world traveler by calling.',
    joinedDate: 'Jun 2023',
    interests: {
      sports: ['skiing', 'nfl', 'mlb'],
      entertainment: ['music-festivals', 'theater'],
      lifestyle: ['eco-travel', 'photography', 'yoga']
    },
    relationshipStatus: 'single',
    mbtiType: 'ENFJ',
    preferredGroupSize: 'medium',
    preferredTravelMonths: ['jun', 'jul', 'aug', 'dec', 'jan'],
    budgetRange: 'budget',
    tripHistory: [
      { tripId: '27', tripTitle: 'Whistler Backcountry Week', status: 'completed', date: 'Feb 2024', location: 'Canada' },
      { tripId: '42', tripTitle: 'Colorado Rockies Road Trip', status: 'completed', date: 'Jul 2024', location: 'Colorado' },
      { tripId: '1', tripTitle: 'Niseko Powder Paradise', status: 'signed-up', date: 'Jan 2025', location: 'Japan' },
      { tripId: '16', tripTitle: 'Super Bowl Experience', status: 'saved', date: 'Feb 2025', location: 'New Orleans' }
    ],
    tripsCompleted: 9,
    tripsUpcoming: 1,
    squadMemberships: ['s1', 's7']
  },
  {
    id: 'member-15',
    name: 'Chris Anderson',
    avatar: '👨‍✈️',
    age: 42,
    location: 'Dallas, TX',
    nationality: 'US',
    bio: 'Airline pilot who collects airline miles and NFL games. Every stadium, every team, every season.',
    joinedDate: 'Sep 2022',
    interests: {
      sports: ['nfl', 'golf', 'nba'],
      entertainment: ['concerts', 'gaming'],
      lifestyle: ['nightlife', 'wine-tasting']
    },
    relationshipStatus: 'family',
    mbtiType: 'ESTJ',
    preferredGroupSize: 'large',
    preferredTravelMonths: ['sep', 'oct', 'nov', 'dec', 'jan'],
    budgetRange: 'premium',
    tripHistory: [
      { tripId: '16', tripTitle: 'Super Bowl LVIII Las Vegas', status: 'completed', date: 'Feb 2024', location: 'Las Vegas' },
      { tripId: '43', tripTitle: 'NFL Thanksgiving Triple Header', status: 'completed', date: 'Nov 2024', location: 'Multiple' },
      { tripId: '44', tripTitle: 'Cowboys vs Eagles Rivalry', status: 'booked', date: 'Oct 2025', location: 'Philadelphia', companions: 3 },
      { tripId: 'custom-6', tripTitle: 'Complete AFC West Tour', status: 'created', date: 'Nov 2025', location: 'West Coast' }
    ],
    tripsCompleted: 18,
    tripsUpcoming: 2,
    squadMemberships: ['s4']
  },
  {
    id: 'member-16',
    name: 'Mia Garcia',
    avatar: '💃',
    age: 25,
    location: 'Buenos Aires, Argentina',
    nationality: 'AR',
    bio: 'Professional dancer who lives for football. Boca or death. World Cup dreams.',
    joinedDate: 'Nov 2023',
    interests: {
      sports: ['fifa', 'tennis', 'mma'],
      entertainment: ['music-festivals', 'theater', 'concerts'],
      lifestyle: ['nightlife', 'art']
    },
    relationshipStatus: 'looking',
    mbtiType: 'ISFP',
    preferredGroupSize: 'medium',
    preferredTravelMonths: ['mar', 'jun', 'nov'],
    budgetRange: 'budget',
    tripHistory: [
      { tripId: '45', tripTitle: 'Boca vs River Superclasico', status: 'completed', date: 'Oct 2024', location: 'Buenos Aires' },
      { tripId: '32', tripTitle: 'El Clasico Barcelona', status: 'signed-up', date: 'Mar 2025', location: 'Barcelona' },
      { tripId: '46', tripTitle: 'Copa America 2025', status: 'saved', date: 'Jun 2025', location: 'Ecuador' },
      { tripId: '33', tripTitle: 'World Cup 2026', status: 'saved', date: 'Jul 2026', location: 'USA' }
    ],
    tripsCompleted: 3,
    tripsUpcoming: 1,
    squadMemberships: ['s6']
  },
  {
    id: 'member-17',
    name: 'Kevin Liu',
    avatar: '🧑‍🎤',
    age: 31,
    location: 'Taipei, Taiwan',
    nationality: 'TW',
    bio: 'Music producer traveling the world for inspiration. Baseball and beats are my life.',
    joinedDate: 'Apr 2023',
    interests: {
      sports: ['mlb', 'nba', 'skiing'],
      entertainment: ['concerts', 'music-festivals', 'anime'],
      lifestyle: ['nightlife', 'photography']
    },
    relationshipStatus: 'single',
    mbtiType: 'ENFP',
    preferredGroupSize: 'small',
    preferredTravelMonths: ['apr', 'jul', 'oct'],
    budgetRange: 'moderate',
    tripHistory: [
      { tripId: '47', tripTitle: 'MLB Japan Opening Series', status: 'completed', date: 'Mar 2024', location: 'Tokyo' },
      { tripId: '48', tripTitle: 'Yankees vs Red Sox Boston', status: 'booked', date: 'Jul 2025', location: 'Boston', companions: 2 },
      { tripId: '49', tripTitle: 'World Series Experience', status: 'signed-up', date: 'Oct 2025', location: 'TBD' },
      { tripId: '15', tripTitle: 'NBA All-Star Weekend', status: 'saved', date: 'Feb 2025', location: 'San Francisco' }
    ],
    tripsCompleted: 6,
    tripsUpcoming: 2,
    squadMemberships: ['s4']
  },
  {
    id: 'member-18',
    name: 'Isabella Moore',
    avatar: '👸',
    age: 28,
    location: 'Monaco',
    nationality: 'MC',
    bio: 'Luxury lifestyle blogger covering F1, tennis, and the finer things. If it sparkles, I\'m there.',
    joinedDate: 'Jan 2023',
    interests: {
      sports: ['f1', 'tennis', 'golf'],
      entertainment: ['film', 'theater', 'food-tours'],
      lifestyle: ['wine-tasting', 'art', 'wellness']
    },
    relationshipStatus: 'couple',
    mbtiType: 'ESFP',
    preferredGroupSize: 'duo',
    preferredTravelMonths: ['may', 'jun', 'jul', 'sep'],
    budgetRange: 'luxury',
    tripHistory: [
      { tripId: '10', tripTitle: 'Monaco Grand Prix VIP', status: 'completed', date: 'May 2024', location: 'Monaco' },
      { tripId: '11', tripTitle: 'Wimbledon Championships VIP', status: 'completed', date: 'Jul 2024', location: 'London' },
      { tripId: '50', tripTitle: 'Italian GP Monza Paddock', status: 'booked', date: 'Sep 2025', location: 'Monza', companions: 1 },
      { tripId: '8', tripTitle: 'Augusta Masters Experience', status: 'saved', date: 'Apr 2026', location: 'Georgia' }
    ],
    tripsCompleted: 14,
    tripsUpcoming: 1,
    squadMemberships: ['s5', 's8']
  },
  {
    id: 'member-19',
    name: 'Andrew White',
    avatar: '🤵',
    age: 40,
    location: 'Edinburgh, Scotland',
    nationality: 'UK',
    bio: 'Whisky collector and links golf purist. Chasing the perfect round on the oldest courses.',
    joinedDate: 'May 2022',
    interests: {
      sports: ['golf', 'nhl', 'fifa'],
      entertainment: ['theater', 'food-tours'],
      lifestyle: ['wine-tasting', 'art']
    },
    relationshipStatus: 'married',
    mbtiType: 'ISTJ',
    preferredGroupSize: 'small',
    preferredTravelMonths: ['apr', 'jul', 'sep'],
    budgetRange: 'luxury',
    tripHistory: [
      { tripId: '25', tripTitle: 'St Andrews Open Championship', status: 'completed', date: 'Jul 2024', location: 'Scotland' },
      { tripId: '8', tripTitle: 'Augusta Masters Experience', status: 'completed', date: 'Apr 2024', location: 'Georgia' },
      { tripId: '51', tripTitle: 'Ireland Golf Links Tour', status: 'booked', date: 'Sep 2025', location: 'Ireland', companions: 3 },
      { tripId: 'custom-7', tripTitle: 'Scotland Whisky & Golf', status: 'created', date: 'Jul 2026', location: 'Scotland' }
    ],
    tripsCompleted: 20,
    tripsUpcoming: 1,
    squadMemberships: ['s5']
  },
  {
    id: 'member-20',
    name: 'Grace Lee',
    avatar: '👩‍⚕️',
    age: 35,
    location: 'Vancouver, BC',
    nationality: 'CA',
    bio: 'ER doctor who needs mountains to decompress. Skiing is my therapy, hockey is my religion.',
    joinedDate: 'Oct 2022',
    interests: {
      sports: ['skiing', 'nhl', 'surfing'],
      entertainment: ['concerts', 'film'],
      lifestyle: ['wellness', 'yoga', 'eco-travel']
    },
    relationshipStatus: 'single',
    mbtiType: 'ISTP',
    preferredGroupSize: 'small',
    preferredTravelMonths: ['jan', 'feb', 'mar', 'dec'],
    budgetRange: 'premium',
    tripHistory: [
      { tripId: '27', tripTitle: 'Whistler Backcountry Week', status: 'completed', date: 'Feb 2024', location: 'Canada' },
      { tripId: '52', tripTitle: 'Stanley Cup Finals', status: 'completed', date: 'Jun 2024', location: 'Edmonton' },
      { tripId: '3', tripTitle: 'Chamonix Extreme Skiing', status: 'booked', date: 'Feb 2025', location: 'France', companions: 2 },
      { tripId: '53', tripTitle: 'NHL Winter Classic', status: 'signed-up', date: 'Jan 2025', location: 'Outdoor TBD' }
    ],
    tripsCompleted: 12,
    tripsUpcoming: 2,
    squadMemberships: ['s1']
  },
  {
    id: 'member-21',
    name: 'Tyler Jackson',
    avatar: '🧔',
    age: 33,
    location: 'Phoenix, AZ',
    nationality: 'US',
    bio: 'Fantasy sports champion and golf weekend warrior. Data drives my picks, sunshine drives my putts.',
    joinedDate: 'Feb 2023',
    interests: {
      sports: ['nba', 'nfl', 'golf', 'mlb'],
      entertainment: ['gaming', 'concerts'],
      lifestyle: ['nightlife', 'photography']
    },
    relationshipStatus: 'looking',
    mbtiType: 'INTP',
    preferredGroupSize: 'medium',
    preferredTravelMonths: ['feb', 'mar', 'oct'],
    budgetRange: 'moderate',
    tripHistory: [
      { tripId: '54', tripTitle: 'Phoenix Open Golf', status: 'completed', date: 'Feb 2024', location: 'Scottsdale' },
      { tripId: '15', tripTitle: 'NBA All-Star Weekend', status: 'completed', date: 'Feb 2024', location: 'Indianapolis' },
      { tripId: '55', tripTitle: 'March Madness Final Four', status: 'booked', date: 'Apr 2025', location: 'San Antonio', companions: 3 },
      { tripId: '16', tripTitle: 'Super Bowl LX', status: 'saved', date: 'Feb 2026', location: 'TBD' }
    ],
    tripsCompleted: 9,
    tripsUpcoming: 1,
    squadMemberships: ['s4']
  },
  {
    id: 'member-22',
    name: 'Chloe Harris',
    avatar: '👩‍🍳',
    age: 30,
    location: 'Lyon, France',
    nationality: 'FR',
    bio: 'Chef exploring cuisines around the world. Tennis and food tours fuel my passport stamps.',
    joinedDate: 'Jul 2023',
    interests: {
      sports: ['tennis', 'fifa', 'skiing'],
      entertainment: ['food-tours', 'film', 'theater'],
      lifestyle: ['wine-tasting', 'art', 'photography']
    },
    relationshipStatus: 'single',
    mbtiType: 'ENFJ',
    preferredGroupSize: 'small',
    preferredTravelMonths: ['may', 'jun', 'sep'],
    budgetRange: 'moderate',
    tripHistory: [
      { tripId: '56', tripTitle: 'French Open Roland Garros', status: 'completed', date: 'Jun 2024', location: 'Paris' },
      { tripId: '57', tripTitle: 'Italy Food & Tennis Tour', status: 'booked', date: 'Sep 2025', location: 'Rome', companions: 2 },
      { tripId: '11', tripTitle: 'Wimbledon Championships', status: 'signed-up', date: 'Jul 2025', location: 'London' },
      { tripId: 'custom-8', tripTitle: 'Spain Tapas & Flamenco', status: 'created', date: 'Oct 2025', location: 'Spain' }
    ],
    tripsCompleted: 8,
    tripsUpcoming: 2,
    squadMemberships: ['s2']
  },
  {
    id: 'member-23',
    name: 'Nathan Clark',
    avatar: '🕵️',
    age: 37,
    location: 'Las Vegas, NV',
    nationality: 'US',
    bio: 'Casino host turned MMA superfan. Vegas born and raised, octagon obsessed.',
    joinedDate: 'Aug 2023',
    interests: {
      sports: ['mma', 'nfl', 'nba'],
      entertainment: ['concerts', 'gaming'],
      lifestyle: ['nightlife']
    },
    relationshipStatus: 'single',
    mbtiType: 'ESTP',
    preferredGroupSize: 'large',
    preferredTravelMonths: ['jul', 'oct', 'dec'],
    budgetRange: 'premium',
    tripHistory: [
      { tripId: '36', tripTitle: 'UFC International Fight Week', status: 'completed', date: 'Jul 2024', location: 'Las Vegas' },
      { tripId: '58', tripTitle: 'UFC 300 Mega Card', status: 'completed', date: 'Apr 2024', location: 'Las Vegas' },
      { tripId: '59', tripTitle: 'UFC Abu Dhabi', status: 'booked', date: 'Oct 2025', location: 'Abu Dhabi', companions: 4 },
      { tripId: '60', tripTitle: 'Conor McGregor Return', status: 'saved', date: 'Dec 2025', location: 'TBD' }
    ],
    tripsCompleted: 11,
    tripsUpcoming: 1,
    squadMemberships: ['s4']
  },
  {
    id: 'member-24',
    name: 'Lily Robinson',
    avatar: '🧕',
    age: 27,
    location: 'Dubai, UAE',
    nationality: 'AE',
    bio: 'Fashion influencer with a love for football and luxury experiences. Style meets sport.',
    joinedDate: 'Sep 2023',
    interests: {
      sports: ['fifa', 'f1', 'tennis'],
      entertainment: ['film', 'concerts', 'food-tours'],
      lifestyle: ['art', 'nightlife', 'wellness']
    },
    relationshipStatus: 'couple',
    mbtiType: 'ESFP',
    preferredGroupSize: 'duo',
    preferredTravelMonths: ['nov', 'dec', 'mar'],
    budgetRange: 'luxury',
    tripHistory: [
      { tripId: '35', tripTitle: 'Abu Dhabi F1 Season Finale', status: 'completed', date: 'Dec 2024', location: 'Abu Dhabi' },
      { tripId: '61', tripTitle: 'PSG Champions League', status: 'booked', date: 'Mar 2025', location: 'Paris', companions: 1 },
      { tripId: '62', tripTitle: 'Dubai Tennis Championships', status: 'signed-up', date: 'Feb 2025', location: 'Dubai' },
      { tripId: '33', tripTitle: 'World Cup 2026', status: 'saved', date: 'Jul 2026', location: 'USA' }
    ],
    tripsCompleted: 5,
    tripsUpcoming: 2,
    squadMemberships: ['s6', 's8']
  },
  {
    id: 'member-25',
    name: 'Brandon Scott',
    avatar: '👷',
    age: 44,
    location: 'Detroit, MI',
    nationality: 'US',
    bio: 'Auto industry veteran and hockey die-hard. Wings forever, pistons in my blood.',
    joinedDate: 'Nov 2022',
    interests: {
      sports: ['nhl', 'nfl', 'mlb'],
      entertainment: ['concerts', 'gaming'],
      lifestyle: ['photography']
    },
    relationshipStatus: 'family',
    mbtiType: 'ISTJ',
    preferredGroupSize: 'medium',
    preferredTravelMonths: ['apr', 'jun', 'oct'],
    budgetRange: 'moderate',
    tripHistory: [
      { tripId: '52', tripTitle: 'Stanley Cup Finals', status: 'completed', date: 'Jun 2024', location: 'Florida' },
      { tripId: '63', tripTitle: 'NHL Original Six Tour', status: 'completed', date: 'Jan 2024', location: 'Multiple' },
      { tripId: '64', tripTitle: 'Red Wings vs Avalanche', status: 'booked', date: 'Feb 2025', location: 'Denver', companions: 2 },
      { tripId: 'custom-9', tripTitle: 'Hockey Hall of Fame Toronto', status: 'created', date: 'Mar 2025', location: 'Toronto' }
    ],
    tripsCompleted: 14,
    tripsUpcoming: 2,
    squadMemberships: ['s4']
  },
  {
    id: 'member-26',
    name: 'Zoe Adams',
    avatar: '💁‍♀️',
    age: 24,
    location: 'Austin, TX',
    nationality: 'US',
    bio: 'Music industry newcomer who lives for festivals and F1. Austin is home, the world is my stage.',
    joinedDate: 'Mar 2024',
    interests: {
      sports: ['f1', 'surfing', 'mma'],
      entertainment: ['music-festivals', 'concerts', 'film'],
      lifestyle: ['nightlife', 'photography', 'yoga']
    },
    relationshipStatus: 'single',
    mbtiType: 'ENFP',
    preferredGroupSize: 'large',
    preferredTravelMonths: ['mar', 'oct', 'dec'],
    budgetRange: 'budget',
    tripHistory: [
      { tripId: '65', tripTitle: 'Austin F1 US Grand Prix', status: 'completed', date: 'Oct 2024', location: 'Austin' },
      { tripId: '20', tripTitle: 'Coachella Music Festival', status: 'signed-up', date: 'Apr 2025', location: 'California' },
      { tripId: '22', tripTitle: 'Singapore Night Race', status: 'saved', date: 'Sep 2025', location: 'Singapore' },
      { tripId: '66', tripTitle: 'Ultra Music Festival', status: 'saved', date: 'Mar 2025', location: 'Miami' }
    ],
    tripsCompleted: 2,
    tripsUpcoming: 1,
    squadMemberships: ['s2']
  },
  {
    id: 'member-27',
    name: 'Justin Baker',
    avatar: '🧑‍🚀',
    age: 32,
    location: 'Houston, TX',
    nationality: 'US',
    bio: 'Aerospace engineer with NFL Sundays blocked on the calendar. Texans through thick and thin.',
    joinedDate: 'Aug 2022',
    interests: {
      sports: ['nfl', 'mlb', 'golf'],
      entertainment: ['gaming', 'film'],
      lifestyle: ['eco-travel', 'photography']
    },
    relationshipStatus: 'married',
    mbtiType: 'INTJ',
    preferredGroupSize: 'small',
    preferredTravelMonths: ['sep', 'oct', 'nov', 'jan'],
    budgetRange: 'premium',
    tripHistory: [
      { tripId: '16', tripTitle: 'Super Bowl LVIII', status: 'completed', date: 'Feb 2024', location: 'Las Vegas' },
      { tripId: '67', tripTitle: 'NFL London International', status: 'completed', date: 'Oct 2024', location: 'London' },
      { tripId: '68', tripTitle: 'College Football Playoff', status: 'booked', date: 'Jan 2025', location: 'Multiple', companions: 1 },
      { tripId: '69', tripTitle: 'Super Bowl LX', status: 'saved', date: 'Feb 2026', location: 'TBD' }
    ],
    tripsCompleted: 10,
    tripsUpcoming: 1,
    squadMemberships: ['s4']
  },
  {
    id: 'member-28',
    name: 'Hannah Nelson',
    avatar: '👩‍🔧',
    age: 29,
    location: 'Munich, Germany',
    nationality: 'DE',
    bio: 'Automotive engineer and Bundesliga devotee. Bayern Munich is life, the Autobahn is a playground.',
    joinedDate: 'Jan 2024',
    interests: {
      sports: ['fifa', 'f1', 'skiing'],
      entertainment: ['concerts', 'food-tours'],
      lifestyle: ['nightlife', 'photography']
    },
    relationshipStatus: 'looking',
    mbtiType: 'ESTJ',
    preferredGroupSize: 'medium',
    preferredTravelMonths: ['jun', 'aug', 'dec'],
    budgetRange: 'moderate',
    tripHistory: [
      { tripId: '70', tripTitle: 'Bayern Munich Allianz Arena', status: 'completed', date: 'Aug 2024', location: 'Munich' },
      { tripId: '71', tripTitle: 'Euro 2024 Germany', status: 'completed', date: 'Jul 2024', location: 'Germany' },
      { tripId: '32', tripTitle: 'El Clasico Barcelona', status: 'booked', date: 'Mar 2025', location: 'Barcelona', companions: 3 },
      { tripId: '1', tripTitle: 'Niseko Powder Paradise', status: 'saved', date: 'Jan 2026', location: 'Japan' }
    ],
    tripsCompleted: 4,
    tripsUpcoming: 1,
    squadMemberships: ['s6']
  },
  {
    id: 'member-29',
    name: 'Eric Hill',
    avatar: '🤴',
    age: 48,
    location: 'Scottsdale, AZ',
    nationality: 'US',
    bio: 'Retired tech exec living the dream. Golf, wine, and watching my kids play college sports.',
    joinedDate: 'Jun 2022',
    interests: {
      sports: ['golf', 'tennis', 'nfl'],
      entertainment: ['theater', 'food-tours'],
      lifestyle: ['wine-tasting', 'wellness', 'art']
    },
    relationshipStatus: 'family',
    mbtiType: 'ESTJ',
    preferredGroupSize: 'small',
    preferredTravelMonths: ['feb', 'apr', 'oct'],
    budgetRange: 'luxury',
    tripHistory: [
      { tripId: '54', tripTitle: 'Phoenix Open Golf', status: 'completed', date: 'Feb 2024', location: 'Scottsdale' },
      { tripId: '8', tripTitle: 'Augusta Masters Experience', status: 'completed', date: 'Apr 2024', location: 'Georgia' },
      { tripId: '72', tripTitle: 'Ryder Cup Europe', status: 'booked', date: 'Sep 2025', location: 'Ireland', companions: 3 },
      { tripId: 'custom-10', tripTitle: 'Napa Wine & Golf Retreat', status: 'created', date: 'Oct 2025', location: 'California' }
    ],
    tripsCompleted: 22,
    tripsUpcoming: 1,
    squadMemberships: ['s5', 's7']
  },
  {
    id: 'member-30',
    name: 'Natalie Young',
    avatar: '🙋‍♀️',
    age: 26,
    location: 'Melbourne, Australia',
    nationality: 'AU',
    bio: 'Sports physio who treats athletes and chases waves. Aussie Open by day, Bells Beach by weekend.',
    joinedDate: 'Dec 2023',
    interests: {
      sports: ['tennis', 'surfing', 'f1'],
      entertainment: ['music-festivals', 'concerts'],
      lifestyle: ['wellness', 'yoga', 'eco-travel']
    },
    relationshipStatus: 'single',
    mbtiType: 'ESFP',
    preferredGroupSize: 'medium',
    preferredTravelMonths: ['jan', 'mar', 'jul'],
    budgetRange: 'moderate',
    tripHistory: [
      { tripId: '12', tripTitle: 'Australian Open Experience', status: 'completed', date: 'Jan 2024', location: 'Melbourne' },
      { tripId: '73', tripTitle: 'Great Ocean Road Surf Trip', status: 'completed', date: 'Mar 2024', location: 'Victoria' },
      { tripId: '74', tripTitle: 'Bali Surf & Yoga Retreat', status: 'booked', date: 'Jul 2025', location: 'Bali', companions: 2 },
      { tripId: '75', tripTitle: 'Australian GP Melbourne', status: 'signed-up', date: 'Mar 2025', location: 'Melbourne' }
    ],
    tripsCompleted: 6,
    tripsUpcoming: 2,
    squadMemberships: ['s2', 's3']
  }
];

// Helper functions for filtering members
export const getMembersByInterest = (interest: SportInterest | EntertainmentInterest | LifestyleInterest) => {
  return memberProfiles.filter(m =>
    m.interests.sports.includes(interest as SportInterest) ||
    m.interests.entertainment.includes(interest as EntertainmentInterest) ||
    m.interests.lifestyle.includes(interest as LifestyleInterest)
  );
};

export const getMembersByMBTI = (mbtiType: MBTIType) => {
  return memberProfiles.filter(m => m.mbtiType === mbtiType);
};

export const getMembersByMBTICategory = (category: 'analysts' | 'diplomats' | 'sentinels' | 'explorers') => {
  const mbtiGroups = {
    analysts: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
    diplomats: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
    sentinels: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
    explorers: ['ISTP', 'ISFP', 'ESTP', 'ESFP']
  };
  return memberProfiles.filter(m => mbtiGroups[category].includes(m.mbtiType));
};

export const getMembersByRelationshipStatus = (status: RelationshipStatus) => {
  return memberProfiles.filter(m => m.relationshipStatus === status);
};

export const getMembersByGroupSize = (size: GroupSizePreference) => {
  return memberProfiles.filter(m => m.preferredGroupSize === size || m.preferredGroupSize === 'any');
};

export const getMembersByBudget = (budget: BudgetRange) => {
  return memberProfiles.filter(m => m.budgetRange === budget || m.budgetRange === 'flexible');
};

export const getMembersByTravelMonth = (month: TravelMonth) => {
  return memberProfiles.filter(m => m.preferredTravelMonths.includes(month) || m.preferredTravelMonths.includes('flexible'));
};

export const getMemberTripsByStatus = (memberId: string, status: MemberTripHistory['status']) => {
  const member = memberProfiles.find(m => m.id === memberId);
  return member?.tripHistory.filter(t => t.status === status) || [];
};

export const getMembersWithUpcomingTrips = () => {
  return memberProfiles.filter(m => m.tripsUpcoming > 0);
};

export const getMostActiveTravelers = (limit = 10) => {
  return [...memberProfiles].sort((a, b) => b.tripsCompleted - a.tripsCompleted).slice(0, limit);
};

export interface TripListing {
  id: string;
  title: string;
  host: string;
  location: string;
  country: string;
  continent: string;
  image: string;
  price: string;
  priceValue: number; // For filtering
  dates: string;
  duration: string;
  durationDays: number; // For filtering
  rating: number;
  reviewCount: number;
  tags: string[];
  category: 'adventure' | 'sports' | 'wellness' | 'cultural' | 'beach' | 'nature' | 'luxury' | 'budget' | 'family' | 'romantic';
  activityLevel: 'low' | 'moderate' | 'high' | 'extreme';
  groupSize: 'solo-friendly' | 'couples' | 'small-group' | 'large-group' | 'any';
  bestFor: string[];
  highlights: string[];
  included: string[];
  description: string;
  // New social and ranking data
  memberData?: TripMemberData;
  rankingData?: TripRankingData;
}

// Helper to generate unique IDs
let idCounter = 1;
const genId = () => String(idCounter++);

// Sample member names and avatars for social data
const sampleMembers = [
  { name: 'Alex Chen', avatar: '👨‍💼' },
  { name: 'Sarah Johnson', avatar: '👩‍🦰' },
  { name: 'Marcus Smith', avatar: '👨‍🦱' },
  { name: 'Emma Wilson', avatar: '👩' },
  { name: 'James Lee', avatar: '👨' },
  { name: 'Olivia Brown', avatar: '👩‍🦳' },
  { name: 'David Kim', avatar: '👨‍🦲' },
  { name: 'Sophie Taylor', avatar: '👱‍♀️' },
  { name: 'Michael Zhang', avatar: '🧑‍💼' },
  { name: 'Jessica Martinez', avatar: '👩‍💻' },
  { name: 'Ryan Park', avatar: '🧑' },
  { name: 'Emily Davis', avatar: '👩‍🎨' },
  { name: 'Daniel Wong', avatar: '👨‍🔬' },
  { name: 'Ava Thompson', avatar: '👩‍🏫' },
  { name: 'Chris Anderson', avatar: '👨‍✈️' },
  { name: 'Mia Garcia', avatar: '💃' },
  { name: 'Kevin Liu', avatar: '🧑‍🎤' },
  { name: 'Isabella Moore', avatar: '👸' },
  { name: 'Andrew White', avatar: '🤵' },
  { name: 'Grace Lee', avatar: '👩‍⚕️' },
  { name: 'Tyler Jackson', avatar: '🧔' },
  { name: 'Chloe Harris', avatar: '👩‍🍳' },
  { name: 'Nathan Clark', avatar: '🕵️' },
  { name: 'Lily Robinson', avatar: '🧕' },
  { name: 'Brandon Scott', avatar: '👷' },
  { name: 'Zoe Adams', avatar: '💁‍♀️' },
  { name: 'Justin Baker', avatar: '🧑‍🚀' },
  { name: 'Hannah Nelson', avatar: '👩‍🔧' },
  { name: 'Eric Hill', avatar: '🤴' },
  { name: 'Natalie Young', avatar: '🙋‍♀️' },
];

// Generate random member data for a trip
const generateMemberData = (seed: number): TripMemberData => {
  const maxSpots = 8 + (seed % 8); // 8-16 spots
  const bookedCount = Math.floor(seed % 6) + 1; // 1-6 booked
  const signedUpCount = Math.floor((seed * 2) % 4); // 0-3 signed up (interested)
  const savedCount = Math.floor((seed * 3) % 8) + 2; // 2-9 saved

  const shuffled = [...sampleMembers].sort(() => 0.5 - Math.sin(seed));

  const booked = shuffled.slice(0, bookedCount).map((m, i) => ({
    ...m,
    date: `${['Jan', 'Feb', 'Mar', 'Dec'][i % 4]} ${10 + i}, 2024`,
    spotsReserved: 1 + (i % 2)
  }));

  const signedUp = shuffled.slice(bookedCount, bookedCount + signedUpCount).map((m, i) => ({
    ...m,
    date: `${['Jan', 'Feb', 'Mar'][i % 3]} ${5 + i}, 2024`
  }));

  const saved = shuffled.slice(bookedCount + signedUpCount, bookedCount + signedUpCount + savedCount).map((m, i) => ({
    ...m,
    savedAt: `${i + 1} day${i > 0 ? 's' : ''} ago`
  }));

  return {
    signedUp,
    booked,
    saved,
    totalSignups: signedUpCount,
    totalBooked: bookedCount,
    totalSaved: savedCount,
    spotsLeft: maxSpots - booked.reduce((acc, b) => acc + b.spotsReserved, 0),
    maxSpots
  };
};

// Generate ranking data for a trip
const generateRankingData = (seed: number, totalTrips: number): TripRankingData => {
  const currentRank = (seed % totalTrips) + 1;
  const previousRank = currentRank + (seed % 5) - 2; // +/- 2 positions
  const rankChange: 'up' | 'down' | 'same' | 'new' =
    currentRank < previousRank ? 'up' :
    currentRank > previousRank ? 'down' :
    seed % 10 === 0 ? 'new' : 'same';

  return {
    currentRank,
    previousRank: Math.max(1, previousRank),
    rankChange,
    weeklyViews: 100 + (seed * 17) % 900, // 100-1000 views
    monthlyBookings: 5 + (seed * 3) % 25, // 5-30 bookings
    trendingScore: 30 + (seed * 7) % 70, // 30-100 score
    popularityHistory: [
      { week: 'Week 1', rank: currentRank + 5, bookings: 3 + (seed % 5) },
      { week: 'Week 2', rank: currentRank + 3, bookings: 4 + (seed % 6) },
      { week: 'Week 3', rank: currentRank + 1, bookings: 5 + (seed % 7) },
      { week: 'Week 4', rank: currentRank, bookings: 6 + (seed % 8) },
    ]
  };
};

export const tripDatabase: TripListing[] = [
  // ============ ADVENTURE TRIPS ============
  {
    id: genId(),
    title: 'Niseko Powder Paradise',
    host: 'Pure Ski Japan',
    location: 'Niseko, Hokkaido',
    country: 'Japan',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800',
    price: '$2,450',
    priceValue: 2450,
    dates: 'Jan 15-22, 2025',
    duration: '7 days',
    durationDays: 7,
    rating: 4.9,
    reviewCount: 234,
    tags: ['Skiing', 'Powder', 'Onsen', 'Japanese Culture'],
    category: 'adventure',
    activityLevel: 'high',
    groupSize: 'small-group',
    bestFor: ['Skiers', 'Snow lovers', 'Foodies'],
    highlights: ['World-famous powder snow', 'Traditional onsen experience', 'Local sake tasting'],
    included: ['Lift passes', 'Accommodation', 'Airport transfers', 'Daily breakfast'],
    description: 'Experience the legendary powder snow of Niseko with guided skiing, authentic Japanese culture, and relaxing hot springs after each day on the mountain.'
  },
  {
    id: genId(),
    title: 'Swiss Alps Hiking Adventure',
    host: 'Alpine Explorers',
    location: 'Zermatt',
    country: 'Switzerland',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800',
    price: '$3,200',
    priceValue: 3200,
    dates: 'Jul 1-10, 2025',
    duration: '10 days',
    durationDays: 10,
    rating: 4.95,
    reviewCount: 189,
    tags: ['Hiking', 'Mountains', 'Scenic', 'Photography'],
    category: 'adventure',
    activityLevel: 'high',
    groupSize: 'small-group',
    bestFor: ['Hikers', 'Nature lovers', 'Photographers'],
    highlights: ['Matterhorn views', 'Glacier hiking', 'Mountain hut stays'],
    included: ['Guide', 'Accommodations', 'Most meals', 'Transfers'],
    description: 'Trek through the stunning Swiss Alps with views of the iconic Matterhorn, staying in authentic mountain huts and experiencing alpine culture.'
  },
  {
    id: genId(),
    title: 'Patagonia Trek Expedition',
    host: 'Andean Trails',
    location: 'Torres del Paine',
    country: 'Chile',
    continent: 'South America',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    price: '$2,890',
    priceValue: 2890,
    dates: 'Nov 5-14, 2025',
    duration: '10 days',
    durationDays: 10,
    rating: 4.85,
    reviewCount: 156,
    tags: ['Trekking', 'Wilderness', 'Glaciers', 'Wildlife'],
    category: 'adventure',
    activityLevel: 'extreme',
    groupSize: 'small-group',
    bestFor: ['Experienced hikers', 'Adventure seekers', 'Nature photographers'],
    highlights: ['W Trek', 'Grey Glacier', 'Guanaco spotting'],
    included: ['Camping gear', 'Guide', 'Park fees', 'Meals on trek'],
    description: 'Conquer the legendary W Trek through Patagonia\'s most dramatic landscapes - towering granite spires, ancient glaciers, and pristine wilderness.'
  },
  {
    id: genId(),
    title: 'Iceland Ring Road Adventure',
    host: 'Nordic Ventures',
    location: 'Reykjavik to Reykjavik',
    country: 'Iceland',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=800',
    price: '$3,500',
    priceValue: 3500,
    dates: 'Aug 10-20, 2025',
    duration: '11 days',
    durationDays: 11,
    rating: 4.9,
    reviewCount: 312,
    tags: ['Road Trip', 'Waterfalls', 'Northern Lights', 'Geothermal'],
    category: 'adventure',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Road trippers', 'Photographers', 'Nature lovers'],
    highlights: ['Golden Circle', 'Glacier lagoon', 'Whale watching'],
    included: ['4x4 vehicle', 'Accommodation', 'Breakfast', 'Guide'],
    description: 'Circle the land of fire and ice on this epic road trip through waterfalls, volcanoes, glaciers, and the most otherworldly landscapes on Earth.'
  },
  {
    id: genId(),
    title: 'New Zealand Adventure Week',
    host: 'Kiwi Expeditions',
    location: 'South Island',
    country: 'New Zealand',
    continent: 'Oceania',
    image: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=800',
    price: '$2,950',
    priceValue: 2950,
    dates: 'Feb 15-23, 2025',
    duration: '9 days',
    durationDays: 9,
    rating: 4.85,
    reviewCount: 198,
    tags: ['Multi-sport', 'Scenic', 'Adrenaline', 'Lord of the Rings'],
    category: 'adventure',
    activityLevel: 'high',
    groupSize: 'small-group',
    bestFor: ['Thrill seekers', 'Movie fans', 'Outdoor enthusiasts'],
    highlights: ['Queenstown adventures', 'Milford Sound cruise', 'Bungee jumping'],
    included: ['Transport', 'Accommodation', 'Key activities', 'Guide'],
    description: 'The ultimate South Island adventure combining hiking, kayaking, and optional adrenaline activities in Middle-earth\'s most stunning landscapes.'
  },
  {
    id: genId(),
    title: 'Costa Rica Rainforest Expedition',
    host: 'Pura Vida Adventures',
    location: 'Arenal & Manuel Antonio',
    country: 'Costa Rica',
    continent: 'Central America',
    image: 'https://images.unsplash.com/photo-1518182170546-07661fd94144?w=800',
    price: '$1,890',
    priceValue: 1890,
    dates: 'Mar 1-8, 2025',
    duration: '8 days',
    durationDays: 8,
    rating: 4.8,
    reviewCount: 267,
    tags: ['Rainforest', 'Wildlife', 'Zip-lining', 'Beaches'],
    category: 'adventure',
    activityLevel: 'moderate',
    groupSize: 'any',
    bestFor: ['Wildlife lovers', 'Families', 'Adventure beginners'],
    highlights: ['Arenal Volcano', 'Sloth spotting', 'Zip-line canopy tour'],
    included: ['Hotels', 'Breakfast', 'Tours', 'Transfers'],
    description: 'Explore Costa Rica\'s incredible biodiversity from volcanic hot springs to pristine beaches, with zip-lining through the rainforest canopy.'
  },
  {
    id: genId(),
    title: 'Morocco Desert & Mountains',
    host: 'Sahara Dreams',
    location: 'Marrakech to Sahara',
    country: 'Morocco',
    continent: 'Africa',
    image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800',
    price: '$1,650',
    priceValue: 1650,
    dates: 'Oct 5-14, 2025',
    duration: '10 days',
    durationDays: 10,
    rating: 4.75,
    reviewCount: 423,
    tags: ['Desert', 'Culture', 'Camel trek', 'Souks'],
    category: 'adventure',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Culture seekers', 'Photographers', 'Solo travelers'],
    highlights: ['Sahara camping', 'Atlas Mountains', 'Marrakech medina'],
    included: ['Riads', 'Transport', 'Desert camp', 'Some meals'],
    description: 'Journey from the bustling souks of Marrakech through the Atlas Mountains to sleep under the stars in a Sahara desert camp.'
  },
  {
    id: genId(),
    title: 'Colorado Backcountry Skiing',
    host: 'Powder Hounds',
    location: 'Aspen & Vail',
    country: 'USA',
    continent: 'North America',
    image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800',
    price: '$3,800',
    priceValue: 3800,
    dates: 'Feb 1-7, 2025',
    duration: '7 days',
    durationDays: 7,
    rating: 4.85,
    reviewCount: 145,
    tags: ['Skiing', 'Backcountry', 'Powder', 'Luxury'],
    category: 'adventure',
    activityLevel: 'extreme',
    groupSize: 'small-group',
    bestFor: ['Expert skiers', 'Powder chasers', 'Luxury lovers'],
    highlights: ['Cat skiing', 'Private guides', 'Après ski culture'],
    included: ['Lodging', 'Guides', 'Equipment', 'Meals'],
    description: 'Access Colorado\'s best backcountry terrain with expert guides, cat skiing, and luxury lodge accommodations after epic powder days.'
  },
  {
    id: genId(),
    title: 'Scottish Highlands Explorer',
    host: 'Celtic Adventures',
    location: 'Edinburgh to Skye',
    country: 'Scotland',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    price: '$2,100',
    priceValue: 2100,
    dates: 'Sep 10-18, 2025',
    duration: '9 days',
    durationDays: 9,
    rating: 4.8,
    reviewCount: 287,
    tags: ['Hiking', 'Castles', 'Whisky', 'History'],
    category: 'adventure',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['History buffs', 'Whisky lovers', 'Hikers'],
    highlights: ['Isle of Skye', 'Loch Ness', 'Whisky distillery tours'],
    included: ['B&Bs', 'Transport', 'Guide', 'Tastings'],
    description: 'Explore the dramatic landscapes of the Scottish Highlands, from ancient castles to the mystical Isle of Skye, with whisky tastings along the way.'
  },
  {
    id: genId(),
    title: 'Nepal Everest Base Camp Trek',
    host: 'Himalayan Journeys',
    location: 'Lukla to Everest',
    country: 'Nepal',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800',
    price: '$2,200',
    priceValue: 2200,
    dates: 'Apr 1-15, 2025',
    duration: '15 days',
    durationDays: 15,
    rating: 4.9,
    reviewCount: 567,
    tags: ['Trekking', 'Everest', 'Himalayas', 'Bucket list'],
    category: 'adventure',
    activityLevel: 'extreme',
    groupSize: 'small-group',
    bestFor: ['Serious trekkers', 'Bucket listers', 'Mountain lovers'],
    highlights: ['Everest views', 'Sherpa culture', 'Tengboche monastery'],
    included: ['Lodges', 'Permits', 'Guide', 'Porter', 'Meals'],
    description: 'The ultimate trekking adventure to the base of the world\'s highest peak, through Sherpa villages and stunning Himalayan landscapes.'
  },

  // ============ SPORTS TRIPS ============
  {
    id: genId(),
    title: 'Lakers vs Warriors Courtside',
    host: 'LA Courtside',
    location: 'Los Angeles, CA',
    country: 'USA',
    continent: 'North America',
    image: 'https://images.unsplash.com/photo-1574623452334-9e99857bbcd2?w=800',
    price: '$890',
    priceValue: 890,
    dates: 'Feb 8-10, 2025',
    duration: '3 days',
    durationDays: 3,
    rating: 4.85,
    reviewCount: 423,
    tags: ['NBA', 'Courtside', 'VIP', 'Los Angeles'],
    category: 'sports',
    activityLevel: 'low',
    groupSize: 'any',
    bestFor: ['Basketball fans', 'Sports lovers', 'LA visitors'],
    highlights: ['Courtside seats', 'Tunnel access', 'LA nightlife'],
    included: ['Game tickets', 'Hotel', 'Pre-game party'],
    description: 'Experience NBA basketball at its finest with courtside seats to the ultimate rivalry game, plus VIP access and LA entertainment.'
  },
  {
    id: genId(),
    title: 'Super Bowl Experience',
    host: 'Gridiron VIP',
    location: 'New Orleans, LA',
    country: 'USA',
    continent: 'North America',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
    price: '$5,500',
    priceValue: 5500,
    dates: 'Feb 8-11, 2025',
    duration: '4 days',
    durationDays: 4,
    rating: 4.95,
    reviewCount: 189,
    tags: ['NFL', 'Super Bowl', 'VIP', 'Party'],
    category: 'sports',
    activityLevel: 'low',
    groupSize: 'any',
    bestFor: ['Football fans', 'Party lovers', 'Bucket listers'],
    highlights: ['Game tickets', 'Celebrity parties', 'Bourbon Street'],
    included: ['Tickets', 'Luxury hotel', 'VIP events', 'Concierge'],
    description: 'The ultimate American sports experience - Super Bowl Sunday with premium seats, exclusive parties, and New Orleans nightlife.'
  },
  {
    id: genId(),
    title: 'Augusta Masters Experience',
    host: 'Golf Legends Tours',
    location: 'Augusta, GA',
    country: 'USA',
    continent: 'North America',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',
    price: '$4,200',
    priceValue: 4200,
    dates: 'Apr 10-14, 2025',
    duration: '5 days',
    durationDays: 5,
    rating: 4.95,
    reviewCount: 234,
    tags: ['Golf', 'Masters', 'Augusta', 'Exclusive'],
    category: 'sports',
    activityLevel: 'low',
    groupSize: 'small-group',
    bestFor: ['Golf enthusiasts', 'Sports purists', 'Bucket listers'],
    highlights: ['Tournament badges', 'Amen Corner', 'Pimento cheese'],
    included: ['Badges', 'Lodging', 'Transfers', 'Golf rounds'],
    description: 'Witness golf\'s most prestigious tournament at Augusta National, with practice round access and premium viewing positions.'
  },
  {
    id: genId(),
    title: 'Monaco Grand Prix VIP',
    host: 'F1 Experiences',
    location: 'Monte Carlo',
    country: 'Monaco',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
    price: '$8,500',
    priceValue: 8500,
    dates: 'May 23-26, 2025',
    duration: '4 days',
    durationDays: 4,
    rating: 4.9,
    reviewCount: 156,
    tags: ['F1', 'Monaco', 'Luxury', 'VIP'],
    category: 'sports',
    activityLevel: 'low',
    groupSize: 'couples',
    bestFor: ['F1 fans', 'Luxury travelers', 'Car enthusiasts'],
    highlights: ['Yacht viewing', 'Pit lane walk', 'Casino night'],
    included: ['Grandstand tickets', '5-star hotel', 'Yacht access', 'Parties'],
    description: 'The most glamorous race in Formula 1 - watch from a yacht in the harbor, walk the pit lane, and party like royalty in Monaco.'
  },
  {
    id: genId(),
    title: 'Wimbledon Championships',
    host: 'Tennis Tours UK',
    location: 'London',
    country: 'England',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800',
    price: '$3,200',
    priceValue: 3200,
    dates: 'Jun 30 - Jul 6, 2025',
    duration: '7 days',
    durationDays: 7,
    rating: 4.85,
    reviewCount: 312,
    tags: ['Tennis', 'Wimbledon', 'London', 'Tradition'],
    category: 'sports',
    activityLevel: 'low',
    groupSize: 'any',
    bestFor: ['Tennis fans', 'Anglophiles', 'Tradition lovers'],
    highlights: ['Centre Court tickets', 'Strawberries & cream', 'London sights'],
    included: ['Match tickets', 'Hotel', 'London tours', 'Transfers'],
    description: 'Experience the world\'s most prestigious tennis tournament with Centre Court access, traditional strawberries and cream, and London exploration.'
  },
  {
    id: genId(),
    title: 'World Cup Final Experience',
    host: 'Football World',
    location: 'Various',
    country: 'TBD',
    continent: 'TBD',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800',
    price: '$7,500',
    priceValue: 7500,
    dates: 'Jul 2026',
    duration: '5 days',
    durationDays: 5,
    rating: 4.95,
    reviewCount: 89,
    tags: ['FIFA', 'World Cup', 'Football', 'Historic'],
    category: 'sports',
    activityLevel: 'low',
    groupSize: 'any',
    bestFor: ['Football/Soccer fans', 'Sports travelers', 'Once-in-a-lifetime'],
    highlights: ['Final match tickets', 'Fan zone access', 'City experience'],
    included: ['Tickets', 'Hotel', 'Transfers', 'Concierge'],
    description: 'Be there for football\'s greatest moment - the World Cup Final, with premium tickets and complete fan experience package.'
  },
  {
    id: genId(),
    title: 'Tokyo Sumo Tournament',
    host: 'Japan Sports Tours',
    location: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    price: '$2,100',
    priceValue: 2100,
    dates: 'Jan 12-19, 2025',
    duration: '8 days',
    durationDays: 8,
    rating: 4.8,
    reviewCount: 198,
    tags: ['Sumo', 'Japan', 'Culture', 'Unique'],
    category: 'sports',
    activityLevel: 'low',
    groupSize: 'any',
    bestFor: ['Japan lovers', 'Culture seekers', 'Unique experiences'],
    highlights: ['Ringside seats', 'Sumo stable visit', 'Tokyo exploration'],
    included: ['Tournament tickets', 'Hotel', 'Cultural tours', 'Meals'],
    description: 'Witness Japan\'s ancient sport of sumo wrestling with ringside seats, exclusive stable visits, and deep cultural immersion in Tokyo.'
  },
  {
    id: genId(),
    title: 'Kentucky Derby & Bourbon Trail',
    host: 'Southern Sports',
    location: 'Louisville, KY',
    country: 'USA',
    continent: 'North America',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    price: '$2,800',
    priceValue: 2800,
    dates: 'May 1-5, 2025',
    duration: '5 days',
    durationDays: 5,
    rating: 4.75,
    reviewCount: 267,
    tags: ['Horse Racing', 'Derby', 'Bourbon', 'Southern'],
    category: 'sports',
    activityLevel: 'low',
    groupSize: 'any',
    bestFor: ['Horse racing fans', 'Bourbon lovers', 'Southern culture'],
    highlights: ['Derby Day', 'Millionaire\'s Row', 'Bourbon distilleries'],
    included: ['Race tickets', 'Hotel', 'Bourbon tours', 'Derby party'],
    description: 'Experience the most exciting two minutes in sports at the Kentucky Derby, plus exclusive bourbon trail tours and Southern hospitality.'
  },
  {
    id: genId(),
    title: 'Surf Camp Pipeline Hawaii',
    host: 'North Shore Surf Co',
    location: 'Oahu, Hawaii',
    country: 'USA',
    continent: 'North America',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
    price: '$2,400',
    priceValue: 2400,
    dates: 'Nov 15-22, 2025',
    duration: '8 days',
    durationDays: 8,
    rating: 4.85,
    reviewCount: 345,
    tags: ['Surfing', 'Hawaii', 'Pipeline', 'Pro Competition'],
    category: 'sports',
    activityLevel: 'high',
    groupSize: 'small-group',
    bestFor: ['Surfers', 'Ocean lovers', 'Surf culture fans'],
    highlights: ['Pipeline viewing', 'Surf lessons', 'Pro meet & greet'],
    included: ['Beachfront stay', 'Board rentals', 'Lessons', 'Competition access'],
    description: 'Surf the legendary North Shore during competition season, with lessons from local pros and front-row viewing of Pipeline Masters.'
  },
  {
    id: genId(),
    title: 'Barcelona El Clásico',
    host: 'La Liga Tours',
    location: 'Barcelona',
    country: 'Spain',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
    price: '$1,900',
    priceValue: 1900,
    dates: 'Mar 15-19, 2025',
    duration: '5 days',
    durationDays: 5,
    rating: 4.9,
    reviewCount: 456,
    tags: ['Football', 'Barcelona', 'Real Madrid', 'La Liga'],
    category: 'sports',
    activityLevel: 'low',
    groupSize: 'any',
    bestFor: ['Football fans', 'Barcelona lovers', 'Sports travelers'],
    highlights: ['Match tickets', 'Stadium tour', 'Tapas crawl'],
    included: ['Game tickets', 'Hotel', 'Stadium tour', 'City tour'],
    description: 'Experience the world\'s greatest football rivalry at Camp Nou, with stadium access, city tours, and the best of Barcelona.'
  },

  // ============ WELLNESS TRIPS ============
  {
    id: genId(),
    title: 'Bali Soul Retreat',
    host: 'Wanderlust Wellness',
    location: 'Ubud, Bali',
    country: 'Indonesia',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    price: '$1,890',
    priceValue: 1890,
    dates: 'Mar 5-12, 2025',
    duration: '7 days',
    durationDays: 7,
    rating: 4.95,
    reviewCount: 567,
    tags: ['Yoga', 'Meditation', 'Wellness', 'Spiritual'],
    category: 'wellness',
    activityLevel: 'low',
    groupSize: 'small-group',
    bestFor: ['Yoga practitioners', 'Spiritual seekers', 'Burnout recovery'],
    highlights: ['Daily yoga', 'Temple ceremonies', 'Rice terrace walks'],
    included: ['Villa stay', 'All meals', 'Yoga sessions', 'Spa treatments'],
    description: 'Transform your body and mind in the spiritual heart of Bali with daily yoga, meditation, temple blessings, and holistic wellness.'
  },
  {
    id: genId(),
    title: 'Maldives Wellness Escape',
    host: 'Island Serenity',
    location: 'North Malé Atoll',
    country: 'Maldives',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    price: '$5,500',
    priceValue: 5500,
    dates: 'Apr 1-8, 2025',
    duration: '7 days',
    durationDays: 7,
    rating: 4.95,
    reviewCount: 234,
    tags: ['Luxury', 'Spa', 'Beach', 'Detox'],
    category: 'wellness',
    activityLevel: 'low',
    groupSize: 'couples',
    bestFor: ['Couples', 'Luxury seekers', 'Beach lovers'],
    highlights: ['Overwater villa', 'Spa treatments', 'Sunset dolphin cruise'],
    included: ['Villa', 'Full board', 'Daily spa', 'Activities'],
    description: 'Ultimate relaxation in paradise with overwater villa, unlimited spa treatments, and crystal-clear waters of the Maldives.'
  },
  {
    id: genId(),
    title: 'Sedona Spiritual Journey',
    host: 'Red Rock Wellness',
    location: 'Sedona, AZ',
    country: 'USA',
    continent: 'North America',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800',
    price: '$2,200',
    priceValue: 2200,
    dates: 'Oct 10-16, 2025',
    duration: '7 days',
    durationDays: 7,
    rating: 4.8,
    reviewCount: 312,
    tags: ['Vortex', 'Healing', 'Hiking', 'Spiritual'],
    category: 'wellness',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Spiritual seekers', 'Hikers', 'New age enthusiasts'],
    highlights: ['Vortex tours', 'Energy healing', 'Red rock hikes'],
    included: ['Resort stay', 'Workshops', 'Healers', 'Hikes'],
    description: 'Experience Sedona\'s powerful energy vortexes with guided hikes, healing sessions, and spiritual workshops in stunning red rock country.'
  },
  {
    id: genId(),
    title: 'Thailand Muay Thai & Wellness',
    host: 'Fight & Flow',
    location: 'Koh Samui',
    country: 'Thailand',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
    price: '$1,650',
    priceValue: 1650,
    dates: 'Feb 15-25, 2025',
    duration: '10 days',
    durationDays: 10,
    rating: 4.75,
    reviewCount: 198,
    tags: ['Muay Thai', 'Fitness', 'Beach', 'Training'],
    category: 'wellness',
    activityLevel: 'high',
    groupSize: 'small-group',
    bestFor: ['Fitness enthusiasts', 'Martial arts fans', 'Beach lovers'],
    highlights: ['Muay Thai training', 'Beach recovery', 'Thai massage'],
    included: ['Training', 'Accommodation', 'Meals', 'Massage'],
    description: 'Combine intense Muay Thai training with beach relaxation and Thai massage for the ultimate fitness wellness retreat.'
  },
  {
    id: genId(),
    title: 'Tuscany Wine & Yoga Retreat',
    host: 'Dolce Vita Wellness',
    location: 'Chianti Region',
    country: 'Italy',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800',
    price: '$3,400',
    priceValue: 3400,
    dates: 'Sep 20-28, 2025',
    duration: '9 days',
    durationDays: 9,
    rating: 4.9,
    reviewCount: 287,
    tags: ['Wine', 'Yoga', 'Tuscany', 'Cooking'],
    category: 'wellness',
    activityLevel: 'low',
    groupSize: 'small-group',
    bestFor: ['Wine lovers', 'Yoga practitioners', 'Foodies'],
    highlights: ['Vineyard yoga', 'Wine tasting', 'Cooking classes'],
    included: ['Villa stay', 'All meals', 'Wine', 'Yoga', 'Cooking'],
    description: 'Find balance in the Tuscan countryside with morning yoga, afternoon wine tastings, and Italian cooking classes in a historic villa.'
  },
  {
    id: genId(),
    title: 'Costa Rica Surf & Yoga',
    host: 'Pura Vida Retreat',
    location: 'Nosara',
    country: 'Costa Rica',
    continent: 'Central America',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',
    price: '$2,100',
    priceValue: 2100,
    dates: 'Jan 10-18, 2025',
    duration: '9 days',
    durationDays: 9,
    rating: 4.85,
    reviewCount: 345,
    tags: ['Surf', 'Yoga', 'Beach', 'Wellness'],
    category: 'wellness',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Surfers', 'Yoga lovers', 'Beach seekers'],
    highlights: ['Daily surf', 'Sunset yoga', 'Jungle adventures'],
    included: ['Beachfront lodge', 'Surf lessons', 'Yoga', 'Meals'],
    description: 'The perfect blend of surf and yoga in Costa Rica\'s wellness capital, with daily sessions, healthy food, and jungle adventures.'
  },
  {
    id: genId(),
    title: 'Japanese Onsen Trail',
    host: 'Zen Journeys',
    location: 'Hakone to Kyoto',
    country: 'Japan',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
    price: '$3,800',
    priceValue: 3800,
    dates: 'Nov 1-10, 2025',
    duration: '10 days',
    durationDays: 10,
    rating: 4.9,
    reviewCount: 234,
    tags: ['Onsen', 'Japan', 'Relaxation', 'Culture'],
    category: 'wellness',
    activityLevel: 'low',
    groupSize: 'small-group',
    bestFor: ['Japan lovers', 'Relaxation seekers', 'Hot spring fans'],
    highlights: ['Traditional ryokans', 'Private onsens', 'Kaiseki dining'],
    included: ['Ryokans', 'Kaiseki meals', 'Transfers', 'Guide'],
    description: 'Journey through Japan\'s finest hot spring towns, staying in traditional ryokans with private baths and exquisite kaiseki cuisine.'
  },
  {
    id: genId(),
    title: 'Bhutan Happiness Retreat',
    host: 'Gross National Happiness Tours',
    location: 'Paro & Thimphu',
    country: 'Bhutan',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1553856622-d1b352e9a211?w=800',
    price: '$4,500',
    priceValue: 4500,
    dates: 'Mar 15-25, 2025',
    duration: '11 days',
    durationDays: 11,
    rating: 4.95,
    reviewCount: 156,
    tags: ['Bhutan', 'Meditation', 'Happiness', 'Mountains'],
    category: 'wellness',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Spiritual seekers', 'Mountain lovers', 'Mindfulness practitioners'],
    highlights: ['Tiger\'s Nest hike', 'Monastery stays', 'Buddhist teachings'],
    included: ['Accommodation', 'All meals', 'Guide', 'Permits', 'Teachings'],
    description: 'Discover the secrets of happiness in the world\'s happiest country with monastery visits, meditation retreats, and Himalayan hikes.'
  },
  {
    id: genId(),
    title: 'Portugal Surf & Mindfulness',
    host: 'Atlantic Wellness',
    location: 'Ericeira',
    country: 'Portugal',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    price: '$1,450',
    priceValue: 1450,
    dates: 'Jun 1-8, 2025',
    duration: '8 days',
    durationDays: 8,
    rating: 4.8,
    reviewCount: 423,
    tags: ['Surf', 'Mindfulness', 'Portugal', 'Beach'],
    category: 'wellness',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Beginner surfers', 'Beach lovers', 'Mindfulness seekers'],
    highlights: ['Surf lessons', 'Meditation', 'Portuguese cuisine'],
    included: ['Guesthouse', 'Surf equipment', 'Lessons', 'Breakfast'],
    description: 'Learn to surf on Europe\'s best waves while practicing mindfulness in the charming fishing village of Ericeira.'
  },
  {
    id: genId(),
    title: 'Iceland Hot Springs Tour',
    host: 'Nordic Wellness',
    location: 'Golden Circle',
    country: 'Iceland',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?w=800',
    price: '$2,900',
    priceValue: 2900,
    dates: 'Aug 5-12, 2025',
    duration: '8 days',
    durationDays: 8,
    rating: 4.85,
    reviewCount: 267,
    tags: ['Hot Springs', 'Iceland', 'Nature', 'Relaxation'],
    category: 'wellness',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Hot spring fans', 'Nature lovers', 'Photographers'],
    highlights: ['Blue Lagoon', 'Hidden hot springs', 'Northern lights'],
    included: ['Hotels', 'Transport', 'Hot spring access', 'Guide'],
    description: 'Discover Iceland\'s best hot springs from the famous Blue Lagoon to hidden natural pools, with stunning nature all around.'
  },

  // ============ CULTURAL TRIPS ============
  {
    id: genId(),
    title: 'Tokyo Food & Culture Deep Dive',
    host: 'Japan Gastronomy',
    location: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    price: '$2,800',
    priceValue: 2800,
    dates: 'Apr 10-18, 2025',
    duration: '9 days',
    durationDays: 9,
    rating: 4.9,
    reviewCount: 567,
    tags: ['Food', 'Tokyo', 'Culture', 'Ramen'],
    category: 'cultural',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Foodies', 'Japan lovers', 'Culture seekers'],
    highlights: ['Tsukiji market', 'Ramen tour', 'Sake tasting'],
    included: ['Hotel', 'Food tours', 'Cooking class', 'Guide'],
    description: 'Explore Tokyo through its incredible food scene - from Michelin stars to hidden ramen shops, with cooking classes and market tours.'
  },
  {
    id: genId(),
    title: 'Rome & Amalfi Coast',
    host: 'Bella Italia Tours',
    location: 'Rome to Positano',
    country: 'Italy',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800',
    price: '$3,200',
    priceValue: 3200,
    dates: 'May 15-25, 2025',
    duration: '11 days',
    durationDays: 11,
    rating: 4.85,
    reviewCount: 445,
    tags: ['Italy', 'History', 'Coast', 'Food'],
    category: 'cultural',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['History buffs', 'Foodies', 'Romance seekers'],
    highlights: ['Colosseum', 'Pompeii', 'Positano sunset'],
    included: ['Hotels', 'Tours', 'Some meals', 'Transfers'],
    description: 'Journey from ancient Rome through Pompeii to the stunning Amalfi Coast for the perfect blend of history, culture, and la dolce vita.'
  },
  {
    id: genId(),
    title: 'Kyoto Cherry Blossom Season',
    host: 'Sakura Tours',
    location: 'Kyoto',
    country: 'Japan',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    price: '$3,500',
    priceValue: 3500,
    dates: 'Mar 25 - Apr 3, 2025',
    duration: '10 days',
    durationDays: 10,
    rating: 4.95,
    reviewCount: 678,
    tags: ['Cherry Blossoms', 'Kyoto', 'Temples', 'Spring'],
    category: 'cultural',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Japan lovers', 'Photographers', 'Culture seekers'],
    highlights: ['Hanami parties', 'Geisha district', 'Temple gardens'],
    included: ['Ryokan stay', 'Tours', 'Tea ceremony', 'Meals'],
    description: 'Experience Japan\'s magical cherry blossom season in ancient Kyoto, with temple visits, tea ceremonies, and hanami celebrations.'
  },
  {
    id: genId(),
    title: 'Peru Machu Picchu & Lima Food',
    host: 'Andes Adventures',
    location: 'Lima & Cusco',
    country: 'Peru',
    continent: 'South America',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800',
    price: '$2,600',
    priceValue: 2600,
    dates: 'Jun 5-14, 2025',
    duration: '10 days',
    durationDays: 10,
    rating: 4.85,
    reviewCount: 389,
    tags: ['Machu Picchu', 'Food', 'History', 'Andes'],
    category: 'cultural',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['History buffs', 'Foodies', 'Adventure seekers'],
    highlights: ['Machu Picchu', 'Lima ceviche', 'Sacred Valley'],
    included: ['Hotels', 'Train', 'Guides', 'Food tours'],
    description: 'Combine the ancient wonder of Machu Picchu with Lima\'s world-renowned culinary scene for Peru\'s best experiences.'
  },
  {
    id: genId(),
    title: 'Vietnam North to South',
    host: 'Indochina Journeys',
    location: 'Hanoi to Ho Chi Minh',
    country: 'Vietnam',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    price: '$2,100',
    priceValue: 2100,
    dates: 'Nov 10-24, 2025',
    duration: '15 days',
    durationDays: 15,
    rating: 4.8,
    reviewCount: 512,
    tags: ['Vietnam', 'Food', 'History', 'Adventure'],
    category: 'cultural',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Culture seekers', 'Foodies', 'History buffs'],
    highlights: ['Ha Long Bay', 'Hoi An', 'Cu Chi Tunnels'],
    included: ['Hotels', 'Flights', 'Tours', 'Some meals'],
    description: 'Travel the length of Vietnam from Hanoi\'s bustling streets to Saigon\'s energy, with Ha Long Bay and charming Hoi An.'
  },
  {
    id: genId(),
    title: 'Barcelona Architecture & Tapas',
    host: 'Catalan Culture',
    location: 'Barcelona',
    country: 'Spain',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    price: '$1,800',
    priceValue: 1800,
    dates: 'Sep 10-16, 2025',
    duration: '7 days',
    durationDays: 7,
    rating: 4.8,
    reviewCount: 423,
    tags: ['Gaudi', 'Tapas', 'Art', 'Architecture'],
    category: 'cultural',
    activityLevel: 'moderate',
    groupSize: 'any',
    bestFor: ['Art lovers', 'Foodies', 'Architecture fans'],
    highlights: ['Sagrada Familia', 'Tapas crawl', 'Picasso Museum'],
    included: ['Hotel', 'Tours', 'Food tours', 'Skip-the-line'],
    description: 'Discover Gaudí\'s masterpieces, explore world-class museums, and indulge in Barcelona\'s incredible tapas and wine scene.'
  },
  {
    id: genId(),
    title: 'Egypt Pyramids & Nile Cruise',
    host: 'Pharaoh Tours',
    location: 'Cairo to Luxor',
    country: 'Egypt',
    continent: 'Africa',
    image: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800',
    price: '$2,900',
    priceValue: 2900,
    dates: 'Oct 1-12, 2025',
    duration: '12 days',
    durationDays: 12,
    rating: 4.75,
    reviewCount: 345,
    tags: ['Pyramids', 'Nile', 'History', 'Ancient'],
    category: 'cultural',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['History buffs', 'Bucket listers', 'Adventure seekers'],
    highlights: ['Pyramids of Giza', 'Valley of Kings', 'Nile cruise'],
    included: ['Hotels', 'Cruise', 'Guides', 'Flights', 'Meals'],
    description: 'Explore ancient Egypt from the Great Pyramids to Luxor\'s temples, cruising the legendary Nile River in style.'
  },
  {
    id: genId(),
    title: 'India Golden Triangle & Rajasthan',
    host: 'Incredible India Tours',
    location: 'Delhi to Jaipur',
    country: 'India',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
    price: '$2,400',
    priceValue: 2400,
    dates: 'Nov 5-16, 2025',
    duration: '12 days',
    durationDays: 12,
    rating: 4.8,
    reviewCount: 456,
    tags: ['Taj Mahal', 'Palaces', 'Culture', 'Food'],
    category: 'cultural',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Culture seekers', 'Photographers', 'History lovers'],
    highlights: ['Taj Mahal sunrise', 'Palace stays', 'Street food tour'],
    included: ['Heritage hotels', 'Transport', 'Guides', 'Some meals'],
    description: 'Experience India\'s Golden Triangle plus Rajasthan\'s magnificent palaces, staying in heritage properties and exploring ancient culture.'
  },
  {
    id: genId(),
    title: 'Greece Island Hopping',
    host: 'Aegean Dreams',
    location: 'Athens to Santorini',
    country: 'Greece',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    price: '$2,700',
    priceValue: 2700,
    dates: 'Jun 15-26, 2025',
    duration: '12 days',
    durationDays: 12,
    rating: 4.85,
    reviewCount: 534,
    tags: ['Islands', 'Greece', 'Beach', 'History'],
    category: 'cultural',
    activityLevel: 'moderate',
    groupSize: 'any',
    bestFor: ['Beach lovers', 'History buffs', 'Couples'],
    highlights: ['Acropolis', 'Santorini sunset', 'Mykonos nightlife'],
    included: ['Hotels', 'Ferries', 'Tours', 'Breakfast'],
    description: 'Island hop through the stunning Greek islands from historic Athens to the iconic sunsets of Santorini and beaches of Mykonos.'
  },
  {
    id: genId(),
    title: 'Mexico City Food & Art',
    host: 'CDMX Culture',
    location: 'Mexico City',
    country: 'Mexico',
    continent: 'North America',
    image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800',
    price: '$1,400',
    priceValue: 1400,
    dates: 'Oct 20-27, 2025',
    duration: '8 days',
    durationDays: 8,
    rating: 4.85,
    reviewCount: 378,
    tags: ['Mexican Food', 'Art', 'Frida', 'Mezcal'],
    category: 'cultural',
    activityLevel: 'moderate',
    groupSize: 'any',
    bestFor: ['Foodies', 'Art lovers', 'Culture seekers'],
    highlights: ['Frida Kahlo museum', 'Street food tours', 'Mezcal tasting'],
    included: ['Boutique hotel', 'Food tours', 'Museum entries', 'Guide'],
    description: 'Dive into Mexico City\'s incredible food scene and rich art history, from street tacos to world-class museums and mezcal bars.'
  },

  // ============ BEACH & RELAXATION ============
  {
    id: genId(),
    title: 'Maldives Private Island',
    host: 'Luxury Escapes',
    location: 'North Malé Atoll',
    country: 'Maldives',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    price: '$8,500',
    priceValue: 8500,
    dates: 'Flexible',
    duration: '7 days',
    durationDays: 7,
    rating: 4.98,
    reviewCount: 189,
    tags: ['Luxury', 'Beach', 'Overwater', 'Diving'],
    category: 'beach',
    activityLevel: 'low',
    groupSize: 'couples',
    bestFor: ['Honeymooners', 'Luxury seekers', 'Beach lovers'],
    highlights: ['Overwater villa', 'Private dining', 'Snorkeling'],
    included: ['All-inclusive', 'Transfers', 'Activities', 'Spa'],
    description: 'Ultimate luxury in the Maldives with overwater villa, private beach dining, world-class diving, and complete relaxation.'
  },
  {
    id: genId(),
    title: 'Bora Bora Honeymoon',
    host: 'Polynesian Paradise',
    location: 'Bora Bora',
    country: 'French Polynesia',
    continent: 'Oceania',
    image: 'https://images.unsplash.com/photo-1501446529957-6226bd447c46?w=800',
    price: '$9,200',
    priceValue: 9200,
    dates: 'Flexible',
    duration: '8 days',
    durationDays: 8,
    rating: 4.95,
    reviewCount: 234,
    tags: ['Honeymoon', 'Luxury', 'Overwater', 'Romance'],
    category: 'beach',
    activityLevel: 'low',
    groupSize: 'couples',
    bestFor: ['Honeymooners', 'Couples', 'Luxury lovers'],
    highlights: ['Overwater bungalow', 'Mount Otemanu views', 'Lagoon tour'],
    included: ['Bungalow', 'Breakfast', 'Dinner', 'Activities'],
    description: 'The world\'s most romantic destination - Bora Bora\'s iconic overwater bungalows with Mount Otemanu views and crystal lagoons.'
  },
  {
    id: genId(),
    title: 'Thailand Island Paradise',
    host: 'Andaman Adventures',
    location: 'Phuket & Phi Phi',
    country: 'Thailand',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    price: '$1,600',
    priceValue: 1600,
    dates: 'Dec 1-10, 2025',
    duration: '10 days',
    durationDays: 10,
    rating: 4.75,
    reviewCount: 567,
    tags: ['Beach', 'Islands', 'Snorkeling', 'Party'],
    category: 'beach',
    activityLevel: 'low',
    groupSize: 'any',
    bestFor: ['Beach lovers', 'Budget travelers', 'Island hoppers'],
    highlights: ['Phi Phi islands', 'Thai massage', 'Full moon party'],
    included: ['Hotels', 'Island tours', 'Breakfast', 'Transfers'],
    description: 'Explore Thailand\'s stunning Andaman coast from Phuket to the legendary Phi Phi islands with beaches, snorkeling, and nightlife.'
  },
  {
    id: genId(),
    title: 'Caribbean Yacht Week',
    host: 'Sail Caribbean',
    location: 'British Virgin Islands',
    country: 'BVI',
    continent: 'Caribbean',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    price: '$2,800',
    priceValue: 2800,
    dates: 'Mar 15-22, 2025',
    duration: '8 days',
    durationDays: 8,
    rating: 4.85,
    reviewCount: 312,
    tags: ['Sailing', 'Caribbean', 'Party', 'Islands'],
    category: 'beach',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Sailors', 'Party lovers', 'Island hoppers'],
    highlights: ['Private yacht', 'Island hopping', 'Beach bars'],
    included: ['Yacht berth', 'Skipper', 'Some meals', 'Water toys'],
    description: 'Sail the British Virgin Islands on a private yacht, hopping between stunning islands, beach bars, and crystal-clear waters.'
  },
  {
    id: genId(),
    title: 'Seychelles Luxury Escape',
    host: 'Island Luxe',
    location: 'Mahé & Praslin',
    country: 'Seychelles',
    continent: 'Africa',
    image: 'https://images.unsplash.com/photo-1589979481223-deb893043163?w=800',
    price: '$6,500',
    priceValue: 6500,
    dates: 'Nov 1-9, 2025',
    duration: '9 days',
    durationDays: 9,
    rating: 4.9,
    reviewCount: 198,
    tags: ['Luxury', 'Beach', 'Privacy', 'Nature'],
    category: 'beach',
    activityLevel: 'low',
    groupSize: 'couples',
    bestFor: ['Couples', 'Luxury seekers', 'Privacy lovers'],
    highlights: ['Giant tortoises', 'Anse Source d\'Argent', 'Private beach'],
    included: ['5-star resorts', 'Flights', 'Tours', 'Some meals'],
    description: 'Experience the world\'s most beautiful beaches in the Seychelles with luxury resorts, unique wildlife, and total privacy.'
  },
  {
    id: genId(),
    title: 'Fiji Barefoot Luxury',
    host: 'Pacific Dreams',
    location: 'Mamanuca Islands',
    country: 'Fiji',
    continent: 'Oceania',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    price: '$3,400',
    priceValue: 3400,
    dates: 'Jul 10-18, 2025',
    duration: '9 days',
    durationDays: 9,
    rating: 4.85,
    reviewCount: 267,
    tags: ['Fiji', 'Beach', 'Diving', 'Culture'],
    category: 'beach',
    activityLevel: 'low',
    groupSize: 'any',
    bestFor: ['Beach lovers', 'Divers', 'Culture seekers'],
    highlights: ['Kava ceremony', 'Coral diving', 'Island hopping'],
    included: ['Resort stay', 'Meals', 'Island tours', 'Diving'],
    description: 'Discover Fiji\'s incredible hospitality and pristine reefs in the Mamanuca Islands with cultural experiences and world-class diving.'
  },
  {
    id: genId(),
    title: 'Zanzibar Beach & Spice',
    host: 'Spice Island Tours',
    location: 'Stone Town & Beaches',
    country: 'Tanzania',
    continent: 'Africa',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    price: '$2,100',
    priceValue: 2100,
    dates: 'Aug 5-14, 2025',
    duration: '10 days',
    durationDays: 10,
    rating: 4.8,
    reviewCount: 312,
    tags: ['Beach', 'Culture', 'Spices', 'History'],
    category: 'beach',
    activityLevel: 'low',
    groupSize: 'any',
    bestFor: ['Culture seekers', 'Beach lovers', 'History buffs'],
    highlights: ['Stone Town', 'Spice tours', 'Pristine beaches'],
    included: ['Hotels', 'Tours', 'Breakfast', 'Transfers'],
    description: 'Combine Zanzibar\'s white sand beaches with its fascinating Stone Town history and fragrant spice plantation tours.'
  },
  {
    id: genId(),
    title: 'Turks & Caicos Relaxation',
    host: 'Grace Bay Escapes',
    location: 'Providenciales',
    country: 'Turks & Caicos',
    continent: 'Caribbean',
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800',
    price: '$4,200',
    priceValue: 4200,
    dates: 'Flexible',
    duration: '7 days',
    durationDays: 7,
    rating: 4.9,
    reviewCount: 189,
    tags: ['Beach', 'Luxury', 'Snorkeling', 'Relaxation'],
    category: 'beach',
    activityLevel: 'low',
    groupSize: 'couples',
    bestFor: ['Beach purists', 'Couples', 'Luxury seekers'],
    highlights: ['Grace Bay Beach', 'Snorkeling', 'Spa'],
    included: ['Beachfront resort', 'Breakfast', 'Water sports'],
    description: 'Grace Bay Beach consistently ranks as the world\'s best - experience it with luxury beachfront stay and crystal-clear waters.'
  },

  // ============ NATURE & WILDLIFE ============
  {
    id: genId(),
    title: 'Kenya Safari Adventure',
    host: 'African Dreams',
    location: 'Masai Mara & Amboseli',
    country: 'Kenya',
    continent: 'Africa',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    price: '$4,500',
    priceValue: 4500,
    dates: 'Aug 10-20, 2025',
    duration: '11 days',
    durationDays: 11,
    rating: 4.95,
    reviewCount: 456,
    tags: ['Safari', 'Big Five', 'Wildlife', 'Africa'],
    category: 'nature',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Wildlife lovers', 'Photographers', 'Bucket listers'],
    highlights: ['Great Migration', 'Big Five', 'Maasai culture'],
    included: ['Lodges', 'Game drives', 'Meals', 'Guide', 'Flights'],
    description: 'Witness the Great Migration and Big Five in Kenya\'s legendary Masai Mara and Amboseli, with Kilimanjaro views.'
  },
  {
    id: genId(),
    title: 'Galápagos Islands Expedition',
    host: 'Darwin Adventures',
    location: 'Galápagos Islands',
    country: 'Ecuador',
    continent: 'South America',
    image: 'https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=800',
    price: '$5,800',
    priceValue: 5800,
    dates: 'May 1-10, 2025',
    duration: '10 days',
    durationDays: 10,
    rating: 4.95,
    reviewCount: 312,
    tags: ['Wildlife', 'Galápagos', 'Snorkeling', 'Nature'],
    category: 'nature',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Nature lovers', 'Wildlife photographers', 'Snorkelers'],
    highlights: ['Giant tortoises', 'Blue-footed boobies', 'Sea lion swimming'],
    included: ['Cruise', 'All meals', 'Guide', 'Snorkeling gear'],
    description: 'Cruise the legendary Galápagos Islands to encounter fearless wildlife found nowhere else on Earth, following Darwin\'s footsteps.'
  },
  {
    id: genId(),
    title: 'Rwanda Gorilla Trekking',
    host: 'Primate Safaris',
    location: 'Volcanoes National Park',
    country: 'Rwanda',
    continent: 'Africa',
    image: 'https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=800',
    price: '$5,200',
    priceValue: 5200,
    dates: 'Jun 15-22, 2025',
    duration: '8 days',
    durationDays: 8,
    rating: 4.98,
    reviewCount: 178,
    tags: ['Gorillas', 'Trekking', 'Conservation', 'Unique'],
    category: 'nature',
    activityLevel: 'high',
    groupSize: 'small-group',
    bestFor: ['Wildlife lovers', 'Conservation supporters', 'Adventure seekers'],
    highlights: ['Gorilla family visit', 'Golden monkeys', 'Kigali culture'],
    included: ['Lodges', 'Permits', 'Guide', 'Meals', 'Transfers'],
    description: 'Experience the incredible privilege of meeting mountain gorillas face-to-face in their natural habitat in Rwanda\'s volcanic forests.'
  },
  {
    id: genId(),
    title: 'Antarctica Expedition Cruise',
    host: 'Polar Explorers',
    location: 'Antarctic Peninsula',
    country: 'Antarctica',
    continent: 'Antarctica',
    image: 'https://images.unsplash.com/photo-1551415923-a2297c7fda79?w=800',
    price: '$12,500',
    priceValue: 12500,
    dates: 'Dec 10-22, 2025',
    duration: '13 days',
    durationDays: 13,
    rating: 4.95,
    reviewCount: 156,
    tags: ['Antarctica', 'Penguins', 'Expedition', 'Bucket list'],
    category: 'nature',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Adventurers', 'Wildlife lovers', 'Bucket listers'],
    highlights: ['Penguin colonies', 'Iceberg kayaking', 'Polar plunge'],
    included: ['Expedition ship', 'All meals', 'Zodiac excursions', 'Gear'],
    description: 'Journey to the bottom of the world on an expedition cruise to Antarctica, with penguin colonies, glaciers, and pristine wilderness.'
  },
  {
    id: genId(),
    title: 'Borneo Orangutan Encounter',
    host: 'Rainforest Explorers',
    location: 'Sabah, Malaysian Borneo',
    country: 'Malaysia',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    price: '$2,800',
    priceValue: 2800,
    dates: 'Jul 5-14, 2025',
    duration: '10 days',
    durationDays: 10,
    rating: 4.85,
    reviewCount: 234,
    tags: ['Orangutans', 'Rainforest', 'Wildlife', 'Conservation'],
    category: 'nature',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Wildlife lovers', 'Conservationists', 'Adventure seekers'],
    highlights: ['Sepilok Orangutan Centre', 'Kinabatangan River', 'Pygmy elephants'],
    included: ['Lodges', 'Boat safaris', 'Guides', 'Meals'],
    description: 'Encounter orangutans in the wild Borneo rainforest, along with pygmy elephants, proboscis monkeys, and incredible biodiversity.'
  },
  {
    id: genId(),
    title: 'Alaska Bear Watching',
    host: 'Last Frontier Adventures',
    location: 'Katmai National Park',
    country: 'USA',
    continent: 'North America',
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800',
    price: '$4,800',
    priceValue: 4800,
    dates: 'Jul 15-22, 2025',
    duration: '8 days',
    durationDays: 8,
    rating: 4.9,
    reviewCount: 198,
    tags: ['Bears', 'Alaska', 'Wildlife', 'Photography'],
    category: 'nature',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Wildlife photographers', 'Nature lovers', 'Adventure seekers'],
    highlights: ['Brooks Falls bears', 'Floatplane flights', 'Salmon run'],
    included: ['Lodge', 'Floatplane', 'Guide', 'Meals'],
    description: 'Witness brown bears catching salmon at Brooks Falls during the famous salmon run, with floatplane access and expert guides.'
  },
  {
    id: genId(),
    title: 'South Africa Safari & Cape Town',
    host: 'Safari & City',
    location: 'Kruger & Cape Town',
    country: 'South Africa',
    continent: 'Africa',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    price: '$4,200',
    priceValue: 4200,
    dates: 'Sep 5-17, 2025',
    duration: '13 days',
    durationDays: 13,
    rating: 4.85,
    reviewCount: 367,
    tags: ['Safari', 'Cape Town', 'Wine', 'Big Five'],
    category: 'nature',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Safari lovers', 'Foodies', 'Wine lovers'],
    highlights: ['Big Five', 'Table Mountain', 'Cape Winelands'],
    included: ['Lodges', 'Game drives', 'Cape Town hotel', 'Wine tour'],
    description: 'The best of South Africa combining Big Five safari in Kruger with Cape Town\'s stunning scenery and world-class wine country.'
  },
  {
    id: genId(),
    title: 'Amazon Rainforest Expedition',
    host: 'Amazon Explorers',
    location: 'Peruvian Amazon',
    country: 'Peru',
    continent: 'South America',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
    price: '$2,400',
    priceValue: 2400,
    dates: 'Aug 10-18, 2025',
    duration: '9 days',
    durationDays: 9,
    rating: 4.8,
    reviewCount: 287,
    tags: ['Amazon', 'Rainforest', 'Wildlife', 'Adventure'],
    category: 'nature',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Nature lovers', 'Adventure seekers', 'Wildlife enthusiasts'],
    highlights: ['Jungle lodge', 'Piranha fishing', 'Pink dolphins'],
    included: ['Jungle lodge', 'All meals', 'Guides', 'Excursions'],
    description: 'Explore the Peruvian Amazon from a jungle lodge with expert naturalists, spotting pink dolphins, monkeys, and incredible wildlife.'
  },
  {
    id: genId(),
    title: 'Norway Northern Lights',
    host: 'Arctic Light Chasers',
    location: 'Tromsø',
    country: 'Norway',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
    price: '$3,200',
    priceValue: 3200,
    dates: 'Feb 1-8, 2025',
    duration: '8 days',
    durationDays: 8,
    rating: 4.85,
    reviewCount: 423,
    tags: ['Northern Lights', 'Norway', 'Winter', 'Arctic'],
    category: 'nature',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Aurora chasers', 'Photographers', 'Winter lovers'],
    highlights: ['Aurora hunting', 'Dog sledding', 'Whale watching'],
    included: ['Hotels', 'Aurora tours', 'Activities', 'Guide'],
    description: 'Chase the Northern Lights from Tromsø with expert guides, plus dog sledding, whale watching, and Arctic adventures.'
  },
  {
    id: genId(),
    title: 'Canadian Rockies Wildlife',
    host: 'Rockies Wild',
    location: 'Banff & Jasper',
    country: 'Canada',
    continent: 'North America',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800',
    price: '$2,600',
    priceValue: 2600,
    dates: 'Sep 10-19, 2025',
    duration: '10 days',
    durationDays: 10,
    rating: 4.8,
    reviewCount: 312,
    tags: ['Rockies', 'Bears', 'Mountains', 'Scenic'],
    category: 'nature',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Nature lovers', 'Photographers', 'Wildlife enthusiasts'],
    highlights: ['Lake Louise', 'Icefields Parkway', 'Grizzly bears'],
    included: ['Lodges', 'Transport', 'Wildlife tours', 'Guide'],
    description: 'Explore the stunning Canadian Rockies in fall colors with expert wildlife spotting for bears, elk, and moose on iconic routes.'
  },

  // ============ LUXURY TRIPS ============
  {
    id: genId(),
    title: 'French Riviera Yacht Charter',
    host: 'Côte d\'Azur Luxury',
    location: 'Monaco to Saint-Tropez',
    country: 'France',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    price: '$15,000',
    priceValue: 15000,
    dates: 'Flexible',
    duration: '7 days',
    durationDays: 7,
    rating: 4.95,
    reviewCount: 78,
    tags: ['Yacht', 'Luxury', 'French Riviera', 'Celebrity'],
    category: 'luxury',
    activityLevel: 'low',
    groupSize: 'couples',
    bestFor: ['Luxury seekers', 'Couples', 'Celebration'],
    highlights: ['Private yacht', 'Monaco', 'Saint-Tropez'],
    included: ['Yacht charter', 'Crew', 'Gourmet meals', 'Concierge'],
    description: 'Cruise the glamorous French Riviera on your private yacht from Monaco to Saint-Tropez with full crew and gourmet chef.'
  },
  {
    id: genId(),
    title: 'Dubai Ultra Luxury',
    host: 'Arabian Nights',
    location: 'Dubai',
    country: 'UAE',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    price: '$8,500',
    priceValue: 8500,
    dates: 'Flexible',
    duration: '6 days',
    durationDays: 6,
    rating: 4.9,
    reviewCount: 189,
    tags: ['Dubai', 'Luxury', 'Shopping', 'Adventure'],
    category: 'luxury',
    activityLevel: 'low',
    groupSize: 'any',
    bestFor: ['Luxury seekers', 'Shoppers', 'Experience hunters'],
    highlights: ['Burj Al Arab', 'Desert safari', 'Helicopter tour'],
    included: ['7-star hotel', 'Transfers', 'Experiences', 'Concierge'],
    description: 'Experience Dubai\'s over-the-top luxury with Burj Al Arab stay, helicopter tours, desert adventures, and world-class shopping.'
  },
  {
    id: genId(),
    title: 'Swiss Alps Luxury Ski',
    host: 'Alpine Elite',
    location: 'Zermatt & St. Moritz',
    country: 'Switzerland',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1548777123-e216912df7d8?w=800',
    price: '$12,000',
    priceValue: 12000,
    dates: 'Jan 20-28, 2025',
    duration: '9 days',
    durationDays: 9,
    rating: 4.95,
    reviewCount: 134,
    tags: ['Skiing', 'Luxury', 'Swiss Alps', 'Gourmet'],
    category: 'luxury',
    activityLevel: 'moderate',
    groupSize: 'couples',
    bestFor: ['Skiers', 'Luxury lovers', 'Foodies'],
    highlights: ['Private ski guide', 'Glacier Express', 'Michelin dining'],
    included: ['5-star hotels', 'Private guides', 'Glacier Express', 'Dining'],
    description: 'Ski Switzerland\'s most exclusive resorts with private guides, ride the Glacier Express, and dine at Michelin-starred restaurants.'
  },
  {
    id: genId(),
    title: 'African Luxury Safari',
    host: 'Singita Safaris',
    location: 'Tanzania & Rwanda',
    country: 'Tanzania',
    continent: 'Africa',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    price: '$18,000',
    priceValue: 18000,
    dates: 'Jul 10-22, 2025',
    duration: '13 days',
    durationDays: 13,
    rating: 4.98,
    reviewCount: 89,
    tags: ['Safari', 'Luxury', 'Gorillas', 'Big Five'],
    category: 'luxury',
    activityLevel: 'moderate',
    groupSize: 'couples',
    bestFor: ['Wildlife lovers', 'Luxury seekers', 'Bucket listers'],
    highlights: ['Serengeti', 'Gorilla trekking', 'Private lodges'],
    included: ['Luxury lodges', 'Flights', 'All activities', 'Full board'],
    description: 'The ultimate African safari combining Tanzania\'s Serengeti with Rwanda gorilla trekking, staying at Africa\'s finest lodges.'
  },
  {
    id: genId(),
    title: 'Amalfi Coast Villa Experience',
    host: 'Italian Villas',
    location: 'Positano & Ravello',
    country: 'Italy',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
    price: '$9,500',
    priceValue: 9500,
    dates: 'Jun 1-9, 2025',
    duration: '9 days',
    durationDays: 9,
    rating: 4.9,
    reviewCount: 156,
    tags: ['Italy', 'Villa', 'Coast', 'Gourmet'],
    category: 'luxury',
    activityLevel: 'low',
    groupSize: 'couples',
    bestFor: ['Couples', 'Foodies', 'Relaxation seekers'],
    highlights: ['Private villa', 'Private chef', 'Yacht day'],
    included: ['Villa', 'Private chef', 'Yacht', 'Concierge'],
    description: 'Stay in a stunning Amalfi Coast villa with private chef, yacht excursions, and complete Italian dolce vita luxury.'
  },
  {
    id: genId(),
    title: 'Patagonia Luxury Lodge',
    host: 'Tierra Patagonia',
    location: 'Torres del Paine',
    country: 'Chile',
    continent: 'South America',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    price: '$7,500',
    priceValue: 7500,
    dates: 'Nov 15-23, 2025',
    duration: '9 days',
    durationDays: 9,
    rating: 4.95,
    reviewCount: 178,
    tags: ['Patagonia', 'Luxury', 'Hiking', 'Wilderness'],
    category: 'luxury',
    activityLevel: 'moderate',
    groupSize: 'couples',
    bestFor: ['Adventure lovers', 'Nature seekers', 'Luxury hikers'],
    highlights: ['Design lodge', 'Private guides', 'Gourmet cuisine'],
    included: ['Luxury lodge', 'All-inclusive', 'Guides', 'Activities'],
    description: 'Experience Patagonia from a stunning design lodge with private guides, gourmet cuisine, and dramatic Torres del Paine views.'
  },

  // ============ BUDGET TRIPS ============
  {
    id: genId(),
    title: 'Southeast Asia Backpacker',
    host: 'Backpack Asia',
    location: 'Thailand, Vietnam, Cambodia',
    country: 'Multiple',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
    price: '$1,200',
    priceValue: 1200,
    dates: 'Mar 1-22, 2025',
    duration: '22 days',
    durationDays: 22,
    rating: 4.7,
    reviewCount: 678,
    tags: ['Backpacking', 'Budget', 'Culture', 'Adventure'],
    category: 'budget',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Budget travelers', 'Young adventurers', 'Solo travelers'],
    highlights: ['Bangkok', 'Ha Long Bay', 'Angkor Wat'],
    included: ['Hostels', 'Transport', 'Some meals', 'Guide'],
    description: 'The classic Southeast Asia backpacker route through Thailand, Vietnam, and Cambodia at an unbeatable price.'
  },
  {
    id: genId(),
    title: 'Portugal Budget Adventure',
    host: 'Euro Backpackers',
    location: 'Lisbon to Porto',
    country: 'Portugal',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800',
    price: '$890',
    priceValue: 890,
    dates: 'May 10-19, 2025',
    duration: '10 days',
    durationDays: 10,
    rating: 4.75,
    reviewCount: 456,
    tags: ['Budget', 'Portugal', 'Beach', 'Wine'],
    category: 'budget',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Budget travelers', 'Young travelers', 'Foodies'],
    highlights: ['Lisbon nightlife', 'Algarve beaches', 'Porto wine'],
    included: ['Hostels', 'Transport', 'Some meals', 'Guide'],
    description: 'Explore Portugal on a budget from Lisbon\'s nightlife to Algarve beaches and Porto\'s famous wine cellars.'
  },
  {
    id: genId(),
    title: 'Central America Budget',
    host: 'Gringo Trail',
    location: 'Guatemala to Costa Rica',
    country: 'Multiple',
    continent: 'Central America',
    image: 'https://images.unsplash.com/photo-1518182170546-07661fd94144?w=800',
    price: '$1,500',
    priceValue: 1500,
    dates: 'Feb 1-21, 2025',
    duration: '21 days',
    durationDays: 21,
    rating: 4.7,
    reviewCount: 345,
    tags: ['Backpacking', 'Volcanoes', 'Beaches', 'Culture'],
    category: 'budget',
    activityLevel: 'high',
    groupSize: 'small-group',
    bestFor: ['Backpackers', 'Adventure seekers', 'Budget travelers'],
    highlights: ['Antigua', 'Volcano hikes', 'Caribbean coast'],
    included: ['Hostels', 'Transport', 'Some activities'],
    description: 'Travel the Gringo Trail through Central America from Guatemala\'s colonial cities to Costa Rica\'s beaches.'
  },
  {
    id: genId(),
    title: 'Eastern Europe Explorer',
    host: 'Euro Budget Tours',
    location: 'Prague to Budapest',
    country: 'Multiple',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800',
    price: '$980',
    priceValue: 980,
    dates: 'Jun 5-16, 2025',
    duration: '12 days',
    durationDays: 12,
    rating: 4.75,
    reviewCount: 512,
    tags: ['Budget', 'History', 'Nightlife', 'Culture'],
    category: 'budget',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Young travelers', 'History buffs', 'Night owls'],
    highlights: ['Prague Old Town', 'Vienna palaces', 'Budapest baths'],
    included: ['Hostels', 'Transport', 'Walking tours', 'Some meals'],
    description: 'Explore the best of Eastern Europe on a budget from Prague\'s Gothic spires to Budapest\'s thermal baths.'
  },
  {
    id: genId(),
    title: 'India Budget Discovery',
    host: 'Incredible India Budget',
    location: 'Delhi to Goa',
    country: 'India',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
    price: '$1,100',
    priceValue: 1100,
    dates: 'Nov 1-21, 2025',
    duration: '21 days',
    durationDays: 21,
    rating: 4.7,
    reviewCount: 389,
    tags: ['Budget', 'Culture', 'Taj Mahal', 'Beach'],
    category: 'budget',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Budget travelers', 'Culture seekers', 'Adventure lovers'],
    highlights: ['Taj Mahal', 'Rajasthan forts', 'Goa beaches'],
    included: ['Guesthouses', 'Transport', 'Some meals', 'Guide'],
    description: 'Experience incredible India on a budget from the Taj Mahal to Rajasthan\'s colorful cities to Goa\'s beaches.'
  },

  // ============ FAMILY TRIPS ============
  {
    id: genId(),
    title: 'Costa Rica Family Adventure',
    host: 'Family Fun Adventures',
    location: 'San José to Manuel Antonio',
    country: 'Costa Rica',
    continent: 'Central America',
    image: 'https://images.unsplash.com/photo-1518182170546-07661fd94144?w=800',
    price: '$3,200',
    priceValue: 3200,
    dates: 'Jul 10-20, 2025',
    duration: '11 days',
    durationDays: 11,
    rating: 4.85,
    reviewCount: 423,
    tags: ['Family', 'Wildlife', 'Beach', 'Adventure'],
    category: 'family',
    activityLevel: 'moderate',
    groupSize: 'large-group',
    bestFor: ['Families', 'Kids', 'Nature lovers'],
    highlights: ['Sloth spotting', 'Zip-lining', 'Beach time'],
    included: ['Family hotels', 'Activities', 'Guide', 'Meals'],
    description: 'The perfect family adventure in Costa Rica with kid-friendly wildlife encounters, beaches, and gentle adventures.'
  },
  {
    id: genId(),
    title: 'Disney World Ultimate Package',
    host: 'Magic Makers',
    location: 'Orlando, FL',
    country: 'USA',
    continent: 'North America',
    image: 'https://images.unsplash.com/photo-1597466599360-3b9775841aec?w=800',
    price: '$4,500',
    priceValue: 4500,
    dates: 'Flexible',
    duration: '7 days',
    durationDays: 7,
    rating: 4.9,
    reviewCount: 567,
    tags: ['Disney', 'Theme Parks', 'Family', 'Magic'],
    category: 'family',
    activityLevel: 'moderate',
    groupSize: 'large-group',
    bestFor: ['Families', 'Disney fans', 'Kids'],
    highlights: ['All 4 parks', 'Character dining', 'Fireworks'],
    included: ['Disney resort', 'Park tickets', 'Dining plan', 'FastPass+'],
    description: 'The ultimate Disney World experience with luxury resort stay, all park access, dining plan, and VIP experiences.'
  },
  {
    id: genId(),
    title: 'Japan Family Discovery',
    host: 'Japan Family Tours',
    location: 'Tokyo to Kyoto',
    country: 'Japan',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    price: '$5,200',
    priceValue: 5200,
    dates: 'Apr 1-12, 2025',
    duration: '12 days',
    durationDays: 12,
    rating: 4.9,
    reviewCount: 312,
    tags: ['Japan', 'Family', 'Culture', 'Cherry Blossoms'],
    category: 'family',
    activityLevel: 'moderate',
    groupSize: 'large-group',
    bestFor: ['Families', 'Culture seekers', 'Japan lovers'],
    highlights: ['Cherry blossoms', 'Bullet train', 'Temples'],
    included: ['Family hotels', 'Rail pass', 'Tours', 'Guide'],
    description: 'Explore Japan with your family during cherry blossom season with kid-friendly activities, bullet trains, and cultural experiences.'
  },
  {
    id: genId(),
    title: 'Greek Islands Family Sail',
    host: 'Family Yacht Adventures',
    location: 'Cyclades Islands',
    country: 'Greece',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    price: '$4,800',
    priceValue: 4800,
    dates: 'Jul 5-14, 2025',
    duration: '10 days',
    durationDays: 10,
    rating: 4.85,
    reviewCount: 234,
    tags: ['Sailing', 'Greece', 'Family', 'Islands'],
    category: 'family',
    activityLevel: 'moderate',
    groupSize: 'large-group',
    bestFor: ['Families', 'Sailing enthusiasts', 'Beach lovers'],
    highlights: ['Private yacht', 'Island hopping', 'Swimming'],
    included: ['Yacht', 'Skipper', 'Meals', 'Water toys'],
    description: 'Sail the Greek islands on a family-friendly yacht with your own skipper, swimming stops, and island exploration.'
  },
  {
    id: genId(),
    title: 'Safari Family Adventure',
    host: 'Family Safari Experts',
    location: 'Kenya',
    country: 'Kenya',
    continent: 'Africa',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    price: '$6,500',
    priceValue: 6500,
    dates: 'Aug 1-12, 2025',
    duration: '12 days',
    durationDays: 12,
    rating: 4.9,
    reviewCount: 278,
    tags: ['Safari', 'Family', 'Wildlife', 'Africa'],
    category: 'family',
    activityLevel: 'moderate',
    groupSize: 'large-group',
    bestFor: ['Families', 'Wildlife lovers', 'Adventure seekers'],
    highlights: ['Big Five', 'Maasai village', 'Beach ending'],
    included: ['Family lodges', 'Game drives', 'All meals', 'Beach resort'],
    description: 'A family-friendly Kenya safari designed for all ages, with game drives, cultural visits, and a beach holiday to finish.'
  },

  // ============ ROMANTIC TRIPS ============
  {
    id: genId(),
    title: 'Paris Romance Escape',
    host: 'City of Love Tours',
    location: 'Paris',
    country: 'France',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    price: '$3,500',
    priceValue: 3500,
    dates: 'Flexible',
    duration: '5 days',
    durationDays: 5,
    rating: 4.9,
    reviewCount: 567,
    tags: ['Paris', 'Romance', 'Gourmet', 'Art'],
    category: 'romantic',
    activityLevel: 'low',
    groupSize: 'couples',
    bestFor: ['Couples', 'Honeymooners', 'Anniversaries'],
    highlights: ['Eiffel Tower dinner', 'Louvre private tour', 'Seine cruise'],
    included: ['Boutique hotel', 'Experiences', 'Private tours', 'Meals'],
    description: 'The ultimate Paris romantic getaway with Eiffel Tower dining, private Louvre tour, and enchanting Seine River cruise.'
  },
  {
    id: genId(),
    title: 'Santorini Honeymoon',
    host: 'Greek Romance',
    location: 'Santorini',
    country: 'Greece',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    price: '$4,200',
    priceValue: 4200,
    dates: 'Flexible',
    duration: '7 days',
    durationDays: 7,
    rating: 4.95,
    reviewCount: 423,
    tags: ['Santorini', 'Romance', 'Sunset', 'Honeymoon'],
    category: 'romantic',
    activityLevel: 'low',
    groupSize: 'couples',
    bestFor: ['Honeymooners', 'Couples', 'Romantics'],
    highlights: ['Cave hotel', 'Sunset sailing', 'Wine tasting'],
    included: ['Cave suite', 'Yacht cruise', 'Wine tour', 'Dinners'],
    description: 'Experience Santorini\'s famous sunsets from your private cave suite with sailing, wine tasting, and romantic dinners.'
  },
  {
    id: genId(),
    title: 'Venice Anniversary Special',
    host: 'Venetian Romance',
    location: 'Venice',
    country: 'Italy',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800',
    price: '$3,800',
    priceValue: 3800,
    dates: 'Flexible',
    duration: '5 days',
    durationDays: 5,
    rating: 4.9,
    reviewCount: 312,
    tags: ['Venice', 'Romance', 'Gondola', 'Art'],
    category: 'romantic',
    activityLevel: 'low',
    groupSize: 'couples',
    bestFor: ['Couples', 'Art lovers', 'Romantics'],
    highlights: ['Private gondola', 'Murano glass', 'Opera night'],
    included: ['Canal-view room', 'Private tours', 'Opera', 'Dinners'],
    description: 'Fall in love again in Venice with private gondola rides, opera performances, and secret canal explorations.'
  },
  {
    id: genId(),
    title: 'Maldives Couples Retreat',
    host: 'Paradise Retreats',
    location: 'Maldives',
    country: 'Maldives',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    price: '$7,500',
    priceValue: 7500,
    dates: 'Flexible',
    duration: '7 days',
    durationDays: 7,
    rating: 4.98,
    reviewCount: 289,
    tags: ['Maldives', 'Romance', 'Luxury', 'Beach'],
    category: 'romantic',
    activityLevel: 'low',
    groupSize: 'couples',
    bestFor: ['Couples', 'Honeymooners', 'Luxury lovers'],
    highlights: ['Overwater villa', 'Couples spa', 'Underwater dining'],
    included: ['Overwater villa', 'All meals', 'Spa', 'Experiences'],
    description: 'Ultimate romantic escape in the Maldives with overwater villa, couples spa treatments, and unforgettable underwater dining.'
  },
  {
    id: genId(),
    title: 'Hawaii Big Island Romance',
    host: 'Aloha Love',
    location: 'Big Island, Hawaii',
    country: 'USA',
    continent: 'North America',
    image: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800',
    price: '$4,500',
    priceValue: 4500,
    dates: 'Flexible',
    duration: '8 days',
    durationDays: 8,
    rating: 4.85,
    reviewCount: 345,
    tags: ['Hawaii', 'Romance', 'Volcano', 'Beach'],
    category: 'romantic',
    activityLevel: 'moderate',
    groupSize: 'couples',
    bestFor: ['Couples', 'Adventure lovers', 'Nature seekers'],
    highlights: ['Volcano sunset', 'Manta ray dive', 'Stargazing'],
    included: ['Resort', 'Activities', 'Some meals', 'Car rental'],
    description: 'Experience Hawaii\'s most romantic moments - volcano sunsets, manta ray snorkeling, and stargazing on Mauna Kea.'
  },

  // ============ UNIQUE/SPECIAL INTEREST ============
  {
    id: genId(),
    title: 'Northern Lights Photo Workshop',
    host: 'Aurora Photography Tours',
    location: 'Finnish Lapland',
    country: 'Finland',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
    price: '$3,600',
    priceValue: 3600,
    dates: 'Feb 15-23, 2025',
    duration: '9 days',
    durationDays: 9,
    rating: 4.9,
    reviewCount: 189,
    tags: ['Photography', 'Northern Lights', 'Workshop', 'Winter'],
    category: 'adventure',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Photographers', 'Aurora chasers', 'Winter lovers'],
    highlights: ['Photo instruction', 'Glass igloo', 'Husky safari'],
    included: ['Accommodation', 'Photo guide', 'Equipment', 'Activities'],
    description: 'Learn to photograph the Northern Lights with expert instructors in Finnish Lapland, staying in glass igloos and arctic lodges.'
  },
  {
    id: genId(),
    title: 'Bordeaux Wine Harvest',
    host: 'Grape Escapes',
    location: 'Bordeaux',
    country: 'France',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800',
    price: '$3,200',
    priceValue: 3200,
    dates: 'Sep 20-28, 2025',
    duration: '9 days',
    durationDays: 9,
    rating: 4.85,
    reviewCount: 234,
    tags: ['Wine', 'Harvest', 'France', 'Gourmet'],
    category: 'cultural',
    activityLevel: 'moderate',
    groupSize: 'small-group',
    bestFor: ['Wine lovers', 'Foodies', 'Culture seekers'],
    highlights: ['Harvest participation', 'Château visits', 'Gourmet dinners'],
    included: ['Château stays', 'Tastings', 'Meals', 'Guide'],
    description: 'Experience Bordeaux wine harvest season with hands-on grape picking, exclusive château visits, and gourmet wine dinners.'
  },
  {
    id: genId(),
    title: 'Camino de Santiago',
    host: 'Pilgrim Journeys',
    location: 'Northern Spain',
    country: 'Spain',
    continent: 'Europe',
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800',
    price: '$2,400',
    priceValue: 2400,
    dates: 'May 1-15, 2025',
    duration: '15 days',
    durationDays: 15,
    rating: 4.8,
    reviewCount: 312,
    tags: ['Pilgrimage', 'Hiking', 'Spiritual', 'Spain'],
    category: 'adventure',
    activityLevel: 'high',
    groupSize: 'small-group',
    bestFor: ['Spiritual seekers', 'Hikers', 'Solo travelers'],
    highlights: ['Santiago Cathedral', 'Pilgrim community', 'Spanish villages'],
    included: ['Albergues', 'Luggage transport', 'Some meals', 'Guide'],
    description: 'Walk the final stages of the Camino de Santiago pilgrimage route through beautiful Spanish countryside to the Cathedral.'
  },
  {
    id: genId(),
    title: 'Japanese Whisky Trail',
    host: 'Spirit Tours Japan',
    location: 'Tokyo to Hokkaido',
    country: 'Japan',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800',
    price: '$4,500',
    priceValue: 4500,
    dates: 'Oct 10-20, 2025',
    duration: '11 days',
    durationDays: 11,
    rating: 4.9,
    reviewCount: 167,
    tags: ['Whisky', 'Japan', 'Distilleries', 'Gourmet'],
    category: 'cultural',
    activityLevel: 'low',
    groupSize: 'small-group',
    bestFor: ['Whisky enthusiasts', 'Japan lovers', 'Foodies'],
    highlights: ['Yamazaki distillery', 'Nikka visit', 'Rare tastings'],
    included: ['Hotels', 'Distillery tours', 'Tastings', 'Transfers'],
    description: 'Explore Japan\'s world-renowned whisky distilleries from Yamazaki to Nikka, with exclusive tastings and blending sessions.'
  },
  {
    id: genId(),
    title: 'Trans-Siberian Railway',
    host: 'Epic Rail Journeys',
    location: 'Moscow to Beijing',
    country: 'Russia/Mongolia/China',
    continent: 'Asia',
    image: 'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=800',
    price: '$5,500',
    priceValue: 5500,
    dates: 'Jun 5-22, 2025',
    duration: '18 days',
    durationDays: 18,
    rating: 4.85,
    reviewCount: 189,
    tags: ['Train', 'Epic', 'Russia', 'Mongolia'],
    category: 'adventure',
    activityLevel: 'low',
    groupSize: 'small-group',
    bestFor: ['Train lovers', 'Adventure seekers', 'Culture enthusiasts'],
    highlights: ['Moscow to Beijing', 'Lake Baikal', 'Mongolian steppes'],
    included: ['Train berths', 'Hotels', 'Tours', 'Some meals'],
    description: 'The ultimate train journey across Russia, Mongolia, and into China on the legendary Trans-Siberian Railway.'
  }
];

// Get trips by category
export const getTripsByCategory = (category: TripListing['category']) =>
  tripDatabase.filter(trip => trip.category === category);

// Get trips by price range
export const getTripsByPriceRange = (min: number, max: number) =>
  tripDatabase.filter(trip => trip.priceValue >= min && trip.priceValue <= max);

// Get trips by duration
export const getTripsByDuration = (minDays: number, maxDays: number) =>
  tripDatabase.filter(trip => trip.durationDays >= minDays && trip.durationDays <= maxDays);

// Get trips by activity level
export const getTripsByActivityLevel = (level: TripListing['activityLevel']) =>
  tripDatabase.filter(trip => trip.activityLevel === level);

// Search trips by keyword
export const searchTrips = (keyword: string) => {
  const lower = keyword.toLowerCase();
  return tripDatabase.filter(trip =>
    trip.title.toLowerCase().includes(lower) ||
    trip.location.toLowerCase().includes(lower) ||
    trip.country.toLowerCase().includes(lower) ||
    trip.tags.some(tag => tag.toLowerCase().includes(lower)) ||
    trip.description.toLowerCase().includes(lower) ||
    trip.bestFor.some(bf => bf.toLowerCase().includes(lower))
  );
};

// Get featured trips (high rating, good review count)
export const getFeaturedTrips = (count: number = 10) =>
  [...tripDatabase]
    .sort((a, b) => (b.rating * Math.log(b.reviewCount)) - (a.rating * Math.log(a.reviewCount)))
    .slice(0, count);

// Get trips summary for AI context (lighter weight)
export const getTripsSummaryForAI = () =>
  tripDatabase.map(t => ({
    id: t.id,
    title: t.title,
    location: `${t.location}, ${t.country}`,
    price: t.price,
    duration: t.duration,
    category: t.category,
    tags: t.tags.slice(0, 5),
    rating: t.rating,
    activityLevel: t.activityLevel,
    bestFor: t.bestFor,
    highlights: t.highlights.slice(0, 3),
    description: t.description.slice(0, 150)
  }));

// External Platform Search Links
export const externalPlatforms = {
  tripadvisor: {
    name: 'TripAdvisor',
    logo: 'https://static.tacdn.com/img2/brand/favicon/favicon-32x32.png',
    searchUrl: (query: string, destination?: string) =>
      `https://www.tripadvisor.com/Search?q=${encodeURIComponent(query)}${destination ? `&geo=${encodeURIComponent(destination)}` : ''}`,
    toursUrl: (destination: string) =>
      `https://www.tripadvisor.com/Attractions-${encodeURIComponent(destination)}-Activities`,
  },
  expedia: {
    name: 'Expedia',
    logo: 'https://www.expedia.com/favicon.ico',
    searchUrl: (destination: string, startDate?: string, endDate?: string) =>
      `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(destination)}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`,
    packagesUrl: (destination: string) =>
      `https://www.expedia.com/Vacation-Packages?destination=${encodeURIComponent(destination)}`,
  },
  tourradar: {
    name: 'TourRadar',
    logo: 'https://www.tourradar.com/favicon.ico',
    searchUrl: (destination: string, category?: string) =>
      `https://www.tourradar.com/d/${encodeURIComponent(destination.toLowerCase().replace(/\s+/g, '-'))}${category ? `?o=priceasc&q=${encodeURIComponent(category)}` : ''}`,
    adventureUrl: (destination: string) =>
      `https://www.tourradar.com/d/${encodeURIComponent(destination.toLowerCase().replace(/\s+/g, '-'))}`,
  },
  viator: {
    name: 'Viator',
    logo: 'https://www.viator.com/favicon.ico',
    searchUrl: (destination: string) =>
      `https://www.viator.com/searchResults/all?text=${encodeURIComponent(destination)}`,
    experiencesUrl: (destination: string) =>
      `https://www.viator.com/${encodeURIComponent(destination.replace(/\s+/g, '-'))}/tours-and-activities`,
  },
  getyourguide: {
    name: 'GetYourGuide',
    logo: 'https://cdn.getyourguide.com/favicon.ico',
    searchUrl: (destination: string) =>
      `https://www.getyourguide.com/s/?q=${encodeURIComponent(destination)}`,
  },
  airbnb: {
    name: 'Airbnb Experiences',
    logo: 'https://www.airbnb.com/favicon.ico',
    experiencesUrl: (destination: string) =>
      `https://www.airbnb.com/s/${encodeURIComponent(destination)}/experiences`,
  },
  klook: {
    name: 'Klook',
    logo: 'https://www.klook.com/favicon.ico',
    searchUrl: (destination: string) =>
      `https://www.klook.com/search/?query=${encodeURIComponent(destination)}`,
  },
  intrepid: {
    name: 'Intrepid Travel',
    logo: 'https://www.intrepidtravel.com/favicon.ico',
    searchUrl: (destination: string) =>
      `https://www.intrepidtravel.com/search?searchterm=${encodeURIComponent(destination)}`,
  },
  gadventures: {
    name: 'G Adventures',
    logo: 'https://www.gadventures.com/favicon.ico',
    searchUrl: (destination: string) =>
      `https://www.gadventures.com/search/?q=${encodeURIComponent(destination)}`,
  },
  contiki: {
    name: 'Contiki',
    logo: 'https://www.contiki.com/favicon.ico',
    searchUrl: (destination: string) =>
      `https://www.contiki.com/search?searchTerm=${encodeURIComponent(destination)}`,
  },
  booking: {
    name: 'Booking.com',
    logo: 'https://www.booking.com/favicon.ico',
    searchUrl: (destination: string) =>
      `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`,
    experiencesUrl: (destination: string) =>
      `https://www.booking.com/attractions/searchresults.html?query=${encodeURIComponent(destination)}`,
  },
  ctrip: {
    name: 'Ctrip/Trip.com',
    logo: 'https://www.trip.com/favicon.ico',
    searchUrl: (destination: string) =>
      `https://www.trip.com/travel-guide/${encodeURIComponent(destination.toLowerCase().replace(/\s+/g, '-'))}/`,
    toursUrl: (destination: string) =>
      `https://www.trip.com/things-to-do/search/list?keyword=${encodeURIComponent(destination)}`,
  }
};

// Generate external search links based on AI-provided search terms or preferences
export const generateExternalSearchLinks = (preferences: {
  destination?: string;
  category?: string;
  duration?: string;
  budget?: string;
  // Custom search terms from Gemini AI
  searchTerms?: {
    tripadvisor?: string;
    booking?: string;
    ctrip?: string;
  };
}) => {
  const { destination, category, searchTerms } = preferences;
  const defaultSearchTerm = destination || category || 'adventure travel';

  return [
    {
      platform: 'TripAdvisor',
      url: externalPlatforms.tripadvisor.searchUrl(searchTerms?.tripadvisor || defaultSearchTerm, destination),
      description: searchTerms?.tripadvisor || 'Read reviews and find tours',
      searchTerm: searchTerms?.tripadvisor || defaultSearchTerm
    },
    {
      platform: 'Booking.com',
      url: externalPlatforms.booking.searchUrl(searchTerms?.booking || defaultSearchTerm),
      description: searchTerms?.booking || 'Hotels and travel experiences',
      searchTerm: searchTerms?.booking || defaultSearchTerm
    },
    {
      platform: 'Ctrip/Trip.com',
      url: externalPlatforms.ctrip.toursUrl(searchTerms?.ctrip || defaultSearchTerm),
      description: searchTerms?.ctrip || 'Asia tours and activities',
      searchTerm: searchTerms?.ctrip || defaultSearchTerm
    },
    {
      platform: 'Viator',
      url: externalPlatforms.viator.searchUrl(defaultSearchTerm),
      description: 'Book experiences and day trips',
      searchTerm: defaultSearchTerm
    },
    {
      platform: 'Expedia',
      url: destination ? externalPlatforms.expedia.packagesUrl(destination) : externalPlatforms.expedia.searchUrl(defaultSearchTerm),
      description: 'Compare vacation packages',
      searchTerm: defaultSearchTerm
    }
  ];
};

// Categories for filtering
export const tripCategories = [
  { id: 'adventure', label: 'Adventure', emoji: '🏔️', description: 'Hiking, skiing, climbing, extreme sports' },
  { id: 'sports', label: 'Sports Events', emoji: '🏆', description: 'NBA, NFL, F1, golf tournaments' },
  { id: 'wellness', label: 'Wellness', emoji: '🧘', description: 'Yoga retreats, spas, meditation' },
  { id: 'cultural', label: 'Cultural', emoji: '🏛️', description: 'History, food tours, art, heritage' },
  { id: 'beach', label: 'Beach & Relaxation', emoji: '🏖️', description: 'Islands, resorts, tropical escapes' },
  { id: 'nature', label: 'Nature & Wildlife', emoji: '🦁', description: 'Safaris, national parks, wildlife' },
  { id: 'luxury', label: 'Luxury', emoji: '✨', description: 'Five-star, exclusive, premium' },
  { id: 'budget', label: 'Budget', emoji: '💰', description: 'Backpacking, affordable adventures' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', description: 'Kid-friendly, all ages' },
  { id: 'romantic', label: 'Romantic', emoji: '💕', description: 'Couples, honeymoons, anniversaries' },
];

// Popular destinations
export const popularDestinations = [
  { name: 'Japan', emoji: '🇯🇵', continent: 'Asia' },
  { name: 'Italy', emoji: '🇮🇹', continent: 'Europe' },
  { name: 'Thailand', emoji: '🇹🇭', continent: 'Asia' },
  { name: 'Costa Rica', emoji: '🇨🇷', continent: 'Central America' },
  { name: 'Iceland', emoji: '🇮🇸', continent: 'Europe' },
  { name: 'New Zealand', emoji: '🇳🇿', continent: 'Oceania' },
  { name: 'Morocco', emoji: '🇲🇦', continent: 'Africa' },
  { name: 'Peru', emoji: '🇵🇪', continent: 'South America' },
  { name: 'Greece', emoji: '🇬🇷', continent: 'Europe' },
  { name: 'Bali', emoji: '🇮🇩', continent: 'Asia' },
  { name: 'Switzerland', emoji: '🇨🇭', continent: 'Europe' },
  { name: 'Kenya', emoji: '🇰🇪', continent: 'Africa' },
  { name: 'Maldives', emoji: '🇲🇻', continent: 'Asia' },
  { name: 'Portugal', emoji: '🇵🇹', continent: 'Europe' },
  { name: 'Vietnam', emoji: '🇻🇳', continent: 'Asia' },
];

// Populate member and ranking data for all trips
tripDatabase.forEach((trip, index) => {
  trip.memberData = generateMemberData(index + 1);
  trip.rankingData = generateRankingData(index + 1, tripDatabase.length);
});

// Sort trips by ranking for default display
export const tripsByRanking = [...tripDatabase].sort((a, b) =>
  (a.rankingData?.currentRank || 999) - (b.rankingData?.currentRank || 999)
);

// Get trending trips (high trending score)
export const trendingTrips = [...tripDatabase]
  .filter(t => (t.rankingData?.trendingScore || 0) >= 70)
  .sort((a, b) => (b.rankingData?.trendingScore || 0) - (a.rankingData?.trendingScore || 0));

// Get trips with available spots
export const tripsWithSpots = tripDatabase.filter(t =>
  (t.memberData?.spotsLeft || 0) > 0
);

// Get most booked trips
export const mostBookedTrips = [...tripDatabase]
  .sort((a, b) => (b.memberData?.totalBooked || 0) - (a.memberData?.totalBooked || 0))
  .slice(0, 20);

// Get trips by member name (for showing what trips a member is on)
export const getTripsByMember = (memberName: string) => {
  return tripDatabase.filter(trip =>
    trip.memberData?.booked.some(m => m.name === memberName) ||
    trip.memberData?.signedUp.some(m => m.name === memberName) ||
    trip.memberData?.saved.some(m => m.name === memberName)
  );
};

// Get member's booked trips
export const getMemberBookedTrips = (memberName: string) => {
  return tripDatabase.filter(trip =>
    trip.memberData?.booked.some(m => m.name === memberName)
  );
};

// Get member's saved trips
export const getMemberSavedTrips = (memberName: string) => {
  return tripDatabase.filter(trip =>
    trip.memberData?.saved.some(m => m.name === memberName)
  );
};

export default tripDatabase;
