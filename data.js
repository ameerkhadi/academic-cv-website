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
            bio: "Dedicated Assistant Professor with over 18 years of experience in tertiary education. Currently lecturing on Artificial Intelligence and IT fundamentals within the Higher Diploma in Digital Leadership at the Higher Institute for Training and Qualifying Leaders in Baghdad, specializing in Computer Science at the University of Babylon, Iraq, teaching Cloud Computing Security to fourth-year Cyber Security Engineering students at the University of Al-Shaab, and Group Project I to third-year students at the University of Babylon. Founder of two technology companies: Rafid (IoT and edge sensing for water, agriculture and energy) and Dubsar (AI assistants and automation), which presented at INTF 2026 in Baghdad. Project manager of «Let It Talk», a non-profit student project that turns the Iraqi intermediate physics book into an interactive, talking book with 3D virtual labs. Served as Director of the Skills Development Center at the University of Babylon for six years, and as Director of the Electronic Computer Center there for three years. Proven track record in developing and delivering curriculum for undergraduate and postgraduate levels in Cloud Computing, IoT, Network Security, and Programming. Strong background in academic research with recent publications in AI and Blockchain technology, with projects centred on building platforms powered by AI agents. A graduate of the Fulbright Visiting Scholar Program at Kent State University, Ohio, United States, College of Science and Technology, with a research fellowship at the University of Reading, United Kingdom, and training in Employment and Social Affairs through The Hague (Netherlands) and Tunisia partnership programme. Formerly a Monitoring and Evaluation Officer with International Relief and Development (IRD), and served as a trainer with the Danish Refugee Council (DRC) in a workshop on artificial intelligence and cybersecurity, contributing to strengthening social cohesion. Committed to pedagogical excellence, student mentorship, and contributing to the academic mission through continuous professional development and collaborative research.",
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
                title: "Let It Talk — Interactive & 3D Physics Book (Non-Profit Student Project)",
                description: "Project manager of a volunteer, non-profit project in which eight student teams use AI to turn the Iraqi 3rd-intermediate physics book (176 pages) into an interactive, talking book: verbatim book text, read-aloud, live simulations and self-tests. Phase 2 adds 3D virtual labs: the real book opens on a desk and its figures lead into realistic labs (the electroscope; Ohm's law with student-wired circuits and failure scenarios). Live at ameer.itbabylon.org/talk3d/.",
                technologies: ["Three.js", "WebGL", "AI-Assisted Development", "Educational Simulation", "Project Management"],
                duration: "2026 – Present",
                funding: "Volunteer / non-profit",
                status: "Ongoing",
                statusKey: "ongoing"
            },
            {
                title: "Rafid — IoT & Edge Sensing Company",
                description: "Founded Rafid: solar-powered field sensors, an edge gateway that keeps working offline, and multilingual dashboards for irrigation, water, cold chain and energy, with an AI assistant (Enki). Presented at the INTF 2026 B2B meetings in Baghdad, leading to pilot discussions with international organisations. ameer.itbabylon.org/rafid/",
                technologies: ["IoT", "Edge Computing", "Raspberry Pi", "Node.js", "AI Assistant"],
                duration: "2026 – Present",
                funding: "Founder",
                status: "Ongoing",
                statusKey: "ongoing"
            },
            {
                title: "Dubsar — AI Assistants & Automation Company",
                description: "Founded Dubsar: AI assistants that answer from an organisation's own documents, and MCP-based agents that connect AI to email, files and work systems; multilingual site with its own assistant (Nabu). Presented at INTF 2026 in Baghdad. ameer.itbabylon.org/dubsar/",
                technologies: ["LLMs", "RAG", "Model Context Protocol (MCP)", "Automation"],
                duration: "2026 – Present",
                funding: "Founder",
                status: "Ongoing",
                statusKey: "ongoing"
            },
            {
                title: "Mesopotamian Marshes Observatory & Water-Balance Calculator",
                description: "Arabic observatory using real evaporation, rainfall and dust data from open climate models, a live Raspberry Pi test station and a labelled simulated salinity network; plus a water-balance calculator (ERA5 data 2021–2025) presented at the expert workshop on the Mesopotamian marshes, Al-Alamein Centre, Baghdad (Oct 2026).",
                technologies: ["Climate Data (ERA5)", "IoT", "Leaflet", "Data Visualization"],
                duration: "2026",
                funding: "Independent",
                status: "Ongoing",
                statusKey: "ongoing"
            },
            {
                title: "Edge QoS Observatory & Iraqi Sensors Platform",
                description: "Live platforms measuring network latency from Babylon to Gulf and European clouds with robust anomaly detection, a DNN split advisor (device / edge / cloud), and a ThingSpeak-style IoT API with an edge layer fed by a real Raspberry Pi.",
                technologies: ["Anomaly Detection", "Edge Computing", "IoT", "Node.js"],
                duration: "2026 – Present",
                funding: "Independent",
                status: "Ongoing",
                statusKey: "ongoing"
            },
            {
                title: "Self-Hosted Teaching Platforms",
                description: "Course platform with an AI student assistant (RAG over course files), multi-lecturer QR attendance, live Arabic polling (Tafa'ul Live), online hall exams, voiced self-drawing blackboard videos and 3D incident simulations, used weekly at the University of Babylon and Al-Shaab University.",
                technologies: ["Node.js", "WebSockets", "RAG", "Three.js", "E-Learning"],
                duration: "2026 – Present",
                funding: "Independent",
                status: "Ongoing",
                statusKey: "ongoing"
            },
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
            { code: "UOS", title: "Cloud Computing Security", description: "15-week theory and lab course on cloud security: IAM and least privilege, governance, risk and compliance, network and data protection, with 3D incident simulations.", level: "Undergraduate · Cyber Security Engineering, 4th year", semester: "University of Al-Shaab · Current" },
            { code: "UOB", title: "Group Project I", description: "Team projects from idea to working prototype: requirements, apps built from documents, and IoT systems prototyped in the Wokwi simulator.", level: "Undergraduate · 3rd year", semester: "University of Babylon · Current" },
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
            { title: "Fulbright Visiting Scholar Program", issuer: "Kent State University, Ohio, USA — U.S. Dept. of State", year: 2012 }
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
            bio: "أستاذ مساعد متميز يتمتع بخبرة تزيد عن 18 عامًا في التعليم العالي. يُدرّس حاليًا مادتي الذكاء الاصطناعي وأساسيات تكنولوجيا المعلومات ضمن الدبلوم العالي في القيادة الرقمية في المعهد العالي لإعداد وتأهيل القادة في بغداد، وهو متخصص في علوم الحاسوب في جامعة بابل، العراق، ويُدرّس مادة أمن الحوسبة السحابية لطلبة المرحلة الرابعة في هندسة الأمن السيبراني في جامعة الشعب، ومادة المشروع الجماعي لطلبة المرحلة الثالثة في جامعة بابل. مؤسس شركتين تقنيتين: رافد (إنترنت الأشياء والحساسات الطرفية للمياه والزراعة والطاقة) ودُبسار (المساعدات الذكية والأتمتة)، وقد شاركتا في معرض INTF 2026 في بغداد. ومدير مشروع «الكتاب يحچي»، وهو مشروع طلابي غير ربحي يحوّل كتاب الفيزياء للمرحلة المتوسطة إلى كتاب تفاعلي يتكلّم مع مختبرات افتراضية ثلاثية الأبعاد. شغل منصب مدير مركز تطوير المهارات في جامعة بابل لمدة ست سنوات، ومدير مركز الحاسبة الإلكترونية فيها لمدة ثلاث سنوات. يمتلك سجلاً حافلاً في تطوير وتقديم المناهج الدراسية لمرحلتي البكالوريوس والدراسات العليا في مجالات الحوسبة السحابية، وإنترنت الأشياء، وأمن الشبكات، والبرمجة. لديه خلفية قوية في البحث العلمي مع نشر أبحاث حديثة في الذكاء الاصطناعي وتقنية البلوكتشين، وتتركّز مشاريعه على بناء منصّات مدعومة بالوكيل الذكي. خريج برنامج فولبرايت للأستاذ الزائر — جامعة كنت ستيت، أوهايو، الولايات المتحدة الأمريكية، كلية العلوم والتكنولوجيا، وحصل على زمالة بحثية في جامعة ريدنغ، المملكة المتحدة، وتدرّب ضمن برنامج شراكة لاهاي (هولندا) وتونس على التوظيف والشؤون الاجتماعية. وعمل موظفًا للتقييم والمتابعة في منظمة الإغاثة والتنمية الدولية (IRD)، وشارك مدرّبًا مع المجلس الدنماركي للاجئين (DRC) في ورشة عن الذكاء الاصطناعي والأمن السيبراني، مساهمًا في تعزيز التماسك المجتمعي. ملتزم بالتميز التربوي، وتوجيه الطلبة، والمساهمة في الرسالة الأكاديمية من خلال التطوير المهني المستمر والبحث العلمي التعاوني.",
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
                title: "الكتاب يحچي — كتاب فيزياء تفاعلي وثلاثي الأبعاد (مشروع طلابي غير ربحي)",
                description: "مدير مشروع تطوعي غير ربحي تستعمل فيه ثمانية فرق طلابية الذكاء الاصطناعي لتحويل كتاب الفيزياء للصف الثالث المتوسط (176 صفحة) إلى كتاب تفاعلي يتكلّم: نص الكتاب كما هو، وقراءة صوتية، ومحاكاة حيّة، واختبارات ذاتية. وتضيف المرحلة الثانية مختبرات افتراضية ثلاثية الأبعاد: الكتاب الحقيقي ينفتح على الطاولة وتقود أشكاله إلى مختبرات واقعية (الكشاف الكهربائي، وقانون أوم بدائرة يوصلها الطالب مع سيناريوهات الخطأ). متاح على ameer.itbabylon.org/talk3d/.",
                technologies: ["Three.js", "WebGL", "تطوير بمساعدة الذكاء الاصطناعي", "المحاكاة التعليمية", "إدارة المشاريع"],
                duration: "2026 – حتى الآن",
                funding: "تطوعي / غير ربحي",
                status: "قيد الاستمرار",
                statusKey: "ongoing"
            },
            {
                title: "رافد — شركة إنترنت الأشياء والحساسات الطرفية",
                description: "تأسيس شركة رافد: حساسات حقلية تعمل بالطاقة الشمسية، وبوابة طرفية تستمر بالعمل دون إنترنت، ولوحات بعدة لغات للري والمياه وسلسلة التبريد والطاقة، مع مساعد ذكي (إنكي). شاركت في لقاءات الأعمال في معرض INTF 2026 في بغداد، وأدت إلى نقاشات لمشاريع تجريبية مع منظمات دولية. ameer.itbabylon.org/rafid/",
                technologies: ["إنترنت الأشياء", "الحوسبة الطرفية", "Raspberry Pi", "Node.js", "مساعد ذكي"],
                duration: "2026 – حتى الآن",
                funding: "مؤسس",
                status: "قيد الاستمرار",
                statusKey: "ongoing"
            },
            {
                title: "دُبسار — شركة المساعدات الذكية والأتمتة",
                description: "تأسيس شركة دُبسار: مساعدات ذكية تجيب من وثائق المؤسسة نفسها، ووكلاء مبنيون على بروتوكول MCP يربطون الذكاء الاصطناعي بالبريد والملفات وأنظمة العمل، وموقع بعدة لغات مع مساعده الخاص (نابو). شاركت في معرض INTF 2026 في بغداد. ameer.itbabylon.org/dubsar/",
                technologies: ["نماذج اللغة الكبيرة", "RAG", "بروتوكول MCP", "الأتمتة"],
                duration: "2026 – حتى الآن",
                funding: "مؤسس",
                status: "قيد الاستمرار",
                statusKey: "ongoing"
            },
            {
                title: "مرصد الأهوار العراقية وحاسبة الموازنة المائية",
                description: "مرصد عربي يعتمد بيانات حقيقية للتبخر والأمطار والغبار من نماذج مناخية مفتوحة، ومحطة اختبار حيّة بجهاز Raspberry Pi، وشبكة ملوحة محاكاة مُعلَّمة بذلك؛ مع حاسبة للموازنة المائية (بيانات ERA5 للأعوام 2021–2025) عُرضت في ورشة الخبراء عن الأهوار العراقية في مركز العلمين، بغداد (تشرين الأول 2026).",
                technologies: ["بيانات المناخ (ERA5)", "إنترنت الأشياء", "Leaflet", "تصوير البيانات"],
                duration: "2026",
                funding: "مستقل",
                status: "قيد الاستمرار",
                statusKey: "ongoing"
            },
            {
                title: "مرصد جودة الشبكة الطرفي ومنصة الحساسات العراقية",
                description: "منصات حيّة تقيس زمن استجابة الشبكة من بابل إلى سحابات الخليج وأوروبا مع كشف الحالات الشاذة، ومستشار لتقسيم الشبكات العصبية (جهاز / طرف / سحابة)، وواجهة برمجية لإنترنت الأشياء بطبقة طرفية يغذيها جهاز Raspberry Pi حقيقي.",
                technologies: ["كشف الحالات الشاذة", "الحوسبة الطرفية", "إنترنت الأشياء", "Node.js"],
                duration: "2026 – حتى الآن",
                funding: "مستقل",
                status: "قيد الاستمرار",
                statusKey: "ongoing"
            },
            {
                title: "منصات تدريس على خوادم ذاتية",
                description: "منصة مقررات فيها مساعد ذكي للطلبة يجيب من ملفات المادة، وحضور بالـ QR لعدة أساتذة، واستطلاعات مباشرة بالعربية (تفاعل لايف)، وامتحانات إلكترونية في القاعة، وفيديوهات سبورة ترسم نفسها بصوت عراقي، ومحاكاة ثلاثية الأبعاد للحوادث، تُستعمل أسبوعيًا في جامعة بابل وجامعة الشعب.",
                technologies: ["Node.js", "WebSockets", "RAG", "Three.js", "التعليم الإلكتروني"],
                duration: "2026 – حتى الآن",
                funding: "مستقل",
                status: "قيد الاستمرار",
                statusKey: "ongoing"
            },
            {
                title: "منصة تعليمية رقمية بمساعدة الذكاء الاصطناعي — المعهد العالي لإعداد وتأهيل القادة",
                description: "تطوير منصة تعلّم رقمية كاملة بمساعدة أدوات الذكاء الاصطناعي (Claude) لمادة \"الذكاء الاصطناعي للقيادة الإدارية\": صفحات محاضرات تفاعلية، اختبارات ومسابقات، ولوحات نتائج آلية ضمن برنامج الدبلوم العالي في القيادة الرقمية.",
                technologies: ["تطوير بمساعدة الذكاء الاصطناعي", "Google Apps Script", "JavaScript", "Google Sheets", "التعليم الإلكتروني"],
                duration: "2025 – حتى الآن",
                funding: "المعهد العالي لإعداد وتأهيل القادة",
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
            { code: "UOS", title: "أمن الحوسبة السحابية", description: "مقرر نظري وعملي من 15 أسبوعًا في أمن السحابة: إدارة الهوية وأقل الصلاحيات، والحوكمة والمخاطر والامتثال، وحماية الشبكات والبيانات، مع محاكاة ثلاثية الأبعاد للحوادث.", level: "بكالوريوس · هندسة الأمن السيبراني، المرحلة الرابعة", semester: "جامعة الشعب · الحالي" },
            { code: "UOB", title: "المشروع الجماعي I", description: "مشاريع فرق من الفكرة إلى نموذج يعمل: المتطلبات، وتطبيقات تُبنى من الوثائق، وأنظمة إنترنت أشياء تُجرَّب في محاكي Wokwi.", level: "بكالوريوس · المرحلة الثالثة", semester: "جامعة بابل · الحالي" },
            { code: "HILQ", title: "الذكاء الاصطناعي للقيادة الإدارية", description: "تُدرَّس ضمن الدبلوم العالي في القيادة الرقمية في المعهد العالي لإعداد وتأهيل القادة — مفاهيم وأدوات الذكاء الاصطناعي التطبيقية لدعم القيادة واتخاذ القرار في القطاع العام.", level: "دبلوم مهني عالٍ", semester: "المعهد العالي لإعداد وتأهيل القادة · الحالي" },
            { code: "HILQ", title: "أساسيات تكنولوجيا المعلومات", description: "المفاهيم الأساسية لتكنولوجيا المعلومات لكبار القادة في القطاع العام، ضمن برنامج الدبلوم العالي في المعهد العالي لإعداد وتأهيل القادة.", level: "دبلوم مهني عالٍ", semester: "المعهد العالي لإعداد وتأهيل القادة · الحالي" },
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
            { title: "برنامج فولبرايت للأستاذ الزائر", issuer: "جامعة كنت ستيت، أوهايو، الولايات المتحدة الأمريكية — وزارة الخارجية الأمريكية", year: 2012 }
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
