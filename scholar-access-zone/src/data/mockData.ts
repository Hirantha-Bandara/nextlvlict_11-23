export interface Testimonial {
    id: number;
    name: string;
    role: string;
    image: string;
    text: string;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    icon: string;
    features: string[];
}

export interface Event {
    id: number;
    title: string;
    description: string;
    image: string;
    date: string;
    location: string;
    images: string[];
    fullDescription: string;
    fee?: string;
}

export interface Resource {
    id: number;
    title: string;
    description: string;
    icon: string;
    downloadLink: string;
}

export interface PortalFeature {
    icon: string;
    title: string;
    description: string;
}

export interface Stat {
    number: string;
    text: string;
}

export interface TimetableItem {
    location: string;
    grade: string;
    time: string;
    group?: string;
}

export interface OLTimeTable {
    branch: string;
    grade10: TimetableItem[];
    grade11: TimetableItem[];
}

export interface ALTimeTable {
    branch: string;
    year: string;
    type: string;
    time: string;
}

export const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Sehan Dinusara",
        role: "Royal College, Colombo 07 - Index No. 40127258",
        image: "https://placehold.co/70x70/3c6299/FFFFFF?text=SD",
        text: "මට O/L වලට A9ක් තියෙනවා. මම ICT පන්ති ආවේ කවිශ්න සර් ගාවට. කවිශ්න සර් ඇත්තටම කිව්වොත් හරියට Syllabus එක cover කරලා අමතර පන්ති දාලා ආයි ආයි පාඩම් cover කළා. ඊට අමතර වෙනම Paper class එකක් කළා. ඒ Papers සාකච්ඡ කළා. ඉතින් අපි වගේම ඕනම කෙනෙකුට ICT වලට A එකක් ගන්න ඕනෙ නම් කවිශ්න සර්ගේ පන්තිය Recommend කරන්න පුළුවන්."
    },
    {
        id: 2,
        name: "Gihara De Silva",
        role: "St. Pauls Girls School, Milagiriya - Index No. 40160130",
        image: "https://placehold.co/70x70/00afa1/FFFFFF?text=GD",
        text: "I've always been a fairly confident student. But this class surely took my knowledge on ICT to the next level. I also have to mention how useful and well structured his paper class is before sitting for the O/L ICT paper. I didn't even need to go through any textbooks because I felt fully prepared. I was confident about getting an A pass for ICT. Thanks to Kavishna Sir. I'm genuinely grateful for the support and guidance I received throughout this class. Such an influence guided me to select ICT for my A/Ls as well."
    },
    {
        id: 3,
        name: "Senuli Dahamya",
        role: "Anula Vidyalaya, Nugegoda - Index No. 42006750",
        image: "https://placehold.co/70x70/3c6299/FFFFFF?text=SD",
        text: "මට O/L වලට A9ක් තියෙනවා. ඇත්තටම ICT වලට නම් A එකක් තියෙන්නේ කවිශ්න සර් නිසාම තමයි. මම Class එකට එන්න කලින් සාමාන්‍යයෙන්  තිබ්බේ 60 ගණන් වගේ. කවිශ්න සර්ගේ class එකට අවාම තමයි ඇත්තටම ICT කියන Subject එක ගැන හරි Idea එකක් ආවේ. මට ඇත්තටම ගෙදර ගිහින් පාඩම් කරන්න ලොකුවට ඕනේ වුණේ නෑ, සර්ගේ Class එකේදී සර් උගන්නන විදියට ගොඩක් දේවල් එහෙම්ම මතක හිටිනවා. ඉතින් ලේසියෙන්ම මට ICT වලට A එකක් ගන්න පුළුවන් වුණා. ලොකු Stress එකක් නැතුව ICT වලට A එකක් ගන්න ඕනේ නම් කවිශ්න සර් ගාවට එන්නම ඕනේ."
    },
    {
        id: 4,
        name: "Gagani Tharushika",
        role: "Presbyterian Girls' School, Dehiwala - Index No. 42330435",
        image: "https://placehold.co/70x70/00afa1/FFFFFF?text=GT",
        text: "The best ICT class I've ever been to. Even though the subject felt confusing at first, when O/Ls came closer it became the subject I felt sure about...all because of Kavishna sir. His teaching felt real, comforting, and easy to follow. Truly my one and only recommendation for ICT."
    },
    {
        id: 5,
        name: "Isitha Damnidu",
        role: "D. S Senanayake College, Colombo 07 - Index No. 40108210",
        image: "https://placehold.co/70x70/3c6299/FFFFFF?text=ID",
        text: "ඇත්තටම කිව්වොත් මම වෙන ICT පන්තිවලට ගිහින් නෑ. 10 වසරෙදිම කෙළින්ම කවිශ්න සර්ගේ පන්තියටමයි ආවේ. ඉතින් මට O/L ICT වලට A එකක් ආවේ ඇත්තටම කවිහ්ස්න සර් නිසාමයි. කවිශ්න සර් ගැන කියනවනම් ගොඩක් හොද සර් කෙනෙක්, යාළුවෙක් වගේ ළගින් ඉදලා බය නැතුව ඕනේ දෙයක් අහල කතා කරලා ඉගෙන ගන්න පුළුවන්. ගොඩක් කැපවීමෙන් උගන්නන ගුරුවරයෙක්. ඉතින් අපෙන් පස්සේ එන නංගිලා මල්ලිලා ඕන කෙනෙක් බය නැතුව කවිශ්න සර්ගේ පන්තියට එන්න. කවිශ්න සර්ව මම බය නැතුව ඔයාලට Recommend කරනවා."
    },
    {
        id: 6,
        name: "Dinil Damnidu",
        role: "Ananda College, Colombo 10 - Index No. 42006808",
        image: "https://placehold.co/70x70/00afa1/FFFFFF?text=DD",
        text: "මට O/L වලට 9As තියනවා. මම ඇත්තටම කවිශ්න සර්ගේ පන්ති එන්න පටන් ගත්තේ 10 ශ්‍රේණිය අන්තිම වාරෙ ඉදලා. ඒ වෙනකොටත් මට ICT කියන විෂය එපා වෙලා තිබ්බේ. ඒත් කවිශ්න සර්ගේ ICT පන්තියට සහභාගී වුණාට පස්සේ මට ලේසියෙන්ම ICT ටික ගොඩ දාගන්න පුළුවන් වුණා. එතනින් එහාට මම හැම වරෙකම වගේ ICT වලට 75ට වැඩියෙන් ලකුණු ගත්තා. අන්තිමට මට O/L ICT වලටත් A එකක් ආවා, ඔයාලටත් ICT වලට ලේසියෙන්ම A එකක් ගන්න ඕනේ නම් කවිශ්න සර් ගාවට එන්න."
    }
];

export const courses: Course[] = [
    {
        id: 1,
        title: "O/L ICT",
        description: "Foundation for your digital future",
        icon: "fas fa-graduation-cap",
        features: [
            "Introduction to ICT concepts",
            "Hardware and software fundamentals",
            "Operating systems and applications",
            "Information systems and database basics",
            "Internet, web development and safety",
            "Past paper practice and exam techniques"
        ]
    },
    {
        id: 2,
        title: "A/L ICT",
        description: "Advanced concepts for excellence",
        icon: "fas fa-laptop-code",
        features: [
            "Advanced programming concepts",
            "Database management systems",
            "Software development life cycle",
            "Data structures and algorithms",
            "Web application development",
            "Practical exam preparation and techniques"
        ]
    }
];

export const portalFeatures: PortalFeature[] = [
    {
        icon: "fas fa-book",
        title: "Study Materials",
        description: "Access comprehensive study notes, past papers, and revision guides for both O/L and A/L ICT."
    },
    {
        icon: "fas fa-video",
        title: "Video Lessons",
        description: "Watch recorded lessons and tutorials to reinforce your understanding of complex topics."
    },
    {
        icon: "fas fa-chart-line",
        title: "Progress Analytics",
        description: "Track your performance with detailed analytics and personalized recommendations."
    }
];

export const stats: Stat[] = [
    { number: "6+", text: "Years of Teaching Experience" },
    // { number: "50+", text: "Students Taught" },
    { number: "99%", text: "Pass Rate" },
    { number: "200+", text: "A Grades Achieved" }
];

export const events: Event[] = [
    {
        id: 1,
        title: "ICT Exam Preparation Seminar",
        description: "Intensive one-day seminar covering essential O/L exam topics with practice questions and model answers.",
        image: "https://placehold.co/400x300/3c6299/FFFFFF?text=ICT+Exam+Prep",
        date: "15th June 2023",
        location: "Colombo",
        images: [
            "https://placehold.co/600x400/3c6299/FFFFFF?text=Exam+Seminar+1",
            "https://placehold.co/600x400/00afa1/FFFFFF?text=Exam+Seminar+2",
            "https://placehold.co/600x400/3c6299/FFFFFF?text=Exam+Seminar+3"
        ],
        fullDescription: `
      <h4>ICT Exam Preparation Seminar</h4>
      <p><strong>Date:</strong> 15th June 2023</p>
      <p><strong>Time:</strong> 9:00 AM - 4:00 PM</p>
      <p><strong>Location:</strong> Colombo Seminar Hall, 123 Education Street, Colombo</p>
      <p>This intensive one-day seminar is designed specifically for O/L students preparing for their ICT examination. The session will cover:</p>
      <ul>
        <li>Key topics from the O/L syllabus</li>
        <li>Effective answering techniques for theory questions</li>
        <li>Practical exam strategies and time management</li>
        <li>Common mistakes to avoid</li>
        <li>Practice with past paper questions and model answers</li>
      </ul>
      <p>Participants will receive a comprehensive study guide and practice materials. Limited seats available.</p>
      <p><strong>Fee:</strong> Rs. 2,500 (includes materials and lunch)</p>
    `,
        fee: "Rs. 2,500"
    },
    {
        id: 2,
        title: "Advanced Database Workshop",
        description: "Hands-on workshop focusing on advanced database concepts for A/L students. Limited seats available.",
        image: "https://placehold.co/400x300/00afa1/FFFFFF?text=Database+Workshop",
        date: "23rd July 2023",
        location: "Digital Hub",
        images: [
            "https://placehold.co/600x400/00afa1/FFFFFF?text=Database+Workshop+1",
            "https://placehold.co/600x400/3c6299/FFFFFF?text=Database+Workshop+2",
            "https://placehold.co/600x400/00afa1/FFFFFF?text=Database+Workshop+3"
        ],
        fullDescription: `
      <h4>Advanced Database Workshop</h4>
      <p><strong>Date:</strong> 23rd July 2023</p>
      <p><strong>Time:</strong> 10:00 AM - 5:00 PM</p>
      <p><strong>Location:</strong> Digital Hub, 456 Tech Avenue, Colombo</p>
      <p>This hands-on workshop is designed for A/L students who want to deepen their understanding of database concepts. The workshop will cover:</p>
      <ul>
        <li>Advanced SQL queries and optimization</li>
        <li>Database design principles and normalization</li>
        <li>Transaction management and concurrency control</li>
        <li>Practical implementation of database systems</li>
        <li>Integration with application development</li>
      </ul>
      <p>Participants will work on real-world database problems and receive a certificate of completion. Limited to 20 participants.</p>
      <p><strong>Fee:</strong> Rs. 3,500 (includes materials and certificate)</p>
    `,
        fee: "Rs. 3,500"
    }
];

export const resources: Resource[] = [
    {
        id: 1,
        title: "ICT O/L Past Papers",
        description: "Collection of past examination papers with detailed answers and explanations.",
        icon: "fas fa-file-alt",
        downloadLink: "#"
    },
    {
        id: 2,
        title: "ICT A/L Study Notes",
        description: "Comprehensive study materials covering all topics in the A/L ICT syllabus.",
        icon: "fas fa-book",
        downloadLink: "#"
    },
    {
        id: 3,
        title: "Programming Basics",
        description: "Beginner-friendly guide to programming concepts with practical examples.",
        icon: "fas fa-code",
        downloadLink: "#"
    },
    {
        id: 4,
        title: "Database Cheat Sheet",
        description: "Quick reference guide for SQL commands and database concepts.",
        icon: "fas fa-database",
        downloadLink: "#"
    }
];

export const olTimetable: OLTimeTable[] = [
    {
        branch: "OVIDMA - MAHARAGAMA",
        grade10: [
            { location: "OVIDMA - MAHARAGAMA", grade: "Grade 10", time: "Wednesday 3.30PM - 5.30PM", group: "Group 1" },
            { location: "OVIDMA - MAHARAGAMA", grade: "Grade 10", time: "Saturday 8.00AM - 10.00AM", group: "Group 2" }
        ],
        grade11: [
            { location: "OVIDMA - MAHARAGAMA", grade: "Grade 11", time: "Wednesday 5.30PM - 7.30PM", group: "Group 1" },
            { location: "OVIDMA - MAHARAGAMA", grade: "Grade 11", time: "Saturday 4.30PM - 6.30PM", group: "Group 2" }
        ]
    },
    {
        branch: "SESIRA - PILIYANDALA",
        grade10: [
            { location: "SESIRA - PILIYANDALA", grade: "Grade 10", time: "Thursday 5.30PM - 7.30PM", group: "Group 1" },
            { location: "SESIRA - PILIYANDALA", grade: "Grade 10", time: "Friday 3.30PM - 5.30PM", group: "Group 2" }
        ],
        grade11: [
            { location: "SESIRA - PILIYANDALA", grade: "Grade 11", time: "Thursday 3.30PM - 5.30PM", group: "Group 1" },
            { location: "SESIRA - PILIYANDALA", grade: "Grade 11", time: "Friday 5.30PM - 7.30PM", group: "Group 2" }
        ]
    },
    {
        branch: "WINGS - MAHARAGAMA (Group Class)",
        grade10: [
            { location: "WINGS - MAHARAGAMA", grade: "Grade 10", time: "Sunday 3.00PM - 5.00PM" }
        ],
        grade11: [
            { location: "WINGS - MAHARAGAMA", grade: "Grade 11", time: "Sunday 1.00PM - 3.00PM" }
        ]
    },
    {
        branch: "UNIVERSE - HOMAGAMA",
        grade10: [
            { location: "UNIVERSE - HOMAGAMA", grade: "Grade 10", time: "Tuesday 5.00PM - 7.00PM" }
        ],
        grade11: [
            { location: "UNIVERSE - HOMAGAMA", grade: "Grade 11", time: "Tuesday 3.30PM - 5.30PM" }
        ]
    },
    {
        branch: "ONLINE - ZOOM",
        grade10: [
            { location: "ONLINE - ZOOM", grade: "Grade 10", time: "Sunday 3.00PM - 5.00PM" }
        ],
        grade11: [
            { location: "ONLINE - ZOOM", grade: "Grade 11", time: "Sunday 1.00PM - 3.00PM" },
            // { location: "ONLINE - ZOOM (Revision + Paper)", grade: "Grade 11", time: "Monday 8.30PM - 11.00PM" }
        ]
    }
];

export const alTimetable: ALTimeTable[] = [
    // 2026 THEORY
    { branch: "SESIRA - PILIYANDALA", year: "2026", type: "Theory", time: "Saturday 1.00PM - 3.00PM" },
    { branch: "WINGS - MAHARAGAMA", year: "2026", type: "Theory", time: "Monday 5.30PM - 7.30PM" },
    
    // 2026 REVISION + PAPER
    { branch: "SESIRA - PILIYANDALA", year: "2026", type: "Revision + Paper", time: "Tuesday 8.00AM - 2.00PM" },
    { branch: "WINGS - MAHARAGAMA", year: "2026", type: "Revision + Paper", time: "Friday 8.00AM - 2.00PM" },
    
    // 2027 THEORY
    { branch: "SESIRA - PILIYANDALA", year: "2027", type: "Theory", time: "Sunday 10.00AM - 12.30PM" },
    { branch: "WINGS - MAHARAGAMA", year: "2027", type: "Theory", time: "Monday 3.00PM - 5.30PM" },
    { branch: "ONLINE - ZOOM", year: "2027", type: "Theory", time: "Monday 3.00PM - 5.30PM" },
    
    // Additional Grade 11 Revision + Paper (from ONLINE section)
    { branch: "ONLINE - ZOOM", year: "Grade 11", type: "Revision + Paper", time: "Monday 8.30PM - 11.00PM" }
];
