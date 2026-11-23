
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardNav from '@/components/DashboardNav';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TeacherProfile {
  id: number;
  name: string;
  title: string;
  bio: string;
  subjects: string[];
  experience: number;
  image: string | null;
  education: string[];
  certifications: string[];
}

const TeacherPortfolio = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/");
    }
    
    // Mock data for teacher profiles
    const mockTeachers: TeacherProfile[] = [
      {
        id: 1,
        name: "Dr. Sarah Smith",
        title: "Mathematics Professor",
        bio: "Dr. Smith has over 12 years of experience teaching advanced mathematics. She specializes in calculus and linear algebra.",
        subjects: ["Advanced Mathematics", "Calculus", "Linear Algebra"],
        experience: 12,
        image: null,
        education: ["PhD in Mathematics, Stanford University", "MS in Applied Mathematics, MIT"],
        certifications: ["Certified Mathematics Educator", "Advanced Pedagogical Methods"]
      },
      {
        id: 2,
        name: "Prof. John Johnson",
        title: "Chemistry Specialist",
        bio: "Professor Johnson is an expert in organic chemistry with research publications in leading scientific journals.",
        subjects: ["Organic Chemistry", "Biochemistry", "General Chemistry"],
        experience: 15,
        image: null,
        education: ["PhD in Chemistry, Harvard University", "BS in Chemical Engineering, UC Berkeley"],
        certifications: ["Laboratory Safety Certification", "Advanced Research Methodologies"]
      },
      {
        id: 3,
        name: "Dr. Amelia Williams",
        title: "Computer Science Instructor",
        bio: "Dr. Williams comes from the tech industry with extensive experience in web development and software engineering.",
        subjects: ["Web Development", "Data Structures", "JavaScript Programming"],
        experience: 8,
        image: null,
        education: ["PhD in Computer Science, Carnegie Mellon", "MS in Information Technology, Georgia Tech"],
        certifications: ["AWS Certified Developer", "Google Cloud Certification"]
      },
      {
        id: 4,
        name: "Ms. Emily Davis",
        title: "Economics Lecturer",
        bio: "Ms. Davis has practical experience in financial markets and brings real-world examples to her economics classes.",
        subjects: ["Business Economics", "Microeconomics", "Financial Markets"],
        experience: 10,
        image: null,
        education: ["MBA, Wharton School of Business", "BA in Economics, Columbia University"],
        certifications: ["Chartered Financial Analyst (CFA)", "Certified Business Economist"]
      }
    ];
    
    setTeachers(mockTeachers);
  }, [navigate]);

  return (
    <div className="student-portal-theme min-h-screen flex flex-col bg-nl-mist">
      <DashboardHeader title="Teacher Portfolios" />
      <DashboardNav />
      
      <main className="flex-grow student-portal-container">
        <h2 className="page-title mb-6">Meet Our Expert Teachers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="nl-card nl-card-interactive">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                  <Avatar className="h-24 w-24 border-2 border-nl-blue/25">
                    <AvatarFallback className="bg-gradient-to-br from-nl-blue to-nl-navy text-white text-2xl font-display">
                      {teacher.name.split(' ').map(name => name[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-4">
                    <div className="text-center md:text-left">
                      <h3 className="font-display text-xl font-bold text-nl-blue">{teacher.name}</h3>
                      <p className="text-nl-steel">{teacher.title}</p>
                      <p className="text-sm mt-2 text-nl-steel">{teacher.experience} years of teaching experience</p>
                    </div>
                    
                    <div>
                      <p className="text-nl-steel">{teacher.bio}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-display font-semibold text-nl-ink">Subjects</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {teacher.subjects.map((subject, idx) => (
                          <Badge key={idx} className="rounded-full bg-nl-blue/10 text-nl-blue hover:bg-nl-blue/15">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-display font-semibold text-nl-ink">Education</h4>
                      <ul className="list-disc list-inside text-sm text-nl-steel">
                        {teacher.education.map((edu, idx) => (
                          <li key={idx}>{edu}</li>
                        ))}
                      </ul>
                      
                      <h4 className="font-display font-semibold text-nl-ink pt-2">Certifications</h4>
                      <ul className="list-disc list-inside text-sm text-nl-steel">
                        {teacher.certifications.map((cert, idx) => (
                          <li key={idx}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TeacherPortfolio;
