// Academic CV Data - Easy to Edit
// To update your information, simply modify the values in this file.
// This file now contains BOTH English (en) and Arabic (ar) content.
// Publications are shared between languages (citations are not translated).

const academicData = {

    // ══════════════════════════════════════════════════════════
    //  ENGLISH CONTENT
    // ══════════════════════════════════════════════════════════
    en: {
        personal: {
            name: "Dr. Ameer Kadhim Hadi",
            title: "Assistant Professor",
            subtitle: "Cloud Computing, IoT & AI Expert",
            photo: "images/profile.jpg",
            bio: "Dedicated Assistant Professor with over 15 years of experience in tertiary education, specializing in Computer Science at the University of Babylon, Iraq. Proven track record in developing and delivering curriculum for undergraduate and postgraduate levels in Cloud Computing, IoT, Network Security, and Programming. Strong background in academic research with recent publications in AI and Blockchain technology. Committed to pedagogical excellence, student mentorship, and contributing to the academic mission through continuous professional development and collaborative research. Currently also lecturing on Artificial Intelligence and IT fundamentals within the Higher Diploma in Digital Leadership at the Higher Institute for Training and Qualifying Leaders in Baghdad, and teaching Cloud Computing and Virtual Networking to third-year Cybersecurity students at the University of Al-Shaab.",
            email: "ameer.hadi@uobabylon.edu.iq",
            linkedin: "https://linkedin.com/in/ameer-hadi",
            googleScholar: "https://scholar.google.com/citations?user=S9uqKsIAAAAJ&hl=en",
            researchGate: "https://www.researchgate.net/profile/Ameer-Kadhim-Hadi",
            orcid: "https://orcid.org/0000-0001-7234-8346"
        },

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

        projects: [
            {
                title: "AI-Assisted Digital Course Platform — Higher Institute for Training and Qualifying Leaders",
                description: "Built, with AI-assisted engineering (Claude), a full digital learning platform for the 'Artificial Intelligence for Administrative Leadership' course: interactive lecture pages, exams and quizzes, and automated results dashboards for the Higher Diploma in Digital Leadership program.",
                technologies: ["AI-Assisted Development", "Google Apps Script", "JavaScript", "Google Sheets", "E-Learning"],
                duration: "2025 – Present",
                funding: "Higher Institute for Training and Qualifying Leaders",
                status: "Ongoing",
                statusKey: "ongoing"
            },
            {
                title: "AI Innovation – Hydroponic Agriculture Device",
                description: "Award-winning project developing an AI-powered hydroponic agriculture monitoring and control device, recognized with the AI Innovation Award in 2024.",
                technologies: ["AI", "IoT", "Machine Learning", "Embedded Systems", "Agriculture Tech"],
                duration: "2023-2024",
                funding: "University of Babylon",
                status: "Completed",
                statusKey: "completed"
            },
            {
                title: "Blockchain Network Performance Optimization",
                description: "Research on optimizing blockchain network performance using the Blake3 Hash Function in Proof-of-Stake (POS) consensus algorithms, published in IEEE Access.",
                technologies: ["Blockchain", "POS Consensus", "Blake3", "Network Optimization", "Cryptography"],
                duration: "2024-2025",
                funding: "University Research",
                status: "Completed",
                statusKey: "completed"
            },
            {
                title: "IoT Smart Farm Monitoring System",
                description: "Development of an IoT-based system for real-time smart farm monitoring, integrating sensor networks and cloud data processing for agricultural applications.",
                technologies: ["IoT", "Cloud Computing", "Sensors", "Python", "Data Analytics"],
                duration: "2020-2021",
                funding: "College of IT, University of Babylon",
                status: "Completed",
                statusKey: "completed"
            },
            {
                title: "Cloud Telecollaboration Consultation and Diagnosis Framework",
                description: "Ph.D. dissertation project designing a cloud-based framework for remote telecollaboration, consultation, and diagnosis across distributed environments.",
                technologies: ["Cloud Computing", "Distributed Systems", "Networking", "Web Services"],
                duration: "2010-2015",
                funding: "University of Babylon",
                status: "Completed",
                statusKey: "completed"
            }
        ],

        courses: [
            { code: "HILQ", title: "Artificial Intelligence for Administrative Leadership", description: "Delivered within the Higher Diploma in Digital Leadership at the Higher Institute for Training and Qualifying Leaders — applied AI concepts and tools for public-sector leadership and decision-making.", level: "Professional Diploma", semester: "Higher Institute for Training and Qualifying Leaders · Current" },
            { code: "HILQ", title: "IT Fundamentals", description: "Core information technology concepts for senior public-sector leaders, delivered as part of the Higher Diploma program at the Higher Institute for Training and Qualifying Leaders.", level: "Professional Diploma", semester: "Higher Institute for Training and Qualifying Leaders · Current" },
            { code: "UOS", title: "Cloud Computing", description: "Cloud computing concepts and architectures for third-year Cybersecurity students.", level: "Undergraduate · Cybersecurity Dept.", semester: "University of Al-Shaab · Current" },
            { code: "UOS", title: "Virtual Networking", description: "Virtual networking concepts and technologies for third-year Cybersecurity students.", level: "Undergraduate · Cybersecurity Dept.", semester: "University of Al-Shaab · Current" },
            { code: "CS-PG", title: "Cloud Computing", description: "Postgraduate course covering cloud computing architectures, service models (IaaS, PaaS, SaaS), deployment strategies, and hands-on AWS cloud infrastructure.", level: "Postgraduate", semester: "Current" },
            { code: "CS-UG", title: "Internet of Things (IoT)", description: "Comprehensive coverage of IoT architectures, communication protocols, embedded systems, and real-world smart applications.", level: "Undergraduate", semester: "Current" },
            { code: "CS-UG", title: "Network Security", description: "Fundamentals and advanced topics in network security, including cryptography, firewalls, intrusion detection, and security protocols.", level: "Undergraduate", semester: "Current" },
            { code: "CS-UG", title: "Software Engineering", description: "Software development lifecycle, design patterns, agile methodologies, requirements engineering, and software quality assurance.", level: "Undergraduate", semester: "Current" },
            { code: "CS-UG", title: "Database Systems", description: "Relational database design, SQL, normalization, transaction management, and introduction to NoSQL databases.", level: "Undergraduate", semester: "Current" },
            { code: "CS-UG", title: "Computer Networking Principles", description: "Core networking concepts including TCP/IP, OSI model, routing protocols, and network administration.", level: "Undergraduate", semester: "Current" },
            { code: "CS-UG", title: "Programming (Python, C++, R, JavaScript)", description: "Multi-language programming instruction covering Python, C++, R, JavaScript, and VB.net with emphasis on practical problem-solving.", level: "Undergraduate", semester: "Current" }
        ],

        certifications: [
            { title: "AWS Academy Educator Certification", issuer: "Amazon Web Services", year: 2025 },
            { title: "AWS Academy Cloud Foundations", issuer: "Amazon Web Services", year: 2025 },
            { title: "Iraq E-Learning Professional Training (TOT)", issuer: "IREX", year: 2020 },
            { title: "Internet Computing Core (IC3) Instructor Certificate", issuer: "Certiport", year: 2010 },
            { title: "CCNA Exploration: Network Fundamentals", issuer: "Cisco", year: 2009 }
        ],

        awards: [
            { title: "AI Innovation Award for Hydroponic Agriculture Device", year: 2024 },
            { title: "Cloud Computing Ambassador Award", issuer: "AWS", year: 2020 },
            { title: "Science Day Award for Best Graduation Project", year: 2016 },
            { title: "Fulbright Scholarship", issuer: "U.S. Department of State", year: 2012 }
        ],

        skills: {
            technical: ["Deep Learning & Neural Networks", "Large Language Models (LLMs)", "Internet of Things (IoT)", "Cloud Computing (AWS)", "Blockchain Technology", "Edge Computing", "Python, R, C++, Go", "TensorFlow & PyTorch", "Hadoop, Spark, MapReduce", "Network Security"],
            research: ["Research Design", "Academic Publishing (IEEE, Journals)", "Grant Writing", "Peer Review", "Conference Presentations", "Student Research Supervision"],
            teaching: ["Curriculum Development", "Postgraduate Teaching", "E-Learning & Online Education", "Student Mentoring", "Assessment Design", "Educational Technology"]
        }
    },

    // ══════════════════════════════════════════════════════════
    //  ARABIC CONTENT — المحتوى بالعربية
    // ══════════════════════════════════════════════════════════
    ar: {
        personal: {
            name: "د. أمير كاظم هادي",
            title: "أستاذ مساعد",
            subtitle: "خبير في الحوسبة السحابية وإنترنت الأشياء والذكاء الاصطناعي",
            photo: "images/profile.jpg",
            bio: "أستاذ مساعد متميز يتمتع بخبرة تزيد عن 15 عامًا في التعليم العالي، متخصص في علوم الحاسوب في جامعة بابل، العراق. يمتلك سجلاً حافلاً في تطوير وتقديم المناهج الدراسية لمرحلتي البكالوريوس والدراسات العليا في مجالات الحوسبة السحابية، وإنترنت الأشياء، وأمن الشبكات، والبرمجة. لديه خلفية قوية في البحث العلمي مع نشر أبحاث حديثة في الذكاء الاصطناعي وتقنية البلوكتشين. ملتزم بالتميز التربوي، وتوجيه الطلبة، والمساهمة في الرسالة الأكاديمية من خلال التطوير المهني المستمر والبحث العلمي التعاوني. يُدرّس حاليًا أيضًا مادتي الذكاء الاصطناعي وأساسيات تكنولوجيا المعلومات ضمن الدبلوم العالي في القيادة الرقمية في المعهد العالي لتدريب وتأهيل القادة في بغداد، ويُدرّس مادتي الحوسبة السحابية والشبكات الافتراضية لطلبة المرحلة الثالثة قسم الأمن السيبراني في جامعة الشعب.",
            email: "ameer.hadi@uobabylon.edu.iq",
            linkedin: "https://linkedin.com/in/ameer-hadi",
            googleScholar: "https://scholar.google.com/citations?user=S9uqKsIAAAAJ&hl=en",
            researchGate: "https://www.researchgate.net/profile/Ameer-Kadhim-Hadi",
            orcid: "https://orcid.org/0000-0001-7234-8346"
        },

        education: [
            {
                degree: "دكتوراه في علوم الحاسوب",
                institution: "جامعة بابل، العراق",
                year: "2010 – 2015",
                dissertation: "إطار عمل سحابي للاستشارة والتشخيص عن بُعد (Cloud Telecollaboration)"
            },
            {
                degree: "ماجستير العلوم في علوم الحاسوب",
                institution: "الجامعة التكنولوجية، بغداد، العراق",
                year: "2004 – 2006",
                specialization: "أمن المعلومات"
            },
            {
                degree: "دبلوم عالٍ في علوم الحاسوب",
                institution: "معهد المعلوماتية للدراسات العليا (ICCI)، بغداد، العراق",
                year: "2002 – 2004",
                specialization: "أمن الشبكات"
            },
            {
                degree: "بكالوريوس العلوم في علوم الحاسوب",
                institution: "جامعة بابل، العراق",
                year: "1998 – 2002"
            }
        ],

        projects: [
            {
                title: "منصة تعليمية رقمية بمساعدة الذكاء الاصطناعي — المعهد العالي لتدريب وتأهيل القادة",
                description: "تطوير منصة تعلّم رقمية كاملة بمساعدة أدوات الذكاء الاصطناعي (Claude) لمادة \"الذكاء الاصطناعي للقيادة الإدارية\": صفحات محاضرات تفاعلية، اختبارات ومسابقات، ولوحات نتائج آلية ضمن برنامج الدبلوم العالي في القيادة الرقمية.",
                technologies: ["تطوير بمساعدة الذكاء الاصطناعي", "Google Apps Script", "JavaScript", "Google Sheets", "التعليم الإلكتروني"],
                duration: "2025 – حتى الآن",
                funding: "المعهد العالي لتدريب وتأهيل القادة",
                status: "قيد الاستمرار",
                statusKey: "ongoing"
            },
            {
                title: "الابتكار بالذكاء الاصطناعي – جهاز الزراعة المائية",
                description: "مشروع حائز على جائزة لتطوير جهاز ذكي لمراقبة والتحكم بالزراعة المائية باستخدام الذكاء الاصطناعي، حصل على جائزة الابتكار في الذكاء الاصطناعي عام 2024.",
                technologies: ["الذكاء الاصطناعي", "إنترنت الأشياء", "تعلم الآلة", "الأنظمة المدمجة", "تقنيات الزراعة"],
                duration: "2023-2024",
                funding: "جامعة بابل",
                status: "مكتمل",
                statusKey: "completed"
            },
            {
                title: "تحسين أداء شبكات البلوكتشين",
                description: "بحث في تحسين أداء شبكات البلوكتشين باستخدام دالة التجزئة Blake3 في خوارزميات توافق إثبات الحصة (POS)، نُشر في مجلة IEEE Access.",
                technologies: ["البلوكتشين", "توافق POS", "Blake3", "تحسين الشبكات", "التشفير"],
                duration: "2024-2025",
                funding: "بحث جامعي",
                status: "مكتمل",
                statusKey: "completed"
            },
            {
                title: "نظام مراقبة المزارع الذكية بإنترنت الأشياء",
                description: "تطوير نظام يعتمد على إنترنت الأشياء لمراقبة المزارع الذكية في الوقت الحقيقي، يدمج شبكات الاستشعار والمعالجة السحابية للبيانات في التطبيقات الزراعية.",
                technologies: ["إنترنت الأشياء", "الحوسبة السحابية", "المستشعرات", "بايثون", "تحليل البيانات"],
                duration: "2020-2021",
                funding: "كلية تكنولوجيا المعلومات، جامعة بابل",
                status: "مكتمل",
                statusKey: "completed"
            },
            {
                title: "إطار عمل سحابي للاستشارة والتشخيص عن بُعد",
                description: "مشروع أطروحة الدكتوراه لتصميم إطار عمل سحابي للاستشارة والتشخيص والتعاون عن بُعد ضمن بيئات موزعة.",
                technologies: ["الحوسبة السحابية", "الأنظمة الموزعة", "الشبكات", "خدمات الويب"],
                duration: "2010-2015",
                funding: "جامعة بابل",
                status: "مكتمل",
                statusKey: "completed"
            }
        ],

        courses: [
            { code: "HILQ", title: "الذكاء الاصطناعي للقيادة الإدارية", description: "تُدرَّس ضمن الدبلوم العالي في القيادة الرقمية في المعهد العالي لتدريب وتأهيل القادة — مفاهيم وأدوات الذكاء الاصطناعي التطبيقية لدعم القيادة واتخاذ القرار في القطاع العام.", level: "دبلوم مهني عالٍ", semester: "المعهد العالي لتدريب وتأهيل القادة · الحالي" },
            { code: "HILQ", title: "أساسيات تكنولوجيا المعلومات", description: "المفاهيم الأساسية لتكنولوجيا المعلومات لكبار القادة في القطاع العام، ضمن برنامج الدبلوم العالي في المعهد العالي لتدريب وتأهيل القادة.", level: "دبلوم مهني عالٍ", semester: "المعهد العالي لتدريب وتأهيل القادة · الحالي" },
            { code: "UOS", title: "الحوسبة السحابية", description: "مفاهيم وبنى الحوسبة السحابية لطلبة المرحلة الثالثة، قسم الأمن السيبراني.", level: "بكالوريوس · قسم الأمن السيبراني", semester: "جامعة الشعب · الحالي" },
            { code: "UOS", title: "الشبكات الافتراضية", description: "مفاهيم وتقنيات الشبكات الافتراضية لطلبة المرحلة الثالثة، قسم الأمن السيبراني.", level: "بكالوريوس · قسم الأمن السيبراني", semester: "جامعة الشعب · الحالي" },
            { code: "CS-PG", title: "الحوسبة السحابية", description: "مقرر دراسات عليا يغطي بنى الحوسبة السحابية، ونماذج الخدمة (IaaS, PaaS, SaaS)، واستراتيجيات النشر، والتطبيق العملي على بنية AWS السحابية.", level: "دراسات عليا", semester: "الحالي" },
            { code: "CS-UG", title: "إنترنت الأشياء (IoT)", description: "تغطية شاملة لبنى إنترنت الأشياء، وبروتوكولات الاتصال، والأنظمة المدمجة، والتطبيقات الذكية الواقعية.", level: "بكالوريوس", semester: "الحالي" },
            { code: "CS-UG", title: "أمن الشبكات", description: "أساسيات وموضوعات متقدمة في أمن الشبكات، تشمل التشفير، والجدران النارية، وأنظمة كشف التسلل، وبروتوكولات الأمان.", level: "بكالوريوس", semester: "الحالي" },
            { code: "CS-UG", title: "هندسة البرمجيات", description: "دورة حياة تطوير البرمجيات، وأنماط التصميم، والمنهجيات الرشيقة (Agile)، وهندسة المتطلبات، وضمان جودة البرمجيات.", level: "بكالوريوس", semester: "الحالي" },
            { code: "CS-UG", title: "نظم قواعد البيانات", description: "تصميم قواعد البيانات العلائقية، ولغة SQL، والتسوية (Normalization)، وإدارة المعاملات، ومدخل إلى قواعد بيانات NoSQL.", level: "بكالوريوس", semester: "الحالي" },
            { code: "CS-UG", title: "مبادئ شبكات الحاسوب", description: "المفاهيم الأساسية للشبكات مثل TCP/IP، ونموذج OSI، وبروتوكولات التوجيه، وإدارة الشبكات.", level: "بكالوريوس", semester: "الحالي" },
            { code: "CS-UG", title: "البرمجة (Python, C++, R, JavaScript)", description: "تدريس متعدد اللغات يشمل Python وC++ وR وJavaScript وVB.net مع التركيز على حل المشكلات العملية.", level: "بكالوريوس", semester: "الحالي" }
        ],

        certifications: [
            { title: "شهادة معتمد مدرّس أكاديمية AWS", issuer: "أمازون لخدمات الويب (AWS)", year: 2025 },
            { title: "شهادة AWS Academy Cloud Foundations", issuer: "أمازون لخدمات الويب (AWS)", year: 2025 },
            { title: "تدريب محترفي التعليم الإلكتروني في العراق (TOT)", issuer: "IREX", year: 2020 },
            { title: "شهادة مدرّب أساسيات الحوسبة (IC3)", issuer: "Certiport", year: 2010 },
            { title: "CCNA Exploration: أساسيات الشبكات", issuer: "Cisco", year: 2009 }
        ],

        awards: [
            { title: "جائزة الابتكار بالذكاء الاصطناعي لجهاز الزراعة المائية", year: 2024 },
            { title: "جائزة سفير الحوسبة السحابية", issuer: "AWS", year: 2020 },
            { title: "جائزة يوم العلم لأفضل مشروع تخرج", year: 2016 },
            { title: "منحة فولبرايت", issuer: "وزارة الخارجية الأمريكية", year: 2012 }
        ],

        skills: {
            technical: ["التعلم العميق والشبكات العصبية", "نماذج اللغة الكبيرة (LLMs)", "إنترنت الأشياء (IoT)", "الحوسبة السحابية (AWS)", "تقنية البلوكتشين", "الحوسبة الطرفية (Edge Computing)", "Python, R, C++, Go", "TensorFlow و PyTorch", "Hadoop, Spark, MapReduce", "أمن الشبكات"],
            research: ["تصميم البحوث", "النشر العلمي (IEEE، المجلات)", "كتابة طلبات التمويل", "التحكيم العلمي", "العروض في المؤتمرات", "الإشراف على بحوث الطلبة"],
            teaching: ["تطوير المناهج", "تعليم الدراسات العليا", "التعليم الإلكتروني عن بُعد", "توجيه الطلبة", "تصميم التقييمات", "التقنيات التعليمية"]
        }
    },

    // ══════════════════════════════════════════════════════════
    //  PUBLICATIONS — shared across languages (citations are not translated)
    // ══════════════════════════════════════════════════════════
    publications: [
        { title: "Large Language Models and Hybrid Prompt Engineering for Emotional Text Steganography Based on Cloud", authors: "AK Hadi", venue: "New Trends in Information and Communications Technology Applications (NTICT 2025), Springer CCIS, pp. 438–463", year: 2025, citations: 0, type: "conference", link: "#" },
        { title: "Optimizing Blockchain Network Performance Using Blake3 Hash Function in POS Consensus Algorithm", authors: "ZA Jasim, AK Hadi", venue: "IEEE Access, vol. 13, pp. 44760–44774", year: 2025, citations: 7, type: "journal", link: "https://ieeexplore.ieee.org/document/10908216/" },
        { title: "Deep Learning System for Network Anomaly Detection based Attention Mechanism and Sparse Autoencoder", authors: "FH Jassim, AK Hadi", venue: "2025 5th International Conference of Science and Information Technology in Smart Administration (ICITSA)", year: 2025, citations: 0, type: "conference", link: "#" },
        { title: "Hybrid Deep Learning Approach for Enhancing Network Security and Traffic Management", authors: "FH Jassim, AK Hadi", venue: "2025 3rd International Conference on Business Analytics for Technology and Security (ICBATS)", year: 2025, citations: 0, type: "conference", link: "#" },
        { title: "Study on Blockchain Scalability Methods Limitation and Solution", authors: "AK Hadi, ZA Jasim", venue: "2023 International Conference on Engineering, Science and Advanced Technology (ICESAT)", year: 2023, citations: 2, type: "conference", link: "#" },
        { title: "The Effectiveness of Teaching with Augmented Reality Technology on Developing Visual Intelligence Skills among College of Basic Education Students", authors: "AA Alwan AL-Qaraghooli, MM Abbas AL-Khateeb, AK Hadi", venue: "Journal of Babylon Center for Humanities Studies, vol. 12, no. 4", year: 2022, citations: 0, type: "journal", link: "#" },
        { title: "The Impact of An Instructional Program Based on Augmented Reality Technology on Basic Education College Students' Achievement in Reading Comprehension Course", authors: "AAA AL-Qaraghooli, MMA AL-Khateeb, AK Hadi", venue: "Basic Education College Magazine For Educational and Humanities Sciences, vol. 14, no. 55", year: 2022, citations: 0, type: "journal", link: "#" },
        { title: "A Proposed Methodology to Use a Blockchain in Supply Chain Traceability", authors: "AK Hadi, S Salem", venue: "2021 4th International Iraqi Conference on Engineering Technology and Their Applications (IICETA)", year: 2021, citations: 7, type: "conference", link: "#" },
        { title: "Classifying Quality of Web Services Using Machine Learning Classification and Cross Validation Techniques", authors: "NAHH Olewy, AK Hadi", venue: "2021 2nd Information Technology To Enhance e-Learning and Other Application (IT-ELA)", year: 2021, citations: 4, type: "conference", link: "#" },
        { title: "IoT Based Covered Agriculture Monitoring and Control System with Smart Sensing and Forwarding Algorithm", authors: "HS Hassan, AK Hadi", venue: "Turkish Journal of Computer and Mathematics Education, vol. 12, no. 11, pp. 6311–6316", year: 2021, citations: 2, type: "journal", link: "#" },
        { title: "Multiclass Model for Quality of Service Using Machine Learning and Cloud Computing", authors: "NAHH Olewy, AK Hadi", venue: "2021 7th International Conference on Contemporary Information Technology and Mathematics (ICCITM)", year: 2021, citations: 0, type: "conference", link: "#" },
        { title: "Design a Tracing System for a Seed Supply Chain Based on Blockchain", authors: "AB Abdulhussein, AK Hadi, M Ilyas", venue: "2020 3rd International Conference on Engineering Technology and its Applications (IICETA)", year: 2020, citations: 21, type: "conference", link: "#" },
        { title: "Secure Multi Functional Robot Based on Cloud Computing", authors: "AK Hadi", venue: "Journal of Computational and Theoretical Nanoscience, vol. 16, no. 3, pp. 880–888", year: 2019, citations: 1, type: "journal", link: "#" },
        { title: "Toward Trust and More Characters of Arabic Short Message Service using Encryption", authors: "AK Hadi", venue: "Journal of Engineering and Applied Sciences, vol. 12, no. 21, pp. 5384–5387", year: 2017, citations: 2, type: "journal", link: "#" },
        { title: "Collaborative Computer Aid Diagnosis Framework in Cloud Environment based on Multi Agents Systems", authors: "AM Al-Bakry, AK Hadi", venue: "International Journal of Advanced Engineering Technology, vol. 7, no. 1, p. 21", year: 2014, citations: 1, type: "journal", link: "#" },
        { title: "Building the Primes P&Q (Of the Public Key Algorithm) by Using Function of Reals", authors: "F Al Mamory, AK Hadi, ALS Ahmed", venue: "Journal (details to be added)", year: 2014, citations: 0, type: "journal", link: "#" }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = academicData;
}
