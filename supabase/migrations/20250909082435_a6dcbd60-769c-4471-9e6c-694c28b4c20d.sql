-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('manager', 'candidate');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create candidate details table
CREATE TABLE public.candidate_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT,
  address TEXT,
  skills TEXT[],
  experience_years INTEGER,
  education TEXT,
  current_position TEXT,
  linkedin_profile TEXT,
  github_profile TEXT,
  bio TEXT,
  accessibility_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create manager remarks table
CREATE TABLE public.manager_remarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manager_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  remarks TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  recommendation_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_remarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for candidate_details
CREATE POLICY "Candidates can view their own details" ON public.candidate_details
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Candidates can update their own details" ON public.candidate_details
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Candidates can insert their own details" ON public.candidate_details
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Managers can view all candidate details" ON public.candidate_details
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'manager'
    )
  );

-- RLS Policies for manager_remarks
CREATE POLICY "Managers can view their own remarks" ON public.manager_remarks
  FOR SELECT USING (auth.uid() = manager_id);

CREATE POLICY "Managers can insert remarks" ON public.manager_remarks
  FOR INSERT WITH CHECK (
    auth.uid() = manager_id AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'manager'
    )
  );

CREATE POLICY "Managers can update their own remarks" ON public.manager_remarks
  FOR UPDATE USING (auth.uid() = manager_id);

CREATE POLICY "Candidates can view remarks about them" ON public.manager_remarks
  FOR SELECT USING (auth.uid() = candidate_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidate_details_updated_at
  BEFORE UPDATE ON public.candidate_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_manager_remarks_updated_at
  BEFORE UPDATE ON public.manager_remarks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'candidate')::user_role,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();