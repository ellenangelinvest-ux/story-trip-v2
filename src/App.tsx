import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Users, Camera, Upload, Share2, Play, Lock, Check, ChevronRight, ChevronLeft, ChevronDown,
  MapPin, Calendar, Star, Sparkles, Mountain, Trophy, Globe, MessageCircle, Heart,
  Zap, Smile, Film, Image, X, Plus, CloudUpload, Compass, Award, UserPlus,
  Clock, Coffee, Sun, Moon, Sunset, Video, Copy, Instagram, Twitter, Filter,
  Utensils, Building, ShoppingBag, TreePine, Waves, Camera as CameraIcon, Music,
  Landmark, Wine, Car, Info, ArrowRight, Pause, SkipForward, Settings, Eye, Briefcase,
  Send, Mail, Edit3, ThumbsUp, ThumbsDown, Link, Brain
} from 'lucide-react';
import './index.css';
import { tripDatabase, getTripsSummaryForAI, generateExternalSearchLinks, TripListing, memberProfiles, MemberProfile } from './tripDatabase';

// ============ TYPES ============
type AppScreen = 'landing' | 'chat-onboarding' | 'personal-interest' | 'narrative' | 'trips' | 'trip-detail' | 'squad' | 'squad-browse' | 'itinerary' | 'memory-maker' | 'film-studio' | 'story-director' | 'demo' | 'about' | 'create-trip' | 'manage-trips';

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

type SportCategory = 'nba' | 'mlb' | 'nfl' | 'nhl' | 'fifa' | 'golf' | 'tennis' | 'f1' | 'skiing' | 'surfing' | 'mma' | 'cycling';
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
  mbtiType?: 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';
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

// Story Director Types
interface StoryDirectorAlbum {
  id: string;
  name: string;
  squadId: string;
  createdAt: string;
  members: AlbumMember[];
  mediaItems: MediaItem[];
  coverImage?: string;
}

interface AlbumMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'member';
  joinedAt: string;
  status: 'active' | 'pending' | 'offline';
  // Extended profile data
  location?: string;
  nationality?: Nationality;
  age?: number;
  relationshipStatus?: RelationshipStatus;
  bio?: string;
  travelStyle?: string;
  sportInterests?: SportCategory[];
  mbtiType?: string;
}

interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail: string;
  uploadedBy: string;
  uploadedAt: string;
  selected: boolean;
  duration?: number; // for videos
  caption?: string;
}

interface StoryDirectorChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  isPrivate: boolean;
  recipientId?: string;
}

interface VideoProject {
  id: string;
  title: string;
  style: 'cinematic' | 'fun' | 'documentary' | 'storybook';
  duration: '30s' | '60s' | '2min' | '5min';
  mediaIds: string[];
  status: 'draft' | 'processing' | 'complete';
  outputUrl?: string;
}

interface SocialPost {
  platform: 'instagram' | 'facebook' | 'blog' | 'storybook';
  format: 'reel' | 'story' | 'post' | 'long-form' | 'kids-book';
  content: string;
  hashtags: string[];
  mediaIds: string[];
}

// Squad Matching Score for AI recommendations
interface SquadMatchScore {
  squadId: string;
  matchPercentage: number;
  matchReasons: string[];
  compatibilityFactors: {
    interests: number;      // 0-100
    travelStyle: number;    // 0-100
    personality: number;    // 0-100 (MBTI compatibility)
    experience: number;     // 0-100
  };
}

// AI Squad Search Result
interface AISquadSearchResult {
  query: string;
  interpretation: string;
  recommendedSquads: SquadMatchScore[];
  searchType: 'soulmate' | 'adventure' | 'chill' | 'skill' | 'general';
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
  { id: 'cycling', name: 'Cycling / E-Bike', icon: '🚴', color: 'lime' },
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

// MBTI grouped into 4 categories
const mbtiCategories: { id: string; name: string; emoji: string; color: string; types: PersonalityType[]; description: string }[] = [
  { id: 'analysts', name: 'Analysts', emoji: '🧠', color: 'purple', types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'], description: 'Logical strategists & innovators' },
  { id: 'diplomats', name: 'Diplomats', emoji: '💚', color: 'green', types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'], description: 'Empathetic idealists & connectors' },
  { id: 'sentinels', name: 'Sentinels', emoji: '🛡️', color: 'blue', types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'], description: 'Reliable guardians & organizers' },
  { id: 'explorers', name: 'Explorers', emoji: '🧭', color: 'orange', types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'], description: 'Spontaneous adventurers & creators' },
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
    image: 'https://images.unsplash.com/photo-1574623452334-9e99857bbcd2?w=800',
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
    sportCategory: 'cycling',
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
  // ============ ADDITIONAL TRIPS TO REACH 50+ ============
  {
    id: '16',
    title: 'Monaco Grand Prix VIP',
    host: 'F1 Elite Experiences',
    location: 'Monte Carlo, Monaco',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
    price: '$8,500',
    dates: 'May 22-25, 2025',
    duration: '4 days',
    rating: 4.95,
    tags: ['F1', 'VIP', 'Luxury'],
    narrative: 'underdog',
    sportCategory: 'f1',
    storyBeats: [
      { day: 1, title: 'Riviera Arrival', description: 'Touch down in Nice, yacht transfer to Monaco.', location: 'Monaco', mood: 'rising', activities: ['Yacht arrival', 'Hotel check-in', 'Casino night'], localSpots: ['Monte Carlo Casino', 'Hotel de Paris'] },
      { day: 2, title: 'Qualifying Day', description: 'Feel the speed on the streets of Monaco.', location: 'Circuit de Monaco', mood: 'rising', activities: ['Paddock access', 'Qualifying session', 'Team garage visit'], localSpots: ['Swimming Pool section', 'Casino Square'] },
      { day: 3, title: 'Race Day Glory', description: 'The most glamorous race in the world.', location: 'Monaco Circuit', mood: 'peak', activities: ['Grid walk', 'Race viewing', 'Podium ceremony'], localSpots: ['Starting grid', 'Yacht harbor viewpoint'] },
      { day: 4, title: 'Champion\'s Farewell', description: 'Brunch and departure from paradise.', location: 'Monaco', mood: 'falling', activities: ['Victory brunch', 'Monaco tour', 'Nice departure'], localSpots: ['Prince\'s Palace', 'Oceanographic Museum'] },
    ],
    nearbyAttractions: [
      { name: 'Monte Carlo Casino', type: 'landmark', distance: '5 min walk', rating: 4.8, description: 'Iconic casino featured in James Bond films', image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=400', mustTry: 'Sunset cocktails on the terrace' },
      { name: 'Prince\'s Palace', type: 'landmark', distance: '10 min walk', rating: 4.7, description: 'Official residence of the Prince of Monaco', image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400' },
    ],
    localTips: [
      { category: 'Race Tips', icon: '🏎️', items: ['Bring ear protection', 'Stay hydrated in the sun', 'Book restaurants weeks ahead', 'Dress code: smart casual minimum'] },
      { category: 'Monaco Tips', icon: '🇲🇨', items: ['Everything is expensive', 'Euros accepted', 'French spoken', 'Taxis are rare - walk'] },
    ],
  },
  {
    id: '17',
    title: 'UFC Fight Week Las Vegas',
    host: 'Combat Sports VIP',
    location: 'Las Vegas, Nevada',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
    price: '$2,200',
    dates: 'Jul 3-6, 2025',
    duration: '4 days',
    rating: 4.85,
    tags: ['MMA', 'UFC', 'Vegas'],
    narrative: 'underdog',
    sportCategory: 'mma',
    storyBeats: [
      { day: 1, title: 'Vegas Arrival', description: 'The fight capital of the world awaits.', location: 'Las Vegas Strip', mood: 'rising', activities: ['Hotel check-in', 'Open workouts', 'Fighter meet & greet'], localSpots: ['T-Mobile Arena', 'UFC Apex'] },
      { day: 2, title: 'Weigh-In Atmosphere', description: 'Feel the tension build.', location: 'Las Vegas', mood: 'rising', activities: ['Ceremonial weigh-ins', 'Fan Q&A', 'Pre-fight party'], localSpots: ['Weigh-in venue', 'UFC Performance Institute'] },
      { day: 3, title: 'Fight Night', description: 'The octagon comes alive.', location: 'T-Mobile Arena', mood: 'peak', activities: ['VIP arena entry', 'Main card fights', 'Post-fight press conference'], localSpots: ['T-Mobile Arena', 'Press conference room'] },
      { day: 4, title: 'Victory Celebration', description: 'Champions and challengers alike.', location: 'Las Vegas', mood: 'falling', activities: ['Recovery brunch', 'Pool party', 'Film delivery'], localSpots: ['Encore Beach Club', 'XS Nightclub'] },
    ],
    nearbyAttractions: [
      { name: 'T-Mobile Arena', type: 'landmark', distance: 'On Strip', rating: 4.9, description: 'Premier UFC venue on the Las Vegas Strip', image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400' },
      { name: 'UFC Performance Institute', type: 'activity', distance: '15 min drive', rating: 4.7, description: 'World-class training facility with tours available', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
    ],
    localTips: [
      { category: 'UFC Tips', icon: '🥊', items: ['Get to arena early for prelims', 'Weigh-ins are free entry', 'Fighter autograph sessions happen', 'Afterparties sell out fast'] },
      { category: 'Vegas Tips', icon: '🎰', items: ['Stay on the Strip for convenience', 'Pool parties require reservations', 'Uber/Lyft everywhere', 'Stay hydrated in the desert'] },
    ],
  },
  {
    id: '18',
    title: 'Australian Open Melbourne',
    host: 'Grand Slam Tours',
    location: 'Melbourne, Australia',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800',
    price: '$3,800',
    dates: 'Jan 20-27, 2025',
    duration: '8 days',
    rating: 4.9,
    tags: ['Tennis', 'Grand Slam', 'Melbourne'],
    narrative: 'discovery',
    sportCategory: 'tennis',
    storyBeats: [
      { day: 1, title: 'Melbourne Landing', description: 'Summer in the southern hemisphere.', location: 'Melbourne', mood: 'rising', activities: ['Airport arrival', 'City orientation', 'Welcome dinner'], localSpots: ['Federation Square', 'Flinders Street Station'] },
      { day: 2, title: 'First Round Action', description: 'Early rounds, star watching.', location: 'Melbourne Park', mood: 'rising', activities: ['Ground pass day', 'Multiple courts', 'Player practice courts'], localSpots: ['Margaret Court Arena', 'Practice Village'] },
      { day: 3, title: 'Rod Laver Arena', description: 'Center court experience.', location: 'Rod Laver Arena', mood: 'rising', activities: ['Day session', 'Night session', 'AO Live Site'], localSpots: ['Rod Laver Arena', 'AO Ballpark'] },
      { day: 4, title: 'Melbourne Culture', description: 'More than just tennis.', location: 'Melbourne', mood: 'rising', activities: ['Coffee culture tour', 'Street art walk', 'Evening session'], localSpots: ['Hosier Lane', 'Queen Victoria Market'] },
      { day: 5, title: 'Quarterfinal Intensity', description: 'The tournament heats up.', location: 'Melbourne Park', mood: 'peak', activities: ['Quarterfinal matches', 'Player interviews', 'Rooftop bar'], localSpots: ['Rod Laver Arena', 'Yarra River cruise'] },
      { day: 6, title: 'Semifinal Drama', description: 'Four become two.', location: 'Melbourne Park', mood: 'peak', activities: ['Ladies\' semifinal', 'Men\'s semifinal', 'Celebration dinner'], localSpots: ['Rod Laver Arena', 'Southbank dining'] },
      { day: 7, title: 'Finals Weekend', description: 'Champions are crowned.', location: 'Melbourne Park', mood: 'falling', activities: ['Ladies\' final', 'Trophy ceremony', 'City exploration'], localSpots: ['Rod Laver Arena', 'Brighton Beach boxes'] },
      { day: 8, title: 'Australian Farewell', description: 'Until next summer.', location: 'Melbourne', mood: 'falling', activities: ['Men\'s final option', 'Beach day', 'Film delivery'], localSpots: ['St Kilda Beach', 'Airport departure'] },
    ],
    nearbyAttractions: [
      { name: 'Rod Laver Arena', type: 'landmark', distance: 'On-site', rating: 4.9, description: 'Iconic center court with retractable roof', image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400' },
      { name: 'Hosier Lane', type: 'landmark', distance: '15 min walk', rating: 4.7, description: 'Melbourne\'s famous street art laneway', image: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=400' },
    ],
    localTips: [
      { category: 'Tennis Tips', icon: '🎾', items: ['Ground pass gives great access', 'Evening sessions are cooler', 'AO App for queues', 'Bring hat and sunscreen'] },
      { category: 'Melbourne Tips', icon: '🇦🇺', items: ['Coffee is world-class', 'Trams are free in CBD', 'Weather changes quickly', 'Tap on/off with Myki card'] },
    ],
  },
  {
    id: '19',
    title: 'Super Bowl Experience',
    host: 'Gridiron VIP Tours',
    location: 'New Orleans, Louisiana',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
    price: '$5,500',
    dates: 'Feb 7-10, 2025',
    duration: '4 days',
    rating: 4.95,
    tags: ['NFL', 'Super Bowl', 'VIP'],
    narrative: 'bonding',
    sportCategory: 'nfl',
    storyBeats: [
      { day: 1, title: 'Big Easy Arrival', description: 'Super Bowl week energy takes over NOLA.', location: 'New Orleans', mood: 'rising', activities: ['Hotel check-in', 'Bourbon Street walk', 'Welcome party'], localSpots: ['French Quarter', 'Bourbon Street'] },
      { day: 2, title: 'NFL Experience', description: 'Fan fest and media day access.', location: 'Downtown', mood: 'rising', activities: ['NFL Experience', 'Player appearances', 'Jazz brunch'], localSpots: ['NFL Experience venue', 'Magazine Street'] },
      { day: 3, title: 'Game Day', description: 'The biggest game of the year.', location: 'Superdome', mood: 'peak', activities: ['Tailgate party', 'Super Bowl game', 'Victory celebration'], localSpots: ['Caesars Superdome', 'Champions Square'] },
      { day: 4, title: 'NOLA Farewell', description: 'Recovery and reflection.', location: 'New Orleans', mood: 'falling', activities: ['Brunch at Commander\'s', 'Garden District tour', 'Film delivery'], localSpots: ['Commander\'s Palace', 'Garden District'] },
    ],
    nearbyAttractions: [
      { name: 'French Quarter', type: 'landmark', distance: 'Walking', rating: 4.8, description: 'Historic heart of New Orleans with music and food', image: 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=400', mustTry: 'Beignets at Cafe Du Monde' },
      { name: 'Caesars Superdome', type: 'landmark', distance: 'Central', rating: 4.7, description: 'Iconic dome hosting multiple Super Bowls', image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400' },
    ],
    localTips: [
      { category: 'Super Bowl Tips', icon: '🏈', items: ['Arrive hours early', 'Tailgates start at sunrise', 'Bring cash for vendors', 'Download stadium app'] },
      { category: 'NOLA Tips', icon: '⚜️', items: ['Stay in French Quarter', 'Try crawfish étouffée', 'Live jazz is everywhere', 'Uber surge pricing is real'] },
    ],
  },
  {
    id: '20',
    title: 'Wimbledon Championships',
    host: 'Tennis Heritage Tours',
    location: 'London, England',
    image: 'https://images.unsplash.com/photo-1529926706528-db9e5010cd3e?w=800',
    price: '$4,200',
    dates: 'Jun 30 - Jul 7, 2025',
    duration: '8 days',
    rating: 4.95,
    tags: ['Tennis', 'Wimbledon', 'London'],
    narrative: 'discovery',
    sportCategory: 'tennis',
    storyBeats: [
      { day: 1, title: 'London Calling', description: 'Arrive in the tennis capital.', location: 'London', mood: 'rising', activities: ['Hotel check-in', 'City walk', 'Welcome dinner'], localSpots: ['Westminster', 'Big Ben'] },
      { day: 2, title: 'Queue Experience', description: 'The famous Wimbledon queue.', location: 'Wimbledon', mood: 'rising', activities: ['Queue overnight option', 'Ground pass entry', 'Outside courts'], localSpots: ['Wimbledon Park', 'Henman Hill'] },
      { day: 3, title: 'Centre Court', description: 'The cathedral of tennis.', location: 'Centre Court', mood: 'rising', activities: ['Centre Court tickets', 'Day session', 'Night match'], localSpots: ['Centre Court', 'No.1 Court'] },
      { day: 4, title: 'London Day', description: 'Explore the city.', location: 'London', mood: 'rising', activities: ['Museum visit', 'Thames walk', 'Evening session'], localSpots: ['British Museum', 'Tower Bridge'] },
      { day: 5, title: 'Manic Monday', description: 'All fourth round matches.', location: 'Wimbledon', mood: 'peak', activities: ['Ground pass day', 'Multiple matches', 'Henman Hill atmosphere'], localSpots: ['All courts', 'Aorangi Terrace'] },
      { day: 6, title: 'Quarterfinal Day', description: 'The best eight remain.', location: 'Wimbledon', mood: 'peak', activities: ['Quarterfinal tickets', 'Player watching', 'Champagne bar'], localSpots: ['Centre Court', 'Wimbledon village'] },
      { day: 7, title: 'Ladies\' Final', description: 'Crowning a champion.', location: 'Centre Court', mood: 'falling', activities: ['Ladies\' singles final', 'Trophy presentation', 'Celebration dinner'], localSpots: ['Centre Court', 'Village pubs'] },
      { day: 8, title: 'Men\'s Final & Farewell', description: 'The ultimate tennis day.', location: 'Wimbledon', mood: 'falling', activities: ['Men\'s singles final', 'Champions photos', 'Film delivery'], localSpots: ['Centre Court', 'Airport departure'] },
    ],
    nearbyAttractions: [
      { name: 'Centre Court', type: 'landmark', distance: 'On-site', rating: 5.0, description: 'The most famous tennis court in the world', image: 'https://images.unsplash.com/photo-1529926706528-db9e5010cd3e?w=400', mustTry: 'Strawberries and cream' },
      { name: 'Wimbledon Village', type: 'shopping', distance: '10 min walk', rating: 4.6, description: 'Charming village with boutiques and cafés', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400' },
    ],
    localTips: [
      { category: 'Wimbledon Tips', icon: '🎾', items: ['Queue for ground passes', 'Strawberries & cream essential', 'All white dress code', 'Bring an umbrella always'] },
      { category: 'London Tips', icon: '🇬🇧', items: ['Oyster card for transport', 'Pubs close at 11pm', 'Tipping 10-15%', 'Stand on the right on escalators'] },
    ],
  },
  {
    id: '21',
    title: 'Pipeline Masters Hawaii',
    host: 'Surf Legends Tours',
    location: 'North Shore, Oahu',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
    price: '$2,800',
    dates: 'Dec 8-16, 2025',
    duration: '9 days',
    rating: 4.9,
    tags: ['Surfing', 'Pro Tour', 'Hawaii'],
    narrative: 'adventure',
    sportCategory: 'surfing',
    storyBeats: [
      { day: 1, title: 'Aloha Arrival', description: 'Land in Honolulu, drive to North Shore.', location: 'Oahu', mood: 'rising', activities: ['Airport pickup', 'North Shore drive', 'Sunset surf'], localSpots: ['Haleiwa town', 'Waimea Bay'] },
      { day: 2, title: 'Pipeline First Look', description: 'See the world\'s most famous wave.', location: 'Pipeline', mood: 'rising', activities: ['Beach setup', 'Pro watching', 'Surf lesson'], localSpots: ['Banzai Pipeline', 'Ehukai Beach Park'] },
      { day: 3, title: 'Contest Day 1', description: 'The waiting period begins.', location: 'Pipeline', mood: 'rising', activities: ['Competition viewing', 'Athlete meet', 'Shrimp truck lunch'], localSpots: ['Pipeline', 'Giovanni\'s Shrimp Truck'] },
      { day: 4, title: 'Big Wave Day', description: 'The swell arrives.', location: 'North Shore', mood: 'peak', activities: ['Epic heats', 'Photo opportunities', 'Sunset session'], localSpots: ['Pipeline', 'Sunset Beach'] },
      { day: 5, title: 'Finals Day', description: 'World champions are crowned.', location: 'Pipeline', mood: 'peak', activities: ['Finals day', 'Trophy ceremony', 'Pro party'], localSpots: ['Pipeline', 'Turtle Bay Resort'] },
      { day: 6, title: 'Surf Session', description: 'Your turn in the water.', location: 'North Shore', mood: 'falling', activities: ['Guided surf', 'Free surf time', 'Board rental'], localSpots: ['Puaena Point', 'Chun\'s Reef'] },
      { day: 7, title: 'Island Exploration', description: 'Beyond the surf.', location: 'Oahu', mood: 'falling', activities: ['Waterfall hike', 'Snorkeling', 'Luau dinner'], localSpots: ['Waimea Falls', 'Shark\'s Cove'] },
      { day: 8, title: 'Last Waves', description: 'Final surf and farewell.', location: 'North Shore', mood: 'falling', activities: ['Dawn patrol', 'Packing up', 'Group lunch'], localSpots: ['Your favorite break', 'Ted\'s Bakery'] },
      { day: 9, title: 'Mahalo', description: 'Aloha until next time.', location: 'Honolulu', mood: 'falling', activities: ['South shore option', 'Airport transfer', 'Film delivery'], localSpots: ['Waikiki', 'Airport'] },
    ],
    nearbyAttractions: [
      { name: 'Banzai Pipeline', type: 'nature', distance: 'On-site', rating: 5.0, description: 'The most famous wave in surfing', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400' },
      { name: 'Waimea Bay', type: 'nature', distance: '5 min drive', rating: 4.8, description: 'Legendary big wave spot and swimming beach', image: 'https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?w=400', mustTry: 'Cliff jumping (when safe)' },
    ],
    localTips: [
      { category: 'Surf Tips', icon: '🏄', items: ['Know your limits at Pipeline', 'Reef booties recommended', 'Respect the locals', 'Dawn patrol = best waves'] },
      { category: 'Hawaii Tips', icon: '🌺', items: ['Shrimp trucks are amazing', 'Cash for food trucks', 'Book accommodation early', 'Sunscreen reef-safe only'] },
    ],
  },
  {
    id: '22',
    title: 'El Clasico Barcelona',
    host: 'Spanish Football Tours',
    location: 'Barcelona, Spain',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800',
    price: '$2,400',
    dates: 'Mar 22-25, 2025',
    duration: '4 days',
    rating: 4.95,
    tags: ['Football', 'El Clasico', 'Barcelona'],
    narrative: 'bonding',
    sportCategory: 'fifa',
    storyBeats: [
      { day: 1, title: 'Hola Barcelona', description: 'Arrive in the football capital of Catalonia.', location: 'Barcelona', mood: 'rising', activities: ['Hotel check-in', 'La Rambla walk', 'Tapas welcome'], localSpots: ['Gothic Quarter', 'La Boqueria Market'] },
      { day: 2, title: 'Camp Nou Pilgrimage', description: 'Visit the legendary stadium.', location: 'Camp Nou', mood: 'rising', activities: ['Stadium tour', 'Museum visit', 'Team store'], localSpots: ['Camp Nou', 'FC Barcelona Museum'] },
      { day: 3, title: 'El Clasico Day', description: 'Barcelona vs Real Madrid.', location: 'Spotify Camp Nou', mood: 'peak', activities: ['Pre-match atmosphere', 'El Clasico match', 'Post-match celebration'], localSpots: ['Spotify Camp Nou', 'Local fan bars'] },
      { day: 4, title: 'Barcelona Culture', description: 'Explore beyond football.', location: 'Barcelona', mood: 'falling', activities: ['Gaudi architecture', 'Beach walk', 'Farewell sangria'], localSpots: ['Sagrada Familia', 'Barceloneta Beach'] },
    ],
    nearbyAttractions: [
      { name: 'Camp Nou', type: 'landmark', distance: 'On-site', rating: 4.9, description: 'Largest stadium in Europe, home of FC Barcelona', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400', mustTry: 'Tunnel experience tour' },
      { name: 'Sagrada Familia', type: 'landmark', distance: '20 min metro', rating: 4.9, description: 'Gaudi\'s unfinished masterpiece cathedral', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400' },
    ],
    localTips: [
      { category: 'Match Day Tips', icon: '⚽', items: ['Arrive 2 hours early', 'Learn the chants', 'Wear Barça colors', 'No Real Madrid gear - ever'] },
      { category: 'Barcelona Tips', icon: '🇪🇸', items: ['Siesta is 2-5pm', 'Dinner after 9pm', 'Metro is efficient', 'Watch for pickpockets'] },
    ],
  },
  {
    id: '23',
    title: 'MLB Spring Training Arizona',
    host: 'Baseball America Tours',
    location: 'Phoenix, Arizona',
    image: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=800',
    price: '$1,600',
    dates: 'Mar 1-7, 2025',
    duration: '7 days',
    rating: 4.8,
    tags: ['MLB', 'Spring Training', 'Baseball'],
    narrative: 'bonding',
    sportCategory: 'mlb',
    storyBeats: [
      { day: 1, title: 'Spring Arrival', description: 'Baseball season begins in the desert.', location: 'Phoenix', mood: 'rising', activities: ['Hotel check-in', 'Scottsdale walk', 'Welcome dinner'], localSpots: ['Old Town Scottsdale', 'Desert landscape'] },
      { day: 2, title: 'Cactus League Begins', description: 'First games of the season.', location: 'Scottsdale', mood: 'rising', activities: ['Salt River Fields', 'Double-header option', 'Fan autographs'], localSpots: ['Salt River Fields', 'Talking Stick'] },
      { day: 3, title: 'Giants vs Cubs', description: 'Classic rivalry in spring.', location: 'Scottsdale', mood: 'rising', activities: ['Morning game', 'Player watching', 'BBQ dinner'], localSpots: ['Scottsdale Stadium', 'Sloan Park'] },
      { day: 4, title: 'Multi-Stadium Day', description: 'Stadium hopping madness.', location: 'Valley-wide', mood: 'peak', activities: ['Day game', 'Night game', 'Stadium food tour'], localSpots: ['Chase Field area', 'Camelback Ranch'] },
      { day: 5, title: 'Player Access Day', description: 'Up close with the stars.', location: 'Practice facilities', mood: 'peak', activities: ['Open practice viewing', 'Autograph session', 'Batting practice'], localSpots: ['Team practice fields', 'Player parking lots'] },
      { day: 6, title: 'Desert Golf & Baseball', description: 'Morning golf, afternoon baseball.', location: 'Scottsdale', mood: 'falling', activities: ['Golf round option', 'Afternoon game', 'Farewell dinner'], localSpots: ['TPC Scottsdale', 'Peoria Stadium'] },
      { day: 7, title: 'Final Games', description: 'Last day of spring magic.', location: 'Phoenix area', mood: 'falling', activities: ['Final game', 'Souvenir shopping', 'Film delivery'], localSpots: ['Any stadium', 'Airport departure'] },
    ],
    nearbyAttractions: [
      { name: 'Salt River Fields', type: 'landmark', distance: 'Central', rating: 4.8, description: 'Beautiful spring training facility for D-backs and Rockies', image: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=400', mustTry: 'Outfield grass seats' },
      { name: 'Old Town Scottsdale', type: 'shopping', distance: '10 min drive', rating: 4.6, description: 'Western-themed downtown with galleries and restaurants', image: 'https://images.unsplash.com/photo-1533621834623-d0b25d0b14e7?w=400' },
    ],
    localTips: [
      { category: 'Spring Training Tips', icon: '⚾', items: ['Arrive early for autographs', 'Lawn seats are fun', 'Sunscreen essential', 'Players are accessible'] },
      { category: 'Arizona Tips', icon: '🌵', items: ['It\'s a dry heat', 'Rent a car recommended', 'Happy hours are legendary', 'Explore beyond baseball'] },
    ],
  },
  {
    id: '24',
    title: 'Singapore Night Race',
    host: 'F1 Asia Tours',
    location: 'Marina Bay, Singapore',
    image: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=800',
    price: '$3,500',
    dates: 'Sep 19-22, 2025',
    duration: '4 days',
    rating: 4.9,
    tags: ['F1', 'Night Race', 'Singapore'],
    narrative: 'adventure',
    sportCategory: 'f1',
    storyBeats: [
      { day: 1, title: 'Singapore Arrival', description: 'The city-state dazzles.', location: 'Marina Bay', mood: 'rising', activities: ['Hotel check-in', 'Marina Bay walk', 'Welcome dinner'], localSpots: ['Marina Bay Sands', 'Gardens by the Bay'] },
      { day: 2, title: 'Practice & Qualifying', description: 'The track comes alive at night.', location: 'Marina Bay Circuit', mood: 'rising', activities: ['Friday practice', 'Saturday qualifying', 'Track walk'], localSpots: ['Padang', 'Singapore Flyer view'] },
      { day: 3, title: 'Race Night', description: 'The only night race on the calendar.', location: 'Marina Bay Circuit', mood: 'peak', activities: ['Pre-race concert', 'Night race', 'Post-race celebration'], localSpots: ['Marina Bay Circuit', 'Clarke Quay'] },
      { day: 4, title: 'Singapore Exploration', description: 'Beyond the race.', location: 'Singapore', mood: 'falling', activities: ['Hawker food tour', 'Cultural exploration', 'Film delivery'], localSpots: ['Chinatown', 'Sentosa Island'] },
    ],
    nearbyAttractions: [
      { name: 'Marina Bay Sands', type: 'landmark', distance: '5 min walk', rating: 4.8, description: 'Iconic hotel with infinity pool and city views', image: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=400', mustTry: 'Rooftop bar at sunset' },
      { name: 'Gardens by the Bay', type: 'nature', distance: '10 min walk', rating: 4.9, description: 'Futuristic gardens with Supertrees and domes', image: 'https://images.unsplash.com/photo-1506351421178-63b52a2d356e?w=400' },
    ],
    localTips: [
      { category: 'Night Race Tips', icon: '🏎️', items: ['The heat is intense', 'Bring portable fan', 'Concerts are included', 'Stay for the fireworks'] },
      { category: 'Singapore Tips', icon: '🇸🇬', items: ['No gum allowed', 'Hawker food is cheap', 'English widely spoken', 'Uber/Grab everywhere'] },
    ],
  },
  {
    id: '25',
    title: 'Stanley Cup Finals',
    host: 'Hockey Dreams Tours',
    location: 'Varies by Team',
    image: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
    price: '$3,800',
    dates: 'Jun 2025',
    duration: '5 days',
    rating: 4.9,
    tags: ['NHL', 'Stanley Cup', 'Hockey'],
    narrative: 'underdog',
    sportCategory: 'nhl',
    storyBeats: [
      { day: 1, title: 'Playoff Arrival', description: 'The quest for Lord Stanley\'s Cup.', location: 'Host City', mood: 'rising', activities: ['City arrival', 'Fan zone visit', 'Welcome dinner'], localSpots: ['Downtown fan zone', 'Local sports bars'] },
      { day: 2, title: 'Game Day Build', description: 'The atmosphere intensifies.', location: 'Host City', mood: 'rising', activities: ['Morning skate viewing', 'City exploration', 'Pre-game tailgate'], localSpots: ['Practice facility', 'Team neighborhoods'] },
      { day: 3, title: 'Stanley Cup Game', description: 'The ultimate prize in hockey.', location: 'Arena', mood: 'peak', activities: ['Arena arrival', 'Playoff hockey', 'Overtime drama?'], localSpots: ['Home arena', 'Victory celebrations'] },
      { day: 4, title: 'Hockey Culture', description: 'Explore hockey history.', location: 'Host City', mood: 'falling', activities: ['Hockey Hall of Fame', 'Player spotting', 'Local hockey bar'], localSpots: ['Hockey landmarks', 'Team history sites'] },
      { day: 5, title: 'Champion\'s Farewell', description: 'One team lifts the Cup.', location: 'Host City', mood: 'falling', activities: ['Optional second game', 'Departure prep', 'Film delivery'], localSpots: ['Championship parade route', 'Airport'] },
    ],
    nearbyAttractions: [
      { name: 'Hockey Hall of Fame', type: 'landmark', distance: 'Toronto', rating: 4.8, description: 'The shrine to hockey history', image: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=400', mustTry: 'Photo with the Stanley Cup replica' },
    ],
    localTips: [
      { category: 'Playoff Tips', icon: '🏒', items: ['Wear team colors', 'Learn the chants', 'Playoff beards encouraged', 'Atmosphere is electric'] },
      { category: 'Hockey Culture', icon: '🥅', items: ['Respect the game', 'Chirping is allowed', 'Handshake line tradition', 'Cup touches: earned only'] },
    ],
  },
  {
    id: '26',
    title: 'Tokyo Olympics Preview',
    host: 'Olympic Journey Tours',
    location: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800',
    price: '$4,500',
    dates: 'Jul 2028',
    duration: '10 days',
    rating: 4.85,
    tags: ['Olympics', 'Tokyo', 'Multi-Sport'],
    narrative: 'discovery',
    sportCategory: 'tennis',
    storyBeats: [
      { day: 1, title: 'Olympic Arrival', description: 'The world gathers in Tokyo.', location: 'Tokyo', mood: 'rising', activities: ['Airport arrival', 'Shinjuku exploration', 'Welcome dinner'], localSpots: ['Shinjuku', 'Golden Gai'] },
      { day: 2, title: 'Opening Ceremony', description: 'The greatest show on Earth.', location: 'Olympic Stadium', mood: 'rising', activities: ['Pre-ceremony events', 'Opening Ceremony', 'Fireworks'], localSpots: ['National Stadium', 'Meiji Shrine'] },
      { day: 3, title: 'Swimming & Gymnastics', description: 'The marquee events.', location: 'Aquatics Centre', mood: 'rising', activities: ['Morning swimming', 'Evening gymnastics', 'Medal ceremonies'], localSpots: ['Tokyo Aquatics Centre', 'Ariake Arena'] },
      { day: 4, title: 'Track & Field Begins', description: 'The fastest humans on Earth.', location: 'Olympic Stadium', mood: 'rising', activities: ['Track events', 'Field events', 'Star watching'], localSpots: ['National Stadium', 'Warm-up track'] },
      { day: 5, title: 'Tokyo Culture Day', description: 'Beyond the Olympics.', location: 'Tokyo', mood: 'rising', activities: ['Senso-ji Temple', 'Akihabara', 'Shibuya crossing'], localSpots: ['Asakusa', 'Shibuya'] },
      { day: 6, title: 'Basketball & Volleyball', description: 'Team sports intensity.', location: 'Various venues', mood: 'peak', activities: ['USA Basketball', 'Volleyball matches', 'Fan zones'], localSpots: ['Saitama Super Arena', 'Ariake Arena'] },
      { day: 7, title: '100m Final Day', description: 'The fastest race on Earth.', location: 'Olympic Stadium', mood: 'peak', activities: ['Sprint finals', 'Medal ceremony', 'Celebration'], localSpots: ['National Stadium', 'Olympic Park'] },
      { day: 8, title: 'Water Sports', description: 'Surfing and sailing.', location: 'Chiba', mood: 'falling', activities: ['Beach events', 'Sailing races', 'Beach atmosphere'], localSpots: ['Tsurigasaki Beach', 'Enoshima'] },
      { day: 9, title: 'Marathon Day', description: 'The ultimate endurance test.', location: 'City streets', mood: 'falling', activities: ['Marathon viewing', 'Street party', 'Final events'], localSpots: ['Marathon course', 'Olympic Boulevard'] },
      { day: 10, title: 'Closing Ceremony', description: 'Until next time.', location: 'Olympic Stadium', mood: 'falling', activities: ['Closing Ceremony', 'Farewell parties', 'Film delivery'], localSpots: ['National Stadium', 'Airport departure'] },
    ],
    nearbyAttractions: [
      { name: 'National Stadium', type: 'landmark', distance: 'Central', rating: 4.9, description: 'The heart of the Olympic Games', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400' },
      { name: 'Senso-ji Temple', type: 'landmark', distance: '30 min train', rating: 4.8, description: 'Tokyo\'s oldest and most famous temple', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400' },
    ],
    localTips: [
      { category: 'Olympic Tips', icon: '🥇', items: ['Download official app', 'Plan venue logistics', 'Wear comfortable shoes', 'Hydrate constantly'] },
      { category: 'Tokyo Tips', icon: '🇯🇵', items: ['Get a Suica card', 'Convenience store food is great', 'Cash is still common', 'Bow when greeting'] },
    ],
  },
  {
    id: '27',
    title: 'Kentucky Derby Experience',
    host: 'Derby Elite Tours',
    location: 'Louisville, Kentucky',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    price: '$2,800',
    dates: 'May 1-4, 2025',
    duration: '4 days',
    rating: 4.9,
    tags: ['Horse Racing', 'Derby', 'Louisville'],
    narrative: 'bonding',
    sportCategory: 'golf',
    storyBeats: [
      { day: 1, title: 'Louisville Landing', description: 'Derby Week begins.', location: 'Louisville', mood: 'rising', activities: ['Hotel check-in', 'Bourbon tour', 'Welcome dinner'], localSpots: ['Whiskey Row', 'Fourth Street Live'] },
      { day: 2, title: 'Kentucky Oaks', description: 'The "Run for the Lilies".', location: 'Churchill Downs', mood: 'rising', activities: ['Oaks Day races', 'Hat parade', 'Mint Juleps'], localSpots: ['Churchill Downs', 'Paddock area'] },
      { day: 3, title: 'Derby Day', description: 'The most exciting two minutes in sports.', location: 'Churchill Downs', mood: 'peak', activities: ['Pre-race traditions', 'Kentucky Derby race', 'Post-race celebration'], localSpots: ['Winner\'s Circle', 'Millionaire\'s Row'] },
      { day: 4, title: 'Derby Hangover', description: 'Recovery and reflection.', location: 'Louisville', mood: 'falling', activities: ['Brunch at Jack Fry\'s', 'Muhammad Ali Center', 'Film delivery'], localSpots: ['NuLu neighborhood', 'Airport'] },
    ],
    nearbyAttractions: [
      { name: 'Churchill Downs', type: 'landmark', distance: 'On-site', rating: 4.9, description: 'Home of the Kentucky Derby since 1875', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', mustTry: 'Mint Julep in souvenir glass' },
      { name: 'Bourbon Trail', type: 'activity', distance: 'Various', rating: 4.8, description: 'Tour legendary bourbon distilleries', image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400' },
    ],
    localTips: [
      { category: 'Derby Tips', icon: '🐎', items: ['Book hotels a year ahead', 'Big hats required', 'Bet on the horse you like', 'Arrive early for infield'] },
      { category: 'Louisville Tips', icon: '🥃', items: ['Try a Hot Brown', 'Bourbon is everywhere', 'The city is walkable', 'Southern hospitality is real'] },
    ],
  },
  {
    id: '28',
    title: 'Tour de France Final Stage',
    host: 'Cycling Tours France',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800',
    price: '$3,200',
    dates: 'Jul 25-27, 2025',
    duration: '3 days',
    rating: 4.85,
    tags: ['Cycling', 'Tour de France', 'Paris'],
    narrative: 'adventure',
    sportCategory: 'cycling',
    storyBeats: [
      { day: 1, title: 'Paris Arrival', description: 'The world\'s greatest bike race finale.', location: 'Paris', mood: 'rising', activities: ['Hotel check-in', 'Champs-Élysées walk', 'Welcome dinner'], localSpots: ['Arc de Triomphe', 'Café de Flore'] },
      { day: 2, title: 'Race Day Prep', description: 'Secure your viewing spot.', location: 'Paris', mood: 'rising', activities: ['Morning city bike', 'Spot scouting', 'Cycling museum'], localSpots: ['Tuileries Garden', 'Place de la Concorde'] },
      { day: 3, title: 'Yellow Jersey Glory', description: 'The champion crosses the line.', location: 'Champs-Élysées', mood: 'peak', activities: ['Stage viewing', 'Circuit laps', 'Trophy ceremony'], localSpots: ['Champs-Élysées', 'Arc de Triomphe finish'] },
    ],
    nearbyAttractions: [
      { name: 'Champs-Élysées', type: 'landmark', distance: 'On course', rating: 4.9, description: 'The world\'s most famous avenue and Tour finale', image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400' },
      { name: 'Eiffel Tower', type: 'landmark', distance: '20 min walk', rating: 4.8, description: 'Icon of Paris with stunning city views', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=400' },
    ],
    localTips: [
      { category: 'Tour Tips', icon: '🚴', items: ['Arrive hours early for spots', 'Bring a picnic', 'Yellow is the color', 'Multiple circuit laps'] },
      { category: 'Paris Tips', icon: '🇫🇷', items: ['Metro is efficient', 'Always say Bonjour', 'Tipping not expected', 'Cafés charge more to sit'] },
    ],
  },
  {
    id: '29',
    title: 'Ryder Cup Europe',
    host: 'Golf Legends Tours',
    location: 'Adare Manor, Ireland',
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800',
    price: '$6,500',
    dates: 'Sep 26-28, 2025',
    duration: '4 days',
    rating: 4.95,
    tags: ['Golf', 'Ryder Cup', 'Ireland'],
    narrative: 'bonding',
    sportCategory: 'golf',
    storyBeats: [
      { day: 1, title: 'Irish Welcome', description: 'The greatest team event in golf.', location: 'Adare Manor', mood: 'rising', activities: ['Shannon arrival', 'Manor check-in', 'Practice rounds'], localSpots: ['Adare Village', 'Manor grounds'] },
      { day: 2, title: 'Day 1 Foursomes', description: 'Europe vs USA begins.', location: 'Adare Manor', mood: 'rising', activities: ['Morning foursomes', 'Afternoon four-ball', 'Fan atmosphere'], localSpots: ['1st tee', 'Roaming the course'] },
      { day: 3, title: 'Day 2 Drama', description: 'The tension builds.', location: 'Adare Manor', mood: 'peak', activities: ['All sessions', 'Following groups', 'Evening entertainment'], localSpots: ['Key holes', 'Hospitality village'] },
      { day: 4, title: 'Singles Sunday', description: 'Champions are crowned.', location: 'Adare Manor', mood: 'falling', activities: ['12 singles matches', 'Trophy ceremony', 'Celebration/commiseration'], localSpots: ['18th green', 'Champions celebration'] },
    ],
    nearbyAttractions: [
      { name: 'Adare Manor', type: 'landmark', distance: 'On-site', rating: 4.9, description: 'Neo-Gothic castle resort hosting the Ryder Cup', image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400' },
      { name: 'Cliffs of Moher', type: 'nature', distance: '1.5 hour drive', rating: 4.8, description: 'Dramatic sea cliffs on Ireland\'s west coast', image: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=400' },
    ],
    localTips: [
      { category: 'Ryder Cup Tips', icon: '⛳', items: ['Pick a group to follow', 'Chanting is encouraged', 'Dress warmly', 'Book shuttle passes'] },
      { category: 'Ireland Tips', icon: '🇮🇪', items: ['Guinness tastes better here', 'Weather changes fast', 'Irish hospitality is real', 'Drive on the left'] },
    ],
  },
  {
    id: '30',
    title: 'Coachella Music Festival',
    host: 'Festival VIP Tours',
    location: 'Indio, California',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    price: '$2,200',
    dates: 'Apr 11-13, 2025',
    duration: '4 days',
    rating: 4.8,
    tags: ['Music', 'Festival', 'Desert'],
    narrative: 'discovery',
    sportCategory: 'surfing',
    storyBeats: [
      { day: 1, title: 'Desert Arrival', description: 'The music pilgrimage begins.', location: 'Palm Springs', mood: 'rising', activities: ['Hotel check-in', 'Pool party', 'Pre-festival prep'], localSpots: ['Palm Springs', 'Joshua Tree'] },
      { day: 2, title: 'Day 1 Magic', description: 'The festival opens.', location: 'Empire Polo Club', mood: 'rising', activities: ['Festival entry', 'Stage hopping', 'Art installations'], localSpots: ['Main Stage', 'Sahara Tent'] },
      { day: 3, title: 'Headliner Night', description: 'The acts you came for.', location: 'Empire Polo Club', mood: 'peak', activities: ['Headliner sets', 'VIP areas', 'Silent disco'], localSpots: ['Main Stage', 'Do Lab'] },
      { day: 4, title: 'Final Day', description: 'Leave it all on the polo fields.', location: 'Empire Polo Club', mood: 'falling', activities: ['Day acts', 'Closing headliner', 'Farewell'], localSpots: ['Coachella Stage', 'Festival grounds'] },
    ],
    nearbyAttractions: [
      { name: 'Joshua Tree National Park', type: 'nature', distance: '45 min drive', rating: 4.8, description: 'Iconic desert landscape with unique trees', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400' },
      { name: 'Palm Springs', type: 'landmark', distance: '30 min drive', rating: 4.6, description: 'Mid-century modern desert oasis', image: 'https://images.unsplash.com/photo-1495433324511-bf8e92934d90?w=400' },
    ],
    localTips: [
      { category: 'Festival Tips', icon: '🎵', items: ['Comfortable shoes essential', 'Bandana for dust', 'Hydrate constantly', 'Plan your must-sees'] },
      { category: 'Desert Tips', icon: '🌵', items: ['Sunscreen all day', 'Layers for night', 'Shuttle or Uber to festival', 'Book hotels in Palm Springs'] },
    ],
  },
  {
    id: '31',
    title: 'NBA Finals Experience',
    host: 'Courtside Dreams',
    location: 'Championship City',
    image: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=800',
    price: '$4,200',
    dates: 'Jun 2025',
    duration: '5 days',
    rating: 4.95,
    tags: ['NBA', 'Finals', 'Championship'],
    narrative: 'underdog',
    sportCategory: 'nba',
    storyBeats: [
      { day: 1, title: 'Finals Arrival', description: 'The championship chase begins.', location: 'Finals City', mood: 'rising', activities: ['Hotel check-in', 'Fan fest', 'Welcome dinner'], localSpots: ['Downtown', 'Team arena area'] },
      { day: 2, title: 'Game Day Prep', description: 'The atmosphere builds.', location: 'Finals City', mood: 'rising', activities: ['Shootaround viewing', 'City exploration', 'Pre-game rally'], localSpots: ['Practice facility', 'Sports bars'] },
      { day: 3, title: 'NBA Finals Game', description: 'Championship basketball.', location: 'Arena', mood: 'peak', activities: ['VIP entry', 'Game experience', 'Post-game celebration'], localSpots: ['NBA Finals arena', 'Championship plaza'] },
      { day: 4, title: 'Basketball Culture', description: 'Beyond the game.', location: 'Finals City', mood: 'falling', activities: ['NBA Store', 'Basketball history', 'Local food tour'], localSpots: ['Team history sites', 'Local gems'] },
      { day: 5, title: 'Champion\'s Farewell', description: 'Until next season.', location: 'Finals City', mood: 'falling', activities: ['Optional game 2', 'Departure prep', 'Film delivery'], localSpots: ['Final memories', 'Airport'] },
    ],
    nearbyAttractions: [
      { name: 'NBA Finals Arena', type: 'landmark', distance: 'On-site', rating: 4.9, description: 'Home of championship basketball', image: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=400' },
    ],
    localTips: [
      { category: 'Finals Tips', icon: '🏀', items: ['Prices are premium', 'Atmosphere is electric', 'Wear team colors', 'Arrive extra early'] },
      { category: 'Game Day Tips', icon: '🏆', items: ['Clear bag policy', 'Download arena app', 'Food inside is expensive', 'Savor every moment'] },
    ],
  },
  {
    id: '32',
    title: 'Champions League Final',
    host: 'European Football Elite',
    location: 'Munich, Germany',
    image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
    price: '$5,800',
    dates: 'May 31 - Jun 2, 2025',
    duration: '3 days',
    rating: 4.95,
    tags: ['Football', 'Champions League', 'UEFA'],
    narrative: 'bonding',
    sportCategory: 'fifa',
    storyBeats: [
      { day: 1, title: 'Munich Arrival', description: 'European football\'s biggest night approaches.', location: 'Munich', mood: 'rising', activities: ['Hotel check-in', 'Fan zone', 'Beer garden welcome'], localSpots: ['Marienplatz', 'Hofbräuhaus'] },
      { day: 2, title: 'Final Day', description: 'The biggest club game in the world.', location: 'Allianz Arena', mood: 'peak', activities: ['Pre-match atmosphere', 'Champions League Final', 'Trophy ceremony'], localSpots: ['Allianz Arena', 'Fan parks'] },
      { day: 3, title: 'Munich Exploration', description: 'Bavarian culture day.', location: 'Munich', mood: 'falling', activities: ['Old town walk', 'Museum visit', 'Farewell lunch'], localSpots: ['English Garden', 'BMW World'] },
    ],
    nearbyAttractions: [
      { name: 'Allianz Arena', type: 'landmark', distance: 'Metro ride', rating: 4.9, description: 'Stunning stadium that glows with LED lights', image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400' },
      { name: 'Marienplatz', type: 'landmark', distance: 'Central', rating: 4.7, description: 'Munich\'s central square with famous Glockenspiel', image: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?w=400' },
    ],
    localTips: [
      { category: 'Final Tips', icon: '⚽', items: ['Book everything early', 'Learn some chants', 'Scarves are essential', 'Soak in the atmosphere'] },
      { category: 'Munich Tips', icon: '🇩🇪', items: ['Beer is cheaper than water', 'U-Bahn is efficient', 'Credit cards less common', 'Sunday everything closes'] },
    ],
  },
  {
    id: '33',
    title: 'World Series Experience',
    host: 'Baseball Dreams Tours',
    location: 'Championship City',
    image: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800',
    price: '$3,500',
    dates: 'Oct 2025',
    duration: '5 days',
    rating: 4.9,
    tags: ['MLB', 'World Series', 'Baseball'],
    narrative: 'underdog',
    sportCategory: 'mlb',
    storyBeats: [
      { day: 1, title: 'October Arrival', description: 'Fall Classic fever grips the city.', location: 'WS City', mood: 'rising', activities: ['Hotel check-in', 'Stadium tour', 'Welcome dinner'], localSpots: ['Downtown', 'Ballpark area'] },
      { day: 2, title: 'Game Day Traditions', description: 'Pre-game rituals and tailgating.', location: 'WS City', mood: 'rising', activities: ['Morning workout', 'Tailgate party', 'Pre-game ceremonies'], localSpots: ['Tailgate lots', 'Fan zones'] },
      { day: 3, title: 'World Series Game', description: 'The Fall Classic.', location: 'Ballpark', mood: 'peak', activities: ['First pitch', 'Game experience', 'Post-game atmosphere'], localSpots: ['World Series stadium', 'Victory areas'] },
      { day: 4, title: 'Baseball Culture', description: 'Explore the city\'s baseball history.', location: 'WS City', mood: 'falling', activities: ['Baseball museum', 'Local food tour', 'Player spotting'], localSpots: ['Team history sites', 'Classic baseball bars'] },
      { day: 5, title: 'Series Farewell', description: 'Until next October.', location: 'WS City', mood: 'falling', activities: ['Optional extra game', 'Souvenir shopping', 'Film delivery'], localSpots: ['Team store', 'Airport departure'] },
    ],
    nearbyAttractions: [
      { name: 'World Series Stadium', type: 'landmark', distance: 'On-site', rating: 4.9, description: 'Home of the Fall Classic', image: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=400', mustTry: 'Classic ballpark food' },
    ],
    localTips: [
      { category: 'World Series Tips', icon: '⚾', items: ['Prices are highest of year', 'Wear layers for October', 'Arrive early', 'Stay for final out'] },
      { category: 'Baseball Tips', icon: '🏆', items: ['Rally caps are real', 'Superstitions matter', 'Hot dogs required', 'Seventh inning stretch'] },
    ],
  },
  {
    id: '34',
    title: 'Whistler Heli-Skiing',
    host: 'Powder Highway Tours',
    location: 'Whistler, BC, Canada',
    image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800',
    price: '$5,200',
    dates: 'Feb 15-22, 2025',
    duration: '8 days',
    rating: 4.95,
    tags: ['Skiing', 'Heli-Ski', 'Backcountry'],
    narrative: 'adventure',
    sportCategory: 'skiing',
    storyBeats: [
      { day: 1, title: 'Whistler Arrival', description: 'The powder capital of North America.', location: 'Whistler Village', mood: 'rising', activities: ['Village check-in', 'Gear prep', 'Welcome dinner'], localSpots: ['Whistler Village', 'Olympic Plaza'] },
      { day: 2, title: 'Resort Warm-Up', description: 'Test your legs on the mountain.', location: 'Whistler Blackcomb', mood: 'rising', activities: ['Resort skiing', 'Terrain assessment', 'Technique clinic'], localSpots: ['Peak 2 Peak', 'Whistler Bowl'] },
      { day: 3, title: 'First Heli Day', description: 'Helicopter drops into untouched terrain.', location: 'Coast Mountains', mood: 'rising', activities: ['Safety briefing', 'Heli drops', 'Powder runs'], localSpots: ['Backcountry zones', 'Alpine meadows'] },
      { day: 4, title: 'Deep Powder Day', description: 'The storm delivers.', location: 'Coast Mountains', mood: 'peak', activities: ['Multiple drops', 'Tree skiing', 'Glory runs'], localSpots: ['Secret zones', 'Untouched faces'] },
      { day: 5, title: 'Glacier Experience', description: 'Ski on ancient ice.', location: 'Glacial terrain', mood: 'peak', activities: ['Glacier skiing', 'Crevasse awareness', 'Alpine lunch'], localSpots: ['Glacier runs', 'Mountain picnic'] },
      { day: 6, title: 'Rest & Recovery', description: 'Let the legs recover.', location: 'Whistler', mood: 'falling', activities: ['Spa day', 'Village exploration', 'Aprés scenes'], localSpots: ['Scandinave Spa', 'Village stroll'] },
      { day: 7, title: 'Final Heli Day', description: 'One more day of helicopter heaven.', location: 'Coast Mountains', mood: 'falling', activities: ['Final drops', 'Photo session', 'Farewell dinner'], localSpots: ['Favorite zones', 'Araxi restaurant'] },
      { day: 8, title: 'Canadian Farewell', description: 'Until next powder day.', location: 'Whistler', mood: 'falling', activities: ['Morning run option', 'Village goodbye', 'Film delivery'], localSpots: ['Village', 'Sea-to-Sky Highway'] },
    ],
    nearbyAttractions: [
      { name: 'Peak 2 Peak Gondola', type: 'landmark', distance: 'On-mountain', rating: 4.9, description: 'Record-breaking gondola connecting two mountains', image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=400' },
      { name: 'Scandinave Spa', type: 'activity', distance: '5 min drive', rating: 4.8, description: 'Nordic-inspired outdoor spa in the forest', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400', mustTry: 'Hot/cold circuit' },
    ],
    localTips: [
      { category: 'Heli-Ski Tips', icon: '🚁', items: ['Weather delays happen', 'Fitness level matters', 'Beacon training required', 'Trust your guides'] },
      { category: 'Whistler Tips', icon: '🇨🇦', items: ['Book restaurants early', 'Village is walkable', 'CAD is the currency', 'Tip 15-20%'] },
    ],
  },
  {
    id: '35',
    title: 'Ashes Test Cricket',
    host: 'Cricket Heritage Tours',
    location: 'Lord\'s, London',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
    price: '$2,600',
    dates: 'Jul 2025',
    duration: '6 days',
    rating: 4.85,
    tags: ['Cricket', 'Ashes', 'Lord\'s'],
    narrative: 'bonding',
    sportCategory: 'tennis',
    storyBeats: [
      { day: 1, title: 'Lord\'s Arrival', description: 'The home of cricket awaits.', location: 'London', mood: 'rising', activities: ['Hotel check-in', 'St John\'s Wood walk', 'Welcome dinner'], localSpots: ['St John\'s Wood', 'Lord\'s exterior'] },
      { day: 2, title: 'Day 1 Play', description: 'The Ashes rivalry ignites.', location: 'Lord\'s', mood: 'rising', activities: ['Test match day 1', 'Pavilion viewing', 'Tea interval'], localSpots: ['Lord\'s Pavilion', 'Nursery End'] },
      { day: 3, title: 'Day 2 Intensity', description: 'The battle continues.', location: 'Lord\'s', mood: 'rising', activities: ['Full day play', 'Cricket museum', 'Long room tour'], localSpots: ['Lord\'s Long Room', 'Media Centre'] },
      { day: 4, title: 'Day 3 Drama', description: 'The match takes shape.', location: 'Lord\'s', mood: 'peak', activities: ['Crucial sessions', 'Fan interactions', 'Traditional lunch'], localSpots: ['Members\' areas', 'Victory bar'] },
      { day: 5, title: 'Day 4 Push', description: 'Teams push for result.', location: 'Lord\'s', mood: 'peak', activities: ['Test cricket drama', 'Evening celebrations', 'Squad dinner'], localSpots: ['All viewing areas', 'St John\'s Wood pubs'] },
      { day: 6, title: 'Final Day', description: 'Ashes drama concludes.', location: 'Lord\'s', mood: 'falling', activities: ['Match conclusion', 'Trophy ceremony possible', 'Film delivery'], localSpots: ['Lord\'s', 'Airport departure'] },
    ],
    nearbyAttractions: [
      { name: 'Lord\'s Cricket Ground', type: 'landmark', distance: 'On-site', rating: 4.9, description: 'The home of cricket since 1814', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400', mustTry: 'Long Room tour' },
      { name: 'Abbey Road', type: 'landmark', distance: '10 min walk', rating: 4.5, description: 'The famous Beatles crossing', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400' },
    ],
    localTips: [
      { category: 'Cricket Tips', icon: '🏏', items: ['Dress code in pavilion', 'Bring cushion for seats', 'Lunch is long', 'Learn the rules'] },
      { category: 'London Tips', icon: '🇬🇧', items: ['Tube is fastest', 'Pubs close at 11pm', 'Weather is unpredictable', 'Card payment everywhere'] },
    ],
  },
  {
    id: '36',
    title: 'India vs Pakistan Cricket',
    host: 'Subcontinent Sports Tours',
    location: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
    price: '$3,400',
    dates: 'Oct 2025',
    duration: '4 days',
    rating: 4.95,
    tags: ['Cricket', 'Rivalry', 'Asia Cup'],
    narrative: 'bonding',
    sportCategory: 'tennis',
    storyBeats: [
      { day: 1, title: 'Dubai Arrival', description: 'The biggest rivalry in cricket.', location: 'Dubai', mood: 'rising', activities: ['Hotel check-in', 'Fan zone visit', 'Welcome dinner'], localSpots: ['Dubai Mall', 'Burj Khalifa'] },
      { day: 2, title: 'Pre-Match Fever', description: 'The tension builds.', location: 'Dubai', mood: 'rising', activities: ['Fan events', 'Team practice viewing', 'Cricket museum'], localSpots: ['ICC Academy', 'Fan parks'] },
      { day: 3, title: 'Match Day', description: 'A billion viewers tune in.', location: 'Dubai International Stadium', mood: 'peak', activities: ['Pre-match atmosphere', 'India vs Pakistan', 'Post-match celebration'], localSpots: ['Dubai Stadium', 'Fan zones'] },
      { day: 4, title: 'Dubai Exploration', description: 'Beyond the cricket.', location: 'Dubai', mood: 'falling', activities: ['Desert safari option', 'Shopping', 'Film delivery'], localSpots: ['Dubai Desert', 'Gold Souk'] },
    ],
    nearbyAttractions: [
      { name: 'Dubai International Cricket Stadium', type: 'landmark', distance: 'On-site', rating: 4.8, description: 'Neutral venue for Indo-Pak encounters', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400' },
      { name: 'Burj Khalifa', type: 'landmark', distance: '30 min drive', rating: 4.9, description: 'World\'s tallest building with observation deck', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' },
    ],
    localTips: [
      { category: 'Match Tips', icon: '🏏', items: ['Most intense atmosphere', 'Book months ahead', 'Wear team colors', 'Prepare for emotion'] },
      { category: 'Dubai Tips', icon: '🇦🇪', items: ['Alcohol in hotels only', 'Dress modestly', 'Taxi or Uber everywhere', 'Everything is air-conditioned'] },
    ],
  },
  {
    id: '37',
    title: 'Abu Dhabi F1 Season Finale',
    host: 'F1 VIP Emirates',
    location: 'Yas Marina, Abu Dhabi',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
    price: '$4,800',
    dates: 'Dec 5-8, 2025',
    duration: '4 days',
    rating: 4.9,
    tags: ['F1', 'Season Finale', 'Abu Dhabi'],
    narrative: 'adventure',
    sportCategory: 'f1',
    storyBeats: [
      { day: 1, title: 'Emirates Arrival', description: 'The F1 season finale beckons.', location: 'Abu Dhabi', mood: 'rising', activities: ['Hotel check-in', 'Yas Island exploration', 'Welcome dinner'], localSpots: ['Yas Marina', 'Ferrari World'] },
      { day: 2, title: 'Practice & Qualifying', description: 'The championship could be decided.', location: 'Yas Marina Circuit', mood: 'rising', activities: ['Practice sessions', 'Qualifying', 'Pit lane walk'], localSpots: ['Marina grandstands', 'Paddock'] },
      { day: 3, title: 'Race Day Glory', description: 'Under the lights of Yas Marina.', location: 'Yas Marina Circuit', mood: 'peak', activities: ['Pre-race grid walk', 'Season finale race', 'Fireworks celebration'], localSpots: ['Yas Marina Circuit', 'Post-race concert'] },
      { day: 4, title: 'Abu Dhabi Culture', description: 'Beyond the racing.', location: 'Abu Dhabi', mood: 'falling', activities: ['Grand Mosque visit', 'Louvre Abu Dhabi', 'Film delivery'], localSpots: ['Sheikh Zayed Mosque', 'Louvre Abu Dhabi'] },
    ],
    nearbyAttractions: [
      { name: 'Yas Marina Circuit', type: 'landmark', distance: 'On-site', rating: 4.9, description: 'Stunning twilight circuit ending the F1 season', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400' },
      { name: 'Sheikh Zayed Grand Mosque', type: 'landmark', distance: '20 min drive', rating: 5.0, description: 'Stunning white marble mosque, one of the world\'s largest', image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=400' },
    ],
    localTips: [
      { category: 'F1 Tips', icon: '🏎️', items: ['Day to night race is magical', 'Fireworks after race', 'Post-race concerts included', 'Stay at Yas Island'] },
      { category: 'UAE Tips', icon: '🇦🇪', items: ['Dress respectfully', 'December weather is perfect', 'Taxi apps work great', 'AED is the currency'] },
    ],
  },
  {
    id: '38',
    title: 'New Zealand Haka Experience',
    host: 'All Blacks Rugby Tours',
    location: 'Auckland, New Zealand',
    image: 'https://images.unsplash.com/photo-1529900672901-908be5302554?w=800',
    price: '$3,200',
    dates: 'Aug 2025',
    duration: '6 days',
    rating: 4.85,
    tags: ['Rugby', 'All Blacks', 'New Zealand'],
    narrative: 'discovery',
    sportCategory: 'mma',
    storyBeats: [
      { day: 1, title: 'Kiwi Welcome', description: 'Land of the long white cloud.', location: 'Auckland', mood: 'rising', activities: ['Airport arrival', 'City orientation', 'Welcome dinner'], localSpots: ['Sky Tower', 'Viaduct Harbour'] },
      { day: 2, title: 'Rugby Culture', description: 'Understand New Zealand rugby.', location: 'Auckland', mood: 'rising', activities: ['All Blacks museum', 'Training session viewing', 'Rugby pub crawl'], localSpots: ['Eden Park', 'Rugby heritage sites'] },
      { day: 3, title: 'All Blacks Match Day', description: 'The Haka in person.', location: 'Eden Park', mood: 'peak', activities: ['Pre-match atmosphere', 'Haka experience', 'Test match rugby'], localSpots: ['Eden Park', 'Post-match celebrations'] },
      { day: 4, title: 'Maori Culture', description: 'Beyond the rugby.', location: 'Rotorua', mood: 'falling', activities: ['Maori village visit', 'Geothermal wonders', 'Hangi dinner'], localSpots: ['Te Puia', 'Whakarewarewa'] },
      { day: 5, title: 'Adventure Day', description: 'Kiwi adventure sports.', location: 'Rotorua/Taupo', mood: 'falling', activities: ['Bungee/skydive option', 'Lake activities', 'Farewell dinner'], localSpots: ['Taupo', 'Huka Falls'] },
      { day: 6, title: 'NZ Farewell', description: 'Ka kite ano (see you again).', location: 'Auckland', mood: 'falling', activities: ['Morning free time', 'Souvenir shopping', 'Film delivery'], localSpots: ['Auckland Airport', 'Last views'] },
    ],
    nearbyAttractions: [
      { name: 'Eden Park', type: 'landmark', distance: '15 min drive', rating: 4.8, description: 'Spiritual home of New Zealand rugby', image: 'https://images.unsplash.com/photo-1529900672901-908be5302554?w=400', mustTry: 'Feel the Haka' },
      { name: 'Sky Tower', type: 'landmark', distance: 'Central Auckland', rating: 4.6, description: 'Iconic Auckland landmark with views', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400' },
    ],
    localTips: [
      { category: 'Rugby Tips', icon: '🏉', items: ['Learn the Haka words', 'Black is the dress code', 'Post-match pubs are wild', 'Respect the traditions'] },
      { category: 'NZ Tips', icon: '🇳🇿', items: ['NZD is the currency', 'Coffee culture is amazing', 'Driving is on the left', 'Nature is spectacular'] },
    ],
  },
  {
    id: '39',
    title: 'World Cup of Poker',
    host: 'Vegas Poker Tours',
    location: 'Las Vegas, Nevada',
    image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=800',
    price: '$2,800',
    dates: 'Jul 2025',
    duration: '5 days',
    rating: 4.8,
    tags: ['Poker', 'WSOP', 'Vegas'],
    narrative: 'underdog',
    sportCategory: 'golf',
    storyBeats: [
      { day: 1, title: 'Vegas Arrival', description: 'The poker capital of the world.', location: 'Las Vegas', mood: 'rising', activities: ['Hotel check-in', 'Strip walk', 'Welcome dinner'], localSpots: ['Las Vegas Strip', 'Fremont Street'] },
      { day: 2, title: 'WSOP Experience', description: 'Enter the World Series of Poker.', location: 'Paris/Horseshoe', mood: 'rising', activities: ['WSOP floor tour', 'Satellite tournament', 'Rail bird watching'], localSpots: ['WSOP venue', 'Paris poker room'] },
      { day: 3, title: 'Tournament Day', description: 'Your shot at poker glory.', location: 'WSOP', mood: 'peak', activities: ['Daily tournament entry', 'Cash game action', 'Pro spotting'], localSpots: ['Tournament hall', 'Amazon Room'] },
      { day: 4, title: 'Final Table Rail', description: 'Watch the pros battle.', location: 'WSOP', mood: 'falling', activities: ['Final table viewing', 'Bracelet ceremony', 'Poker celebrity mixer'], localSpots: ['Feature table', 'ESPN stage'] },
      { day: 5, title: 'Vegas Farewell', description: 'One more session.', location: 'Las Vegas', mood: 'falling', activities: ['Morning cash game', 'Pool party option', 'Film delivery'], localSpots: ['Hotel poker room', 'Airport'] },
    ],
    nearbyAttractions: [
      { name: 'World Series of Poker', type: 'landmark', distance: 'On-site', rating: 4.9, description: 'The most prestigious poker tournament series', image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400' },
      { name: 'Las Vegas Strip', type: 'landmark', distance: 'Walking', rating: 4.7, description: 'Iconic stretch of themed casinos and shows', image: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=400' },
    ],
    localTips: [
      { category: 'Poker Tips', icon: '🃏', items: ['Bankroll management key', 'Satellites offer value', 'Hydrate constantly', 'Take breaks'] },
      { category: 'Vegas Tips', icon: '🎰', items: ['Comps add up', 'Free drinks while playing', 'Uber beats taxis', 'Summer is HOT'] },
    ],
  },
  {
    id: '40',
    title: 'Ironman World Championship',
    host: 'Triathlon Dreams Tours',
    location: 'Kona, Hawaii',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800',
    price: '$4,200',
    dates: 'Oct 2025',
    duration: '6 days',
    rating: 4.95,
    tags: ['Triathlon', 'Ironman', 'Hawaii'],
    narrative: 'discovery',
    sportCategory: 'cycling',
    storyBeats: [
      { day: 1, title: 'Kona Arrival', description: 'The birthplace of Ironman.', location: 'Kona', mood: 'rising', activities: ['Airport arrival', 'Hotel check-in', 'Athlete village'], localSpots: ['Ali\'i Drive', 'Kona Pier'] },
      { day: 2, title: 'Race Week Energy', description: 'Athletes and energy everywhere.', location: 'Kona', mood: 'rising', activities: ['Expo visit', 'Athlete talks', 'Sunset swim'], localSpots: ['Ironman Village', 'Dig Me Beach'] },
      { day: 3, title: 'Parade of Nations', description: 'Athletes represent their countries.', location: 'Kona', mood: 'rising', activities: ['Underpants Run', 'Parade viewing', 'Carb-loading dinner'], localSpots: ['Ali\'i Drive', 'Local restaurants'] },
      { day: 4, title: 'Race Day', description: 'The ultimate test of human endurance.', location: 'Kona course', mood: 'peak', activities: ['Swim start at dawn', 'Bike course viewing', 'Run course support'], localSpots: ['Kona Pier', 'Energy Lab', 'Finish line'] },
      { day: 5, title: 'Finisher Celebration', description: 'Every finisher is an Ironman.', location: 'Kona', mood: 'falling', activities: ['Awards ceremony', 'Beach recovery', 'Celebration dinner'], localSpots: ['Awards venue', 'Kona beaches'] },
      { day: 6, title: 'Aloha Farewell', description: 'Anything is possible.', location: 'Kona', mood: 'falling', activities: ['Morning swim option', 'Island exploration', 'Film delivery'], localSpots: ['Kona town', 'Airport departure'] },
    ],
    nearbyAttractions: [
      { name: 'Kona Pier', type: 'landmark', distance: 'Central', rating: 4.9, description: 'Iconic Ironman swim start location', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400', mustTry: 'Sunrise swim' },
      { name: 'Volcano National Park', type: 'nature', distance: '2 hour drive', rating: 4.8, description: 'Active volcano and unique landscapes', image: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=400' },
    ],
    localTips: [
      { category: 'Ironman Tips', icon: '🏊', items: ['Race starts at 6:25am', 'Sunscreen essential', 'Cheer at Energy Lab', 'Stay for midnight finishers'] },
      { category: 'Kona Tips', icon: '🌺', items: ['Book a year ahead', 'Rent a car to explore', 'Try Kona coffee', 'Respect the athletes'] },
    ],
  },
  {
    id: '41',
    title: 'Rugby World Cup France',
    host: 'European Sports Tours',
    location: 'Paris & Marseille, France',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    price: '$5,800',
    dates: 'Oct 2027',
    duration: '10 days',
    rating: 4.9,
    tags: ['Rugby', 'World Cup', 'France'],
    narrative: 'rivalry',
    sportCategory: 'fifa',
    storyBeats: [
      { day: 1, title: 'Paris Landing', description: 'The City of Light hosts the rugby world.', location: 'Paris', mood: 'rising', activities: ['CDG arrival', 'Champs-Élysées walk', 'Rugby fan zone'], localSpots: ['Eiffel Tower', 'Arc de Triomphe'] },
      { day: 2, title: 'Pool Match Day', description: 'First taste of World Cup atmosphere.', location: 'Paris', mood: 'rising', activities: ['Stade de France experience', 'Pre-match festivities', 'Post-match celebration'], localSpots: ['Stade de France', 'Saint-Denis'] },
      { day: 3, title: 'French Culture', description: 'Rest day exploring Paris treasures.', location: 'Paris', mood: 'rising', activities: ['Louvre visit', 'Seine cruise', 'Michelin dinner'], localSpots: ['Louvre Museum', 'Le Marais'] },
      { day: 4, title: 'TGV to Marseille', description: 'High-speed journey to the Mediterranean.', location: 'TGV / Marseille', mood: 'rising', activities: ['TGV experience', 'Old Port arrival', 'Bouillabaisse dinner'], localSpots: ['Gare de Lyon', 'Vieux-Port'] },
      { day: 5, title: 'Marseille Match', description: 'Rugby under the Mediterranean sun.', location: 'Marseille', mood: 'peak', activities: ['Stade Vélodrome match', 'Coastal views', 'Victory drinks'], localSpots: ['Stade Vélodrome', 'Corniche Kennedy'] },
      { day: 6, title: 'Provence Day Trip', description: 'Lavender fields and Provençal charm.', location: 'Provence', mood: 'falling', activities: ['Aix-en-Provence visit', 'Wine tasting', 'French countryside'], localSpots: ['Aix-en-Provence', 'Luberon'] },
      { day: 7, title: 'Back to Paris', description: 'Return for the knockout rounds.', location: 'Paris', mood: 'rising', activities: ['TGV return', 'Quarter-final anticipation', 'Montmartre evening'], localSpots: ['Montmartre', 'Sacré-Cœur'] },
      { day: 8, title: 'Quarter-Final Day', description: 'The real tournament begins now.', location: 'Paris', mood: 'peak', activities: ['Pre-match brunch', 'Quarter-final experience', 'Historic night out'], localSpots: ['Stade de France', 'Paris nightlife'] },
      { day: 9, title: 'Rugby Village', description: 'Fan zone festivities.', location: 'Paris', mood: 'falling', activities: ['Champ de Mars fan zone', 'Rugby legends meet', 'Film compilation'], localSpots: ['Champ de Mars', 'Trocadéro'] },
      { day: 10, title: 'Au Revoir', description: 'Until the next World Cup.', location: 'Paris', mood: 'falling', activities: ['Morning croissants', 'Final shopping', 'CDG departure'], localSpots: ['Galeries Lafayette', 'CDG Airport'] },
    ],
    nearbyAttractions: [
      { name: 'Stade de France', type: 'landmark', distance: 'Saint-Denis', rating: 4.9, description: 'Iconic 80,000-seat stadium', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400', mustTry: 'Stadium tour' },
      { name: 'Eiffel Tower', type: 'landmark', distance: 'Central Paris', rating: 4.9, description: 'The Iron Lady of Paris', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=400' },
    ],
    localTips: [
      { category: 'Rugby Tips', icon: '🏉', items: ['Book stadium tours early', 'Wear team colors proudly', 'Learn French rugby chants', 'Try pastis with locals'] },
      { category: 'France Tips', icon: '🇫🇷', items: ['TGV first class worth it', 'Restaurants close 2-7pm', 'Speak French basics', 'Metro easy to navigate'] },
    ],
  },
  {
    id: '42',
    title: 'Boston Marathon Experience',
    host: 'Running Tours USA',
    location: 'Boston, Massachusetts',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    price: '$2,800',
    dates: 'Apr 2025',
    duration: '5 days',
    rating: 4.85,
    tags: ['Marathon', 'Running', 'Historic'],
    narrative: 'underdog',
    sportCategory: 'cycling',
    storyBeats: [
      { day: 1, title: 'Boston Arrival', description: 'America\'s oldest annual marathon.', location: 'Boston', mood: 'rising', activities: ['Logan Airport arrival', 'Freedom Trail walk', 'Expo preview'], localSpots: ['Faneuil Hall', 'North End'] },
      { day: 2, title: 'Marathon Expo', description: 'Bib pickup and runner energy.', location: 'Boston', mood: 'rising', activities: ['Expo visit', 'Bib collection', 'Pasta dinner'], localSpots: ['Hynes Convention Center', 'Newbury Street'] },
      { day: 3, title: 'Race Day', description: 'Hopkinton to Boylston Street.', location: 'Boston Marathon Course', mood: 'peak', activities: ['Bus to Hopkinton', '26.2 mile journey', 'Finish line glory'], localSpots: ['Hopkinton', 'Heartbreak Hill', 'Boylston Street'] },
      { day: 4, title: 'Recovery Day', description: 'Celebrate your achievement.', location: 'Boston', mood: 'falling', activities: ['Late brunch', 'Duck boat tour', 'Finisher celebration'], localSpots: ['Boston Common', 'Harvard Square'] },
      { day: 5, title: 'Departure', description: 'Boston Strong forever.', location: 'Boston', mood: 'falling', activities: ['Morning jog option', 'Souvenir shopping', 'Film delivery'], localSpots: ['Copley Square', 'Logan Airport'] },
    ],
    nearbyAttractions: [
      { name: 'Heartbreak Hill', type: 'landmark', distance: 'Mile 20', rating: 4.9, description: 'The infamous Newton hills', image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=400', mustTry: 'Run it' },
      { name: 'Freedom Trail', type: 'landmark', distance: 'Downtown', rating: 4.7, description: '2.5-mile historic walk', image: 'https://images.unsplash.com/photo-1563804447971-6e113ab80713?w=400' },
    ],
    localTips: [
      { category: 'Marathon Tips', icon: '🏃', items: ['Arrive early to Hopkinton', 'Pace for Heartbreak Hill', 'Enjoy the Wellesley Scream Tunnel', 'Soak in Boylston finish'] },
      { category: 'Boston Tips', icon: '🦞', items: ['Try New England clam chowder', 'Walk the Freedom Trail', 'Visit Harvard Square', 'Lobster roll essential'] },
    ],
  },
  {
    id: '43',
    title: 'US Open Golf Championship',
    host: 'Golf Grand Slam Tours',
    location: 'Pinehurst, North Carolina',
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800',
    price: '$4,500',
    dates: 'Jun 2025',
    duration: '5 days',
    rating: 4.9,
    tags: ['Golf', 'US Open', 'Major'],
    narrative: 'legacy',
    sportCategory: 'golf',
    storyBeats: [
      { day: 1, title: 'Pinehurst Arrival', description: 'Golf\'s most prestigious test.', location: 'Pinehurst', mood: 'rising', activities: ['RDU arrival', 'Pinehurst village walk', 'Driving range session'], localSpots: ['Pinehurst Village', 'Resort grounds'] },
      { day: 2, title: 'Practice Rounds', description: 'Watch the stars prepare.', location: 'Pinehurst No. 2', mood: 'rising', activities: ['Pro-Am viewing', 'Course walk', 'Equipment expo'], localSpots: ['Pinehurst No. 2', 'Practice facilities'] },
      { day: 3, title: 'Championship Rounds', description: 'Every shot matters at a US Open.', location: 'Pinehurst No. 2', mood: 'rising', activities: ['Opening round viewing', 'Following groups', 'Analysis dinner'], localSpots: ['Signature holes', 'Grandstands'] },
      { day: 4, title: 'Moving Day', description: 'Saturday determines who contends.', location: 'Pinehurst No. 2', mood: 'peak', activities: ['Third round action', 'Leader board watching', 'Prime viewing spots'], localSpots: ['18th grandstand', 'Pine trees'] },
      { day: 5, title: 'Championship Sunday', description: 'The trophy is won on Sunday.', location: 'Pinehurst No. 2', mood: 'peak', activities: ['Final round drama', 'Trophy presentation', 'Film delivery'], localSpots: ['18th hole', 'Clubhouse'] },
    ],
    nearbyAttractions: [
      { name: 'Pinehurst No. 2', type: 'activity', distance: 'On-site', rating: 5.0, description: 'Donald Ross masterpiece', image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400', mustTry: 'Play it after the Open' },
      { name: 'Pinehurst Village', type: 'landmark', distance: 'Walking distance', rating: 4.6, description: 'Charming golf village', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400' },
    ],
    localTips: [
      { category: 'US Open Tips', icon: '⛳', items: ['Wear comfortable shoes', 'Bring sunscreen', 'Follow featured groups', 'Watch at 18th green'] },
      { category: 'Pinehurst Tips', icon: '🏌️', items: ['Book resort tee times early', 'Try Carolina BBQ', 'Explore village shops', 'Play other courses too'] },
    ],
  },
  {
    id: '44',
    title: 'Monaco Yacht Week',
    host: 'Riviera Luxury Experiences',
    location: 'Monaco & French Riviera',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800',
    price: '$12,500',
    dates: 'Sep 2025',
    duration: '6 days',
    rating: 4.95,
    tags: ['Yachting', 'Luxury', 'Monaco'],
    narrative: 'transformation',
    sportCategory: 'f1',
    storyBeats: [
      { day: 1, title: 'Nice Arrival', description: 'The Côte d\'Azur awaits.', location: 'Nice', mood: 'rising', activities: ['Nice airport arrival', 'Promenade des Anglais', 'Welcome dinner'], localSpots: ['Promenade des Anglais', 'Old Nice'] },
      { day: 2, title: 'Monaco Introduction', description: 'Enter the world of opulence.', location: 'Monaco', mood: 'rising', activities: ['Monaco tour', 'Casino visit', 'Harbor yacht viewing'], localSpots: ['Monte Carlo Casino', 'Port Hercules'] },
      { day: 3, title: 'Yacht Show Opening', description: 'Superyachts on display.', location: 'Monaco', mood: 'rising', activities: ['Yacht Show access', 'On-board tours', 'VIP reception'], localSpots: ['Port Hercules', 'Yacht Club'] },
      { day: 4, title: 'Mediterranean Sailing', description: 'Life on the water.', location: 'French Riviera', mood: 'peak', activities: ['Charter experience', 'Swimming stops', 'Sunset champagne'], localSpots: ['Cap Ferrat', 'Villefranche'] },
      { day: 5, title: 'Saint-Tropez Excursion', description: 'The legendary port town.', location: 'Saint-Tropez', mood: 'falling', activities: ['Day trip to St. Tropez', 'Beach club lunch', 'Evening in Monaco'], localSpots: ['Saint-Tropez port', 'Pampelonne Beach'] },
      { day: 6, title: 'Farewell Riviera', description: 'Until we meet again.', location: 'Monaco / Nice', mood: 'falling', activities: ['Morning coffee', 'Film compilation', 'Nice departure'], localSpots: ['Café de Paris', 'Nice Airport'] },
    ],
    nearbyAttractions: [
      { name: 'Monte Carlo Casino', type: 'landmark', distance: 'Monaco center', rating: 4.8, description: 'World\'s most famous casino', image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400', mustTry: 'Evening visit in formal attire' },
      { name: 'Prince\'s Palace', type: 'landmark', distance: 'Monaco-Ville', rating: 4.7, description: 'Official residence of the Prince', image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400' },
    ],
    localTips: [
      { category: 'Yacht Show Tips', icon: '🛥️', items: ['VIP badge essential', 'Dress elegantly', 'Network with industry', 'Book viewings ahead'] },
      { category: 'Monaco Tips', icon: '🇲🇨', items: ['Casino dress code strict', 'Everything is expensive', 'Walk is the best transport', 'Evening is prime time'] },
    ],
  },
  {
    id: '45',
    title: 'Edinburgh Fringe Festival',
    host: 'Arts & Culture Adventures',
    location: 'Edinburgh, Scotland',
    image: 'https://images.unsplash.com/photo-1560371406-dea72cd5099d?w=800',
    price: '$2,400',
    dates: 'Aug 2025',
    duration: '5 days',
    rating: 4.75,
    tags: ['Festival', 'Comedy', 'Arts'],
    narrative: 'discovery',
    sportCategory: 'golf',
    storyBeats: [
      { day: 1, title: 'Edinburgh Arrival', description: 'The world\'s largest arts festival.', location: 'Edinburgh', mood: 'rising', activities: ['Airport arrival', 'Royal Mile exploration', 'First show'], localSpots: ['Royal Mile', 'Old Town'] },
      { day: 2, title: 'Comedy Day', description: 'Laugh until it hurts.', location: 'Edinburgh', mood: 'rising', activities: ['Stand-up marathon', 'Street performers', 'Late-night comedy'], localSpots: ['Pleasance Courtyard', 'Assembly George Square'] },
      { day: 3, title: 'Theater & Drama', description: 'World premieres and breakout shows.', location: 'Edinburgh', mood: 'rising', activities: ['Drama performances', 'Hidden gems hunt', 'Whisky tasting'], localSpots: ['Traverse Theatre', 'Underbelly'] },
      { day: 4, title: 'Festival Full Day', description: 'Show after show.', location: 'Edinburgh', mood: 'peak', activities: ['Multiple shows', 'Street food feast', 'Nightlife exploration'], localSpots: ['Gilded Balloon', 'Cowgate'] },
      { day: 5, title: 'Final Acts', description: 'One last day of magic.', location: 'Edinburgh', mood: 'falling', activities: ['Morning show', 'Arthur\'s Seat option', 'Film delivery'], localSpots: ['Arthur\'s Seat', 'Calton Hill'] },
    ],
    nearbyAttractions: [
      { name: 'Edinburgh Castle', type: 'landmark', distance: 'Old Town', rating: 4.8, description: 'Historic fortress overlooking the city', image: 'https://images.unsplash.com/photo-1560371406-dea72cd5099d?w=400', mustTry: 'Sunset viewing' },
      { name: 'Arthur\'s Seat', type: 'nature', distance: 'Holyrood', rating: 4.7, description: 'Ancient volcano with city views', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400' },
    ],
    localTips: [
      { category: 'Fringe Tips', icon: '🎭', items: ['Book popular shows early', 'Try unknown performers', 'Check free shows', 'Pace yourself'] },
      { category: 'Edinburgh Tips', icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', items: ['Weather changes fast', 'Try haggis', 'Whisky tasting essential', 'Wear good walking shoes'] },
    ],
  },
  {
    id: '46',
    title: 'Tokyo Game Show VIP',
    host: 'Gaming Culture Tours',
    location: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    price: '$3,800',
    dates: 'Sep 2025',
    duration: '6 days',
    rating: 4.8,
    tags: ['Gaming', 'Anime', 'Tokyo'],
    narrative: 'discovery',
    sportCategory: 'mma',
    storyBeats: [
      { day: 1, title: 'Tokyo Landing', description: 'Enter the gaming capital.', location: 'Tokyo', mood: 'rising', activities: ['Haneda arrival', 'Akihabara preview', 'Ramen dinner'], localSpots: ['Haneda', 'Akihabara'] },
      { day: 2, title: 'TGS Day One', description: 'Gaming paradise.', location: 'Makuhari Messe', mood: 'rising', activities: ['TGS entry', 'Major booth visits', 'Demo sessions'], localSpots: ['Makuhari Messe', 'Business Day'] },
      { day: 3, title: 'TGS Day Two', description: 'Public day energy.', location: 'Makuhari Messe', mood: 'peak', activities: ['Public day crowds', 'Exclusive reveals', 'Cosplay watching'], localSpots: ['TGS cosplay area', 'Indie section'] },
      { day: 4, title: 'Akihabara Deep Dive', description: 'Otaku heaven.', location: 'Akihabara', mood: 'rising', activities: ['Retro gaming shops', 'Anime merchandise', 'Maid cafe experience'], localSpots: ['Super Potato', 'Radio Kaikan'] },
      { day: 5, title: 'Tokyo Gaming Culture', description: 'Beyond TGS.', location: 'Tokyo', mood: 'falling', activities: ['VR arcades', 'Shibuya exploration', 'Golden Gai nightlife'], localSpots: ['VR Zone', 'Shibuya crossing'] },
      { day: 6, title: 'Sayonara', description: 'Until next year.', location: 'Tokyo', mood: 'falling', activities: ['Morning sushi', 'Last shopping', 'Film delivery'], localSpots: ['Tsukiji Outer Market', 'Haneda'] },
    ],
    nearbyAttractions: [
      { name: 'Akihabara', type: 'landmark', distance: 'Central Tokyo', rating: 4.9, description: 'Electric Town - gaming and anime mecca', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400', mustTry: 'Super Potato retro gaming store' },
      { name: 'Pokemon Center Mega Tokyo', type: 'shopping', distance: 'Ikebukuro', rating: 4.7, description: 'Flagship Pokemon store', image: 'https://images.unsplash.com/photo-1613771404721-1f92d799e49f?w=400' },
    ],
    localTips: [
      { category: 'TGS Tips', icon: '🎮', items: ['Arrive early for demos', 'Priority passes essential', 'Check announcement schedules', 'Business day calmer'] },
      { category: 'Tokyo Tips', icon: '🇯🇵', items: ['Suica card for transit', 'Cash still preferred', 'Konbini are amazing', 'Queue culture respected'] },
    ],
  },
  {
    id: '47',
    title: 'MotoGP Italian Grand Prix',
    host: 'Motorcycle Racing Tours',
    location: 'Mugello, Italy',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    price: '$3,200',
    dates: 'Jun 2025',
    duration: '4 days',
    rating: 4.9,
    tags: ['MotoGP', 'Racing', 'Italy'],
    narrative: 'rivalry',
    sportCategory: 'f1',
    storyBeats: [
      { day: 1, title: 'Florence Arrival', description: 'Tuscany welcomes the racing world.', location: 'Florence', mood: 'rising', activities: ['Florence airport arrival', 'City quick tour', 'Transfer to Mugello area'], localSpots: ['Florence Duomo', 'Piazza della Signoria'] },
      { day: 2, title: 'Practice & Qualifying', description: 'The track comes alive.', location: 'Mugello Circuit', mood: 'rising', activities: ['Free practice sessions', 'Qualifying drama', 'Paddock atmosphere'], localSpots: ['Mugello Circuit', 'Grandstands'] },
      { day: 3, title: 'Race Day', description: 'Italian GP passion.', location: 'Mugello Circuit', mood: 'peak', activities: ['Moto3 race', 'Moto2 race', 'MotoGP main event'], localSpots: ['Mugello main straight', 'Podium area'] },
      { day: 4, title: 'Tuscan Farewell', description: 'Arrivederci Italia.', location: 'Tuscany / Florence', mood: 'falling', activities: ['Morning in Tuscany', 'Wine tasting option', 'Film delivery departure'], localSpots: ['Chianti region', 'Florence airport'] },
    ],
    nearbyAttractions: [
      { name: 'Mugello Circuit', type: 'activity', distance: 'Scarperia', rating: 4.9, description: 'Historic MotoGP venue', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', mustTry: 'Grandstand experience' },
      { name: 'Florence', type: 'landmark', distance: '30km', rating: 4.9, description: 'Renaissance art capital', image: 'https://images.unsplash.com/photo-1543429258-78066433b4ef?w=400' },
    ],
    localTips: [
      { category: 'MotoGP Tips', icon: '🏍️', items: ['Ear protection essential', 'Come early race day', 'Italian fans are passionate', 'Rossi territory'] },
      { category: 'Tuscany Tips', icon: '🇮🇹', items: ['Book accommodations early', 'Rent a car for area', 'Try Florentine steak', 'Chianti wines'] },
    ],
  },
  {
    id: '48',
    title: 'Cricket World Cup India',
    host: 'Cricket Heritage Tours',
    location: 'Mumbai & Delhi, India',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
    price: '$4,200',
    dates: 'Oct-Nov 2027',
    duration: '12 days',
    rating: 4.85,
    tags: ['Cricket', 'World Cup', 'India'],
    narrative: 'legacy',
    sportCategory: 'fifa',
    storyBeats: [
      { day: 1, title: 'Mumbai Arrival', description: 'Cricket\'s spiritual home.', location: 'Mumbai', mood: 'rising', activities: ['Mumbai airport arrival', 'Marine Drive sunset', 'Welcome dinner'], localSpots: ['Marine Drive', 'Gateway of India'] },
      { day: 2, title: 'Mumbai Cricket Culture', description: 'Where legends are made.', location: 'Mumbai', mood: 'rising', activities: ['Wankhede Stadium tour', 'Cricket museum', 'Local cricket viewing'], localSpots: ['Wankhede Stadium', 'Shivaji Park'] },
      { day: 3, title: 'Group Match Mumbai', description: 'World Cup atmosphere.', location: 'Mumbai', mood: 'rising', activities: ['Pre-match build-up', 'Match experience', 'Post-match celebration'], localSpots: ['Wankhede Stadium', 'Mumbai nightlife'] },
      { day: 4, title: 'Delhi Flight', description: 'Capital city awaits.', location: 'Delhi', mood: 'rising', activities: ['Mumbai to Delhi flight', 'Delhi landmarks tour', 'Street food trail'], localSpots: ['India Gate', 'Chandni Chowk'] },
      { day: 5, title: 'Delhi Match Day', description: 'Feroz Shah Kotla magic.', location: 'Delhi', mood: 'peak', activities: ['Stadium atmosphere', 'Cricket passion', 'Delhi celebration'], localSpots: ['Feroz Shah Kotla', 'Connaught Place'] },
      { day: 6, title: 'Agra Day Trip', description: 'Wonder of the World.', location: 'Agra', mood: 'falling', activities: ['Taj Mahal sunrise', 'Agra Fort visit', 'Return to Delhi'], localSpots: ['Taj Mahal', 'Agra Fort'] },
      { day: 7, title: 'Semi-Final Build', description: 'The stakes rise.', location: 'Delhi', mood: 'rising', activities: ['Fan zone experience', 'Cricket legends meet', 'Pre-match nerves'], localSpots: ['Delhi fan zones', 'Cricket clubs'] },
      { day: 8, title: 'Semi-Final Day', description: 'Edge of your seat cricket.', location: 'Delhi', mood: 'peak', activities: ['Semi-final intensity', 'Heart-stopping moments', 'Victory or heartbreak'], localSpots: ['Stadium atmosphere', 'Celebrations'] },
      { day: 9, title: 'Ahmedabad Transfer', description: 'To the world\'s largest stadium.', location: 'Ahmedabad', mood: 'rising', activities: ['Flight to Ahmedabad', 'Stadium preview', 'Gujarat culture'], localSpots: ['Narendra Modi Stadium exterior', 'Sabarmati Ashram'] },
      { day: 10, title: 'Final Countdown', description: 'Tomorrow decides everything.', location: 'Ahmedabad', mood: 'rising', activities: ['City exploration', 'Fan festivities', 'Pre-final dinner'], localSpots: ['Ahmedabad Old City', 'Fan zones'] },
      { day: 11, title: 'World Cup Final', description: 'The ultimate cricket day.', location: 'Ahmedabad', mood: 'peak', activities: ['132,000 capacity atmosphere', 'World Cup Final', 'Champion crowned'], localSpots: ['Narendra Modi Stadium', 'Trophy celebration'] },
      { day: 12, title: 'Victory Departure', description: 'Memories for a lifetime.', location: 'Ahmedabad', mood: 'falling', activities: ['Morning reflection', 'Film compilation', 'Departure'], localSpots: ['Ahmedabad airport'] },
    ],
    nearbyAttractions: [
      { name: 'Narendra Modi Stadium', type: 'activity', distance: 'Ahmedabad', rating: 5.0, description: 'World\'s largest cricket stadium - 132,000 capacity', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400', mustTry: 'Full capacity experience' },
      { name: 'Taj Mahal', type: 'landmark', distance: 'Agra (from Delhi)', rating: 5.0, description: 'Symbol of eternal love', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400' },
    ],
    localTips: [
      { category: 'Cricket Tips', icon: '🏏', items: ['Tickets sell out fast', 'India matches electric', 'Stadium food improving', 'Expect full days'] },
      { category: 'India Tips', icon: '🇮🇳', items: ['Visa required', 'Street food is amazing', 'Uber works well', 'Respect cricket passion'] },
    ],
  },
  {
    id: '49',
    title: 'Paris Fashion Week',
    host: 'Fashion Capital Tours',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    price: '$8,500',
    dates: 'Sep-Oct 2025',
    duration: '7 days',
    rating: 4.9,
    tags: ['Fashion', 'Luxury', 'Paris'],
    narrative: 'transformation',
    sportCategory: 'tennis',
    storyBeats: [
      { day: 1, title: 'Paris Arrival', description: 'Fashion capital welcomes you.', location: 'Paris', mood: 'rising', activities: ['CDG arrival', 'Hotel Le Marais', 'Welcome aperitif'], localSpots: ['Le Marais', 'Place des Vosges'] },
      { day: 2, title: 'Fashion Foundations', description: 'Understanding haute couture.', location: 'Paris', mood: 'rising', activities: ['Fashion museum visit', 'Designer showrooms', 'Champagne evening'], localSpots: ['Palais Galliera', 'Avenue Montaigne'] },
      { day: 3, title: 'First Shows', description: 'The runway awaits.', location: 'Paris venues', mood: 'rising', activities: ['Designer shows', 'Backstage glimpse', 'After-party'], localSpots: ['Palais de Tokyo', 'Le Grand Palais'] },
      { day: 4, title: 'Major Houses', description: 'Legendary labels showcase.', location: 'Paris', mood: 'peak', activities: ['Major fashion house shows', 'Front row experience', 'Industry dinner'], localSpots: ['Iconic venues', 'Fashion district'] },
      { day: 5, title: 'Street Style Day', description: 'Fashion beyond the runway.', location: 'Paris', mood: 'rising', activities: ['Street style photography', 'Showroom visits', 'Boutique shopping'], localSpots: ['Rue Saint-Honoré', 'Galeries Lafayette'] },
      { day: 6, title: 'Final Collections', description: 'Week\'s grand finale.', location: 'Paris', mood: 'peak', activities: ['Closing shows', 'Capsule collection previews', 'Farewell gala'], localSpots: ['Closing venues', 'Fashion parties'] },
      { day: 7, title: 'Au Revoir Mode', description: 'Until next season.', location: 'Paris', mood: 'falling', activities: ['Brunch at luxury hotel', 'Final shopping', 'Film delivery'], localSpots: ['Café de Flore', 'CDG departure'] },
    ],
    nearbyAttractions: [
      { name: 'Palais Galliera', type: 'activity', distance: '16th arr.', rating: 4.7, description: 'Paris Fashion Museum', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', mustTry: 'Current exhibition' },
      { name: 'Avenue Montaigne', type: 'shopping', distance: '8th arr.', rating: 4.8, description: 'Luxury fashion avenue', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
    ],
    localTips: [
      { category: 'Fashion Week Tips', icon: '👗', items: ['Invitations are everything', 'Dress impeccably', 'Network constantly', 'Instagram moments matter'] },
      { category: 'Paris Tips', icon: '🇫🇷', items: ['September is ideal', 'Reservations essential', 'Taxis during shows', 'After-parties private'] },
    ],
  },
  {
    id: '50',
    title: 'Berlin Marathon Experience',
    host: 'European Running Tours',
    location: 'Berlin, Germany',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    price: '$2,600',
    dates: 'Sep 2025',
    duration: '5 days',
    rating: 4.85,
    tags: ['Marathon', 'Running', 'Berlin'],
    narrative: 'underdog',
    sportCategory: 'cycling',
    storyBeats: [
      { day: 1, title: 'Berlin Arrival', description: 'The world\'s fastest marathon course.', location: 'Berlin', mood: 'rising', activities: ['Berlin arrival', 'Brandenburg Gate preview', 'Check-in'], localSpots: ['Brandenburg Gate', 'Mitte'] },
      { day: 2, title: 'Expo & Prep', description: 'Bib pickup and final prep.', location: 'Berlin', mood: 'rising', activities: ['Marathon Expo', 'Bib collection', 'Course preview'], localSpots: ['Tempelhof', 'Tiergarten'] },
      { day: 3, title: 'Race Day', description: 'Run through history.', location: 'Berlin course', mood: 'peak', activities: ['Marathon start at Tiergarten', '42.195km through Berlin', 'Finish at Brandenburg Gate'], localSpots: ['Tiergarten', 'Potsdamer Platz', 'Brandenburg Gate'] },
      { day: 4, title: 'Recovery Day', description: 'Celebrate your achievement.', location: 'Berlin', mood: 'falling', activities: ['Late breakfast', 'Berlin Wall history', 'Finisher celebration'], localSpots: ['East Side Gallery', 'Checkpoint Charlie'] },
      { day: 5, title: 'Departure', description: 'Auf Wiedersehen Berlin.', location: 'Berlin', mood: 'falling', activities: ['Museum Island option', 'Final sightseeing', 'Film delivery'], localSpots: ['Museum Island', 'Berlin airport'] },
    ],
    nearbyAttractions: [
      { name: 'Brandenburg Gate', type: 'landmark', distance: 'Finish line', rating: 4.9, description: 'Iconic finish line and symbol of unity', image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400', mustTry: 'Crossing the finish line' },
      { name: 'East Side Gallery', type: 'landmark', distance: 'Friedrichshain', rating: 4.8, description: 'Longest remaining section of Berlin Wall', image: 'https://images.unsplash.com/photo-1566404394554-e48a3a2b8e6e?w=400' },
    ],
    localTips: [
      { category: 'Marathon Tips', icon: '🏃', items: ['Course is fast and flat', 'World records set here', 'Enjoy the crowd support', 'Brandenburg finish epic'] },
      { category: 'Berlin Tips', icon: '🇩🇪', items: ['Public transit excellent', 'Try currywurst', 'Visit Berlin Wall sites', 'Craft beer scene strong'] },
    ],
  },
  {
    id: '51',
    title: 'America\'s Cup Auckland',
    host: 'Sailing Experiences NZ',
    location: 'Auckland, New Zealand',
    image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800',
    price: '$6,800',
    dates: 'Mar 2025',
    duration: '7 days',
    rating: 4.9,
    tags: ['Sailing', 'Americas Cup', 'NZ'],
    narrative: 'rivalry',
    sportCategory: 'surfing',
    storyBeats: [
      { day: 1, title: 'Auckland Arrival', description: 'City of Sails.', location: 'Auckland', mood: 'rising', activities: ['Auckland arrival', 'Viaduct Harbour walk', 'Seafood welcome dinner'], localSpots: ['Viaduct Harbour', 'Auckland waterfront'] },
      { day: 2, title: 'America\'s Cup Village', description: 'Team bases and race atmosphere.', location: 'Auckland', mood: 'rising', activities: ['Team base tours', 'Technology exhibits', 'Harbour cruise'], localSpots: ['America\'s Cup Village', 'Team bases'] },
      { day: 3, title: 'Race Day One', description: 'AC75 foiling boats in action.', location: 'Hauraki Gulf', mood: 'rising', activities: ['On-water viewing', 'Race action', 'Analysis dinner'], localSpots: ['Hauraki Gulf', 'Race course'] },
      { day: 4, title: 'Race Day Two', description: 'The competition intensifies.', location: 'Hauraki Gulf', mood: 'peak', activities: ['VIP boat access', 'Dramatic racing', 'Victory celebrations'], localSpots: ['Course viewing areas', 'Waterfront'] },
      { day: 5, title: 'New Zealand Experience', description: 'Beyond the racing.', location: 'Auckland region', mood: 'rising', activities: ['Waiheke Island wine tour', 'Beach time', 'Sunset sailing'], localSpots: ['Waiheke Island', 'Vineyards'] },
      { day: 6, title: 'Final Race Day', description: 'Championship decided.', location: 'Auckland', mood: 'peak', activities: ['Championship racing', 'Trophy presentation', 'Celebration party'], localSpots: ['Race course', 'Viaduct Harbour'] },
      { day: 7, title: 'Kiwi Farewell', description: 'Until the next Cup.', location: 'Auckland', mood: 'falling', activities: ['Morning coffee', 'Film compilation', 'Departure'], localSpots: ['Auckland city', 'Airport'] },
    ],
    nearbyAttractions: [
      { name: 'Viaduct Harbour', type: 'landmark', distance: 'Central', rating: 4.8, description: 'America\'s Cup home base', image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400', mustTry: 'Race day atmosphere' },
      { name: 'Waiheke Island', type: 'nature', distance: '35min ferry', rating: 4.9, description: 'Wine island paradise', image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400' },
    ],
    localTips: [
      { category: 'Americas Cup Tips', icon: '⛵', items: ['Book boat viewing early', 'AC75s are incredible', 'Waterfront is the place', 'Weather can change fast'] },
      { category: 'Auckland Tips', icon: '🇳🇿', items: ['Coffee culture excellent', 'Waiheke worth the trip', 'Seafood is fresh', 'Summer = Jan-Mar'] },
    ],
  },
  {
    id: '52',
    title: 'Six Nations Rugby Grand Slam',
    host: 'European Rugby Tours',
    location: 'Dublin, Cardiff & London',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    price: '$5,200',
    dates: 'Feb-Mar 2025',
    duration: '8 days',
    rating: 4.85,
    tags: ['Rugby', 'Six Nations', 'Europe'],
    narrative: 'rivalry',
    sportCategory: 'fifa',
    storyBeats: [
      { day: 1, title: 'Dublin Arrival', description: 'Rugby capital of Ireland.', location: 'Dublin', mood: 'rising', activities: ['Dublin arrival', 'Temple Bar exploration', 'Guinness toast'], localSpots: ['Temple Bar', 'Grafton Street'] },
      { day: 2, title: 'Ireland Match Day', description: 'The Aviva Stadium roars.', location: 'Dublin', mood: 'peak', activities: ['Pre-match pub atmosphere', 'Ireland Six Nations match', 'Post-match celebrations'], localSpots: ['Aviva Stadium', 'Dublin pubs'] },
      { day: 3, title: 'Irish Culture', description: 'Beyond rugby.', location: 'Dublin', mood: 'rising', activities: ['Guinness Storehouse', 'Trinity College', 'Traditional music pub'], localSpots: ['Guinness Storehouse', 'Temple Bar'] },
      { day: 4, title: 'Cardiff Bound', description: 'To the Welsh capital.', location: 'Cardiff', mood: 'rising', activities: ['Flight to Cardiff', 'City center exploration', 'Welsh welcome'], localSpots: ['Cardiff city center', 'Cardiff Castle'] },
      { day: 5, title: 'Wales Match Day', description: 'Principality Stadium magic.', location: 'Cardiff', mood: 'peak', activities: ['Roof closes', 'Welsh anthem experience', 'Incredible atmosphere'], localSpots: ['Principality Stadium', 'Cardiff pubs'] },
      { day: 6, title: 'London Transfer', description: 'To Twickenham.', location: 'London', mood: 'rising', activities: ['Train to London', 'Twickenham area', 'Richmond exploration'], localSpots: ['Twickenham', 'Richmond'] },
      { day: 7, title: 'England Match Day', description: 'Swing Low at HQ.', location: 'Twickenham', mood: 'peak', activities: ['England match day', 'Twickenham atmosphere', 'Victory or defeat'], localSpots: ['Twickenham', 'Rugby pubs'] },
      { day: 8, title: 'London Farewell', description: 'End of the rugby road.', location: 'London', mood: 'falling', activities: ['London morning', 'Film compilation', 'Departure'], localSpots: ['Central London', 'Heathrow'] },
    ],
    nearbyAttractions: [
      { name: 'Aviva Stadium', type: 'activity', distance: 'Dublin', rating: 4.8, description: 'Ireland\'s rugby home', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400', mustTry: 'Fields of Athenry singing' },
      { name: 'Principality Stadium', type: 'activity', distance: 'Cardiff center', rating: 4.9, description: 'Retractable roof atmosphere', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400' },
    ],
    localTips: [
      { category: 'Six Nations Tips', icon: '🏉', items: ['Book accommodations early', 'Each country unique', 'Pub culture essential', 'Learn the anthems'] },
      { category: 'Travel Tips', icon: '✈️', items: ['Flights book up fast', 'Match day trains packed', 'Pubs open early', 'Weather unpredictable'] },
    ],
  },
  {
    id: '53',
    title: 'World Surf League Portugal',
    host: 'Surf Tours Europe',
    location: 'Peniche & Nazare, Portugal',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
    price: '$2,800',
    dates: 'Oct 2025',
    duration: '6 days',
    rating: 4.8,
    tags: ['Surfing', 'WSL', 'Portugal'],
    narrative: 'discovery',
    sportCategory: 'surfing',
    storyBeats: [
      { day: 1, title: 'Lisbon Arrival', description: 'Gateway to Portuguese surf.', location: 'Lisbon', mood: 'rising', activities: ['Lisbon arrival', 'City exploration', 'Seafood dinner'], localSpots: ['Baixa', 'Alfama'] },
      { day: 2, title: 'Peniche Transfer', description: 'Europe\'s surf capital.', location: 'Peniche', mood: 'rising', activities: ['Drive to Peniche', 'Supertubos preview', 'Contest atmosphere'], localSpots: ['Supertubos', 'Peniche fortress'] },
      { day: 3, title: 'WSL Championship Day', description: 'World\'s best compete.', location: 'Supertubos', mood: 'peak', activities: ['Contest viewing', 'Beach atmosphere', 'Pro surf analysis'], localSpots: ['Supertubos', 'Contest zone'] },
      { day: 4, title: 'Nazare Big Wave', description: 'The monster wave capital.', location: 'Nazare', mood: 'rising', activities: ['Nazare day trip', 'Lighthouse viewing', 'Big wave history'], localSpots: ['Nazare Canyon', 'Fort of São Miguel'] },
      { day: 5, title: 'Final Contest Day', description: 'Champions crowned.', location: 'Peniche', mood: 'peak', activities: ['Finals day', 'Trophy presentation', 'Beach party'], localSpots: ['Supertubos', 'Contest village'] },
      { day: 6, title: 'Adeus Portugal', description: 'Surf memories forever.', location: 'Lisbon', mood: 'falling', activities: ['Return to Lisbon', 'Pastéis de Belém', 'Film delivery'], localSpots: ['Belém', 'Lisbon airport'] },
    ],
    nearbyAttractions: [
      { name: 'Supertubos', type: 'nature', distance: 'Peniche', rating: 5.0, description: 'One of Europe\'s best waves', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400', mustTry: 'Watch from the sand' },
      { name: 'Nazare', type: 'landmark', distance: '1 hour from Peniche', rating: 4.9, description: 'Home of giant waves', image: 'https://images.unsplash.com/photo-1509914398892-963f53e6e2f1?w=400' },
    ],
    localTips: [
      { category: 'WSL Tips', icon: '🏄', items: ['Contest depends on waves', 'Check WSL app', 'Best views from beach', 'Early arrival essential'] },
      { category: 'Portugal Tips', icon: '🇵🇹', items: ['Portuguese wine excellent', 'Seafood is fresh daily', 'Affordable vs other Europe', 'Locals very friendly'] },
    ],
  },
  {
    id: '54',
    title: 'Grand Sumo Tournament Tokyo',
    host: 'Japan Culture Tours',
    location: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1590058638573-f6ba4c1d1c57?w=800',
    price: '$3,600',
    dates: 'Jan/May/Sep 2025',
    duration: '5 days',
    rating: 4.9,
    tags: ['Sumo', 'Traditional', 'Japan'],
    narrative: 'legacy',
    sportCategory: 'mma',
    storyBeats: [
      { day: 1, title: 'Tokyo Arrival', description: 'Ancient sport awaits.', location: 'Tokyo', mood: 'rising', activities: ['Haneda arrival', 'Ryogoku district preview', 'Welcome dinner'], localSpots: ['Ryogoku', 'Sumo district'] },
      { day: 2, title: 'Sumo Culture', description: 'Understanding the way.', location: 'Ryogoku', mood: 'rising', activities: ['Sumo museum visit', 'Morning practice viewing', 'Chanko nabe lunch'], localSpots: ['Sumo Museum', 'Sumo stables'] },
      { day: 3, title: 'Tournament Day One', description: 'Ryogoku Kokugikan.', location: 'Ryogoku', mood: 'rising', activities: ['Full day tournament', 'Box seat experience', 'Ceremony viewing'], localSpots: ['Ryogoku Kokugikan', 'Ring ceremony'] },
      { day: 4, title: 'Tournament Day Two', description: 'Top division bouts.', location: 'Ryogoku', mood: 'peak', activities: ['Makuuchi division', 'Yokozuna matches', 'Post-tournament area'], localSpots: ['Stadium', 'Ryogoku streets'] },
      { day: 5, title: 'Sayonara Tokyo', description: 'Tradition remembered.', location: 'Tokyo', mood: 'falling', activities: ['Asakusa morning', 'Temple visit', 'Film delivery'], localSpots: ['Senso-ji Temple', 'Haneda departure'] },
    ],
    nearbyAttractions: [
      { name: 'Ryogoku Kokugikan', type: 'activity', distance: 'Ryogoku', rating: 4.9, description: 'Sumo\'s holy ground', image: 'https://images.unsplash.com/photo-1590058638573-f6ba4c1d1c57?w=400', mustTry: 'Box seat experience' },
      { name: 'Sumo Stables', type: 'activity', distance: 'Ryogoku area', rating: 4.8, description: 'Watch morning practice', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400' },
    ],
    localTips: [
      { category: 'Sumo Tips', icon: '🤼', items: ['Tickets sell out months ahead', 'Arrive early afternoon', 'Box seats include food', 'Ceremony is beautiful'] },
      { category: 'Japan Tips', icon: '🇯🇵', items: ['Try chanko nabe (sumo stew)', 'Respect the tradition', 'Photography limited', 'Learn basic etiquette'] },
    ],
  },
  {
    id: '55',
    title: 'Le Mans 24 Hours Classic',
    host: 'Motorsport Heritage Tours',
    location: 'Le Mans, France',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
    price: '$3,400',
    dates: 'Jun 2025',
    duration: '5 days',
    rating: 4.95,
    tags: ['Le Mans', '24 Hours', 'Racing'],
    narrative: 'underdog',
    sportCategory: 'f1',
    storyBeats: [
      { day: 1, title: 'Le Mans Arrival', description: 'Motorsport\'s ultimate endurance test.', location: 'Le Mans', mood: 'rising', activities: ['Paris to Le Mans', 'Circuit preview', 'Village atmosphere'], localSpots: ['Circuit de la Sarthe', 'Le Mans village'] },
      { day: 2, title: 'Qualifying Day', description: 'Hyperpole drama.', location: 'Circuit de la Sarthe', mood: 'rising', activities: ['Qualifying sessions', 'Paddock access', 'Team preparations'], localSpots: ['Pit lane', 'Grandstands'] },
      { day: 3, title: 'Race Day Start', description: 'The green flag drops at 4pm.', location: 'Circuit de la Sarthe', mood: 'peak', activities: ['Pre-race ceremonies', 'Race start', 'Night racing begins'], localSpots: ['Start/Finish', 'Porsche Curves'] },
      { day: 4, title: 'Through the Night', description: 'Racing under the stars.', location: 'Circuit de la Sarthe', mood: 'peak', activities: ['Night viewing', 'Camping atmosphere', 'Dawn return'], localSpots: ['Mulsanne Corner', 'Indianapolis'] },
      { day: 5, title: 'Checkered Flag', description: 'Champions after 24 hours.', location: 'Circuit de la Sarthe', mood: 'falling', activities: ['Race finish', 'Podium ceremony', 'Film delivery'], localSpots: ['Victory lane', 'Le Mans podium'] },
    ],
    nearbyAttractions: [
      { name: 'Circuit de la Sarthe', type: 'activity', distance: 'Le Mans', rating: 5.0, description: '13.6km legendary circuit', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400', mustTry: 'Night racing viewing' },
      { name: 'Le Mans Cathedral', type: 'landmark', distance: 'City center', rating: 4.6, description: 'Gothic masterpiece', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400' },
    ],
    localTips: [
      { category: 'Le Mans Tips', icon: '🏁', items: ['Camping is the experience', 'Bring layers for night', 'General admission access great', '24 hours is a marathon'] },
      { category: 'France Tips', icon: '🇫🇷', items: ['Book early - sells out', 'TGV from Paris easy', 'French fans passionate', 'Bring your own food/drinks'] },
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
      { name: 'Jake', avatar: '🧔', from: 'Colorado', bio: 'Ex-ski instructor, chasing the deepest powder', sportInterests: ['skiing', 'surfing', 'mma'], travelStyle: 'Adventure-first', nationality: 'us', relationshipStatus: 'single', age: 32, mbtiType: 'ESTP' },
      { name: 'Mika', avatar: '👩', from: 'Tokyo', bio: 'Weekend warrior, weekday designer', sportInterests: ['skiing', 'tennis', 'f1'], travelStyle: 'Balanced', nationality: 'jp', relationshipStatus: 'single', age: 28, mbtiType: 'ISFP' },
      { name: 'Tom', avatar: '👨', from: 'Vancouver', bio: 'Backcountry guide, mountain photographer', sportInterests: ['skiing', 'nhl', 'golf'], travelStyle: 'Off-the-beaten-path', nationality: 'ca', relationshipStatus: 'couple', age: 35, mbtiType: 'ISTP' },
      { name: 'Lisa', avatar: '👱‍♀️', from: 'Zurich', bio: 'Alpine ski racer turned freerider', sportInterests: ['skiing', 'f1', 'tennis'], travelStyle: 'Luxury comfort', nationality: 'ch', relationshipStatus: 'looking', age: 29, mbtiType: 'ENTJ' },
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
      { name: 'Emma', avatar: '👩‍🦰', from: 'Sydney', bio: 'Marketing exec who lives for travel', sportInterests: ['skiing', 'surfing', 'tennis'], travelStyle: 'Social butterfly', nationality: 'au', relationshipStatus: 'single', age: 31, mbtiType: 'ENFP' },
      { name: 'Marco', avatar: '🧔‍♂️', from: 'Milan', bio: 'Fashion industry, weekend skier', sportInterests: ['skiing', 'fifa', 'f1'], travelStyle: 'Stylish & social', nationality: 'it', relationshipStatus: 'looking', age: 34, mbtiType: 'ESFP' },
      { name: 'Sarah', avatar: '👩‍🦱', from: 'London', bio: 'Finance by day, foodie by night', sportInterests: ['skiing', 'tennis', 'golf'], travelStyle: 'Culinary explorer', nationality: 'uk', relationshipStatus: 'couple', age: 30, mbtiType: 'ESTJ' },
      { name: 'Chris', avatar: '👨‍🦲', from: 'NYC', bio: 'Tech founder, first-time powder chaser', sportInterests: ['nba', 'skiing', 'golf'], travelStyle: 'Experience collector', nationality: 'us', relationshipStatus: 'single', age: 36, mbtiType: 'ENTP' },
      { name: 'Yuki', avatar: '👧', from: 'Osaka', bio: 'Local expert, sushi sommelier', sportInterests: ['skiing', 'mlb', 'f1'], travelStyle: 'Cultural immersion', nationality: 'jp', relationshipStatus: 'married', age: 33, mbtiType: 'ISFJ' },
      { name: 'Alex', avatar: '🧑', from: 'Berlin', bio: 'DJ & snowboard enthusiast', sportInterests: ['skiing', 'fifa', 'mma'], travelStyle: 'Night owl', nationality: 'de', relationshipStatus: 'single', age: 27, mbtiType: 'ESFP' },
      { name: 'Nina', avatar: '👩', from: 'Paris', bio: 'Wine journalist exploring sake', sportInterests: ['skiing', 'tennis', 'f1'], travelStyle: 'Gourmet traveler', nationality: 'fr', relationshipStatus: 'looking', age: 32, mbtiType: 'INFP' },
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
      { name: 'David', avatar: '👨', from: 'Seattle', bio: 'Software engineer, yoga practitioner', sportInterests: ['skiing', 'golf', 'nba'], travelStyle: 'Mindful explorer', nationality: 'us', relationshipStatus: 'married', age: 38, mbtiType: 'INFJ' },
      { name: 'Amy', avatar: '👩', from: 'Portland', bio: 'Photographer capturing quiet moments', sportInterests: ['skiing', 'surfing', 'tennis'], travelStyle: 'Slow travel', nationality: 'us', relationshipStatus: 'couple', age: 29, mbtiType: 'INFP' },
      { name: 'Max', avatar: '👦', from: 'Munich', bio: 'Architect, design enthusiast', sportInterests: ['skiing', 'f1', 'fifa'], travelStyle: 'Design-focused', nationality: 'de', relationshipStatus: 'single', age: 31, mbtiType: 'INTJ' },
      { name: 'Sophie', avatar: '👧', from: 'Amsterdam', bio: 'Sustainability consultant, nature lover', sportInterests: ['skiing', 'surfing', 'tennis'], travelStyle: 'Eco-conscious', nationality: 'nl', relationshipStatus: 'looking', age: 27, mbtiType: 'ENFJ' },
      { name: 'James', avatar: '🧔', from: 'Auckland', bio: 'Remote worker, endless summer chaser', sportInterests: ['skiing', 'surfing', 'mma'], travelStyle: 'Digital nomad', nationality: 'nz', relationshipStatus: 'single', age: 33, mbtiType: 'INTP' },
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
      { name: 'Marcus', avatar: '👨‍🦱', from: 'Chicago', bio: 'Former college player, now biggest fan', sportInterests: ['nba', 'nfl', 'mlb'], travelStyle: 'Stadium hopper', nationality: 'us', relationshipStatus: 'married', age: 35, mbtiType: 'ESFJ' },
      { name: 'Jasmine', avatar: '👩', from: 'Atlanta', bio: 'Sports journalist covering the league', sportInterests: ['nba', 'nfl', 'fifa'], travelStyle: 'Press pass pro', nationality: 'us', relationshipStatus: 'single', age: 29, mbtiType: 'ENFJ' },
      { name: 'Derek', avatar: '🧔', from: 'Oakland', bio: 'Warriors fan since day one', sportInterests: ['nba', 'mlb', 'mma'], travelStyle: 'Authentic local', nationality: 'us', relationshipStatus: 'couple', age: 42, mbtiType: 'ISTJ' },
      { name: 'Kim', avatar: '👧', from: 'Seoul', bio: 'K-pop manager, NBA superfan', sportInterests: ['nba', 'fifa', 'f1'], travelStyle: 'VIP experience', nationality: 'kr', relationshipStatus: 'single', age: 26, mbtiType: 'ENFP' },
      { name: 'Tyler', avatar: '👨', from: 'Phoenix', bio: 'Fantasy basketball champion 3x', sportInterests: ['nba', 'nfl', 'golf'], travelStyle: 'Stats nerd', nationality: 'us', relationshipStatus: 'looking', age: 31, mbtiType: 'INTP' },
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
      { name: 'Robert', avatar: '🧔', from: 'Scottsdale', bio: 'Single-digit handicap, Masters dreamer', sportInterests: ['golf', 'tennis', 'nfl'], travelStyle: 'Country club', nationality: 'us', relationshipStatus: 'married', age: 52, mbtiType: 'ESTJ' },
      { name: 'Catherine', avatar: '👩', from: 'Edinburgh', bio: 'Links golf purist, whisky connoisseur', sportInterests: ['golf', 'tennis', 'f1'], travelStyle: 'Traditional luxury', nationality: 'uk', relationshipStatus: 'married', age: 48, mbtiType: 'ISTJ' },
      { name: 'Hiroshi', avatar: '👨', from: 'Kyoto', bio: 'Business exec, 5am tee time warrior', sportInterests: ['golf', 'mlb', 'f1'], travelStyle: 'Early bird', nationality: 'jp', relationshipStatus: 'married', age: 55, mbtiType: 'ENTJ' },
      { name: 'Patricia', avatar: '👱‍♀️', from: 'Palm Beach', bio: 'Golf philanthropist, charity tournament queen', sportInterests: ['golf', 'tennis', 'nba'], travelStyle: 'Social networker', nationality: 'us', relationshipStatus: 'married', age: 45, mbtiType: 'ESFJ' },
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
      { name: 'Carlos', avatar: '🧔‍♂️', from: 'Barcelona', bio: 'Més que un club - lifetime member', sportInterests: ['fifa', 'f1', 'tennis'], travelStyle: 'Pilgrimage maker', nationality: 'es', relationshipStatus: 'couple', age: 34, mbtiType: 'ESFP' },
      { name: 'Priya', avatar: '👩', from: 'Mumbai', bio: 'Arsenal supporter, cricket convert', sportInterests: ['fifa', 'tennis', 'f1'], travelStyle: 'Global fan', nationality: 'in', relationshipStatus: 'single', age: 28, mbtiType: 'ENFP' },
      { name: 'Hans', avatar: '👨', from: 'Munich', bio: 'Bayern faithful, Oktoberfest host', sportInterests: ['fifa', 'f1', 'skiing'], travelStyle: 'Beer & football', nationality: 'de', relationshipStatus: 'married', age: 39, mbtiType: 'ESTJ' },
      { name: 'Lucia', avatar: '👧', from: 'Buenos Aires', bio: 'Maradona is religion, Messi is proof', sportInterests: ['fifa', 'tennis', 'mma'], travelStyle: 'Emotional traveler', nationality: 'ar', relationshipStatus: 'looking', age: 25, mbtiType: 'ISFP' },
      { name: 'Ahmed', avatar: '🧔', from: 'Cairo', bio: 'Liverpool never walks alone', sportInterests: ['fifa', 'mma', 'f1'], travelStyle: 'Passionate pilgrim', nationality: 'ae', relationshipStatus: 'family', age: 37, mbtiType: 'ESFJ' },
      { name: 'Sophie', avatar: '👩‍🦰', from: 'Lyon', bio: 'Women\'s football advocate, coach', sportInterests: ['fifa', 'tennis', 'surfing'], travelStyle: 'Activist traveler', nationality: 'fr', relationshipStatus: 'single', age: 30, mbtiType: 'ENFJ' },
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
      { name: 'Mike & Sarah', avatar: '👨‍👩‍👧', from: 'Denver', bio: 'Teaching our kids to love the mountains', sportInterests: ['skiing', 'nfl', 'mlb'], travelStyle: 'Family adventure', nationality: 'us', relationshipStatus: 'family', age: 42, mbtiType: 'ISFJ' },
      { name: 'Kenji & Yumi', avatar: '👨‍👩‍👦', from: 'Nagoya', bio: 'Family of powder lovers since the kids were 3', sportInterests: ['skiing', 'mlb', 'f1'], travelStyle: 'Early bedtime', nationality: 'jp', relationshipStatus: 'family', age: 38, mbtiType: 'ISTJ' },
      { name: 'The Smiths', avatar: '👨‍👩‍👧‍👦', from: 'Melbourne', bio: '4 kids, 8 skis, endless energy', sportInterests: ['skiing', 'surfing', 'tennis'], travelStyle: 'Organized chaos', nationality: 'au', relationshipStatus: 'family', age: 44, mbtiType: 'ESFJ' },
      { name: 'Anna & Peter', avatar: '👨‍👩‍👧', from: 'Stockholm', bio: 'Swedish ski family seeking new slopes', sportInterests: ['skiing', 'nhl', 'fifa'], travelStyle: 'Nordic style', nationality: 'ch', relationshipStatus: 'family', age: 36, mbtiType: 'INFJ' },
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
      { name: 'Jake & Emily', avatar: '💑', from: 'San Francisco', bio: 'Just married! First trip as Mr & Mrs', sportInterests: ['skiing', 'golf', 'tennis'], travelStyle: 'Romance first', nationality: 'us', relationshipStatus: 'couple', age: 30, mbtiType: 'ENFJ' },
      { name: 'Pierre & Marie', avatar: '💑', from: 'Paris', bio: 'Celebrating 5 years together', sportInterests: ['skiing', 'f1', 'tennis'], travelStyle: 'Gourmet romance', nationality: 'fr', relationshipStatus: 'couple', age: 33, mbtiType: 'INFP' },
      { name: 'Raj & Ananya', avatar: '💑', from: 'Mumbai', bio: 'Newlyweds exploring the world', sportInterests: ['skiing', 'fifa', 'tennis'], travelStyle: 'Cultural couple', nationality: 'in', relationshipStatus: 'couple', age: 28, mbtiType: 'ESFP' },
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
    cycling: [
      { id: 'sport1', prompt: 'Epic mountain backdrop', tip: 'Stop at a viewpoint with your bike', uploaded: false },
      { id: 'sport2', prompt: 'Descending the trail', tip: 'Ask someone to film your descent', uploaded: false },
      { id: 'sport3', prompt: 'Post-ride celebration', tip: 'Cold drink, tired legs, big smiles', uploaded: false },
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
  { id: 'gu3', fileName: 'game_moment.mp4', thumbnail: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=200', uploadedBy: 'Sarah M.', uploadedAt: '45 min ago', type: 'video', selected: true },
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
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    const saved = localStorage.getItem('storyTrip_userEmail');
    return saved || null;
  });
  const [bookedTrips, setBookedTrips] = useState<{ trip: Trip; squad: Squad; bookedAt: string; status: 'booked' | 'saved' }[]>(() => {
    const saved = localStorage.getItem('storyTrip_bookedTrips');
    return saved ? JSON.parse(saved) : [];
  });
  const [templateTrip, setTemplateTrip] = useState<Trip | null>(null);
  const [profileSource, setProfileSource] = useState<'default' | 'squad-browse' | 'trips'>('default');

  const handleCreateOwnFromTemplate = (trip: Trip) => {
    setTemplateTrip(trip);
    setScreen('create-trip');
  };

  const handleSaveEmail = (email: string) => {
    setUserEmail(email);
    localStorage.setItem('storyTrip_userEmail', email);
  };

  const handleBookTrip = (squad: Squad) => {
    if (!selectedTrip) return;
    const newBooking = {
      trip: selectedTrip,
      squad,
      bookedAt: new Date().toISOString(),
      status: 'booked' as const
    };
    const updated = [...bookedTrips.filter(b => b.trip.id !== selectedTrip.id), newBooking];
    setBookedTrips(updated);
    localStorage.setItem('storyTrip_bookedTrips', JSON.stringify(updated));
    setSelectedSquad(squad);
    // Navigate to Story Studio Director to create album/videos
    setScreen('memory-maker');
  };

  const handleSaveForLater = (squad: Squad) => {
    if (!selectedTrip) return;
    const newSave = {
      trip: selectedTrip,
      squad,
      bookedAt: new Date().toISOString(),
      status: 'saved' as const
    };
    const updated = [...bookedTrips.filter(b => b.trip.id !== selectedTrip.id), newSave];
    setBookedTrips(updated);
    localStorage.setItem('storyTrip_bookedTrips', JSON.stringify(updated));
    setSelectedSquad(squad);
    setScreen('manage-trips');
  };

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
            onSquad={() => setScreen('squad-browse')}
            onFilm={() => setScreen('film-studio')}
            onStoryDirector={() => setScreen('story-director')}
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
            onCreateTrip={() => {
              setTemplateTrip(null);
              setScreen('create-trip');
            }}
            onCopyAsTemplate={(listing) => {
              const trip = convertTripListingToTrip(listing);
              setTemplateTrip(trip);
              setScreen('create-trip');
            }}
          />
        )}

        {screen === 'personal-interest' && (
          <PersonalInterestScreen
            key="personal-interest"
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onContinue={() => setScreen('narrative')}
            onBack={() => {
              // Navigate back based on where user came from
              if (profileSource === 'squad-browse') {
                setScreen('squad-browse');
              } else if (profileSource === 'trips') {
                setScreen('narrative');
              } else {
                setScreen('landing');
              }
              setProfileSource('default');
            }}
            onFindTrips={() => { setProfileSource('default'); setScreen('trips'); }}
            onFindSquadMatch={() => { setProfileSource('default'); setScreen('squad-browse'); }}
            onFindMatchTrips={() => { setProfileSource('default'); setScreen('trips'); }}
            source={profileSource}
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
            onBack={() => { setTemplateTrip(null); setScreen('landing'); }}
            onSubmit={() => { setTemplateTrip(null); setScreen('landing'); }}
            onManageTrips={() => { setTemplateTrip(null); setScreen('manage-trips'); }}
            templateTrip={templateTrip}
          />
        )}

        {screen === 'manage-trips' && (
          <ManageTripsScreen
            key="manage-trips"
            onBack={() => setScreen('landing')}
            onViewTrip={(t) => { setSelectedTrip(t); setScreen('trip-detail'); }}
            bookedTrips={bookedTrips}
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
            onNavigateToProfile={() => { setProfileSource('trips'); setScreen('personal-interest'); }}
            onBackToHome={() => setScreen('landing')}
            onUpdateProfile={(updates) => setUserProfile(prev => ({ ...prev, ...updates }))}
          />
        )}

        {screen === 'trip-detail' && selectedTrip && (
          <TripDetailScreen
            key="trip-detail"
            trip={selectedTrip}
            onContinue={() => setScreen('squad')}
            onBack={() => setScreen('trips')}
            onCreateOwn={() => handleCreateOwnFromTemplate(selectedTrip)}
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
            onBookTrip={handleBookTrip}
            onSaveForLater={handleSaveForLater}
          />
        )}

        {screen === 'squad-browse' && (
          <SquadBrowseScreen
            key="squad-browse"
            squads={squads}
            trips={trips}
            userProfile={userProfile}
            onViewTrip={(trip) => {
              setSelectedTrip(trip);
              setScreen('trip-detail');
            }}
            onJoinTrip={(trip, squad) => {
              setSelectedTrip(trip);
              setSelectedSquad(squad);
              handleBookTrip(squad);
            }}
            onBack={() => setScreen('landing')}
            onCompleteProfile={() => { setProfileSource('squad-browse'); setScreen('personal-interest'); }}
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
            onManageTrips={() => setScreen('manage-trips')}
            userEmail={userEmail}
            onSaveEmail={handleSaveEmail}
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

        {screen === 'story-director' && (
          <StoryDirectorScreen
            key="story-director"
            trip={selectedTrip}
            squad={selectedSquad}
            squads={squads}
            bookedTrips={bookedTrips}
            onBack={() => setScreen('landing')}
            userEmail={userEmail}
            onSaveEmail={handleSaveEmail}
            onShowProModal={() => setShowProModal(true)}
          />
        )}
      </AnimatePresence>

      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  );
}

// ============ LANDING SCREEN ============
function LandingScreen({ onStart, onDemo, onAbout, onCreateTrip, onSignIn, onManageTrips, onChatStart, onSquad, onFilm, onStoryDirector }: { onStart: () => void; onDemo: () => void; onAbout: () => void; onCreateTrip: () => void; onSignIn: () => void; onManageTrips: () => void; onChatStart: () => void; onSquad: () => void; onFilm: () => void; onStoryDirector: () => void }) {
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

            {/* Combined Brand + Tagline in One Line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 w-full px-4"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-white/80 whitespace-nowrap text-center" style={{ fontSize: 'clamp(1.2rem, 4vw, 3rem)' }}>
                Your <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-teal-200 to-white" style={{ fontSize: 'clamp(2rem, 8vw, 6rem)' }}>Story</span> Starts with the <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-terra-400 via-terra-300 to-teal-400" style={{ fontSize: 'clamp(2rem, 8vw, 6rem)' }}>Trip</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/70 mb-10"
            >
              Tell us your Dream, we create the journey!
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
                className="btn bg-white text-warm-800 text-xl px-12 py-5 shadow-2xl shadow-black/30 hover:shadow-3xl hover:scale-105 transition-all flex items-center justify-center gap-3 rounded-2xl border-2 border-white/50 hover:bg-cream-100"
              >
                <MessageCircle className="w-6 h-6 text-teal-600" />
                How can I help?
                <ChevronRight className="w-5 h-5 text-terra-500" />
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
                  onClick={onStoryDirector}
                  className="group btn bg-white/10 backdrop-blur-sm text-white border border-white/30 px-6 py-4 hover:bg-white/20 flex flex-col items-center gap-1 min-w-[160px] rounded-xl transition-all hover:scale-105"
                >
                  <span className="text-2xl mb-1">🎬</span>
                  <span className="font-semibold">Story Director</span>
                  <span className="text-xs text-white/60">Create videos & albums</span>
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

function ChatOnboardingScreen({ onSelectTrip, onBack, onCreateTrip, onCopyAsTemplate }: {
  onSelectTrip: (trip: TripListing) => void;
  onBack: () => void;
  onCreateTrip: () => void;
  onCopyAsTemplate: (trip: TripListing) => void;
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
                      <div className="space-y-4 ml-13 pl-1 mt-4">
                        {/* Formatted Recommendation Summary */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-cream-50 to-teal-50 rounded-2xl p-5 border border-cream-200"
                        >
                          <h3 className="font-display font-bold text-warm-900 text-lg mb-4">Based on your preferences, here are my top picks:</h3>
                          <div className="space-y-4">
                            {message.recommendedTrips.map((trip, index) => (
                              <div key={trip.id} className="pb-4 border-b border-cream-200 last:border-0 last:pb-0">
                                <p className="text-warm-800">
                                  <span className="font-bold text-teal-700">Option {index + 1}: {trip.title}</span>
                                </p>
                                <p className="text-warm-600 text-sm mt-1">
                                  {trip.location} • {trip.duration} • {trip.price}
                                </p>
                                <p className="text-warm-500 text-sm mt-1">
                                  {trip.tags.slice(0, 4).join(' • ')}
                                </p>
                                <button
                                  onClick={() => onSelectTrip(trip)}
                                  className="mt-2 text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1 hover:underline"
                                >
                                  View details & book <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Trip Cards */}
                        <p className="text-warm-600 text-sm font-medium">Quick preview cards:</p>
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

                        {/* Don't Like These? Create Your Own */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="mt-4 pt-4 border-t border-cream-200"
                        >
                          <div className="bg-gradient-to-r from-purple-50 to-amber-50 rounded-2xl p-4 border border-purple-200">
                            <p className="text-warm-700 font-medium mb-3 flex items-center gap-2">
                              <Edit3 className="w-4 h-4 text-purple-600" />
                              Don't see what you're looking for?
                            </p>
                            <p className="text-warm-600 text-sm mb-4">
                              Create your own custom trip! You can start from scratch or use one of these recommendations as a template.
                            </p>
                            <div className="space-y-2">
                              <button
                                onClick={onCreateTrip}
                                className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                Create My Own Trip from Scratch
                              </button>
                              <p className="text-warm-500 text-xs text-center my-2">or use a recommendation as starting point:</p>
                              <div className="grid grid-cols-1 gap-2">
                                {message.recommendedTrips.slice(0, 3).map((trip, idx) => (
                                  <button
                                    key={trip.id}
                                    onClick={() => onCopyAsTemplate(trip)}
                                    className="px-4 py-2 bg-white hover:bg-purple-50 border border-purple-200 rounded-xl text-warm-700 text-sm transition-all flex items-center justify-between group"
                                  >
                                    <span className="flex items-center gap-2">
                                      <Copy className="w-4 h-4 text-purple-500" />
                                      <span>Copy <strong>Option {idx + 1}</strong> as template</span>
                                    </span>
                                    <span className="text-warm-400 text-xs group-hover:text-purple-600">{trip.title.substring(0, 20)}...</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* External Platform Links */}
                        {message.externalLinks && message.externalLinks.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
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
  onFindTrips,
  onFindSquadMatch,
  onFindMatchTrips,
  userProfile,
  setUserProfile,
  source = 'default'
}: {
  onContinue: () => void;
  onBack: () => void;
  onFindTrips: () => void;
  onFindSquadMatch: () => void;
  onFindMatchTrips: () => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  source?: 'default' | 'squad-browse' | 'trips';
}) {
  const [interestTab, setInterestTab] = useState<'sports' | 'entertainment' | 'lifestyle'>('sports');
  const [expandedMbtiCategory, setExpandedMbtiCategory] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [saveEmail, setSaveEmail] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

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

  // Save profile and go directly to trips
  const handleFindTrips = () => {
    const savedProfile = {
      ...userProfile,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('storyTrip_userProfile', JSON.stringify(savedProfile));
    onFindTrips();
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

          {/* Personality Type - Grouped by Category */}
          <div className="space-y-3 mb-6">
            <label className="text-base font-medium text-warm-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Personality Type (MBTI)
              <span className="text-xs text-warm-500 font-normal">Optional</span>
            </label>

            {/* 4 Category Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {mbtiCategories.map((category) => {
                const isExpanded = expandedMbtiCategory === category.id;
                const hasSelectedType = category.types.includes(userProfile.personality as PersonalityType);
                const colorClasses = {
                  purple: { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-700', hover: 'hover:border-purple-300' },
                  green: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', hover: 'hover:border-green-300' },
                  blue: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700', hover: 'hover:border-blue-300' },
                  orange: { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-700', hover: 'hover:border-orange-300' },
                }[category.color] || { bg: 'bg-gray-50', border: 'border-gray-500', text: 'text-gray-700', hover: 'hover:border-gray-300' };

                return (
                  <div key={category.id} className="space-y-2">
                    <button
                      onClick={() => setExpandedMbtiCategory(isExpanded ? null : category.id)}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                        hasSelectedType || isExpanded
                          ? `${colorClasses.border} ${colorClasses.bg} shadow-md`
                          : `border-cream-200 bg-white ${colorClasses.hover}`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{category.emoji}</span>
                        <ChevronDown className={`w-4 h-4 text-warm-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                      <p className={`font-semibold text-sm mt-1 ${hasSelectedType ? colorClasses.text : 'text-warm-800'}`}>
                        {category.name}
                      </p>
                      <p className="text-xs text-warm-500">{category.description}</p>
                      {hasSelectedType && (
                        <p className={`text-xs font-medium mt-1 ${colorClasses.text}`}>
                          Selected: {userProfile.personality}
                        </p>
                      )}
                    </button>

                    {/* Expanded Types */}
                    {isExpanded && (
                      <div className="grid grid-cols-2 gap-2 pl-1">
                        {category.types.map((typeId) => {
                          const pType = personalityTypes.find(p => p.id === typeId);
                          return (
                            <button
                              key={typeId}
                              onClick={() => setUserProfile({ ...userProfile, personality: userProfile.personality === typeId ? null : typeId })}
                              className={`p-2 rounded-lg border-2 transition-all text-left ${
                                userProfile.personality === typeId
                                  ? `${colorClasses.border} ${colorClasses.bg} shadow-md`
                                  : `border-cream-200 bg-white ${colorClasses.hover}`
                              }`}
                            >
                              <p className="font-bold text-warm-800 text-sm">{typeId}</p>
                              <p className="text-xs text-warm-500 truncate">{pType?.nickname}</p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {userProfile.personality && (
              <div className={`rounded-xl p-3 flex items-start gap-2 mt-2 ${
                mbtiCategories.find(c => c.types.includes(userProfile.personality as PersonalityType))?.color === 'purple' ? 'bg-purple-50' :
                mbtiCategories.find(c => c.types.includes(userProfile.personality as PersonalityType))?.color === 'green' ? 'bg-green-50' :
                mbtiCategories.find(c => c.types.includes(userProfile.personality as PersonalityType))?.color === 'blue' ? 'bg-blue-50' :
                'bg-orange-50'
              }`}>
                <span className="text-xl">{mbtiCategories.find(c => c.types.includes(userProfile.personality as PersonalityType))?.emoji}</span>
                <div>
                  <p className="font-semibold text-warm-700 text-sm">
                    {userProfile.personality} - {personalityTypes.find((p) => p.id === userProfile.personality)?.nickname}
                  </p>
                  <p className="text-xs text-warm-600">
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

        {/* Save Profile & Find Squad Match Buttons */}
        <div className="sticky bottom-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-cream-200">
          <div className="flex flex-col gap-3">
            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-3">
              <p className="text-sm text-warm-600">
                <span className="font-semibold text-teal-600">{completeness}%</span> complete - {completeness < 50 ? 'Add more for better matches!' : completeness < 100 ? 'Great progress!' : 'Perfect!'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Save Profile with Email */}
              <button
                onClick={() => setShowEmailModal(true)}
                className={`flex-1 btn flex items-center justify-center gap-2 px-4 ${
                  profileSaved
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-white text-teal-700 border-2 border-teal-300 hover:bg-teal-50'
                }`}
              >
                {profileSaved ? (
                  <>
                    <Check className="w-5 h-5" />
                    Profile Saved!
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Save Profile with Email
                  </>
                )}
              </button>

              {/* Find Your Squad Match */}
              <button
                onClick={onFindSquadMatch}
                className="flex-1 btn bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl flex items-center justify-center gap-2 px-4"
              >
                <Users className="w-5 h-5" />
                Find Your Squad Match
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Additional option based on source */}
            {source === 'trips' && (
              <button
                onClick={onFindMatchTrips}
                className="w-full btn bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30 hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Compass className="w-5 h-5" />
                Find Your Match Trips
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save Profile with Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-display font-bold text-warm-800">Save Your Profile</h3>
              <p className="text-warm-500 text-sm mt-2">
                Enter your email to save your profile and sync across devices
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                value={saveEmail}
                onChange={(e) => setSaveEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-cream-300 bg-cream-50 text-warm-800 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 btn bg-cream-100 text-warm-600 hover:bg-cream-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (saveEmail.includes('@')) {
                      const savedProfile = {
                        ...userProfile,
                        email: saveEmail,
                        savedAt: new Date().toISOString()
                      };
                      localStorage.setItem('storyTrip_userProfile', JSON.stringify(savedProfile));
                      localStorage.setItem('storyTrip_userEmail', saveEmail);
                      setProfileSaved(true);
                      setShowEmailModal(false);
                    }
                  }}
                  disabled={!saveEmail.includes('@')}
                  className="flex-1 btn bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Save Profile
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
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
function CreateTripScreen({ onBack, onSubmit, onManageTrips, templateTrip }: {
  onBack: () => void;
  onSubmit: () => void;
  onManageTrips: () => void;
  templateTrip?: Trip | null;
}) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<TripFormData>(() => {
    if (templateTrip) {
      // Pre-fill form with template trip data
      const durationDays = parseInt(templateTrip.duration) || 5;
      const priceNum = parseInt(templateTrip.price.replace(/[^0-9]/g, '')) || 1500;
      return {
        title: `My ${templateTrip.title}`,
        category: templateTrip.narrative === 'underdog' ? 'sports' as TripCategory :
                  templateTrip.narrative === 'romance' ? 'romantic' as TripCategory :
                  templateTrip.narrative === 'legacy' ? 'family' as TripCategory :
                  templateTrip.narrative === 'discovery' ? 'adventure' as TripCategory : 'adventure' as TripCategory,
        highlight: templateTrip.sportCategory || 'nba',
        destination: templateTrip.location,
        groupSize: 4,
        visibility: 'public' as TripVisibility,
        budgetPerPerson: priceNum,
        duration: durationDays,
        startDate: templateTrip.dates.split('-')[0]?.trim() || '',
        description: templateTrip.storyBeats?.map(b => `Day ${b.day}: ${b.title} - ${b.description}`).join('\n') || '',
      };
    }
    return {
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
    };
  });
  const [copiedFromTemplate, setCopiedFromTemplate] = useState(!!templateTrip);
  const [quotation, setQuotation] = useState<TripQuotation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAgentBids, setShowAgentBids] = useState(false);
  const [submittedToAgents, setSubmittedToAgents] = useState(false);

  // Trip highlight tags - multiple selection with custom labels
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>(
    templateTrip?.sportCategory ? [templateTrip.sportCategory] : []
  );
  const [customHighlights, setCustomHighlights] = useState<Array<{ id: string; name: string; icon: string }>>([]);
  const [newCustomHighlight, setNewCustomHighlight] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);

  const toggleHighlight = (id: string) => {
    setSelectedHighlights(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const addCustomHighlight = () => {
    if (newCustomHighlight.trim()) {
      const id = `custom-${Date.now()}`;
      setCustomHighlights(prev => [...prev, { id, name: newCustomHighlight.trim(), icon: '✨' }]);
      setSelectedHighlights(prev => [...prev, id]);
      setNewCustomHighlight('');
      setShowAddCustom(false);
    }
  };

  const removeCustomHighlight = (id: string) => {
    setCustomHighlights(prev => prev.filter(h => h.id !== id));
    setSelectedHighlights(prev => prev.filter(h => h !== id));
  };

  // Deposit payment link state
  const [depositPercent, setDepositPercent] = useState(20);
  const [paymentLinkGenerated, setPaymentLinkGenerated] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [paidMembers, setPaidMembers] = useState<Array<{ email: string; name: string; paidAt: string; amount: number }>>([]);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [showPaymentLinkSection, setShowPaymentLinkSection] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const generatePaymentLink = () => {
    const linkId = `pay-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const link = `https://storytrip.com/deposit/${linkId}`;
    setPaymentLink(link);
    setPaymentLinkGenerated(true);
    // Simulate some mock paid members for demo
    setTimeout(() => {
      setPaidMembers([
        { email: 'friend1@email.com', name: 'Alex Johnson', paidAt: new Date().toISOString(), amount: Math.round((quotation?.totalEstimate || 1500) * depositPercent / 100) },
      ]);
    }, 2000);
  };

  const addInviteEmail = () => {
    if (newInviteEmail.includes('@') && !invitedEmails.includes(newInviteEmail)) {
      setInvitedEmails(prev => [...prev, newInviteEmail]);
      setNewInviteEmail('');
    }
  };

  const removeInviteEmail = (email: string) => {
    setInvitedEmails(prev => prev.filter(e => e !== email));
  };

  const copyPaymentLink = () => {
    navigator.clipboard.writeText(paymentLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const depositAmount = quotation ? Math.round(quotation.totalEstimate * depositPercent / 100) : 0;

  // Itinerary editing state
  const [editableItinerary, setEditableItinerary] = useState<Array<{
    day: number;
    title: string;
    description: string;
    location: string;
    activities: string[];
    mood: string;
  }>>(() => {
    if (templateTrip?.storyBeats) {
      return templateTrip.storyBeats.map(beat => ({
        day: beat.day,
        title: beat.title,
        description: beat.description,
        location: beat.location,
        activities: beat.activities || [],
        mood: beat.mood || 'rising'
      }));
    }
    return [];
  });
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiIsTyping, setAiIsTyping] = useState(false);
  const [selectedDayForAI, setSelectedDayForAI] = useState<number | null>(null);

  // Comments, Voting & Feedback state for itinerary collaboration
  const [dayComments, setDayComments] = useState<Record<number, Array<{
    id: string;
    author: string;
    avatar: string;
    text: string;
    timestamp: string;
    likes: number;
  }>>>({});
  const [dayVotes, setDayVotes] = useState<Record<number, { up: number; down: number; userVote?: 'up' | 'down' }>>({});
  const [newCommentText, setNewCommentText] = useState<Record<number, string>>({});
  const [showCommentsForDay, setShowCommentsForDay] = useState<number | null>(null);

  // Share itinerary link state
  const [itineraryLinkGenerated, setItineraryLinkGenerated] = useState(false);
  const [itineraryLink, setItineraryLink] = useState('');
  const [itineraryLinkCopied, setItineraryLinkCopied] = useState(false);
  const [showShareSection, setShowShareSection] = useState(false);

  // AI Feedback Board state
  const [showFeedbackBoard, setShowFeedbackBoard] = useState(false);
  const [feedbackItems, setFeedbackItems] = useState<Array<{
    id: string;
    author: string;
    avatar: string;
    type: 'like' | 'dislike' | 'change' | 'suggestion' | 'food';
    dayNumber?: number;
    text: string;
    timestamp: string;
    resolved: boolean;
  }>>([
    // Mock feedback items for demo
    { id: '1', author: 'Sarah', avatar: '👩', type: 'like', dayNumber: 2, text: 'Love the sunrise hike idea!', timestamp: new Date().toISOString(), resolved: false },
    { id: '2', author: 'Mike', avatar: '👨', type: 'food', text: 'I\'m vegetarian - can we make sure group dinners have veggie options?', timestamp: new Date().toISOString(), resolved: false },
    { id: '3', author: 'Lisa', avatar: '👩‍🦰', type: 'change', dayNumber: 3, text: 'Can we swap the museum visit for a cooking class?', timestamp: new Date().toISOString(), resolved: false },
  ]);
  const [newFeedbackText, setNewFeedbackText] = useState('');
  const [newFeedbackType, setNewFeedbackType] = useState<'like' | 'dislike' | 'change' | 'suggestion' | 'food'>('suggestion');
  const [newFeedbackDay, setNewFeedbackDay] = useState<number | null>(null);
  const [foodRestrictions, setFoodRestrictions] = useState<string[]>(['Vegetarian (Mike)', 'Gluten-free (Alex)']);
  const [newFoodRestriction, setNewFoodRestriction] = useState('');

  // Helper functions for collaboration features
  const addCommentToDay = (dayNum: number) => {
    const text = newCommentText[dayNum];
    if (!text?.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: 'You',
      avatar: '😊',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      likes: 0
    };

    setDayComments(prev => ({
      ...prev,
      [dayNum]: [...(prev[dayNum] || []), newComment]
    }));
    setNewCommentText(prev => ({ ...prev, [dayNum]: '' }));
  };

  const voteOnDay = (dayNum: number, vote: 'up' | 'down') => {
    setDayVotes(prev => {
      const current = prev[dayNum] || { up: 0, down: 0 };
      const userPreviousVote = current.userVote;

      let newUp = current.up;
      let newDown = current.down;

      // Remove previous vote
      if (userPreviousVote === 'up') newUp--;
      if (userPreviousVote === 'down') newDown--;

      // Add new vote if different from previous
      if (userPreviousVote !== vote) {
        if (vote === 'up') newUp++;
        if (vote === 'down') newDown++;
        return { ...prev, [dayNum]: { up: newUp, down: newDown, userVote: vote } };
      } else {
        // Toggle off
        return { ...prev, [dayNum]: { up: newUp, down: newDown, userVote: undefined } };
      }
    });
  };

  const generateItineraryLink = () => {
    const linkId = `itin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const link = `https://storytrip.com/share/itinerary/${linkId}`;
    setItineraryLink(link);
    setItineraryLinkGenerated(true);
  };

  const copyItineraryLink = () => {
    navigator.clipboard.writeText(itineraryLink);
    setItineraryLinkCopied(true);
    setTimeout(() => setItineraryLinkCopied(false), 2000);
  };

  const addFeedback = () => {
    if (!newFeedbackText.trim()) return;

    const newItem = {
      id: `fb-${Date.now()}`,
      author: 'You',
      avatar: '😊',
      type: newFeedbackType,
      dayNumber: newFeedbackDay || undefined,
      text: newFeedbackText.trim(),
      timestamp: new Date().toISOString(),
      resolved: false
    };

    setFeedbackItems(prev => [...prev, newItem]);
    setNewFeedbackText('');
    setNewFeedbackDay(null);
  };

  const toggleFeedbackResolved = (id: string) => {
    setFeedbackItems(prev => prev.map(item =>
      item.id === id ? { ...item, resolved: !item.resolved } : item
    ));
  };

  const addFoodRestriction = () => {
    if (newFoodRestriction.trim() && !foodRestrictions.includes(newFoodRestriction.trim())) {
      setFoodRestrictions(prev => [...prev, newFoodRestriction.trim()]);
      setNewFoodRestriction('');
    }
  };

  const removeFoodRestriction = (restriction: string) => {
    setFoodRestrictions(prev => prev.filter(r => r !== restriction));
  };

  // AI chat for itinerary suggestions
  const handleAiSuggestion = async (query: string) => {
    if (!query.trim()) return;

    setAiChatMessages(prev => [...prev, { role: 'user', content: query }]);
    setAiChatInput('');
    setAiIsTyping(true);

    // Simulate AI response with activity suggestions
    setTimeout(() => {
      const dayContext = selectedDayForAI ? editableItinerary.find(d => d.day === selectedDayForAI) : null;
      let response = '';

      if (dayContext) {
        response = `For Day ${selectedDayForAI} (${dayContext.title}) in ${dayContext.location}, here are some alternative activities:\n\n`;
        response += `**Option A:** Morning yoga session followed by a local food tour\n\n`;
        response += `**Option B:** Adventure hiking with scenic viewpoints and photography stops\n\n`;
        response += `**Option C:** Cultural workshop - learn traditional crafts from local artisans\n\n`;
        response += `Would you like me to swap any of these into your itinerary?`;
      } else {
        response = `I can help you customize your itinerary! Here are some suggestions:\n\n`;
        response += `• Add more adventure activities like zip-lining or kayaking\n`;
        response += `• Include local food experiences and cooking classes\n`;
        response += `• Add relaxation time with spa or beach days\n\n`;
        response += `Select a specific day to get tailored recommendations!`;
      }

      setAiChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setAiIsTyping(false);
    }, 1500);
  };

  const updateDayActivity = (dayNum: number, activityIndex: number, newActivity: string) => {
    setEditableItinerary(prev => prev.map(day => {
      if (day.day === dayNum) {
        const newActivities = [...day.activities];
        newActivities[activityIndex] = newActivity;
        return { ...day, activities: newActivities };
      }
      return day;
    }));
  };

  const addActivityToDay = (dayNum: number) => {
    setEditableItinerary(prev => prev.map(day => {
      if (day.day === dayNum) {
        return { ...day, activities: [...day.activities, 'New activity'] };
      }
      return day;
    }));
  };

  const removeActivityFromDay = (dayNum: number, activityIndex: number) => {
    setEditableItinerary(prev => prev.map(day => {
      if (day.day === dayNum) {
        const newActivities = day.activities.filter((_, i) => i !== activityIndex);
        return { ...day, activities: newActivities };
      }
      return day;
    }));
  };

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

        {/* Template Banner */}
        {copiedFromTemplate && templateTrip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-teal-50 border border-purple-200 rounded-2xl p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden">
                  <img src={templateTrip.image} alt={templateTrip.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium flex items-center gap-1">
                    <Copy className="w-4 h-4" />
                    Based on template
                  </p>
                  <p className="font-semibold text-warm-900">{templateTrip.title}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCopiedFromTemplate(false);
                  setFormData({
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
                }}
                className="text-sm text-warm-500 hover:text-warm-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Start fresh
              </button>
            </div>
            <p className="text-sm text-warm-600 mt-2">
              We've pre-filled your trip details based on this itinerary. Customize anything below!
            </p>
          </motion.div>
        )}

        {/* Step 1: Trip Details / Itinerary Editor */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Show Itinerary Editor when template exists */}
            {copiedFromTemplate && templateTrip && editableItinerary.length > 0 ? (
              <div className="flex gap-6">
                {/* Main Itinerary Editor */}
                <div className="flex-1 space-y-4">
                  {/* Trip Header */}
                  <div className="card p-6 bg-gradient-to-r from-teal-50 to-purple-50">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={templateTrip.image} alt={templateTrip.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="text-2xl font-display font-bold text-warm-900 bg-transparent border-b-2 border-transparent hover:border-teal-300 focus:border-teal-500 focus:outline-none w-full"
                        />
                        <div className="flex items-center gap-4 mt-2 text-warm-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <input
                              type="text"
                              value={formData.destination}
                              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                              className="bg-transparent border-b border-transparent hover:border-warm-300 focus:border-teal-500 focus:outline-none"
                            />
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {editableItinerary.length} days
                          </span>
                          <span className="text-teal-600 font-bold">{templateTrip.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Share Itinerary & AI Feedback Action Bar */}
                  <div className="flex flex-wrap gap-3 bg-gradient-to-r from-teal-50 to-purple-50 rounded-xl p-4 border border-teal-200">
                    {/* Share Itinerary Link */}
                    <button
                      onClick={() => setShowShareSection(!showShareSection)}
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-teal-300 text-teal-700 hover:bg-teal-50 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Itinerary
                    </button>

                    {/* AI Feedback Board */}
                    <button
                      onClick={() => setShowFeedbackBoard(!showFeedbackBoard)}
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Feedback Board
                      {feedbackItems.filter(f => !f.resolved).length > 0 && (
                        <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                          {feedbackItems.filter(f => !f.resolved).length}
                        </span>
                      )}
                    </button>

                    {/* Food Restrictions Quick View */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg border border-amber-200">
                      <span className="text-amber-600 text-sm font-medium">Food Notes:</span>
                      <span className="text-amber-800 text-sm">{foodRestrictions.length} restrictions</span>
                    </div>
                  </div>

                  {/* Share Itinerary Section (Expandable) */}
                  <AnimatePresence>
                    {showShareSection && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="card p-5 border-2 border-teal-200 bg-teal-50/50"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                            <Share2 className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-warm-900">Share Itinerary with Friends & Family</h4>
                            <p className="text-sm text-warm-600">Generate a link for others to view, vote, and comment</p>
                          </div>
                        </div>

                        {!itineraryLinkGenerated ? (
                          <button
                            onClick={generateItineraryLink}
                            className="w-full btn bg-gradient-to-r from-teal-500 to-teal-600 text-white flex items-center justify-center gap-2"
                          >
                            <Link className="w-5 h-5" />
                            Generate Shareable Link
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={itineraryLink}
                                readOnly
                                className="flex-1 px-4 py-2 bg-white border border-cream-200 rounded-xl text-warm-600 text-sm"
                              />
                              <button
                                onClick={copyItineraryLink}
                                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                                  itineraryLinkCopied
                                    ? 'bg-green-500 text-white'
                                    : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                                }`}
                              >
                                {itineraryLinkCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                {itineraryLinkCopied ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <button className="flex-1 px-3 py-2 bg-white border border-cream-200 rounded-lg text-sm text-warm-600 hover:bg-cream-50 flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4" /> Email Link
                              </button>
                              <button className="flex-1 px-3 py-2 bg-white border border-cream-200 rounded-lg text-sm text-warm-600 hover:bg-cream-50 flex items-center justify-center gap-2">
                                <MessageCircle className="w-4 h-4" /> Text Link
                              </button>
                            </div>
                            <p className="text-xs text-teal-600 text-center">
                              Anyone with this link can view the itinerary and leave feedback
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* AI Feedback Board Section (Expandable) */}
                  <AnimatePresence>
                    {showFeedbackBoard && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="card p-5 border-2 border-purple-200 bg-purple-50/50"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-teal-100 rounded-xl flex items-center justify-center">
                              <Sparkles className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-warm-900">AI Feedback Board</h4>
                              <p className="text-sm text-warm-600">Collect preferences from your group</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                              {feedbackItems.filter(f => f.resolved).length} resolved
                            </span>
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                              {feedbackItems.filter(f => !f.resolved).length} pending
                            </span>
                          </div>
                        </div>

                        {/* Food Restrictions Section */}
                        <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-200">
                          <h5 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                            <span>🍽️</span> Food Restrictions & Dietary Needs
                          </h5>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {foodRestrictions.map((restriction, i) => (
                              <span key={i} className="px-3 py-1 bg-white rounded-full text-sm text-amber-700 border border-amber-200 flex items-center gap-2">
                                {restriction}
                                <button onClick={() => removeFoodRestriction(restriction)} className="text-amber-400 hover:text-red-500">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newFoodRestriction}
                              onChange={(e) => setNewFoodRestriction(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && addFoodRestriction()}
                              placeholder="Add restriction (e.g., 'Nut allergy - John')"
                              className="flex-1 px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                            <button
                              onClick={addFoodRestriction}
                              disabled={!newFoodRestriction.trim()}
                              className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Feedback List */}
                        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                          {feedbackItems.map((item) => (
                            <div
                              key={item.id}
                              className={`p-3 rounded-lg border ${
                                item.resolved ? 'bg-green-50 border-green-200' : 'bg-white border-cream-200'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-xl">{item.avatar}</span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-warm-800 text-sm">{item.author}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                      item.type === 'like' ? 'bg-green-100 text-green-700' :
                                      item.type === 'dislike' ? 'bg-red-100 text-red-700' :
                                      item.type === 'change' ? 'bg-blue-100 text-blue-700' :
                                      item.type === 'food' ? 'bg-amber-100 text-amber-700' :
                                      'bg-purple-100 text-purple-700'
                                    }`}>
                                      {item.type === 'like' ? '👍 Like' :
                                       item.type === 'dislike' ? '👎 Dislike' :
                                       item.type === 'change' ? '✏️ Change' :
                                       item.type === 'food' ? '🍽️ Food' :
                                       '💡 Suggestion'}
                                    </span>
                                    {item.dayNumber && (
                                      <span className="text-xs text-warm-500">Day {item.dayNumber}</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-warm-600">{item.text}</p>
                                </div>
                                <button
                                  onClick={() => toggleFeedbackResolved(item.id)}
                                  className={`p-1.5 rounded-lg transition-all ${
                                    item.resolved
                                      ? 'bg-green-200 text-green-700'
                                      : 'bg-cream-100 text-warm-400 hover:bg-green-100 hover:text-green-600'
                                  }`}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add New Feedback */}
                        <div className="bg-white rounded-xl p-4 border border-purple-200">
                          <h5 className="font-medium text-warm-800 mb-3">Add Feedback</h5>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(['like', 'dislike', 'change', 'suggestion', 'food'] as const).map((type) => (
                              <button
                                key={type}
                                onClick={() => setNewFeedbackType(type)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                  newFeedbackType === type
                                    ? type === 'like' ? 'bg-green-500 text-white' :
                                      type === 'dislike' ? 'bg-red-500 text-white' :
                                      type === 'change' ? 'bg-blue-500 text-white' :
                                      type === 'food' ? 'bg-amber-500 text-white' :
                                      'bg-purple-500 text-white'
                                    : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
                                }`}
                              >
                                {type === 'like' ? '👍 Like' :
                                 type === 'dislike' ? '👎 Dislike' :
                                 type === 'change' ? '✏️ Change' :
                                 type === 'food' ? '🍽️ Food' :
                                 '💡 Suggestion'}
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-2 mb-3">
                            <select
                              value={newFeedbackDay || ''}
                              onChange={(e) => setNewFeedbackDay(e.target.value ? Number(e.target.value) : null)}
                              className="px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            >
                              <option value="">All days / General</option>
                              {editableItinerary.map((day) => (
                                <option key={day.day} value={day.day}>Day {day.day}: {day.title}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newFeedbackText}
                              onChange={(e) => setNewFeedbackText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && addFeedback()}
                              placeholder="Share your feedback..."
                              className="flex-1 px-3 py-2 bg-cream-50 border border-cream-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                            <button
                              onClick={addFeedback}
                              disabled={!newFeedbackText.trim()}
                              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Day-by-Day Itinerary */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-display font-semibold text-warm-900">Your Itinerary</h3>
                      <button
                        onClick={() => setAiChatOpen(!aiChatOpen)}
                        className="btn btn-outline flex items-center gap-2 text-sm"
                      >
                        <Sparkles className="w-4 h-4" />
                        AI Suggestions
                      </button>
                    </div>

                    {editableItinerary.map((day, dayIndex) => (
                      <motion.div
                        key={day.day}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: dayIndex * 0.1 }}
                        className={`card p-5 border-l-4 ${
                          day.mood === 'peak' ? 'border-l-terra-500 bg-terra-50/30' :
                          day.mood === 'rising' ? 'border-l-teal-500' :
                          'border-l-purple-500'
                        } ${selectedDayForAI === day.day ? 'ring-2 ring-purple-400' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              day.mood === 'peak' ? 'bg-terra-500' :
                              day.mood === 'rising' ? 'bg-teal-500' :
                              'bg-purple-500'
                            }`}>
                              {day.day}
                            </div>
                            <div>
                              <input
                                type="text"
                                value={day.title}
                                onChange={(e) => setEditableItinerary(prev => prev.map(d =>
                                  d.day === day.day ? { ...d, title: e.target.value } : d
                                ))}
                                className="font-semibold text-warm-900 bg-transparent border-b border-transparent hover:border-warm-300 focus:border-teal-500 focus:outline-none"
                              />
                              <p className="text-sm text-warm-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {day.location}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedDayForAI(selectedDayForAI === day.day ? null : day.day);
                              if (!aiChatOpen) setAiChatOpen(true);
                            }}
                            className={`text-sm px-3 py-1 rounded-full transition-all ${
                              selectedDayForAI === day.day
                                ? 'bg-purple-500 text-white'
                                : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                            }`}
                          >
                            <Sparkles className="w-4 h-4 inline mr-1" />
                            Get AI Ideas
                          </button>
                        </div>

                        <p className="text-warm-600 text-sm mb-3 italic">{day.description}</p>

                        {/* Activities */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-warm-500 uppercase tracking-wide">Activities</p>
                          {day.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="flex items-center gap-2 group">
                              <div className="w-6 h-6 rounded-full bg-cream-200 flex items-center justify-center text-xs text-warm-500">
                                {actIndex + 1}
                              </div>
                              <input
                                type="text"
                                value={activity}
                                onChange={(e) => updateDayActivity(day.day, actIndex, e.target.value)}
                                className="flex-1 px-3 py-2 bg-white border border-cream-200 rounded-lg text-warm-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                              />
                              <button
                                onClick={() => removeActivityFromDay(day.day, actIndex)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addActivityToDay(day.day)}
                            className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 mt-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add activity
                          </button>
                        </div>

                        {/* Voting & Comments Section */}
                        <div className="mt-4 pt-4 border-t border-cream-200">
                          <div className="flex items-center justify-between">
                            {/* Voting */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-warm-500 font-medium">Vote on this day:</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => voteOnDay(day.day, 'up')}
                                  className={`p-2 rounded-lg transition-all flex items-center gap-1 ${
                                    dayVotes[day.day]?.userVote === 'up'
                                      ? 'bg-green-100 text-green-600 ring-2 ring-green-300'
                                      : 'bg-cream-100 text-warm-500 hover:bg-green-50 hover:text-green-600'
                                  }`}
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  <span className="text-xs font-medium">{dayVotes[day.day]?.up || 0}</span>
                                </button>
                                <button
                                  onClick={() => voteOnDay(day.day, 'down')}
                                  className={`p-2 rounded-lg transition-all flex items-center gap-1 ${
                                    dayVotes[day.day]?.userVote === 'down'
                                      ? 'bg-red-100 text-red-600 ring-2 ring-red-300'
                                      : 'bg-cream-100 text-warm-500 hover:bg-red-50 hover:text-red-600'
                                  }`}
                                >
                                  <ThumbsDown className="w-4 h-4" />
                                  <span className="text-xs font-medium">{dayVotes[day.day]?.down || 0}</span>
                                </button>
                              </div>
                            </div>

                            {/* Comments Toggle */}
                            <button
                              onClick={() => setShowCommentsForDay(showCommentsForDay === day.day ? null : day.day)}
                              className="flex items-center gap-2 text-sm text-warm-600 hover:text-teal-600 transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                              {(dayComments[day.day]?.length || 0)} comments
                              <ChevronDown className={`w-4 h-4 transition-transform ${showCommentsForDay === day.day ? 'rotate-180' : ''}`} />
                            </button>
                          </div>

                          {/* Comments Section (Expandable) */}
                          <AnimatePresence>
                            {showCommentsForDay === day.day && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 space-y-3"
                              >
                                {/* Existing Comments */}
                                {(dayComments[day.day] || []).map((comment) => (
                                  <div key={comment.id} className="flex gap-2 p-2 bg-cream-50 rounded-lg">
                                    <span className="text-xl">{comment.avatar}</span>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-warm-800">{comment.author}</span>
                                        <span className="text-xs text-warm-400">
                                          {new Date(comment.timestamp).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-sm text-warm-600">{comment.text}</p>
                                    </div>
                                  </div>
                                ))}

                                {/* Add Comment Input */}
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newCommentText[day.day] || ''}
                                    onChange={(e) => setNewCommentText(prev => ({ ...prev, [day.day]: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && addCommentToDay(day.day)}
                                    placeholder="Add a comment..."
                                    className="flex-1 px-3 py-2 bg-white border border-cream-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                  />
                                  <button
                                    onClick={() => addCommentToDay(day.day)}
                                    disabled={!newCommentText[day.day]?.trim()}
                                    className="px-3 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Send className="w-4 h-4" />
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* AI Chat Sidebar */}
                <AnimatePresence>
                  {aiChatOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: 20, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: 320 }}
                      exit={{ opacity: 0, x: 20, width: 0 }}
                      className="w-80 flex-shrink-0"
                    >
                      <div className="card h-[600px] flex flex-col sticky top-24">
                        <div className="p-4 border-b border-cream-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-teal-500 rounded-lg flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-warm-900 text-sm">AI Trip Advisor</p>
                              {selectedDayForAI && (
                                <p className="text-xs text-purple-600">Helping with Day {selectedDayForAI}</p>
                              )}
                            </div>
                          </div>
                          <button onClick={() => setAiChatOpen(false)} className="text-warm-400 hover:text-warm-600">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                          {aiChatMessages.length === 0 && (
                            <div className="text-center py-8">
                              <Sparkles className="w-10 h-10 text-purple-300 mx-auto mb-3" />
                              <p className="text-warm-500 text-sm">
                                {selectedDayForAI
                                  ? `Ask me for activity ideas for Day ${selectedDayForAI}!`
                                  : 'Select a day and ask me for suggestions!'
                                }
                              </p>
                              <div className="mt-4 space-y-2">
                                {['Suggest alternative activities', 'More adventurous options', 'Add local food experiences'].map((q, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleAiSuggestion(q)}
                                    className="block w-full text-left px-3 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm text-purple-700 transition-colors"
                                  >
                                    {q}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {aiChatMessages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                                msg.role === 'user'
                                  ? 'bg-teal-500 text-white rounded-tr-none'
                                  : 'bg-cream-100 text-warm-800 rounded-tl-none'
                              }`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            </div>
                          ))}

                          {aiIsTyping && (
                            <div className="flex justify-start">
                              <div className="bg-cream-100 px-4 py-2 rounded-2xl rounded-tl-none">
                                <div className="flex gap-1">
                                  <span className="w-2 h-2 bg-warm-400 rounded-full animate-bounce" />
                                  <span className="w-2 h-2 bg-warm-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                  <span className="w-2 h-2 bg-warm-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 border-t border-cream-200">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={aiChatInput}
                              onChange={(e) => setAiChatInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAiSuggestion(aiChatInput)}
                              placeholder="Ask for suggestions..."
                              className="flex-1 px-3 py-2 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                            <button
                              onClick={() => handleAiSuggestion(aiChatInput)}
                              disabled={!aiChatInput.trim()}
                              className="p-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Regular Trip Details Form (no template) */
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

                <h4 className="font-medium text-warm-800 mb-2">Trip Highlights</h4>
                <p className="text-sm text-warm-500 mb-3">Select multiple tags or add your own</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {highlightsForCategory.map((hl) => (
                    <button
                      key={hl.id}
                      onClick={() => toggleHighlight(hl.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedHighlights.includes(hl.id)
                          ? 'bg-teal-600 text-white ring-2 ring-teal-600 ring-offset-1'
                          : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
                      }`}
                    >
                      <span>{hl.icon}</span>
                      {hl.name}
                      {selectedHighlights.includes(hl.id) && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                  {/* Custom Highlights */}
                  {customHighlights.map((hl) => (
                    <div key={hl.id} className="relative group">
                      <button
                        onClick={() => toggleHighlight(hl.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                          selectedHighlights.includes(hl.id)
                            ? 'bg-purple-600 text-white ring-2 ring-purple-600 ring-offset-1'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                      >
                        <span>{hl.icon}</span>
                        {hl.name}
                        {selectedHighlights.includes(hl.id) && <Check className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => removeCustomHighlight(hl.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {/* Add Custom Button */}
                  {showAddCustom ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCustomHighlight}
                        onChange={(e) => setNewCustomHighlight(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addCustomHighlight()}
                        placeholder="Enter custom tag..."
                        className="px-3 py-2 border border-purple-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 w-40"
                        autoFocus
                      />
                      <button
                        onClick={addCustomHighlight}
                        disabled={!newCustomHighlight.trim()}
                        className="p-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setShowAddCustom(false); setNewCustomHighlight(''); }}
                        className="p-2 text-warm-400 hover:text-warm-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddCustom(true)}
                      className="px-4 py-2 rounded-xl text-sm font-medium border-2 border-dashed border-purple-300 text-purple-600 hover:border-purple-400 hover:bg-purple-50 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Custom Tag
                    </button>
                  )}
                </div>
                {selectedHighlights.length > 0 && (
                  <p className="text-xs text-teal-600 mb-4">
                    {selectedHighlights.length} tag{selectedHighlights.length > 1 ? 's' : ''} selected
                  </p>
                )}

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
            )}

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

                {/* Deposit Payment Link Section */}
                <div className="card p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-teal-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Share2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-warm-900">Send Quotation & Deposit Link</h4>
                        <p className="text-sm text-warm-600">Share with friends & family to collect deposits</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPaymentLinkSection(!showPaymentLinkSection)}
                      className="btn btn-outline text-purple-600 border-purple-300 hover:bg-purple-100"
                    >
                      {showPaymentLinkSection ? 'Hide' : 'Set Up'} <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showPaymentLinkSection ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {showPaymentLinkSection && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6"
                      >
                        {/* Deposit Percentage Adjuster */}
                        <div className="bg-white rounded-xl p-4 border border-purple-200">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-warm-800">Deposit Amount</h5>
                            <span className="text-2xl font-bold text-purple-600">${depositAmount}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min="10"
                              max="100"
                              step="5"
                              value={depositPercent}
                              onChange={(e) => setDepositPercent(Number(e.target.value))}
                              className="flex-1 h-2 bg-purple-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setDepositPercent(Math.max(10, depositPercent - 5))}
                                className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="w-16 text-center font-bold text-purple-700">{depositPercent}%</span>
                              <button
                                onClick={() => setDepositPercent(Math.min(100, depositPercent + 5))}
                                className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-warm-500 mt-2">
                            Per person deposit: ${depositAmount} ({depositPercent}% of ${quotation.totalEstimate})
                          </p>
                        </div>

                        {/* Invite Friends Section */}
                        <div className="bg-white rounded-xl p-4 border border-purple-200">
                          <h5 className="font-medium text-warm-800 mb-3">Invite Friends & Family</h5>
                          <div className="flex gap-2 mb-3">
                            <input
                              type="email"
                              value={newInviteEmail}
                              onChange={(e) => setNewInviteEmail(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && addInviteEmail()}
                              placeholder="Enter email address..."
                              className="flex-1 px-4 py-2 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                            <button
                              onClick={addInviteEmail}
                              disabled={!newInviteEmail.includes('@')}
                              className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                          {invitedEmails.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {invitedEmails.map((email) => (
                                <span key={email} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
                                  <Mail className="w-3 h-3" />
                                  {email}
                                  <button onClick={() => removeInviteEmail(email)} className="hover:text-red-500">
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-warm-500">
                            {invitedEmails.length} people invited • Add emails and generate link to send quotation
                          </p>
                        </div>

                        {/* Generate Link Button */}
                        {!paymentLinkGenerated ? (
                          <button
                            onClick={generatePaymentLink}
                            className="w-full btn bg-gradient-to-r from-purple-600 to-teal-600 text-white hover:from-purple-700 hover:to-teal-700 flex items-center justify-center gap-2 py-4"
                          >
                            <Share2 className="w-5 h-5" />
                            Generate Payment Link
                          </button>
                        ) : (
                          <div className="space-y-4">
                            {/* Payment Link */}
                            <div className="bg-white rounded-xl p-4 border-2 border-green-200">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-green-800 flex items-center gap-2">
                                  <Check className="w-5 h-5" /> Payment Link Ready
                                </h5>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={paymentLink}
                                  readOnly
                                  className="flex-1 px-4 py-2 bg-cream-50 border border-cream-200 rounded-xl text-warm-600 text-sm"
                                />
                                <button
                                  onClick={copyPaymentLink}
                                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                    linkCopied
                                      ? 'bg-green-500 text-white'
                                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                  }`}
                                >
                                  {linkCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                              </div>
                            </div>

                            {/* Payment Tracking */}
                            <div className="bg-white rounded-xl p-4 border border-cream-200">
                              <div className="flex items-center justify-between mb-4">
                                <h5 className="font-medium text-warm-800">Payment Tracking</h5>
                                <span className="text-sm text-purple-600 font-medium">
                                  {paidMembers.length} / {Math.max(formData.groupSize, invitedEmails.length + 1)} paid
                                </span>
                              </div>
                              <div className="w-full h-3 bg-cream-200 rounded-full overflow-hidden mb-4">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-green-500 rounded-full transition-all"
                                  style={{ width: `${(paidMembers.length / Math.max(formData.groupSize, invitedEmails.length + 1)) * 100}%` }}
                                />
                              </div>
                              {paidMembers.length > 0 ? (
                                <div className="space-y-2">
                                  {paidMembers.map((member, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                                          <Check className="w-4 h-4 text-green-700" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-warm-800">{member.name}</p>
                                          <p className="text-xs text-warm-500">{member.email}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm font-bold text-green-600">${member.amount}</p>
                                        <p className="text-xs text-warm-400">Paid</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4">
                                  <Clock className="w-8 h-8 text-warm-300 mx-auto mb-2" />
                                  <p className="text-sm text-warm-500">Waiting for payments...</p>
                                  <p className="text-xs text-warm-400 mt-1">Share the link with your group</p>
                                </div>
                              )}
                            </div>

                            {/* Total Collected */}
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl">
                              <div>
                                <p className="text-sm text-warm-600">Total Deposits Collected</p>
                                <p className="text-2xl font-bold text-green-700">
                                  ${paidMembers.reduce((sum, m) => sum + m.amount, 0).toLocaleString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-warm-600">Target</p>
                                <p className="text-lg font-medium text-warm-700">
                                  ${(depositAmount * formData.groupSize).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <p className="text-xs text-warm-500 text-center">
                              This tracking will be available in your "Manage My Trips" dashboard
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
function ManageTripsScreen({ onBack, onViewTrip, bookedTrips }: {
  onBack: () => void;
  onViewTrip: (trip: Trip) => void;
  bookedTrips: { trip: Trip; squad: Squad; bookedAt: string; status: 'booked' | 'saved' }[];
}) {
  const [activeTab, setActiveTab] = useState<'all' | 'booked' | 'saved'>('all');

  // Filter out Lakers trip (broken image) and apply tab filter
  const tripsWithoutLakers = bookedTrips.filter(b => !b.trip.title.toLowerCase().includes('lakers'));

  const filteredTrips = tripsWithoutLakers.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'booked') return booking.status === 'booked';
    if (activeTab === 'saved') return booking.status === 'saved';
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
            { id: 'all', label: 'All Trips', icon: Globe, count: tripsWithoutLakers.length },
            { id: 'booked', label: 'Booked', icon: Check, count: tripsWithoutLakers.filter(b => b.status === 'booked').length },
            { id: 'saved', label: 'Saved for Later', icon: Heart, count: tripsWithoutLakers.filter(b => b.status === 'saved').length },
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
              {tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-cream-200'}`}>
                  {tab.count}
                </span>
              )}
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
            <p className="text-warm-500 mb-6">
              {activeTab === 'booked' ? 'No booked trips yet. Find your perfect adventure!' :
               activeTab === 'saved' ? 'No saved trips yet. Browse trips and save ones you like!' :
               'Start exploring and book your first trip!'}
            </p>
            <button
              onClick={onBack}
              className="btn bg-gradient-to-r from-teal-500 to-teal-600 text-white"
            >
              Find Your Adventure
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((booking, index) => (
              <motion.div
                key={`${booking.trip.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => onViewTrip(booking.trip)}
              >
                {/* Trip Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={booking.trip.image}
                    alt={booking.trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-900/60 to-transparent" />

                  {/* Status Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    booking.status === 'booked'
                      ? 'bg-green-500 text-white'
                      : 'bg-amber-500 text-white'
                  }`}>
                    {booking.status === 'booked' ? (
                      <>
                        <Check className="w-3 h-3" />
                        Booked
                      </>
                    ) : (
                      <>
                        <Heart className="w-3 h-3" />
                        Saved
                      </>
                    )}
                  </div>

                  {/* Narrative Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-white/90 rounded-lg text-xs font-medium text-warm-700">
                      {booking.trip.narrative === 'underdog' ? '🏆' :
                       booking.trip.narrative === 'discovery' ? '🧭' :
                       booking.trip.narrative === 'legacy' ? '👨‍👩‍👧‍👦' :
                       booking.trip.narrative === 'romance' ? '💕' : '✨'} {booking.trip.narrative}
                    </span>
                  </div>
                </div>

                {/* Trip Info */}
                <div className="p-4">
                  <h3 className="font-display font-semibold text-warm-900 mb-2 line-clamp-1">{booking.trip.title}</h3>

                  <div className="flex items-center gap-4 text-sm text-warm-600 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {booking.trip.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {booking.trip.duration}
                    </span>
                  </div>

                  {/* Squad Info */}
                  <div className="bg-teal-50 rounded-lg p-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{booking.squad.avatar}</span>
                      <div>
                        <p className="text-sm font-medium text-teal-800">{booking.squad.name}</p>
                        <p className="text-xs text-teal-600">{booking.squad.members.length} travelers</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Date */}
                  <p className="text-xs text-warm-500 mb-3">
                    {booking.status === 'booked' ? 'Booked' : 'Saved'} on {new Date(booking.bookedAt).toLocaleDateString()}
                  </p>

                  {/* Price & Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-teal-600">{booking.trip.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewTrip(booking.trip);
                      }}
                      className="btn btn-primary text-sm py-2 px-4"
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
function TripsScreen({ trips, narrative, userProfile, onSelect, onBack, onNavigateToProfile, onBackToHome, onUpdateProfile }: {
  trips: Trip[];
  narrative: Narrative | null;
  userProfile: UserProfile;
  onSelect: (t: Trip) => void;
  onBack: () => void;
  onNavigateToProfile: () => void;
  onBackToHome: () => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}) {
  const [selectedNarrativeFilter, setSelectedNarrativeFilter] = useState<string | null>(narrative?.id || null);

  // AI Profile Chat state
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<'name' | 'interests' | 'personality' | 'group' | 'done'>('name');
  const [collectedProfile, setCollectedProfile] = useState<Partial<UserProfile>>({});

  // AI Trip Search state
  const [aiTripSearchQuery, setAiTripSearchQuery] = useState('');
  const [isAiTripSearching, setIsAiTripSearching] = useState(false);
  const [aiTripSearchResult, setAiTripSearchResult] = useState<{
    query: string;
    interpretation: string;
    recommendedTrips: Array<{ tripId: string; matchPercentage: number; matchReasons: string[] }>;
  } | null>(null);

  // Profile questions for AI chat
  const profileQuestions = {
    name: "Hey there! I'm excited to help you find your perfect adventure. What's your name?",
    interests: "Nice to meet you, {name}! What kind of activities are you into? (e.g., skiing, surfing, NBA games, golf, hiking, music festivals)",
    personality: "Those sound fun! Would you describe yourself as more of an introvert who loves quiet exploration, or an extrovert who thrives on social adventures?",
    group: "Got it! One more thing - do you prefer traveling solo, with a partner, in a small group, or joining larger groups?",
    done: "Awesome! I've got a great picture of what you're looking for. Your personalized matches are now updated! You can say 'tell me more' if you want to share additional preferences, or click below to explore your matches.",
  };

  // Start AI chat
  const startAIChat = () => {
    setShowAIChat(true);
    setChatMessages([{ role: 'ai', text: profileQuestions.name }]);
    setCurrentQuestion('name');
    setCollectedProfile({});
  };

  // Process user response
  const processUserResponse = async (userInput: string) => {
    const input = userInput.trim();
    if (!input) return;

    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', text: input }]);
    setChatInput('');
    setIsAiThinking(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 800));

    let nextQuestion = currentQuestion;
    const updates = { ...collectedProfile };
    const inputLower = input.toLowerCase();

    switch (currentQuestion) {
      case 'name':
        updates.name = input;
        nextQuestion = 'interests';
        break;

      case 'interests':
        // Parse interests from input
        const parsedInterests: InterestCategory[] = [];
        if (inputLower.includes('ski')) parsedInterests.push('skiing');
        if (inputLower.includes('surf')) parsedInterests.push('surfing');
        if (inputLower.includes('nba') || inputLower.includes('basketball')) parsedInterests.push('nba');
        if (inputLower.includes('nfl') || inputLower.includes('football')) parsedInterests.push('nfl');
        if (inputLower.includes('mlb') || inputLower.includes('baseball')) parsedInterests.push('mlb');
        if (inputLower.includes('golf')) parsedInterests.push('golf');
        if (inputLower.includes('tennis')) parsedInterests.push('tennis');
        if (inputLower.includes('f1') || inputLower.includes('formula')) parsedInterests.push('f1');
        if (inputLower.includes('hik')) parsedInterests.push('hiking');
        if (inputLower.includes('music') || inputLower.includes('concert')) parsedInterests.push('music');
        if (inputLower.includes('photo')) parsedInterests.push('photography');
        if (inputLower.includes('yoga') || inputLower.includes('wellness')) parsedInterests.push('yoga');
        if (inputLower.includes('wine') || inputLower.includes('food')) parsedInterests.push('wine');
        if (inputLower.includes('art') || inputLower.includes('museum')) parsedInterests.push('art');
        if (inputLower.includes('travel')) parsedInterests.push('travel');

        updates.interests = parsedInterests.length > 0 ? parsedInterests : ['travel'];
        nextQuestion = 'personality';
        break;

      case 'personality':
        if (inputLower.includes('introvert') || inputLower.includes('quiet') || inputLower.includes('solo')) {
          updates.personality = 'INFP';
        } else if (inputLower.includes('extrovert') || inputLower.includes('social') || inputLower.includes('party')) {
          updates.personality = 'ENFP';
        } else {
          updates.personality = 'ENFP'; // Default
        }
        nextQuestion = 'group';
        break;

      case 'group':
        if (inputLower.includes('solo') || inputLower.includes('alone')) {
          updates.groupPreference = 'solo';
        } else if (inputLower.includes('partner') || inputLower.includes('duo') || inputLower.includes('couple')) {
          updates.groupPreference = 'duo';
        } else if (inputLower.includes('small')) {
          updates.groupPreference = 'small-group';
        } else if (inputLower.includes('large') || inputLower.includes('big')) {
          updates.groupPreference = 'large-group';
        } else {
          updates.groupPreference = 'small-group'; // Default
        }
        nextQuestion = 'done';
        // Apply all collected profile updates
        onUpdateProfile(updates);
        break;

      case 'done':
        // User said "tell me more" - could extend to more questions
        if (inputLower.includes('more') || inputLower.includes('continue')) {
          setChatMessages(prev => [...prev, { role: 'ai', text: "Great! What else would you like to share? You can tell me about your travel dates, budget preferences, or any specific experiences you're looking for!" }]);
          setIsAiThinking(false);
          return;
        }
        break;
    }

    setCollectedProfile(updates);
    setCurrentQuestion(nextQuestion);

    // Generate next AI response
    let aiResponse = profileQuestions[nextQuestion];
    if (nextQuestion === 'interests' && updates.name) {
      aiResponse = aiResponse.replace('{name}', updates.name);
    }

    setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsAiThinking(false);
  };

  // Handle chat input submit
  const handleChatSubmit = () => {
    processUserResponse(chatInput);
  };

  // Quick done button
  const handleDoneIntro = () => {
    if (Object.keys(collectedProfile).length > 0) {
      onUpdateProfile(collectedProfile);
    }
    setShowAIChat(false);
    setChatMessages([]);
    setCurrentQuestion('name');
  };

  // Email login state
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Handle email login
  const handleEmailLogin = async () => {
    if (!loginEmail.includes('@')) return;
    // Simulate sending magic link
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
      setShowEmailLogin(false);
      setLoginEmail('');
    }, 3000);
  };

  // Restart AI chat for editing
  const handleEditAnswers = () => {
    setIsEditingProfile(true);
    setShowAIChat(true);
    setChatMessages([
      { role: 'ai', text: `Hey ${userProfile.name || 'there'}! Let's update your preferences. What would you like to change? You can tell me about your interests, travel style, or group preferences.` }
    ]);
    setCurrentQuestion('done'); // Allow free-form updates
  };

  // AI Trip Search handler
  const handleAITripSearch = async () => {
    if (!aiTripSearchQuery.trim()) return;

    setIsAiTripSearching(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1200));

    const query = aiTripSearchQuery.toLowerCase();
    let interpretation = '';
    let matchedTrips: Array<{ tripId: string; matchPercentage: number; matchReasons: string[] }> = [];

    // Parse query for sports/activities
    const sportKeywords: Record<string, { category: string; names: string[] }> = {
      'f1': { category: 'f1', names: ['Formula 1', 'F1', 'racing'] },
      'formula': { category: 'f1', names: ['Formula 1', 'F1'] },
      'racing': { category: 'f1', names: ['F1', 'racing'] },
      'ski': { category: 'skiing', names: ['skiing', 'snow'] },
      'snow': { category: 'skiing', names: ['skiing', 'winter'] },
      'surf': { category: 'surfing', names: ['surfing', 'waves'] },
      'nba': { category: 'nba', names: ['NBA', 'basketball'] },
      'basketball': { category: 'nba', names: ['NBA', 'basketball'] },
      'golf': { category: 'golf', names: ['golf', 'PGA'] },
      'tennis': { category: 'tennis', names: ['tennis', 'Grand Slam'] },
      'football': { category: 'nfl', names: ['NFL', 'football'] },
      'nfl': { category: 'nfl', names: ['NFL', 'football'] },
      'baseball': { category: 'mlb', names: ['MLB', 'baseball'] },
      'mlb': { category: 'mlb', names: ['MLB', 'baseball'] },
      'soccer': { category: 'fifa', names: ['FIFA', 'soccer', 'football'] },
      'fifa': { category: 'fifa', names: ['FIFA', 'World Cup'] },
      'mma': { category: 'mma', names: ['MMA', 'UFC', 'fighting'] },
      'ufc': { category: 'mma', names: ['MMA', 'UFC'] },
    };

    let detectedCategory: string | null = null;
    let categoryNames: string[] = [];

    for (const [keyword, data] of Object.entries(sportKeywords)) {
      if (query.includes(keyword)) {
        detectedCategory = data.category;
        categoryNames = data.names;
        break;
      }
    }

    if (detectedCategory) {
      interpretation = `Looking for ${categoryNames[0]} experiences for you...`;

      // Find trips matching the category
      matchedTrips = trips
        .filter(trip => trip.sportCategory === detectedCategory || trip.tags.some(tag =>
          categoryNames.some(name => tag.toLowerCase().includes(name.toLowerCase()))
        ))
        .map(trip => {
          const baseMatch = trip.sportCategory === detectedCategory ? 85 : 70;
          const interestBonus = userProfile.interests.includes(detectedCategory as InterestCategory) ? 10 : 0;
          return {
            tripId: trip.id,
            matchPercentage: Math.min(98, baseMatch + interestBonus + Math.floor(Math.random() * 10)),
            matchReasons: [
              `Perfect for ${categoryNames[0]} fans`,
              trip.tags.slice(0, 1).join(', '),
            ].filter(Boolean),
          };
        })
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 4);
    } else {
      // General search - use user profile matching
      interpretation = `Finding the best matches based on "${aiTripSearchQuery}"...`;

      matchedTrips = trips
        .map(trip => {
          const matchScore = calculateTripMatch(trip);
          return {
            tripId: trip.id,
            matchPercentage: Math.max(40, matchScore + Math.floor(Math.random() * 15)),
            matchReasons: [
              userProfile.interests.length > 0 ? 'Matches your interests' : 'Popular choice',
              trip.narrative ? `${narratives.find(n => n.id === trip.narrative)?.name} journey` : '',
            ].filter(Boolean),
          };
        })
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 4);
    }

    // If no trips found, show top trips
    if (matchedTrips.length === 0) {
      matchedTrips = trips.slice(0, 4).map(trip => ({
        tripId: trip.id,
        matchPercentage: 60 + Math.floor(Math.random() * 20),
        matchReasons: ['Recommended for you'],
      }));
    }

    setAiTripSearchResult({
      query: aiTripSearchQuery,
      interpretation,
      recommendedTrips: matchedTrips,
    });

    setIsAiTripSearching(false);
  };

  // Calculate profile completeness
  const getProfileCompleteness = (): number => {
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
    return Math.round((completed / total) * 100);
  };

  const profileCompleteness = getProfileCompleteness();

  // Calculate match percentage between user interests and trip
  const calculateTripMatch = (trip: Trip): number => {
    // If profile is empty (0%), return 0% match for all trips
    if (profileCompleteness === 0) {
      return 0;
    }

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

    // Scale match by profile completeness (partial profiles get scaled down)
    const baseMatch = totalFactors > 0 ? Math.round((matchScore / totalFactors) * 100) : 50;
    return Math.round(baseMatch * (profileCompleteness / 100));
  };

  // Get sort score for trips (narrative match + trip match)
  const getTripSortScore = (trip: Trip): number => {
    const tripMatch = calculateTripMatch(trip);
    // If a narrative filter is selected, boost matching trips by 1000 to ensure they appear first
    const narrativeBoost = selectedNarrativeFilter && trip.narrative === selectedNarrativeFilter ? 1000 : 0;
    return narrativeBoost + tripMatch;
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
        <button onClick={onBackToHome} className="flex items-center gap-2 text-warm-600 hover:text-teal-600 mb-8">
          <ChevronLeft className="w-5 h-5" /> Back to Homepage
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-display text-warm-900 mb-6">
            Find Your <span className="text-teal-600">Adventure</span>
          </h1>

          {/* Narrative Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedNarrativeFilter(null)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedNarrativeFilter === null
                  ? 'bg-warm-800 text-white shadow-lg'
                  : 'bg-cream-200 text-warm-600 hover:bg-cream-300'
              }`}
            >
              ✨ All Trips
            </button>
            {narratives.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedNarrativeFilter(n.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  selectedNarrativeFilter === n.id
                    ? `bg-gradient-to-r ${n.gradient} text-white shadow-lg`
                    : 'bg-cream-200 text-warm-600 hover:bg-cream-300'
                }`}
              >
                <span>{n.icon}</span>
                <span>{n.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Profile Chat or Profile Hint */}
        {profileCompleteness < 100 && (
          <div className="mb-6">
            {!showAIChat ? (
              /* AI Chat Trigger */
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-2xl p-5 border-2 border-purple-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-teal-500 rounded-2xl flex items-center justify-center">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-warm-900">AI Match Your Adventure Trips</h3>
                    <p className="text-warm-600 text-sm">
                      Chat with me to personalize your trip recommendations. Quick 4-question intro!
                    </p>
                  </div>
                  <button
                    onClick={startAIChat}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Start Chat
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-warm-500">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-teal-500" />
                    30 seconds
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-teal-500" />
                    Personalized matches
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-teal-500" />
                    Skip anytime
                  </span>
                </div>
              </motion.div>
            ) : (
              /* AI Chat Interface */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border-2 border-purple-200 shadow-xl overflow-hidden"
              >
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-purple-500 to-teal-500 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">AI Trip Matcher</h3>
                      <p className="text-white/80 text-xs">Let's find your perfect adventures</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAIChat(false)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {chatMessages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white'
                          : 'bg-white border border-cream-200 text-warm-800 shadow-sm'
                      }`}>
                        {msg.role === 'ai' && (
                          <div className="flex items-center gap-2 mb-1">
                            <Brain className="w-3 h-3 text-purple-500" />
                            <span className="text-xs text-purple-600 font-medium">AI</span>
                          </div>
                        )}
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isAiThinking && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-cream-200 rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="flex gap-1"
                          >
                            <span className="w-2 h-2 bg-purple-400 rounded-full" />
                            <span className="w-2 h-2 bg-purple-400 rounded-full" style={{ animationDelay: '0.2s' }} />
                            <span className="w-2 h-2 bg-purple-400 rounded-full" style={{ animationDelay: '0.4s' }} />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-cream-200 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                      placeholder="Type your answer..."
                      className="flex-1 px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-warm-900 placeholder:text-warm-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                    <button
                      onClick={handleChatSubmit}
                      disabled={!chatInput.trim() || isAiThinking}
                      className="px-4 py-3 bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white rounded-xl transition-all disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleDoneIntro}
                      className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-warm-600 text-sm rounded-lg transition-colors"
                    >
                      Done for now
                    </button>
                    {currentQuestion !== 'name' && (
                      <button
                        onClick={() => processUserResponse('tell me more')}
                        className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm rounded-lg transition-colors"
                      >
                        Tell me more
                      </button>
                    )}
                    <button
                      onClick={onNavigateToProfile}
                      className="px-3 py-1.5 border border-cream-200 hover:bg-cream-50 text-warm-600 text-sm rounded-lg transition-colors ml-auto"
                    >
                      Use full form instead
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

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
            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-teal-200/50">
              <button
                onClick={() => setShowEmailLogin(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-teal-50 border border-teal-300 text-teal-700 rounded-xl text-sm font-medium transition-colors"
              >
                <Mail className="w-4 h-4" />
                Save with Email
              </button>
              <button
                onClick={handleEditAnswers}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-purple-50 border border-purple-300 text-purple-700 rounded-xl text-sm font-medium transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit My Answers
              </button>
              <span className="text-xs text-warm-500 ml-auto">
                Not saved yet
              </span>
            </div>
          </div>
        )}

        {/* Email Login Modal */}
        <AnimatePresence>
          {showEmailLogin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowEmailLogin(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                {!emailSent ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-warm-900">Save Your Preferences</h3>
                        <p className="text-sm text-warm-600">We'll send you a magic link to save your profile</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-warm-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-warm-900 placeholder:text-warm-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                        />
                      </div>

                      <button
                        onClick={handleEmailLogin}
                        disabled={!loginEmail.includes('@')}
                        className="w-full py-3 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send Magic Link
                      </button>

                      <p className="text-xs text-center text-warm-500">
                        No password needed. We'll email you a secure link to access your saved preferences anytime.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowEmailLogin(false)}
                      className="absolute top-4 right-4 text-warm-400 hover:text-warm-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Check className="w-8 h-8 text-green-600" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-warm-900 mb-2">Check Your Email!</h3>
                    <p className="text-warm-600">
                      We've sent a magic link to <span className="font-medium">{loginEmail}</span>
                    </p>
                    <p className="text-sm text-warm-500 mt-2">
                      Click the link in the email to save your preferences.
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Trip Search */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" />
              <input
                type="text"
                value={aiTripSearchQuery}
                onChange={(e) => setAiTripSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAITripSearch()}
                placeholder="Try 'I like F1' or 'skiing adventures' or 'NBA Finals'..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-cream-200 rounded-2xl text-warm-900 placeholder:text-warm-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all shadow-sm"
              />
            </div>
            <button
              onClick={handleAITripSearch}
              disabled={isAiTripSearching}
              className="px-6 py-4 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 rounded-2xl text-white font-medium flex items-center gap-2 transition-all shadow-md disabled:opacity-70"
            >
              {isAiTripSearching ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Matching...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  AI Match
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Trip Search Results */}
        {aiTripSearchResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-5 mb-6 border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-purple-50"
          >
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-teal-600" />
              <div>
                <h3 className="font-bold text-warm-900">AI Found Your Match Trips</h3>
                <p className="text-sm text-warm-600">{aiTripSearchResult.interpretation}</p>
              </div>
              <button
                onClick={() => setAiTripSearchResult(null)}
                className="ml-auto text-warm-400 hover:text-warm-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {aiTripSearchResult.recommendedTrips.map((result, idx) => {
                const trip = trips.find(t => t.id === result.tripId);
                if (!trip) return null;
                return (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => onSelect(trip)}
                    className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all border border-cream-100 group"
                  >
                    {/* Rank Badge */}
                    <div className="relative">
                      <img src={trip.image} alt={trip.title} className="w-full h-24 object-cover" />
                      <div className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                        idx === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white' :
                        idx === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-white' :
                        idx === 2 ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white' :
                        'bg-gradient-to-r from-teal-400 to-teal-500 text-white'
                      }`}>
                        #{idx + 1}
                      </div>
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold ${
                        result.matchPercentage >= 80 ? 'bg-green-500 text-white' :
                        result.matchPercentage >= 60 ? 'bg-amber-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {result.matchPercentage}%
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-warm-900 text-sm truncate">{trip.title}</h4>
                      <p className="text-xs text-warm-500 mb-2">{trip.location} • {trip.duration}</p>
                      {result.matchReasons[0] && (
                        <div className="flex items-center gap-1 text-xs text-teal-600">
                          <Check className="w-3 h-3" />
                          {result.matchReasons[0]}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Trip Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-warm-600">
            <span className="font-semibold text-warm-800">{trips.length}</span>
            {' '}trips available
            {selectedNarrativeFilter && (
              <span className="text-teal-600">
                {' '}({trips.filter(t => t.narrative === selectedNarrativeFilter).length} {narratives.find(n => n.id === selectedNarrativeFilter)?.name} trips shown first)
              </span>
            )}
          </p>
          {profileCompleteness === 0 && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              Complete your profile for personalized matches
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-6xl mb-4">🗺️</p>
              <h3 className="text-xl font-display text-warm-700 mb-2">No trips found</h3>
              <p className="text-warm-500 mb-4">Try selecting a different narrative or view all trips</p>
              <button
                onClick={() => setSelectedNarrativeFilter(null)}
                className="px-6 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
              >
                View All Trips
              </button>
            </div>
          ) : (
            [...trips]
              .sort((a, b) => getTripSortScore(b) - getTripSortScore(a))
              .map((trip, index) => {
            const tripMatch = calculateTripMatch(trip);
            const isNarrativeMatch = selectedNarrativeFilter && trip.narrative === selectedNarrativeFilter;
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
                  {/* Narrative Badge */}
                  {trip.narrative && (
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-3 ${
                      isNarrativeMatch
                        ? `bg-gradient-to-r ${narratives.find(n => n.id === trip.narrative)?.gradient} text-white`
                        : 'bg-cream-100 text-warm-600'
                    }`}>
                      <span>{narratives.find(n => n.id === trip.narrative)?.icon}</span>
                      <span>{narratives.find(n => n.id === trip.narrative)?.name}</span>
                    </div>
                  )}
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
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============ TRIP DETAIL SCREEN ============
function TripDetailScreen({ trip, onContinue, onBack, onCreateOwn }: {
  trip: Trip;
  onContinue: () => void;
  onBack: () => void;
  onCreateOwn: () => void;
}) {
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

        {/* Hero with "Your Story Awaits" */}
        <div className="relative h-80 md:h-[450px] rounded-3xl overflow-hidden mb-8 shadow-cozy-lg">
          <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Your Story Awaits Header */}
          <div className="absolute top-6 left-6 right-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/40 backdrop-blur-sm rounded-2xl py-4 px-6 inline-block"
            >
              <p className="text-white/90 text-sm tracking-widest uppercase mb-2 drop-shadow-lg">Your Adventure Begins</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Your <span className="text-teal-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Story</span> Awaits
              </h1>
            </motion.div>
          </div>

          {/* Trip Details */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-white/90 drop-shadow-lg bg-black/30 px-3 py-1 rounded-full">Hosted by {trip.host}</p>
              {trip.sportCategory && (
                <span className={`px-3 py-1 rounded-full text-white text-sm flex items-center gap-1 font-medium shadow-lg ${
                  trip.sportCategory === 'nba' ? 'bg-orange-500' :
                  trip.sportCategory === 'mlb' ? 'bg-red-600' :
                  trip.sportCategory === 'nfl' ? 'bg-amber-700' :
                  trip.sportCategory === 'nhl' ? 'bg-blue-600' :
                  trip.sportCategory === 'f1' ? 'bg-red-500' :
                  trip.sportCategory === 'fifa' ? 'bg-green-600' :
                  trip.sportCategory === 'tennis' ? 'bg-yellow-500 text-yellow-900' :
                  trip.sportCategory === 'golf' ? 'bg-green-500' :
                  trip.sportCategory === 'skiing' ? 'bg-sky-500' :
                  trip.sportCategory === 'surfing' ? 'bg-teal-500' :
                  trip.sportCategory === 'cycling' ? 'bg-lime-600' :
                  'bg-purple-500'
                }`}>
                  {sportCategories.find(s => s.id === trip.sportCategory)?.icon}
                  {sportCategories.find(s => s.id === trip.sportCategory)?.name}
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{trip.title}</h2>
            <div className="flex flex-wrap gap-4 text-white drop-shadow-lg">
              <span className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full"><MapPin className="w-4 h-4" /> {trip.location}</span>
              <span className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full"><Calendar className="w-4 h-4" /> {trip.dates}</span>
              <span className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full"><Clock className="w-4 h-4" /> {trip.duration}</span>
            </div>
          </div>
        </div>

        {/* Trip Overview Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Narrative Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-5 bg-gradient-to-br from-teal-50 to-cream-50"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{narratives.find(n => n.id === trip.narrative)?.icon || '🌟'}</span>
              <div>
                <p className="text-xs text-warm-500 uppercase tracking-wide">Narrative</p>
                <p className="font-semibold text-warm-800">{narratives.find(n => n.id === trip.narrative)?.name || 'Adventure'}</p>
              </div>
            </div>
            <p className="text-sm text-warm-600">{narratives.find(n => n.id === trip.narrative)?.description || 'An unforgettable journey awaits'}</p>
          </motion.div>

          {/* Duration & Price Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-5 bg-gradient-to-br from-terra-50 to-cream-50"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">📅</span>
              <div>
                <p className="text-xs text-warm-500 uppercase tracking-wide">Duration</p>
                <p className="font-semibold text-warm-800">{trip.duration}</p>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-terra-600">{trip.price}</span>
              <span className="text-sm text-warm-500">per person</span>
            </div>
          </motion.div>

          {/* Highlights Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-5 bg-gradient-to-br from-purple-50 to-cream-50"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">✨</span>
              <div>
                <p className="text-xs text-warm-500 uppercase tracking-wide">Highlights</p>
                <p className="font-semibold text-warm-800">{trip.storyBeats.length} Story Moments</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {trip.tags.slice(0, 3).map(tag => (
                <span key={tag} className="badge badge-teal text-xs">{tag}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Full Daily Itinerary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6 mb-8"
        >
          <h3 className="text-xl font-display text-warm-900 mb-6 flex items-center gap-2">
            <Film className="w-5 h-5 text-teal-600" />
            Your Complete Journey
          </h3>

          <div className="space-y-4">
            {trip.storyBeats.map((beat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`relative pl-8 pb-4 ${i < trip.storyBeats.length - 1 ? 'border-l-2 border-teal-200' : ''}`}
              >
                {/* Day Circle */}
                <div className={`absolute left-0 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  beat.mood === 'peak' ? 'bg-terra-500' : beat.mood === 'rising' ? 'bg-teal-500' : 'bg-teal-400'
                }`}>
                  {beat.day}
                </div>

                {/* Day Content */}
                <div className="bg-cream-50 rounded-xl p-4 ml-4 hover:bg-cream-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-warm-800">{beat.title}</h4>
                      <p className="text-sm text-warm-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {beat.location}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      beat.mood === 'peak' ? 'bg-terra-100 text-terra-700' :
                      beat.mood === 'rising' ? 'bg-teal-100 text-teal-700' : 'bg-cream-200 text-warm-600'
                    }`}>
                      {beat.mood === 'peak' ? '🔥 Climax' : beat.mood === 'rising' ? '📈 Rising' : '🌅 Winding Down'}
                    </span>
                  </div>
                  <p className="text-sm text-warm-600 mb-3">{beat.description}</p>

                  {/* Activities */}
                  {beat.activities && beat.activities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {beat.activities.map((activity, j) => (
                        <span key={j} className="text-xs bg-white px-2 py-1 rounded-lg border border-cream-200 text-warm-600">
                          {activity}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Local Spots */}
                  {beat.localSpots && beat.localSpots.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-cream-200">
                      <p className="text-xs text-warm-500 mb-1">📍 Local spots:</p>
                      <p className="text-xs text-teal-600">{beat.localSpots.join(' • ')}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA - Find Your Squad or Create Own */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl p-6 shadow-lg"
        >
          <div className="text-white mb-4">
            <p className="text-white/80 mb-1">Ready to begin your story?</p>
            <p className="text-2xl font-display font-bold">Find travelers who match your vibe</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={onContinue} className="flex-1 btn bg-white text-teal-700 hover:bg-cream-100 flex items-center justify-center gap-2 shadow-lg">
              <Users className="w-5 h-5" />
              Find Your Squad
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={onCreateOwn} className="flex-1 btn bg-teal-700/50 text-white border-2 border-white/30 hover:bg-teal-700 hover:border-white/50 flex items-center justify-center gap-2">
              <Edit3 className="w-5 h-5" />
              Create My Own
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/60 text-sm mt-3 text-center">
            Join an existing squad or customize this itinerary for your own group
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============ SQUAD BROWSE SCREEN ============
function SquadBrowseScreen({ squads, trips, userProfile, onViewTrip, onJoinTrip, onBack, onCompleteProfile }: {
  squads: Squad[];
  trips: Trip[];
  userProfile: UserProfile;
  onViewTrip: (trip: Trip) => void;
  onJoinTrip: (trip: Trip, squad: Squad) => void;
  onBack: () => void;
  onCompleteProfile: () => void;
}) {
  const [expandedSquad, setExpandedSquad] = useState<string | null>(null);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  // Enhanced Filter States
  const [activeFilterTab, setActiveFilterTab] = useState<'interests' | 'relationship' | 'mbti' | 'group' | 'date' | 'budget' | null>('interests');
  const [filterSports, setFilterSports] = useState<SportCategory[]>([]);
  const [filterInterestCategory, setFilterInterestCategory] = useState<'sports' | 'entertainment' | 'lifestyle' | null>(null);
  const [filterRelationship, setFilterRelationship] = useState<RelationshipStatus[]>([]);
  const [filterMBTI, setFilterMBTI] = useState<string[]>([]); // MBTI category groups
  const [filterGroupSize, setFilterGroupSize] = useState<string | null>(null);
  const [filterTravelMonth, setFilterTravelMonth] = useState<string | null>(null);
  const [filterBudget, setFilterBudget] = useState<string | null>(null);

  // Interest categories
  const interestCategories = [
    { id: 'sports', label: 'Sports', icon: '🏆', tags: ['NBA', 'NFL', 'MLB', 'Soccer', 'Golf', 'Tennis', 'F1', 'Skiing', 'Surfing'] },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬', tags: ['Movies', 'Music', 'Gaming', 'Art', 'Theater', 'Festivals'] },
    { id: 'lifestyle', label: 'Lifestyle', icon: '✨', tags: ['Food & Wine', 'Wellness', 'Fashion', 'Photography', 'Adventure'] },
  ];

  // MBTI categories (grouped)
  const mbtiCategories = [
    { id: 'analysts', label: 'Analysts', icon: '🧠', types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'], desc: 'Strategic thinkers' },
    { id: 'diplomats', label: 'Diplomats', icon: '💚', types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'], desc: 'Empathetic idealists' },
    { id: 'sentinels', label: 'Sentinels', icon: '🛡️', types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'], desc: 'Reliable organizers' },
    { id: 'explorers', label: 'Explorers', icon: '🎯', types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'], desc: 'Spontaneous adventurers' },
  ];

  // Group size options
  const groupSizeOptions = [
    { id: 'solo', label: 'Solo Traveler', icon: '🧍', size: '1' },
    { id: 'duo', label: 'Duo / Couple', icon: '👫', size: '2' },
    { id: 'small', label: 'Small Group', icon: '👥', size: '3-5' },
    { id: 'medium', label: 'Medium Group', icon: '👨‍👩‍👧‍👦', size: '6-10' },
    { id: 'large', label: 'Large Group', icon: '🎉', size: '10+' },
  ];

  // Travel month options
  const travelMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Budget options
  const budgetOptions = [
    { id: 'budget', label: 'Budget', icon: '💰', range: '$0-1,500', desc: 'Backpacker style' },
    { id: 'moderate', label: 'Moderate', icon: '💵', range: '$1,500-3,000', desc: 'Comfortable travel' },
    { id: 'premium', label: 'Premium', icon: '💎', range: '$3,000-5,000', desc: 'Upscale experience' },
    { id: 'luxury', label: 'Luxury', icon: '👑', range: '$5,000+', desc: 'No limits' },
  ];

  // Toggle functions
  const toggleFilterSport = (sport: SportCategory) => {
    setFilterSports(prev => prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]);
  };

  const toggleFilterRelationship = (status: RelationshipStatus) => {
    setFilterRelationship(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
  };

  const toggleFilterMBTI = (category: string) => {
    setFilterMBTI(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilterSports([]);
    setFilterInterestCategory(null);
    setFilterRelationship([]);
    setFilterMBTI([]);
    setFilterGroupSize(null);
    setFilterTravelMonth(null);
    setFilterBudget(null);
  };

  // Count active filters
  const activeFilterCount = filterSports.length + filterRelationship.length + filterMBTI.length +
    (filterInterestCategory ? 1 : 0) + (filterGroupSize ? 1 : 0) + (filterTravelMonth ? 1 : 0) + (filterBudget ? 1 : 0);

  // Create Your Own Squad modal state
  const [showCreateSquad, setShowCreateSquad] = useState(false);
  const [newSquadName, setNewSquadName] = useState('');
  const [newSquadVibe, setNewSquadVibe] = useState<'adventurous' | 'relaxed' | 'party' | 'cultural'>('adventurous');
  const [newSquadSports, setNewSquadSports] = useState<SportCategory[]>([]);
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [squadCreated, setSquadCreated] = useState(false);

  // Messaging modal state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState<{ type: 'squad' | 'private'; name: string; avatar?: string } | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // AI Squad Matching state
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchResult, setAiSearchResult] = useState<AISquadSearchResult | null>(null);
  const [squadMatchScores, setSquadMatchScores] = useState<Record<string, SquadMatchScore>>({});
  const [isCalculatingMatches, setIsCalculatingMatches] = useState(false);

  // Member Profile Modal state
  const [selectedMemberProfile, setSelectedMemberProfile] = useState<Member | null>(null);
  const [showMemberProfileModal, setShowMemberProfileModal] = useState(false);

  // Calculate profile completeness
  const getProfileCompleteness = (): number => {
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

  const profileCompleteness = getProfileCompleteness();

  // MBTI compatibility scoring
  const getMBTICompatibility = (userMBTI: string | null, memberMBTI: string | undefined): number => {
    if (!userMBTI || !memberMBTI) return 50; // Neutral if unknown

    // Same type = high compatibility
    if (userMBTI === memberMBTI) return 95;

    // Compatible pairs (simplified compatibility model)
    const compatiblePairs: Record<string, string[]> = {
      'INTJ': ['ENFP', 'ENTP', 'ENTJ', 'INTJ'],
      'INTP': ['ENTJ', 'ENFJ', 'INFJ', 'INTP'],
      'ENTJ': ['INTP', 'INFP', 'ENFP', 'ENTJ'],
      'ENTP': ['INFJ', 'INTJ', 'ENFJ', 'ENTP'],
      'INFJ': ['ENTP', 'ENFP', 'INFP', 'INFJ'],
      'INFP': ['ENFJ', 'ENTJ', 'INFJ', 'INFP'],
      'ENFJ': ['INFP', 'INTP', 'ENFP', 'ENFJ'],
      'ENFP': ['INFJ', 'INTJ', 'ENFJ', 'ENFP'],
      'ISTJ': ['ESFP', 'ESTP', 'ISFJ', 'ISTJ'],
      'ISFJ': ['ESTP', 'ESFP', 'ISTJ', 'ISFJ'],
      'ESTJ': ['ISFP', 'ISTP', 'ESFJ', 'ESTJ'],
      'ESFJ': ['ISTP', 'ISFP', 'ESTJ', 'ESFJ'],
      'ISTP': ['ESFJ', 'ESTJ', 'ISFP', 'ISTP'],
      'ISFP': ['ESTJ', 'ESFJ', 'ISTP', 'ISFP'],
      'ESTP': ['ISFJ', 'ISTJ', 'ESFP', 'ESTP'],
      'ESFP': ['ISTJ', 'ISFJ', 'ESTP', 'ESFP'],
    };

    const compatible = compatiblePairs[userMBTI] || [];
    if (compatible.includes(memberMBTI)) return 85;

    // Same first letter (I/E) = moderate compatibility
    if (userMBTI[0] === memberMBTI[0]) return 70;

    return 55; // Different types but not incompatible
  };

  // Calculate squad match score
  const calculateSquadMatchScore = (squad: Squad): SquadMatchScore => {
    const matchReasons: string[] = [];

    // Interest overlap (40% weight)
    const userInterests = new Set(userProfile.interests);
    const squadInterests = new Set(squad.sportInterests);

    // Map user interests to sport categories for comparison
    const userSportInterests = userProfile.interests.filter(i =>
      ['nba', 'mlb', 'nfl', 'nhl', 'fifa', 'f1', 'golf', 'tennis', 'mma', 'skiing', 'surfing'].includes(i)
    );

    const interestOverlap = userSportInterests.filter(i => squadInterests.has(i as SportCategory)).length;
    const interestScore = userSportInterests.length > 0
      ? Math.min(100, (interestOverlap / userSportInterests.length) * 100 + 20)
      : 50;

    if (interestOverlap > 0) {
      matchReasons.push(`${interestOverlap} shared interest${interestOverlap > 1 ? 's' : ''}`);
    }

    // Travel style match (25% weight)
    const squadVibes = squad.vibe.toLowerCase();
    let travelStyleScore = 50;
    if (squadVibes.includes('adventure') || squadVibes.includes('extreme')) {
      travelStyleScore = 85;
      matchReasons.push('Matches your adventurous spirit');
    } else if (squadVibes.includes('social') || squadVibes.includes('party')) {
      travelStyleScore = 80;
      matchReasons.push('Great social atmosphere');
    } else if (squadVibes.includes('family') || squadVibes.includes('chill')) {
      travelStyleScore = 75;
      matchReasons.push('Relaxed and welcoming vibe');
    }

    // MBTI compatibility (20% weight)
    const memberMBTIs = squad.members.filter(m => m.mbtiType).map(m => m.mbtiType!);
    const mbtiScores = memberMBTIs.map(m => getMBTICompatibility(userProfile.personality, m));
    const mbtiScore = mbtiScores.length > 0
      ? mbtiScores.reduce((a, b) => a + b, 0) / mbtiScores.length
      : 50;

    if (mbtiScore >= 80) {
      matchReasons.push('High personality compatibility');
    }

    // Experience/group size (15% weight)
    const squadSize = squad.members.length;
    let experienceScore = 60;
    if (userProfile.groupPreference === 'small-group' && squadSize <= 5) {
      experienceScore = 90;
      matchReasons.push('Perfect group size');
    } else if (userProfile.groupPreference === 'large-group' && squadSize > 5) {
      experienceScore = 85;
    } else if (userProfile.groupPreference === 'duo' && squadSize <= 3) {
      experienceScore = 80;
    }

    // Calculate total match percentage
    const matchPercentage = Math.round(
      interestScore * 0.4 +
      travelStyleScore * 0.25 +
      mbtiScore * 0.2 +
      experienceScore * 0.15
    );

    return {
      squadId: squad.id,
      matchPercentage,
      matchReasons: matchReasons.slice(0, 3), // Top 3 reasons
      compatibilityFactors: {
        interests: Math.round(interestScore),
        travelStyle: Math.round(travelStyleScore),
        personality: Math.round(mbtiScore),
        experience: Math.round(experienceScore),
      },
    };
  };

  // Calculate match scores for all squads on mount
  useEffect(() => {
    const scores: Record<string, SquadMatchScore> = {};
    squads.forEach(squad => {
      scores[squad.id] = calculateSquadMatchScore(squad);
    });
    setSquadMatchScores(scores);
  }, [userProfile, squads]);

  // Get top 3 recommended squads
  const getTopRecommendedSquads = (): Squad[] => {
    return [...squads]
      .sort((a, b) => (squadMatchScores[b.id]?.matchPercentage || 0) - (squadMatchScores[a.id]?.matchPercentage || 0))
      .slice(0, 3);
  };

  // Calculate individual member match percentage
  const calculateMemberMatch = (member: Member): { percentage: number; reasons: string[] } => {
    let matchScore = 0;
    const reasons: string[] = [];

    // Interest overlap (50% weight)
    const userSportInterests = userProfile.interests.filter(i =>
      ['nba', 'mlb', 'nfl', 'nhl', 'fifa', 'f1', 'golf', 'tennis', 'mma', 'skiing', 'surfing'].includes(i)
    );
    const memberSportInterests = member.sportInterests || [];
    const sharedInterests = userSportInterests.filter(i => memberSportInterests.includes(i as SportCategory));

    if (sharedInterests.length > 0) {
      matchScore += Math.min(50, (sharedInterests.length / Math.max(userSportInterests.length, 1)) * 50 + 15);
      const sportNames = sharedInterests.map(s => sportCategories.find(sc => sc.id === s)?.name || s);
      reasons.push(`Shares ${sportNames.slice(0, 2).join(', ')}`);
    } else {
      matchScore += 20; // Base score
    }

    // MBTI compatibility (30% weight)
    const mbtiScore = getMBTICompatibility(userProfile.personality, member.mbtiType);
    matchScore += (mbtiScore / 100) * 30;
    if (mbtiScore >= 85) {
      reasons.push('Great personality match');
    } else if (mbtiScore >= 70) {
      reasons.push('Compatible personality');
    }

    // Relationship status match (20% weight)
    if (userProfile.relationshipStatus && member.relationshipStatus) {
      if (userProfile.relationshipStatus === member.relationshipStatus) {
        matchScore += 20;
        reasons.push('Same travel style');
      } else if (
        (userProfile.relationshipStatus === 'single' && member.relationshipStatus === 'looking') ||
        (userProfile.relationshipStatus === 'looking' && member.relationshipStatus === 'single')
      ) {
        matchScore += 18;
        reasons.push('Open to connections');
      } else {
        matchScore += 10;
      }
    } else {
      matchScore += 10;
    }

    return {
      percentage: Math.min(100, Math.round(matchScore)),
      reasons: reasons.slice(0, 2),
    };
  };

  // Scroll to squad detail
  const scrollToSquad = (squadId: string) => {
    setExpandedSquad(squadId);
    // Wait for state update then scroll
    setTimeout(() => {
      const element = document.getElementById(`squad-${squadId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // AI Search handler
  const handleAISearch = async () => {
    if (!aiSearchQuery.trim()) return;

    setIsAiSearching(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple keyword-based matching (in real app, would call Gemini API)
    const query = aiSearchQuery.toLowerCase();
    let searchType: AISquadSearchResult['searchType'] = 'general';
    let matchedSquads: Squad[] = [];

    if (query.includes('soulmate') || query.includes('connection') || query.includes('like-minded')) {
      searchType = 'soulmate';
      // Sort by MBTI and interest compatibility
      matchedSquads = [...squads].sort((a, b) =>
        (squadMatchScores[b.id]?.compatibilityFactors.personality || 0) -
        (squadMatchScores[a.id]?.compatibilityFactors.personality || 0)
      ).slice(0, 4);
    } else if (query.includes('adventure') || query.includes('extreme') || query.includes('thrill')) {
      searchType = 'adventure';
      matchedSquads = squads.filter(s =>
        s.vibe.toLowerCase().includes('adventure') ||
        s.vibe.toLowerCase().includes('extreme') ||
        s.sportInterests.includes('skiing') ||
        s.sportInterests.includes('surfing')
      ).slice(0, 4);
    } else if (query.includes('chill') || query.includes('relax') || query.includes('easy')) {
      searchType = 'chill';
      matchedSquads = squads.filter(s =>
        s.vibe.toLowerCase().includes('social') ||
        s.vibe.toLowerCase().includes('chill') ||
        s.vibe.toLowerCase().includes('family')
      ).slice(0, 4);
    } else if (query.includes('ski') || query.includes('surf') || query.includes('golf') || query.includes('tennis')) {
      searchType = 'skill';
      const sport = query.includes('ski') ? 'skiing' : query.includes('surf') ? 'surfing' : query.includes('golf') ? 'golf' : 'tennis';
      matchedSquads = squads.filter(s => s.sportInterests.includes(sport as SportCategory)).slice(0, 4);
    } else {
      // General search - use overall match score
      matchedSquads = getTopRecommendedSquads();
    }

    if (matchedSquads.length === 0) {
      matchedSquads = getTopRecommendedSquads();
    }

    setAiSearchResult({
      query: aiSearchQuery,
      interpretation: searchType === 'soulmate'
        ? 'Looking for deep connections and like-minded travelers'
        : searchType === 'adventure'
        ? 'Seeking adrenaline-pumping adventures'
        : searchType === 'chill'
        ? 'Want a relaxed, easygoing travel experience'
        : searchType === 'skill'
        ? `Looking for ${query.includes('ski') ? 'skiing' : query.includes('surf') ? 'surfing' : query.includes('golf') ? 'golf' : 'tennis'} enthusiasts`
        : 'Finding the best matches based on your profile',
      recommendedSquads: matchedSquads.map(s => squadMatchScores[s.id] || calculateSquadMatchScore(s)),
      searchType,
    });

    setIsAiSearching(false);
  };

  // Toggle sport for new squad
  const toggleNewSquadSport = (sport: SportCategory) => {
    setNewSquadSports(prev =>
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  };

  // Add invite email
  const addInviteEmailToSquad = () => {
    if (newInviteEmail.includes('@') && !inviteEmails.includes(newInviteEmail)) {
      setInviteEmails(prev => [...prev, newInviteEmail]);
      setNewInviteEmail('');
    }
  };

  // Create squad handler
  const handleCreateSquad = () => {
    if (newSquadName.trim()) {
      setSquadCreated(true);
      // In real app, would call API to create squad
      setTimeout(() => {
        setShowCreateSquad(false);
        setSquadCreated(false);
        setNewSquadName('');
        setNewSquadVibe('adventurous');
        setNewSquadSports([]);
        setInviteEmails([]);
      }, 2000);
    }
  };

  // Send message handler
  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageSent(true);
      setTimeout(() => {
        setShowMessageModal(false);
        setMessageSent(false);
        setMessageText('');
        setMessageRecipient(null);
      }, 1500);
    }
  };

  // Open message modal
  const openMessageModal = (type: 'squad' | 'private', name: string, avatar?: string) => {
    setMessageRecipient({ type, name, avatar });
    setShowMessageModal(true);
  };

  // Comprehensive trip data for all squad members - includes booked, saved, and completed trips
  const memberTripData: Record<string, {
    booked: Array<{ tripId: string; tripTitle: string; date: string; spotsLeft?: number }>;
    saved: Array<{ tripId: string; tripTitle: string; savedAt: string }>;
    completed: Array<{ tripId: string; tripTitle: string; date: string }>;
  }> = {
    // Squad s1 - Powder Hunters
    'jake': {
      booked: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Jan 20-27, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '3', tripTitle: 'Chamonix Extreme Skiing', savedAt: '3 days ago' },
        { tripId: '39', tripTitle: 'Whistler Heli-Skiing', savedAt: '1 week ago' },
      ],
      completed: [
        { tripId: '2', tripTitle: 'Swiss Alps Adventure', date: 'Feb 2024' },
        { tripId: '17', tripTitle: 'UFC Fight Week Las Vegas', date: 'Jul 2024' },
      ],
    },
    'mika': {
      booked: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Jan 20-27, 2025', spotsLeft: 2 },
        { tripId: '10', tripTitle: 'Monaco Grand Prix', date: 'May 25-28, 2025', spotsLeft: 4 },
      ],
      saved: [
        { tripId: '21', tripTitle: 'Wimbledon Championships', savedAt: '2 days ago' },
      ],
      completed: [
        { tripId: '54', tripTitle: 'Grand Sumo Tournament Tokyo', date: 'Sep 2024' },
      ],
    },
    'tom': {
      booked: [
        { tripId: '39', tripTitle: 'Whistler Heli-Skiing', date: 'Mar 5-10, 2025', spotsLeft: 3 },
      ],
      saved: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', savedAt: '5 days ago' },
        { tripId: '8', tripTitle: 'Augusta Masters Experience', savedAt: '2 weeks ago' },
      ],
      completed: [
        { tripId: '3', tripTitle: 'Chamonix Extreme Skiing', date: 'Jan 2024' },
        { tripId: '26', tripTitle: 'Stanley Cup Finals', date: 'Jun 2024' },
      ],
    },
    'lisa': {
      booked: [
        { tripId: '10', tripTitle: 'Monaco Grand Prix', date: 'May 25-28, 2025', spotsLeft: 4 },
      ],
      saved: [
        { tripId: '3', tripTitle: 'Chamonix Extreme Skiing', savedAt: '1 week ago' },
        { tripId: '21', tripTitle: 'Wimbledon Championships', savedAt: '3 days ago' },
      ],
      completed: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Feb 2024' },
      ],
    },
    // Squad s2 - Après Ski Social
    'emma': {
      booked: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Jan 20-27, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '5', tripTitle: 'Bali Surf & Soul Retreat', savedAt: '1 day ago' },
        { tripId: '21', tripTitle: 'Wimbledon Championships', savedAt: '4 days ago' },
      ],
      completed: [
        { tripId: '18', tripTitle: 'Australian Open Melbourne', date: 'Jan 2024' },
        { tripId: '30', tripTitle: 'Coachella Music Festival', date: 'Apr 2024' },
      ],
    },
    'marco': {
      booked: [
        { tripId: '23', tripTitle: 'El Clasico Barcelona', date: 'Mar 15-18, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '10', tripTitle: 'Monaco Grand Prix', savedAt: '2 days ago' },
        { tripId: '47', tripTitle: 'MotoGP Italian Grand Prix', savedAt: '1 week ago' },
      ],
      completed: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Jan 2024' },
      ],
    },
    'sarah': {
      booked: [
        { tripId: '8', tripTitle: 'Augusta Masters Experience', date: 'Apr 10-14, 2025', spotsLeft: 1 },
      ],
      saved: [
        { tripId: '21', tripTitle: 'Wimbledon Championships', savedAt: '3 days ago' },
        { tripId: '49', tripTitle: 'Paris Fashion Week', savedAt: '2 weeks ago' },
      ],
      completed: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Feb 2024' },
        { tripId: '6', tripTitle: 'Napa Valley Wine', date: 'Sep 2024' },
      ],
    },
    'chris': {
      booked: [
        { tripId: '15', tripTitle: 'NBA All-Star Weekend LA', date: 'Feb 14-17, 2025', spotsLeft: 3 },
      ],
      saved: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', savedAt: '5 days ago' },
        { tripId: '8', tripTitle: 'Augusta Masters Experience', savedAt: '1 week ago' },
      ],
      completed: [
        { tripId: '32', tripTitle: 'NBA Finals Experience', date: 'Jun 2024' },
      ],
    },
    'yuki': {
      booked: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Jan 20-27, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '14', tripTitle: 'Tokyo Culinary Journey', savedAt: '3 days ago' },
        { tripId: '54', tripTitle: 'Grand Sumo Tournament', savedAt: '1 week ago' },
      ],
      completed: [
        { tripId: '13', tripTitle: 'Kyoto Heritage Trail', date: 'Nov 2024' },
        { tripId: '46', tripTitle: 'Tokyo Game Show VIP', date: 'Sep 2024' },
      ],
    },
    'alex': {
      booked: [
        { tripId: '23', tripTitle: 'El Clasico Barcelona', date: 'Mar 15-18, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '17', tripTitle: 'UFC Fight Week Las Vegas', savedAt: '2 days ago' },
        { tripId: '55', tripTitle: 'Le Mans 24 Hours', savedAt: '1 week ago' },
      ],
      completed: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Jan 2024' },
      ],
    },
    'nina': {
      booked: [
        { tripId: '49', tripTitle: 'Paris Fashion Week', date: 'Sep 28-Oct 4, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', savedAt: '1 day ago' },
        { tripId: '21', tripTitle: 'Wimbledon Championships', savedAt: '5 days ago' },
        { tripId: '10', tripTitle: 'Monaco Grand Prix', savedAt: '2 weeks ago' },
      ],
      completed: [
        { tripId: '6', tripTitle: 'Napa Valley Wine', date: 'Oct 2024' },
      ],
    },
    // Squad s3 - Zen Mountain
    'david': {
      booked: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Jan 20-27, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '4', tripTitle: 'Iceland Northern Lights', savedAt: '3 days ago' },
        { tripId: '15', tripTitle: 'NBA All-Star Weekend', savedAt: '1 week ago' },
      ],
      completed: [
        { tripId: '3', tripTitle: 'Chamonix Extreme Skiing', date: 'Feb 2024' },
        { tripId: '7', tripTitle: 'Patagonia Expedition', date: 'Nov 2024' },
      ],
    },
    'amy': {
      booked: [
        { tripId: '4', tripTitle: 'Iceland Northern Lights', date: 'Nov 15-22, 2025', spotsLeft: 4 },
      ],
      saved: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', savedAt: '2 days ago' },
        { tripId: '5', tripTitle: 'Bali Surf & Soul Retreat', savedAt: '1 week ago' },
      ],
      completed: [
        { tripId: '7', tripTitle: 'Patagonia Expedition', date: 'Oct 2024' },
        { tripId: '53', tripTitle: 'World Surf League Portugal', date: 'Oct 2024' },
      ],
    },
    'max': {
      booked: [
        { tripId: '10', tripTitle: 'Monaco Grand Prix', date: 'May 25-28, 2025', spotsLeft: 4 },
      ],
      saved: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', savedAt: '4 days ago' },
        { tripId: '23', tripTitle: 'El Clasico Barcelona', savedAt: '2 weeks ago' },
      ],
      completed: [
        { tripId: '55', tripTitle: 'Le Mans 24 Hours', date: 'Jun 2024' },
      ],
    },
    'sophie': {
      booked: [
        { tripId: '5', tripTitle: 'Bali Surf & Soul Retreat', date: 'Aug 10-17, 2025', spotsLeft: 3 },
      ],
      saved: [
        { tripId: '4', tripTitle: 'Iceland Northern Lights', savedAt: '1 day ago' },
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', savedAt: '1 week ago' },
      ],
      completed: [
        { tripId: '53', tripTitle: 'World Surf League Portugal', date: 'Oct 2024' },
      ],
    },
    'james': {
      booked: [
        { tripId: '5', tripTitle: 'Bali Surf & Soul Retreat', date: 'Aug 10-17, 2025', spotsLeft: 3 },
        { tripId: '17', tripTitle: 'UFC Fight Week', date: 'Jul 5-12, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', savedAt: '3 days ago' },
      ],
      completed: [
        { tripId: '51', tripTitle: 'America\'s Cup Auckland', date: 'Mar 2024' },
      ],
    },
    // Squad s4 - NBA Fanatics
    'marcus': {
      booked: [
        { tripId: '15', tripTitle: 'NBA All-Star Weekend LA', date: 'Feb 14-17, 2025', spotsLeft: 3 },
        { tripId: '32', tripTitle: 'NBA Finals Experience', date: 'Jun 5-15, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '19', tripTitle: 'Super Bowl Experience', savedAt: '2 days ago' },
        { tripId: '38', tripTitle: 'World Series Experience', savedAt: '1 week ago' },
      ],
      completed: [
        { tripId: '16', tripTitle: 'Monaco Grand Prix VIP', date: 'May 2024' },
        { tripId: '26', tripTitle: 'Stanley Cup Finals', date: 'Jun 2024' },
      ],
    },
    'jasmine': {
      booked: [
        { tripId: '15', tripTitle: 'NBA All-Star Weekend LA', date: 'Feb 14-17, 2025', spotsLeft: 3 },
      ],
      saved: [
        { tripId: '32', tripTitle: 'NBA Finals Experience', savedAt: '3 days ago' },
        { tripId: '19', tripTitle: 'Super Bowl Experience', savedAt: '1 week ago' },
        { tripId: '33', tripTitle: 'Champions League Final', savedAt: '2 weeks ago' },
      ],
      completed: [
        { tripId: '23', tripTitle: 'El Clasico Barcelona', date: 'Mar 2024' },
      ],
    },
    'derek': {
      booked: [
        { tripId: '32', tripTitle: 'NBA Finals Experience', date: 'Jun 5-15, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '15', tripTitle: 'NBA All-Star Weekend', savedAt: '1 day ago' },
        { tripId: '17', tripTitle: 'UFC Fight Week', savedAt: '5 days ago' },
      ],
      completed: [
        { tripId: '38', tripTitle: 'World Series Experience', date: 'Oct 2024' },
        { tripId: '40', tripTitle: 'Ironman World Championship', date: 'Oct 2024' },
      ],
    },
    'kim': {
      booked: [
        { tripId: '15', tripTitle: 'NBA All-Star Weekend LA', date: 'Feb 14-17, 2025', spotsLeft: 3 },
        { tripId: '24', tripTitle: 'Singapore Night Race', date: 'Sep 20-22, 2025', spotsLeft: 4 },
      ],
      saved: [
        { tripId: '23', tripTitle: 'El Clasico Barcelona', savedAt: '2 days ago' },
      ],
      completed: [
        { tripId: '10', tripTitle: 'Monaco Grand Prix', date: 'May 2024' },
      ],
    },
    'tyler': {
      booked: [
        { tripId: '15', tripTitle: 'NBA All-Star Weekend LA', date: 'Feb 14-17, 2025', spotsLeft: 3 },
      ],
      saved: [
        { tripId: '32', tripTitle: 'NBA Finals Experience', savedAt: '4 days ago' },
        { tripId: '8', tripTitle: 'Augusta Masters Experience', savedAt: '2 weeks ago' },
        { tripId: '19', tripTitle: 'Super Bowl Experience', savedAt: '3 weeks ago' },
      ],
      completed: [
        { tripId: '43', tripTitle: 'US Open Golf Championship', date: 'Jun 2024' },
      ],
    },
    // Squad s5 - Golf Legends
    'robert': {
      booked: [
        { tripId: '8', tripTitle: 'Augusta Masters Experience', date: 'Apr 10-14, 2025', spotsLeft: 1 },
        { tripId: '29', tripTitle: 'Ryder Cup Europe', date: 'Sep 26-28, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '43', tripTitle: 'US Open Golf Championship', savedAt: '1 week ago' },
      ],
      completed: [
        { tripId: '28', tripTitle: 'Tour de France Final Stage', date: 'Jul 2024' },
        { tripId: '21', tripTitle: 'Wimbledon Championships', date: 'Jul 2024' },
      ],
    },
    'catherine': {
      booked: [
        { tripId: '8', tripTitle: 'Augusta Masters Experience', date: 'Apr 10-14, 2025', spotsLeft: 1 },
      ],
      saved: [
        { tripId: '21', tripTitle: 'Wimbledon Championships', savedAt: '3 days ago' },
        { tripId: '45', tripTitle: 'Edinburgh Fringe Festival', savedAt: '1 week ago' },
      ],
      completed: [
        { tripId: '43', tripTitle: 'US Open Golf', date: 'Jun 2024' },
        { tripId: '10', tripTitle: 'Monaco Grand Prix', date: 'May 2024' },
      ],
    },
    'hiroshi': {
      booked: [
        { tripId: '8', tripTitle: 'Augusta Masters Experience', date: 'Apr 10-14, 2025', spotsLeft: 1 },
        { tripId: '43', tripTitle: 'US Open Golf Championship', date: 'Jun 12-15, 2025', spotsLeft: 3 },
      ],
      saved: [
        { tripId: '54', tripTitle: 'Grand Sumo Tournament', savedAt: '2 days ago' },
      ],
      completed: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Jan 2024' },
      ],
    },
    'patricia': {
      booked: [
        { tripId: '8', tripTitle: 'Augusta Masters Experience', date: 'Apr 10-14, 2025', spotsLeft: 1 },
      ],
      saved: [
        { tripId: '21', tripTitle: 'Wimbledon Championships', savedAt: '1 day ago' },
        { tripId: '15', tripTitle: 'NBA All-Star Weekend', savedAt: '4 days ago' },
        { tripId: '29', tripTitle: 'Ryder Cup Europe', savedAt: '2 weeks ago' },
      ],
      completed: [
        { tripId: '43', tripTitle: 'US Open Golf', date: 'Jun 2024' },
      ],
    },
    // Squad s6 - Football Ultras
    'carlos': {
      booked: [
        { tripId: '23', tripTitle: 'El Clasico Barcelona', date: 'Mar 15-18, 2025', spotsLeft: 2 },
        { tripId: '33', tripTitle: 'Champions League Final', date: 'Jun 1-4, 2025', spotsLeft: 4 },
      ],
      saved: [
        { tripId: '10', tripTitle: 'Monaco Grand Prix', savedAt: '3 days ago' },
      ],
      completed: [
        { tripId: '47', tripTitle: 'MotoGP Italian Grand Prix', date: 'Jun 2024' },
      ],
    },
    'priya': {
      booked: [
        { tripId: '33', tripTitle: 'Champions League Final', date: 'Jun 1-4, 2025', spotsLeft: 4 },
      ],
      saved: [
        { tripId: '23', tripTitle: 'El Clasico Barcelona', savedAt: '2 days ago' },
        { tripId: '21', tripTitle: 'Wimbledon Championships', savedAt: '1 week ago' },
        { tripId: '48', tripTitle: 'Cricket World Cup India', savedAt: '2 weeks ago' },
      ],
      completed: [
        { tripId: '10', tripTitle: 'Monaco Grand Prix', date: 'May 2024' },
      ],
    },
    'hans': {
      booked: [
        { tripId: '23', tripTitle: 'El Clasico Barcelona', date: 'Mar 15-18, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '33', tripTitle: 'Champions League Final', savedAt: '1 day ago' },
        { tripId: '55', tripTitle: 'Le Mans 24 Hours', savedAt: '5 days ago' },
      ],
      completed: [
        { tripId: '41', tripTitle: 'Rugby World Cup France', date: 'Oct 2024' },
        { tripId: '50', tripTitle: 'Berlin Marathon', date: 'Sep 2024' },
      ],
    },
    'lucia': {
      booked: [
        { tripId: '33', tripTitle: 'Champions League Final', date: 'Jun 1-4, 2025', spotsLeft: 4 },
      ],
      saved: [
        { tripId: '23', tripTitle: 'El Clasico Barcelona', savedAt: '3 days ago' },
        { tripId: '17', tripTitle: 'UFC Fight Week', savedAt: '2 weeks ago' },
      ],
      completed: [
        { tripId: '21', tripTitle: 'Wimbledon Championships', date: 'Jul 2024' },
      ],
    },
    'ahmed': {
      booked: [
        { tripId: '33', tripTitle: 'Champions League Final', date: 'Jun 1-4, 2025', spotsLeft: 4 },
        { tripId: '17', tripTitle: 'UFC Fight Week', date: 'Jul 5-12, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '10', tripTitle: 'Monaco Grand Prix', savedAt: '4 days ago' },
      ],
      completed: [
        { tripId: '22', tripTitle: 'Pipeline Masters Hawaii', date: 'Dec 2024' },
      ],
    },
    // Note: Sophie in s6 uses the same 'sophie' key as s3 - handled above
    // Squad s7 - Family Fun Squad
    'mike-&-sarah': {
      booked: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Jan 20-27, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '19', tripTitle: 'Super Bowl Experience', savedAt: '1 week ago' },
        { tripId: '38', tripTitle: 'World Series Experience', savedAt: '2 weeks ago' },
      ],
      completed: [
        { tripId: '39', tripTitle: 'Whistler Heli-Skiing', date: 'Feb 2024' },
        { tripId: '26', tripTitle: 'Stanley Cup Finals', date: 'Jun 2024' },
      ],
    },
    'kenji-&-yumi': {
      booked: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Jan 20-27, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '54', tripTitle: 'Grand Sumo Tournament', savedAt: '2 days ago' },
        { tripId: '10', tripTitle: 'Monaco Grand Prix', savedAt: '3 weeks ago' },
      ],
      completed: [
        { tripId: '46', tripTitle: 'Tokyo Game Show VIP', date: 'Sep 2024' },
      ],
    },
    'the-smiths': {
      booked: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Jan 20-27, 2025', spotsLeft: 2 },
        { tripId: '5', tripTitle: 'Bali Surf & Soul Retreat', date: 'Aug 10-17, 2025', spotsLeft: 3 },
      ],
      saved: [
        { tripId: '18', tripTitle: 'Australian Open Melbourne', savedAt: '1 week ago' },
      ],
      completed: [
        { tripId: '51', tripTitle: 'America\'s Cup Auckland', date: 'Mar 2024' },
      ],
    },
    'anna-&-peter': {
      booked: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Jan 20-27, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '3', tripTitle: 'Chamonix Extreme Skiing', savedAt: '4 days ago' },
        { tripId: '26', tripTitle: 'Stanley Cup Finals', savedAt: '2 weeks ago' },
        { tripId: '23', tripTitle: 'El Clasico Barcelona', savedAt: '1 month ago' },
      ],
      completed: [
        { tripId: '52', tripTitle: 'Six Nations Rugby', date: 'Mar 2024' },
      ],
    },
    // Squad s8 - Honeymoon Vibes
    'jake-&-emily': {
      booked: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Jan 20-27, 2025', spotsLeft: 2 },
        { tripId: '8', tripTitle: 'Augusta Masters Experience', date: 'Apr 10-14, 2025', spotsLeft: 1 },
      ],
      saved: [
        { tripId: '21', tripTitle: 'Wimbledon Championships', savedAt: '2 days ago' },
      ],
      completed: [
        { tripId: '6', tripTitle: 'Napa Valley Wine', date: 'Sep 2024' },
      ],
    },
    'pierre-&-marie': {
      booked: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Jan 20-27, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '10', tripTitle: 'Monaco Grand Prix', savedAt: '1 day ago' },
        { tripId: '49', tripTitle: 'Paris Fashion Week', savedAt: '1 week ago' },
        { tripId: '21', tripTitle: 'Wimbledon Championships', savedAt: '3 weeks ago' },
      ],
      completed: [
        { tripId: '28', tripTitle: 'Tour de France Final Stage', date: 'Jul 2024' },
      ],
    },
    'raj-&-ananya': {
      booked: [
        { tripId: '1', tripTitle: 'Niseko Powder Paradise', date: 'Jan 20-27, 2025', spotsLeft: 2 },
        { tripId: '23', tripTitle: 'El Clasico Barcelona', date: 'Mar 15-18, 2025', spotsLeft: 2 },
      ],
      saved: [
        { tripId: '48', tripTitle: 'Cricket World Cup India', savedAt: '3 days ago' },
      ],
      completed: [
        { tripId: '21', tripTitle: 'Wimbledon Championships', date: 'Jul 2024' },
      ],
    },
  };

  // Legacy format for backward compatibility
  const memberTripHistory: Record<string, Array<{ tripId: string; tripTitle: string; date: string; status: 'upcoming' | 'completed' }>> =
    Object.fromEntries(
      Object.entries(memberTripData).map(([memberId, data]) => [
        memberId,
        [
          ...data.booked.map(t => ({ ...t, status: 'upcoming' as const })),
          ...data.completed.map(t => ({ ...t, status: 'completed' as const })),
        ]
      ])
    );

  // Get trip by ID helper
  const getTripById = (tripId: string) => trips.find(t => t.id === tripId) || null;

  // Filter squads by all criteria
  const filteredSquads = squads.filter(squad => {
    // Sport filter
    const sportMatch = filterSports.length === 0 ||
      filterSports.some(sport => squad.sportInterests.includes(sport));

    // Relationship filter - check squad members
    const relationshipMatch = filterRelationship.length === 0 ||
      squad.members.some(m => filterRelationship.includes(m.relationshipStatus));

    // MBTI filter - check if any member's MBTI matches selected categories
    const mbtiMatch = filterMBTI.length === 0 ||
      squad.members.some(m => {
        const memberMBTI = m.mbtiType;
        if (!memberMBTI) return false;
        return filterMBTI.some(cat => {
          const category = mbtiCategories.find(c => c.id === cat);
          return category?.types.includes(memberMBTI) ?? false;
        });
      });

    return sportMatch && relationshipMatch && mbtiMatch;
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
          Back to Homepage
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-display font-bold text-warm-900">Squad Matching</span>
        </div>
        <div className="w-20" />
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <span className="badge badge-teal mb-4">Find Your Tribe</span>
          <h1 className="text-4xl md:text-5xl font-display text-warm-900 mb-4">
            Browse <span className="text-teal-600">Squads</span>
          </h1>
          <p className="text-lg text-warm-600 max-w-2xl mx-auto">
            Discover groups of travelers with similar interests. See what trips they're planning and join them on their next adventure!
          </p>
        </div>

        {/* Profile Completion Banner */}
        {profileCompleteness < 100 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-warm-900">
                  Want better recommendations?
                </h3>
                <p className="text-warm-600 text-sm">
                  Your profile is {profileCompleteness}% complete. The more we know about you, the better we can match you with perfect trips!
                </p>
              </div>
              <button
                onClick={onCompleteProfile}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-md flex-shrink-0"
              >
                Complete Profile
              </button>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-2 bg-white/60 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${profileCompleteness}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* AI Search Bar */}
        <div className="relative mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" />
              <input
                type="text"
                value={aiSearchQuery}
                onChange={(e) => setAiSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                placeholder="Find my soulmate... or try 'adventurous ski buddies'"
                className="w-full pl-12 pr-4 py-4 bg-white border border-cream-200 rounded-2xl text-warm-900 placeholder:text-warm-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all shadow-sm"
              />
            </div>
            <button
              onClick={handleAISearch}
              disabled={isAiSearching}
              className="px-6 py-4 bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 rounded-2xl text-white font-medium flex items-center gap-2 transition-all shadow-md disabled:opacity-70"
            >
              {isAiSearching ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Matching...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  AI Match
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Search Results */}
        {aiSearchResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-5 mb-6 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-teal-50"
          >
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-purple-500" />
              <div>
                <h3 className="font-bold text-warm-900">AI Found Your Matches</h3>
                <p className="text-sm text-warm-600">{aiSearchResult.interpretation}</p>
              </div>
              <button
                onClick={() => setAiSearchResult(null)}
                className="ml-auto text-warm-400 hover:text-warm-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-warm-500 mb-3">Click any squad to see details and member matches</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Sort by match percentage (highest first) and take top 4 */}
              {[...aiSearchResult.recommendedSquads]
                .sort((a, b) => b.matchPercentage - a.matchPercentage)
                .slice(0, 4)
                .map((score, idx) => {
                const squad = squads.find(s => s.id === score.squadId);
                if (!squad) return null;
                return (
                  <motion.div
                    key={squad.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => scrollToSquad(squad.id)}
                    className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all border border-cream-100 relative group"
                  >
                    {/* Rank Badge */}
                    <div className={`absolute -top-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                      idx === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white' :
                      idx === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-white' :
                      idx === 2 ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white' :
                      'bg-gradient-to-r from-purple-400 to-purple-500 text-white'
                    }`}>
                      #{idx + 1}
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{squad.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-warm-900 truncate">{squad.name}</div>
                        <div className="text-xs text-warm-500">{squad.members.length} members</div>
                      </div>
                    </div>

                    {/* Match Score Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-warm-500">Match Score</span>
                        <span className={`text-sm font-bold ${
                          score.matchPercentage >= 80 ? 'text-green-600' :
                          score.matchPercentage >= 60 ? 'text-amber-600' :
                          'text-gray-600'
                        }`}>
                          {score.matchPercentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-cream-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            score.matchPercentage >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                            score.matchPercentage >= 60 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                            'bg-gradient-to-r from-gray-400 to-gray-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${score.matchPercentage}%` }}
                          transition={{ duration: 0.6, delay: idx * 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Match Reasons */}
                    {score.matchReasons.length > 0 && (
                      <div className="space-y-1">
                        {score.matchReasons.slice(0, 2).map((reason, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-purple-600">
                            <Check className="w-3 h-3 text-purple-500" />
                            {reason}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* View Details Hint */}
                    <div className="mt-3 pt-2 border-t border-cream-100 flex items-center justify-between text-xs">
                      <span className="text-warm-400">Click to view details</span>
                      <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* AI Best Crew Recommendations */}
        {!aiSearchResult && Object.keys(squadMatchScores).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-teal-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-warm-900">AI Recommends Your Best Crew</h2>
                <p className="text-sm text-warm-600">Based on your interests and personality</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getTopRecommendedSquads().map((squad, idx) => {
                const score = squadMatchScores[squad.id];
                return (
                  <motion.div
                    key={squad.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setExpandedSquad(expandedSquad === squad.id ? null : squad.id)}
                    className="card p-5 cursor-pointer hover:shadow-xl transition-all relative overflow-hidden group"
                  >
                    {/* Rank Badge */}
                    <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white' :
                      idx === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-white' :
                      'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                    }`}>
                      #{idx + 1}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl">{squad.avatar}</span>
                      <div>
                        <h3 className="font-bold text-warm-900 text-lg">{squad.name}</h3>
                        <p className="text-sm text-warm-500">{squad.vibe}</p>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-3 bg-cream-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            score?.matchPercentage >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                            score?.matchPercentage >= 60 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                            'bg-gradient-to-r from-gray-400 to-gray-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${score?.matchPercentage || 0}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                        />
                      </div>
                      <span className={`font-bold text-lg ${
                        score?.matchPercentage >= 80 ? 'text-green-600' :
                        score?.matchPercentage >= 60 ? 'text-amber-600' :
                        'text-gray-600'
                      }`}>
                        {score?.matchPercentage || 0}%
                      </span>
                    </div>

                    {/* Match Reasons */}
                    <div className="space-y-1">
                      {score?.matchReasons.slice(0, 2).map((reason, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-warm-600">
                          <Check className="w-4 h-4 text-teal-500" />
                          {reason}
                        </div>
                      ))}
                    </div>

                    {/* Members preview */}
                    <div className="mt-4 flex items-center">
                      <div className="flex -space-x-2">
                        {squad.members.slice(0, 4).map((m, i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-cream-100 border-2 border-white flex items-center justify-center text-sm">
                            {m.avatar}
                          </div>
                        ))}
                      </div>
                      <span className="ml-3 text-sm text-warm-500">{squad.members.length} members</span>
                    </div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Enhanced Filter Section */}
        <div className="card p-4 mb-6">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-4 pb-3 border-b border-cream-200">
            {[
              { id: 'interests', label: 'Interests', icon: '🎯' },
              { id: 'relationship', label: 'Status', icon: '💑' },
              { id: 'mbti', label: 'MBTI', icon: '🧠' },
              { id: 'group', label: 'Group Size', icon: '👥' },
              { id: 'date', label: 'Travel Date', icon: '📅' },
              { id: 'budget', label: 'Budget', icon: '💰' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilterTab(activeFilterTab === tab.id ? null : tab.id as typeof activeFilterTab)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeFilterTab === tab.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}

            {/* Clear Filters & Create Squad */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all"
              >
                Clear ({activeFilterCount})
              </button>
            )}
            <button
              onClick={() => setShowCreateSquad(true)}
              className="px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-teal-500 text-white hover:from-purple-600 hover:to-teal-600 shadow-sm ml-auto"
            >
              <Plus className="w-4 h-4" />
              Create Your Own
            </button>
          </div>

          {/* Filter Content */}
          <AnimatePresence mode="wait">
            {/* Interests Filter */}
            {activeFilterTab === 'interests' && (
              <motion.div
                key="interests"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                {/* Interest Categories */}
                <div className="flex gap-2 mb-3">
                  {interestCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setFilterInterestCategory(filterInterestCategory === cat.id ? null : cat.id as typeof filterInterestCategory)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                        filterInterestCategory === cat.id
                          ? 'bg-teal-600 text-white'
                          : 'bg-cream-50 text-warm-700 border border-cream-200 hover:bg-cream-100'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
                {/* Sport Tags */}
                <p className="text-xs text-warm-500 font-medium uppercase tracking-wide">Sports & Activities</p>
                <div className="flex flex-wrap gap-2">
                  {sportCategories.map(sport => (
                    <button
                      key={sport.id}
                      onClick={() => toggleFilterSport(sport.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                        filterSports.includes(sport.id)
                          ? 'bg-teal-600 text-white'
                          : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
                      }`}
                    >
                      <span>{sport.icon}</span>
                      {sport.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Relationship Status Filter */}
            {activeFilterTab === 'relationship' && (
              <motion.div
                key="relationship"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-xs text-warm-500 font-medium uppercase tracking-wide mb-3">Relationship Status</p>
                <div className="flex flex-wrap gap-2">
                  {relationshipStatuses.map(status => (
                    <button
                      key={status.id}
                      onClick={() => toggleFilterRelationship(status.id)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                        filterRelationship.includes(status.id)
                          ? 'bg-pink-500 text-white'
                          : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
                      }`}
                    >
                      <span>{status.icon}</span>
                      {status.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* MBTI Filter */}
            {activeFilterTab === 'mbti' && (
              <motion.div
                key="mbti"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-xs text-warm-500 font-medium uppercase tracking-wide mb-3">Personality Type (MBTI Categories)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {mbtiCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => toggleFilterMBTI(cat.id)}
                      className={`p-3 rounded-xl transition-all text-left ${
                        filterMBTI.includes(cat.id)
                          ? 'bg-purple-500 text-white ring-2 ring-purple-300'
                          : 'bg-cream-50 text-warm-700 border border-cream-200 hover:bg-cream-100'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <p className="font-semibold text-sm mt-1">{cat.label}</p>
                      <p className={`text-xs ${filterMBTI.includes(cat.id) ? 'text-white/80' : 'text-warm-500'}`}>
                        {cat.desc}
                      </p>
                      <p className={`text-xs mt-1 ${filterMBTI.includes(cat.id) ? 'text-white/60' : 'text-warm-400'}`}>
                        {cat.types.join(', ')}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Group Size Filter */}
            {activeFilterTab === 'group' && (
              <motion.div
                key="group"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-xs text-warm-500 font-medium uppercase tracking-wide mb-3">Preferred Group Size</p>
                <div className="flex flex-wrap gap-2">
                  {groupSizeOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setFilterGroupSize(filterGroupSize === option.id ? null : option.id)}
                      className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                        filterGroupSize === option.id
                          ? 'bg-teal-600 text-white'
                          : 'bg-cream-50 text-warm-700 border border-cream-200 hover:bg-cream-100'
                      }`}
                    >
                      <span className="text-xl">{option.icon}</span>
                      <div className="text-left">
                        <p className="text-sm font-semibold">{option.label}</p>
                        <p className={`text-xs ${filterGroupSize === option.id ? 'text-white/70' : 'text-warm-500'}`}>
                          {option.size} people
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Travel Date Filter */}
            {activeFilterTab === 'date' && (
              <motion.div
                key="date"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-xs text-warm-500 font-medium uppercase tracking-wide mb-3">Preferred Travel Month</p>
                <div className="flex flex-wrap gap-2">
                  {travelMonths.map(month => (
                    <button
                      key={month}
                      onClick={() => setFilterTravelMonth(filterTravelMonth === month ? null : month)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        filterTravelMonth === month
                          ? 'bg-teal-600 text-white'
                          : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Budget Filter */}
            {activeFilterTab === 'budget' && (
              <motion.div
                key="budget"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-xs text-warm-500 font-medium uppercase tracking-wide mb-3">Budget Range</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {budgetOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setFilterBudget(filterBudget === option.id ? null : option.id)}
                      className={`p-3 rounded-xl transition-all text-left ${
                        filterBudget === option.id
                          ? 'bg-green-500 text-white ring-2 ring-green-300'
                          : 'bg-cream-50 text-warm-700 border border-cream-200 hover:bg-cream-100'
                      }`}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <p className="font-semibold text-sm mt-1">{option.label}</p>
                      <p className={`text-xs ${filterBudget === option.id ? 'text-white/80' : 'text-warm-500'}`}>
                        {option.range}
                      </p>
                      <p className={`text-xs ${filterBudget === option.id ? 'text-white/60' : 'text-warm-400'}`}>
                        {option.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div className="mt-4 pt-3 border-t border-cream-200 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-warm-500 font-medium">Active:</span>
              {filterSports.map(s => {
                const sport = sportCategories.find(sc => sc.id === s);
                return sport ? (
                  <span key={s} className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs flex items-center gap-1">
                    {sport.icon} {sport.name}
                    <button onClick={() => toggleFilterSport(s)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ) : null;
              })}
              {filterRelationship.map(r => {
                const status = relationshipStatuses.find(rs => rs.id === r);
                return status ? (
                  <span key={r} className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs flex items-center gap-1">
                    {status.icon} {status.name}
                    <button onClick={() => toggleFilterRelationship(r)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ) : null;
              })}
              {filterMBTI.map(m => {
                const cat = mbtiCategories.find(mc => mc.id === m);
                return cat ? (
                  <span key={m} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center gap-1">
                    {cat.icon} {cat.label}
                    <button onClick={() => toggleFilterMBTI(m)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ) : null;
              })}
              {filterGroupSize && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
                  {groupSizeOptions.find(g => g.id === filterGroupSize)?.icon} {groupSizeOptions.find(g => g.id === filterGroupSize)?.label}
                  <button onClick={() => setFilterGroupSize(null)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              )}
              {filterTravelMonth && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs flex items-center gap-1">
                  📅 {filterTravelMonth}
                  <button onClick={() => setFilterTravelMonth(null)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              )}
              {filterBudget && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                  {budgetOptions.find(b => b.id === filterBudget)?.icon} {budgetOptions.find(b => b.id === filterBudget)?.label}
                  <button onClick={() => setFilterBudget(null)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-warm-600">
            <span className="font-semibold text-warm-900">{filteredSquads.length}</span> squad{filteredSquads.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Squads Grid */}
        <div className="grid gap-6">
          {filteredSquads.map((squad, index) => (
            <motion.div
              key={squad.id}
              id={`squad-${squad.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden scroll-mt-24"
            >
              {/* Squad Header */}
              <div
                onClick={() => setExpandedSquad(expandedSquad === squad.id ? null : squad.id)}
                className="p-5 cursor-pointer hover:bg-cream-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {squad.members.slice(0, 4).map((member, i) => (
                        <div
                          key={i}
                          className="w-12 h-12 rounded-full bg-cream-200 border-2 border-white flex items-center justify-center text-lg"
                          title={member.name}
                        >
                          {member.avatar}
                        </div>
                      ))}
                      {squad.members.length > 4 && (
                        <div className="w-12 h-12 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-sm font-medium text-teal-700">
                          +{squad.members.length - 4}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-semibold text-warm-900">{squad.name}</h3>
                      <p className="text-warm-500">{squad.members.length} members • {squad.vibe} vibe</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Match Percentage Badge */}
                    {squadMatchScores[squad.id] && (
                      <div className={`px-3 py-1.5 rounded-xl text-sm font-bold ${
                        squadMatchScores[squad.id].matchPercentage >= 80
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : squadMatchScores[squad.id].matchPercentage >= 60
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {squadMatchScores[squad.id].matchPercentage}% Match
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {squad.sportInterests.slice(0, 3).map(sport => {
                        const sportData = sportCategories.find(s => s.id === sport);
                        return sportData ? (
                          <span key={sport} className="text-lg" title={sportData.name}>
                            {sportData.icon}
                          </span>
                        ) : null;
                      })}
                    </div>
                    <ChevronDown className={`w-6 h-6 text-warm-400 transition-transform ${expandedSquad === squad.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Expanded Squad Details */}
              <AnimatePresence>
                {expandedSquad === squad.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-cream-200"
                  >
                    <div className="p-5">
                      <h4 className="font-semibold text-warm-800 mb-4">Squad Members & Their Trips</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {squad.members.map((member) => {
                          const memberId = member.name.toLowerCase().replace(' ', '-');
                          const memberTrips = memberTripHistory[memberId] || [];

                          return (
                            <div
                              key={member.name}
                              className={`rounded-xl border transition-all ${
                                expandedMember === member.name
                                  ? 'border-teal-300 bg-teal-50/50'
                                  : 'border-cream-200 bg-white'
                              }`}
                            >
                              {/* Member Header */}
                              {(() => {
                                const memberMatch = calculateMemberMatch(member);
                                return (
                                  <div
                                    onClick={() => setExpandedMember(expandedMember === member.name ? null : member.name)}
                                    className="p-4 cursor-pointer hover:bg-cream-50 rounded-t-xl"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="relative">
                                        <div className="w-14 h-14 rounded-full bg-cream-100 flex items-center justify-center text-2xl border-2 border-white shadow">
                                          {member.avatar}
                                        </div>
                                        {/* Member Match Badge */}
                                        <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold shadow ${
                                          memberMatch.percentage >= 80 ? 'bg-green-500 text-white' :
                                          memberMatch.percentage >= 60 ? 'bg-amber-500 text-white' :
                                          'bg-gray-400 text-white'
                                        }`}>
                                          {memberMatch.percentage}%
                                        </div>
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <p className="font-semibold text-warm-900">{member.name}</p>
                                          {memberMatch.percentage >= 80 && (
                                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium rounded">
                                              Great Match
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-warm-500">
                                          <span>{member.nationality}</span>
                                          <span>•</span>
                                          <span>{member.travelStyle}</span>
                                        </div>
                                        {/* Match reasons */}
                                        {memberMatch.reasons.length > 0 && (
                                          <div className="flex items-center gap-2 mt-1 text-xs text-purple-600">
                                            {memberMatch.reasons.map((reason, i) => (
                                              <span key={i} className="flex items-center gap-0.5">
                                                <Sparkles className="w-3 h-3" />
                                                {reason}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                        <div className="flex items-center gap-1 mt-1">
                                          {member.sportInterests.slice(0, 3).map(sport => {
                                            const sportData = sportCategories.find(s => s.id === sport);
                                            return sportData ? (
                                              <span key={sport} className="text-sm" title={sportData.name}>
                                                {sportData.icon}
                                              </span>
                                            ) : null;
                                          })}
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end gap-1">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedMemberProfile(member);
                                            setShowMemberProfileModal(true);
                                          }}
                                          className="px-2 py-1 text-xs bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors flex items-center gap-1"
                                        >
                                          <Eye className="w-3 h-3" />
                                          Profile
                                        </button>
                                        <span className="text-sm text-teal-600 font-medium">
                                          {memberTrips.length} trip{memberTrips.length !== 1 ? 's' : ''}
                                        </span>
                                        <ChevronDown className={`w-5 h-5 text-warm-400 transition-transform ${
                                          expandedMember === member.name ? 'rotate-180' : ''
                                        }`} />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Member's Trips - Booked, Saved, Completed */}
                              <AnimatePresence>
                                {expandedMember === member.name && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="border-t border-cream-200"
                                  >
                                    <div className="p-4 space-y-4">
                                      {/* Booked Trips - Most Important */}
                                      {(memberTripData[memberId]?.booked?.length || 0) > 0 && (
                                        <div>
                                          <p className="text-xs text-teal-600 uppercase tracking-wide font-semibold mb-2 flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            Booked Trips - Join {member.name.split(' ')[0]}!
                                          </p>
                                          <div className="space-y-2">
                                            {memberTripData[memberId]?.booked.map((tripInfo) => {
                                              const fullTrip = getTripById(tripInfo.tripId);
                                              return (
                                                <div
                                                  key={tripInfo.tripId}
                                                  className="bg-gradient-to-r from-teal-50 to-green-50 rounded-lg p-3 border-2 border-teal-200"
                                                >
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                      {fullTrip && (
                                                        <div className="w-14 h-14 rounded-lg overflow-hidden ring-2 ring-teal-300">
                                                          <img src={fullTrip.image} alt={fullTrip.title} className="w-full h-full object-cover" />
                                                        </div>
                                                      )}
                                                      <div>
                                                        <p className="font-semibold text-warm-900">{tripInfo.tripTitle}</p>
                                                        <div className="flex items-center gap-2 text-xs text-warm-600">
                                                          <Calendar className="w-3 h-3" />
                                                          {tripInfo.date}
                                                        </div>
                                                        {tripInfo.spotsLeft && (
                                                          <span className="inline-block mt-1 px-2 py-0.5 bg-teal-500 text-white text-xs rounded-full font-medium">
                                                            {tripInfo.spotsLeft} spot{tripInfo.spotsLeft > 1 ? 's' : ''} left!
                                                          </span>
                                                        )}
                                                      </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                      {fullTrip && (
                                                        <>
                                                          <button
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              onJoinTrip(fullTrip, squad);
                                                            }}
                                                            className="px-4 py-2 text-xs bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-1 font-medium"
                                                          >
                                                            <UserPlus className="w-3 h-3" />
                                                            Join Trip
                                                          </button>
                                                          <button
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              openMessageModal('private', member.name, member.avatar);
                                                            }}
                                                            className="px-4 py-2 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-1"
                                                          >
                                                            <MessageCircle className="w-3 h-3" />
                                                            Chat to Join
                                                          </button>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}

                                      {/* Saved Trips - Interested In */}
                                      {(memberTripData[memberId]?.saved?.length || 0) > 0 && (
                                        <div>
                                          <p className="text-xs text-amber-600 uppercase tracking-wide font-semibold mb-2 flex items-center gap-1">
                                            <Heart className="w-3 h-3" />
                                            Saved / Interested - Start a Trip Together?
                                          </p>
                                          <div className="space-y-2">
                                            {memberTripData[memberId]?.saved.map((tripInfo) => {
                                              const fullTrip = getTripById(tripInfo.tripId);
                                              return (
                                                <div
                                                  key={tripInfo.tripId}
                                                  className="bg-amber-50 rounded-lg p-3 border border-amber-200"
                                                >
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                      {fullTrip && (
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                                                          <img src={fullTrip.image} alt={fullTrip.title} className="w-full h-full object-cover" />
                                                        </div>
                                                      )}
                                                      <div>
                                                        <p className="font-medium text-warm-900 text-sm">{tripInfo.tripTitle}</p>
                                                        <div className="flex items-center gap-2 text-xs text-warm-500">
                                                          <Heart className="w-3 h-3 text-amber-500" />
                                                          Saved {tripInfo.savedAt}
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                      {fullTrip && (
                                                        <>
                                                          <button
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              onViewTrip(fullTrip);
                                                            }}
                                                            className="px-3 py-1.5 text-xs bg-cream-100 text-warm-600 rounded-lg hover:bg-cream-200 transition-colors"
                                                          >
                                                            View
                                                          </button>
                                                          <button
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              openMessageModal('private', member.name, member.avatar);
                                                            }}
                                                            className="px-3 py-1.5 text-xs bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-1"
                                                          >
                                                            <MessageCircle className="w-3 h-3" />
                                                            Plan Together
                                                          </button>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}

                                      {/* Completed Trips - Past Experience */}
                                      {(memberTripData[memberId]?.completed?.length || 0) > 0 && (
                                        <div>
                                          <p className="text-xs text-warm-500 uppercase tracking-wide font-medium mb-2 flex items-center gap-1">
                                            <Award className="w-3 h-3" />
                                            Past Trips
                                          </p>
                                          <div className="space-y-2">
                                            {memberTripData[memberId]?.completed.map((tripInfo) => {
                                              const fullTrip = getTripById(tripInfo.tripId);
                                              return (
                                                <div
                                                  key={tripInfo.tripId}
                                                  className="bg-cream-50 rounded-lg p-2 border border-cream-200"
                                                >
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                      {fullTrip && (
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden opacity-80">
                                                          <img src={fullTrip.image} alt={fullTrip.title} className="w-full h-full object-cover" />
                                                        </div>
                                                      )}
                                                      <div>
                                                        <p className="font-medium text-warm-700 text-sm">{tripInfo.tripTitle}</p>
                                                        <p className="text-xs text-warm-400">{tripInfo.date}</p>
                                                      </div>
                                                    </div>
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                                      Completed
                                                    </span>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}

                                      {/* No trips at all */}
                                      {(!memberTripData[memberId] ||
                                        (memberTripData[memberId].booked.length === 0 &&
                                         memberTripData[memberId].saved.length === 0 &&
                                         memberTripData[memberId].completed.length === 0)) && (
                                        <p className="text-sm text-warm-400 text-center py-3">
                                          No trips yet - be the first to invite them!
                                        </p>
                                      )}

                                      {/* Private Message Button */}
                                      <div className="pt-3 mt-3 border-t border-cream-200">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openMessageModal('private', member.name, member.avatar);
                                          }}
                                          className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-500 to-teal-500 text-white rounded-lg hover:from-purple-600 hover:to-teal-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-md"
                                        >
                                          <Mail className="w-4 h-4" />
                                          Message {member.name.split(' ')[0]} to Start a Trip
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>

                      {/* Squad Actions */}
                      <div className="mt-6 pt-4 border-t border-cream-200 flex flex-wrap gap-3">
                        <button className="btn btn-primary flex items-center gap-2">
                          <UserPlus className="w-5 h-5" />
                          Join This Squad
                        </button>
                        <button
                          onClick={() => openMessageModal('squad', squad.name)}
                          className="btn btn-outline flex items-center gap-2"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Message Squad
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {filteredSquads.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-warm-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-warm-700 mb-2">No Squads Found</h3>
            <p className="text-warm-500">Try adjusting your filters or check back later</p>
          </div>
        )}

      </div>

      {/* Create Your Own Squad Modal */}
      <AnimatePresence>
        {showCreateSquad && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-warm-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !squadCreated && setShowCreateSquad(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {squadCreated ? (
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-warm-900 mb-2">Squad Created!</h3>
                  <p className="text-warm-600">Invitations have been sent to your friends.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-cream-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-display font-bold text-warm-900">Create Your Squad</h3>
                      <button
                        onClick={() => setShowCreateSquad(false)}
                        className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-warm-500" />
                      </button>
                    </div>
                    <p className="text-warm-600 text-sm mt-1">Design your own travel group and invite friends</p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Squad Name */}
                    <div>
                      <label className="block text-sm font-medium text-warm-700 mb-2">Squad Name</label>
                      <input
                        type="text"
                        value={newSquadName}
                        onChange={(e) => setNewSquadName(e.target.value)}
                        placeholder="e.g., Weekend Warriors, Globe Trotters..."
                        className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>

                    {/* Squad Vibe */}
                    <div>
                      <label className="block text-sm font-medium text-warm-700 mb-2">Squad Vibe</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'adventurous', label: 'Adventurous', icon: '🏔️', desc: 'Thrill seekers' },
                          { id: 'relaxed', label: 'Relaxed', icon: '🌴', desc: 'Chill travelers' },
                          { id: 'party', label: 'Party', icon: '🎉', desc: 'Fun lovers' },
                          { id: 'cultural', label: 'Cultural', icon: '🏛️', desc: 'History buffs' },
                        ].map((vibe) => (
                          <button
                            key={vibe.id}
                            onClick={() => setNewSquadVibe(vibe.id as typeof newSquadVibe)}
                            className={`p-3 rounded-xl border-2 transition-all text-left ${
                              newSquadVibe === vibe.id
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-cream-200 hover:border-cream-300'
                            }`}
                          >
                            <span className="text-xl">{vibe.icon}</span>
                            <p className="font-medium text-warm-900 text-sm mt-1">{vibe.label}</p>
                            <p className="text-xs text-warm-500">{vibe.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sport Interests */}
                    <div>
                      <label className="block text-sm font-medium text-warm-700 mb-2">Sport Interests</label>
                      <div className="flex flex-wrap gap-2">
                        {sportCategories.slice(0, 10).map((sport) => (
                          <button
                            key={sport.id}
                            onClick={() => toggleNewSquadSport(sport.id)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                              newSquadSports.includes(sport.id)
                                ? 'bg-teal-600 text-white'
                                : 'bg-cream-100 text-warm-600 hover:bg-cream-200'
                            }`}
                          >
                            <span>{sport.icon}</span>
                            {sport.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Invite Friends */}
                    <div>
                      <label className="block text-sm font-medium text-warm-700 mb-2">Invite Friends</label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="email"
                          value={newInviteEmail}
                          onChange={(e) => setNewInviteEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addInviteEmailToSquad()}
                          placeholder="Enter email address..."
                          className="flex-1 px-4 py-2 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                        <button
                          onClick={addInviteEmailToSquad}
                          disabled={!newInviteEmail.includes('@')}
                          className="px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 disabled:opacity-50"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      {inviteEmails.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {inviteEmails.map((email) => (
                            <span key={email} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              {email}
                              <button
                                onClick={() => setInviteEmails(prev => prev.filter(e => e !== email))}
                                className="hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-warm-500 mt-2">
                        {inviteEmails.length} friend{inviteEmails.length !== 1 ? 's' : ''} will receive an invitation
                      </p>
                    </div>
                  </div>

                  <div className="p-6 border-t border-cream-200 flex gap-3">
                    <button
                      onClick={() => setShowCreateSquad(false)}
                      className="flex-1 btn btn-ghost"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateSquad}
                      disabled={!newSquadName.trim()}
                      className="flex-1 btn bg-gradient-to-r from-purple-500 to-teal-500 text-white disabled:opacity-50"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Create Squad
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessageModal && messageRecipient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-warm-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !messageSent && setShowMessageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
            >
              {messageSent ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-warm-900 mb-2">Message Sent!</h3>
                  <p className="text-warm-600">
                    {messageRecipient.type === 'squad' ? 'All squad members' : messageRecipient.name} will receive your message.
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-5 border-b border-cream-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {messageRecipient.type === 'private' && messageRecipient.avatar ? (
                          <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-xl">
                            {messageRecipient.avatar}
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-warm-900">
                            {messageRecipient.type === 'squad' ? `Message ${messageRecipient.name}` : `Message ${messageRecipient.name}`}
                          </h3>
                          <p className="text-xs text-warm-500">
                            {messageRecipient.type === 'squad' ? 'All members will see this' : 'Private message'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowMessageModal(false)}
                        className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-warm-500" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder={
                        messageRecipient.type === 'squad'
                          ? "Hi everyone! I'm interested in joining your squad..."
                          : `Hi ${messageRecipient.name.split(' ')[0]}! I saw your trip and...`
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                    />
                    <p className="text-xs text-warm-400 mt-2">
                      {messageRecipient.type === 'private' && (
                        <>This message will be sent directly to {messageRecipient.name}</>
                      )}
                    </p>
                  </div>

                  <div className="p-5 border-t border-cream-200 flex gap-3">
                    <button
                      onClick={() => setShowMessageModal(false)}
                      className="flex-1 btn btn-ghost"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="flex-1 btn btn-primary disabled:opacity-50"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Member Profile Modal */}
      {showMemberProfileModal && selectedMemberProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowMemberProfileModal(false)}
              className="absolute top-4 right-4 p-2 text-warm-400 hover:text-warm-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header - Large Avatar & Name */}
            <div className="text-center mb-5">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 mx-auto mb-3 flex items-center justify-center text-5xl shadow-lg">
                {selectedMemberProfile.avatar}
              </div>
              <h3 className="font-display text-2xl text-warm-800">{selectedMemberProfile.name}</h3>
            </div>

            {/* Location & Age */}
            <div className="flex items-center justify-center gap-2 mb-3 text-warm-600">
              <span className="text-lg">
                {selectedMemberProfile.nationality === 'us' ? '🇺🇸' :
                 selectedMemberProfile.nationality === 'uk' ? '🇬🇧' :
                 selectedMemberProfile.nationality === 'ca' ? '🇨🇦' :
                 selectedMemberProfile.nationality === 'au' ? '🇦🇺' :
                 selectedMemberProfile.nationality === 'jp' ? '🇯🇵' :
                 selectedMemberProfile.nationality === 'de' ? '🇩🇪' :
                 selectedMemberProfile.nationality === 'fr' ? '🇫🇷' :
                 selectedMemberProfile.nationality === 'br' ? '🇧🇷' :
                 selectedMemberProfile.nationality === 'mx' ? '🇲🇽' :
                 selectedMemberProfile.nationality === 'kr' ? '🇰🇷' :
                 selectedMemberProfile.nationality === 'it' ? '🇮🇹' :
                 selectedMemberProfile.nationality === 'es' ? '🇪🇸' : '🌍'}
              </span>
              <span className="font-medium">
                {selectedMemberProfile.from}{selectedMemberProfile.age ? `, ${selectedMemberProfile.age}` : ''}
              </span>
            </div>

            {/* Relationship Status */}
            <div className="flex items-center justify-center gap-2 mb-4 text-warm-600">
              <span className="text-lg">👤</span>
              <span className="capitalize">{selectedMemberProfile.relationshipStatus || 'Not specified'}</span>
            </div>

            {/* Bio */}
            {selectedMemberProfile.bio && (
              <p className="text-center text-warm-600 text-sm mb-4 italic px-4">
                {selectedMemberProfile.bio}
              </p>
            )}

            {/* Travel Style Tag */}
            {selectedMemberProfile.travelStyle && (
              <div className="flex justify-center mb-4">
                <span className="px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {selectedMemberProfile.travelStyle}
                </span>
              </div>
            )}

            {/* Sport Interests Icons */}
            {selectedMemberProfile.sportInterests && selectedMemberProfile.sportInterests.length > 0 && (
              <div className="flex justify-center gap-3 mb-4">
                {selectedMemberProfile.sportInterests.slice(0, 5).map((sport, idx) => (
                  <div key={idx} className="w-12 h-12 bg-cream-100 rounded-xl shadow-sm flex items-center justify-center text-2xl">
                    {sport === 'skiing' ? '⛷️' :
                     sport === 'surfing' ? '🏄' :
                     sport === 'nba' ? '🏀' :
                     sport === 'nfl' ? '🏈' :
                     sport === 'mlb' ? '⚾' :
                     sport === 'nhl' ? '🏒' :
                     sport === 'fifa' ? '⚽' :
                     sport === 'f1' ? '🏎️' :
                     sport === 'golf' ? '⛳' :
                     sport === 'tennis' ? '🎾' :
                     sport === 'cycling' ? '🚴' :
                     sport === 'mma' ? '🥊' : '🎯'}
                  </div>
                ))}
              </div>
            )}

            {/* MBTI Badge */}
            {selectedMemberProfile.mbtiType && (
              <div className="flex justify-center mb-5">
                <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                  {selectedMemberProfile.mbtiType}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  openMessageModal('private', selectedMemberProfile.name, selectedMemberProfile.avatar);
                  setShowMemberProfileModal(false);
                }}
                className="w-full py-3 bg-teal-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" /> Send Message
              </button>
              <button
                onClick={() => setShowMemberProfileModal(false)}
                className="w-full py-3 bg-cream-100 text-warm-700 rounded-xl font-medium hover:bg-cream-200 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

// ============ SQUAD SCREEN ============
function SquadScreen({ trip, squads, selectedSquad, onSelect, onContinue, onBack, onBookTrip, onSaveForLater }: {
  trip: Trip;
  squads: Squad[];
  selectedSquad: Squad | null;
  onSelect: (s: Squad) => void;
  onContinue: () => void;
  onBack: () => void;
  onBookTrip: (squad: Squad) => void;
  onSaveForLater: (squad: Squad) => void;
}) {
  const [selectedSports, setSelectedSports] = useState<SportCategory[]>([]);
  const [selectedNationalities, setSelectedNationalities] = useState<Nationality[]>([]);
  const [selectedRelationships, setSelectedRelationships] = useState<RelationshipStatus[]>([]);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [bookingSquad, setBookingSquad] = useState<string | null>(null);
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

        {/* Booking Actions */}
        {selectedSquad && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky bottom-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-cream-200"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedSquad.avatar}</span>
                <div>
                  <p className="font-semibold text-warm-800">{selectedSquad.name}</p>
                  <p className="text-sm text-warm-500">{selectedSquad.members.length} travelers • {trip.price}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onSaveForLater(selectedSquad)}
                  className="btn bg-cream-100 text-warm-700 hover:bg-cream-200 flex items-center gap-2 px-4"
                >
                  <Heart className="w-4 h-4" />
                  Save for Later
                </button>
                <button
                  onClick={() => onBookTrip(selectedSquad)}
                  className="btn bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 flex items-center gap-2 px-6 shadow-lg"
                >
                  <Check className="w-5 h-5" />
                  Book Trip & Join Squad
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {!selectedSquad && (
          <div className="text-center py-4">
            <p className="text-warm-500">Select a squad above to continue</p>
          </div>
        )}
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
function MemoryMakerScreen({ trip, squad, uploadedFiles, onUpload, onOpenStudio, onBack, onManageTrips, userEmail, onSaveEmail }: {
  trip: Trip;
  squad: Squad;
  uploadedFiles: string[];
  onUpload: (files: string[]) => void;
  onOpenStudio: () => void;
  onBack: () => void;
  onManageTrips: () => void;
  userEmail: string | null;
  onSaveEmail: (email: string) => void;
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
  const [selectedMemberProfile, setSelectedMemberProfile] = useState<string | null>(null);
  const [signInEmail, setSignInEmail] = useState('');
  const [showSignInPrompt, setShowSignInPrompt] = useState(!userEmail);

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
        <button onClick={onManageTrips} className="flex items-center gap-2 text-warm-600 hover:text-teal-600 mb-8">
          <ChevronLeft className="w-5 h-5" /> Back to My Trip
        </button>

        {/* Sign-in Prompt for Saving Trip */}
        {showSignInPrompt && !userEmail && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4 mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800 mb-1">Save Your Trip Progress</h3>
                <p className="text-sm text-amber-600 mb-3">
                  Sign in with your email to save your trip, booking info, and access it anytime.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-xl border border-amber-300 bg-white text-warm-800 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                  />
                  <button
                    onClick={() => {
                      if (signInEmail.includes('@')) {
                        onSaveEmail(signInEmail);
                        setShowSignInPrompt(false);
                      }
                    }}
                    disabled={!signInEmail.includes('@')}
                    className="px-4 py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Sign In
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowSignInPrompt(false)}
                className="text-amber-400 hover:text-amber-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Signed In Confirmation */}
        {userEmail && (
          <div className="card p-3 mb-6 bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-green-700">
                  <span className="font-medium">Signed in as {userEmail}</span> - Your trip is being saved automatically
                </p>
              </div>
            </div>
          </div>
        )}

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
                  {groupMembers.map((member) => {
                    const memberNat = nationalities.find(n => n.id === member.nationality);
                    const memberRel = relationshipStatuses.find(r => r.id === member.relationshipStatus);
                    const isExpanded = selectedMemberProfile === member.id;

                    return (
                      <div key={member.id} className="rounded-xl bg-cream-50 overflow-hidden">
                        <div className="flex items-center gap-3 p-3 hover:bg-cream-100 transition-all">
                          <div className="relative">
                            <span className="text-2xl">{member.avatar}</span>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                              member.status === 'active' ? 'bg-green-500' : member.status === 'pending' ? 'bg-amber-500' : 'bg-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => setSelectedMemberProfile(isExpanded ? null : member.id)}
                              className="font-medium text-warm-800 truncate hover:text-teal-600 transition-colors text-left flex items-center gap-1"
                            >
                              {member.name}
                              <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
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

                        {/* Expanded Member Profile */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-1 bg-white border-t border-cream-200">
                                {/* Name with Flag */}
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xl font-semibold text-warm-800">{member.name}</span>
                                  {memberNat && (
                                    <span className="text-lg" title={memberNat.name}>{memberNat.flag}</span>
                                  )}
                                </div>

                                {/* Location & Age */}
                                <p className="text-sm text-warm-600 mb-2">
                                  {member.from}{member.age ? `, ${member.age}` : ''}
                                </p>

                                {/* Relationship Status */}
                                {memberRel && (
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{memberRel.icon}</span>
                                    <span className="text-sm text-warm-600">{memberRel.name}</span>
                                  </div>
                                )}

                                {/* Bio */}
                                {member.bio && (
                                  <p className="text-sm text-warm-700 mb-2 italic">"{member.bio}"</p>
                                )}

                                {/* Travel Style */}
                                {member.travelStyle && (
                                  <p className="text-sm text-teal-600 mb-3">✨ {member.travelStyle}</p>
                                )}

                                {/* Sport Interests */}
                                {member.sportInterests && member.sportInterests.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {member.sportInterests.map(sportId => {
                                      const sport = sportCategories.find(s => s.id === sportId);
                                      return sport ? (
                                        <span key={sportId} className="inline-flex items-center gap-1 bg-cream-100 text-warm-600 px-2 py-0.5 rounded-full text-xs">
                                          {sport.icon} {sport.name.split(' / ')[0]}
                                        </span>
                                      ) : null;
                                    })}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
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

// ============ YOUR STORY DIRECTOR ============
function StoryDirectorScreen({
  trip,
  squad,
  squads,
  bookedTrips,
  onBack,
  userEmail,
  onSaveEmail,
  onShowProModal
}: {
  trip: Trip | null;
  squad: Squad | null;
  squads: Squad[];
  bookedTrips: { trip: Trip; squad: Squad; bookedAt: string; status: 'booked' | 'saved' }[];
  onBack: () => void;
  userEmail: string | null;
  onSaveEmail: (email: string) => void;
  onShowProModal: () => void;
}) {
  // Main view mode - simplified flow
  const [viewMode, setViewMode] = useState<'main' | 'squad-chat' | 'members'>('main');

  // Filter out Lakers trip and prioritize Niseko in dropdown
  const filteredBookedTrips = bookedTrips
    .filter(b => !b.trip.title.toLowerCase().includes('lakers'))
    .sort((a, b) => {
      // Niseko comes first
      if (a.trip.title.toLowerCase().includes('niseko')) return -1;
      if (b.trip.title.toLowerCase().includes('niseko')) return 1;
      return 0;
    });

  // Selected trip for story creation - use filtered list
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(trip || (filteredBookedTrips.length > 0 ? filteredBookedTrips[0].trip : null));
  const [selectedTripSquad, setSelectedTripSquad] = useState<Squad | null>(squad || (filteredBookedTrips.length > 0 ? filteredBookedTrips[0].squad : null));
  const [showTripDropdown, setShowTripDropdown] = useState(false);

  // AI Story Assistant state
  const [aiStoryQuery, setAiStoryQuery] = useState('');
  const [aiStoryMessages, setAiStoryMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: "Hi! I'm your Story Director. Let me help you create amazing memories! Connect your photos from Google Photos, iCloud, or your device, and I'll organize them into the perfect album & video. What would you like to create?" }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // AI organizing state
  const [isAiOrganizing, setIsAiOrganizing] = useState(false);
  const [aiOrganizeProgress, setAiOrganizeProgress] = useState(0);
  const [showStoryWriter, setShowStoryWriter] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  // Demo video state - auto play on load
  const [isPlayingDemo, setIsPlayingDemo] = useState(true); // Auto-play on load
  const [demoProgress, setDemoProgress] = useState(0);
  const [currentDemoScene, setCurrentDemoScene] = useState(0);

  // Media upload state
  const [connectedSources, setConnectedSources] = useState<PhotoSource[]>(['device']);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    { id: '1', type: 'photo', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', uploadedBy: 'You', uploadedAt: '2 hours ago', selected: false },
    { id: '2', type: 'video', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400', thumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200', uploadedBy: 'Alex', uploadedAt: '1 hour ago', selected: false, duration: 15 },
    { id: '3', type: 'photo', url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400', thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200', uploadedBy: 'Jordan', uploadedAt: '45 min ago', selected: true },
    { id: '4', type: 'photo', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200', uploadedBy: 'You', uploadedAt: '30 min ago', selected: true },
  ]);
  const [isDragging, setIsDragging] = useState(false);

  // Squad & Album selection
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(selectedTripSquad);
  const [albumName, setAlbumName] = useState(selectedTrip?.title ? `${selectedTrip.title} Album` : 'My Trip Album');

  // Member management - include rich profile data from squad members
  const [members, setMembers] = useState<AlbumMember[]>(
    (selectedSquad?.members || []).map((m, i) => ({
      id: `member-${i}`,
      name: m.name,
      avatar: m.avatar,
      role: i === 0 ? 'admin' as const : 'member' as const,
      joinedAt: 'Dec 2024',
      status: i < 2 ? 'active' as const : i === 2 ? 'offline' as const : 'pending' as const,
      // Extended profile data from Member
      location: m.from,
      nationality: m.nationality,
      age: m.age,
      relationshipStatus: m.relationshipStatus,
      bio: m.bio,
      travelStyle: m.travelStyle,
      sportInterests: m.sportInterests,
      mbtiType: m.mbtiType,
    }))
  );
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedMemberProfile, setSelectedMemberProfile] = useState<AlbumMember | null>(null);

  // Chat state
  const [chatMode, setChatMode] = useState<'group' | 'private'>('group');
  const [privateChatWith, setPrivateChatWith] = useState<AlbumMember | null>(null);
  const [chatMessages, setChatMessages] = useState<StoryDirectorChatMessage[]>([
    { id: '1', senderId: 'member-0', senderName: 'You', senderAvatar: '👤', message: 'Hey everyone! Excited for this trip!', timestamp: '2 hours ago', isPrivate: false },
    { id: '2', senderId: 'member-1', senderName: members[1]?.name || 'Alex', senderAvatar: members[1]?.avatar || '👨', message: 'Same here! Anyone arriving on Saturday?', timestamp: '1 hour ago', isPrivate: false },
    { id: '3', senderId: 'member-2', senderName: members[2]?.name || 'Jordan', senderAvatar: members[2]?.avatar || '👩', message: 'I land at 3pm!', timestamp: '45 min ago', isPrivate: false },
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Video creation state
  const [videoStyle, setVideoStyle] = useState<'cinematic' | 'fun' | 'documentary' | 'storybook'>('cinematic');
  const [videoDuration, setVideoDuration] = useState<'30s' | '60s' | '2min' | '5min'>('30s');
  const [aiRecommendVideo, setAiRecommendVideo] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Social post state
  const [socialPlatform, setSocialPlatform] = useState<'instagram' | 'facebook' | 'blog' | 'storybook'>('instagram');
  const [generatedContent, setGeneratedContent] = useState('');
  const [showStoryBookDemo, setShowStoryBookDemo] = useState(false);

  // Sign in state
  const [signInEmail, setSignInEmail] = useState('');
  const [showSignInPrompt, setShowSignInPrompt] = useState(!userEmail);

  const toggleMediaSelection = (id: string) => {
    setMediaItems(prev => prev.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const connectSource = (source: PhotoSource) => {
    if (connectedSources.includes(source)) {
      setConnectedSources(prev => prev.filter(s => s !== source));
    } else {
      setConnectedSources(prev => [...prev, source]);
      // Simulate loading new media
      if (source === 'google-photos') {
        setTimeout(() => {
          setMediaItems(prev => [...prev,
            { id: `gp-${Date.now()}`, type: 'photo', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400', thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=200', uploadedBy: 'Google Photos', uploadedAt: 'Just now', selected: false },
            { id: `gp-${Date.now()+1}`, type: 'video', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400', thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200', uploadedBy: 'Google Photos', uploadedAt: 'Just now', selected: false, duration: 22 },
          ]);
        }, 1000);
      } else if (source === 'icloud') {
        setTimeout(() => {
          setMediaItems(prev => [...prev,
            { id: `ic-${Date.now()}`, type: 'photo', url: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400', thumbnail: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=200', uploadedBy: 'iCloud', uploadedAt: 'Just now', selected: false },
          ]);
        }, 1000);
      }
    }
  };

  const handleInviteMember = () => {
    if (inviteEmail.includes('@')) {
      const newMember: AlbumMember = {
        id: `member-${Date.now()}`,
        name: inviteEmail.split('@')[0],
        avatar: '👤',
        role: 'member',
        joinedAt: 'Just now',
        status: 'pending',
      };
      setMembers(prev => [...prev, newMember]);
      setInviteEmail('');
      setShowInviteModal(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: StoryDirectorChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'member-0',
      senderName: 'You',
      senderAvatar: '👤',
      message: newMessage,
      timestamp: 'Just now',
      isPrivate: chatMode === 'private',
      recipientId: privateChatWith?.id,
    };
    setChatMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const startPrivateChat = (member: AlbumMember) => {
    setPrivateChatWith(member);
    setChatMode('private');
    setViewMode('squad-chat');
  };

  const handleGenerateVideo = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const generateSocialContent = () => {
    const templates = {
      instagram: {
        content: `Living my best life! This trip was absolutely incredible. From the stunning views to the unforgettable moments with my crew, every second was worth it. ✨\n\nCan't wait for the next adventure!`,
        hashtags: ['#TravelGram', '#AdventureAwaits', '#Wanderlust', '#SquadGoals', '#TravelMemories']
      },
      facebook: {
        content: `What an incredible journey! Just got back from the most amazing trip with the best crew.\n\nFrom day one, we knew this was going to be special. The scenic views, the local cuisine, the random adventures we stumbled upon - everything came together perfectly.\n\nTo my travel squad - thank you for making this trip unforgettable. Here's to many more adventures together!\n\nSwipe through to see our highlights from this incredible experience.`,
        hashtags: ['#TravelMemories', '#SquadTrip', '#AdventureOfALifetime']
      },
      blog: {
        content: `# Our Epic Adventure: A Journey of a Lifetime\n\n## Chapter 1: The Beginning\n\nWhen we first planned this trip, none of us knew it would become one of the most memorable experiences of our lives. As we gathered at the airport, excitement filled the air...\n\n## Chapter 2: Discovery\n\nEach day brought new surprises. From hidden local gems to breathtaking viewpoints, we discovered that the best moments often came unplanned...\n\n## Chapter 3: The Bonds We Forged\n\nTravel has a way of bringing people together. Shared experiences, inside jokes, and supporting each other through challenges - these are the things that transformed our group from friends to family...\n\n## Chapter 4: Coming Home\n\nAs we boarded our return flights, we carried with us not just souvenirs, but stories. Stories that we'll be telling for years to come...`,
        hashtags: []
      },
      storybook: {
        content: `Once upon a time, in a land far, far away, a group of brave adventurers set out on an incredible journey...\n\n🌟 They climbed the tallest mountains!\n🌊 They sailed across sparkling seas!\n🏰 They discovered hidden treasures!\n\nAnd together, they had the most magical adventure ever!\n\nThe End. ❤️`,
        hashtags: []
      }
    };
    setGeneratedContent(templates[socialPlatform].content);
  };

  const selectedCount = mediaItems.filter(m => m.selected).length;

  // Handle AI Story Assistant
  const handleAiStoryChat = () => {
    if (!aiStoryQuery.trim()) return;

    setAiStoryMessages(prev => [...prev, { role: 'user', content: aiStoryQuery }]);
    setAiStoryQuery('');
    setIsAiTyping(true);

    // Simulate AI response based on query
    setTimeout(() => {
      const query = aiStoryQuery.toLowerCase();
      let response = '';

      if (query.includes('cinematic') || query.includes('documentary') || query.includes('movie')) {
        response = "Great choice! A cinematic documentary style will give your trip that epic film feel. I recommend selecting the 'Cinematic' style - it adds dramatic transitions, letterbox framing, and chapter titles. Want me to set that up for you?";
        setVideoStyle('cinematic');
      } else if (query.includes('fun') || query.includes('reel') || query.includes('tiktok') || query.includes('instagram')) {
        response = "Perfect for social media! The 'Fun & Upbeat' style uses fast cuts, trendy transitions, and upbeat energy. Great for Instagram Reels or TikTok! I've selected that style for you.";
        setVideoStyle('fun');
      } else if (query.includes('kid') || query.includes('children') || query.includes('story') || query.includes('book')) {
        response = "How sweet! The 'Storybook' style creates a magical narrative perfect for kids. It turns your trip into a fairy tale with beautiful illustrations and simple storytelling. Check out the demo!";
        setVideoStyle('storybook');
      } else if (query.includes('upload') || query.includes('photo') || query.includes('video')) {
        response = "You can upload your media in the 'Upload & AI Organize' section on the right! Connect Google Photos, iCloud, or upload from your device. I'll help organize everything into the perfect story.";
      } else if (query.includes('share') || query.includes('social') || query.includes('post')) {
        response = "After creating your video, I can help you generate captions and posts for Instagram, Facebook, or even a full blog post! Just let me know when you're ready to share your story.";
      } else {
        response = "I can help you create: \n• Cinematic documentaries (epic movie feel)\n• Fun reels (perfect for social media)\n• Story-driven narratives\n• Kids storybooks (magical fairy tales)\n\nWhat style sounds best for your " + (selectedTrip?.title || "trip") + "?";
      }

      setAiStoryMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsAiTyping(false);
    }, 1500);
  };

  // Handle trip switch from dropdown
  const handleTripSwitch = (booking: { trip: Trip; squad: Squad }) => {
    setSelectedTrip(booking.trip);
    setSelectedTripSquad(booking.squad);
    setSelectedSquad(booking.squad);
    setAlbumName(`${booking.trip.title} Album`);
    setMembers(booking.squad.members.map((m, i) => ({
      id: `member-${i}`,
      name: m.name,
      avatar: m.avatar,
      role: i === 0 ? 'admin' as const : 'member' as const,
      joinedAt: 'Dec 2024',
      status: 'active' as const,
    })));
    setShowTripDropdown(false);
  };

  // AI Organize Photos & Videos
  const handleAiOrganize = () => {
    if (connectedSources.length === 0) return;
    setIsAiOrganizing(true);
    setAiOrganizeProgress(0);

    // Simulate AI organizing progress
    const interval = setInterval(() => {
      setAiOrganizeProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAiOrganizing(false);
          // Auto-select best photos
          setMediaItems(prev => prev.map((item, idx) => ({
            ...item,
            selected: idx < 6 // AI selects top 6 items
          })));
          setAiStoryMessages(prev => [...prev, {
            role: 'assistant',
            content: `I've analyzed your ${mediaItems.length} photos & videos and selected the best ${Math.min(6, mediaItems.length)} for your story! I found great shots with good lighting, interesting compositions, and memorable moments. Ready to create your video?`
          }]);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  // Generate Story Text
  const handleGenerateStory = () => {
    setIsGeneratingStory(true);
    setTimeout(() => {
      const tripName = selectedTrip?.title || 'Our Adventure';
      const location = selectedTrip?.location || 'an amazing destination';
      const squadName = selectedTripSquad?.name || 'our crew';

      setStoryText(`# ${tripName}: A Journey to Remember

## The Beginning
When ${squadName} first decided to embark on this adventure to ${location}, none of us knew just how transformative it would be. The excitement was palpable as we gathered, ready to create memories that would last a lifetime.

## The Discovery
Every corner of ${location} held a new surprise. From breathtaking views to hidden gems, we found ourselves constantly amazed. The local culture, the food, the people - everything came together to create an experience unlike any other.

## The Bonds We Made
But the real magic wasn't just in the places we visited - it was in the moments we shared. Late-night conversations, spontaneous adventures, and countless laughs strengthened our bonds in ways we never expected.

## The Return
As we made our way home, we carried with us more than just souvenirs. We brought back stories, inside jokes, and a deeper appreciation for both the world and each other. This wasn't just a trip - it was a chapter in our lives we'll never forget.

*Here's to the next adventure!* ✨`);
      setIsGeneratingStory(false);
    }, 2000);
  };

  // Demo video scenes
  const demoScenes = [
    { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', title: 'Chapter 1: The Journey Begins' },
    { image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', title: 'Chapter 2: Discovery' },
    { image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', title: 'Chapter 3: Adventure' },
    { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', title: 'Chapter 4: The Finale' },
  ];

  // Demo video effect
  useEffect(() => {
    let progressInterval: ReturnType<typeof setInterval>;
    let sceneInterval: ReturnType<typeof setInterval>;

    if (isPlayingDemo) {
      progressInterval = setInterval(() => {
        setDemoProgress(prev => {
          if (prev >= 100) {
            setIsPlayingDemo(false);
            setCurrentDemoScene(0);
            return 0;
          }
          return prev + (100 / 80); // ~8-10 seconds total
        });
      }, 100);

      sceneInterval = setInterval(() => {
        setCurrentDemoScene(prev => (prev >= demoScenes.length - 1 ? 0 : prev + 1));
      }, 2000);
    }

    return () => {
      clearInterval(progressInterval);
      clearInterval(sceneInterval);
    };
  }, [isPlayingDemo]);

  // Trip Dropdown Component
  const TripDropdown = () => (
    <div className="relative mb-6">
      <button
        onClick={() => setShowTripDropdown(!showTripDropdown)}
        className="w-full p-4 bg-gradient-to-r from-teal-50 to-cream-50 rounded-xl border-2 border-teal-200 flex items-center gap-4 hover:border-teal-400 transition-all"
      >
        {selectedTrip ? (
          <>
            <img src={selectedTrip.image} alt="" className="w-14 h-14 rounded-lg object-cover" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-warm-800">{selectedTrip.title}</p>
              <p className="text-sm text-warm-500">{selectedTrip.location} • {selectedTripSquad?.name}</p>
            </div>
          </>
        ) : (
          <div className="flex-1 text-left">
            <p className="font-medium text-warm-600">Select a trip to create story</p>
          </div>
        )}
        <ChevronDown className={`w-5 h-5 text-warm-400 transition-transform ${showTripDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showTripDropdown && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-cream-200 z-50 max-h-80 overflow-y-auto"
        >
          {!userEmail ? (
            <div className="p-4 text-center">
              <Lock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm text-warm-600 mb-2">Sign in to access your trips</p>
              <input
                type="email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-3 py-2 rounded-lg border border-cream-300 text-sm mb-2"
              />
              <button
                onClick={() => { if (signInEmail.includes('@')) { onSaveEmail(signInEmail); }}}
                className="btn btn-secondary text-sm w-full"
              >
                Sign In
              </button>
            </div>
          ) : filteredBookedTrips.length === 0 ? (
            <div className="p-4 text-center">
              <Compass className="w-8 h-8 text-warm-300 mx-auto mb-2" />
              <p className="text-sm text-warm-500">No trips found. Book a trip first!</p>
            </div>
          ) : (
            filteredBookedTrips.map((booking, idx) => (
              <button
                key={`dropdown-${booking.trip.id}-${idx}`}
                onClick={() => handleTripSwitch(booking)}
                className={`w-full p-3 flex items-center gap-3 hover:bg-cream-50 transition-colors border-b border-cream-100 last:border-b-0 ${
                  selectedTrip?.id === booking.trip.id ? 'bg-teal-50' : ''
                }`}
              >
                <img src={booking.trip.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-warm-800 text-sm">{booking.trip.title}</p>
                  <p className="text-xs text-warm-500">{booking.squad.name} • {booking.status}</p>
                </div>
                {selectedTrip?.id === booking.trip.id && <Check className="w-4 h-4 text-teal-600" />}
              </button>
            ))
          )}
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen py-8 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-warm-600 hover:text-teal-600 mb-8">
          <ChevronLeft className="w-5 h-5" /> Back to Trip
        </button>

        {/* Sign-in Prompt */}
        {showSignInPrompt && !userEmail && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4 mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800 mb-1">Save Your Creative Work</h3>
                <p className="text-sm text-amber-600 mb-3">
                  Sign in to save your albums, videos, and collaborate with your squad.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-xl border border-amber-300 bg-white text-warm-800 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                  />
                  <button
                    onClick={() => {
                      if (signInEmail.includes('@')) {
                        onSaveEmail(signInEmail);
                        setShowSignInPrompt(false);
                      }
                    }}
                    disabled={!signInEmail.includes('@')}
                    className="px-4 py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 text-sm"
                  >
                    Sign In
                  </button>
                </div>
              </div>
              <button onClick={() => setShowSignInPrompt(false)} className="text-amber-400 hover:text-amber-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-display text-warm-900 mb-2">
            Your <span className="text-terra-500">Story Director</span>
          </h1>
          <p className="text-warm-600">
            Let AI help you create the perfect album & video for your memory trip
          </p>
        </div>

        {/* Step 1: Select Trip - with Sign-in Reminder */}
        <div className="card p-5 mb-6 bg-gradient-to-r from-cream-50 to-white border-2 border-cream-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">1</div>
            <h3 className="font-semibold text-warm-800">Select Your Trip</h3>
            {!userEmail && (
              <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1">
                <Mail className="w-3 h-3" /> Sign in to see trip history
              </span>
            )}
          </div>
          <TripDropdown />
        </div>

        {/* Step 2: Your Squad - with Chat/Members options */}
        {selectedTripSquad && (
          <div className="card p-5 mb-6 bg-gradient-to-r from-teal-50 to-cream-50 border-2 border-teal-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">2</div>
              <h3 className="font-semibold text-warm-800">Your Squad from This Trip</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Squad Info */}
              <div className="flex items-center gap-4 flex-1">
                <span className="text-4xl">{selectedTripSquad.avatar}</span>
                <div>
                  <p className="font-display text-xl text-warm-800">{selectedTripSquad.name}</p>
                  <p className="text-sm text-warm-500">{members.length} members • {selectedTripSquad.vibe}</p>
                </div>
              </div>

              {/* Member Avatars */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {members.slice(0, 5).map((member, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-cream-200 border-2 border-white flex items-center justify-center text-lg cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => { setSelectedMemberProfile(member); setViewMode('members'); }}
                    >
                      {member.avatar}
                    </div>
                  ))}
                  {members.length > 5 && (
                    <div className="w-10 h-10 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-xs font-bold text-teal-700">
                      +{members.length - 5}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'squad-chat' ? 'main' : 'squad-chat')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                    viewMode === 'squad-chat' ? 'bg-teal-600 text-white' : 'bg-white text-teal-700 border border-teal-300 hover:bg-teal-50'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" /> Chat
                </button>
                <button
                  onClick={() => setViewMode(viewMode === 'members' ? 'main' : 'members')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                    viewMode === 'members' ? 'bg-teal-600 text-white' : 'bg-white text-teal-700 border border-teal-300 hover:bg-teal-50'
                  }`}
                >
                  <Users className="w-4 h-4" /> Members
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Squad Chat Panel */}
        {viewMode === 'squad-chat' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-warm-800 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-teal-600" />
                {chatMode === 'group' ? 'Group Chat' : `Chat with ${privateChatWith?.name}`}
              </h3>
              <div className="flex gap-2">
                <button onClick={() => setChatMode('group')} className={`px-3 py-1 rounded-lg text-xs ${chatMode === 'group' ? 'bg-teal-600 text-white' : 'bg-cream-100'}`}>Group</button>
                <button onClick={() => setChatMode('private')} className={`px-3 py-1 rounded-lg text-xs ${chatMode === 'private' ? 'bg-teal-600 text-white' : 'bg-cream-100'}`}>Private</button>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {/* Chat Messages */}
              <div className="md:col-span-3">
                <div className="h-48 overflow-y-auto space-y-3 mb-3 p-3 bg-cream-50 rounded-xl">
                  {chatMessages.filter(m => chatMode === 'group' ? !m.isPrivate : m.isPrivate).map(msg => (
                    <div key={msg.id} className={`flex gap-2 ${msg.senderId === 'member-0' ? 'flex-row-reverse' : ''}`}>
                      <div className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center text-sm">{msg.senderAvatar}</div>
                      <div className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${msg.senderId === 'member-0' ? 'bg-teal-600 text-white' : 'bg-white shadow-sm'}`}>
                        <p>{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 rounded-xl border border-cream-300 text-sm"
                  />
                  <button onClick={sendMessage} className="btn btn-primary px-4"><Send className="w-4 h-4" /></button>
                </div>
              </div>
              {/* Quick Member Select for Private */}
              <div className="space-y-2">
                <p className="text-xs text-warm-500 font-medium">Private chat:</p>
                {members.filter(m => m.id !== 'member-0').slice(0, 4).map(m => (
                  <button key={m.id} onClick={() => { setPrivateChatWith(m); setChatMode('private'); }} className={`w-full p-2 rounded-lg text-left flex items-center gap-2 text-sm ${privateChatWith?.id === m.id ? 'bg-teal-50 border border-teal-300' : 'bg-cream-50 hover:bg-cream-100'}`}>
                    <span>{m.avatar}</span>
                    <span className="truncate">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Members Panel */}
        {viewMode === 'members' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-warm-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" /> Squad Members ({members.length})
              </h3>
              <button onClick={() => setShowInviteModal(true)} className="btn btn-secondary text-sm">
                <UserPlus className="w-4 h-4 mr-1" /> Invite
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Member List */}
              <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                {members.map(member => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMemberProfile(selectedMemberProfile?.id === member.id ? null : member)}
                    className={`p-3 rounded-xl text-center relative group transition-all ${
                      selectedMemberProfile?.id === member.id
                        ? 'bg-teal-50 border-2 border-teal-400 ring-2 ring-teal-200'
                        : 'bg-cream-50 hover:bg-cream-100 border-2 border-transparent'
                    }`}
                  >
                    {member.role !== 'admin' && (
                      <div
                        onClick={(e) => { e.stopPropagation(); handleRemoveMember(member.id); }}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </div>
                    )}
                    <div className={`w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl transition-all ${
                      selectedMemberProfile?.id === member.id ? 'bg-teal-100 ring-2 ring-teal-400' : 'bg-cream-200'
                    }`}>
                      {member.avatar}
                    </div>
                    <p className="font-medium text-warm-800 text-sm truncate">{member.name}</p>
                    <p className="text-xs text-warm-500">{member.role === 'admin' ? 'Admin' : member.status}</p>
                    <div className={`mt-1 text-xs ${selectedMemberProfile?.id === member.id ? 'text-teal-600' : 'text-warm-400'}`}>
                      {selectedMemberProfile?.id === member.id ? 'Viewing profile' : 'Click to view'}
                    </div>
                  </button>
                ))}
              </div>

              {/* Member Profile Detail */}
              <div className="md:col-span-1">
                {selectedMemberProfile ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-teal-50 to-cream-50 rounded-2xl p-5 border border-teal-200 h-full"
                  >
                    {/* Profile Header - Large Avatar & Name */}
                    <div className="text-center mb-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 mx-auto mb-3 flex items-center justify-center text-5xl shadow-lg">
                        {selectedMemberProfile.avatar}
                      </div>
                      <h4 className="font-display text-2xl text-warm-800">{selectedMemberProfile.name}</h4>
                    </div>

                    {/* Location & Age */}
                    <div className="flex items-center justify-center gap-2 mb-3 text-warm-600">
                      <span className="text-lg">
                        {selectedMemberProfile.nationality === 'us' ? '🇺🇸' :
                         selectedMemberProfile.nationality === 'uk' ? '🇬🇧' :
                         selectedMemberProfile.nationality === 'ca' ? '🇨🇦' :
                         selectedMemberProfile.nationality === 'au' ? '🇦🇺' :
                         selectedMemberProfile.nationality === 'jp' ? '🇯🇵' :
                         selectedMemberProfile.nationality === 'de' ? '🇩🇪' :
                         selectedMemberProfile.nationality === 'fr' ? '🇫🇷' :
                         selectedMemberProfile.nationality === 'br' ? '🇧🇷' :
                         selectedMemberProfile.nationality === 'mx' ? '🇲🇽' :
                         selectedMemberProfile.nationality === 'kr' ? '🇰🇷' :
                         selectedMemberProfile.nationality === 'it' ? '🇮🇹' :
                         selectedMemberProfile.nationality === 'es' ? '🇪🇸' :
                         selectedMemberProfile.nationality === 'nz' ? '🇳🇿' :
                         selectedMemberProfile.nationality === 'ch' ? '🇨🇭' : '🌍'}
                      </span>
                      <span className="font-medium">
                        {selectedMemberProfile.location || 'Unknown'}{selectedMemberProfile.age ? `, ${selectedMemberProfile.age}` : ''}
                      </span>
                    </div>

                    {/* Relationship Status */}
                    <div className="flex items-center justify-center gap-2 mb-4 text-warm-600">
                      <span className="text-lg">👤</span>
                      <span className="capitalize">{selectedMemberProfile.relationshipStatus || 'Not specified'}</span>
                    </div>

                    {/* Bio */}
                    {selectedMemberProfile.bio && (
                      <p className="text-center text-warm-600 text-sm mb-4 italic">
                        {selectedMemberProfile.bio}
                      </p>
                    )}

                    {/* Travel Style Tag */}
                    {selectedMemberProfile.travelStyle && (
                      <div className="flex justify-center mb-4">
                        <span className="px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {selectedMemberProfile.travelStyle}
                        </span>
                      </div>
                    )}

                    {/* Sport Interests Icons */}
                    {selectedMemberProfile.sportInterests && selectedMemberProfile.sportInterests.length > 0 && (
                      <div className="flex justify-center gap-3 mb-4">
                        {selectedMemberProfile.sportInterests.slice(0, 4).map((sport, idx) => (
                          <div key={idx} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl">
                            {sport === 'skiing' ? '⛷️' :
                             sport === 'surfing' ? '🏄' :
                             sport === 'nba' ? '🏀' :
                             sport === 'nfl' ? '🏈' :
                             sport === 'mlb' ? '⚾' :
                             sport === 'nhl' ? '🏒' :
                             sport === 'fifa' ? '⚽' :
                             sport === 'f1' ? '🏎️' :
                             sport === 'golf' ? '⛳' :
                             sport === 'tennis' ? '🎾' :
                             sport === 'cycling' ? '🚴' :
                             sport === 'mma' ? '🥊' : '🎯'}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* MBTI Badge */}
                    {selectedMemberProfile.mbtiType && (
                      <div className="flex justify-center mb-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                          {selectedMemberProfile.mbtiType}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => startPrivateChat(selectedMemberProfile)}
                        className="w-full py-2.5 bg-teal-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" /> Send Message
                      </button>
                      <button className="w-full py-2.5 bg-white text-warm-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-cream-50 transition-colors border border-cream-300">
                        <Eye className="w-4 h-4" /> View Full Profile
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-cream-50 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-cream-300">
                    <Users className="w-12 h-12 text-warm-300 mb-3" />
                    <p className="text-warm-500 font-medium">Select a member</p>
                    <p className="text-warm-400 text-sm mt-1">Click on any member to view their profile details</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Upload & AI Organize */}
        <div className="card p-5 mb-6 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-cream-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">3</div>
            <h3 className="font-semibold text-warm-800">Upload & AI Organize</h3>
            <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex items-center gap-1">
              <Brain className="w-3 h-3" /> AI-Powered
            </span>
          </div>

          <p className="text-sm text-warm-600 mb-4">
            Let AI help you find the best photos & videos for your trip story! Connect your media sources and we'll organize everything.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Connect Sources */}
            <div>
              <p className="text-sm font-medium text-warm-700 mb-3">Connect Your Media</p>
              <div className="space-y-2">
                {[
                  { id: 'device' as PhotoSource, name: 'This Device', icon: '💻', desc: 'Upload from laptop/phone' },
                  { id: 'google-photos' as PhotoSource, name: 'Google Photos', icon: '🖼️', desc: 'Connect Google Photos' },
                  { id: 'icloud' as PhotoSource, name: 'iCloud', icon: '☁️', desc: 'Sync from iCloud' },
                ].map(source => (
                  <button
                    key={source.id}
                    onClick={() => connectSource(source.id)}
                    className={`w-full p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${
                      connectedSources.includes(source.id)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-cream-300 bg-white hover:border-cream-400'
                    }`}
                  >
                    <span className="text-xl">{source.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-warm-800 text-sm">{source.name}</p>
                      <p className="text-xs text-warm-500">{source.desc}</p>
                    </div>
                    {connectedSources.includes(source.id) ? (
                      <Check className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Plus className="w-5 h-5 text-warm-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* AI Organize Button */}
              {connectedSources.length > 0 && (
                <button
                  onClick={handleAiOrganize}
                  disabled={isAiOrganizing}
                  className="w-full mt-4 p-4 bg-gradient-to-r from-purple-500 to-teal-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:from-purple-600 hover:to-teal-600 transition-all"
                >
                  {isAiOrganizing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      AI Finding Best Media... {aiOrganizeProgress}%
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      Let AI Find the Best Photos & Videos
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Selected Media Preview */}
            <div>
              <p className="text-sm font-medium text-warm-700 mb-3">Selected Media ({selectedCount} items)</p>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto bg-white p-3 rounded-xl border border-cream-200">
                {mediaItems.slice(0, 12).map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleMediaSelection(item.id)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      item.selected ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-transparent hover:border-cream-300'
                    }`}
                  >
                    <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                    {item.selected && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                    {item.type === 'video' && (
                      <div className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1 rounded">
                        {item.duration}s
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-warm-500 mt-2 text-center">AI will select the best moments for your story</p>
            </div>
          </div>
        </div>

        {/* Step 4: Create Your Story Video */}
        <div className="card p-5 mb-6 border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-cream-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">4</div>
            <h3 className="font-semibold text-warm-800">Create Your Story Video</h3>
            <span className="ml-auto text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Optimized
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Demo Video Preview */}
            <div>
              <p className="text-sm font-medium text-warm-700 mb-3">Preview Demo</p>
              <div className="aspect-video bg-warm-900 rounded-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-4 bg-black z-10" />
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-black z-10" />

                {isPlayingDemo ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentDemoScene}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0"
                      >
                        <img
                          src={demoScenes[currentDemoScene].image}
                          alt=""
                          className="w-full h-full object-cover"
                          style={{ animation: 'slowZoom 2s ease-out forwards' }}
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="text-center">
                            <p className="text-white/80 text-xs tracking-[0.2em] uppercase mb-1">StoryTrip</p>
                            <h3 className="text-white text-xl font-display font-bold">
                              {demoScenes[currentDemoScene].title}
                            </h3>
                          </div>
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                    <div className="absolute bottom-6 left-3 right-3 z-20">
                      <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-terra-500" style={{ width: `${demoProgress}%` }} />
                      </div>
                    </div>
                    <button
                      onClick={() => setIsPlayingDemo(false)}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30"
                    >
                      <Pause className="w-5 h-5 text-white" />
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => { setIsPlayingDemo(true); setDemoProgress(0); setCurrentDemoScene(0); }}
                      className="w-16 h-16 rounded-full bg-terra-500/80 hover:bg-terra-500 flex items-center justify-center transition-all hover:scale-110"
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </button>
                  </div>
                )}
              </div>
              <style>{`@keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.1); } }`}</style>
            </div>

            {/* Video Options */}
            <div>
              <p className="text-sm font-medium text-warm-700 mb-3">Video Style & Duration</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { id: 'cinematic', name: 'Cinematic', icon: '🎬' },
                  { id: 'fun', name: 'Fun & Upbeat', icon: '🎉' },
                  { id: 'documentary', name: 'Documentary', icon: '📹' },
                  { id: 'storybook', name: 'Storybook', icon: '📖' },
                ].map(style => (
                  <button
                    key={style.id}
                    onClick={() => setVideoStyle(style.id as typeof videoStyle)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      videoStyle === style.id ? 'border-teal-500 bg-teal-50' : 'border-cream-300 hover:border-cream-400'
                    }`}
                  >
                    <span className="text-xl">{style.icon}</span>
                    <p className="font-medium text-warm-800 text-xs mt-1">{style.name}</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { id: '30s', label: '30s', tier: 'free' },
                  { id: '60s', label: '60s', tier: 'free' },
                  { id: '2min', label: '2min', tier: 'pro' },
                  { id: '5min', label: '5min', tier: 'pro' },
                ].map(dur => (
                  <button
                    key={dur.id}
                    onClick={() => dur.tier === 'pro' ? onShowProModal() : setVideoDuration(dur.id as typeof videoDuration)}
                    className={`p-2 rounded-lg border-2 text-center relative transition-all ${
                      videoDuration === dur.id ? 'border-teal-500 bg-teal-50' : 'border-cream-300'
                    }`}
                  >
                    {dur.tier === 'pro' && <Lock className="absolute top-0.5 right-0.5 w-3 h-3 text-amber-500" />}
                    <p className="font-medium text-warm-800 text-sm">{dur.label}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerateVideo}
                disabled={isGenerating || !selectedTrip}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:from-teal-600 hover:to-teal-700 transition-all"
              >
                {isGenerating ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Create My AI-Optimized Video</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Step 5: Create Your Storybook (Optional) */}
        <div className="card p-5 mb-6 border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-cream-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">5</div>
            <h3 className="font-semibold text-warm-800">Create Your Storybook</h3>
            <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Optional</span>
          </div>

          <p className="text-sm text-warm-600 mb-4">
            Turn your trip memories into a beautiful illustrated storybook - perfect for kids and families!
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Storybook Demo Preview - 5 seconds */}
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl overflow-hidden border-4 border-amber-300 shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="text-6xl mb-4">📖</div>
                    <h4 className="font-display text-xl text-amber-800 mb-2">"{selectedTrip?.title || 'My Trip'} Adventure"</h4>
                    <p className="text-amber-600 text-sm">A magical story for the whole family</p>
                    <div className="flex justify-center gap-2 mt-4">
                      {['🏔️', '✈️', '🌟', '🎉'].map((emoji, i) => (
                        <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>{emoji}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Page curl effect */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-amber-200 to-transparent rounded-tl-full" />
              </div>
              <button
                onClick={() => setShowStoryBookDemo(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors rounded-2xl"
              >
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-700 font-medium text-sm">Preview 5s Demo</span>
                </div>
              </button>
            </div>

            {/* Storybook Options */}
            <div>
              <p className="text-sm font-medium text-warm-700 mb-3">Storybook Style</p>
              <div className="space-y-2 mb-4">
                {[
                  { id: 'classic', name: 'Classic Fairytale', icon: '🏰', desc: 'Once upon a time...' },
                  { id: 'adventure', name: 'Adventure Quest', icon: '🗺️', desc: 'Epic journey awaits' },
                  { id: 'nature', name: 'Nature Explorer', icon: '🌿', desc: 'Discover the wild' },
                ].map(style => (
                  <button
                    key={style.id}
                    className="w-full p-3 rounded-xl border-2 border-amber-200 bg-white text-left flex items-center gap-3 hover:border-amber-400 transition-all"
                  >
                    <span className="text-2xl">{style.icon}</span>
                    <div>
                      <p className="font-medium text-warm-800 text-sm">{style.name}</p>
                      <p className="text-xs text-warm-500">{style.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowStoryBookDemo(true)}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                <Sparkles className="w-5 h-5" /> Create My Storybook
              </button>
              <p className="text-xs text-warm-500 mt-2 text-center">Includes 10-page illustrated book • PDF download</p>
            </div>
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-warm-800">Invite to Group</h3>
                <button onClick={() => setShowInviteModal(false)} className="p-2 text-warm-400 hover:text-warm-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-warm-600 mb-4">Enter email to send an invite</p>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="friend@email.com"
                className="w-full px-4 py-3 rounded-xl border border-cream-300 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowInviteModal(false)} className="btn btn-ghost flex-1">
                  Cancel
                </button>
                <button onClick={handleInviteMember} className="btn btn-primary flex-1">
                  <Send className="w-4 h-4 mr-2" /> Send Invite
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Storybook Demo Modal */}
        {showStoryBookDemo && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-warm-800">AI Storybook Demo</h3>
                <button onClick={() => setShowStoryBookDemo(false)} className="p-2 text-warm-400 hover:text-warm-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Storybook Preview */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 mb-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-display text-amber-800 mb-2">The Great Adventure</h2>
                  <p className="text-amber-600">A personalized story for your little ones</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <div className="flex gap-4 items-start mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150"
                      alt=""
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-warm-800 leading-relaxed">
                        <span className="text-2xl font-display text-teal-600">O</span>nce upon a time,
                        in a land of towering mountains and sparkling rivers, a brave group of explorers
                        set off on the adventure of a lifetime...
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <div className="flex gap-4 items-start flex-row-reverse mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=150"
                      alt=""
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-warm-800 leading-relaxed">
                        They discovered hidden treasures, made new friends, and learned that the
                        greatest adventures are the ones we share with people we love.
                        <span className="text-xl">✨</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-amber-700 italic font-display text-lg">The End</p>
                  <p className="text-amber-500 text-sm mt-2">❤️</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowStoryBookDemo(false)} className="btn btn-ghost flex-1">
                  Close Preview
                </button>
                <button className="btn btn-primary flex-1">
                  <Sparkles className="w-4 h-4 mr-2" /> Create My Storybook ($19)
                </button>
              </div>
            </motion.div>
          </div>
        )}
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
