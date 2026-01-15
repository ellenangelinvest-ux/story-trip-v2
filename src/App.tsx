import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Users, Camera, Upload, Share2, Play, Lock, Check, ChevronRight, ChevronLeft,
  MapPin, Calendar, Star, Sparkles, Mountain, Trophy, Globe, MessageCircle, Heart,
  Zap, Smile, Film, Image, X, Plus, CloudUpload, Compass, Award, UserPlus,
  Clock, Coffee, Sun, Moon, Sunset, Video, Copy, Instagram, Twitter, Filter,
  Utensils, Building, ShoppingBag, TreePine, Waves, Camera as CameraIcon, Music,
  Landmark, Wine, Car, Info, ArrowRight, Pause, SkipForward, Settings, Eye, Briefcase,
  Send, Mail
} from 'lucide-react';
import './index.css';
import { tripDatabase, getTripsSummaryForAI, generateExternalSearchLinks, TripListing } from './tripDatabase';

// ============ TYPES ============
type AppScreen = 'landing' | 'chat-onboarding' | 'personal-interest' | 'narrative' | 'trips' | 'trip-detail' | 'squad' | 'itinerary' | 'memory-maker' | 'film-studio' | 'demo' | 'about' | 'create-trip' | 'manage-trips';

// User Profile for personalized matching
interface UserProfile {
  name: string;
  gender: Gender | null;
  nationality: Nationality | null;
  customNationality?: string;  // For "other" nationality
  interests: InterestCategory[];
  customInterests?: string[];  // For custom interests
  personality: PersonalityType | null;
  relationshipStatus: RelationshipStatus | null;
  travelDates: {
    startDate: string;
    endDate: string;
    duration: number; // in days
  } | null;
  budgetRange: 'budget' | 'mid-range' | 'luxury' | 'ultra-luxury' | null;
  groupPreference: 'solo' | 'duo' | 'small-group' | 'large-group' | null;
}

type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
type InterestCategory = 'nba' | 'mlb' | 'nfl' | 'nhl' | 'fifa' | 'f1' | 'golf' | 'tennis' | 'mma' | 'skiing' | 'surfing' | 'reading' | 'movies' | 'music' | 'gaming' | 'photography' | 'cooking' | 'fitness' | 'yoga' | 'hiking' | 'art' | 'theater' | 'wine' | 'travel';
type PersonalityType = 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';
type TravelStyle = 'adventurous' | 'relaxed' | 'cultural' | 'party' | 'wellness' | 'foodie' | 'photography' | 'luxury';
type Season = 'spring' | 'summer' | 'fall' | 'winter';

type SportCategory = 'nba' | 'mlb' | 'nfl' | 'nhl' | 'fifa' | 'golf' | 'tennis' | 'f1' | 'skiing' | 'surfing' | 'mma';
type TripCategory = 'sports' | 'family' | 'romantic' | 'adventure' | 'cultural' | 'wellness';
type TripVisibility = 'public' | 'private';
type RelationshipStatus = 'single' | 'married' | 'looking' | 'family' | 'couple';
type Nationality = 'us' | 'uk' | 'jp' | 'de' | 'fr' | 'au' | 'ca' | 'it' | 'es' | 'br' | 'kr' | 'mx' | 'nl' | 'ch' | 'nz' | 'sg' | 'ae' | 'in' | 'cn' | 'ar' | 'tw' | 'other';

// Trip Creation Form
interface TripFormData {
  title: string;
  category: TripCategory;
  highlight: SportCategory | 'hiking' | 'biking' | 'diving' | 'beach' | 'city' | 'wine' | 'spa' | 'museum' | 'food-tour';
  destination: string;
  groupSize: number;
  visibility: TripVisibility;
  budgetPerPerson: number;
  duration: number;
  startDate: string;
  description: string;
}

interface TripQuotation {
  id: string;
  totalEstimate: number;
  breakdown: {
    accommodation: number;
    activities: number;
    transport: number;
    meals: number;
    tickets: number;
  };
  confidence: 'high' | 'medium' | 'low';
  aiSuggestions: string[];
  agentBids?: AgentBid[];
}

interface AgentBid {
  agentName: string;
  agentAvatar: string;
  agentRating: number;
  bidAmount: number;
  message: string;
  specialties: string[];
  responseTime: string;
}

interface TripHighlight {
  id: string;
  name: string;
  icon: string;
  category: TripCategory;
}

interface SportInfo {
  id: SportCategory;
  name: string;
  icon: string;
  color: string;
}

interface RelationshipInfo {
  id: RelationshipStatus;
  name: string;
  icon: string;
  description: string;
}

interface NationalityInfo {
  id: Nationality;
  name: string;
  flag: string;
  region: string;
}

interface Narrative {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
}

interface NearbyAttraction {
  name: string;
  type: 'restaurant' | 'landmark' | 'activity' | 'shopping' | 'nature' | 'nightlife';
  distance: string;
  rating: number;
  description: string;
  image: string;
  mustTry?: string;
}

interface LocalRecommendation {
  category: string;
  icon: string;
  items: string[];
}

// Signed up traveler for a trip
interface SignedUpTraveler {
  id: string;
  name: string;
  avatar: string;
  nationality: Nationality;
  interests: InterestCategory[];
  personality?: PersonalityType;
  relationshipStatus: RelationshipStatus;
  age: number;
  bio: string;
}

interface Trip {
  id: string;
  title: string;
  host: string;
  location: string;
  image: string;
  price: string;
  dates: string;
  duration: string;
  rating: number;
  tags: string[];
  narrative: string;
  sportCategory?: SportCategory;
  storyBeats: StoryBeat[];
  nearbyAttractions: NearbyAttraction[];
  localTips: LocalRecommendation[];
  signedUpTravelers?: SignedUpTraveler[];
  spotsLeft?: number;
  totalSpots?: number;
  // Trip source indicator
  source?: 'platform' | 'user-created';
  isOpenForSignup?: boolean;
  creatorName?: string;
}

interface StoryBeat {
  day: number;
  title: string;
  description: string;
  location: string;
  mood: 'rising' | 'peak' | 'falling';
  activities: string[];
  localSpots?: string[];
}

interface Squad {
  id: string;
  name: string;
  vibe: string;
  members: Member[];
  maxMembers: number;
  compatibility: number;
  avatar: string;
  description: string;
  sportInterests: SportCategory[];
}

interface Member {
  name: string;
  avatar: string;
  from: string;
  bio?: string;
  sportInterests: SportCategory[];
  travelStyle?: string;
  nationality: Nationality;
  relationshipStatus: RelationshipStatus;
  age?: number;
}

interface ShotPrompt {
  id: string;
  prompt: string;
  tip: string;
  uploaded: boolean;
  thumbnail?: string;
  uploadedBy?: string;  // Member name who uploaded
  uploadedAt?: string;  // Timestamp
}

interface GroupUpload {
  id: string;
  fileName: string;
  thumbnail: string;
  uploadedBy: string;
  uploadedAt: string;
  type: 'photo' | 'video';
  selected: boolean;  // Selected for final video/album
}

type OutputFormat = 'video-30' | 'video-60' | 'album';
type PhotoSource = 'device' | 'google-photos' | 'icloud';

interface Caption {
  style: 'deep' | 'hype' | 'funny';
  label: string;
  emoji: string;
  text: string;
  hashtags: string[];
}

// ============ SPORT CATEGORIES ============
const sportCategories: SportInfo[] = [
  { id: 'nba', name: 'NBA Basketball', icon: '🏀', color: 'orange' },
  { id: 'mlb', name: 'MLB Baseball', icon: '⚾', color: 'red' },
  { id: 'nfl', name: 'NFL Football', icon: '🏈', color: 'brown' },
  { id: 'nhl', name: 'NHL Hockey', icon: '🏒', color: 'blue' },
  { id: 'fifa', name: 'FIFA World Cup', icon: '⚽', color: 'green' },
  { id: 'golf', name: 'Golf / PGA', icon: '⛳', color: 'green' },
  { id: 'tennis', name: 'Tennis / Grand Slam', icon: '🎾', color: 'yellow' },
  { id: 'f1', name: 'Formula 1', icon: '🏎️', color: 'red' },
  { id: 'skiing', name: 'Skiing / Snowboarding', icon: '⛷️', color: 'blue' },
  { id: 'surfing', name: 'Surfing', icon: '🏄', color: 'teal' },
  { id: 'mma', name: 'MMA / UFC', icon: '🥊', color: 'red' },
];

// ============ RELATIONSHIP STATUS ============
const relationshipStatuses: RelationshipInfo[] = [
  { id: 'single', name: 'Single', icon: '👤', description: 'Solo adventurer ready to meet new people' },
  { id: 'married', name: 'Married', icon: '💍', description: 'Traveling with spouse or on a solo break' },
  { id: 'looking', name: 'Looking for Connection', icon: '💕', description: 'Open to meeting someone special' },
  { id: 'family', name: 'Family with Kids', icon: '👨‍👩‍👧‍👦', description: 'Traveling with children' },
  { id: 'couple', name: 'Couple in Love', icon: '💑', description: 'Romantic getaway together' },
];

// ============ NATIONALITIES ============
const nationalities: NationalityInfo[] = [
  { id: 'us', name: 'United States', flag: '🇺🇸', region: 'North America' },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
  { id: 'jp', name: 'Japan', flag: '🇯🇵', region: 'Asia' },
  { id: 'de', name: 'Germany', flag: '🇩🇪', region: 'Europe' },
  { id: 'fr', name: 'France', flag: '🇫🇷', region: 'Europe' },
  { id: 'au', name: 'Australia', flag: '🇦🇺', region: 'Oceania' },
  { id: 'ca', name: 'Canada', flag: '🇨🇦', region: 'North America' },
  { id: 'it', name: 'Italy', flag: '🇮🇹', region: 'Europe' },
  { id: 'es', name: 'Spain', flag: '🇪🇸', region: 'Europe' },
  { id: 'br', name: 'Brazil', flag: '🇧🇷', region: 'South America' },
  { id: 'kr', name: 'South Korea', flag: '🇰🇷', region: 'Asia' },
  { id: 'mx', name: 'Mexico', flag: '🇲🇽', region: 'North America' },
  { id: 'nl', name: 'Netherlands', flag: '🇳🇱', region: 'Europe' },
  { id: 'ch', name: 'Switzerland', flag: '🇨🇭', region: 'Europe' },
  { id: 'nz', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania' },
  { id: 'sg', name: 'Singapore', flag: '🇸🇬', region: 'Asia' },
  { id: 'ae', name: 'UAE', flag: '🇦🇪', region: 'Middle East' },
  { id: 'in', name: 'India', flag: '🇮🇳', region: 'Asia' },
  { id: 'cn', name: 'China', flag: '🇨🇳', region: 'Asia' },
  { id: 'ar', name: 'Argentina', flag: '🇦🇷', region: 'South America' },
  { id: 'tw', name: 'Taiwan', flag: '🇹🇼', region: 'Asia' },
  { id: 'other', name: 'Other', flag: '🌍', region: 'Other' },
];

// ============ TRAVEL STYLES ============
const travelStyles: { id: TravelStyle; name: string; icon: string; description: string }[] = [
  { id: 'adventurous', name: 'Adventurous', icon: '🏔️', description: 'Thrill-seeking & outdoor activities' },
  { id: 'relaxed', name: 'Relaxed', icon: '🧘', description: 'Slow pace & stress-free vibes' },
  { id: 'cultural', name: 'Cultural', icon: '🏛️', description: 'Museums, history & local traditions' },
  { id: 'party', name: 'Party', icon: '🎉', description: 'Nightlife & social scenes' },
  { id: 'wellness', name: 'Wellness', icon: '💆', description: 'Spa, yoga & self-care focused' },
  { id: 'foodie', name: 'Foodie', icon: '🍽️', description: 'Culinary experiences & local cuisine' },
  { id: 'photography', name: 'Photography', icon: '📸', description: 'Capturing moments & scenic spots' },
  { id: 'luxury', name: 'Luxury', icon: '✨', description: 'Premium experiences & comfort' },
];

// ============ SEASONS ============
const seasons: { id: Season; name: string; icon: string; months: string }[] = [
  { id: 'spring', name: 'Spring', icon: '🌸', months: 'Mar - May' },
  { id: 'summer', name: 'Summer', icon: '☀️', months: 'Jun - Aug' },
  { id: 'fall', name: 'Fall', icon: '🍂', months: 'Sep - Nov' },
  { id: 'winter', name: 'Winter', icon: '❄️', months: 'Dec - Feb' },
];

// ============ BUDGET RANGES ============
const budgetRanges: { id: UserProfile['budgetRange']; name: string; icon: string; range: string }[] = [
  { id: 'budget', name: 'Budget', icon: '💵', range: 'Under $1,000' },
  { id: 'mid-range', name: 'Mid-Range', icon: '💰', range: '$1,000 - $3,000' },
  { id: 'luxury', name: 'Luxury', icon: '💎', range: '$3,000 - $7,000' },
  { id: 'ultra-luxury', name: 'Ultra Luxury', icon: '👑', range: '$7,000+' },
];

// ============ GROUP PREFERENCES ============
const groupPreferences: { id: UserProfile['groupPreference']; name: string; icon: string; description: string }[] = [
  { id: 'solo', name: 'Solo', icon: '🚶', description: 'Just me' },
  { id: 'duo', name: 'Duo', icon: '👫', description: 'Me + 1' },
  { id: 'small-group', name: 'Small Group', icon: '👥', description: '3-6 people' },
  { id: 'large-group', name: 'Large Group', icon: '👨‍👩‍👧‍👦', description: '7+ people' },
];

// ============ GENDERS ============
const genders: { id: Gender; name: string; icon: string }[] = [
  { id: 'male', name: 'Male', icon: '👨' },
  { id: 'female', name: 'Female', icon: '👩' },
  { id: 'non-binary', name: 'Non-binary', icon: '🧑' },
  { id: 'prefer-not-to-say', name: 'Prefer not to say', icon: '🤐' },
];

// ============ INTERESTS / HOBBIES ============
const interestCategories: { id: InterestCategory; name: string; icon: string; category: 'sports' | 'entertainment' | 'lifestyle' }[] = [
  // Sports
  { id: 'nba', name: 'NBA Basketball', icon: '🏀', category: 'sports' },
  { id: 'mlb', name: 'MLB Baseball', icon: '⚾', category: 'sports' },
  { id: 'nfl', name: 'NFL Football', icon: '🏈', category: 'sports' },
  { id: 'nhl', name: 'NHL Hockey', icon: '🏒', category: 'sports' },
  { id: 'fifa', name: 'FIFA / Soccer', icon: '⚽', category: 'sports' },
  { id: 'f1', name: 'Formula 1', icon: '🏎️', category: 'sports' },
  { id: 'golf', name: 'Golf / PGA', icon: '⛳', category: 'sports' },
  { id: 'tennis', name: 'Tennis', icon: '🎾', category: 'sports' },
  { id: 'mma', name: 'MMA / UFC', icon: '🥊', category: 'sports' },
  { id: 'skiing', name: 'Skiing', icon: '⛷️', category: 'sports' },
  { id: 'surfing', name: 'Surfing', icon: '🏄', category: 'sports' },
  // Entertainment
  { id: 'reading', name: 'Reading', icon: '📚', category: 'entertainment' },
  { id: 'movies', name: 'Movies', icon: '🎬', category: 'entertainment' },
  { id: 'music', name: 'Music', icon: '🎵', category: 'entertainment' },
  { id: 'gaming', name: 'Gaming', icon: '🎮', category: 'entertainment' },
  { id: 'theater', name: 'Theater', icon: '🎭', category: 'entertainment' },
  // Lifestyle
  { id: 'photography', name: 'Photography', icon: '📸', category: 'lifestyle' },
  { id: 'cooking', name: 'Cooking', icon: '👨‍🍳', category: 'lifestyle' },
  { id: 'fitness', name: 'Fitness', icon: '💪', category: 'lifestyle' },
  { id: 'yoga', name: 'Yoga', icon: '🧘', category: 'lifestyle' },
  { id: 'hiking', name: 'Hiking', icon: '🥾', category: 'lifestyle' },
  { id: 'art', name: 'Art', icon: '🎨', category: 'lifestyle' },
  { id: 'wine', name: 'Wine & Dining', icon: '🍷', category: 'lifestyle' },
  { id: 'travel', name: 'Travel', icon: '✈️', category: 'lifestyle' },
];

// ============ 16 PERSONALITIES (MBTI) ============
const personalityTypes: { id: PersonalityType; name: string; nickname: string; description: string }[] = [
  { id: 'INTJ', name: 'INTJ', nickname: 'Architect', description: 'Strategic, independent thinker' },
  { id: 'INTP', name: 'INTP', nickname: 'Logician', description: 'Innovative, curious mind' },
  { id: 'ENTJ', name: 'ENTJ', nickname: 'Commander', description: 'Bold, decisive leader' },
  { id: 'ENTP', name: 'ENTP', nickname: 'Debater', description: 'Smart, curious explorer' },
  { id: 'INFJ', name: 'INFJ', nickname: 'Advocate', description: 'Quiet, mystical idealist' },
  { id: 'INFP', name: 'INFP', nickname: 'Mediator', description: 'Poetic, kind healer' },
  { id: 'ENFJ', name: 'ENFJ', nickname: 'Protagonist', description: 'Charismatic, inspiring leader' },
  { id: 'ENFP', name: 'ENFP', nickname: 'Campaigner', description: 'Enthusiastic, creative spirit' },
  { id: 'ISTJ', name: 'ISTJ', nickname: 'Logistician', description: 'Practical, fact-minded' },
  { id: 'ISFJ', name: 'ISFJ', nickname: 'Defender', description: 'Dedicated, warm protector' },
  { id: 'ESTJ', name: 'ESTJ', nickname: 'Executive', description: 'Excellent administrator' },
  { id: 'ESFJ', name: 'ESFJ', nickname: 'Consul', description: 'Caring, social, popular' },
  { id: 'ISTP', name: 'ISTP', nickname: 'Virtuoso', description: 'Bold, practical experimenter' },
  { id: 'ISFP', name: 'ISFP', nickname: 'Adventurer', description: 'Flexible, charming artist' },
  { id: 'ESTP', name: 'ESTP', nickname: 'Entrepreneur', description: 'Smart, energetic perceiver' },
  { id: 'ESFP', name: 'ESFP', nickname: 'Entertainer', description: 'Spontaneous, energetic performer' },
];

// ============ MOCK DATA ============
const narratives: Narrative[] = [
  {
    id: 'underdog',
    name: 'Underdog Rising',
    tagline: 'Prove them wrong',
    description: 'A journey of grit, determination, and ultimate triumph against the odds.',
    icon: '💪',
    color: 'terra',
    gradient: 'from-terra-500 to-orange-500',
  },
  {
    id: 'discovery',
    name: 'Self Discovery',
    tagline: 'Find yourself',
    description: 'Strip away the noise and reconnect with who you truly are.',
    icon: '🧭',
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'adventure',
    name: 'Epic Adventure',
    tagline: 'Chase the thrill',
    description: 'Push your limits with heart-racing experiences and unforgettable moments.',
    icon: '🏔️',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'bonding',
    name: 'Squad Goals',
    tagline: 'Stronger together',
    description: 'Adventures that forge unbreakable bonds with your crew.',
    icon: '🤝',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
  },
];

// Convert TripListing to Trip format for existing screens
const convertTripListingToTrip = (listing: TripListing): Trip => {
  // Generate story beats based on the trip duration
  const midDay = Math.floor(listing.durationDays / 2);
  const defaultStoryBeats: StoryBeat[] = [
    {
      day: 1,
      title: 'The Journey Begins',
      description: `Embarking on your ${listing.category} adventure in ${listing.location}`,
      location: listing.location.split(',')[0],
      mood: 'rising',
      activities: ['Arrival and check-in', 'Orientation tour', 'Welcome dinner'],
      localSpots: ['Local café', 'Neighborhood walk']
    },
    {
      day: midDay,
      title: 'Finding Your Rhythm',
      description: listing.highlights[0] || `Immersing yourself in the local experience`,
      location: listing.location.split(',')[0],
      mood: 'peak',
      activities: listing.highlights.slice(0, 3),
      localSpots: ['Hidden gems', 'Local favorites']
    },
    {
      day: listing.durationDays,
      title: 'A New Chapter',
      description: `Returning home transformed by your ${listing.category} experience`,
      location: listing.location.split(',')[0],
      mood: 'falling',
      activities: ['Final experiences', 'Farewells', 'Departure'],
      localSpots: ['Last-minute visits']
    }
  ];

  // Map category to nearby attraction types
  const getCategoryType = (cat: string): 'restaurant' | 'landmark' | 'activity' | 'shopping' | 'nature' | 'nightlife' => {
    const typeMap: Record<string, 'restaurant' | 'landmark' | 'activity' | 'shopping' | 'nature' | 'nightlife'> = {
      'adventure': 'activity',
      'sports': 'activity',
      'wellness': 'activity',
      'cultural': 'landmark',
      'beach': 'nature',
      'nature': 'nature',
      'luxury': 'restaurant',
      'budget': 'activity',
      'family': 'activity',
      'romantic': 'restaurant'
    };
    return typeMap[cat] || 'activity';
  };

  return {
    id: listing.id,
    title: listing.title,
    host: listing.host,
    location: listing.location,
    image: listing.image,
    price: listing.price,
    dates: listing.dates,
    duration: listing.duration,
    rating: listing.rating,
    tags: listing.tags,
    narrative: listing.description,
    storyBeats: defaultStoryBeats,
    nearbyAttractions: listing.highlights.slice(0, 4).map((h) => ({
      name: h,
      type: getCategoryType(listing.category),
      distance: '5-15 min',
      rating: 4.5,
      description: `Experience ${h} during your ${listing.category} trip`,
      image: listing.image
    })),
    localTips: [
      {
        category: 'Insider Tips',
        icon: '💡',
        items: [
          `Best time to visit: ${listing.dates.split('-')[0]}`,
          `Perfect for: ${listing.bestFor.join(', ')}`,
          `What's included: ${listing.included.slice(0, 2).join(', ')}`
        ]
      }
    ],
    source: 'platform'
  };
};

const trips: Trip[] = [
  {
    id: '1',
    title: 'Niseko Powder Camp',
    host: 'Pure Ski Japan',
    location: 'Niseko, Hokkaido, Japan',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800',
    price: '$2,450',
    dates: 'Jan 15-22, 2025',
    duration: '7 days',
    rating: 4.9,
    tags: ['Powder', 'All Levels', 'Guided'],
    narrative: 'adventure',
    sportCategory: 'skiing',
    storyBeats: [
      { day: 1, title: 'Arrival & Anticipation', description: 'Touch down in Sapporo, transfer to Niseko. First glimpse of the mountains.', location: 'Niseko Village', mood: 'rising', activities: ['Airport pickup', 'Welcome dinner', 'Gear fitting'], localSpots: ['Niseko Ramen', 'Milk Kobo soft serve'] },
      { day: 2, title: 'First Tracks', description: 'Wake up to fresh powder. Your ski legs come alive.', location: 'Grand Hirafu', mood: 'rising', activities: ['Morning warm-up runs', 'Technique clinic', 'Hot spring soak'], localSpots: ['Yukoro Onsen', 'Hirafu Zaka street'] },
      { day: 3, title: 'The Challenge', description: 'Push into steeper terrain. Face the mountain.', location: 'Hanazono', mood: 'rising', activities: ['Advanced runs', 'Tree skiing', 'Ramen lunch'], localSpots: ['Ichimura Ramen', 'Hanazono 308 bar'] },
      { day: 4, title: 'The Summit', description: 'Backcountry expedition. The moment you came for.', location: 'Mount Yotei', mood: 'peak', activities: ['Heli-drop', 'Backcountry adventure', 'Celebration dinner'], localSpots: ['Kamimura restaurant', 'Mount Yotei viewpoint'] },
      { day: 5, title: 'Earned Confidence', description: 'Return to the resort with new skills. Everything flows.', location: 'Niseko United', mood: 'falling', activities: ['Full mountain access', 'Photo session', 'Sake tasting'], localSpots: ['Niseko Brewery', 'Lucky Village'] },
      { day: 6, title: 'The Bond', description: 'Squad day. Shared runs, shared laughs.', location: 'All resorts', mood: 'falling', activities: ['Group adventure', 'Final après', 'Film premiere'], localSpots: ['Tamashii Bar', 'Wild Bill\'s'] },
      { day: 7, title: 'Transformed', description: 'Departure. You leave different than you arrived.', location: 'Sapporo', mood: 'falling', activities: ['Morning reflection', 'Airport transfer', 'Digital memories delivered'], localSpots: ['Sapporo Fish Market', 'Tanukikoji shopping'] },
    ],
    nearbyAttractions: [
      { name: 'Yukoro Onsen', type: 'activity', distance: '5 min walk', rating: 4.8, description: 'Traditional Japanese hot spring with outdoor bath and mountain views', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', mustTry: 'Outdoor rotenburo bath' },
      { name: 'Milk Kobo', type: 'restaurant', distance: '10 min drive', rating: 4.9, description: 'Famous local dairy with incredible soft serve and cream puffs', image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400', mustTry: 'Double fromage soft serve' },
      { name: 'Mount Yotei Viewpoint', type: 'nature', distance: '15 min drive', rating: 4.7, description: 'Stunning views of the "Ezo Fuji" - Hokkaido\'s Mount Fuji', image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400' },
      { name: 'Niseko Distillery', type: 'activity', distance: '20 min drive', rating: 4.6, description: 'Craft gin distillery using local botanicals, tours and tastings available', image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400', mustTry: 'Ohoro Gin tasting flight' },
      { name: 'Hirafu Night Market', type: 'shopping', distance: '2 min walk', rating: 4.5, description: 'Evening food stalls, local crafts, and après-ski shopping', image: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=400' },
      { name: 'Kutchan Town', type: 'landmark', distance: '15 min drive', rating: 4.3, description: 'Authentic local town with incredible ramen and Japanese culture', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400', mustTry: 'Ichimura Soba noodles' },
    ],
    localTips: [
      { category: 'Must-Eat', icon: '🍜', items: ['Niseko Ramen for miso ramen', 'Kamimura for kaiseki dinner', 'Milk Kobo cream puffs', 'JoJo\'s for late-night pizza'] },
      { category: 'Best Onsens', icon: '♨️', items: ['Yukoro Onsen (classic)', 'Kanro no Mori (luxury)', 'Goshiki Onsen (remote gem)', 'Hilton outdoor bath'] },
      { category: 'Après-Ski Bars', icon: '🍺', items: ['Tamashii Bar', 'Wild Bill\'s', 'Bar Gyu+', 'Fridge Door Bar'] },
      { category: 'Local Tips', icon: '💡', items: ['Ski Grand Hirafu for crowds, Hanazono for powder', 'Night skiing ends at 8:30pm', 'Book restaurants in advance', 'Convenience stores have amazing food'] },
    ],
    signedUpTravelers: [
      { id: 't1', name: 'Alex Chen', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', nationality: 'us', interests: ['skiing', 'photography', 'hiking'], personality: 'ENFP', relationshipStatus: 'single', age: 28, bio: 'Adventure photographer chasing powder days' },
      { id: 't2', name: 'Yuki Tanaka', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', nationality: 'jp', interests: ['skiing', 'yoga', 'cooking'], personality: 'INFJ', relationshipStatus: 'single', age: 31, bio: 'Local ski instructor, knows all the secret spots' },
      { id: 't3', name: 'Marcus Weber', avatar: 'https://randomuser.me/api/portraits/men/67.jpg', nationality: 'de', interests: ['skiing', 'fitness', 'wine'], personality: 'ENTJ', relationshipStatus: 'married', age: 35, bio: 'Weekend warrior escaping the office' },
      { id: 't4', name: 'Sophie Laurent', avatar: 'https://randomuser.me/api/portraits/women/28.jpg', nationality: 'fr', interests: ['skiing', 'art', 'music'], relationshipStatus: 'looking', age: 26, bio: 'First time in Japan, excited to explore!' },
    ],
    spotsLeft: 4,
    totalSpots: 12,
    source: 'platform',
    isOpenForSignup: true,
  },
  {
    id: '2',
    title: 'Lakers vs. Warriors Experience',
    host: 'LA Courtside',
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1504450758481-7338bbe7524a?w=800',
    price: '$890',
    dates: 'Feb 8-10, 2025',
    duration: '3 days',
    rating: 4.8,
    tags: ['NBA', 'Courtside', 'VIP'],
    narrative: 'underdog',
    sportCategory: 'nba',
    storyBeats: [
      { day: 1, title: 'Game Day Build', description: 'Arrive in LA, feel the energy building.', location: 'Downtown LA', mood: 'rising', activities: ['Check-in', 'Pre-game meetup', 'Jersey pickup'], localSpots: ['Grand Central Market', 'The Broad museum'] },
      { day: 2, title: 'The Main Event', description: 'Courtside seats. Feel every play.', location: 'Crypto.com Arena', mood: 'peak', activities: ['VIP tunnel access', 'Game time', 'Post-game locker visit'], localSpots: ['LA Live district', '71Above restaurant'] },
      { day: 3, title: 'Victory Lap', description: 'Process the experience, share the stories.', location: 'Santa Monica', mood: 'falling', activities: ['Brunch recap', 'Beach hang', 'Film delivery'], localSpots: ['Santa Monica Pier', 'Venice Beach boardwalk'] },
    ],
    nearbyAttractions: [
      { name: 'Grand Central Market', type: 'restaurant', distance: '10 min walk', rating: 4.7, description: 'Historic food hall with 30+ vendors - tacos, ramen, coffee, and more', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', mustTry: 'Eggslut breakfast sandwich' },
      { name: 'The Broad', type: 'landmark', distance: '15 min walk', rating: 4.8, description: 'Contemporary art museum with Infinity Mirrors and free admission', image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=400' },
      { name: 'Santa Monica Pier', type: 'activity', distance: '30 min drive', rating: 4.5, description: 'Iconic pier with Ferris wheel, arcade, and beach access', image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=400' },
      { name: 'Venice Beach Boardwalk', type: 'activity', distance: '35 min drive', rating: 4.4, description: 'Street performers, Muscle Beach, skate park, and people watching', image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=400' },
      { name: 'In-N-Out Burger', type: 'restaurant', distance: '5 min drive', rating: 4.6, description: 'California\'s legendary burger chain - a must for first-timers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', mustTry: 'Double-Double Animal Style' },
      { name: 'Griffith Observatory', type: 'nature', distance: '20 min drive', rating: 4.9, description: 'Iconic LA landmark with stunning views and Hollywood Sign', image: 'https://images.unsplash.com/photo-1518485916549-df6c20eb4871?w=400' },
    ],
    localTips: [
      { category: 'Pre-Game Eats', icon: '🍔', items: ['Grand Central Market', 'Bottega Louie', 'Perch rooftop', 'Original Pantry Café'] },
      { category: 'Post-Game Party', icon: '🎉', items: ['Exchange LA (club)', 'Seven Grand (whiskey bar)', 'The Edison (speakeasy)', 'LA Live entertainment'] },
      { category: 'Lakers History', icon: '🏀', items: ['Visit Staples Center statues', 'Lakers Team Store', 'Magic Johnson\'s theater', 'Kobe mural in DTLA'] },
      { category: 'Getting Around', icon: '🚗', items: ['Uber/Lyft everywhere', 'Game day traffic is brutal', 'Metro to Santa Monica works great', 'Parking at LA Live is $30+'] },
    ],
    signedUpTravelers: [
      { id: 't5', name: 'Jordan Williams', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', nationality: 'us', interests: ['nba', 'gaming', 'music'], personality: 'ESTP', relationshipStatus: 'single', age: 24, bio: 'Die-hard Lakers fan since birth, courtside dreamer' },
      { id: 't6', name: 'Mia Thompson', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', nationality: 'ca', interests: ['nba', 'photography', 'travel'], personality: 'ENFJ', relationshipStatus: 'looking', age: 29, bio: 'Sports journalist covering the NBA Western Conference' },
      { id: 't7', name: 'Kevin Park', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', nationality: 'kr', interests: ['nba', 'fitness', 'movies'], personality: 'ISTP', relationshipStatus: 'married', age: 33, bio: 'Former college player, now basketball dad' },
      { id: 't8', name: 'Emma Davis', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', nationality: 'au', interests: ['nba', 'wine', 'art'], relationshipStatus: 'couple', age: 27, bio: 'First NBA game! Here with my partner' },
      { id: 't9', name: 'Tyler Brown', avatar: 'https://randomuser.me/api/portraits/men/55.jpg', nationality: 'us', interests: ['nba', 'nfl', 'cooking'], personality: 'ESFP', relationshipStatus: 'single', age: 31, bio: 'Sports bar owner from Chicago, Lakers hater turned curious' },
    ],
    spotsLeft: 3,
    totalSpots: 10,
    source: 'platform',
    isOpenForSignup: true,
  },
  {
    id: '3',
    title: 'Bali Soul Retreat',
    host: 'Wanderlust Wellness',
    location: 'Ubud, Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    price: '$1,890',
    dates: 'Mar 5-12, 2025',
    duration: '7 days',
    rating: 4.95,
    tags: ['Wellness', 'Culture', 'Transformation'],
    narrative: 'discovery',
    sportCategory: 'surfing',
    storyBeats: [
      { day: 1, title: 'Arrival & Surrender', description: 'Land in paradise. Let go of everything else.', location: 'Ubud', mood: 'rising', activities: ['Temple blessing', 'Welcome ceremony', 'First meditation'], localSpots: ['Tirta Empul temple', 'Ubud Palace'] },
      { day: 2, title: 'Opening Up', description: 'Morning yoga, afternoon exploration.', location: 'Tegallalang', mood: 'rising', activities: ['Sunrise yoga', 'Rice terrace walk', 'Journaling'], localSpots: ['Tegallalang Rice Terraces', 'Jungle Fish pool club'] },
      { day: 3, title: 'Going Deeper', description: 'Intensive practice day. Face what comes up.', location: 'Sacred springs', mood: 'rising', activities: ['Water purification', 'Sound healing', 'Sharing circle'], localSpots: ['Tirta Empul', 'Gunung Kawi temple'] },
      { day: 4, title: 'The Breakthrough', description: 'Something shifts. You see clearly now.', location: 'Mount Batur', mood: 'peak', activities: ['Sunrise trek', 'Meditation at summit', 'Celebration'], localSpots: ['Mount Batur crater', 'Hot springs post-hike'] },
      { day: 5, title: 'Integration', description: 'Let the insights settle. Creative expression.', location: 'Ubud center', mood: 'falling', activities: ['Art workshop', 'Spa treatment', 'Free time'], localSpots: ['Ubud Art Market', 'Karsa Spa'] },
      { day: 6, title: 'Community', description: 'Connect with your fellow travelers.', location: 'Beach club', mood: 'falling', activities: ['Beach day', 'Sunset ceremony', 'Farewell dinner'], localSpots: ['Finns Beach Club', 'Single Fin sunset'] },
      { day: 7, title: 'New Beginning', description: 'You leave transformed, ready for what\'s next.', location: 'Departure', mood: 'falling', activities: ['Morning practice', 'Closing circle', 'Film premiere'], localSpots: ['Monkey Forest', 'Last smoothie bowl'] },
    ],
    nearbyAttractions: [
      { name: 'Tegallalang Rice Terraces', type: 'nature', distance: '20 min drive', rating: 4.8, description: 'UNESCO-recognized stunning green rice paddies with famous swing', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', mustTry: 'The Bali Swing photo op' },
      { name: 'Sacred Monkey Forest', type: 'nature', distance: '5 min walk', rating: 4.6, description: 'Ancient temple complex with 700+ monkeys - bring no food!', image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400' },
      { name: 'Tirta Empul Temple', type: 'landmark', distance: '30 min drive', rating: 4.9, description: 'Holy spring water temple for traditional purification ceremony', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400', mustTry: 'Water blessing ritual' },
      { name: 'Karsa Spa', type: 'activity', distance: '10 min walk', rating: 4.7, description: 'Traditional Balinese spa overlooking rice terraces', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400', mustTry: '2-hour Balinese massage' },
      { name: 'Clear Café', type: 'restaurant', distance: '5 min walk', rating: 4.5, description: 'Healthy raw vegan café with stunning jungle views', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400', mustTry: 'Dragon bowl & jungle views' },
      { name: 'Mount Batur Sunrise Trek', type: 'activity', distance: '1 hour drive', rating: 4.8, description: 'Pre-dawn volcano hike rewarded with epic sunrise views', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400' },
    ],
    localTips: [
      { category: 'Best Cafés', icon: '☕', items: ['Clear Café (raw vegan)', 'Milk & Madu (brunch)', 'Seniman Coffee', 'Lazy Cats Café'] },
      { category: 'Yoga Studios', icon: '🧘', items: ['Yoga Barn (iconic)', 'Radiantly Alive', 'Intuitive Flow', 'The Practice'] },
      { category: 'Must-Do', icon: '✨', items: ['Rice terrace walk at sunrise', 'Balinese cooking class', 'Temple ceremony experience', 'Sound healing at Pyramids of Chi'] },
      { category: 'Local Tips', icon: '💡', items: ['Rent a scooter or hire a driver', 'Temples require sarong', 'Avoid monkey eye contact', 'Cash is still king'] },
    ],
    source: 'user-created',
    isOpenForSignup: true,
    creatorName: 'Sarah M.',
  },
  {
    id: '4',
    title: 'Augusta Masters Experience',
    host: 'Golf Legends Tours',
    location: 'Augusta, Georgia',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',
    price: '$3,200',
    dates: 'Apr 10-14, 2025',
    duration: '5 days',
    rating: 4.95,
    tags: ['Golf', 'Masters', 'Exclusive'],
    narrative: 'underdog',
    sportCategory: 'golf',
    storyBeats: [
      { day: 1, title: 'Arrival in Golf Heaven', description: 'Land in Augusta, feel the history in the air.', location: 'Augusta', mood: 'rising', activities: ['Check-in at hotel', 'Welcome reception', 'Practice round viewing'], localSpots: ['Frog Hollow Tavern', 'Broad Street downtown'] },
      { day: 2, title: 'Practice Round Magic', description: 'Experience the course like a player would.', location: 'Augusta National', mood: 'rising', activities: ['Practice round', 'Par 3 contest', 'Patron shopping'], localSpots: ['Pimento cheese sandwich', 'The Masters shop'] },
      { day: 3, title: 'Tournament Day 1', description: 'First competitive round. Amen Corner awaits.', location: 'Augusta National', mood: 'rising', activities: ['Premium seating', 'Walking the course', 'Azalea shrine'], localSpots: ['Amen Corner', 'Magnolia Lane'] },
      { day: 4, title: 'Moving Day Drama', description: 'The leaders separate. Sunday beckons.', location: 'Augusta National', mood: 'peak', activities: ['Prime viewing spots', 'Player interactions', 'Celebration dinner'], localSpots: ['Champions dinner', 'Augusta Grill'] },
      { day: 5, title: 'Champion Crowned', description: 'Final round glory. Green jacket ceremony.', location: 'Augusta National', mood: 'falling', activities: ['Final round', 'Trophy ceremony', 'Film delivery'], localSpots: ['Butler Cabin viewing', 'Departure memories'] },
    ],
    nearbyAttractions: [
      { name: 'Augusta National Golf Club', type: 'landmark', distance: 'On-site', rating: 5.0, description: 'The most exclusive and pristine golf course in the world', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400', mustTry: 'Pimento cheese sandwich ($1.50)' },
      { name: 'Frog Hollow Tavern', type: 'restaurant', distance: '15 min drive', rating: 4.6, description: 'Upscale Southern cuisine in a historic building', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', mustTry: 'Shrimp and grits' },
      { name: 'Savannah Rapids Park', type: 'nature', distance: '20 min drive', rating: 4.5, description: 'Beautiful park along the Savannah River with kayaking', image: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=400' },
      { name: 'Broad Street', type: 'shopping', distance: '10 min drive', rating: 4.4, description: 'Downtown Augusta\'s main strip with shops, bars, restaurants', image: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=400' },
      { name: 'Augusta Museum of History', type: 'landmark', distance: '12 min drive', rating: 4.3, description: 'Regional history including James Brown exhibit', image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=400' },
    ],
    localTips: [
      { category: 'Masters Must-Do', icon: '⛳', items: ['$1.50 pimento cheese sandwich', 'Azalea & Magnolia holes', 'Par 3 contest Wednesday', 'Arrive early for Amen Corner'] },
      { category: 'Best Restaurants', icon: '🍴', items: ['Frog Hollow Tavern', 'French Market Grille', 'Finch & Fifth', 'Farmhaus Burger'] },
      { category: 'Golf History', icon: '🏆', items: ['Augusta National perimeter walk', 'James Brown statue', 'Augusta Canal boat tour', 'Golf Hall of Fame nearby'] },
      { category: 'Insider Tips', icon: '💡', items: ['No phones on course', 'Bring cash for concessions', 'Comfortable walking shoes essential', 'Book hotels a year in advance'] },
    ],
  },
  {
    id: '5',
    title: 'World Cup Final Experience',
    host: 'Global Soccer Tours',
    location: 'To Be Announced',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    price: '$4,500',
    dates: 'Jul 2026',
    duration: '5 days',
    rating: 4.9,
    tags: ['FIFA', 'World Cup', 'Premium'],
    narrative: 'bonding',
    sportCategory: 'fifa',
    storyBeats: [
      { day: 1, title: 'The Global Gathering', description: 'Fans from every nation converge.', location: 'Host City', mood: 'rising', activities: ['Arrival & check-in', 'Fan zone experience', 'Welcome dinner'] },
      { day: 2, title: 'Semi-Final Fever', description: 'Witness history being made.', location: 'Stadium', mood: 'rising', activities: ['Semi-final match', 'City exploration', 'Local cuisine'] },
      { day: 3, title: 'Cultural Immersion', description: 'Experience the host country.', location: 'Local area', mood: 'rising', activities: ['City tour', 'Fan activities', 'Squad bonding'] },
      { day: 4, title: 'The Final', description: 'The biggest match on Earth.', location: 'Final Stadium', mood: 'peak', activities: ['Pre-match atmosphere', 'World Cup Final', 'Celebration'] },
      { day: 5, title: 'Champions Celebration', description: 'Process the magic.', location: 'City center', mood: 'falling', activities: ['Victory parade', 'Final brunch', 'Film delivery'] },
    ],
    nearbyAttractions: [
      { name: 'FIFA Fan Festival', type: 'activity', distance: 'Various', rating: 4.7, description: 'Official FIFA fan zones with big screens, music, and food', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400' },
      { name: 'Local Stadium Tour', type: 'landmark', distance: 'On-site', rating: 4.8, description: 'Behind-the-scenes tour of the World Cup venue', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400' },
      { name: 'Soccer Museum', type: 'landmark', distance: 'Varies', rating: 4.5, description: 'World Cup history and memorabilia', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400' },
    ],
    localTips: [
      { category: 'Match Day', icon: '⚽', items: ['Arrive 3 hours early', 'Learn local chants', 'Wear your colors proudly', 'Stay for trophy ceremony'] },
      { category: 'Fan Culture', icon: '🎉', items: ['Trade scarves with fans', 'Join the conga lines', 'Document everything', 'Make international friends'] },
      { category: 'Tips', icon: '💡', items: ['Book early - prices triple near event', 'Learn basic local phrases', 'Data SIM for posting', 'Backup phone charger essential'] },
    ],
  },
  // MLB Trips
  {
    id: '6',
    title: 'Yankees vs Red Sox at Fenway',
    host: 'Baseball Legends Tours',
    location: 'Boston, MA',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
    price: '$1,200',
    dates: 'May 15-18, 2025',
    duration: '4 days',
    rating: 4.9,
    tags: ['MLB', 'Rivalry', 'Historic'],
    narrative: 'underdog',
    sportCategory: 'mlb',
    storyBeats: [
      { day: 1, title: 'Arrival in Boston', description: 'Touch down in historic Boston.', location: 'Boston', mood: 'rising', activities: ['Freedom Trail walk', 'Welcome dinner', 'Fan meetup'], localSpots: ['Faneuil Hall', 'North End Italian'] },
      { day: 2, title: 'Game Day Prep', description: 'Fenway tour and pre-game rituals.', location: 'Fenway Park', mood: 'rising', activities: ['Fenway tour', 'Green Monster seats', 'Batting cages'], localSpots: ['Bleacher Bar', 'Yawkey Way'] },
      { day: 3, title: 'The Rivalry Game', description: 'Yankees vs Red Sox. Baseball at its best.', location: 'Fenway Park', mood: 'peak', activities: ['Premium seating', 'Hot dogs & beer', 'Sweet Caroline singalong'], localSpots: ['Fenway Park', 'Lansdowne Street'] },
      { day: 4, title: 'Victory Lap', description: 'Boston exploration and departure.', location: 'Boston', mood: 'falling', activities: ['Brunch', 'Souvenir shopping', 'Film delivery'], localSpots: ['Boston Harbor', 'Newbury Street'] },
    ],
    nearbyAttractions: [
      { name: 'Fenway Park', type: 'landmark', distance: 'On-site', rating: 4.9, description: 'America\'s Most Beloved Ballpark since 1912', image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400', mustTry: 'Fenway Frank' },
      { name: 'Freedom Trail', type: 'landmark', distance: '15 min drive', rating: 4.8, description: '2.5-mile walk through American history', image: 'https://images.unsplash.com/photo-1569839333583-7375336cde4b?w=400' },
    ],
    localTips: [
      { category: 'Fenway Must-Do', icon: '⚾', items: ['Fenway Frank', 'Green Monster seats', 'Sweet Caroline 8th inning', 'Bleacher Bar under the stands'] },
      { category: 'Boston Eats', icon: '🦞', items: ['Legal Sea Foods', 'Neptune Oyster', 'Mike\'s Pastry cannoli', 'Union Oyster House'] },
    ],
  },
  {
    id: '7',
    title: 'Dodgers Stadium Experience',
    host: 'LA Baseball Tours',
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1562077772-3bd90f5746f5?w=800',
    price: '$890',
    dates: 'Jun 20-22, 2025',
    duration: '3 days',
    rating: 4.8,
    tags: ['MLB', 'Dodgers', 'LA Vibes'],
    narrative: 'adventure',
    sportCategory: 'mlb',
    storyBeats: [
      { day: 1, title: 'Welcome to LA', description: 'Hollywood meets baseball.', location: 'Los Angeles', mood: 'rising', activities: ['Check-in', 'Hollywood tour', 'Sunset dinner'], localSpots: ['Hollywood Sign', 'Griffith Observatory'] },
      { day: 2, title: 'Dodger Blue Day', description: 'Experience the magic of Dodger Stadium.', location: 'Dodger Stadium', mood: 'peak', activities: ['Stadium tour', 'Batting practice viewing', 'Game time!'], localSpots: ['Dodger Stadium', 'Elysian Park'] },
      { day: 3, title: 'Beach Day Departure', description: 'Santa Monica send-off.', location: 'Santa Monica', mood: 'falling', activities: ['Beach morning', 'Pier walk', 'Film delivery'], localSpots: ['Santa Monica Pier', 'Venice Beach'] },
    ],
    nearbyAttractions: [
      { name: 'Dodger Stadium', type: 'landmark', distance: 'On-site', rating: 4.8, description: 'Third-oldest MLB stadium with stunning views', image: 'https://images.unsplash.com/photo-1562077772-3bd90f5746f5?w=400', mustTry: 'Dodger Dog' },
    ],
    localTips: [
      { category: 'Dodger Stadium', icon: '⚾', items: ['Arrive early for views', 'Dodger Dog is a must', 'Vin Scully Ave entrance', 'Top Deck sunset views'] },
    ],
  },
  // F1 Trips
  {
    id: '8',
    title: 'Monaco Grand Prix VIP',
    host: 'F1 Elite Experiences',
    location: 'Monte Carlo, Monaco',
    image: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800',
    price: '$8,500',
    dates: 'May 22-26, 2025',
    duration: '5 days',
    rating: 5.0,
    tags: ['F1', 'Monaco', 'Luxury'],
    narrative: 'adventure',
    sportCategory: 'f1',
    storyBeats: [
      { day: 1, title: 'Arrival in Monaco', description: 'Touch down in the playground of the rich.', location: 'Monte Carlo', mood: 'rising', activities: ['Helicopter transfer', 'Yacht check-in', 'Casino night'], localSpots: ['Casino de Monte-Carlo', 'Hotel de Paris'] },
      { day: 2, title: 'Practice Day', description: 'Feel the engines roar through the streets.', location: 'Circuit de Monaco', mood: 'rising', activities: ['Practice sessions', 'Paddock access', 'Driver meet'], localSpots: ['La Rascasse corner', 'Swimming pool section'] },
      { day: 3, title: 'Qualifying Fury', description: 'One lap. Everything on the line.', location: 'Circuit de Monaco', mood: 'rising', activities: ['Qualifying', 'Yacht party', 'Gala dinner'], localSpots: ['Yacht harbor', 'Amber Lounge'] },
      { day: 4, title: 'Race Day Glory', description: 'The crown jewel of motorsport.', location: 'Circuit de Monaco', mood: 'peak', activities: ['Race day VIP', 'Champagne celebrations', 'Victory party'], localSpots: ['Start/Finish line', 'Podium viewing'] },
      { day: 5, title: 'Monaco Farewell', description: 'One last Mediterranean morning.', location: 'Monaco', mood: 'falling', activities: ['Brunch on yacht', 'Casino one more time', 'Film delivery'], localSpots: ['Port Hercules', 'Princess Grace Rose Garden'] },
    ],
    nearbyAttractions: [
      { name: 'Casino de Monte-Carlo', type: 'landmark', distance: '5 min walk', rating: 4.9, description: 'World-famous casino featured in James Bond films', image: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=400' },
      { name: 'Prince\'s Palace', type: 'landmark', distance: '10 min walk', rating: 4.7, description: 'Official residence of the Prince of Monaco', image: 'https://images.unsplash.com/photo-1533929736562-6a6f0a6e4c13?w=400' },
    ],
    localTips: [
      { category: 'F1 Tips', icon: '🏎️', items: ['Earplugs essential', 'Book restaurants months ahead', 'Yacht parties start early', 'Dress code everywhere'] },
      { category: 'Monaco Luxury', icon: '💎', items: ['Casino dress code after 8pm', 'Yacht charter worth it', 'Rooftop bars for views', 'Nice airport is closest'] },
    ],
  },
  {
    id: '9',
    title: 'Singapore Night Race',
    host: 'Asian F1 Tours',
    location: 'Singapore',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800',
    price: '$4,200',
    dates: 'Sep 19-22, 2025',
    duration: '4 days',
    rating: 4.9,
    tags: ['F1', 'Night Race', 'Asia'],
    narrative: 'adventure',
    sportCategory: 'f1',
    storyBeats: [
      { day: 1, title: 'Singapore Arrival', description: 'Welcome to the Lion City.', location: 'Marina Bay', mood: 'rising', activities: ['Hotel check-in', 'Gardens by the Bay', 'Hawker dinner'], localSpots: ['Marina Bay Sands', 'Gardens by the Bay'] },
      { day: 2, title: 'Practice Under Lights', description: 'The track comes alive at night.', location: 'Marina Bay Circuit', mood: 'rising', activities: ['Practice sessions', 'Track walk', 'Rooftop bar'], localSpots: ['Padang', 'Fullerton Hotel'] },
      { day: 3, title: 'Race Night', description: 'The most spectacular race on the calendar.', location: 'Marina Bay Circuit', mood: 'peak', activities: ['Race viewing', 'Concert', 'After-party'], localSpots: ['Turn 1 grandstand', 'Padang stage'] },
      { day: 4, title: 'Singapore Exploration', description: 'Explore this incredible city.', location: 'Singapore', mood: 'falling', activities: ['Brunch', 'Sentosa Island', 'Film delivery'], localSpots: ['Sentosa', 'Orchard Road'] },
    ],
    nearbyAttractions: [
      { name: 'Marina Bay Sands', type: 'landmark', distance: 'On-site', rating: 4.8, description: 'Iconic hotel with infinity pool overlooking the city', image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=400' },
    ],
    localTips: [
      { category: 'Race Tips', icon: '🏎️', items: ['Stay hydrated - it\'s HOT', 'Zone 4 has best concerts', 'Bring sunscreen for day setup', 'Public transport is excellent'] },
    ],
  },
  // Family Trips
  {
    id: '10',
    title: 'Disney World Ultimate Family',
    host: 'Magic Kingdom Tours',
    location: 'Orlando, FL',
    image: 'https://images.unsplash.com/photo-1597466599360-3b9775841aec?w=800',
    price: '$2,800',
    dates: 'Jun 10-16, 2025',
    duration: '7 days',
    rating: 4.9,
    tags: ['Family', 'Disney', 'Magic'],
    narrative: 'bonding',
    storyBeats: [
      { day: 1, title: 'Magic Begins', description: 'Check into the magic.', location: 'Disney Resort', mood: 'rising', activities: ['Resort check-in', 'Disney Springs dinner', 'Fireworks preview'], localSpots: ['Disney Springs', 'Resort pools'] },
      { day: 2, title: 'Magic Kingdom Day', description: 'Where dreams come true.', location: 'Magic Kingdom', mood: 'rising', activities: ['Castle photo', 'Classic rides', 'Fireworks spectacular'], localSpots: ['Cinderella Castle', 'Space Mountain'] },
      { day: 3, title: 'Hollywood Studios', description: 'Lights, camera, action!', location: 'Hollywood Studios', mood: 'rising', activities: ['Star Wars: Galaxy\'s Edge', 'Toy Story Land', 'Fantasmic show'], localSpots: ['Millennium Falcon', 'Tower of Terror'] },
      { day: 4, title: 'Animal Kingdom', description: 'Adventure is out there.', location: 'Animal Kingdom', mood: 'peak', activities: ['Safari', 'Avatar Flight of Passage', 'Kilimanjaro Safari'], localSpots: ['Pandora', 'Tree of Life'] },
      { day: 5, title: 'EPCOT World Tour', description: 'Travel the world in one day.', location: 'EPCOT', mood: 'falling', activities: ['World Showcase', 'Test Track', 'Fireworks'], localSpots: ['World Showcase', 'Spaceship Earth'] },
      { day: 6, title: 'Pool Day & Extra Magic', description: 'Relax and revisit favorites.', location: 'Disney Resort', mood: 'falling', activities: ['Pool time', 'Favorite park revisit', 'Character dinner'], localSpots: ['Resort amenities', 'Character dining'] },
      { day: 7, title: 'Magical Farewell', description: 'Until we meet again.', location: 'Orlando', mood: 'falling', activities: ['Last breakfast', 'Photo memories', 'Film delivery'], localSpots: ['Disney Springs', 'Airport'] },
    ],
    nearbyAttractions: [
      { name: 'Magic Kingdom', type: 'activity', distance: 'On-site', rating: 4.9, description: 'The most magical place on Earth', image: 'https://images.unsplash.com/photo-1597466599360-3b9775841aec?w=400', mustTry: 'Dole Whip' },
    ],
    localTips: [
      { category: 'Disney Tips', icon: '🏰', items: ['Genie+ worth it for peak season', 'Mobile order meals', 'Arrive at rope drop', 'Character breakfast reservations'] },
      { category: 'Family Hacks', icon: '👨‍👩‍👧‍👦', items: ['Stroller is essential', 'Midday pool break', 'Bring autograph books', 'Rain ponchos save money'] },
    ],
  },
  // Romantic Trips
  {
    id: '11',
    title: 'Paris Romance Escape',
    host: 'Love Paris Tours',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    price: '$3,400',
    dates: 'Feb 10-15, 2025',
    duration: '6 days',
    rating: 5.0,
    tags: ['Romantic', 'Paris', 'Luxury'],
    narrative: 'bonding',
    storyBeats: [
      { day: 1, title: 'Bienvenue Paris', description: 'Arrive in the city of love.', location: 'Paris', mood: 'rising', activities: ['Check-in boutique hotel', 'Seine river walk', 'Candlelit dinner'], localSpots: ['Pont des Arts', 'Le Marais'] },
      { day: 2, title: 'Eiffel & Art', description: 'Icons of romance.', location: 'Eiffel Tower', mood: 'rising', activities: ['Eiffel Tower sunrise', 'Louvre afternoon', 'Rooftop champagne'], localSpots: ['Eiffel Tower', 'Louvre Museum'] },
      { day: 3, title: 'Montmartre Dreams', description: 'The bohemian heart of Paris.', location: 'Montmartre', mood: 'rising', activities: ['Artist quarter walk', 'Portrait together', 'Moulin Rouge show'], localSpots: ['Sacré-Cœur', 'Place du Tertre'] },
      { day: 4, title: 'Versailles Day', description: 'Royal romance.', location: 'Versailles', mood: 'peak', activities: ['Palace tour', 'Garden picnic', 'Marie Antoinette\'s hamlet'], localSpots: ['Palace of Versailles', 'Gardens'] },
      { day: 5, title: 'Seine & Style', description: 'Shopping and cruising.', location: 'Paris', mood: 'falling', activities: ['Champs-Élysées shopping', 'Seine dinner cruise', 'City of lights stroll'], localSpots: ['Champs-Élysées', 'Seine River'] },
      { day: 6, title: 'Au Revoir', description: 'Until Paris calls again.', location: 'Paris', mood: 'falling', activities: ['Café croissant', 'Final photos', 'Film delivery'], localSpots: ['Café de Flore', 'Luxembourg Gardens'] },
    ],
    nearbyAttractions: [
      { name: 'Eiffel Tower', type: 'landmark', distance: '10 min taxi', rating: 4.9, description: 'The symbol of Paris and romance', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', mustTry: 'Champagne at the top' },
      { name: 'Louvre Museum', type: 'landmark', distance: '15 min walk', rating: 4.8, description: 'World\'s largest art museum with the Mona Lisa', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400' },
    ],
    localTips: [
      { category: 'Romance', icon: '❤️', items: ['Love lock alternative - ribbon on bridge', 'Sunrise Eiffel is magical', 'Book restaurant terraces', 'Seine sunset picnic'] },
      { category: 'Paris Tips', icon: '🥐', items: ['Learn basic French', 'Book Louvre tickets online', 'Metro is easy', 'Tip is included in bills'] },
    ],
  },
  {
    id: '12',
    title: 'Maldives Overwater Paradise',
    host: 'Island Romance',
    location: 'Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    price: '$6,500',
    dates: 'Mar 1-7, 2025',
    duration: '7 days',
    rating: 5.0,
    tags: ['Romantic', 'Beach', 'Luxury'],
    narrative: 'bonding',
    storyBeats: [
      { day: 1, title: 'Seaplane Arrival', description: 'Touch down in paradise.', location: 'Resort Island', mood: 'rising', activities: ['Seaplane transfer', 'Villa check-in', 'Sunset cocktails'], localSpots: ['Overwater villa', 'Main bar'] },
      { day: 2, title: 'Ocean Exploration', description: 'Discover underwater wonders.', location: 'Reef', mood: 'rising', activities: ['Snorkeling', 'Dolphin cruise', 'Private dinner'], localSpots: ['House reef', 'Sandbank'] },
      { day: 3, title: 'Spa & Relaxation', description: 'Total serenity.', location: 'Spa', mood: 'rising', activities: ['Couples massage', 'Yoga session', 'Floating breakfast'], localSpots: ['Overwater spa', 'Infinity pool'] },
      { day: 4, title: 'Adventure Day', description: 'Explore together.', location: 'Ocean', mood: 'peak', activities: ['Diving', 'Jet ski', 'Sandbank picnic'], localSpots: ['Dive sites', 'Private island'] },
      { day: 5, title: 'Cultural Experience', description: 'Local island visit.', location: 'Local Island', mood: 'falling', activities: ['Local village tour', 'Cooking class', 'Stargazing dinner'], localSpots: ['Local island', 'Astronomy deck'] },
      { day: 6, title: 'Pure Relaxation', description: 'Soak it all in.', location: 'Resort', mood: 'falling', activities: ['Villa day', 'Pool time', 'Farewell dinner'], localSpots: ['Villa', 'Beach'] },
      { day: 7, title: 'Paradise Farewell', description: 'Until next time.', location: 'Maldives', mood: 'falling', activities: ['Sunrise swim', 'Seaplane departure', 'Film delivery'], localSpots: ['Ocean villa', 'Seaplane dock'] },
    ],
    nearbyAttractions: [
      { name: 'House Reef', type: 'nature', distance: 'Steps away', rating: 5.0, description: 'Incredible snorkeling right from your villa', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400', mustTry: 'Night snorkeling with mantas' },
    ],
    localTips: [
      { category: 'Romance', icon: '❤️', items: ['Book overwater villa', 'Sunset dolphin cruise', 'Floating breakfast', 'Private sandbank dinner'] },
      { category: 'Maldives Tips', icon: '🌴', items: ['Dry season Nov-Apr', 'All-inclusive recommended', 'Bring reef-safe sunscreen', 'Seaplane only in daylight'] },
    ],
  },
  // Epic Adventures
  {
    id: '13',
    title: 'Patagonia Trek Adventure',
    host: 'Epic Trails',
    location: 'Torres del Paine, Chile',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    price: '$3,900',
    dates: 'Nov 5-14, 2025',
    duration: '10 days',
    rating: 4.9,
    tags: ['Adventure', 'Hiking', 'Epic'],
    narrative: 'discovery',
    storyBeats: [
      { day: 1, title: 'Journey South', description: 'Travel to the end of the world.', location: 'Punta Arenas', mood: 'rising', activities: ['Arrival', 'Gear check', 'Group dinner'], localSpots: ['Strait of Magellan', 'Historic center'] },
      { day: 2, title: 'Park Entry', description: 'Enter the wilderness.', location: 'Torres del Paine', mood: 'rising', activities: ['Park transfer', 'First hike', 'Refugio check-in'], localSpots: ['Salto Grande', 'Lake Nordenskjöld'] },
      { day: 3, title: 'W Trek Begin', description: 'Start the legendary trail.', location: 'French Valley', mood: 'rising', activities: ['French Valley hike', 'Glacier views', 'Mountain camp'], localSpots: ['French Valley', 'Glacier Grey views'] },
      { day: 4, title: 'Glacier Day', description: 'Face the ice giants.', location: 'Grey Glacier', mood: 'rising', activities: ['Glacier hike', 'Ice trekking', 'Lake crossing'], localSpots: ['Grey Glacier', 'Grey Lake'] },
      { day: 5, title: 'The Towers', description: 'The iconic Torres rise before you.', location: 'Las Torres', mood: 'peak', activities: ['Pre-dawn start', 'Tower sunrise', 'Celebration descent'], localSpots: ['Torres base', 'Tower viewpoint'] },
      { day: 6, title: 'Wildlife Day', description: 'Guanacos and condors.', location: 'Park', mood: 'falling', activities: ['Wildlife safari', 'Easy hikes', 'Hot springs'], localSpots: ['Laguna Azul', 'Wildlife areas'] },
      { day: 7, title: 'Rest & Reflect', description: 'Process the journey.', location: 'Puerto Natales', mood: 'falling', activities: ['Town exploration', 'Gear cleaning', 'Photo review'], localSpots: ['Puerto Natales', 'Waterfront'] },
      { day: 8, title: 'Departure', description: 'Take Patagonia with you.', location: 'Punta Arenas', mood: 'falling', activities: ['Travel north', 'Final dinner', 'Film delivery'], localSpots: ['Airport', 'Last views'] },
    ],
    nearbyAttractions: [
      { name: 'Torres del Paine', type: 'nature', distance: 'On-site', rating: 5.0, description: 'One of the world\'s most spectacular national parks', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400', mustTry: 'Sunrise at the Towers' },
    ],
    localTips: [
      { category: 'Trekking', icon: '🥾', items: ['Book refugios months ahead', 'Layering is essential', 'Weather changes in minutes', 'Bring trekking poles'] },
      { category: 'Patagonia', icon: '🏔️', items: ['Best season Oct-Mar', 'Wind can be brutal', 'Carry water treatment', 'Respect Leave No Trace'] },
    ],
  },
  {
    id: '14',
    title: 'Great Barrier Reef Dive',
    host: 'Ocean Adventures',
    location: 'Cairns, Australia',
    image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800',
    price: '$2,900',
    dates: 'Jul 10-16, 2025',
    duration: '7 days',
    rating: 4.9,
    tags: ['Adventure', 'Diving', 'Ocean'],
    narrative: 'adventure',
    sportCategory: 'surfing',
    storyBeats: [
      { day: 1, title: 'Cairns Arrival', description: 'Gateway to the reef.', location: 'Cairns', mood: 'rising', activities: ['Check-in', 'Gear fitting', 'Welcome dinner'], localSpots: ['Cairns Esplanade', 'Night markets'] },
      { day: 2, title: 'First Reef Day', description: 'Meet the Great Barrier Reef.', location: 'Outer Reef', mood: 'rising', activities: ['Boat trip out', 'First dives', 'Snorkeling'], localSpots: ['Outer reef pontoon', 'Coral gardens'] },
      { day: 3, title: 'Liveaboard Begins', description: 'Sleep on the reef.', location: 'Coral Sea', mood: 'rising', activities: ['Liveaboard check-in', 'Night dive', 'Stars at sea'], localSpots: ['Ribbon Reefs', 'Night dive site'] },
      { day: 4, title: 'Cod Hole', description: 'Meet the giant potato cod.', location: 'Cod Hole', mood: 'peak', activities: ['Multiple dives', 'Cod interaction', 'Manta search'], localSpots: ['Cod Hole', 'Osprey Reef'] },
      { day: 5, title: 'Reef Exploration', description: 'Discover new dive sites.', location: 'Various', mood: 'falling', activities: ['Wall dives', 'Drift dives', 'Marine life'], localSpots: ['Steve\'s Bommie', 'Pixie Pinnacle'] },
      { day: 6, title: 'Rainforest Day', description: 'Above water adventure.', location: 'Daintree', mood: 'falling', activities: ['Return to shore', 'Rainforest tour', 'Farewell dinner'], localSpots: ['Daintree Rainforest', 'Cape Tribulation'] },
      { day: 7, title: 'Aussie Farewell', description: 'Until next dive.', location: 'Cairns', mood: 'falling', activities: ['Koala visit', 'Last shopping', 'Film delivery'], localSpots: ['Wildlife park', 'Airport'] },
    ],
    nearbyAttractions: [
      { name: 'Great Barrier Reef', type: 'nature', distance: 'Boat trip', rating: 5.0, description: 'World\'s largest coral reef system', image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400', mustTry: 'Night dive' },
      { name: 'Daintree Rainforest', type: 'nature', distance: '2 hours drive', rating: 4.8, description: 'World\'s oldest rainforest meets the reef', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400' },
    ],
    localTips: [
      { category: 'Diving Tips', icon: '🤿', items: ['Get certified before trip', 'Reef-safe sunscreen only', 'Liveaboard is best experience', 'Bring underwater camera'] },
      { category: 'Australia Tips', icon: '🦘', items: ['Winter (Jun-Aug) is dry season', 'Watch for jellyfish warnings', 'Tip not expected', 'Drive on the left'] },
    ],
  },
  {
    id: '15',
    title: 'Swiss Alps E-Bike Adventure',
    host: 'Alpine Cycling',
    location: 'Swiss Alps',
    image: 'https://images.unsplash.com/photo-1530256124-31e929bbb169?w=800',
    price: '$3,200',
    dates: 'Aug 15-21, 2025',
    duration: '7 days',
    rating: 4.8,
    tags: ['Adventure', 'Biking', 'Alps'],
    narrative: 'adventure',
    storyBeats: [
      { day: 1, title: 'Zurich to Alps', description: 'Journey into the mountains.', location: 'Zurich to Grindelwald', mood: 'rising', activities: ['Bike fitting', 'Train journey', 'Eiger views'], localSpots: ['Grindelwald', 'Eiger North Face'] },
      { day: 2, title: 'First Wheels', description: 'Get comfortable with e-biking.', location: 'Grindelwald', mood: 'rising', activities: ['Valley ride', 'Waterfall stops', 'Mountain lunch'], localSpots: ['First mountain', 'Bachalpsee'] },
      { day: 3, title: 'Jungfrau Day', description: 'Top of Europe experience.', location: 'Jungfrau', mood: 'rising', activities: ['Train to top', 'Snow experience', 'Descent ride'], localSpots: ['Jungfraujoch', 'Lauterbrunnen'] },
      { day: 4, title: 'Lauterbrunnen Valley', description: '72 waterfalls in one valley.', location: 'Lauterbrunnen', mood: 'peak', activities: ['Valley exploration', 'Staubbach Falls', 'Paragliders overhead'], localSpots: ['Valley floor', 'Trümmelbach Falls'] },
      { day: 5, title: 'Interlaken Transfer', description: 'Between the lakes.', location: 'Interlaken', mood: 'falling', activities: ['Lake ride', 'Town exploration', 'Adventure sports option'], localSpots: ['Lake Brienz', 'Interlaken center'] },
      { day: 6, title: 'Lucerne Bound', description: 'Classic Switzerland.', location: 'Lucerne', mood: 'falling', activities: ['Scenic ride', 'Old town walk', 'Farewell dinner'], localSpots: ['Chapel Bridge', 'Lake Lucerne'] },
      { day: 7, title: 'Swiss Farewell', description: 'Chocolate and departure.', location: 'Zurich', mood: 'falling', activities: ['Return to Zurich', 'Chocolate shopping', 'Film delivery'], localSpots: ['Zurich Old Town', 'Airport'] },
    ],
    nearbyAttractions: [
      { name: 'Jungfraujoch', type: 'landmark', distance: 'Train ride', rating: 4.9, description: 'Top of Europe at 3,454m with glacier views', image: 'https://images.unsplash.com/photo-1530256124-31e929bbb169?w=400' },
      { name: 'Lauterbrunnen Valley', type: 'nature', distance: 'On route', rating: 4.9, description: 'The valley of 72 waterfalls', image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=400' },
    ],
    localTips: [
      { category: 'E-Biking', icon: '🚴', items: ['Battery lasts 60-80km', 'Charge every night', 'Layers essential', 'Helmet provided'] },
      { category: 'Swiss Tips', icon: '🇨🇭', items: ['Swiss Pass saves money', 'Trains run on time', 'Tap water is excellent', 'Cash still useful in villages'] },
    ],
  },
];

// Trip Highlights for Create Trip form
const tripHighlights: TripHighlight[] = [
  // Sports
  { id: 'nba', name: 'NBA Game', icon: '🏀', category: 'sports' },
  { id: 'mlb', name: 'MLB Game', icon: '⚾', category: 'sports' },
  { id: 'nfl', name: 'NFL Game', icon: '🏈', category: 'sports' },
  { id: 'nhl', name: 'NHL Game', icon: '🏒', category: 'sports' },
  { id: 'fifa', name: 'Soccer/Football', icon: '⚽', category: 'sports' },
  { id: 'f1', name: 'Formula 1', icon: '🏎️', category: 'sports' },
  { id: 'golf', name: 'Golf Tournament', icon: '⛳', category: 'sports' },
  { id: 'tennis', name: 'Tennis Major', icon: '🎾', category: 'sports' },
  { id: 'skiing', name: 'Ski Trip', icon: '⛷️', category: 'sports' },
  { id: 'surfing', name: 'Surfing', icon: '🏄', category: 'sports' },
  // Adventure
  { id: 'hiking', name: 'Epic Hiking', icon: '🥾', category: 'adventure' },
  { id: 'biking', name: 'Mountain Biking', icon: '🚴', category: 'adventure' },
  { id: 'diving', name: 'Scuba Diving', icon: '🤿', category: 'adventure' },
  // Family
  { id: 'theme-park', name: 'Theme Park', icon: '🎢', category: 'family' },
  { id: 'beach-family', name: 'Beach Resort', icon: '🏖️', category: 'family' },
  { id: 'wildlife', name: 'Wildlife Safari', icon: '🦁', category: 'family' },
  // Romantic
  { id: 'beach', name: 'Beach Paradise', icon: '🏝️', category: 'romantic' },
  { id: 'city', name: 'City Romance', icon: '🌃', category: 'romantic' },
  { id: 'wine', name: 'Wine Country', icon: '🍷', category: 'romantic' },
  // Cultural
  { id: 'museum', name: 'Art & Museums', icon: '🏛️', category: 'cultural' },
  { id: 'food-tour', name: 'Food Tour', icon: '🍜', category: 'cultural' },
  { id: 'history', name: 'Historical Sites', icon: '🗿', category: 'cultural' },
  // Wellness
  { id: 'spa', name: 'Spa Retreat', icon: '💆', category: 'wellness' },
  { id: 'yoga', name: 'Yoga Retreat', icon: '🧘', category: 'wellness' },
  { id: 'detox', name: 'Digital Detox', icon: '🌿', category: 'wellness' },
];

// Mock travel agents for bidding
const mockTravelAgents: AgentBid[] = [
  { agentName: 'Sarah at TravelPro', agentAvatar: '👩‍💼', agentRating: 4.9, bidAmount: 0, message: '', specialties: ['Sports Travel', 'VIP Experiences'], responseTime: 'Usually responds in 2 hours' },
  { agentName: 'Mike from Adventure Co', agentAvatar: '🧔', agentRating: 4.8, bidAmount: 0, message: '', specialties: ['Adventure', 'Group Travel'], responseTime: 'Usually responds in 4 hours' },
  { agentName: 'Lisa at Luxury Escapes', agentAvatar: '👱‍♀️', agentRating: 5.0, bidAmount: 0, message: '', specialties: ['Luxury', 'Honeymoons'], responseTime: 'Usually responds in 1 hour' },
  { agentName: 'Carlos from Global Tours', agentAvatar: '🧑', agentRating: 4.7, bidAmount: 0, message: '', specialties: ['International', 'Cultural Tours'], responseTime: 'Usually responds in 6 hours' },
];

const squads: Squad[] = [
  {
    id: 's1',
    name: 'Powder Hunters',
    vibe: 'Serious Training',
    members: [
      { name: 'Jake', avatar: '🧔', from: 'Colorado', bio: 'Ex-ski instructor, chasing the deepest powder', sportInterests: ['skiing', 'surfing', 'mma'], travelStyle: 'Adventure-first', nationality: 'us', relationshipStatus: 'single', age: 32 },
      { name: 'Mika', avatar: '👩', from: 'Tokyo', bio: 'Weekend warrior, weekday designer', sportInterests: ['skiing', 'tennis', 'f1'], travelStyle: 'Balanced', nationality: 'jp', relationshipStatus: 'single', age: 28 },
      { name: 'Tom', avatar: '👨', from: 'Vancouver', bio: 'Backcountry guide, mountain photographer', sportInterests: ['skiing', 'nhl', 'golf'], travelStyle: 'Off-the-beaten-path', nationality: 'ca', relationshipStatus: 'couple', age: 35 },
      { name: 'Lisa', avatar: '👱‍♀️', from: 'Zurich', bio: 'Alpine ski racer turned freerider', sportInterests: ['skiing', 'f1', 'tennis'], travelStyle: 'Luxury comfort', nationality: 'ch', relationshipStatus: 'looking', age: 29 },
    ],
    maxMembers: 6,
    compatibility: 94,
    avatar: '🎿',
    description: 'Early mornings, first lifts, and tracking powder all day. We take our skiing seriously but know how to celebrate after.',
    sportInterests: ['skiing', 'surfing', 'f1'],
  },
  {
    id: 's2',
    name: 'Après Ski Social',
    vibe: 'Fun & Social',
    members: [
      { name: 'Emma', avatar: '👩‍🦰', from: 'Sydney', bio: 'Marketing exec who lives for travel', sportInterests: ['skiing', 'surfing', 'tennis'], travelStyle: 'Social butterfly', nationality: 'au', relationshipStatus: 'single', age: 31 },
      { name: 'Marco', avatar: '🧔‍♂️', from: 'Milan', bio: 'Fashion industry, weekend skier', sportInterests: ['skiing', 'fifa', 'f1'], travelStyle: 'Stylish & social', nationality: 'it', relationshipStatus: 'looking', age: 34 },
      { name: 'Sarah', avatar: '👩‍🦱', from: 'London', bio: 'Finance by day, foodie by night', sportInterests: ['skiing', 'tennis', 'golf'], travelStyle: 'Culinary explorer', nationality: 'uk', relationshipStatus: 'couple', age: 30 },
      { name: 'Chris', avatar: '👨‍🦲', from: 'NYC', bio: 'Tech founder, first-time powder chaser', sportInterests: ['nba', 'skiing', 'golf'], travelStyle: 'Experience collector', nationality: 'us', relationshipStatus: 'single', age: 36 },
      { name: 'Yuki', avatar: '👧', from: 'Osaka', bio: 'Local expert, sushi sommelier', sportInterests: ['skiing', 'mlb', 'f1'], travelStyle: 'Cultural immersion', nationality: 'jp', relationshipStatus: 'married', age: 33 },
      { name: 'Alex', avatar: '🧑', from: 'Berlin', bio: 'DJ & snowboard enthusiast', sportInterests: ['skiing', 'fifa', 'mma'], travelStyle: 'Night owl', nationality: 'de', relationshipStatus: 'single', age: 27 },
      { name: 'Nina', avatar: '👩', from: 'Paris', bio: 'Wine journalist exploring sake', sportInterests: ['skiing', 'tennis', 'f1'], travelStyle: 'Gourmet traveler', nationality: 'fr', relationshipStatus: 'looking', age: 32 },
    ],
    maxMembers: 10,
    compatibility: 87,
    avatar: '🍻',
    description: 'Ski hard, party harder. Hot tubs, sake, and good vibes after every run. The memories are as good as the skiing.',
    sportInterests: ['skiing', 'fifa', 'tennis'],
  },
  {
    id: 's3',
    name: 'Chill Crew',
    vibe: 'Relaxed Pace',
    members: [
      { name: 'David', avatar: '👨', from: 'Seattle', bio: 'Software engineer, yoga practitioner', sportInterests: ['skiing', 'golf', 'nba'], travelStyle: 'Mindful explorer', nationality: 'us', relationshipStatus: 'married', age: 38 },
      { name: 'Amy', avatar: '👩', from: 'Portland', bio: 'Photographer capturing quiet moments', sportInterests: ['skiing', 'surfing', 'tennis'], travelStyle: 'Slow travel', nationality: 'us', relationshipStatus: 'couple', age: 29 },
      { name: 'Max', avatar: '👦', from: 'Munich', bio: 'Architect, design enthusiast', sportInterests: ['skiing', 'f1', 'fifa'], travelStyle: 'Design-focused', nationality: 'de', relationshipStatus: 'single', age: 31 },
      { name: 'Sophie', avatar: '👧', from: 'Amsterdam', bio: 'Sustainability consultant, nature lover', sportInterests: ['skiing', 'surfing', 'tennis'], travelStyle: 'Eco-conscious', nationality: 'nl', relationshipStatus: 'looking', age: 27 },
      { name: 'James', avatar: '🧔', from: 'Auckland', bio: 'Remote worker, endless summer chaser', sportInterests: ['skiing', 'surfing', 'mma'], travelStyle: 'Digital nomad', nationality: 'nz', relationshipStatus: 'single', age: 33 },
    ],
    maxMembers: 8,
    compatibility: 72,
    avatar: '☕',
    description: 'Taking it easy with long lunches, scenic runs, and cozy evenings. Quality over quantity.',
    sportInterests: ['skiing', 'surfing', 'golf'],
  },
  {
    id: 's4',
    name: 'Hoops Fanatics',
    vibe: 'Die-Hard Fans',
    members: [
      { name: 'Marcus', avatar: '👨‍🦱', from: 'Chicago', bio: 'Former college player, now biggest fan', sportInterests: ['nba', 'nfl', 'mlb'], travelStyle: 'Stadium hopper', nationality: 'us', relationshipStatus: 'married', age: 35 },
      { name: 'Jasmine', avatar: '👩', from: 'Atlanta', bio: 'Sports journalist covering the league', sportInterests: ['nba', 'nfl', 'fifa'], travelStyle: 'Press pass pro', nationality: 'us', relationshipStatus: 'single', age: 29 },
      { name: 'Derek', avatar: '🧔', from: 'Oakland', bio: 'Warriors fan since day one', sportInterests: ['nba', 'mlb', 'mma'], travelStyle: 'Authentic local', nationality: 'us', relationshipStatus: 'couple', age: 42 },
      { name: 'Kim', avatar: '👧', from: 'Seoul', bio: 'K-pop manager, NBA superfan', sportInterests: ['nba', 'fifa', 'f1'], travelStyle: 'VIP experience', nationality: 'kr', relationshipStatus: 'single', age: 26 },
      { name: 'Tyler', avatar: '👨', from: 'Phoenix', bio: 'Fantasy basketball champion 3x', sportInterests: ['nba', 'nfl', 'golf'], travelStyle: 'Stats nerd', nationality: 'us', relationshipStatus: 'looking', age: 31 },
    ],
    maxMembers: 8,
    compatibility: 91,
    avatar: '🏀',
    description: 'We live and breathe basketball. Courtside dreams, halftime debates, and post-game analysis until 2am.',
    sportInterests: ['nba', 'nfl', 'mlb'],
  },
  {
    id: 's5',
    name: 'Golf Legends',
    vibe: 'Classic & Refined',
    members: [
      { name: 'Robert', avatar: '🧔', from: 'Scottsdale', bio: 'Single-digit handicap, Masters dreamer', sportInterests: ['golf', 'tennis', 'nfl'], travelStyle: 'Country club', nationality: 'us', relationshipStatus: 'married', age: 52 },
      { name: 'Catherine', avatar: '👩', from: 'Edinburgh', bio: 'Links golf purist, whisky connoisseur', sportInterests: ['golf', 'tennis', 'f1'], travelStyle: 'Traditional luxury', nationality: 'uk', relationshipStatus: 'married', age: 48 },
      { name: 'Hiroshi', avatar: '👨', from: 'Kyoto', bio: 'Business exec, 5am tee time warrior', sportInterests: ['golf', 'mlb', 'f1'], travelStyle: 'Early bird', nationality: 'jp', relationshipStatus: 'married', age: 55 },
      { name: 'Patricia', avatar: '👱‍♀️', from: 'Palm Beach', bio: 'Golf philanthropist, charity tournament queen', sportInterests: ['golf', 'tennis', 'nba'], travelStyle: 'Social networker', nationality: 'us', relationshipStatus: 'married', age: 45 },
    ],
    maxMembers: 6,
    compatibility: 88,
    avatar: '⛳',
    description: 'Appreciate the game, the history, and the 19th hole. We\'re here for the azaleas and the pimento cheese.',
    sportInterests: ['golf', 'tennis', 'f1'],
  },
  {
    id: 's6',
    name: 'Football Ultras',
    vibe: 'Passionate Supporters',
    members: [
      { name: 'Carlos', avatar: '🧔‍♂️', from: 'Barcelona', bio: 'Més que un club - lifetime member', sportInterests: ['fifa', 'f1', 'tennis'], travelStyle: 'Pilgrimage maker', nationality: 'es', relationshipStatus: 'couple', age: 34 },
      { name: 'Priya', avatar: '👩', from: 'Mumbai', bio: 'Arsenal supporter, cricket convert', sportInterests: ['fifa', 'tennis', 'f1'], travelStyle: 'Global fan', nationality: 'in', relationshipStatus: 'single', age: 28 },
      { name: 'Hans', avatar: '👨', from: 'Munich', bio: 'Bayern faithful, Oktoberfest host', sportInterests: ['fifa', 'f1', 'skiing'], travelStyle: 'Beer & football', nationality: 'de', relationshipStatus: 'married', age: 39 },
      { name: 'Lucia', avatar: '👧', from: 'Buenos Aires', bio: 'Maradona is religion, Messi is proof', sportInterests: ['fifa', 'tennis', 'mma'], travelStyle: 'Emotional traveler', nationality: 'ar', relationshipStatus: 'looking', age: 25 },
      { name: 'Ahmed', avatar: '🧔', from: 'Cairo', bio: 'Liverpool never walks alone', sportInterests: ['fifa', 'mma', 'f1'], travelStyle: 'Passionate pilgrim', nationality: 'ae', relationshipStatus: 'family', age: 37 },
      { name: 'Sophie', avatar: '👩‍🦰', from: 'Lyon', bio: 'Women\'s football advocate, coach', sportInterests: ['fifa', 'tennis', 'surfing'], travelStyle: 'Activist traveler', nationality: 'fr', relationshipStatus: 'single', age: 30 },
    ],
    maxMembers: 10,
    compatibility: 96,
    avatar: '⚽',
    description: 'We don\'t just watch football, we LIVE it. Scarves, chants, and tears of joy guaranteed.',
    sportInterests: ['fifa', 'f1', 'tennis'],
  },
  {
    id: 's7',
    name: 'Family Fun Squad',
    vibe: 'Kid-Friendly',
    members: [
      { name: 'Mike & Sarah', avatar: '👨‍👩‍👧', from: 'Denver', bio: 'Teaching our kids to love the mountains', sportInterests: ['skiing', 'nfl', 'mlb'], travelStyle: 'Family adventure', nationality: 'us', relationshipStatus: 'family', age: 42 },
      { name: 'Kenji & Yumi', avatar: '👨‍👩‍👦', from: 'Nagoya', bio: 'Family of powder lovers since the kids were 3', sportInterests: ['skiing', 'mlb', 'f1'], travelStyle: 'Early bedtime', nationality: 'jp', relationshipStatus: 'family', age: 38 },
      { name: 'The Smiths', avatar: '👨‍👩‍👧‍👦', from: 'Melbourne', bio: '4 kids, 8 skis, endless energy', sportInterests: ['skiing', 'surfing', 'tennis'], travelStyle: 'Organized chaos', nationality: 'au', relationshipStatus: 'family', age: 44 },
      { name: 'Anna & Peter', avatar: '👨‍👩‍👧', from: 'Stockholm', bio: 'Swedish ski family seeking new slopes', sportInterests: ['skiing', 'nhl', 'fifa'], travelStyle: 'Nordic style', nationality: 'ch', relationshipStatus: 'family', age: 36 },
    ],
    maxMembers: 6,
    compatibility: 85,
    avatar: '👨‍👩‍👧‍👦',
    description: 'Kid-friendly runs, hot chocolate breaks, and making family memories in the snow. Ski school schedules welcome!',
    sportInterests: ['skiing', 'mlb', 'nfl'],
  },
  {
    id: 's8',
    name: 'Honeymoon Vibes',
    vibe: 'Romantic Couples',
    members: [
      { name: 'Jake & Emily', avatar: '💑', from: 'San Francisco', bio: 'Just married! First trip as Mr & Mrs', sportInterests: ['skiing', 'golf', 'tennis'], travelStyle: 'Romance first', nationality: 'us', relationshipStatus: 'couple', age: 30 },
      { name: 'Pierre & Marie', avatar: '💑', from: 'Paris', bio: 'Celebrating 5 years together', sportInterests: ['skiing', 'f1', 'tennis'], travelStyle: 'Gourmet romance', nationality: 'fr', relationshipStatus: 'couple', age: 33 },
      { name: 'Raj & Ananya', avatar: '💑', from: 'Mumbai', bio: 'Newlyweds exploring the world', sportInterests: ['skiing', 'fifa', 'tennis'], travelStyle: 'Cultural couple', nationality: 'in', relationshipStatus: 'couple', age: 28 },
    ],
    maxMembers: 6,
    compatibility: 92,
    avatar: '💕',
    description: 'For couples who ski together, stay together. Private chalets, sunset views, and après-ski for two.',
    sportInterests: ['skiing', 'tennis', 'golf'],
  },
];

// Generate shot prompts based on trip type
const generateShotPrompts = (trip: Trip): ShotPrompt[] => {
  const basePrompts: ShotPrompt[] = [
    { id: 'shot1', prompt: `Arriving at ${trip.location}`, tip: 'Capture that first moment of excitement', uploaded: false },
    { id: 'shot6', prompt: 'Unexpected beautiful moment', tip: 'Trust your instincts - if it moves you, capture it', uploaded: false },
  ];

  // Sport-specific prompts
  const sportPrompts: Record<SportCategory, ShotPrompt[]> = {
    nba: [
      { id: 'sport1', prompt: 'Arena entrance reveal', tip: 'Film the moment you first see the court', uploaded: false },
      { id: 'sport2', prompt: 'Your squad in jerseys', tip: 'Get everyone showing team colors', uploaded: false },
      { id: 'sport3', prompt: 'The big play reaction', tip: 'Selfie video capturing your reaction to a big moment', uploaded: false },
    ],
    mlb: [
      { id: 'sport1', prompt: 'Walking into the stadium', tip: 'Show the field reveal moment', uploaded: false },
      { id: 'sport2', prompt: 'Hot dog and beer moment', tip: 'Classic ballpark experience', uploaded: false },
      { id: 'sport3', prompt: 'Seventh inning stretch', tip: 'Capture your squad singing along', uploaded: false },
    ],
    nfl: [
      { id: 'sport1', prompt: 'Tailgate party vibes', tip: 'Show the pre-game energy', uploaded: false },
      { id: 'sport2', prompt: 'Stadium atmosphere', tip: 'Capture the crowd roar', uploaded: false },
      { id: 'sport3', prompt: 'Touchdown celebration', tip: 'Film your reaction to a score', uploaded: false },
    ],
    nhl: [
      { id: 'sport1', prompt: 'Ice rink reveal', tip: 'That moment you see the ice', uploaded: false },
      { id: 'sport2', prompt: 'Goal horn reaction', tip: 'Capture the celebration energy', uploaded: false },
      { id: 'sport3', prompt: 'Squad at the glass', tip: 'Get close to the action', uploaded: false },
    ],
    fifa: [
      { id: 'sport1', prompt: 'Stadium entrance with fans', tip: 'Show the sea of supporters', uploaded: false },
      { id: 'sport2', prompt: 'Chanting with the crowd', tip: 'Video of you joining the songs', uploaded: false },
      { id: 'sport3', prompt: 'Goal celebration moment', tip: 'Pure emotion when the net ripples', uploaded: false },
    ],
    golf: [
      { id: 'sport1', prompt: 'Walking the course', tip: 'Scenic views along the fairway', uploaded: false },
      { id: 'sport2', prompt: 'Following your favorite player', tip: 'Get them in action', uploaded: false },
      { id: 'sport3', prompt: 'The 18th hole moment', tip: 'Capture the final putt atmosphere', uploaded: false },
    ],
    tennis: [
      { id: 'sport1', prompt: 'Court side view', tip: 'Show how close you are to the action', uploaded: false },
      { id: 'sport2', prompt: 'Epic rally reaction', tip: 'Your face during an intense point', uploaded: false },
      { id: 'sport3', prompt: 'Champion moment', tip: 'The trophy lift or match point', uploaded: false },
    ],
    f1: [
      { id: 'sport1', prompt: 'Cars flying by', tip: 'Slow-mo or blur effect of the speed', uploaded: false },
      { id: 'sport2', prompt: 'Pit lane action', tip: 'Capture the pit stop chaos', uploaded: false },
      { id: 'sport3', prompt: 'Podium celebration', tip: 'Champagne spray moment', uploaded: false },
    ],
    skiing: [
      { id: 'sport1', prompt: 'POV riding the ski lift up', tip: 'Hold phone steady, capture the anticipation', uploaded: false },
      { id: 'sport2', prompt: 'Epic powder turn', tip: 'Ask a squad mate to film you', uploaded: false },
      { id: 'sport3', prompt: 'Après ski moment', tip: 'Capture the vibe - drinks, laughter, tired smiles', uploaded: false },
    ],
    surfing: [
      { id: 'sport1', prompt: 'Sunrise paddle out', tip: 'Golden hour on the water', uploaded: false },
      { id: 'sport2', prompt: 'Catching a wave', tip: 'Have someone film from shore', uploaded: false },
      { id: 'sport3', prompt: 'Beach bonfire moment', tip: 'Post-surf relaxation vibes', uploaded: false },
    ],
    mma: [
      { id: 'sport1', prompt: 'Octagon reveal', tip: 'The moment you see the cage', uploaded: false },
      { id: 'sport2', prompt: 'Fighter walkout energy', tip: 'Capture the entrance atmosphere', uploaded: false },
      { id: 'sport3', prompt: 'Knockout reaction', tip: 'Your face during a finish', uploaded: false },
    ],
  };

  // Local experience prompts
  const localPrompts: ShotPrompt[] = [
    { id: 'local1', prompt: `${trip.location} local food experience`, tip: 'Get the steam, the colors, the first bite', uploaded: false },
    { id: 'local2', prompt: 'Hidden gem discovery', tip: 'That spot only locals know about', uploaded: false },
    { id: 'local3', prompt: 'Squad dinner moment', tip: 'Everyone together, great food, good vibes', uploaded: false },
  ];

  // Story beat prompts
  const storyPrompts: ShotPrompt[] = trip.storyBeats.slice(0, 2).map((beat, i) => ({
    id: `story${i}`,
    prompt: beat.title,
    tip: beat.description.slice(0, 50) + '...',
    uploaded: false,
  }));

  const sportSpecific = trip.sportCategory ? sportPrompts[trip.sportCategory] : [];

  return [...basePrompts.slice(0, 1), ...sportSpecific, ...localPrompts.slice(0, 2), ...storyPrompts, basePrompts[1]];
};

// Mock group uploads for demonstration
const mockGroupUploads: GroupUpload[] = [
  { id: 'gu1', fileName: 'stadium_arrival.jpg', thumbnail: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=200', uploadedBy: 'Yuki T.', uploadedAt: '2 hours ago', type: 'photo', selected: true },
  { id: 'gu2', fileName: 'squad_selfie.jpg', thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=200', uploadedBy: 'Alex R.', uploadedAt: '1 hour ago', type: 'photo', selected: true },
  { id: 'gu3', fileName: 'game_moment.mp4', thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200', uploadedBy: 'Sarah M.', uploadedAt: '45 min ago', type: 'video', selected: true },
  { id: 'gu4', fileName: 'food_shot.jpg', thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200', uploadedBy: 'You', uploadedAt: '30 min ago', type: 'photo', selected: false },
];

const captions: Caption[] = [
  {
    style: 'deep',
    label: 'Deep & Reflective',
    emoji: '💭',
    text: "There's something about standing at the top of a mountain that puts everything into perspective. The world below seems so small, and somehow, so do all your worries. This trip wasn't just about the skiing—it was about finding that quiet space where you remember who you are.\n\nGrateful for the powder, the people, and the perspective. 🏔️",
    hashtags: ['#MountainMeditation', '#FindYourPeace', '#NisekoMoments', '#TravelTransformation', '#SnowTherapy', '#StoryTrip'],
  },
  {
    style: 'hype',
    label: 'Hype Mode',
    emoji: '🔥',
    text: "NISEKO WENT ABSOLUTELY CRAZY 🔥🔥🔥\n\nJust dropped into waist-deep powder like it was nothing!! Living my BEST life with the squad while y'all scrolling at home 😤❄️\n\nThis is what peak winter looks like. Don't @ me 💪",
    hashtags: ['#PowderDay', '#SkiLife', '#NisekoJapan', '#LivingMyBestLife', '#SquadGoals', '#StoryTrip', '#SendIt'],
  },
  {
    style: 'funny',
    label: 'Funny & Casual',
    emoji: '😂',
    text: "Me: I'll just do a few easy runs today\nAlso me: *Signs up for backcountry expedition at 6am*\n\nThe powder made me do it, your honor 🎿😂\n\nMy legs have filed for divorce but my soul is THRIVING. 10/10 would destroy my quads again.",
    hashtags: ['#SkiHumor', '#PowderProblems', '#NisekoLife', '#NoRegrets', '#SendIt', '#StoryTrip'],
  },
];

// ============ MAIN APP ============
function App() {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [selectedNarrative, setSelectedNarrative] = useState<Narrative | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedCaption, setSelectedCaption] = useState<Caption | null>(null);
  const [showProModal, setShowProModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    gender: null,
    nationality: null,
    interests: [],
    personality: null,
    relationshipStatus: null,
    travelDates: null,
    budgetRange: null,
    groupPreference: null,
  });

  const handleCopyCaption = () => {
    if (selectedCaption) {
      navigator.clipboard.writeText(selectedCaption.text + '\n\n' + selectedCaption.hashtags.join(' '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const goBack = () => {
    const screenOrder: AppScreen[] = ['landing', 'personal-interest', 'narrative', 'trips', 'trip-detail', 'squad', 'itinerary', 'memory-maker', 'film-studio'];
    const currentIndex = screenOrder.indexOf(screen);
    if (currentIndex > 0) {
      setScreen(screenOrder[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <LandingScreen
            key="landing"
            onStart={() => setScreen('trips')}
            onDemo={() => setScreen('demo')}
            onAbout={() => setScreen('about')}
            onCreateTrip={() => setScreen('create-trip')}
            onSignIn={() => setScreen('personal-interest')}
            onManageTrips={() => setScreen('manage-trips')}
            onChatStart={() => setScreen('chat-onboarding')}
            onSquad={() => setScreen('squad')}
            onFilm={() => setScreen('film-studio')}
          />
        )}

        {screen === 'chat-onboarding' && (
          <ChatOnboardingScreen
            key="chat-onboarding"
            onSelectTrip={(listing) => {
              const trip = convertTripListingToTrip(listing);
              setSelectedTrip(trip);
              setScreen('trip-detail');
            }}
            onBack={() => setScreen('landing')}
          />
        )}

        {screen === 'personal-interest' && (
          <PersonalInterestScreen
            key="personal-interest"
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onContinue={() => setScreen('narrative')}
            onBack={() => setScreen('landing')}
          />
        )}

        {screen === 'demo' && (
          <DemoScreen key="demo" onClose={() => setScreen('landing')} onStart={() => setScreen('personal-interest')} />
        )}

        {screen === 'about' && (
          <AboutScreen key="about" onBack={() => setScreen('landing')} onStart={() => setScreen('personal-interest')} />
        )}

        {screen === 'create-trip' && (
          <CreateTripScreen
            key="create-trip"
            onBack={() => setScreen('landing')}
            onSubmit={() => setScreen('landing')}
            onManageTrips={() => setScreen('manage-trips')}
          />
        )}

        {screen === 'manage-trips' && (
          <ManageTripsScreen
            key="manage-trips"
            onBack={() => setScreen('landing')}
            onViewTrip={(t) => { setSelectedTrip(t); setScreen('trip-detail'); }}
          />
        )}

        {screen === 'narrative' && (
          <NarrativeScreen
            key="narrative"
            narratives={narratives}
            onSelect={(n) => { setSelectedNarrative(n); setScreen('trips'); }}
            onBack={() => setScreen('personal-interest')}
          />
        )}

        {screen === 'trips' && (
          <TripsScreen
            key="trips"
            trips={trips.filter(t => !selectedNarrative || t.narrative === selectedNarrative.id)}
            narrative={selectedNarrative}
            userProfile={userProfile}
            onSelect={(t) => { setSelectedTrip(t); setScreen('trip-detail'); }}
            onBack={() => setScreen('narrative')}
          />
        )}

        {screen === 'trip-detail' && selectedTrip && (
          <TripDetailScreen
            key="trip-detail"
            trip={selectedTrip}
            onContinue={() => setScreen('squad')}
            onBack={() => setScreen('trips')}
          />
        )}

        {screen === 'squad' && selectedTrip && (
          <SquadScreen
            key="squad"
            trip={selectedTrip}
            squads={squads}
            selectedSquad={selectedSquad}
            onSelect={setSelectedSquad}
            onContinue={() => setScreen('itinerary')}
            onBack={() => setScreen('trip-detail')}
          />
        )}

        {screen === 'itinerary' && selectedTrip && selectedSquad && (
          <ItineraryScreen
            key="itinerary"
            trip={selectedTrip}
            squad={selectedSquad}
            onStartTrip={() => setScreen('memory-maker')}
            onBack={() => setScreen('squad')}
          />
        )}

        {screen === 'memory-maker' && selectedTrip && selectedSquad && (
          <MemoryMakerScreen
            key="memory-maker"
            trip={selectedTrip}
            squad={selectedSquad}
            uploadedFiles={uploadedFiles}
            onUpload={(files) => setUploadedFiles([...uploadedFiles, ...files])}
            onOpenStudio={() => setScreen('film-studio')}
            onBack={() => setScreen('itinerary')}
          />
        )}

        {screen === 'film-studio' && (
          <FilmStudioScreen
            key="film-studio"
            captions={captions}
            selectedCaption={selectedCaption}
            onSelectCaption={setSelectedCaption}
            onCopy={handleCopyCaption}
            copied={copied}
            onShowProModal={() => setShowProModal(true)}
            onBack={() => setScreen('memory-maker')}
          />
        )}
      </AnimatePresence>

      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  );
}

// ============ LANDING SCREEN ============
function LandingScreen({ onStart, onDemo, onAbout, onCreateTrip, onSignIn, onManageTrips, onChatStart, onSquad, onFilm }: { onStart: () => void; onDemo: () => void; onAbout: () => void; onCreateTrip: () => void; onSignIn: () => void; onManageTrips: () => void; onChatStart: () => void; onSquad: () => void; onFilm: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Photo Collage Background - Equal sized tiles filling entire screen */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-warm-900/80 via-warm-900/60 to-warm-900/85 z-10" />

        {/* Equal Grid - 4 columns x 3 rows = 12 photos */}
        <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 grid-rows-3 md:grid-rows-3">
          {/* Row 1 */}
          <div className="overflow-hidden">
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" alt="Beach" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600" alt="Mountains" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600" alt="Paris" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden hidden md:block">
            <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600" alt="Safari" className="w-full h-full object-cover" />
          </div>

          {/* Row 2 */}
          <div className="overflow-hidden">
            <img src="https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600" alt="Skiing" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600" alt="Wellness" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600" alt="Road Trip" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden hidden md:block">
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600" alt="Food" className="w-full h-full object-cover" />
          </div>

          {/* Row 3 */}
          <div className="overflow-hidden">
            <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=600" alt="Hiking" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <img src="https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600" alt="Island" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <img src="https://images.unsplash.com/photo-1528181304800-259b08848526?w=600" alt="Temple" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden hidden md:block">
            <img src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600" alt="Sports" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-white">StoryTrip</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onAbout} className="text-white/80 hover:text-white transition-colors flex items-center gap-1">
              <Info className="w-4 h-4" /> How It Works
            </button>
            <button onClick={onManageTrips} className="text-white/80 hover:text-white transition-colors flex items-center gap-1">
              <Briefcase className="w-4 h-4" /> My Trips
            </button>
            <button onClick={onSignIn} className="btn bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30">
              Sign In
            </button>
          </div>
        </header>

        {/* Hero */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-4xl">
            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span className="text-teal-300 text-sm font-medium">AI-Powered Travel Planning</span>
            </motion.div>

            {/* Brand Name - Big & Bold */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-teal-200 to-white">Story</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-terra-400 via-terra-300 to-teal-400">Trip</span>
              </h1>
            </motion.div>

            {/* Tagline - Story & Trip emphasized */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto"
            >
              Your <span className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-white">Story</span> Starts with the <span className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-terra-400 to-terra-300">Trip</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col gap-6 items-center"
            >
              {/* Main CTA - Start My Story Button */}
              <button
                onClick={onChatStart}
                className="btn bg-gradient-to-r from-terra-500 via-terra-600 to-teal-600 text-white text-xl px-12 py-5 shadow-2xl shadow-terra-500/40 hover:shadow-3xl hover:scale-105 transition-all flex items-center justify-center gap-3 rounded-2xl border-2 border-cream-300/20"
              >
                <Sparkles className="w-6 h-6" />
                Start my Story
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Feature Cards */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                <button
                  onClick={onStart}
                  className="group btn bg-white/10 backdrop-blur-sm text-white border border-white/30 px-6 py-4 hover:bg-white/20 flex flex-col items-center gap-1 min-w-[160px] rounded-xl transition-all hover:scale-105"
                >
                  <span className="text-2xl mb-1">🎬</span>
                  <span className="font-semibold">Narrative Trips</span>
                  <span className="text-xs text-white/60">Story-driven adventures</span>
                </button>
                <button
                  onClick={onSquad}
                  className="group btn bg-white/10 backdrop-blur-sm text-white border border-white/30 px-6 py-4 hover:bg-white/20 flex flex-col items-center gap-1 min-w-[160px] rounded-xl transition-all hover:scale-105"
                >
                  <span className="text-2xl mb-1">👥</span>
                  <span className="font-semibold">Squad Matching</span>
                  <span className="text-xs text-white/60">Travel with your tribe</span>
                </button>
                <button
                  onClick={onFilm}
                  className="group btn bg-white/10 backdrop-blur-sm text-white border border-white/30 px-6 py-4 hover:bg-white/20 flex flex-col items-center gap-1 min-w-[160px] rounded-xl transition-all hover:scale-105"
                >
                  <span className="text-2xl mb-1">🎥</span>
                  <span className="font-semibold">Your Film</span>
                  <span className="text-xs text-white/60">Pro documentary included</span>
                </button>
              </div>
            </motion.div>
          </div>
        </main>

      </div>

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-out forwards;
        }
      `}</style>
    </motion.div>
  );
}

// ============ CHAT ONBOARDING SCREEN ============
// Real Gemini API integration for natural travel conversation
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  suggestions?: string[];
  recommendedTrips?: TripListing[];
  externalLinks?: Array<{ platform: string; url: string; description: string; searchTerm?: string }>;
  isEditing?: boolean;
}

function ChatOnboardingScreen({ onSelectTrip, onBack }: {
  onSelectTrip: (trip: TripListing) => void;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [hasRecommended, setHasRecommended] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const chatEndRef = useState<HTMLDivElement | null>(null);

  // Get comprehensive trip summary for Gemini
  const tripsSummary = getTripsSummaryForAI();

  // System prompt for Gemini - balanced travel consultant
  const systemPrompt = `You are a friendly travel consultant for StoryTrip. Keep responses concise but helpful (3-4 sentences).

STYLE:
- Warm but efficient
- Ask one focused question per turn
- Add a brief helpful insight when relevant
- Use 1-2 emojis to keep it friendly

CONVERSATION TOPICS:
- Where they want to go (destination/region)
- When they're traveling (dates/season)
- Who's joining (solo/couple/family/friends)
- Budget range (budget/mid-range/luxury)
- What they enjoy (adventure/relaxation/culture/food)

QUICK REPLY OPTIONS - IMPORTANT:
Always end with 3-4 descriptive options that include context:
[Quick replies: "Beach in Southeast Asia", "European city break", "Adventure in South America", "Relaxing wellness retreat"]

NOT like this (too vague): [Quick replies: "Option A", "Beach", "City"]
LIKE this (descriptive): [Quick replies: "Tropical beach getaway", "Cultural city exploration", "Mountain adventure", "Food & wine tour"]

WHEN USER WANTS RECOMMENDATIONS:
Start with "[RECOMMEND_TRIPS]" then JSON:
[RECOMMEND_TRIPS]
{"tripIds": ["6", "26"], "searchTerms": {"tripadvisor": "budget beach Costa Rica", "booking": "beach hotels Costa Rica", "ctrip": "beach packages Asia"}, "destination": "Costa Rica"}

Then write:
🎯 **Perfect matches for you:**

1. **[Trip Name]** - One sentence why it's great for them
2. **[Trip Name]** - One sentence why it's great for them

💡 **Tip:** [One relevant travel tip]

TRIPS DATABASE (${tripsSummary.length} trips):
${JSON.stringify(tripsSummary.slice(0, 40), null, 1)}

RULES:
- 3-4 sentences per response (not too short, not too long)
- Quick replies must be DESCRIPTIVE (4-6 words each, include destination/activity type)
- Be helpful but don't ramble`;

  // Initialize conversation with Gemini
  useEffect(() => {
    const initChat = async () => {
      setIsTyping(true);

      // Call Gemini for initial greeting
      const greeting = await callGeminiAPI("Greet the user warmly in 2-3 sentences. Ask what kind of trip they're dreaming about. Provide 4 descriptive quick reply options like 'Tropical beach escape' or 'European adventure'.");

      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: greeting.content,
        suggestions: greeting.suggestions
      };
      setMessages([welcomeMessage]);
      setConversationHistory([{ role: 'assistant', content: greeting.content }]);
      setIsTyping(false);
    };

    initChat();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef[0]?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Call Gemini API
  const callGeminiAPI = async (userMessage: string): Promise<{
    content: string;
    suggestions: string[];
    tripIds?: string[];
    searchTerms?: { tripadvisor?: string; booking?: string; ctrip?: string };
    destination?: string;
  }> => {
    // Build conversation history for Gemini format
    const geminiHistory = conversationHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // If no API key, use fallback
    if (!GEMINI_API_KEY) {
      console.log('No Gemini API key found. Key value:', GEMINI_API_KEY ? 'exists' : 'empty');
      return {
        content: "I'm having trouble connecting to my AI brain. Please make sure the Gemini API key is set up correctly in Vercel. Go to Settings → Environment Variables and add VITE_GEMINI_API_KEY, then redeploy.",
        suggestions: ["Try again", "Go back"]
      };
    }

    try {
      // Use gemini-2.0-flash for better quality responses
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            // System instruction as first message
            {
              role: 'user',
              parts: [{ text: systemPrompt }]
            },
            {
              role: 'model',
              parts: [{ text: 'I understand. I am a travel consultant for StoryTrip. I will have natural conversations, ask thoughtful questions, share travel insights, and recommend trips from our database when appropriate.' }]
            },
            // Previous conversation history
            ...geminiHistory,
            // Current user message
            {
              role: 'user',
              parts: [{ text: userMessage }]
            }
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1500,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API error:', response.status, errorData);

        // Handle rate limiting (429 error)
        if (response.status === 429) {
          setIsRateLimited(true);
          // Clear rate limit after 30 seconds
          setTimeout(() => setIsRateLimited(false), 30000);
          return {
            content: "I'm getting a lot of requests right now. Please wait about 30 seconds before sending another message. The Gemini API has rate limits on free tier usage.",
            suggestions: [] // No suggestions to prevent more requests
          };
        }

        return {
          content: `Oops! I got an error from Gemini (${response.status}). ${errorData?.error?.message || 'Please check your API key is valid.'}`,
          suggestions: ["Try again"]
        };
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!responseText) {
        console.error('Empty Gemini response:', data);
        return {
          content: "I received an empty response. Let me try again - what kind of trip are you dreaming about?",
          suggestions: ["Adventure travel", "Relaxing getaway", "Cultural exploration"]
        };
      }

      return parseGeminiResponse(responseText);
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        content: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again!`,
        suggestions: ["Try again"]
      };
    }
  };

  // Parse Gemini response
  const parseGeminiResponse = (text: string): {
    content: string;
    suggestions: string[];
    tripIds?: string[];
    searchTerms?: { tripadvisor?: string; booking?: string; ctrip?: string };
    destination?: string;
  } => {
    let content = text;
    let suggestions: string[] = [];
    let tripIds: string[] | undefined;
    let searchTerms: { tripadvisor?: string; booking?: string; ctrip?: string } | undefined;
    let destination: string | undefined;

    // Check for trip recommendations
    if (text.includes('[RECOMMEND_TRIPS]')) {
      const parts = text.split('[RECOMMEND_TRIPS]');
      content = parts[0].trim();

      try {
        // Extract JSON from the recommendation part - handle nested objects
        const jsonStart = parts[1].indexOf('{');
        let braceCount = 0;
        let jsonEnd = jsonStart;
        for (let i = jsonStart; i < parts[1].length; i++) {
          if (parts[1][i] === '{') braceCount++;
          if (parts[1][i] === '}') braceCount--;
          if (braceCount === 0) {
            jsonEnd = i + 1;
            break;
          }
        }
        const jsonStr = parts[1].substring(jsonStart, jsonEnd);
        const recData = JSON.parse(jsonStr);
        tripIds = recData.tripIds;
        searchTerms = recData.searchTerms;
        destination = recData.destination;
        // Get the message after the JSON
        const afterJson = parts[1].substring(jsonEnd).trim();
        if (afterJson) {
          content = afterJson;
        }
      } catch (e) {
        console.error('Error parsing recommendations:', e);
      }
    }

    // Extract quick reply suggestions
    const suggestionMatch = text.match(/\[Quick replies?:\s*"([^"]+)"(?:,\s*"([^"]+)")?(?:,\s*"([^"]+)")?(?:,\s*"([^"]+)")?\]/i);
    if (suggestionMatch) {
      suggestions = suggestionMatch.slice(1).filter(Boolean) as string[];
      content = content.replace(/\[Quick replies?:.*?\]/i, '').trim();
    }

    return { content, suggestions, tripIds, searchTerms, destination };
  };

  // Simple fallback when no API key - just show error
  const generateFallbackResponse = (): string => {
    return `I'm sorry, but I need a Gemini API key to have a real conversation with you. Please add your Gemini API key in Vercel settings to enable AI-powered travel recommendations.

In the meantime, you can browse our 100+ curated trips by going back and exploring the trip listings!

[Quick replies: "Go back to browse trips"]`;
  };

  // Start editing a message
  const startEditing = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditValue(content);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditValue('');
  };

  // Save edited message and regenerate response
  const saveEdit = async (messageId: string) => {
    if (!editValue.trim()) return;

    // Find the index of the message being edited
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    // Remove all messages after this one (including AI responses)
    const newMessages = messages.slice(0, messageIndex);

    // Update the edited message
    const editedMessage: ChatMessage = {
      id: messageId,
      role: 'user',
      content: editValue.trim()
    };
    newMessages.push(editedMessage);
    setMessages(newMessages);

    // Update conversation history
    const historyIndex = Math.floor(messageIndex / 2); // Approximate history index
    const newHistory = conversationHistory.slice(0, historyIndex * 2);
    newHistory.push({ role: 'user', content: editValue.trim() });
    setConversationHistory(newHistory);

    // Reset editing state
    setEditingMessageId(null);
    setEditValue('');
    setHasRecommended(false);

    // Get new response from Gemini
    setIsTyping(true);
    const response = await callGeminiAPI(editValue.trim());

    // Update conversation history with response
    setConversationHistory(prev => [...prev, { role: 'assistant', content: response.content }]);

    // Add response
    if (response.tripIds && response.tripIds.length > 0) {
      const recommendedTrips = response.tripIds
        .map(id => tripDatabase.find(t => t.id === id))
        .filter(Boolean) as TripListing[];

      // Generate external links with AI-provided search terms
      const externalLinks = generateExternalSearchLinks({
        destination: response.destination,
        searchTerms: response.searchTerms
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        recommendedTrips,
        externalLinks
      };
      setMessages(prev => [...prev, assistantMessage]);
      setHasRecommended(true);
    } else {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        suggestions: response.suggestions
      };
      setMessages(prev => [...prev, assistantMessage]);
    }

    setIsTyping(false);
  };

  // Handle sending message
  const handleSend = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isTyping) return;

    // Check rate limit - require 3 seconds between requests
    const now = Date.now();
    if (now - lastRequestTime < 3000) {
      return; // Silently ignore if too fast
    }

    // Check if rate limited from 429 error
    if (isRateLimited) {
      const rateLimitMessage: ChatMessage = {
        id: `system-${Date.now()}`,
        role: 'assistant',
        content: "Please wait a moment before sending another message. The API is rate limited.",
        suggestions: []
      };
      setMessages(prev => [...prev, rateLimitMessage]);
      return;
    }

    setLastRequestTime(now);

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Update conversation history
    setConversationHistory(prev => [...prev, { role: 'user', content: text }]);

    // Show typing indicator
    setIsTyping(true);

    // Get Claude's response
    const response = await callGeminiAPI(text);

    // Update conversation history with response
    setConversationHistory(prev => [...prev, { role: 'assistant', content: response.content }]);

    // Check if we have trip recommendations
    if (response.tripIds && response.tripIds.length > 0) {
      const recommendedTrips = response.tripIds
        .map(id => tripDatabase.find(t => t.id === id))
        .filter(Boolean) as TripListing[];

      // Generate external links with AI-provided search terms
      const externalLinks = generateExternalSearchLinks({
        destination: response.destination,
        searchTerms: response.searchTerms
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        recommendedTrips,
        externalLinks
      };
      setMessages(prev => [...prev, assistantMessage]);
      setHasRecommended(true);
    } else {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        suggestions: response.suggestions
      };
      setMessages(prev => [...prev, assistantMessage]);
    }

    setIsTyping(false);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  // Handle "I'm done, recommend trips" action
  const handleRequestRecommendations = () => {
    handleSend("I'm ready! Based on our conversation, please recommend the best trips for me from your database and also suggest what I should search for on TripAdvisor, Booking.com, and Ctrip.");
  };

  // Handle "Start from beginning" action
  const handleStartOver = () => {
    setMessages([]);
    setConversationHistory([]);
    setHasRecommended(false);
    setIsRateLimited(false);
    // Re-initialize with welcome message after a brief delay
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: "Fresh start! 🌍 What kind of trip are you dreaming about?",
        suggestions: ["Tropical beach escape", "European city adventure", "Mountain & nature retreat", "Cultural food journey"]
      };
      setMessages([welcomeMessage]);
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-terra-50"
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream-100/90 backdrop-blur-md p-4 flex items-center justify-between border-b border-cream-300">
        <button onClick={onBack} className="flex items-center gap-2 text-warm-600 hover:text-warm-800 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-display font-bold text-warm-800">StoryTrip Guide</span>
            <p className="text-xs text-warm-500">Powered by Gemini</p>
          </div>
        </div>
        <div className="w-20" />
      </header>

      {/* Chat Container */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-40">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message.role === 'assistant' && (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                        <Compass className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-none px-5 py-3 max-w-[80%] shadow-md border border-cream-200">
                        <p className="text-warm-800 leading-relaxed">{message.content}</p>
                      </div>
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 ml-13 pl-1">
                        {message.suggestions.map((suggestion, idx) => (
                          <motion.button
                            key={idx}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-2 bg-cream-200 hover:bg-cream-300 border border-cream-300 rounded-xl text-warm-700 text-sm transition-all"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Trip Recommendations */}
                    {message.recommendedTrips && message.recommendedTrips.length > 0 && (
                      <div className="space-y-3 ml-13 pl-1 mt-4">
                        {message.recommendedTrips.map((trip, index) => (
                          <motion.div
                            key={trip.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 }}
                            onClick={() => onSelectTrip(trip)}
                            className="bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all group border border-cream-200 shadow-md"
                          >
                            <div className="flex">
                              <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 relative">
                                <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                  #{index + 1} Pick
                                </div>
                              </div>
                              <div className="p-3 sm:p-4 flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-warm-800 font-semibold">{trip.title}</h3>
                                    <p className="text-warm-500 text-sm flex items-center gap-1 mt-0.5">
                                      <MapPin className="w-3 h-3" /> {trip.location}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1 bg-terra-100 px-2 py-1 rounded-lg">
                                    <Star className="w-3 h-3 text-terra-500 fill-terra-500" />
                                    <span className="text-terra-600 text-sm font-medium">{trip.rating}</span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {trip.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-cream-100 rounded-full text-xs text-warm-600">{tag}</span>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-warm-400 text-sm">{trip.duration}</span>
                                  <span className="text-teal-600 font-bold">{trip.price}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-center pt-3"
                        >
                          <p className="text-warm-500 text-sm">Tap any trip to explore details and book!</p>
                        </motion.div>

                        {/* External Platform Links */}
                        {message.externalLinks && message.externalLinks.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-4 pt-4 border-t border-cream-200"
                          >
                            <p className="text-warm-600 font-medium mb-3 flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              Search on Travel Sites:
                            </p>
                            <div className="space-y-2">
                              {message.externalLinks.slice(0, 3).map((link, idx) => (
                                <a
                                  key={idx}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-4 py-3 bg-white hover:bg-cream-50 border border-cream-300 rounded-xl text-warm-700 transition-all hover:shadow-md group"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <span className="font-semibold text-teal-600">{link.platform}</span>
                                      <span className="text-warm-400">→</span>
                                      <span className="text-warm-600 text-sm italic">"{link.searchTerm || link.description}"</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-warm-400 group-hover:text-teal-500 transition-colors" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {message.role === 'user' && (
                  <div className="flex justify-end group">
                    {editingMessageId === message.id ? (
                      // Edit mode
                      <div className="max-w-[85%] w-full">
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-4 py-3 bg-white border-2 border-teal-400 rounded-xl text-warm-800 focus:outline-none focus:ring-2 focus:ring-teal-100 resize-none"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={cancelEditing}
                            className="px-4 py-2 text-warm-600 hover:text-warm-800 text-sm transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => saveEdit(message.id)}
                            disabled={!editValue.trim() || isTyping}
                            className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm hover:bg-teal-600 disabled:opacity-50 transition-colors"
                          >
                            Save & Regenerate
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display mode with edit button
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => startEditing(message.id, message.content)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-warm-400 hover:text-warm-600 transition-all"
                          title="Edit message"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                            <path d="m15 5 4 4"/>
                          </svg>
                        </button>
                        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl rounded-tr-none px-5 py-3 max-w-[80%] shadow-md">
                          <p className="text-white">{message.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-none px-5 py-3 shadow-md border border-cream-200">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={el => { chatEndRef[0] = el; }} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      {!hasRecommended && (
        <div className="fixed bottom-0 left-0 right-0 bg-cream-100/95 backdrop-blur-md border-t border-cream-300 p-4">
          <div className="max-w-2xl mx-auto">
            {/* Action Buttons */}
            {messages.length > 2 && !isTyping && (
              <div className="flex gap-3 mb-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRequestRecommendations}
                  disabled={isRateLimited}
                  className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl shadow-md shadow-teal-500/20 text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  I'm done - Recommend trips for me
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartOver}
                  className="px-4 py-2.5 bg-white border-2 border-cream-300 text-warm-600 rounded-xl text-sm font-medium hover:bg-cream-50 transition-colors"
                >
                  Start from beginning
                </motion.button>
              </div>
            )}

            {/* Rate limit warning */}
            {isRateLimited && (
              <div className="mb-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm text-center">
                Please wait ~30 seconds before sending another message (API rate limit)
              </div>
            )}

            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tell me about your dream trip..."
                className="flex-1 px-4 py-3 bg-white border-2 border-cream-300 rounded-xl text-warm-800 placeholder-warm-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                disabled={isTyping || isRateLimited}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend()}
                disabled={isTyping || !inputValue.trim() || isRateLimited}
                className="px-5 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl shadow-lg shadow-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
            <p className="text-center text-warm-400 text-xs mt-2">
              Chat naturally, then click "Recommend trips" when ready. Hover over your messages to edit them.
            </p>
          </div>
        </div>
      )}

      {/* After recommendations - show option to start over */}
      {hasRecommended && (
        <div className="fixed bottom-0 left-0 right-0 bg-cream-100/95 backdrop-blur-md border-t border-cream-300 p-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-warm-600 text-sm mb-3">Want to explore different options?</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartOver}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl shadow-md shadow-teal-500/20 font-medium"
            >
              Start a new search
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ============ PERSONAL INTEREST SCREEN ============
function PersonalInterestScreen({
  onContinue,
  onBack,
  userProfile,
  setUserProfile
}: {
  onContinue: () => void;
  onBack: () => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
}) {
  const [interestTab, setInterestTab] = useState<'sports' | 'entertainment' | 'lifestyle'>('sports');

  const toggleInterest = (interest: InterestCategory) => {
    const current = userProfile.interests;
    if (current.includes(interest)) {
      setUserProfile({ ...userProfile, interests: current.filter(s => s !== interest) });
    } else {
      setUserProfile({ ...userProfile, interests: [...current, interest] });
    }
  };

  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Calculate profile completeness percentage
  const getProfileCompleteness = () => {
    let completed = 0;
    const total = 8;
    if (userProfile.name.trim()) completed++;
    if (userProfile.gender) completed++;
    if (userProfile.nationality) completed++;
    if (userProfile.interests.length > 0) completed++;
    if (userProfile.relationshipStatus) completed++;
    if (userProfile.personality) completed++;
    if (userProfile.groupPreference) completed++;
    if (userProfile.travelDates?.duration) completed++;
    return Math.round((completed / total) * 100);
  };

  // Guest mode - skip all onboarding and go directly to browse
  const handleGuestMode = () => {
    const guestProfile = {
      ...userProfile,
      isGuest: true,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('storyTrip_userProfile', JSON.stringify(guestProfile));
    onContinue();
  };

  // Save profile and continue
  const handleContinue = () => {
    const savedProfile = {
      ...userProfile,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('storyTrip_userProfile', JSON.stringify(savedProfile));
    onContinue();
  };

  const completeness = getProfileCompleteness();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-cream-50 via-cream-100 to-teal-50"
    >
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm p-4 flex items-center justify-between border-b border-cream-200 shadow-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-warm-600 hover:text-warm-900 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-100 rounded-xl flex items-center justify-center">
            <Compass className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-lg font-display font-bold text-warm-900">StoryTrip</span>
        </div>
        <button
          onClick={handleGuestMode}
          className="flex items-center gap-2 px-4 py-2 text-warm-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors"
        >
          <Eye className="w-5 h-5" />
          <span className="font-medium">Skip as Guest</span>
        </button>
      </header>

      {/* Scrollable Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-warm-900 mb-3">
            Let's Get to Know You
          </h1>
          <p className="text-warm-600 text-lg">
            All fields are optional - the more you share, the better we can match you with trips and travelers!
          </p>
          {/* Progress indicator */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="w-32 h-2 bg-cream-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <span className="text-sm font-medium text-teal-600">{completeness}% complete</span>
          </div>
        </div>

        {/* Section 1: Basic Info */}
        <section className="bg-white rounded-3xl p-6 border-2 border-cream-200 shadow-sm">
          <h2 className="text-xl font-display font-bold text-warm-900 mb-6 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-teal-600" />
            Basic Information
          </h2>

          {/* Name Input */}
          <div className="space-y-3 mb-6">
            <label className="text-base font-medium text-warm-800">What's your name?</label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
              placeholder="Enter your name (optional)"
              className="input-cozy text-lg"
            />
          </div>

          {/* Gender Selection */}
          <div className="space-y-3 mb-6">
            <label className="text-base font-medium text-warm-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              Gender
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {genders.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setUserProfile({ ...userProfile, gender: userProfile.gender === g.id ? null : g.id })}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    userProfile.gender === g.id
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-cream-300 bg-white hover:border-purple-300'
                  }`}
                >
                  <span className="text-2xl mb-1 block">{g.icon}</span>
                  <p className="font-medium text-warm-800 text-sm">{g.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Nationality */}
          <div className="space-y-3">
            <label className="text-base font-medium text-warm-800 flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-600" />
              Where are you from?
            </label>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 bg-cream-50 rounded-xl">
              {nationalities.map((nat) => (
                <button
                  key={nat.id}
                  onClick={() => setUserProfile({ ...userProfile, nationality: userProfile.nationality === nat.id ? null : nat.id, customNationality: nat.id === 'other' ? userProfile.customNationality : undefined })}
                  className={`p-2 rounded-lg border-2 transition-all flex flex-col items-center ${
                    userProfile.nationality === nat.id
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-cream-200 bg-white hover:border-teal-300'
                  }`}
                >
                  <span className="text-xl">{nat.flag}</span>
                  <span className="text-xs text-warm-600 truncate w-full text-center">{nat.name}</span>
                </button>
              ))}
            </div>
            {userProfile.nationality === 'other' && (
              <input
                type="text"
                value={userProfile.customNationality || ''}
                onChange={(e) => setUserProfile({ ...userProfile, customNationality: e.target.value })}
                placeholder="Enter your nationality..."
                className="input-cozy mt-2"
              />
            )}
          </div>
        </section>

        {/* Section 2: Interests */}
        <section className="bg-white rounded-3xl p-6 border-2 border-cream-200 shadow-sm">
          <h2 className="text-xl font-display font-bold text-warm-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            What Are Your Interests?
          </h2>
          <p className="text-warm-600 text-sm mb-4">Select all that excite you - we'll match you with like-minded travelers.</p>

          {/* Interest Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {(['sports', 'entertainment', 'lifestyle'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setInterestTab(tab)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                  interestTab === tab
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'bg-cream-200 text-warm-600 hover:bg-cream-300'
                }`}
              >
                {tab === 'sports' ? '🏆 Sports' : tab === 'entertainment' ? '🎬 Entertainment' : '✨ Lifestyle'}
              </button>
            ))}
          </div>

          {/* Interest Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {interestCategories
              .filter((i) => i.category === interestTab)
              .map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    userProfile.interests.includes(interest.id)
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-cream-200 bg-white hover:border-teal-300'
                  }`}
                >
                  <span className="text-2xl mb-1 block">{interest.icon}</span>
                  <p className="font-medium text-warm-800 text-sm">{interest.name}</p>
                  {userProfile.interests.includes(interest.id) && (
                    <Check className="w-4 h-4 text-teal-600 mx-auto mt-1" />
                  )}
                </button>
              ))}
          </div>

          {/* Add Custom Interest */}
          <div className="bg-cream-50 rounded-xl p-3 border border-cream-200">
            <div className="flex gap-2">
              <input
                type="text"
                id="custom-interest-input"
                placeholder="Add custom interest..."
                className="input-cozy flex-1 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    const value = input.value.trim();
                    if (value && !(userProfile.customInterests || []).includes(value)) {
                      setUserProfile({
                        ...userProfile,
                        customInterests: [...(userProfile.customInterests || []), value]
                      });
                      input.value = '';
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.getElementById('custom-interest-input') as HTMLInputElement;
                  const value = input?.value.trim();
                  if (value && !(userProfile.customInterests || []).includes(value)) {
                    setUserProfile({
                      ...userProfile,
                      customInterests: [...(userProfile.customInterests || []), value]
                    });
                    input.value = '';
                  }
                }}
                className="btn btn-primary px-3 py-2 text-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {userProfile.customInterests && userProfile.customInterests.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {userProfile.customInterests.map((interest, idx) => (
                  <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center gap-1">
                    {interest}
                    <button
                      onClick={() => setUserProfile({
                        ...userProfile,
                        customInterests: userProfile.customInterests?.filter((_, i) => i !== idx)
                      })}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Selected count */}
          {(userProfile.interests.length > 0 || (userProfile.customInterests?.length || 0) > 0) && (
            <p className="text-sm text-teal-600 mt-3 font-medium">
              {userProfile.interests.length + (userProfile.customInterests?.length || 0)} interests selected
            </p>
          )}
        </section>

        {/* Section 3: About You */}
        <section className="bg-white rounded-3xl p-6 border-2 border-cream-200 shadow-sm">
          <h2 className="text-xl font-display font-bold text-warm-900 mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-terra-500" />
            A Little More About You
          </h2>

          {/* Relationship Status */}
          <div className="space-y-3 mb-6">
            <label className="text-base font-medium text-warm-800">Relationship Status</label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {relationshipStatuses.map((status) => (
                <button
                  key={status.id}
                  onClick={() => setUserProfile({ ...userProfile, relationshipStatus: userProfile.relationshipStatus === status.id ? null : status.id })}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    userProfile.relationshipStatus === status.id
                      ? 'border-terra-500 bg-terra-50 shadow-md'
                      : 'border-cream-200 bg-white hover:border-terra-300'
                  }`}
                >
                  <span className="text-2xl mb-1 block">{status.icon}</span>
                  <p className="font-medium text-warm-800 text-xs">{status.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Personality Type */}
          <div className="space-y-3 mb-6">
            <label className="text-base font-medium text-warm-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Personality Type (MBTI)
              <span className="text-xs text-warm-500 font-normal">Optional</span>
            </label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {personalityTypes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setUserProfile({ ...userProfile, personality: userProfile.personality === p.id ? null : p.id })}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    userProfile.personality === p.id
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-cream-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <p className="font-bold text-warm-800 text-sm">{p.id}</p>
                  <p className="text-xs text-warm-500 truncate">{p.nickname}</p>
                </button>
              ))}
            </div>
            {userProfile.personality && (
              <div className="bg-purple-50 rounded-xl p-3 flex items-start gap-2 mt-2">
                <span className="text-xl">🧠</span>
                <div>
                  <p className="font-semibold text-purple-700 text-sm">
                    {userProfile.personality} - {personalityTypes.find((p) => p.id === userProfile.personality)?.nickname}
                  </p>
                  <p className="text-xs text-purple-600">
                    {personalityTypes.find((p) => p.id === userProfile.personality)?.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Group Preference */}
          <div className="space-y-3">
            <label className="text-base font-medium text-warm-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Preferred Group Size
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {groupPreferences.map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => setUserProfile({ ...userProfile, groupPreference: userProfile.groupPreference === pref.id ? null : pref.id })}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    userProfile.groupPreference === pref.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-cream-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <span className="text-xl mb-1 block">{pref.icon}</span>
                  <p className="font-medium text-warm-800 text-sm">{pref.name}</p>
                  <p className="text-xs text-warm-500">{pref.description}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Travel Dates & Budget */}
        <section className="bg-white rounded-3xl p-6 border-2 border-cream-200 shadow-sm">
          <h2 className="text-xl font-display font-bold text-warm-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-teal-600" />
            Travel Dates & Budget
          </h2>

          {/* Date Selection */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-base font-medium text-warm-800">Start Date</label>
              <input
                type="date"
                value={userProfile.travelDates?.startDate || ''}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const startDate = e.target.value;
                  const endDate = userProfile.travelDates?.endDate || '';
                  const duration = calculateDuration(startDate, endDate);
                  setUserProfile({
                    ...userProfile,
                    travelDates: { startDate, endDate, duration }
                  });
                }}
                className="input-cozy"
              />
            </div>
            <div className="space-y-2">
              <label className="text-base font-medium text-warm-800">End Date</label>
              <input
                type="date"
                value={userProfile.travelDates?.endDate || ''}
                min={userProfile.travelDates?.startDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const endDate = e.target.value;
                  const startDate = userProfile.travelDates?.startDate || '';
                  const duration = calculateDuration(startDate, endDate);
                  setUserProfile({
                    ...userProfile,
                    travelDates: { startDate, endDate, duration }
                  });
                }}
                className="input-cozy"
              />
            </div>
          </div>

          {/* Duration Display */}
          {userProfile.travelDates && userProfile.travelDates.duration > 0 && (
            <div className="bg-teal-50 rounded-xl p-4 flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-teal-600" />
                <div>
                  <p className="font-semibold text-teal-700 text-sm">Trip Duration</p>
                  <p className="text-teal-600 text-xs">
                    {new Date(userProfile.travelDates.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' - '}
                    {new Date(userProfile.travelDates.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-teal-700">{userProfile.travelDates.duration}</p>
                <p className="text-teal-600 text-xs">days</p>
              </div>
            </div>
          )}

          {/* Budget Range */}
          <div className="space-y-3">
            <label className="text-base font-medium text-warm-800 flex items-center gap-2">
              <span className="text-lg">💰</span>
              Budget Range
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {budgetRanges.map((budget) => (
                <button
                  key={budget.id}
                  onClick={() => setUserProfile({ ...userProfile, budgetRange: userProfile.budgetRange === budget.id ? null : budget.id })}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    userProfile.budgetRange === budget.id
                      ? 'border-amber-500 bg-amber-50 shadow-md'
                      : 'border-cream-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <span className="text-xl mb-1 block">{budget.icon}</span>
                  <p className="font-medium text-warm-800 text-sm">{budget.name}</p>
                  <p className="text-xs text-warm-500">{budget.range}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Continue Button */}
        <div className="sticky bottom-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-cream-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-warm-600">
                <span className="font-semibold text-teal-600">{completeness}%</span> complete - {completeness < 50 ? 'Add more for better matches!' : completeness < 100 ? 'Great progress!' : 'Perfect!'}
              </p>
            </div>
            <button
              onClick={handleContinue}
              className="btn bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30 hover:shadow-xl flex items-center gap-2 px-6"
            >
              Find My Perfect Trip
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============ DEMO SCREEN ============
function DemoScreen({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const demoSteps = [
    {
      title: 'Choose Your Narrative',
      description: 'Select from story archetypes like Underdog Rising, Self Discovery, or Squad Goals that match your travel mindset.',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      icon: '🎬',
      duration: 8000,
    },
    {
      title: 'Find Your Adventure',
      description: 'Browse curated trips with story arcs - from skiing in Niseko to courtside NBA experiences to wellness retreats in Bali.',
      image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800',
      icon: '🌍',
      duration: 8000,
    },
    {
      title: 'Explore Local Gems',
      description: 'Discover nearby attractions, must-try restaurants, and insider tips for each destination before you book.',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      icon: '📍',
      duration: 8000,
    },
    {
      title: 'Match with Your Squad',
      description: 'Filter squads by sport interests (NBA, FIFA, Golf, etc.) and find travelers with compatible vibes and travel styles.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
      icon: '👥',
      duration: 8000,
    },
    {
      title: 'Your Story Itinerary',
      description: 'Get a day-by-day journey with story beats - from rising action through the climax to resolution, with local spots for each day.',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
      icon: '📅',
      duration: 8000,
    },
    {
      title: 'Memory Maker',
      description: 'During your trip, follow daily shot lists from your AI director and upload footage for your documentary.',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      icon: '🎥',
      duration: 8000,
    },
    {
      title: 'Your Film Studio',
      description: 'Generate cinematic cuts of your journey and AI-powered social captions in your style - Deep, Hype, or Funny.',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
      icon: '🎬',
      duration: 8000,
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const stepDuration = demoSteps[currentStep].duration;
    const interval = 50; // Update every 50ms for smooth progress
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setProgress((elapsed / stepDuration) * 100);

      if (elapsed >= stepDuration) {
        if (currentStep < demoSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
          setProgress(0);
        } else {
          setIsPlaying(false);
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentStep, isPlaying]);

  const handleSkip = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setProgress(0);
    }
  };

  const totalDuration = demoSteps.reduce((acc, step) => acc + step.duration, 0);
  const elapsedTime = demoSteps.slice(0, currentStep).reduce((acc, step) => acc + step.duration, 0) + (progress / 100) * demoSteps[currentStep].duration;
  const remainingSeconds = Math.ceil((totalDuration - elapsedTime) / 1000);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-warm-900 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Compass className="w-6 h-6 text-teal-400" />
          <span className="text-white font-display font-bold">StoryTrip Demo</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm">{remainingSeconds}s remaining</span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 flex gap-1">
        {demoSteps.map((_, i) => (
          <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-400 transition-all duration-100"
              style={{
                width: i < currentStep ? '100%' : i === currentStep ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-6xl mb-4 block">{demoSteps[currentStep].icon}</span>
              <p className="text-teal-400 text-sm font-medium tracking-widest uppercase mb-2">
                Step {currentStep + 1} of {demoSteps.length}
              </p>
              <h2 className="text-4xl font-display font-bold text-white mb-4">
                {demoSteps[currentStep].title}
              </h2>
              <p className="text-xl text-white/70 leading-relaxed">
                {demoSteps[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src={demoSteps[currentStep].image}
                alt={demoSteps[currentStep].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 flex items-center justify-between">
        <button
          onClick={handleSkip}
          disabled={currentStep >= demoSteps.length - 1}
          className="text-white/60 hover:text-white flex items-center gap-2 disabled:opacity-30"
        >
          <SkipForward className="w-5 h-5" /> Skip
        </button>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn bg-white/10 text-white border border-white/30 hover:bg-white/20"
          >
            Back to Home
          </button>
          <button
            onClick={onStart}
            className="btn bg-gradient-to-r from-teal-500 to-teal-600 text-white flex items-center gap-2"
          >
            Start Your Journey <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============ ABOUT SCREEN ============
function AboutScreen({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  const howItWorks = [
    {
      step: 1,
      title: 'Choose Your Narrative',
      description: 'Select a story archetype that resonates with your travel goals. Whether you\'re seeking an underdog comeback, self-discovery journey, epic adventure, or squad bonding experience.',
      icon: '🎬',
      color: 'teal',
    },
    {
      step: 2,
      title: 'Find Your Adventure',
      description: 'Browse curated trips designed around your chosen narrative. Each trip includes a complete story arc with rising action, climax, and resolution.',
      icon: '🌍',
      color: 'terra',
    },
    {
      step: 3,
      title: 'Explore the Destination',
      description: 'Before you book, discover nearby attractions, local restaurants, insider tips, and must-try experiences. Know exactly what awaits you.',
      icon: '📍',
      color: 'teal',
    },
    {
      step: 4,
      title: 'Match with Your Squad',
      description: 'Filter potential travel companions by sport interests, travel style, and vibe. See compatibility scores and member profiles to find your perfect crew.',
      icon: '👥',
      color: 'terra',
    },
    {
      step: 5,
      title: 'Review Your Story Itinerary',
      description: 'See your complete day-by-day journey mapped to story beats. Each day has a theme, activities, and local spots to explore.',
      icon: '📅',
      color: 'teal',
    },
    {
      step: 6,
      title: 'Capture with Memory Maker',
      description: 'During your trip, follow AI-guided shot lists tailored to each day. Upload photos and videos to build your documentary footage.',
      icon: '🎥',
      color: 'terra',
    },
    {
      step: 7,
      title: 'Create Your Film',
      description: 'Generate cinematic cuts of your journey and AI-powered social captions. Choose between free quick recaps or pro documentary edits.',
      icon: '🎞️',
      color: 'teal',
    },
  ];

  const features = [
    { icon: '🏀', title: 'Sport-Based Matching', desc: 'Filter squads by NBA, MLB, FIFA, Golf, F1, and more' },
    { icon: '🗺️', title: 'Local Discovery', desc: 'Restaurants, landmarks, activities for every destination' },
    { icon: '📊', title: 'Compatibility Scores', desc: 'See how well you match with potential travel mates' },
    { icon: '🎯', title: 'Story Arcs', desc: 'Trips designed with narrative structure and emotional beats' },
    { icon: '📱', title: 'AI Director', desc: 'Daily shot prompts to capture the perfect footage' },
    { icon: '✍️', title: 'Caption Generator', desc: 'Deep, Hype, or Funny - captions in your voice' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-warm"
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream-100/80 backdrop-blur-md border-b border-cream-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-warm-600 hover:text-teal-600">
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <div className="flex items-center gap-3">
            <Compass className="w-6 h-6 text-teal-600" />
            <span className="font-display font-bold text-warm-900">StoryTrip</span>
          </div>
          <button onClick={onStart} className="btn btn-primary text-sm py-2">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold text-warm-900 mb-6"
          >
            How <span className="text-teal-600">StoryTrip</span> Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-warm-600 max-w-2xl mx-auto"
          >
            StoryTrip transforms travel into a narrative experience. We combine story-driven trip design,
            squad matching by interests, and AI-powered filmmaking to create journeys you'll never forget.
          </motion.p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-warm-900 text-center mb-12">
            Your Journey in 7 Steps
          </h2>
          <div className="space-y-6">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-6 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0 ${
                  item.color === 'teal' ? 'bg-teal-100' : 'bg-terra-100'
                }`}>
                  {item.icon}
                </div>
                <div className="card p-6 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      item.color === 'teal' ? 'bg-teal-600' : 'bg-terra-500'
                    }`}>
                      {item.step}
                    </span>
                    <h3 className="text-xl font-display font-semibold text-warm-900">{item.title}</h3>
                  </div>
                  <p className="text-warm-600 ml-11">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-cream-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-warm-900 text-center mb-4">
            Key Features
          </h2>
          <p className="text-warm-600 text-center mb-12 max-w-2xl mx-auto">
            Everything you need for a story-driven travel experience
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card p-6 hover:shadow-xl transition-shadow"
              >
                <span className="text-4xl mb-3 block">{feature.icon}</span>
                <h3 className="font-display font-semibold text-warm-900 mb-2">{feature.title}</h3>
                <p className="text-warm-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sport Categories */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-warm-900 text-center mb-4">
            Match by Sport Interest
          </h2>
          <p className="text-warm-600 text-center mb-12 max-w-2xl mx-auto">
            Find travel companions who share your passion for sports
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {sportCategories.map((sport) => (
              <div
                key={sport.id}
                className="bg-white rounded-full px-4 py-2 border border-cream-200 flex items-center gap-2 hover:border-teal-400 transition-colors"
              >
                <span className="text-xl">{sport.icon}</span>
                <span className="text-warm-700 font-medium">{sport.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="card p-10 text-center bg-gradient-to-br from-teal-500 to-teal-700 text-white">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Write Your Story?
            </h2>
            <p className="text-teal-100 mb-8 text-lg">
              Join thousands of travelers creating unforgettable narrative journeys
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onStart}
                className="btn bg-white text-teal-700 hover:bg-cream-100 text-lg px-8 py-4"
              >
                <Play className="w-5 h-5 mr-2 inline" />
                Begin Your Journey
              </button>
              <button
                onClick={onBack}
                className="btn bg-teal-600 text-white border border-teal-400 hover:bg-teal-500 text-lg px-8 py-4"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-cream-200">
        <div className="max-w-5xl mx-auto text-center text-warm-500 text-sm">
          <p>© 2025 StoryTrip. Transforming travel into unforgettable narratives.</p>
        </div>
      </footer>
    </motion.div>
  );
}

// ============ CREATE TRIP SCREEN ============
function CreateTripScreen({ onBack, onSubmit, onManageTrips }: { onBack: () => void; onSubmit: () => void; onManageTrips: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<TripFormData>({
    title: '',
    category: 'sports',
    highlight: 'nba',
    destination: '',
    groupSize: 4,
    visibility: 'public',
    budgetPerPerson: 1500,
    duration: 5,
    startDate: '',
    description: '',
  });
  const [quotation, setQuotation] = useState<TripQuotation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAgentBids, setShowAgentBids] = useState(false);
  const [submittedToAgents, setSubmittedToAgents] = useState(false);

  const categoryIcons: Record<TripCategory, string> = {
    sports: '🏆',
    family: '👨‍👩‍👧‍👦',
    romantic: '❤️',
    adventure: '🏔️',
    cultural: '🏛️',
    wellness: '🧘',
  };

  const generateQuotation = () => {
    setIsGenerating(true);
    // Simulate AI quotation generation
    setTimeout(() => {
      const basePrice = formData.budgetPerPerson * 0.7;
      const ticketCost = formData.category === 'sports' ? formData.budgetPerPerson * 0.25 : 0;
      setQuotation({
        id: 'q-' + Date.now(),
        totalEstimate: Math.round(basePrice + ticketCost),
        breakdown: {
          accommodation: Math.round(basePrice * 0.35),
          activities: Math.round(basePrice * 0.2),
          transport: Math.round(basePrice * 0.15),
          meals: Math.round(basePrice * 0.15),
          tickets: Math.round(ticketCost),
        },
        confidence: formData.budgetPerPerson > 2000 ? 'high' : formData.budgetPerPerson > 1000 ? 'medium' : 'low',
        aiSuggestions: [
          formData.duration < 4 ? 'Consider adding 1-2 more days for a richer experience' : 'Great trip duration for your destination',
          formData.groupSize > 6 ? 'Groups of 4-6 often get better deals on activities' : 'Perfect group size for personalized experiences',
          formData.category === 'sports' ? 'Book tickets early - prices increase closer to game day' : 'Off-peak timing could save 20-30% on accommodation',
          'Consider travel insurance for groups',
        ],
      });
      setIsGenerating(false);
      setStep(3);
    }, 2000);
  };

  const submitToAgents = () => {
    setSubmittedToAgents(true);
    setTimeout(() => {
      setShowAgentBids(true);
    }, 1500);
  };

  const highlightsForCategory = tripHighlights.filter(h => h.category === formData.category);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen py-8 px-6"
    >
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-warm-600 hover:text-teal-600 mb-8">
          <ChevronLeft className="w-5 h-5" /> Back to home
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <span className="badge badge-terra mb-4 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Your Trip
          </span>
          <h1 className="text-4xl md:text-5xl font-display text-warm-900 mb-4">
            Design Your <span className="text-terra-500">Perfect Adventure</span>
          </h1>
          <p className="text-lg text-warm-600 max-w-2xl mx-auto">
            Tell us what you're dreaming of. We'll help make it happen.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-teal-600 text-white' : 'bg-cream-200 text-warm-400'
              }`}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 4 && <div className={`w-16 h-1 mx-2 transition-all ${step > s ? 'bg-teal-600' : 'bg-cream-200'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-8 text-sm text-warm-500 mb-10">
          <span className={step === 1 ? 'text-teal-600 font-medium' : ''}>Trip Details</span>
          <span className={step === 2 ? 'text-teal-600 font-medium' : ''}>Budget & Group</span>
          <span className={step === 3 ? 'text-teal-600 font-medium' : ''}>AI Quotation</span>
          <span className={step === 4 ? 'text-teal-600 font-medium' : ''}>Agent Bids</span>
        </div>

        {/* Step 1: Trip Details */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-display text-warm-900 mb-4">What kind of trip?</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                {(['sports', 'family', 'romantic', 'adventure', 'cultural', 'wellness'] as TripCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFormData({ ...formData, category: cat, highlight: (tripHighlights.find(h => h.category === cat)?.id || 'nba') as TripFormData['highlight'] })}
                    className={`p-4 rounded-xl text-center transition-all ${
                      formData.category === cat
                        ? 'bg-teal-600 text-white ring-2 ring-teal-600 ring-offset-2'
                        : 'bg-cream-50 hover:bg-cream-100'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{categoryIcons[cat]}</span>
                    <span className="text-sm font-medium capitalize">{cat}</span>
                  </button>
                ))}
              </div>

              <h4 className="font-medium text-warm-800 mb-3">Trip Highlight</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {highlightsForCategory.map((hl) => (
                  <button
                    key={hl.id}
                    onClick={() => setFormData({ ...formData, highlight: hl.id as any })}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                      formData.highlight === hl.id
                        ? 'bg-teal-600 text-white'
                        : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
                    }`}
                  >
                    <span>{hl.icon}</span>
                    {hl.name}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-2">Trip Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Lakers Game Weekend"
                    className="input-cozy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-2">Destination</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g., Los Angeles, CA"
                    className="input-cozy"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-warm-700 mb-2">Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us more about what you're looking for..."
                  className="input-cozy h-24 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.title || !formData.destination}
                className={`btn flex items-center gap-2 ${
                  formData.title && formData.destination ? 'btn-primary' : 'bg-cream-300 text-warm-400 cursor-not-allowed'
                }`}
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Budget & Group */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-display text-warm-900 mb-6">Group & Budget</h3>

              {/* Visibility Toggle */}
              <div className="mb-6">
                <h4 className="font-medium text-warm-800 mb-3">Trip Visibility</h4>
                <div className="flex gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, visibility: 'public' })}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      formData.visibility === 'public'
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-cream-200 hover:border-cream-300'
                    }`}
                  >
                    <Globe className="w-6 h-6 text-teal-600" />
                    <div className="text-left">
                      <p className="font-medium text-warm-800">Public</p>
                      <p className="text-xs text-warm-500">Others can discover and join your trip</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, visibility: 'private' })}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      formData.visibility === 'private'
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-cream-200 hover:border-cream-300'
                    }`}
                  >
                    <Lock className="w-6 h-6 text-terra-600" />
                    <div className="text-left">
                      <p className="font-medium text-warm-800">Private</p>
                      <p className="text-xs text-warm-500">Invite-only for friends & family</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Group Size */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-warm-800">Group Size</h4>
                  <span className="text-2xl font-bold text-teal-600">{formData.groupSize} people</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={formData.groupSize}
                  onChange={(e) => setFormData({ ...formData, groupSize: parseInt(e.target.value) })}
                  className="w-full h-2 bg-cream-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-sm text-warm-500 mt-1">
                  <span>2 (couple)</span>
                  <span>10 (group)</span>
                  <span>20 (large group)</span>
                </div>
              </div>

              {/* Budget Per Person */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-warm-800">Budget Per Person</h4>
                  <span className="text-2xl font-bold text-teal-600">${formData.budgetPerPerson.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={formData.budgetPerPerson}
                  onChange={(e) => setFormData({ ...formData, budgetPerPerson: parseInt(e.target.value) })}
                  className="w-full h-2 bg-cream-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-sm text-warm-500 mt-1">
                  <span>$500 (budget)</span>
                  <span>$2,500 (mid-range)</span>
                  <span>$5,000 (luxury)</span>
                </div>
                <p className="text-center text-sm text-warm-600 mt-2">
                  Total group budget: <span className="font-bold text-terra-600">${(formData.budgetPerPerson * formData.groupSize).toLocaleString()}</span>
                </p>
              </div>

              {/* Duration */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-warm-800">Trip Duration</h4>
                  <span className="text-2xl font-bold text-teal-600">{formData.duration} days</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="14"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full h-2 bg-cream-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-sm text-warm-500 mt-1">
                  <span>2 days (weekend)</span>
                  <span>7 days (week)</span>
                  <span>14 days (extended)</span>
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">Preferred Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="input-cozy"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="btn btn-ghost flex items-center gap-2">
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              <button onClick={generateQuotation} className="btn btn-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Generate AI Quotation
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: AI Quotation */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {isGenerating ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <h3 className="text-xl font-display text-warm-900 mb-2">Generating Your Quotation</h3>
                <p className="text-warm-600">Our AI is analyzing thousands of trips to find the best options...</p>
              </div>
            ) : quotation && (
              <>
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-display text-warm-900">AI Quotation</h3>
                    <span className={`badge ${quotation.confidence === 'high' ? 'badge-teal' : quotation.confidence === 'medium' ? 'badge-terra' : 'badge-cream'}`}>
                      {quotation.confidence} confidence
                    </span>
                  </div>

                  {/* Trip Summary */}
                  <div className="bg-cream-50 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-sm text-warm-500">Destination</p>
                        <p className="font-medium text-warm-800">{formData.destination}</p>
                      </div>
                      <div>
                        <p className="text-sm text-warm-500">Duration</p>
                        <p className="font-medium text-warm-800">{formData.duration} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-warm-500">Group Size</p>
                        <p className="font-medium text-warm-800">{formData.groupSize} people</p>
                      </div>
                      <div>
                        <p className="text-sm text-warm-500">Type</p>
                        <p className="font-medium text-warm-800 capitalize">{formData.visibility}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-warm-800">Estimated Cost Per Person</h4>
                      <span className="text-3xl font-bold text-teal-600">${quotation.totalEstimate.toLocaleString()}</span>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(quotation.breakdown).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-warm-600 capitalize">{key}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-2 bg-cream-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-teal-500 rounded-full"
                                style={{ width: `${(value / quotation.totalEstimate) * 100}%` }}
                              />
                            </div>
                            <span className="font-medium text-warm-800 w-20 text-right">${value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-cream-200 mt-4 pt-4 flex justify-between">
                      <span className="font-medium text-warm-800">Total Group Cost</span>
                      <span className="text-xl font-bold text-terra-600">${(quotation.totalEstimate * formData.groupSize).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* AI Suggestions */}
                  <div className="bg-teal-50 rounded-xl p-4">
                    <h4 className="font-medium text-teal-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" /> AI Suggestions
                    </h4>
                    <ul className="space-y-2">
                      {quotation.aiSuggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-teal-700">
                          <Check className="w-4 h-4 mt-0.5 shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(2)} className="btn btn-ghost flex items-center gap-2">
                    <ChevronLeft className="w-5 h-5" /> Adjust Options
                  </button>
                  <button onClick={() => setStep(4)} className="btn btn-primary flex items-center gap-2">
                    Get Agent Quotes <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Step 4: Agent Bids */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {!submittedToAgents ? (
              <div className="card p-6 text-center">
                <div className="w-20 h-20 bg-terra-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-terra-600" />
                </div>
                <h3 className="text-2xl font-display text-warm-900 mb-4">Send to Travel Agents</h3>
                <p className="text-warm-600 mb-6 max-w-lg mx-auto">
                  Submit your trip request to our network of verified travel agents.
                  They'll compete to offer you the best package at the best price.
                </p>

                <div className="bg-cream-50 rounded-xl p-4 mb-6 text-left max-w-md mx-auto">
                  <h4 className="font-medium text-warm-800 mb-3">Your trip will be sent to:</h4>
                  <div className="space-y-2">
                    {mockTravelAgents.map((agent, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-2xl">{agent.agentAvatar}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-warm-800">{agent.agentName}</p>
                          <p className="text-xs text-warm-500">{agent.specialties.join(', ')}</p>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm">{agent.agentRating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={submitToAgents} className="btn btn-secondary">
                  <Share2 className="w-5 h-5 mr-2" /> Submit to Agents
                </button>
              </div>
            ) : !showAgentBids ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 border-4 border-terra-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <h3 className="text-xl font-display text-warm-900 mb-2">Sending to Agents</h3>
                <p className="text-warm-600">Your trip request is being sent to our network...</p>
              </div>
            ) : (
              <>
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-display text-warm-900">Agent Responses</h3>
                    <span className="badge badge-teal">Request Sent!</span>
                  </div>

                  <div className="bg-teal-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Check className="w-6 h-6 text-teal-600" />
                      <div>
                        <p className="font-medium text-teal-800">Your trip request has been submitted!</p>
                        <p className="text-sm text-teal-600">Agents typically respond within 24-48 hours. You'll receive email notifications.</p>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-medium text-warm-800 mb-4">Agents Notified ({mockTravelAgents.length})</h4>
                  <div className="space-y-4">
                    {mockTravelAgents.map((agent, i) => (
                      <div key={i} className="bg-cream-50 rounded-xl p-4 flex items-center gap-4">
                        <span className="text-3xl">{agent.agentAvatar}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-warm-800">{agent.agentName}</p>
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm">{agent.agentRating}</span>
                            </div>
                          </div>
                          <p className="text-xs text-warm-500">{agent.responseTime}</p>
                          <div className="flex gap-1 mt-2">
                            {agent.specialties.map((spec, j) => (
                              <span key={j} className="text-xs bg-cream-200 text-warm-600 px-2 py-0.5 rounded-full">{spec}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="badge badge-cream">Pending</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trip Saved Confirmation */}
                <div className="card p-6 bg-gradient-to-r from-teal-50 to-purple-50 border-2 border-teal-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center">
                      <Check className="w-8 h-8 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-display font-semibold text-warm-900">Trip Saved!</h4>
                      <p className="text-warm-600">Your trip "{formData.title}" has been saved to Manage My Trips</p>
                    </div>
                  </div>
                  <p className="text-sm text-warm-500 mb-4">
                    You'll receive email notifications when agents respond with quotations.
                    Check your Manage My Trips dashboard to review bids and finalize booking.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="card p-6">
                  <h4 className="font-medium text-warm-800 mb-4">What would you like to do next?</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={onManageTrips}
                      className="p-4 rounded-xl border-2 border-teal-200 bg-teal-50 hover:bg-teal-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-teal-800">Manage My Trips</p>
                          <p className="text-xs text-teal-600">View all trips, quotes & bookings</p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        // Store the trip data for Digital Director
                        localStorage.setItem('currentTripForDirector', JSON.stringify({
                          ...formData,
                          quotation,
                          savedAt: new Date().toISOString()
                        }));
                        onSubmit();
                      }}
                      className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                          <Film className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-purple-800">Digital Director</p>
                          <p className="text-xs text-purple-600">Create your trip film preview</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(3)} className="btn btn-ghost flex items-center gap-2">
                    <ChevronLeft className="w-5 h-5" /> Back to Quotation
                  </button>
                  <button onClick={onSubmit} className="btn btn-outline flex items-center gap-2">
                    Browse More Trips <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ============ MANAGE TRIPS SCREEN ============
function ManageTripsScreen({ onBack, onViewTrip }: { onBack: () => void; onViewTrip: (trip: Trip) => void }) {
  // Load saved trips from localStorage
  const [savedTrips, setSavedTrips] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed'>('all');

  useEffect(() => {
    const stored = localStorage.getItem('storyTrip_savedTrips');
    if (stored) {
      setSavedTrips(JSON.parse(stored));
    }
  }, []);

  const filteredTrips = savedTrips.filter(trip => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return trip.status === 'pending' || !trip.status;
    if (activeTab === 'confirmed') return trip.status === 'confirmed';
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-cream-50 via-cream-100 to-teal-50"
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm p-4 flex items-center justify-between border-b border-cream-200 shadow-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-warm-600 hover:text-warm-900 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-100 rounded-xl flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-lg font-display font-bold text-warm-900">Manage My Trips</span>
        </div>
        <div className="w-20" />
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'all', label: 'All Trips', icon: Globe },
            { id: 'pending', label: 'Pending Quotes', icon: Clock },
            { id: 'confirmed', label: 'Confirmed', icon: Check },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-white text-warm-600 hover:bg-cream-100 border border-cream-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Trip Cards */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-warm-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-warm-700 mb-2">No Trips Yet</h3>
            <p className="text-warm-500 mb-6">Create your first trip to see it here!</p>
            <button
              onClick={onBack}
              className="btn bg-gradient-to-r from-teal-500 to-teal-600 text-white"
            >
              Create a Trip
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
              >
                {/* Trip Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={trip.highlights?.[0]?.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-900/60 to-transparent" />

                  {/* Status Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                    trip.status === 'confirmed'
                      ? 'bg-green-500 text-white'
                      : trip.quotations?.length > 0
                        ? 'bg-amber-500 text-white'
                        : 'bg-blue-500 text-white'
                  }`}>
                    {trip.status === 'confirmed' ? 'Confirmed' : trip.quotations?.length > 0 ? `${trip.quotations.length} Quotes` : 'Pending'}
                  </div>

                  {/* Category */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-white/90 rounded-lg text-xs font-medium text-warm-700">
                      {trip.category === 'sports' ? '🏆' : trip.category === 'adventure' ? '🏔️' : trip.category === 'wellness' ? '🧘' : trip.category === 'cultural' ? '🏛️' : trip.category === 'romantic' ? '💕' : '👨‍👩‍👧‍👦'} {trip.category}
                    </span>
                  </div>
                </div>

                {/* Trip Info */}
                <div className="p-4">
                  <h3 className="font-display font-semibold text-warm-900 mb-2 line-clamp-1">{trip.title}</h3>

                  <div className="flex items-center gap-4 text-sm text-warm-600 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {trip.destination}
                    </span>
                    {trip.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {trip.duration} days
                      </span>
                    )}
                  </div>

                  {/* Quotations Preview */}
                  {trip.quotations && trip.quotations.length > 0 && (
                    <div className="bg-amber-50 rounded-lg p-2 mb-3">
                      <p className="text-xs text-amber-700 font-medium">
                        Best Quote: ${trip.quotations[0]?.price?.toLocaleString() || 'TBD'}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        // Convert saved trip to Trip format for viewing
                        const tripData: Trip = {
                          id: `saved-${index}`,
                          title: trip.title,
                          host: 'You',
                          location: trip.destination || 'Various',
                          dates: trip.dates || 'Flexible',
                          duration: trip.duration ? `${trip.duration} days` : '7 days',
                          price: trip.budget || 'TBD',
                          image: trip.highlights?.[0]?.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
                          narrative: 'discovery',
                          tags: [trip.category || 'adventure'],
                          storyBeats: trip.highlights?.map((h: any, i: number) => ({
                            day: i + 1,
                            title: h.title || `Day ${i + 1}`,
                            description: h.description || '',
                            location: trip.destination || 'Various'
                          })) || [],
                          nearbyAttractions: [],
                          localTips: [],
                          rating: 4.8,
                          source: 'user-created',
                          creatorName: 'You',
                        };
                        onViewTrip(tripData);
                      }}
                      className="flex-1 btn btn-primary text-sm py-2"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============ NARRATIVE SCREEN ============
function NarrativeScreen({ narratives, onSelect, onBack }: {
  narratives: Narrative[];
  onSelect: (n: Narrative) => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen py-8 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-warm-600 hover:text-teal-600 mb-8">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>

        <div className="text-center mb-12">
          <p className="text-teal-600 font-medium tracking-widest uppercase mb-2">Step 1 of 4</p>
          <h1 className="text-4xl md:text-5xl font-display text-warm-900 mb-4">
            Choose Your <span className="text-teal-600">Narrative</span>
          </h1>
          <p className="text-lg text-warm-600 max-w-2xl mx-auto">
            Every great journey follows a story arc. What transformation are you seeking?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {narratives.map((narrative, index) => (
            <motion.div
              key={narrative.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(narrative)}
              className="card card-hover cursor-pointer overflow-hidden group"
            >
              <div className={`h-3 bg-gradient-to-r ${narrative.gradient}`} />
              <div className="p-8">
                <span className="text-5xl mb-4 block">{narrative.icon}</span>
                <h3 className="text-2xl font-display font-semibold text-warm-900 mb-2">{narrative.name}</h3>
                <p className="text-terra-500 font-medium mb-3">{narrative.tagline}</p>
                <p className="text-warm-600">{narrative.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============ TRIPS SCREEN ============
function TripsScreen({ trips, narrative, userProfile, onSelect, onBack }: {
  trips: Trip[];
  narrative: Narrative | null;
  userProfile: UserProfile;
  onSelect: (t: Trip) => void;
  onBack: () => void;
}) {
  // Calculate match percentage between user interests and trip
  const calculateTripMatch = (trip: Trip): number => {
    let matchScore = 0;
    let totalFactors = 0;

    // Sport category match (highest weight)
    if (trip.sportCategory) {
      totalFactors += 40;
      if (userProfile.interests.includes(trip.sportCategory as InterestCategory)) {
        matchScore += 40;
      }
    }

    // Tag matching
    const interestTags = userProfile.interests.map(i =>
      interestCategories.find(c => c.id === i)?.name.toLowerCase() || ''
    );
    trip.tags.forEach(tag => {
      totalFactors += 10;
      if (interestTags.some(interest => tag.toLowerCase().includes(interest) || interest.includes(tag.toLowerCase()))) {
        matchScore += 10;
      }
    });

    // Narrative type match based on relationship status
    if (trip.narrative === 'bonding' && userProfile.groupPreference !== 'solo') {
      matchScore += 10;
      totalFactors += 10;
    }
    if (trip.narrative === 'discovery' && userProfile.groupPreference === 'solo') {
      matchScore += 10;
      totalFactors += 10;
    }

    return totalFactors > 0 ? Math.round((matchScore / totalFactors) * 100) : 50;
  };

  // Calculate compatibility between user and a traveler
  const calculateTravelerMatch = (traveler: SignedUpTraveler): number => {
    let matchScore = 0;
    let totalFactors = 0;

    // Shared interests (highest weight)
    const sharedInterests = traveler.interests.filter(i =>
      userProfile.interests.includes(i as InterestCategory)
    );
    totalFactors += 40;
    matchScore += (sharedInterests.length / Math.max(traveler.interests.length, 1)) * 40;

    // Personality compatibility (if both have it)
    if (userProfile.personality && traveler.personality) {
      totalFactors += 20;
      // Simple compatibility: same first letter (I/E match) or complementary
      if (userProfile.personality[0] === traveler.personality[0]) {
        matchScore += 15;
      }
      if (userProfile.personality[1] === traveler.personality[1]) {
        matchScore += 5;
      }
    }

    // Relationship status compatibility
    totalFactors += 20;
    if (userProfile.relationshipStatus === traveler.relationshipStatus) {
      matchScore += 20;
    } else if (
      (userProfile.relationshipStatus === 'single' && traveler.relationshipStatus === 'looking') ||
      (userProfile.relationshipStatus === 'looking' && traveler.relationshipStatus === 'single')
    ) {
      matchScore += 15;
    }

    // Group preference match
    totalFactors += 20;
    matchScore += 10; // Base compatibility

    return totalFactors > 0 ? Math.round((matchScore / totalFactors) * 100) : 50;
  };

  const getMatchColor = (match: number) => {
    if (match >= 80) return 'text-green-600 bg-green-100';
    if (match >= 60) return 'text-teal-600 bg-teal-100';
    if (match >= 40) return 'text-amber-600 bg-amber-100';
    return 'text-warm-500 bg-warm-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen py-8 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-warm-600 hover:text-teal-600 mb-8">
          <ChevronLeft className="w-5 h-5" /> Change Narrative
        </button>

        <div className="text-center mb-8">
          <p className="text-teal-600 font-medium tracking-widest uppercase mb-2">Step 2 of 4</p>
          <h1 className="text-4xl md:text-5xl font-display text-warm-900 mb-4">
            Find Your <span className="text-teal-600">Adventure</span>
          </h1>
          {narrative && (
            <div className="inline-flex items-center gap-2 bg-cream-200 px-4 py-2 rounded-full">
              <span>{narrative.icon}</span>
              <span className="font-medium text-warm-700">{narrative.name}</span>
            </div>
          )}
        </div>

        {/* Profile Completeness Hint */}
        {(() => {
          // Calculate profile completeness
          let completed = 0;
          const total = 8;
          if (userProfile.name?.trim()) completed++;
          if (userProfile.gender) completed++;
          if (userProfile.nationality) completed++;
          if (userProfile.interests.length > 0) completed++;
          if (userProfile.relationshipStatus) completed++;
          if (userProfile.personality) completed++;
          if (userProfile.groupPreference) completed++;
          if (userProfile.travelDates?.duration) completed++;
          const percentage = Math.round((completed / total) * 100);

          return percentage < 100 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 mb-4 border border-amber-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-amber-800">Want better recommendations?</p>
                  <p className="text-sm text-amber-600">
                    Your profile is {percentage}% complete. The more we know about you, the better we can match you with perfect trips!
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm font-medium text-amber-700">{percentage}%</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* User Profile Summary */}
        {userProfile.name && (
          <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-2xl p-4 mb-8 border border-teal-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-warm-900">{userProfile.name}'s Matches</p>
                  <p className="text-sm text-warm-600">Based on your {userProfile.interests.length} interests</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {userProfile.interests.slice(0, 5).map(i => {
                  const interest = interestCategories.find(c => c.id === i);
                  return (
                    <span key={i} className="px-2 py-1 bg-white rounded-full text-xs text-warm-600 border border-teal-200">
                      {interest?.icon} {interest?.name}
                    </span>
                  );
                })}
                {userProfile.interests.length > 5 && (
                  <span className="px-2 py-1 bg-white rounded-full text-xs text-warm-600 border border-teal-200">
                    +{userProfile.interests.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...trips].sort((a, b) => (b.rating || 0) - (a.rating || 0)).map((trip, index) => {
            const tripMatch = calculateTripMatch(trip);
            const topTravelers = trip.signedUpTravelers?.slice(0, 3).map(t => ({
              ...t,
              compatibility: calculateTravelerMatch(t)
            })).sort((a, b) => b.compatibility - a.compatibility) || [];

            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelect(trip)}
                className="card card-hover cursor-pointer overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white/80 text-sm">{trip.host}</p>
                    <h3 className="text-white text-xl font-display font-semibold">{trip.title}</h3>
                  </div>
                  {/* Match Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full flex items-center gap-1 font-bold ${getMatchColor(tripMatch)}`}>
                    <Sparkles className="w-4 h-4" />
                    <span>{tripMatch}% Match</span>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {/* Source Badge */}
                    {trip.source === 'user-created' ? (
                      <div className="bg-purple-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-white text-xs">
                        <Users className="w-3 h-3" />
                        <span>By {trip.creatorName || 'Traveler'}</span>
                      </div>
                    ) : (
                      <div className="bg-teal-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-white text-xs">
                        <Award className="w-3 h-3" />
                        <span>Curated</span>
                      </div>
                    )}
                    {trip.isOpenForSignup && (
                      <div className="bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-white text-xs">
                        <UserPlus className="w-3 h-3" />
                        <span>Open</span>
                      </div>
                    )}
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 text-terra-500 fill-terra-500" />
                      <span className="text-xs font-medium">{trip.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 text-warm-500 text-sm mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {trip.location.split(',')[0]}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {trip.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {trip.tags.map(tag => <span key={tag} className="badge badge-teal">{tag}</span>)}
                  </div>

                  {/* Signed Up Travelers */}
                  {trip.signedUpTravelers && trip.signedUpTravelers.length > 0 && (
                    <div className="mb-4 p-3 bg-cream-50 rounded-xl border border-cream-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-warm-600 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {trip.signedUpTravelers.length} travelers signed up
                        </span>
                        {trip.spotsLeft && (
                          <span className="text-xs text-terra-600 font-medium">
                            {trip.spotsLeft} spots left
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {topTravelers.map((traveler, i) => (
                            <div key={traveler.id} className="relative" style={{ zIndex: 3 - i }}>
                              <img
                                src={traveler.avatar}
                                alt={traveler.name}
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                              />
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center ${getMatchColor(traveler.compatibility)}`}>
                                {traveler.compatibility}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-warm-700 truncate">
                            <span className="font-medium">{topTravelers[0]?.name}</span>
                            {topTravelers.length > 1 && ` +${topTravelers.length - 1} more`}
                          </p>
                          <p className="text-[10px] text-warm-500">
                            {topTravelers[0]?.compatibility}% compatible with you
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-cream-200">
                    <span className="text-warm-500 text-sm">From</span>
                    <span className="text-2xl font-display font-semibold text-teal-700">{trip.price}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ============ TRIP DETAIL SCREEN ============
function TripDetailScreen({ trip, onContinue, onBack }: {
  trip: Trip;
  onContinue: () => void;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'story' | 'nearby' | 'tips'>('story');

  const getAttractionIcon = (type: string) => {
    switch(type) {
      case 'restaurant': return <Utensils className="w-4 h-4" />;
      case 'landmark': return <Landmark className="w-4 h-4" />;
      case 'activity': return <Zap className="w-4 h-4" />;
      case 'shopping': return <ShoppingBag className="w-4 h-4" />;
      case 'nature': return <TreePine className="w-4 h-4" />;
      case 'nightlife': return <Wine className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen py-8 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-warm-600 hover:text-teal-600 mb-8">
          <ChevronLeft className="w-5 h-5" /> Back to trips
        </button>

        {/* Hero */}
        <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden mb-8 shadow-cozy-lg">
          <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-white/80">Hosted by {trip.host}</p>
              {trip.sportCategory && (
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm flex items-center gap-1">
                  {sportCategories.find(s => s.id === trip.sportCategory)?.icon}
                  {sportCategories.find(s => s.id === trip.sportCategory)?.name}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">{trip.title}</h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {trip.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {trip.dates}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {trip.duration}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'story', label: 'Story Arc', icon: <Film className="w-4 h-4" /> },
            { id: 'nearby', label: 'Nearby Attractions', icon: <MapPin className="w-4 h-4" /> },
            { id: 'tips', label: 'Local Tips', icon: <Sparkles className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Story Arc Tab */}
        {activeTab === 'story' && (
          <div className="card p-8 mb-8">
            <h2 className="text-2xl font-display text-warm-900 mb-6 flex items-center gap-3">
              <Film className="w-6 h-6 text-teal-600" />
              Your Story Arc
            </h2>
            <div className="relative">
              <div className="flex items-end justify-between h-32 mb-4">
                {trip.storyBeats.map((beat, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-full max-w-[40px] rounded-t-lg ${
                        beat.mood === 'peak' ? 'bg-terra-500 h-full' :
                        beat.mood === 'rising' ? 'bg-teal-400' : 'bg-teal-300'
                      }`}
                      style={{ height: beat.mood === 'peak' ? '100%' : beat.mood === 'rising' ? `${40 + i * 15}%` : `${100 - (i - 4) * 15}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-warm-500">
                {trip.storyBeats.map((beat, i) => (
                  <div key={i} className="flex-1 text-center px-1">
                    <p className="font-medium text-warm-700">Day {beat.day}</p>
                    <p className="truncate">{beat.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Nearby Attractions Tab */}
        {activeTab === 'nearby' && (
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-display text-warm-900 mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-teal-600" />
              What to See Nearby
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {trip.nearbyAttractions.map((attraction, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-cream-50 rounded-2xl overflow-hidden border border-cream-200 hover:border-teal-300 transition-all group"
                >
                  <div className="relative h-32">
                    <img src={attraction.image} alt={attraction.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-xs">
                      {getAttractionIcon(attraction.type)}
                      <span className="capitalize">{attraction.type}</span>
                    </div>
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 text-terra-500 fill-terra-500" />
                      {attraction.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-warm-800 mb-1">{attraction.name}</h3>
                    <p className="text-sm text-warm-500 mb-2 flex items-center gap-1">
                      <Car className="w-3 h-3" /> {attraction.distance}
                    </p>
                    <p className="text-sm text-warm-600 mb-2">{attraction.description}</p>
                    {attraction.mustTry && (
                      <p className="text-sm bg-teal-50 text-teal-700 px-2 py-1 rounded-lg inline-block">
                        <span className="font-medium">Must try:</span> {attraction.mustTry}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Local Tips Tab */}
        {activeTab === 'tips' && (
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-display text-warm-900 mb-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-teal-600" />
              Local Insider Tips
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {trip.localTips.map((tipCategory, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-cream-50 rounded-2xl p-5 border border-cream-200"
                >
                  <h3 className="flex items-center gap-2 font-semibold text-warm-800 mb-3">
                    <span className="text-2xl">{tipCategory.icon}</span>
                    {tipCategory.category}
                  </h3>
                  <ul className="space-y-2">
                    {tipCategory.items.map((item, j) => (
                      <li key={j} className="text-sm text-warm-600 flex items-start gap-2">
                        <Check className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between bg-teal-50 rounded-3xl p-6 border-2 border-teal-200">
          <div>
            <p className="text-warm-600 mb-1">Starting from</p>
            <p className="text-3xl font-display font-bold text-teal-700">{trip.price}</p>
            <p className="text-sm text-warm-500">per person, all inclusive</p>
          </div>
          <button onClick={onContinue} className="btn btn-primary flex items-center gap-2">
            <Users className="w-5 h-5" />
            Find Your Squad
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============ SQUAD SCREEN ============
function SquadScreen({ trip, squads, selectedSquad, onSelect, onContinue, onBack }: {
  trip: Trip;
  squads: Squad[];
  selectedSquad: Squad | null;
  onSelect: (s: Squad) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const [selectedSports, setSelectedSports] = useState<SportCategory[]>([]);
  const [selectedNationalities, setSelectedNationalities] = useState<Nationality[]>([]);
  const [selectedRelationships, setSelectedRelationships] = useState<RelationshipStatus[]>([]);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [expandedFilter, setExpandedFilter] = useState<'sports' | 'nationality' | 'relationship' | null>('sports');

  // Toggle functions for multi-select
  const toggleSport = (sport: SportCategory) => {
    setSelectedSports(prev =>
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  };

  const toggleNationality = (nat: Nationality) => {
    setSelectedNationalities(prev =>
      prev.includes(nat) ? prev.filter(n => n !== nat) : [...prev, nat]
    );
  };

  const toggleRelationship = (rel: RelationshipStatus) => {
    setSelectedRelationships(prev =>
      prev.includes(rel) ? prev.filter(r => r !== rel) : [...prev, rel]
    );
  };

  // Filter squads by all selected criteria
  const filteredSquads = squads.filter(squad => {
    // Sport filter
    const sportMatch = selectedSports.length === 0 ||
      selectedSports.some(sport => squad.sportInterests.includes(sport));

    // Nationality filter - check if any squad member matches
    const nationalityMatch = selectedNationalities.length === 0 ||
      squad.members.some(member => selectedNationalities.includes(member.nationality));

    // Relationship filter - check if any squad member matches
    const relationshipMatch = selectedRelationships.length === 0 ||
      squad.members.some(member => selectedRelationships.includes(member.relationshipStatus));

    return sportMatch && nationalityMatch && relationshipMatch;
  });

  // Get relevant sports for this trip
  const relevantSports = trip.sportCategory
    ? sportCategories.filter(s => s.id === trip.sportCategory || ['nba', 'mlb', 'nfl', 'nhl', 'fifa', 'golf', 'tennis', 'f1', 'skiing', 'surfing'].includes(s.id))
    : sportCategories;

  // Active filter count
  const activeFilterCount = selectedSports.length + selectedNationalities.length + selectedRelationships.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen py-8 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-warm-600 hover:text-teal-600 mb-8">
          <ChevronLeft className="w-5 h-5" /> Back to trip details
        </button>

        <div className="text-center mb-8">
          <p className="text-teal-600 font-medium tracking-widest uppercase mb-2">Step 3 of 4</p>
          <h1 className="text-4xl md:text-5xl font-display text-warm-900 mb-4">
            Find Your <span className="text-teal-600">Squad</span>
          </h1>
          <p className="text-lg text-warm-600">Join travelers who match your vibe for {trip.title}</p>
        </div>

        {/* Multi-Select Filters */}
        <div className="card p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-teal-600" />
              <span className="font-medium text-warm-800">Filter Your Squad</span>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setSelectedSports([]);
                  setSelectedNationalities([]);
                  setSelectedRelationships([]);
                }}
                className="text-sm text-terra-600 hover:text-terra-700"
              >
                Clear all ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 border-b border-cream-200 pb-3">
            <button
              onClick={() => setExpandedFilter(expandedFilter === 'sports' ? null : 'sports')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                expandedFilter === 'sports' ? 'bg-teal-600 text-white' : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
              }`}
            >
              🏆 Sports {selectedSports.length > 0 && <span className="bg-white/20 px-1.5 rounded-full">{selectedSports.length}</span>}
            </button>
            <button
              onClick={() => setExpandedFilter(expandedFilter === 'nationality' ? null : 'nationality')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                expandedFilter === 'nationality' ? 'bg-teal-600 text-white' : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
              }`}
            >
              🌍 Nationality {selectedNationalities.length > 0 && <span className="bg-white/20 px-1.5 rounded-full">{selectedNationalities.length}</span>}
            </button>
            <button
              onClick={() => setExpandedFilter(expandedFilter === 'relationship' ? null : 'relationship')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                expandedFilter === 'relationship' ? 'bg-teal-600 text-white' : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
              }`}
            >
              💑 Status {selectedRelationships.length > 0 && <span className="bg-white/20 px-1.5 rounded-full">{selectedRelationships.length}</span>}
            </button>
          </div>

          {/* Sport Filter Options */}
          <AnimatePresence>
            {expandedFilter === 'sports' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs text-warm-500 mb-2">Select multiple sports to find fans who share your interests</p>
                <div className="flex flex-wrap gap-2">
                  {relevantSports.map(sport => (
                    <button
                      key={sport.id}
                      onClick={() => toggleSport(sport.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                        selectedSports.includes(sport.id)
                          ? 'bg-teal-600 text-white'
                          : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
                      }`}
                    >
                      <span>{sport.icon}</span>
                      {sport.name.split(' / ')[0]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Nationality Filter Options */}
            {expandedFilter === 'nationality' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs text-warm-500 mb-2">Connect with travelers from specific countries</p>
                <div className="flex flex-wrap gap-2">
                  {nationalities.map(nat => (
                    <button
                      key={nat.id}
                      onClick={() => toggleNationality(nat.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                        selectedNationalities.includes(nat.id)
                          ? 'bg-teal-600 text-white'
                          : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
                      }`}
                    >
                      <span>{nat.flag}</span>
                      {nat.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Relationship Status Filter Options */}
            {expandedFilter === 'relationship' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-xs text-warm-500 mb-2">Find squads that match your travel situation</p>
                <div className="flex flex-wrap gap-2">
                  {relationshipStatuses.map(rel => (
                    <button
                      key={rel.id}
                      onClick={() => toggleRelationship(rel.id)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedRelationships.includes(rel.id)
                          ? 'bg-teal-600 text-white'
                          : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
                      }`}
                    >
                      <span className="text-lg">{rel.icon}</span>
                      <div className="text-left">
                        <div>{rel.name}</div>
                        <div className={`text-xs ${selectedRelationships.includes(rel.id) ? 'text-teal-100' : 'text-warm-400'}`}>
                          {rel.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div className="mt-4 pt-3 border-t border-cream-200">
              <p className="text-xs text-warm-500 mb-2">Active filters:</p>
              <div className="flex flex-wrap gap-1">
                {selectedSports.map(sportId => {
                  const sport = sportCategories.find(s => s.id === sportId);
                  return sport && (
                    <span key={sportId} className="inline-flex items-center gap-1 bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full text-xs">
                      {sport.icon} {sport.name.split(' / ')[0]}
                      <button onClick={() => toggleSport(sportId)} className="hover:text-teal-900">×</button>
                    </span>
                  );
                })}
                {selectedNationalities.map(natId => {
                  const nat = nationalities.find(n => n.id === natId);
                  return nat && (
                    <span key={natId} className="inline-flex items-center gap-1 bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full text-xs">
                      {nat.flag} {nat.name}
                      <button onClick={() => toggleNationality(natId)} className="hover:text-teal-900">×</button>
                    </span>
                  );
                })}
                {selectedRelationships.map(relId => {
                  const rel = relationshipStatuses.find(r => r.id === relId);
                  return rel && (
                    <span key={relId} className="inline-flex items-center gap-1 bg-terra-100 text-terra-700 px-2 py-0.5 rounded-full text-xs">
                      {rel.icon} {rel.name}
                      <button onClick={() => toggleRelationship(relId)} className="hover:text-terra-900">×</button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 mb-8">
          {filteredSquads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-warm-500">No squads match this filter. Try another sport interest.</p>
            </div>
          ) : (
            filteredSquads.map((squad, index) => (
              <motion.div
                key={squad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedSquad?.id === squad.id ? 'ring-2 ring-teal-500 ring-offset-4' : 'hover:shadow-xl'
                }`}
              >
                <div className="p-6" onClick={() => onSelect(squad)}>
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-cream-100 rounded-2xl flex items-center justify-center text-4xl shrink-0">
                      {squad.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-display font-semibold text-warm-900">{squad.name}</h3>
                          <span className="badge badge-terra">{squad.vibe}</span>
                        </div>
                        {/* Compatibility Ring */}
                        <div className="text-center">
                          <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 -rotate-90">
                              <circle cx="32" cy="32" r="28" fill="none" stroke="#FAF3E6" strokeWidth="6" />
                              <circle cx="32" cy="32" r="28" fill="none"
                                stroke={squad.compatibility >= 90 ? '#2D9D8F' : squad.compatibility >= 80 ? '#E8734D' : '#B5B1A8'}
                                strokeWidth="6" strokeDasharray={`${squad.compatibility * 1.76} 176`} strokeLinecap="round"
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-warm-800">
                              {squad.compatibility}%
                            </span>
                          </div>
                          <p className="text-xs text-warm-500 mt-1">Match</p>
                        </div>
                      </div>
                      <p className="text-warm-600 mb-3">{squad.description}</p>

                      {/* Squad Sport Interests */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {squad.sportInterests.map(sportId => {
                          const sport = sportCategories.find(s => s.id === sportId);
                          return sport ? (
                            <span key={sportId} className="inline-flex items-center gap-1 bg-cream-100 text-warm-600 px-2 py-0.5 rounded-full text-xs">
                              {sport.icon} {sport.name.split(' / ')[0]}
                            </span>
                          ) : null;
                        })}
                      </div>

                      {/* Members Preview */}
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {squad.members.slice(0, 5).map((member, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full bg-cream-200 border-2 border-white flex items-center justify-center text-sm cursor-pointer hover:z-10 hover:scale-110 transition-transform"
                              title={`${member.name} from ${member.from}`}
                              onClick={(e) => { e.stopPropagation(); setExpandedMember(expandedMember === `${squad.id}-${i}` ? null : `${squad.id}-${i}`); }}
                            >
                              {member.avatar}
                            </div>
                          ))}
                          {squad.members.length > 5 && (
                            <div className="w-8 h-8 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-xs font-medium text-teal-700">
                              +{squad.members.length - 5}
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-warm-500">{squad.members.length}/{squad.maxMembers} members</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Member Profiles */}
                {selectedSquad?.id === squad.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-cream-200 bg-cream-50 p-6"
                  >
                    <h4 className="font-semibold text-warm-800 mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Meet Your Squad
                    </h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {squad.members.map((member, i) => {
                        const memberNat = nationalities.find(n => n.id === member.nationality);
                        const memberRel = relationshipStatuses.find(r => r.id === member.relationshipStatus);
                        return (
                          <div key={i} className="bg-white rounded-xl p-4 border border-cream-200">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{member.avatar}</span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-warm-800">{member.name}</p>
                                  {memberNat && <span title={memberNat.name}>{memberNat.flag}</span>}
                                </div>
                                <p className="text-xs text-warm-500">{member.from}{member.age ? `, ${member.age}` : ''}</p>
                              </div>
                            </div>
                            {/* Relationship Status Badge */}
                            {memberRel && (
                              <div className="flex items-center gap-1 mb-2">
                                <span className="text-sm">{memberRel.icon}</span>
                                <span className="text-xs text-warm-600">{memberRel.name}</span>
                              </div>
                            )}
                            {member.bio && (
                              <p className="text-sm text-warm-600 mb-2">{member.bio}</p>
                            )}
                            {member.travelStyle && (
                              <p className="text-xs text-teal-600 mb-2">✨ {member.travelStyle}</p>
                            )}
                            <div className="flex flex-wrap gap-1">
                              {member.sportInterests.slice(0, 3).map(sportId => {
                                const sport = sportCategories.find(s => s.id === sportId);
                                return sport ? (
                                  <span key={sportId} className="text-xs bg-cream-100 px-1.5 py-0.5 rounded">
                                    {sport.icon}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onContinue}
            disabled={!selectedSquad}
            className={`btn flex items-center gap-2 ${selectedSquad ? 'btn-primary' : 'bg-cream-300 text-warm-400 cursor-not-allowed'}`}
          >
            Continue with {selectedSquad?.name || 'Selected Squad'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============ ITINERARY SCREEN ============
function ItineraryScreen({ trip, squad, onStartTrip, onBack }: {
  trip: Trip;
  squad: Squad;
  onStartTrip: () => void;
  onBack: () => void;
}) {
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen py-8 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-warm-600 hover:text-teal-600 mb-8">
          <ChevronLeft className="w-5 h-5" /> Back to squad
        </button>

        <div className="text-center mb-12">
          <p className="text-teal-600 font-medium tracking-widest uppercase mb-2">Step 4 of 4</p>
          <h1 className="text-4xl md:text-5xl font-display text-warm-900 mb-4">
            Your <span className="text-teal-600">Story Awaits</span>
          </h1>
          <div className="inline-flex items-center gap-3 bg-cream-200 px-4 py-2 rounded-full">
            <span className="text-2xl">{squad.avatar}</span>
            <span className="font-medium text-warm-700">Joining {squad.name}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 mb-12">
          {/* Trip Summary */}
          <div className="space-y-4">
            <div className="card p-6">
              <img src={trip.image} alt={trip.title} className="w-full h-40 object-cover rounded-xl mb-4" />
              <h3 className="text-xl font-display font-semibold text-warm-900 mb-2">{trip.title}</h3>
              <p className="text-warm-600 text-sm mb-4">{trip.location}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-warm-500">Dates</span><span className="font-medium">{trip.dates}</span></div>
                <div className="flex justify-between"><span className="text-warm-500">Duration</span><span className="font-medium">{trip.duration}</span></div>
                <div className="flex justify-between"><span className="text-warm-500">Squad</span><span className="font-medium">{squad.name}</span></div>
                <div className="flex justify-between"><span className="text-warm-500">Price</span><span className="font-medium text-teal-700">{trip.price}</span></div>
              </div>
            </div>

            {/* Quick Local Tips */}
            {trip.localTips.length > 0 && (
              <div className="card p-4 bg-cream-50">
                <h4 className="font-semibold text-warm-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" /> Quick Tips
                </h4>
                <div className="space-y-2">
                  {trip.localTips.slice(0, 2).map((tip, i) => (
                    <div key={i} className="text-sm">
                      <span className="text-lg mr-2">{tip.icon}</span>
                      <span className="font-medium text-warm-700">{tip.category}:</span>
                      <span className="text-warm-600 ml-1">{tip.items[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Day by Day */}
          <div className="space-y-4">
            {trip.storyBeats.map((beat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`card overflow-hidden ${beat.mood === 'peak' ? 'ring-2 ring-terra-400' : ''}`}
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0 ${
                      beat.mood === 'peak' ? 'bg-terra-500' : beat.mood === 'rising' ? 'bg-teal-500' : 'bg-teal-400'
                    }`}>
                      {beat.day}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-display font-semibold text-warm-900">{beat.title}</h4>
                        {beat.mood === 'peak' && <span className="badge badge-terra text-xs">Climax</span>}
                      </div>
                      <p className="text-warm-500 text-xs mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {beat.location}
                      </p>
                      <p className="text-warm-600 text-sm mb-2">{beat.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {beat.activities.map((act, j) => (
                          <span key={j} className="text-xs bg-cream-100 text-warm-600 px-2 py-1 rounded">{act}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-warm-400 transition-transform ${expandedDay === i ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded Local Spots */}
                {expandedDay === i && beat.localSpots && beat.localSpots.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-cream-200 bg-cream-50 p-4"
                  >
                    <h5 className="text-sm font-semibold text-warm-700 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-600" /> Local Spots to Explore
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {beat.localSpots.map((spot, j) => (
                        <span key={j} className="bg-white text-warm-700 px-3 py-1.5 rounded-lg text-sm border border-cream-200 flex items-center gap-1">
                          <Star className="w-3 h-3 text-terra-500" />
                          {spot}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <AnimatePresence mode="wait">
          {!bookedSuccess ? (
            <motion.div key="book" className="card p-8 text-center">
              <h3 className="text-2xl font-display font-semibold text-warm-900 mb-2">Ready to Write Your Story?</h3>
              <p className="text-warm-600 mb-6">Book now and {trip.host} will confirm within 24 hours</p>
              <button onClick={() => setBookedSuccess(true)} className="btn btn-primary text-lg px-12">
                <Sparkles className="w-5 h-5 mr-2 inline" />
                Book This Trip • {trip.price}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 text-center bg-gradient-to-br from-teal-50 to-cream-50"
            >
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-teal-600" />
              </div>
              <h3 className="text-2xl font-display font-semibold text-teal-700 mb-2">Trip Booked!</h3>
              <p className="text-warm-600 mb-6">{trip.host} will confirm your spot within 24 hours</p>
              <button onClick={onStartTrip} className="btn btn-secondary">
                <Film className="w-5 h-5 mr-2 inline" />
                Open Memory Maker
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============ MEMORY MAKER SCREEN ============
function MemoryMakerScreen({ trip, squad, uploadedFiles, onUpload, onOpenStudio, onBack }: {
  trip: Trip;
  squad: Squad;
  uploadedFiles: string[];
  onUpload: (files: string[]) => void;
  onOpenStudio: () => void;
  onBack: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'shots' | 'group' | 'social' | 'settings'>('shots');
  const [groupUploads, setGroupUploads] = useState<GroupUpload[]>(mockGroupUploads);
  const [photoCount, setPhotoCount] = useState<number>(25);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('video-30');
  const [connectedServices, setConnectedServices] = useState<PhotoSource[]>(['device']);

  // Social features state
  const [groupMembers, setGroupMembers] = useState(squad.members.map((m, i) => ({
    ...m,
    id: `member-${i}`,
    isAdmin: i === 0,
    joinedAt: 'Dec 2024',
    status: 'active' as 'active' | 'pending' | 'offline'
  })));
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: squad.members[0]?.name || 'You', message: 'Hey everyone! Excited for this trip!', time: '2 hours ago', avatar: squad.members[0]?.avatar || '👤' },
    { id: '2', sender: squad.members[1]?.name || 'Alex', message: 'Same here! Anyone arriving on Saturday?', time: '1 hour ago', avatar: squad.members[1]?.avatar || '👤' },
    { id: '3', sender: squad.members[2]?.name || 'Jordan', message: 'I land at 3pm!', time: '45 min ago', avatar: squad.members[2]?.avatar || '👤' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [privateMessageTo, setPrivateMessageTo] = useState<string | null>(null);

  // Generate trip-specific shot prompts
  const shotPrompts = generateShotPrompts(trip);

  // Get sport info for display
  const sportInfo = trip.sportCategory ? sportCategories.find(s => s.id === trip.sportCategory) : null;

  const togglePhotoSelection = (id: string) => {
    setGroupUploads(prev => prev.map(u =>
      u.id === id ? { ...u, selected: !u.selected } : u
    ));
  };

  const selectedCount = groupUploads.filter(u => u.selected).length;

  const connectService = (service: PhotoSource) => {
    if (connectedServices.includes(service)) {
      setConnectedServices(prev => prev.filter(s => s !== service));
    } else {
      setConnectedServices(prev => [...prev, service]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen py-8 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-warm-600 hover:text-teal-600 mb-8">
          <ChevronLeft className="w-5 h-5" /> Back to itinerary
        </button>

        {/* Trip-Specific Header */}
        <div className="text-center mb-8">
          <span className="badge badge-terra mb-4 inline-flex items-center gap-2">
            <Camera className="w-4 h-4" /> {trip.title} - Trip Mode Active
          </span>
          <h1 className="text-4xl md:text-5xl font-display text-warm-900 mb-4">
            Your Digital <span className="text-terra-500">Director</span>
          </h1>
          <p className="text-lg text-warm-600 max-w-2xl mx-auto">
            {sportInfo ? (
              <>Capture your {sportInfo.icon} {sportInfo.name.split(' / ')[0]} adventure in {trip.location}</>
            ) : (
              <>Capture the moments from {trip.location}. We'll turn them into your film.</>
            )}
          </p>
        </div>

        {/* Squad Info Banner */}
        <div className="card p-4 mb-6 bg-gradient-to-r from-teal-50 to-cream-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{squad.avatar}</span>
              <div>
                <p className="font-medium text-warm-800">{squad.name} Group Album</p>
                <p className="text-sm text-warm-500">{squad.members.length} members can contribute</p>
              </div>
            </div>
            <div className="flex -space-x-2">
              {squad.members.slice(0, 4).map((member, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-cream-200 border-2 border-white flex items-center justify-center text-sm">
                  {member.avatar}
                </div>
              ))}
              {squad.members.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-xs font-medium text-teal-700">
                  +{squad.members.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('shots')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'shots' ? 'bg-teal-600 text-white' : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
            }`}
          >
            <Video className="w-4 h-4" /> Shot List
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'group' ? 'bg-teal-600 text-white' : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
            }`}
          >
            <Image className="w-4 h-4" /> Group Uploads ({groupUploads.length})
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'social' ? 'bg-purple-600 text-white' : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
            }`}
          >
            <Users className="w-4 h-4" /> Social ({groupMembers.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'settings' ? 'bg-teal-600 text-white' : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
            }`}
          >
            <Settings className="w-4 h-4" /> Output Settings
          </button>
        </div>

        {/* Shot List Tab */}
        {activeTab === 'shots' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Shot List */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  {sportInfo ? <span className="text-2xl">{sportInfo.icon}</span> : <Video className="w-6 h-6 text-teal-600" />}
                </div>
                <div>
                  <h2 className="text-xl font-display text-warm-900">{trip.location} Shot List</h2>
                  <p className="text-sm text-warm-500">Shots tailored for your {sportInfo?.name.split(' / ')[0] || 'adventure'}</p>
                </div>
              </div>
              <div className="space-y-3">
                {shotPrompts.map((shot) => (
                  <div key={shot.id} className={`p-4 rounded-xl ${shot.uploaded ? 'bg-teal-50' : 'bg-cream-50'}`}>
                    <div className="flex items-center gap-4">
                      {shot.uploaded && shot.thumbnail ? (
                        <img src={shot.thumbnail} alt="" className="w-14 h-14 rounded-lg object-cover" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-cream-200 flex items-center justify-center">
                          <Plus className="w-6 h-6 text-warm-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-warm-800">{shot.prompt}</p>
                        <p className="text-sm text-warm-500">{shot.tip}</p>
                        {shot.uploadedBy && (
                          <p className="text-xs text-teal-600 mt-1">Uploaded by {shot.uploadedBy}</p>
                        )}
                      </div>
                      {shot.uploaded ? (
                        <Check className="w-6 h-6 text-teal-600" />
                      ) : (
                        <button className="btn btn-outline text-sm py-2 px-3">Upload</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Zone + Connect Services */}
            <div className="space-y-6">
              {/* Photo Service Connections */}
              <div className="card p-6">
                <h3 className="text-lg font-display text-warm-900 mb-4">Connect Photo Services</h3>
                <p className="text-sm text-warm-500 mb-4">Import photos directly from your cloud albums</p>
                <div className="space-y-3">
                  <button
                    onClick={() => connectService('google-photos')}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      connectedServices.includes('google-photos')
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-cream-200 hover:border-cream-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-2xl shadow-sm">
                      📸
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-warm-800">Google Photos</p>
                      <p className="text-xs text-warm-500">Import from your Google account</p>
                    </div>
                    {connectedServices.includes('google-photos') ? (
                      <span className="badge badge-teal">Connected</span>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-warm-400" />
                    )}
                  </button>

                  <button
                    onClick={() => connectService('icloud')}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      connectedServices.includes('icloud')
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-cream-200 hover:border-cream-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-2xl shadow-sm">
                      🍎
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-warm-800">iCloud Photos</p>
                      <p className="text-xs text-warm-500">Import from your Apple account</p>
                    </div>
                    {connectedServices.includes('icloud') ? (
                      <span className="badge badge-teal">Connected</span>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-warm-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Upload Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); onUpload(['file-' + Date.now()]); }}
                className={`card p-8 text-center border-2 border-dashed transition-colors ${
                  isDragging ? 'border-teal-500 bg-teal-50' : 'border-cream-300'
                }`}
              >
                <CloudUpload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-teal-600' : 'text-warm-400'}`} />
                <h3 className="text-xl font-display text-warm-800 mb-2">Drop Your Footage</h3>
                <p className="text-warm-500 mb-4">Drag photos & videos here, or click to browse</p>
                <button className="btn btn-outline">
                  <Image className="w-4 h-4 mr-2" />
                  Browse Files
                </button>
                {uploadedFiles.length > 0 && (
                  <p className="mt-4 text-teal-600 font-medium">{uploadedFiles.length} files uploaded</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Group Uploads Tab */}
        {activeTab === 'group' && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-display text-warm-900">Squad Uploads</h2>
                  <p className="text-sm text-warm-500">Everyone in {squad.name} can contribute photos & videos</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-teal-600">{selectedCount}</p>
                  <p className="text-xs text-warm-500">selected for film</p>
                </div>
              </div>

              {/* Upload Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {groupUploads.map((upload) => (
                  <div
                    key={upload.id}
                    onClick={() => togglePhotoSelection(upload.id)}
                    className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
                      upload.selected ? 'ring-3 ring-teal-500 ring-offset-2' : 'hover:opacity-90'
                    }`}
                  >
                    <img src={upload.thumbnail} alt="" className="w-full h-32 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium truncate">{upload.uploadedBy}</p>
                      <p className="text-white/70 text-xs">{upload.uploadedAt}</p>
                    </div>
                    {upload.type === 'video' && (
                      <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                        <Video className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {upload.selected && (
                      <div className="absolute top-2 left-2 bg-teal-500 rounded-full p-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Add More Placeholder */}
                <div className="h-32 rounded-xl border-2 border-dashed border-cream-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-all">
                  <Plus className="w-8 h-8 text-warm-400" />
                  <span className="text-xs text-warm-500">Add Photos</span>
                </div>
              </div>

              {/* Squad Member Contributions */}
              <div className="mt-6 pt-6 border-t border-cream-200">
                <h3 className="font-medium text-warm-800 mb-3">Contributions by Member</h3>
                <div className="flex flex-wrap gap-3">
                  {squad.members.map((member, i) => {
                    const memberUploads = groupUploads.filter(u => u.uploadedBy === member.name || (u.uploadedBy === 'You' && i === 0)).length;
                    return (
                      <div key={i} className="flex items-center gap-2 bg-cream-50 rounded-full px-3 py-1.5">
                        <span className="text-lg">{member.avatar}</span>
                        <span className="text-sm text-warm-700">{member.name}</span>
                        <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full">{memberUploads}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === 'social' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Group Members */}
            <div className="lg:col-span-1">
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-warm-900">Group Members</h3>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Invite
                  </button>
                </div>

                <div className="space-y-3">
                  {groupMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 hover:bg-cream-100 transition-all">
                      <div className="relative">
                        <span className="text-2xl">{member.avatar}</span>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          member.status === 'active' ? 'bg-green-500' : member.status === 'pending' ? 'bg-amber-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-warm-800 truncate">{member.name}</p>
                        <p className="text-xs text-warm-500">
                          {member.isAdmin ? 'Admin' : 'Member'} • Joined {member.joinedAt}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setPrivateMessageTo(member.id)}
                          className="p-2 rounded-lg hover:bg-purple-100 text-warm-500 hover:text-purple-600 transition-colors"
                          title="Private message"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        {!member.isAdmin && (
                          <button
                            onClick={() => setGroupMembers(prev => prev.filter(m => m.id !== member.id))}
                            className="p-2 rounded-lg hover:bg-red-100 text-warm-500 hover:text-red-600 transition-colors"
                            title="Remove member"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pending Invites */}
                <div className="mt-4 pt-4 border-t border-cream-200">
                  <p className="text-xs text-warm-500 mb-2">Pending Invites</p>
                  <div className="bg-amber-50 rounded-lg p-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-600" />
                    <span className="text-sm text-amber-700">No pending invites</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Group Chat */}
            <div className="lg:col-span-2">
              <div className="card p-5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    <h3 className="font-display font-semibold text-warm-900">
                      {privateMessageTo ? `Private Chat with ${groupMembers.find(m => m.id === privateMessageTo)?.name}` : 'Group Chat'}
                    </h3>
                  </div>
                  {privateMessageTo && (
                    <button
                      onClick={() => setPrivateMessageTo(null)}
                      className="text-xs text-warm-500 hover:text-warm-700"
                    >
                      Back to Group
                    </button>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[300px] max-h-[400px] p-2">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.sender === 'You' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-2xl flex-shrink-0">{msg.avatar}</span>
                      <div className={`max-w-[70%] ${msg.sender === 'You' ? 'text-right' : ''}`}>
                        <div className={`inline-block px-4 py-2 rounded-2xl ${
                          msg.sender === 'You'
                            ? 'bg-purple-600 text-white rounded-br-none'
                            : 'bg-cream-100 text-warm-800 rounded-bl-none'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                        <p className="text-xs text-warm-500 mt-1">
                          {msg.sender !== 'You' && <span className="font-medium">{msg.sender} • </span>}
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={privateMessageTo ? `Message ${groupMembers.find(m => m.id === privateMessageTo)?.name}...` : "Type a message..."}
                    className="input-cozy flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newMessage.trim()) {
                        setChatMessages(prev => [...prev, {
                          id: `${Date.now()}`,
                          sender: 'You',
                          message: newMessage.trim(),
                          time: 'Just now',
                          avatar: '👤'
                        }]);
                        setNewMessage('');
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newMessage.trim()) {
                        setChatMessages(prev => [...prev, {
                          id: `${Date.now()}`,
                          sender: 'You',
                          message: newMessage.trim(),
                          time: 'Just now',
                          avatar: '👤'
                        }]);
                        setNewMessage('');
                      }
                    }}
                    className="btn btn-primary px-4"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-warm-900">Invite to Group</h3>
                <button onClick={() => setShowInviteModal(false)} className="text-warm-500 hover:text-warm-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-warm-600 mb-4">
                Send an invitation to join your travel group. They'll be able to chat, share photos, and collaborate on the trip.
              </p>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                className="input-cozy mb-4"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowInviteModal(false)} className="btn btn-outline flex-1">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (inviteEmail.trim()) {
                      alert(`Invitation sent to ${inviteEmail}!`);
                      setInviteEmail('');
                      setShowInviteModal(false);
                    }
                  }}
                  className="btn btn-primary flex-1"
                >
                  Send Invite
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Output Settings Tab */}
        {activeTab === 'settings' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Photo Count Selector */}
            <div className="card p-6">
              <h3 className="text-xl font-display text-warm-900 mb-2">Number of Photos</h3>
              <p className="text-sm text-warm-500 mb-6">How many photos should we include in your final output?</p>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-warm-600 mb-2">
                  <span>20 photos</span>
                  <span className="font-bold text-teal-600">{photoCount} photos</span>
                  <span>30 photos</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="30"
                  value={photoCount}
                  onChange={(e) => setPhotoCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-cream-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              <div className="bg-cream-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Image className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium text-warm-800">{photoCount} photos selected</p>
                    <p className="text-xs text-warm-500">
                      {outputFormat === 'album' ? 'Perfect for a photo album' : `Creates ~${outputFormat === 'video-30' ? '30' : '60'} second video`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Format Selector */}
            <div className="card p-6">
              <h3 className="text-xl font-display text-warm-900 mb-2">Output Format</h3>
              <p className="text-sm text-warm-500 mb-6">Choose how you want your memories delivered</p>

              <div className="space-y-3">
                <button
                  onClick={() => setOutputFormat('video-30')}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left ${
                    outputFormat === 'video-30'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-cream-200 hover:border-cream-300'
                  }`}
                >
                  <div className="w-12 h-12 bg-terra-100 rounded-xl flex items-center justify-center">
                    <Film className="w-6 h-6 text-terra-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-warm-800">30-Second Video</p>
                    <p className="text-xs text-warm-500">Quick highlight reel perfect for stories</p>
                  </div>
                  {outputFormat === 'video-30' && <Check className="w-5 h-5 text-teal-600" />}
                </button>

                <button
                  onClick={() => setOutputFormat('video-60')}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left ${
                    outputFormat === 'video-60'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-cream-200 hover:border-cream-300'
                  }`}
                >
                  <div className="w-12 h-12 bg-terra-100 rounded-xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-terra-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-warm-800">60-Second Video</p>
                    <p className="text-xs text-warm-500">Extended cut with more moments</p>
                  </div>
                  {outputFormat === 'video-60' && <Check className="w-5 h-5 text-teal-600" />}
                </button>

                <button
                  onClick={() => setOutputFormat('album')}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left ${
                    outputFormat === 'album'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-cream-200 hover:border-cream-300'
                  }`}
                >
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Image className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-warm-800">Photo Album</p>
                    <p className="text-xs text-warm-500">Digital album with captions & layout</p>
                  </div>
                  {outputFormat === 'album' && <Check className="w-5 h-5 text-teal-600" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Film Studio CTA */}
        <div className="mt-8 card p-6 bg-gradient-to-br from-terra-50 to-cream-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-terra-500 rounded-xl flex items-center justify-center">
                <Film className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display text-warm-900">Ready to Create?</h3>
                <p className="text-warm-600">
                  {selectedCount} photos selected • {outputFormat === 'album' ? 'Photo Album' : `${outputFormat === 'video-30' ? '30' : '60'}s Video`}
                </p>
              </div>
            </div>
            <button onClick={onOpenStudio} className="btn btn-secondary">
              <Sparkles className="w-5 h-5 mr-2" />
              Open Film Studio
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============ FILM STUDIO SCREEN ============
function FilmStudioScreen({ captions, selectedCaption, onSelectCaption, onCopy, copied, onShowProModal, onBack }: {
  captions: Caption[];
  selectedCaption: Caption | null;
  onSelectCaption: (c: Caption) => void;
  onCopy: () => void;
  copied: boolean;
  onShowProModal: () => void;
  onBack: () => void;
}) {
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);

  // Simulated cinematic preview scenes
  const cinematicScenes = [
    { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', title: 'Chapter 1: The Journey Begins', duration: 2000 },
    { image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', title: 'Chapter 2: Discovery', duration: 2000 },
    { image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', title: 'Chapter 3: Adventure', duration: 2000 },
    { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', title: 'Chapter 4: The Finale', duration: 2000 },
  ];

  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let progressInterval: ReturnType<typeof setInterval>;

    if (isPreviewPlaying) {
      // Progress bar animation
      progressInterval = setInterval(() => {
        setPreviewProgress(prev => {
          if (prev >= 100) {
            setIsPreviewPlaying(false);
            setCurrentScene(0);
            return 0;
          }
          return prev + (100 / 80); // ~8 seconds total
        });
      }, 100);

      // Scene transitions
      interval = setInterval(() => {
        setCurrentScene(prev => {
          if (prev >= cinematicScenes.length - 1) {
            return 0;
          }
          return prev + 1;
        });
      }, 2000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isPreviewPlaying]);

  const handlePlayPreview = () => {
    setIsPreviewPlaying(true);
    setPreviewProgress(0);
    setCurrentScene(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen py-8 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-warm-600 hover:text-teal-600 mb-8">
          <ChevronLeft className="w-5 h-5" /> Back to uploads
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-warm-900 mb-4">
            Your <span className="text-terra-500">Film Studio</span>
          </h1>
          <p className="text-lg text-warm-600">Generate your movie and social content</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Movie Generator */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-terra-100 rounded-xl flex items-center justify-center">
                <Film className="w-6 h-6 text-terra-600" />
              </div>
              <div>
                <h2 className="text-xl font-display text-warm-900">Cinematic Cut</h2>
                <p className="text-sm text-warm-500">Your documentary awaits</p>
              </div>
            </div>

            {/* Cinematic Video Preview */}
            <div className="aspect-video bg-warm-900 rounded-2xl mb-6 overflow-hidden relative">
              {/* Letterbox effect */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-black z-10" />
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-black z-10" />

              {isPreviewPlaying ? (
                <>
                  {/* Animated Scene */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentScene}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={cinematicScenes[currentScene].image}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{ animation: 'slowZoom 2s ease-out forwards' }}
                      />
                      <div className="absolute inset-0 bg-black/30" />

                      {/* Chapter Title */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="text-center">
                          <p className="text-white/80 text-sm tracking-[0.3em] uppercase mb-2">StoryTrip Presents</p>
                          <h3 className="text-white text-2xl md:text-3xl font-display font-bold">
                            {cinematicScenes[currentScene].title}
                          </h3>
                        </div>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Progress Bar */}
                  <div className="absolute bottom-10 left-4 right-4 z-20">
                    <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-terra-500"
                        style={{ width: `${previewProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-white/60">
                      <span>Preview</span>
                      <span>{Math.round(previewProgress / 100 * 8)}s / 8s</span>
                    </div>
                  </div>

                  {/* Pause Button */}
                  <button
                    onClick={() => setIsPreviewPlaying(false)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Pause className="w-8 h-8 text-white" />
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <button
                      onClick={handlePlayPreview}
                      className="w-20 h-20 rounded-full bg-terra-500/80 hover:bg-terra-500 flex items-center justify-center transition-all hover:scale-110 mb-3 mx-auto"
                    >
                      <Play className="w-10 h-10 text-white ml-1" />
                    </button>
                    <p className="text-white/80 font-medium">Watch 8s Preview</p>
                    <p className="text-white/50 text-sm">Cinematic style demo</p>
                  </div>
                </div>
              )}

              {/* Film grain overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-20 z-30"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")'
                }}
              />
            </div>

            <style>{`
              @keyframes slowZoom {
                from { transform: scale(1); }
                to { transform: scale(1.1); }
              }
            `}</style>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button className="p-4 bg-cream-50 rounded-xl border-2 border-cream-300 hover:border-teal-400 transition-colors text-left">
                <span className="badge badge-teal mb-2">Free</span>
                <h4 className="font-medium text-warm-800">Quick Recap</h4>
                <p className="text-sm text-warm-500">30-second highlight</p>
              </button>
              <button onClick={onShowProModal} className="p-4 bg-gradient-to-br from-terra-50 to-terra-100 rounded-xl border-2 border-terra-300 hover:border-terra-500 transition-colors text-left relative">
                <Lock className="absolute top-3 right-3 w-5 h-5 text-terra-500" />
                <span className="badge badge-terra mb-2">$49</span>
                <h4 className="font-medium text-warm-800">Pro Cut</h4>
                <p className="text-sm text-warm-500">Full documentary</p>
              </button>
            </div>
            <button className="btn btn-secondary w-full">
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Movie
            </button>
          </div>

          {/* Social Caption Generator */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <Share2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-display text-warm-900">Social Captions</h2>
                <p className="text-sm text-warm-500">AI-generated, ready to post</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {captions.map((caption) => (
                <button
                  key={caption.style}
                  onClick={() => onSelectCaption(caption)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedCaption?.style === caption.style
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-cream-300 bg-cream-50 hover:border-cream-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{caption.emoji}</span>
                    <span className="font-medium text-warm-800">{caption.label}</span>
                    {selectedCaption?.style === caption.style && <Check className="w-5 h-5 text-teal-600 ml-auto" />}
                  </div>
                  <p className="text-sm text-warm-600 line-clamp-2">{caption.text}</p>
                </button>
              ))}
            </div>

            {selectedCaption && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cream-50 rounded-xl p-4 mb-4"
              >
                <p className="text-warm-800 whitespace-pre-line text-sm mb-3">{selectedCaption.text}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCaption.hashtags.map(tag => (
                    <span key={tag} className="text-teal-600 text-sm">{tag}</span>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onCopy}
                disabled={!selectedCaption}
                className={`btn flex-1 ${selectedCaption ? 'btn-primary' : 'bg-cream-300 text-warm-400'}`}
              >
                {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                {copied ? 'Copied!' : 'Copy Caption'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============ PRO MODAL ============
function ProModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-warm-400 hover:text-warm-600">
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-terra-400 to-terra-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Film className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-warm-900 mb-2">Pro Cinematic Cut</h2>
          <p className="text-warm-600 mb-6">Your trip deserves a real documentary</p>
          <div className="bg-cream-50 rounded-2xl p-6 mb-6 text-left space-y-3">
            {['3-5 minute cinematic edit', 'Professional color grading', 'Licensed music', 'AI voiceover narration', '4K export quality'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-teal-600" />
                <span className="text-warm-700">{f}</span>
              </div>
            ))}
          </div>
          <div className="mb-6">
            <span className="text-4xl font-display font-bold text-terra-600">$49</span>
            <span className="text-warm-500 ml-2">one-time</span>
          </div>
          <button className="btn btn-secondary w-full mb-2">Upgrade to Pro</button>
          <button onClick={onClose} className="btn btn-ghost w-full">Maybe Later</button>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
