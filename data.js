// Academic CV Data - Easy to Edit
// To update your information, simply modify the values in this file

const academicData = {
    // Personal Information
    personal: {
        name: "Dr. Ameer Kadhim Hadi",
        title: "Assistant Professor",
        subtitle: "Cloud Computing, IoT & AI Expert",

        // ══════════════════════════════════════════════════
        //  PHOTO — كيفية إضافة صورتك الشخصية:
        //  1. ارفع صورتك في مجلد images/ على GitHub
        //     باسم profile.jpg
        //  2. غيّر "" أدناه إلى "images/profile.jpg"
        // ══════════════════════════════════════════════════
        photo: "images/profile.jpg",   // ← ضع رابط صورتك هنا

        bio: "Dedicated Assistant Professor with over 15 years of experience in tertiary education, specializing in Computer Science and Mathematics at the University of Babylon, Iraq. Proven track record in developing and delivering curriculum for undergraduate and postgraduate levels in Cloud Computing, IoT, Network Security, and Programming. Strong background in academic research with recent publications in AI and Blockchain technology. Committed to pedagogical excellence, student mentorship, and contributing to the academic mission through continuous professional development and collaborative research.",
        email: "ameer.hadi@uobabylon.edu.iq",
        linkedin: "https://linkedin.com/in/ameer-hadi",
        googleScholar: "https://scholar.google.com/citations?user=YOURUSER",
        researchGate: "https://www.researchgate.net/profile/Ameer-Kadhim-Hadi",
        orcid: "https://orcid.org/0000-0000-0000-0000"
    },

    // Education
    education: [
        {
            degree: "Ph.D. in Computer Science",
            institution: "University of Babylon, Iraq",
            year: "2010 – 2015",
            dissertation: "Cloud Telecollaboration Consultation and Diagnosis Framework"
        },
        {
            degree: "Master of Science (M.Sc.) in Computer Science",
            institution: "University of Technology, Baghdad, Iraq",
            year: "2004 – 2006",
            specialization: "Information Security"
        },
        {
            degree: "Higher Diploma in Computer Science",
            institution: "Informatics Institute for Postgraduate Studies (ICCI), Baghdad, Iraq",
            year: "2002 – 2004",
            specialization: "Network Security"
        },
        {
            degree: "Bachelor of Science (B.Sc.) in Computer Science",
            institution: "University of Babylon, Iraq",
            year: "1998 – 2002"
        }
    ],

    // ══════════════════════════════════════════════════════════
    //  PUBLICATIONS — كيفية إضافة بحث جديد:
    //
    //  انسخ هذا القالب وأضفه داخل المصفوفة:
    //
    //  {
    //      title    : "عنوان البحث",
    //      authors  : "أسماء المؤلفين",
    //      venue    : "اسم المجلة أو المؤتمر",
    //      year     : 2025,           ← رقم السنة بدون علامات اقتباس
    //      citations: 0,              ← عدد الاقتباسات، رقم
    //      type     : "journal",      ← "journal" أو "conference"
    //      link     : "#"             ← رابط البحث أو "#"
    //  },
    //
    // ══════════════════════════════════════════════════════════
    publications: [
        {
            title: "Optimizing Blockchain Network Performance Using Blake3 Hash Function in POS Consensus Algorithm",
            authors: "ZA Jasim, AK Hadi",
            venue: "IEEE Access, vol. 13, pp. 44760–44774",
            year: 2025,
            citations: 7,
            type: "journal",
            link: "#"
        },
        {
            title: "Deep Learning System for Network Anomaly Detection based Attention Mechanism and Sparse Autoencoder",
            authors: "FH Jassim, AK Hadi",
            venue: "2025 5th International Conference of Science and Information Technology in Smart Administration (ICITSA)",
            year: 2025,
            citations: 0,
            type: "conference",
            link: "#"
        },
        {
            title: "Hybrid Deep Learning Approach for Enhancing Network Security and Traffic Management",
            authors: "FH Jassim, AK Hadi",
            venue: "2025 3rd International Conference on Business Analytics for Technology and Security (ICBATS)",
            year: 2025,
            citations: 0,
            type: "conference",
            link: "#"
        },
        {
            title: "Study on Blockchain Scalability Methods Limitation and Solution",
            authors: "AK Hadi, ZA Jasim",
            venue: "2023 International Conference on Engineering, Science and Advanced Technology (ICESAT)",
            year: 2023,
            citations: 2,
            type: "conference",
            link: "#"
        },
        {
            title: "The Effectiveness of Teaching with Augmented Reality Technology on Developing Visual Intelligence Skills among College of Basic Education Students",
            authors: "AA Alwan AL-Qaraghooli, MM Abbas AL-Khateeb, AK Hadi",
            venue: "Journal of Babylon Center for Humanities Studies, vol. 12, no. 4",
            year: 2022,
            citations: 0,
            type: "journal",
            link: "#"
        },
        {
            title: "The Impact of An Instructional Program Based on Augmented Reality Technology on Basic Education College Students' Achievement in Reading Comprehension Course",
            authors: "AAA AL-Qaraghooli, MMA AL-Khateeb, AK Hadi",
            venue: "Basic Education College Magazine For Educational and Humanities Sciences, vol. 14, no. 55",
            year: 2022,
            citations: 0,
            type: "journal",
            link: "#"
        },
        {
            title: "A Proposed Methodology to Use a Blockchain in Supply Chain Traceability",
            authors: "AK Hadi, S Salem",
            venue: "2021 4th International Iraqi Conference on Engineering Technology and Their Applications (IICETA)",
            year: 2021,
            citations: 7,
            type: "conference",
            link: "#"
        },
        {
            title: "Classifying Quality of Web Services Using Machine Learning Classification and Cross Validation Techniques",
            authors: "NAHH Olewy, AK Hadi",
            venue: "2021 2nd Information Technology To Enhance e-Learning and Other Application (IT-ELA)",
            year: 2021,
            citations: 4,
            type: "conference",
            link: "#"
        },
        {
            title: "IoT Based Covered Agriculture Monitoring and Control System with Smart Sensing and Forwarding Algorithm",
            authors: "HS Hassan, AK Hadi",
            venue: "Turkish Journal of Computer and Mathematics Education, vol. 12, no. 11, pp. 6311–6316",
            year: 2021,
            citations: 2,
            type: "journal",
            link: "#"
        },
        {
            title: "Multiclass Model for Quality of Service Using Machine Learning and Cloud Computing",
            authors: "NAHH Olewy, AK Hadi",
            venue: "2021 7th International Conference on Contemporary Information Technology and Mathematics (ICCITM)",
            year: 2021,
            citations: 0,
            type: "conference",
            link: "#"
        },
        {
            title: "Design a Tracing System for a Seed Supply Chain Based on Blockchain",
            authors: "AB Abdulhussein, AK Hadi, M Ilyas",
            venue: "2020 3rd International Conference on Engineering Technology and its Applications (IICETA)",
            year: 2020,
            citations: 21,
            type: "conference",
            link: "#"
        },
        {
            title: "Secure Multi Functional Robot Based on Cloud Computing",
            authors: "AK Hadi",
            venue: "Journal of Computational and Theoretical Nanoscience, vol. 16, no. 3, pp. 880–888",
            year: 2019,
            citations: 1,
            type: "journal",
            link: "#"
        },
        {
            title: "Toward Trust and More Characters of Arabic Short Message Service using Encryption",
            authors: "AK Hadi",
            venue: "Journal of Engineering and Applied Sciences, vol. 12, no. 21, pp. 5384–5387",
            year: 2017,
            citations: 2,
            type: "journal",
            link: "#"
        },
        {
            title: "Collaborative Computer Aid Diagnosis Framework in Cloud Environment based on Multi Agents Systems",
            authors: "AM Al-Bakry, AK Hadi",
            venue: "International Journal of Advanced Engineering Technology, vol. 7, no. 1, p. 21",
            year: 2014,
            citations: 1,
            type: "journal",
            link: "#"
        },
        {
            title: "Building the Primes P&Q (Of the Public Key Algorithm) by Using Function of Reals",
            authors: "F Al Mamory, AK Hadi, ALS Ahmed",
            venue: "Journal (details to be added)",
            year: 2014,
            citations: 0,
            type: "journal",
            link: "#"
        }
    ],

    // Research Projects
    projects: [
        {
            title: "AI Innovation – Hydroponic Agriculture Device",
            description: "Award-winning project developing an AI-powered hydroponic agriculture monitoring and control device, recognized with the AI Innovation Award in 2024.",
            technologies: ["AI", "IoT", "Machine Learning", "Embedded Systems", "Agriculture Tech"],
            duration: "2023-2024",
            funding: "University of Babylon",
            status: "Completed"
        },
        {
            title: "Blockchain Network Performance Optimization",
            description: "Research on optimizing blockchain network performance using the Blake3 Hash Function in Proof-of-Stake (POS) consensus algorithms, published in IEEE Access.",
            technologies: ["Blockchain", "POS Consensus", "Blake3", "Network Optimization", "Cryptography"],
            duration: "2024-2025",
            funding: "University Research",
            status: "Completed"
        },
        {
            title: "IoT Smart Farm Monitoring System",
            description: "Development of an IoT-based system for real-time smart farm monitoring, integrating sensor networks and cloud data processing for agricultural applications.",
            technologies: ["IoT", "Cloud Computing", "Sensors", "Python", "Data Analytics"],
            duration: "2020-2021",
            funding: "College of IT, University of Babylon",
            status: "Completed"
        },
        {
            title: "Cloud Telecollaboration Consultation and Diagnosis Framework",
            description: "Ph.D. dissertation project designing a cloud-based framework for remote telecollaboration, consultation, and diagnosis across distributed environments.",
            technologies: ["Cloud Computing", "Distributed Systems", "Networking", "Web Services"],
            duration: "2010-2015",
            funding: "University of Babylon",
            status: "Completed"
        }
    ],

    // Courses Taught
    courses: [
        {
            code: "CS-PG",
            title: "Cloud Computing",
            description: "Postgraduate course covering cloud computing architectures, service models (IaaS, PaaS, SaaS), deployment strategies, and hands-on AWS cloud infrastructure.",
            level: "Postgraduate",
            semester: "Current"
        },
        {
            code: "CS-UG",
            title: "Internet of Things (IoT)",
            description: "Comprehensive coverage of IoT architectures, communication protocols, embedded systems, and real-world smart applications.",
            level: "Undergraduate",
            semester: "Current"
        },
        {
            code: "CS-UG",
            title: "Network Security",
            description: "Fundamentals and advanced topics in network security, including cryptography, firewalls, intrusion detection, and security protocols.",
            level: "Undergraduate",
            semester: "Current"
        },
        {
            code: "CS-UG",
            title: "Software Engineering",
            description: "Software development lifecycle, design patterns, agile methodologies, requirements engineering, and software quality assurance.",
            level: "Undergraduate",
            semester: "Current"
        },
        {
            code: "CS-UG",
            title: "Database Systems",
            description: "Relational database design, SQL, normalization, transaction management, and introduction to NoSQL databases.",
            level: "Undergraduate",
            semester: "Current"
        },
        {
            code: "CS-UG",
            title: "Computer Networking Principles",
            description: "Core networking concepts including TCP/IP, OSI model, routing protocols, and network administration.",
            level: "Undergraduate",
            semester: "Current"
        },
        {
            code: "CS-UG",
            title: "Programming (Python, C++, R, JavaScript)",
            description: "Multi-language programming instruction covering Python, C++, R, JavaScript, and VB.net with emphasis on practical problem-solving.",
            level: "Undergraduate",
            semester: "Current"
        },
        {
            code: "MATH",
            title: "Numerical Analysis",
            description: "Numerical methods using FORTRAN/C++ for solving mathematical problems, including interpolation, integration, and differential equations.",
            level: "Undergraduate",
            semester: "Current"
        }
    ],

    // Certifications
    certifications: [
        {
            title: "AWS Academy Educator Certification",
            issuer: "Amazon Web Services",
            year: 2025
        },
        {
            title: "Iraq E-Learning Professional Training (TOT)",
            issuer: "IREX",
            year: 2020
        },
        {
            title: "Internet Computing Core (IC3) Instructor Certificate",
            issuer: "Certiport",
            year: 2010
        },
        {
            title: "CCNA Exploration: Network Fundamentals",
            issuer: "Cisco",
            year: 2009
        }
    ],

    // Awards & Honors
    awards: [
        {
            title: "AI Innovation Award for Hydroponic Agriculture Device",
            year: 2024
        },
        {
            title: "Cloud Computing Ambassador Award",
            issuer: "AWS",
            year: 2020
        },
        {
            title: "Science Day Award for Best Graduation Project",
            year: 2016
        },
        {
            title: "Fulbright Scholarship",
            issuer: "U.S. Department of State",
            year: 2012
        }
    ],

    // ══════════════════════════════════════════════════════════
    //  MEDIA & NEWS — منشورات الجامعات ووسائل التواصل عنك
    //
    //  كيفية إضافة منشور جديد — انسخ هذا القالب:
    //
    //  {
    //      title      : "عنوان المنشور",
    //      source     : "اسم الجهة (مثل: University of Babylon)",
    //      platform   : "Instagram",   ← Instagram / Facebook / Twitter / Website
    //      description: "وصف قصير للمنشور",
    //      image      : "images/media1.jpg",  ← صورة المنشور أو ""
    //      link       : "https://رابط-المنشور",
    //      date       : "March 2025"
    //  },
    //
    // ══════════════════════════════════════════════════════════
    media: [
        {
            title: "AI Innovation Award — Hydroponic Agriculture Device",
            source: "University of Babylon — Faculty of IT",
            platform: "Instagram",
            description: "Dr. Ameer Kadhim Hadi receives the AI Innovation Award for developing an intelligent hydroponic agriculture monitoring device using AI and IoT technologies.",
            image: "",
            link: "https://www.instagram.com/p/DRP3aLCiO8q/",
            date: "2024"
        }
    ],

    // Gallery Images
    gallery: [
        {
            src: "images/conference1.jpg",
            caption: "Presenting research at IEEE Conference 2025",
            alt: "Conference presentation"
        },
        {
            src: "images/lab1.jpg",
            caption: "IoT Research Lab – Smart Farm Project",
            alt: "Research lab"
        },
        {
            src: "images/students1.jpg",
            caption: "Working with graduate students on AI projects",
            alt: "Students collaboration"
        },
        {
            src: "images/workshop1.jpg",
            caption: "AWS Cloud Computing Workshop",
            alt: "Workshop session"
        }
    ],

    // Skills and Expertise
    skills: {
        technical: [
            "Deep Learning & Neural Networks",
            "Large Language Models (LLMs)",
            "Internet of Things (IoT)",
            "Cloud Computing (AWS)",
            "Blockchain Technology",
            "Edge Computing",
            "Python, R, C++, Go",
            "TensorFlow & PyTorch",
            "Hadoop, Spark, MapReduce",
            "Network Security"
        ],
        research: [
            "Research Design",
            "Academic Publishing (IEEE, Journals)",
            "Grant Writing",
            "Peer Review",
            "Conference Presentations",
            "Student Research Supervision"
        ],
        teaching: [
            "Curriculum Development",
            "Postgraduate Teaching",
            "E-Learning & Online Education",
            "Student Mentoring",
            "Assessment Design",
            "Educational Technology"
        ]
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = academicData;
}
