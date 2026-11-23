import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarClock, Clock, MapPin, UserRound } from 'lucide-react';
import {
  portalItemVariants,
  StudentPageHero,
  StudentPageShell
} from '@/components/StudentPortalLayout';

const ClassTimetable = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  const timetableData = [
    {
      id: 1,
      subject: 'Mathematics',
      day: 'Monday',
      time: '09:00 - 11:00',
      location: 'Room 101',
      teacher: 'Dr. Smith',
      status: 'Upcoming'
    },
    {
      id: 2,
      subject: 'Physics',
      day: 'Wednesday',
      time: '13:00 - 15:00',
      location: 'Room 203',
      teacher: 'Prof. Johnson',
      status: 'Upcoming'
    },
    {
      id: 3,
      subject: 'Computer Science',
      day: 'Thursday',
      time: '10:00 - 12:00',
      location: 'Lab 3',
      teacher: 'Dr. Williams',
      status: 'Upcoming'
    },
    {
      id: 4,
      subject: 'English Literature',
      day: 'Friday',
      time: '14:00 - 16:00',
      location: 'Room 105',
      teacher: 'Ms. Davis',
      status: 'Upcoming'
    }
  ];

  return (
    <StudentPageShell title="Class Timetable">
      <StudentPageHero
        eyebrow="Timetable"
        title="Your upcoming classes at a glance."
        description="A simple mobile-friendly view of class day, time, teacher, and location."
        icon={CalendarClock}
      />

      <motion.section variants={portalItemVariants} className="grid gap-4 md:grid-cols-2">
        {timetableData.map((classItem) => (
          <Card key={classItem.id} className="overflow-hidden border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="flex items-start justify-between gap-3 bg-white p-4">
                <div>
                  <p className="text-sm font-semibold text-[#0f5f8f]">{classItem.day}</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-950">{classItem.subject}</h2>
                </div>
                <Badge variant="outline" className="border-sky-200 bg-sky-50 text-[#0f5f8f]">
                  {classItem.status}
                </Badge>
              </div>

              <div className="grid gap-3 border-t border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3 rounded-md bg-white p-3">
                  <Clock className="h-4 w-4 text-[#0f5f8f]" />
                  <span className="text-sm font-medium text-slate-700">{classItem.time}</span>
                </div>
                <div className="flex items-center gap-3 rounded-md bg-white p-3">
                  <MapPin className="h-4 w-4 text-[#00796b]" />
                  <span className="text-sm font-medium text-slate-700">{classItem.location}</span>
                </div>
                <div className="flex items-center gap-3 rounded-md bg-white p-3">
                  <UserRound className="h-4 w-4 text-indigo-700" />
                  <span className="text-sm font-medium text-slate-700">{classItem.teacher}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.section>
    </StudentPageShell>
  );
};

export default ClassTimetable;
