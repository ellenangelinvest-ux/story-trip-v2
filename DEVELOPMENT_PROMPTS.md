# StoryTrip Development Prompts & Journey

> A comprehensive record of all prompts used to build StoryTrip - from concept to deployment.

**Project URL:** https://story-trip.vercel.app/
**Development Period:** January 2026
**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion

---

## Phase 1: Initial Concept - StoryTravel AI

### Prompt 1.1: Core Concept
```
Create an AI travel platform that designs trips based on story archetypes
(underdog redemption, family legacy, etc.) and produces documentary-style
film previews of the journey.
```

**Features Requested:**
- Story selection with narrative categories
- Story input for personal story/challenge
- AI-generated itinerary matching story beats
- Simulation preview of key journey moments
- Documentary-style film preview with voiceover

### Prompt 1.2: Narrative Categories
```
Include narrative categories:
- Sports/Competition: Underdog Redemption, Rivalry Conquest, Championship Chase
- Personal Growth: Solo Discovery, Overcoming Fears, Finding Purpose
- Relationships: Family Legacy, Friendship Bonds, Romantic Journey
```

---

## Phase 2: Pivot to StoryTrip - Sports Focus

### Prompt 2.1: Rebrand & Sport Integration
```
Modify the application to become "Story Trip" - focused on sports travel
experiences. Add sport interest matching for trip recommendations.
```

**Changes Made:**
- Rebranded from StoryTravel AI to Story Trip
- Added sport categories: NBA, NFL, MLB, Soccer, F1, Tennis, Golf, MMA
- Created trip cards with sport-specific destinations
- Added team/athlete associations

### Prompt 2.2: Location Features
```
Add nearby attractions feature to show what else is available near
each sports destination.
```

**Features Added:**
- Nearby attractions section for each trip
- Local restaurant recommendations
- Tourist spots and landmarks
- Distance indicators

### Prompt 2.3: Demo & About Pages
```
Add a demo screen to showcase the app features and an about page
explaining the StoryTrip concept.
```

**Screens Created:**
- Demo screen with feature walkthrough
- About page with company mission
- Team information section

---

## Phase 3: Squad Matching System

### Prompt 3.1: Multi-Select Filters
```
Add multi-select filters for squad matching including:
- Sports interests (can select multiple sports)
- Nationality filter
- Relationship Status filter
```

**Implementation:**
- Toggle-based multi-select for Sports (NBA, NFL, MLB, Soccer, F1, Tennis, Golf, MMA)
- Nationality filter with flags (American, British, Canadian, Australian, Japanese, Korean, German, French, Brazilian, Mexican)
- Relationship Status filter (Single, In a Relationship, Married, Prefer not to say)
- Active filters summary with remove buttons
- Member profile cards showing nationality flag and relationship status

---

## Phase 4: Digital Director / Memory Maker

### Prompt 4.1: Trip-Specific Content
```
There are some bugs - the 'Your Digital Director' should match the trip
you created, also it should be a group contributor function (everyone
who signs up for the trip can upload to the same place and people can
review it).
```

**Fixes & Features:**
- Digital Director now shows trip-specific shot prompts based on selected sport
- Dynamic header showing trip name, sport, and destination
- Squad info banner with member avatars

### Prompt 4.2: Photo Integration
```
Add the function to connect with Google Photos / iPhotos to make it
easier to share.
```

**Implementation:**
- Google Photos connection button with OAuth simulation
- iCloud Photos connection option
- Device upload fallback
- Connection status indicators

### Prompt 4.3: Output Customization
```
People can choose how many pictures (20-30) to make 30-60sec videos
or photo album.
```

**Features Added:**
- Photo count slider (20-30 photos)
- Output format selector:
  - 30-second highlight video
  - 60-second documentary video
  - Photo album/slideshow
- Three-tab interface: Shot List, Group Uploads, Output Settings

---

## Phase 5: Create Your Own Trip

### Prompt 5.1: Trip Creation Wizard
```
Add a feature for people to 'create my own trip', with the option to choose:
- How many people to join
- Make it private or public
- Budget range per person (from $500-$5000)
- How many days for the trip
- What's the highlight for the trip (i.e. MLB, NBA games...etc)
```

**4-Step Wizard Created:**

**Step 1 - Trip Details:**
- Category selection (Sports, Family, Romantic, Adventure, Cultural, Wellness)
- Highlight selection (25 options including all sports + activities)
- Trip title input
- Destination input

**Step 2 - Budget & Group:**
- Visibility toggle (Public/Private)
- Group size slider (2-20 people)
- Budget per person slider ($500-$5,000)
- Duration slider (2-14 days)
- Start date picker

**Step 3 - AI Quotation:**
- Automated price calculation
- Breakdown: Accommodation, Activities, Transport, Meals, Event Tickets
- Confidence rating (High/Medium/Low)
- AI-generated suggestions for the trip

**Step 4 - Agent Bidding:**
- Submit to travel agents
- View pending bids
- Agent profiles with ratings and specialties

### Prompt 5.2: Expanded Trip Options
```
Also create more trip options under each category:
- MLB / NBA / F1 games
- Family day plans
- Romantic places
- EPIC adventures for hiking / biking / diving...etc
```

**New Trips Added (10 total):**

**MLB:**
- Yankees vs Red Sox at Fenway Park (Boston)
- Dodgers Stadium Experience (Los Angeles)

**F1:**
- Monaco Grand Prix VIP Experience
- Singapore Night Race Adventure

**Family:**
- Disney World Ultimate Family Adventure (Orlando)

**Romantic:**
- Paris Romance Escape
- Maldives Overwater Paradise

**Epic Adventures:**
- Patagonia Trek Challenge
- Great Barrier Reef Dive Expedition
- Swiss Alps E-Bike Adventure

---

## Phase 6: Deployment & Sharing

### Prompt 6.1: GitHub Setup
```
Help me to download the GitHub files so my teammate can access the
original code from StoryTrip. Also help me with the GitHub setup
username with: ellenangelinvest-ux
```

**Actions Taken:**
- Created zip file at `/Users/ellenchang926/story-trip-source.zip`
- Configured git remote for `ellenangelinvest-ux/story-trip`
- All code committed and ready to push

### Prompt 6.2: Auto-Sync Request
```
Can I make sure it always syncs with the folder when we make changes here?
```

**Recommendation:**
- Connect Vercel to GitHub repository
- Use `git add . && git commit -m "message" && git push` after changes
- Vercel auto-deploys on push to main branch

---

## Technical Architecture Summary

### File Structure
```
story-trip/
├── src/
│   ├── App.tsx          # Main application (all components)
│   ├── index.css        # Tailwind theme & custom styles
│   └── main.tsx         # React entry point
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### Key Types Created
```typescript
// Trip & Sports
type SportCategory = 'nba' | 'nfl' | 'mlb' | 'soccer' | 'f1' | 'tennis' | 'golf' | 'mma';
type TripCategory = 'sports' | 'family' | 'romantic' | 'adventure' | 'cultural' | 'wellness';

// Squad Matching
type Nationality = 'american' | 'british' | 'canadian' | 'australian' | 'japanese' | 'korean' | 'german' | 'french' | 'brazilian' | 'mexican';
type RelationshipStatus = 'single' | 'relationship' | 'married' | 'prefer-not-to-say';

// Trip Creation
type TripVisibility = 'public' | 'private';
type OutputFormat = 'video-30' | 'video-60' | 'album';
type PhotoSource = 'device' | 'google-photos' | 'icloud';
```

### Screens/Views
1. **LandingScreen** - Hero with featured trips
2. **TripDetailScreen** - Full trip information
3. **SquadScreen** - Find travel companions with filters
4. **MemoryMakerScreen** - Digital Director for trip documentation
5. **CreateTripScreen** - 4-step trip creation wizard
6. **DemoScreen** - Feature showcase
7. **AboutScreen** - Company information

---

## Design Decisions

### Color Palette (Cozy Theme)
- **Cream backgrounds:** #FFFDF9 to #E5D4B5
- **Teal accents:** #2D9D8F (primary actions)
- **Terracotta accents:** #E8734D (secondary actions)
- **Warm grays:** Text and subtle elements

### UI Components
- Rounded corners (rounded-2xl, rounded-3xl)
- Soft shadows (shadow-cozy)
- Dashed borders for upload zones
- Badge chips for categories and filters
- Gradient backgrounds for headers

### Animations
- Float animation for decorative elements
- Wiggle animation for interactions
- Smooth transitions (300ms default)
- Framer Motion for page transitions

---

## Future Enhancement Ideas

Based on the development trajectory, potential next features:
1. Real AI integration (OpenAI/Claude) for trip recommendations
2. Payment processing for bookings
3. Real-time chat between squad members
4. Push notifications for trip updates
5. Mobile app version (React Native)
6. Travel agent dashboard
7. Review and rating system
8. Loyalty/rewards program

---

## Commands Reference

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deployment
```bash
vercel               # Deploy to Vercel
vercel --prod        # Deploy to production
```

### Git Workflow
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

---

*Document generated: January 13, 2026*
*Total development prompts: 12 major requests*
*Final deployment: https://story-trip.vercel.app/*
