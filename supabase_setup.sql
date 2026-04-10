-- SQL for Carbonscio Supabase Setup

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  climate_literacy_score INTEGER DEFAULT 0,
  carbon_offset_total FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Leaderboard View
CREATE VIEW leaderboard AS
SELECT username, climate_literacy_score, carbon_offset_total
FROM profiles
ORDER BY climate_literacy_score DESC;

-- 3. Quiz Questions Table
CREATE TABLE quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of strings
  correct_index INTEGER NOT NULL,
  explanation TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Daily Activities Table (Calendar)
CREATE TABLE daily_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  activity_date DATE DEFAULT CURRENT_DATE NOT NULL,
  activity_type TEXT NOT NULL, -- e.g., 'cycling', 'vegan_meal', 'recycled'
  carbon_saved FLOAT NOT NULL, -- in kg CO2e
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Companies Database Table
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT CHECK (status IN ('funding', 'not_funding', 'climate_focused')),
  description TEXT,
  roast_comment TEXT, -- Cheeky roast for the company
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Wiki Articles Table
CREATE TABLE wiki_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- Markdown content
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS Policies (Basic examples)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activities." ON daily_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activities." ON daily_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed Data (Optional but helpful)
INSERT INTO wiki_articles (title, content, category) VALUES
('The Greenhouse Effect', 'The greenhouse effect is the process by which radiation from a planet''s atmosphere warms the planet''s surface to a temperature above what it would be without its atmosphere. Basically, we''re turning Earth into a slow cooker. And we''re the ingredients.', 'Science'),
('Carbon Offsetting', 'Carbon offsetting is a way to compensate for your emissions by funding an equivalent carbon dioxide saving elsewhere. It''s like eating a whole cake and then buying a gym membership you''ll never use. It makes you feel better, but the cake is still there.', 'Solutions'),
('Renewable Energy', 'Energy from a source that is not depleted when used, such as wind or solar power. Unlike your patience during a climate debate, these sources actually last forever.', 'Technology');

INSERT INTO quiz_questions (question, options, correct_index, explanation, difficulty) VALUES
('Which of these is NOT a greenhouse gas?', '["Carbon Dioxide", "Methane", "Oxygen", "Nitrous Oxide"]', 2, 'Oxygen is 21% of our atmosphere and definitely not a greenhouse gas. Nice try, though.', 'easy'),
('How much CO2 does the average tree absorb per year?', '["2kg", "22kg", "200kg", "2000kg"]', 1, 'About 22kg. So stop cutting them down to print "Save the Trees" flyers.', 'medium'),
('Which sector produces the most greenhouse gas emissions globally?', '["Transportation", "Agriculture", "Energy Production", "Fashion"]', 2, 'Energy production (electricity and heat) is the big boss of emissions. Fashion is bad, but not "powering the entire world with coal" bad.', 'medium'),
('What is the "tipping point" in climate science?', '["When you tip your waiter", "A threshold that, when crossed, leads to large, irreversible changes", "The point where a glacier falls over", "When you finally buy a Tesla"]', 1, 'It''s the point of no return. Like when you accidentally hit "Reply All" on a company-wide email.', 'hard');

INSERT INTO companies (name, status, description, roast_comment, website_url) VALUES
('Big Oil Corp', 'not_funding', 'They love dinosaurs. Mostly burning them.', 'Still waiting for their "Green" rebrand to actually include something green other than their logo.', 'https://example.com'),
('EcoVentures', 'funding', 'Venture capital for the planet.', 'Actually putting money where their mouth is. Weird, right?', 'https://example.com'),
('GreenPeace', 'climate_focused', 'Global environmental organization.', 'They have boats. You have a reusable straw. We are not the same.', 'https://greenpeace.org');
