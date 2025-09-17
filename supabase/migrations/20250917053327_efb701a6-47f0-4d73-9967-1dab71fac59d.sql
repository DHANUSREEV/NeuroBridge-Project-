-- Add tables for quiz results and resume generation
CREATE TABLE public.quiz_results (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  quiz_type text NOT NULL,
  domain_id text NOT NULL,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  percentage integer NOT NULL,
  answers jsonb NOT NULL,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policies for quiz results
CREATE POLICY "Users can view their own quiz results" 
ON public.quiz_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz results" 
ON public.quiz_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Managers can view all quiz results" 
ON public.quiz_results 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1
  FROM profiles
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'manager'::user_role
));

-- Add profile completion status to candidate_details
ALTER TABLE public.candidate_details 
ADD COLUMN profile_completed boolean DEFAULT false;

-- Add resume data storage
CREATE TABLE public.generated_resumes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  resume_data jsonb NOT NULL,
  generated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for resumes
ALTER TABLE public.generated_resumes ENABLE ROW LEVEL SECURITY;

-- Create policies for resumes
CREATE POLICY "Users can view their own resumes" 
ON public.generated_resumes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes" 
ON public.generated_resumes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes" 
ON public.generated_resumes 
FOR UPDATE 
USING (auth.uid() = user_id);