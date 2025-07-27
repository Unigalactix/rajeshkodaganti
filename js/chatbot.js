// PAM-Bot - Personal Portfolio Chatbot (Inspired by PAM from The Office)
// Version 2.0 - Fixed all K-RU-RA references, now fully PAM personality
// If you see old bot messages, clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
class RajeshBot {
    constructor() {
        this.initializeBot();
        this.setupEventListeners();
        this.knowledgeBase = this.createKnowledgeBase();
        this.pamPersonality = this.createPamPersonality();
        this.conversationCount = 0;
        
        // Debug: Verify PAM personality is loaded
        console.log('PAM Bot initialized with greetings:', this.pamPersonality.greetings[0]);
    }

    initializeBot() {
        this.chatbotModal = document.getElementById('chatbotModal');
        this.chatbotButton = document.getElementById('floatingChatbotBtn');
        this.closeChatbot = document.getElementById('closeChatbot');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendMessage');
        
        this.conversationHistory = [];
        this.isTyping = false;
    }

    createKnowledgeBase() {
        return {
            personal: {
                name: "Rajesh Kodaganti",
                title: "Master's Student in Computer Engineering | Software Intern",
                status: "Open to Work",
                specializations: ["Machine Learning", "Data Engineering", "Cybersecurity", "Software Development"],
                location: "California State University, Northridge",
                currentRole: "Software Intern at Quadrant Technologies",
                careerObjective: "Seeking opportunities in Machine Learning Engineering, Data Science, Software Development, and Cybersecurity roles"
            },
            
            education: [
                {
                    degree: "Master of Science - Computer Engineering",
                    institution: "California State University, Northridge",
                    duration: "Aug 2022 - May 2025",
                    focus: "Advanced ML, Data Engineering & Cybersecurity"
                },
                {
                    degree: "B-Tech in ECE - Electronics & Communication",
                    institution: "JB Institute Of Engineering and Technology",
                    duration: "July 2019 - June 2022",
                    focus: "Electronics and Communication Engineering"
                },
                {
                    degree: "Diploma in Electronics & Communication Engineering",
                    institution: "Vignan Institute of Technology and Science",
                    duration: "June 2016 - May 2019",
                    focus: "Electronics fundamentals and practical applications"
                }
            ],

            experience: [
                {
                    company: "Quadrant Technologies",
                    position: "Software Intern",
                    duration: "July 2025 – Present",
                    description: "Cybersecurity & AI applications development",
                    responsibilities: [
                        "Developing AI-powered cybersecurity solutions",
                        "Working on threat detection algorithms",
                        "Implementing machine learning models for security analytics"
                    ]
                },
                {
                    company: "QikCell by tickioT",
                    position: "Solutions Engineer (Internship)",
                    duration: "January 2025 – May 2025",
                    description: "Technical demonstrations & client solutions",
                    responsibilities: [
                        "Conducted technical product demonstrations",
                        "Developed client-specific solutions",
                        "Collaborated with engineering teams on product improvements"
                    ]
                },
                {
                    company: "ColorOS (OPPO)",
                    position: "User Test Specialist (Freelance)",
                    duration: "June 2018 – July 2022",
                    description: "Beta testing & user experience optimization",
                    responsibilities: [
                        "Conducted comprehensive user testing",
                        "Provided detailed feedback on UI/UX improvements",
                        "Participated in beta testing programs for mobile OS features"
                    ]
                },
                {
                    company: "Pantech ProEd Pvt Ltd",
                    position: "Engineering Intern",
                    duration: "June 2020 – July 2020",
                    description: "64-bit binary comparator development",
                    responsibilities: [
                        "Developed 64-bit binary comparator circuits",
                        "Worked on digital logic design projects",
                        "Gained hands-on experience with VHDL programming"
                    ]
                },
                {
                    company: "PeopleLink Unified Communications",
                    position: "Product Tester - R&D Department",
                    duration: "June 2018 – May 2019",
                    description: "Product evaluation & quality assurance",
                    responsibilities: [
                        "Performed product testing and quality assurance",
                        "Documented testing procedures and results",
                        "Collaborated with R&D teams on product improvements"
                    ]
                }
            ],

            skills: {
                "Programming Languages": ["Python", "R Programming", "Java", "C++", "JavaScript", "HTML", "CSS", "SQL", "VHDL", "Assembly Language"],
                "Frameworks & Libraries": ["TensorFlow", "PyTorch", "Keras", "Scikit-Learn", "Pandas", "NumPy", "OpenCV", "React", "Node.js"],
                "Machine Learning & AI": ["Deep Learning", "Neural Networks", "Computer Vision", "Natural Language Processing", "Data Mining", "Predictive Analytics"],
                "Data & Analytics": ["Data Analysis", "Data Visualization", "Statistical Analysis", "Big Data Processing", "ETL Pipelines", "Apache Kafka", "Apache Spark"],
                "Cloud & DevOps": ["Amazon Web Services (AWS)", "Microsoft Azure", "Docker", "Kubernetes", "CI/CD", "Git Version Control"],
                "Cybersecurity": ["Network Security", "Information Security", "Threat Intelligence", "Vulnerability Assessment", "Security Monitoring"],
                "Database & Systems": ["MySQL", "PostgreSQL", "MongoDB", "Linux/Unix", "Windows Server", "System Administration"],
                "Electronics & Communication": ["Digital Signal Processing", "Antenna Theory and Design", "Mobile Technology", "RF Engineering", "Communication Systems"],
                "Tools & Software": ["Microsoft Office", "MATLAB", "Simulink", "AutoCAD", "Proteus", "Multisim"]
            },

            projects: [
                {
                    title: "Image Denoising using Deep Learning",
                    category: "Machine Learning • Computer Vision",
                    description: "Advanced deep learning project focused on removing noise from digital images using convolutional neural networks (CNNs). Implemented multiple denoising architectures including autoencoders and residual networks to achieve superior image quality restoration.",
                    technologies: ["Python", "TensorFlow/Keras", "OpenCV", "NumPy", "Deep Learning"],
                    achievements: [
                        "15% improvement in PSNR over traditional methods",
                        "Optimized model performance for real-time applications",
                        "Comprehensive evaluation using PSNR and SSIM metrics"
                    ]
                },
                {
                    title: "Pre-owned Cars Pricing Forecast",
                    category: "Data Science • Predictive Analytics",
                    description: "Comprehensive data analytics project predicting used car prices using advanced machine learning algorithms in R. Developed multiple regression models with extensive feature engineering and model validation techniques.",
                    technologies: ["R Programming", "RStudio", "ggplot2", "Random Forest", "Machine Learning"],
                    achievements: [
                        "92% prediction accuracy achieved",
                        "25% reduction in pricing error margin",
                        "Comprehensive data visualization dashboard"
                    ]
                },
                {
                    title: "ColorOS Mobile Interface Enhancement",
                    category: "UI/UX Design • Mobile Development",
                    description: "Professional freelance project involving user interface design and optimization for ColorOS mobile operating system. Focused on improving user experience through intuitive design patterns and performance optimization.",
                    technologies: ["UI/UX Design", "Mobile Development", "User Testing", "Prototyping", "Android"],
                    achievements: [
                        "30% enhancement in user engagement",
                        "Improved interface responsiveness",
                        "Streamlined navigation flow design"
                    ]
                }
            ],

            certifications: [
                {
                    category: "AI & Machine Learning",
                    certs: [
                        "AI Pair Programming with GitHub Copilot (Jul 2025)",
                        "Advanced Prompt Engineering Techniques (Jul 2025)",
                        "AI Foundations: Machine Learning (Jul 2025)",
                        "Building Deep Learning Applications with Keras (Jul 2025)",
                        "Neural Networks & CNN Essential Training (Jul 2025)",
                        "PyTorch Essential Training: Deep Learning (Jul 2025)",
                        "Machine Learning with Scikit-Learn (Jul 2025)",
                        "Supervised Learning Essential Training (Jul 2025)",
                        "TensorFlow: Model Construction & Optimization (Jul 2025)"
                    ]
                },
                {
                    category: "Microsoft Azure & Cloud",
                    certs: [
                        "Building AI-Ready Apps with Azure Databases (Jul 2025)",
                        "Foundations of Azure AI: Concepts & Implementation (Jul 2025)",
                        "Microsoft Azure AI Essentials Professional Certificate (Jul 2025)",
                        "Azure AI Essentials: ML Workloads on Azure (Jul 2025)",
                        "Learning Azure SQL Querying (Jul 2025)",
                        "Introduction to Microsoft Fabric (Jul 2025)",
                        "Learning Microsoft Fabric (Jul 2025)"
                    ]
                },
                {
                    category: "GitHub & Development Tools",
                    certs: [
                        "Career Essentials in GitHub Copilot Professional Certificate (Jul 2025)",
                        "Refactoring with GitHub Copilot (Jul 2025)",
                        "Responsible GitHub Copilot: Reliable Code Ethically (Jul 2025)",
                        "Supercharge Development with GitHub Extensions (Jul 2025)",
                        "Docker Foundations Professional Certificate (Jul 2025)",
                        "Docker: Your First Project (Jul 2025)",
                        "Learning Docker (Jul 2025)",
                        "Learning Docker Compose (Jul 2025)"
                    ]
                },
                {
                    category: "Programming & Data Science",
                    certs: [
                        "Intermediate Python for Non-Programmers (Jul 2025)",
                        "Python for Non-Programmers (Jun 2025)",
                        "Programming Concepts for Python (Jul 2025)",
                        "Learning Data Visualization (Jul 2025)",
                        "Statistics Foundations 3: Using Data Sets (Jul 2025)"
                    ]
                },
                {
                    category: "Sustainability & Professional",
                    certs: [
                        "Career Essentials in Sustainable Tech by Microsoft (Sep 2024)"
                    ]
                }
            ],

            contact: {
                email: "Available on request",
                location: "California, USA",
                linkedin: "Available in portfolio",
                github: "Available in portfolio",
                availability: "Open to Work - Immediate availability"
            }
        };
    }

    createPamPersonality() {
        return {
            greetings: [
                "Hi there! I'm PAM, Rajesh's portfolio assistant. Welcome to Dunder Mifflin Scranton... I mean, Rajesh's portfolio! How can I help you today?",
                "Oh hi! I'm PAM, and I'd be happy to tell you about Rajesh's work experience. He's actually quite impressive - not like some of the people I've worked with... *cough* Ryan *cough*",
                "Hello! PAM here - I've organized all of Rajesh's information for you. I'm really good at organizing things, unlike my old boss Michael who once tried to file bankruptcy by just shouting 'I DECLARE BANKRUPTCY!'",
                "Hey! I'm PAM, your friendly portfolio receptionist. Rajesh asked me to help answer questions about his work. I promise I'm more reliable than the Dunder Mifflin phone system!"
            ],
            
            professionalResponses: [
                "Well, Rajesh is actually quite accomplished! Unlike Kevin from my old office who thought M&Ms were a food group...",
                "I've seen a lot of resumes come through reception, and Rajesh's experience really stands out. He's very detail-oriented - something I definitely appreciate!",
                "You know, Rajesh reminds me of the good parts of working at Dunder Mifflin - professional, dedicated, and actually knows what he's doing.",
                "From what I can see, Rajesh has excellent technical skills. Much better than the time Dwight tried to 'upgrade' our computer system with his beet-powered calculator."
            ],

            skillsResponses: [
                "Rajesh's technical skills are quite impressive! He knows Python, R, Machine Learning... way more than Jim knew about actual sales when he was pretending to work.",
                "His programming abilities are solid - I bet he's never accidentally deleted important files like Michael did with the company directory... multiple times.",
                "The variety of skills Rajesh has reminds me of all the different tasks I had to handle at reception - except his are actually useful and technical!",
                "Machine Learning, Data Science, Cybersecurity - Rajesh knows it all! Unlike Creed, who I'm pretty sure doesn't know what a computer actually does."
            ],

            projectResponses: [
                "His projects are really interesting! The image denoising work sounds much more complex than the time Dwight tried to 'enhance' our security cameras with magnifying glasses.",
                "I love seeing organized, well-documented projects. It's refreshing after years of dealing with Michael's 'brilliant' business ideas written on napkins.",
                "The car pricing project shows real practical applications - unlike Ryan's failed 'WUPHF' business venture that no one understood.",
                "These technical projects remind me why I went back to school for art - but I really respect people who can make sense of all this data stuff!"
            ],

            contactResponses: [
                "Oh, you want to get in touch with Rajesh? That's wonderful! I'll make sure he gets your message - I'm much more reliable than our old message system at Dunder Mifflin.",
                "Feel free to reach out to him! He's probably available and not stuck in endless meetings about whether birthday parties should have cake or ice cream... or both.",
                "I've set up all his contact information nicely. It's organized much better than our old filing system - Stanley used to hide crossword puzzles in the client files.",
                "Rajesh would love to hear from you! He's actually responsive to emails, unlike someone I know who shall remain nameless... *cough* Michael *cough*"
            ],

            casualResponses: [
                "That's a great question! You know, working here is so much nicer than Scranton. No one's trying to sell me their mixtape or asking me to plan their wedding to their laptop.",
                "I'm happy to help! It's nice to assist someone who actually appreciates organization and professionalism. Makes a change from... well, you know.",
                "Sure thing! I love talking about Rajesh's work - it's actually interesting, unlike the time I had to listen to Michael explain why he thought he invented the concept of 'friends.'",
                "Of course! I'm here to help, and I promise I won't transfer you to 'extension infinity' like Jim used to do to Dwight."
            ],

            encouragement: [
                "You know what? Rajesh seems like the kind of person who would fit in anywhere - professional, skilled, and probably won't try to start a fire to teach fire safety.",
                "I think you'll really like working with Rajesh. He has that 'gets things done' energy that was so rare at my old job.",
                "Rajesh's portfolio really shows his dedication. It's nice to see someone who takes their work seriously - but probably still knows how to have fun!",
                "From what I can tell, Rajesh would be a great addition to any team. He seems reliable, which is honestly a breath of fresh air."
            ],

            confused: [
                "Hmm, I'm not sure about that one. Let me check with Rajesh... just kidding! Unlike at Dunder Mifflin, I can't just yell across the office. What else can I help you with?",
                "I didn't quite catch that - could you rephrase? I promise I'm listening better than the time Michael asked me to 'translate' his ideas into 'business speak.'",
                "Sorry, could you be more specific? I want to give you the right information - I learned the importance of accuracy after Michael's 'World's Best Boss' mug incident.",
                "I'm not sure I understand. Could you ask that differently? I'm much better at helping than I was at pretending to laugh at Michael's jokes!"
            ]
        };
    }

    setupEventListeners() {
        // Modal controls
        this.chatbotButton?.addEventListener('click', () => this.openChatbot());
        this.closeChatbot?.addEventListener('click', () => this.closeChatbotModal());
        
        // Click outside to close
        this.chatbotModal?.addEventListener('click', (e) => {
            if (e.target === this.chatbotModal) {
                this.closeChatbotModal();
            }
        });

        // Send message
        this.sendButton?.addEventListener('click', () => this.sendMessage());
        this.chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick action buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action-btn')) {
                const question = e.target.dataset.question;
                this.handleUserMessage(question);
            }
        });
    }

    openChatbot() {
        this.chatbotModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Ensure PAM greeting is shown (in case of any caching issues)
        console.log('Chatbot opened with PAM personality active');
        
        setTimeout(() => {
            this.chatInput?.focus();
        }, 300);
    }

    closeChatbotModal() {
        this.chatbotModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (message && !this.isTyping) {
            this.handleUserMessage(message);
            this.chatInput.value = '';
        }
    }

    handleUserMessage(message) {
        this.addMessage(message, 'user');
        this.conversationHistory.push({ role: 'user', content: message });
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process message and generate response
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
            this.conversationHistory.push({ role: 'bot', content: response });
        }, 800 + Math.random() * 1000); // Random delay for more natural feel
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        this.conversationCount++;
        
        // Check if Office theme is active
        const isOfficeTheme = document.body.classList.contains('office-theme');
        
        // Special Office theme responses
        if (isOfficeTheme && this.containsAny(message, ['office', 'dunder mifflin', 'scranton', 'michael', 'dwight', 'jim'])) {
            return this.getOfficeThemeResponse(message);
        }
        
        // Greeting responses with PAM personality
        if (this.containsAny(message, ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'])) {
            const greeting = this.getRandomResponse(this.pamPersonality.greetings);
            if (isOfficeTheme) {
                return greeting + "\n\n🏢 I see you're experiencing the Dunder Mifflin theme! Feel free to ask me about Rajesh's work - it's much more interesting than sorting through Michael's expense reports!";
            }
            return greeting;
        }

        // Background and About with PAM's touch
        if (this.containsAny(message, ['background', 'about', 'who is', 'tell me about'])) {
            const professionalIntro = this.getRandomResponse(this.pamPersonality.professionalResponses);
            return `${professionalIntro}

Here's what I can tell you about Rajesh:

🎓 **Current Status**: ${this.knowledgeBase.personal.status} - ${this.knowledgeBase.personal.title}
💼 **Current Role**: ${this.knowledgeBase.personal.currentRole}
🔬 **Specializations**: ${this.knowledgeBase.personal.specializations.join(', ')}

🎯 **Career Objective**: ${this.knowledgeBase.personal.careerObjective}

He really knows his stuff - definitely not like the time Ryan tried to explain 'synergy' using a PowerPoint with 47 slides about nothing!`;
        }

        // Skills inquiry with PAM's personality
        if (this.containsAny(message, ['skills', 'technologies', 'programming', 'tech stack', 'expertise', 'abilities'])) {
            const skillsIntro = this.getRandomResponse(this.pamPersonality.skillsResponses);
            const skillCategories = Object.keys(this.knowledgeBase.skills);
            let response = `${skillsIntro}\n\nHere's what Rajesh is really good at:\n\n`;
            
            skillCategories.forEach(category => {
                response += `🛠️ **${category}**:\n${this.knowledgeBase.skills[category].join(', ')}\n\n`;
            });
            
            response += "His expertise spans from low-level electronics to cutting-edge AI technologies - definitely more useful than Dwight's 'beet farming optimization algorithms'!";
            return response;
        }

        // Projects inquiry with PAM's touch
        if (this.containsAny(message, ['projects', 'work', 'portfolio', 'built', 'developed', 'created'])) {
            const projectIntro = this.getRandomResponse(this.pamPersonality.projectResponses);
            let response = `${projectIntro}\n\nHere are Rajesh's featured projects:\n\n`;
            
            this.knowledgeBase.projects.forEach((project, index) => {
                response += `📂 **${project.title}**\n`;
                response += `Category: ${project.category}\n`;
                response += `${project.description}\n\n`;
                response += `💻 Technologies: ${project.technologies.join(', ')}\n`;
                response += `🏆 Key Achievements:\n${project.achievements.map(a => `• ${a}`).join('\n')}\n\n`;
                if (index < this.knowledgeBase.projects.length - 1) response += "---\n\n";
            });
            
            response += "\nAll much more impressive than the time Michael tried to 'revolutionize' paper sales with his 'Michael Scott Paper Company'!";
            return response;
        }

        // Experience inquiry
        if (this.containsAny(message, ['experience', 'work experience', 'jobs', 'career', 'employment', 'internship'])) {
            const pamIntro = this.pamPersonality.professionalResponses[Math.floor(Math.random() * this.pamPersonality.professionalResponses.length)];
            let response = `${pamIntro}\n\n📂 **Rajesh's Professional Experience**:\n\n`;
            
            this.knowledgeBase.experience.forEach((exp, index) => {
                response += `💼 **${exp.position}** at ${exp.company}\n`;
                response += `📅 Duration: ${exp.duration}\n`;
                response += `📋 ${exp.description}\n\n`;
                if (exp.responsibilities && exp.responsibilities.length > 0) {
                    response += `Key Responsibilities:\n${exp.responsibilities.map(r => `• ${r}`).join('\n')}\n\n`;
                }
                if (index < this.knowledgeBase.experience.length - 1) response += "---\n\n";
            });
            
            response += "\n*I've filed all his experience details properly - no crossword puzzles hidden in these files like Stanley used to do!*";
            return response;
        }

        // Education inquiry
        if (this.containsAny(message, ['education', 'degree', 'university', 'college', 'studied', 'academic'])) {
            let response = "Rajesh's educational journey demonstrates his commitment to continuous learning:\n\n";
            
            this.knowledgeBase.education.forEach((edu, index) => {
                response += `🎓 **${edu.degree}**\n`;
                response += `🏛️ ${edu.institution}\n`;
                response += `📅 ${edu.duration}\n`;
                response += `🎯 Focus: ${edu.focus}\n\n`;
                if (index < this.knowledgeBase.education.length - 1) response += "---\n\n";
            });
            
            return response;
        }

        // Certifications inquiry
        if (this.containsAny(message, ['certifications', 'certificates', 'credentials', 'qualified', 'certified'])) {
            let response = "Rajesh has earned 29+ professional certifications across various domains:\n\n";
            
            this.knowledgeBase.certifications.forEach((category, index) => {
                response += `🏆 **${category.category}**:\n`;
                category.certs.forEach(cert => {
                    response += `• ${cert}\n`;
                });
                response += "\n";
                if (index < this.knowledgeBase.certifications.length - 1) response += "---\n\n";
            });
            
            response += "These certifications demonstrate his expertise in AI, Machine Learning, Cloud Computing, and modern development tools!";
            return response;
        }

        // Contact inquiry
        if (this.containsAny(message, ['contact', 'reach', 'email', 'phone', 'location', 'hire', 'available'])) {
            const pamResponse = this.pamPersonality.contactResponses[Math.floor(Math.random() * this.pamPersonality.contactResponses.length)];
            return `📞 **Contact Information**:

🌟 **Availability**: ${this.knowledgeBase.contact.availability}
📍 **Location**: ${this.knowledgeBase.contact.location}
📧 **Email**: ${this.knowledgeBase.contact.email}
💼 **LinkedIn**: ${this.knowledgeBase.contact.linkedin}
👨‍💻 **GitHub**: ${this.knowledgeBase.contact.github}

${pamResponse}`;
        }

        // Unique qualities
        if (this.containsAny(message, ['unique', 'special', 'standout', 'different', 'why hire'])) {
            return `🌟 **What Makes Rajesh Unique**:

🔬 **Diverse Expertise**: Combines electronics engineering background with advanced computer engineering skills
🚀 **Cutting-Edge Knowledge**: 29+ recent certifications in AI, ML, and cloud technologies
💡 **Practical Experience**: Real-world internships in cybersecurity, AI applications, and product development
🔄 **Adaptability**: Successfully transitioned from electronics to computer engineering with excellence
🎯 **Problem Solver**: Proven track record of delivering measurable results (15% PSNR improvement, 92% prediction accuracy)
🤝 **Collaborative**: Experience working with diverse teams from startups to large corporations

Rajesh brings a rare combination of theoretical knowledge, practical skills, and continuous learning mindset that makes him an exceptional candidate!`;
        }

        // Machine Learning specific
        if (this.containsAny(message, ['machine learning', 'ai', 'artificial intelligence', 'deep learning', 'neural networks'])) {
            return `🤖 **Rajesh's AI/ML Expertise**:

**Educational Foundation**: Currently pursuing MS in Computer Engineering with focus on ML
**Hands-on Projects**: 
• Image Denoising using Deep Learning (15% PSNR improvement)
• Predictive Analytics for Car Pricing (92% accuracy)

**Technical Skills**:
• Deep Learning: TensorFlow, PyTorch, Keras
• Computer Vision: OpenCV, CNN architectures
• ML Libraries: Scikit-Learn, Pandas, NumPy
• Specialized: Neural Networks, Supervised Learning, NLP

**Recent Certifications** (All from 2025):
• AI Foundations: Machine Learning
• Building Deep Learning Applications with Keras
• PyTorch Essential Training
• TensorFlow Model Construction & Optimization
• Advanced Prompt Engineering Techniques

His combination of theoretical knowledge and practical implementation makes him ideal for ML engineering roles!`;
        }

        // Data Science specific
        if (this.containsAny(message, ['data science', 'data analysis', 'analytics', 'visualization', 'big data'])) {
            return `📊 **Rajesh's Data Science Capabilities**:

**Core Skills**:
• Data Analysis & Mining
• Statistical Analysis & Modeling
• Data Visualization (ggplot2, advanced dashboards)
• Big Data Processing (Apache Kafka, Spark)
• ETL Pipeline Development

**Proven Results**:
• Pre-owned Cars Pricing Forecast: 92% prediction accuracy, 25% error reduction
• Advanced statistical modeling in R
• Comprehensive data visualization dashboards

**Technical Proficiency**:
• Languages: Python, R Programming, SQL
• Tools: RStudio, Pandas, NumPy, Azure SQL
• Databases: MySQL, PostgreSQL, MongoDB
• Cloud: AWS, Microsoft Azure for data processing

**Recent Training**:
• Learning Data Visualization (Jul 2025)
• Statistics Foundations: Using Data Sets (Jul 2025)
• Azure AI Essentials: ML Workloads

Perfect blend of statistical knowledge and modern data engineering skills!`;
        }

        // Cybersecurity specific
        if (this.containsAny(message, ['security', 'cybersecurity', 'cyber', 'information security', 'network security'])) {
            return `🛡️ **Rajesh's Cybersecurity Expertise**:

**Current Role**: Software Intern at Quadrant Technologies focusing on Cybersecurity & AI applications

**Core Competencies**:
• Network Security & Information Security
• Threat Intelligence & Vulnerability Assessment
• Security Monitoring & Incident Response
• AI-powered Security Solutions

**Practical Experience**:
• Developing AI-powered cybersecurity solutions at Quadrant Technologies
• Working on threat detection algorithms
• Implementing ML models for security analytics

**Technical Skills**:
• Security frameworks and protocols
• System Administration (Linux/Unix, Windows Server)
• Network analysis and monitoring
• Vulnerability assessment tools

**Academic Foundation**:
• MS in Computer Engineering with cybersecurity focus
• Strong understanding of both offensive and defensive security measures

His unique combination of AI/ML skills with cybersecurity makes him valuable for modern security challenges!`;
        }

        // Default responses for unrecognized queries - PAM style
        const pamCasualResponses = this.pamPersonality.casualResponses;
        return this.getRandomResponse(pamCasualResponses);
    }

    getOfficeThemeResponse(message) {
        const officeResponses = [
            "🏢 Welcome to the Scranton branch! Michael would be so excited to know you're interested in our... I mean, Rajesh's portfolio!",
            "Oh, you noticed the Office theme! This is so much better than our actual office setup - we don't have bears roaming around like Dwight always warned about.",
            "The Dunder Mifflin experience! Don't worry, there's no Kevin spilling chili or Creed being... well, Creed. Just professional portfolio information!",
            "I love the Office theme too! It's like being back at reception, but with better technology and no one asking me to plan their birthday party.",
            "🎉 You're getting the full Scranton experience! Jim would probably make some joke about this, but I think it's actually pretty cool.",
            "The Office vibes are strong here! Much more organized than our actual filing system - Stanley definitely didn't hide any crosswords in these files!"
        ];
        
        return this.getRandomResponse(officeResponses);
    }

    containsAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<span class="robot-emoji">👩‍💼</span>' : '<i class="fa fa-user"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Format the message content with proper line breaks and styling
        const formattedContent = this.formatMessageContent(content);
        messageContent.innerHTML = formattedContent;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessageContent(content) {
        return content
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>')
            .replace(/<p><\/p>/g, '');
    }

    showTypingIndicator() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <span class="robot-emoji">👩‍💼</span>
            </div>
            <div class="typing-indicator">
                <span style="margin-right: 8px;">PAM is typing</span>
                <div class="typing-dots">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = this.chatMessages.querySelector('.typing-indicator-message');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize the chatbot when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new RajeshBot();
    
    // Simple theme notification functionality
    const themeBtn = document.getElementById('floatingThemeBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            alert('� Multiple Themes Available\n\nComing Soon! 🚀\n\nWe\'re working on bringing you exciting new themes including:\n\n• 🏢 The Office Theme - Full Dunder Mifflin experience\n• 🌙 Dark Mode - Sleek and modern\n• 🌈 Colorful Theme - Vibrant and creative\n• 🎮 Gaming Theme - For the tech enthusiasts\n• 🎯 Minimalist Theme - Clean and focused\n\nStay tuned for the theme switcher!');
        });
        
        // Add hover effect
        themeBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        });
        
        themeBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        });
    }
});
