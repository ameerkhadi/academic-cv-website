// Academic CV Data - Easy to Edit
// To update your information, simply modify the values in this file

const academicData = {
    // Personal Information
    personal: {
        name: "Dr. Ameer Khadi",
        title: "Assistant Professor",
        subtitle: "AI, IoT & Cloud Expert",
        bio: "Highly motivated Assistant Professor with expertise in Artificial Intelligence, Internet of Things, and Cloud Computing. Dedicated to advancing research and education in these fields, with a strong focus on interdisciplinary applications and real-world problem solving. My research interests include machine learning, smart systems, and distributed computing architectures.",
        email: "ameer.khadi@uobabylon.edu.iq",
        phone: "+964 123 456 789",
        linkedin: "https://linkedin.com/in/ameerkhadi",
        googleScholar: "https://scholar.google.com/citations?user=YOURUSER",
        researchGate: "https://www.researchgate.net/profile/Ameer-Khadi",
        orcid: "https://orcid.org/0000-0000-0000-0000"
    },

    // Publications - Add your publications here
    publications: [
        {
            title: "Advanced Machine Learning Techniques for IoT Data Analytics",
            authors: "A. Khadi, M. Smith, J. Doe",
            venue: "IEEE Transactions on Internet of Things, 2024",
            year: 2024,
            type: "journal",
            link: "#"
        },
        {
            title: "Cloud-Based Smart City Infrastructure: A Comprehensive Framework",
            authors: "A. Khadi, R. Johnson, L. Brown",
            venue: "International Conference on Smart Cities (ICSC), 2023",
            year: 2023,
            type: "conference",
            link: "#"
        },
        {
            title: "Federated Learning for Edge Computing in Industrial IoT",
            authors: "A. Khadi, S. Wilson, K. Davis",
            venue: "Journal of Industrial Informatics, 2023",
            year: 2023,
            type: "journal",
            link: "#"
        },
        {
            title: "Security Challenges in Cloud-IoT Integration: A Survey",
            authors: "A. Khadi, T. Anderson, P. Martinez",
            venue: "ACM Computing Surveys, 2022",
            year: 2022,
            type: "journal",
            link: "#"
        }
    ],

    // Research Projects
    projects: [
        {
            title: "Smart Agriculture Monitoring System",
            description: "Development of an IoT-based system for real-time monitoring of agricultural parameters including soil moisture, temperature, and crop health using machine learning algorithms.",
            technologies: ["IoT", "Machine Learning", "Python", "Arduino", "Cloud Computing"],
            duration: "2023-2024",
            funding: "University Research Grant",
            status: "Ongoing"
        },
        {
            title: "Federated Learning Framework for Healthcare",
            description: "Design and implementation of a privacy-preserving federated learning system for medical data analysis across multiple healthcare institutions.",
            technologies: ["Federated Learning", "TensorFlow", "Python", "Blockchain", "Healthcare AI"],
            duration: "2022-2023",
            funding: "National Science Foundation",
            status: "Completed"
        },
        {
            title: "Edge Computing for Smart Manufacturing",
            description: "Development of edge computing solutions for real-time quality control and predictive maintenance in manufacturing environments.",
            technologies: ["Edge Computing", "Computer Vision", "Industrial IoT", "AI", "Real-time Systems"],
            duration: "2021-2022",
            funding: "Industry Partnership",
            status: "Completed"
        }
    ],

    // Courses Taught
    courses: [
        {
            code: "CS 485",
            title: "Artificial Intelligence",
            description: "Introduction to AI concepts, machine learning algorithms, and practical applications in various domains.",
            level: "Undergraduate",
            semester: "Fall 2024"
        },
        {
            code: "CS 587",
            title: "Internet of Things Systems",
            description: "Comprehensive coverage of IoT architectures, protocols, and implementation strategies for smart systems.",
            level: "Graduate",
            semester: "Spring 2024"
        },
        {
            code: "CS 645",
            title: "Cloud Computing and Distributed Systems",
            description: "Advanced topics in cloud computing, distributed algorithms, and scalable system design.",
            level: "Graduate",
            semester: "Fall 2023"
        },
        {
            code: "CS 320",
            title: "Data Structures and Algorithms",
            description: "Fundamental data structures and algorithmic techniques with emphasis on efficiency and practical implementation.",
            level: "Undergraduate",
            semester: "Spring 2023"
        }
    ],

    // Gallery Images - Add your images here
    gallery: [
        {
            src: "images/conference1.jpg",
            caption: "Presenting research at IEEE IoT Conference 2024",
            alt: "Conference presentation"
        },
        {
            src: "images/lab1.jpg",
            caption: "IoT Research Lab - Smart Agriculture Project",
            alt: "Research lab"
        },
        {
            src: "images/students1.jpg",
            caption: "Working with graduate students on AI projects",
            alt: "Students collaboration"
        },
        {
            src: "images/workshop1.jpg",
            caption: "Conducting workshop on Machine Learning",
            alt: "Workshop session"
        }
    ],

    // Skills and Expertise
    skills: {
        technical: [
            "Machine Learning & AI",
            "Internet of Things (IoT)",
            "Cloud Computing",
            "Python Programming",
            "TensorFlow & PyTorch",
            "Data Analytics",
            "Distributed Systems",
            "Edge Computing"
        ],
        research: [
            "Research Design",
            "Statistical Analysis",
            "Grant Writing",
            "Academic Publishing",
            "Peer Review",
            "Conference Presentations"
        ],
        teaching: [
            "Curriculum Development",
            "Online Learning",
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

