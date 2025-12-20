// Modal Manager for Experience and Project Details
class ModalManager {
    constructor() {
        this.experienceData = this.getExperienceData();
        this.educationData = this.getEducationData();
        this.projectData = this.getProjectData();
        this.init();
    }

    init() {
        // Add click outside to close functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('detail-modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Add escape key to close functionality
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    getExperienceData() {
        return {
            quadrant: {
                title: "Quadrant Technologies",
                role: "Software Intern",
                period: "July 2025 – Present",
                icon: "💼",
                description: "Cybersecurity & AI applications development. Working on cutting-edge projects involving threat intelligence and machine learning integration.",
                duties: [
                    "Developing AI-powered cybersecurity solutions for threat detection and analysis",
                    "Implementing machine learning models for predictive threat intelligence",
                    "Collaborating with cross-functional teams on security automation projects",
                    "Conducting research on emerging cybersecurity threats and mitigation strategies",
                    "Contributing to the development of security monitoring dashboards and tools"
                ],
                technologies: ["Cybersecurity", "AI Applications", "Python", "Machine Learning", "Threat Intelligence", "Security Analytics"],
                achievements: [
                    "Improved threat detection accuracy by 25% through ML model optimization",
                    "Developed automated security monitoring system reducing manual effort by 40%",
                    "Contributed to 3+ major security projects with positive client feedback"
                ]
            },
            qikcell: {
                title: "QikCell by tickioT",
                role: "Solutions Engineer (Internship)",
                period: "January 2025 – May 2025",
                icon: "⚡",
                description: "Technical demonstrations & client solutions. Delivered comprehensive technical presentations and developed tailored solutions for enterprise clients.",
                duties: [
                    "Conducted technical product demonstrations for potential enterprise clients",
                    "Developed customized IoT solutions based on client requirements",
                    "Created comprehensive technical documentation and user guides",
                    "Collaborated with sales team to identify client needs and propose solutions",
                    "Provided technical support and troubleshooting for existing clients"
                ],
                technologies: ["Technical Sales", "Client Solutions", "Presentations", "IoT Systems", "Solution Architecture", "Technical Writing"],
                achievements: [
                    "Successfully demonstrated solutions to 15+ enterprise clients",
                    "Achieved 80% client satisfaction rate in post-demonstration surveys",
                    "Contributed to 3 major client acquisitions through technical expertise"
                ]
            },
            coloros: {
                title: "ColorOS (OPPO)",
                role: "User Test Specialist (Freelance)",
                period: "June 2018 – July 2022",
                icon: "📱",
                description: "Beta testing & user experience optimization. Conducted comprehensive testing cycles and provided detailed feedback for mobile OS improvements.",
                duties: [
                    "Performed comprehensive beta testing of ColorOS mobile operating system",
                    "Identified and documented software bugs, usability issues, and performance problems",
                    "Provided detailed feedback on user interface and user experience improvements",
                    "Participated in testing cycles for major OS releases and updates",
                    "Collaborated with development team through bug tracking systems"
                ],
                technologies: ["Mobile Testing", "UX Optimization", "Android", "Beta Testing", "Bug Tracking", "Quality Assurance"],
                achievements: [
                    "Tested and provided feedback for 20+ ColorOS releases over 4 years",
                    "Identified critical bugs that improved system stability by 15%",
                    "Recognized as top contributor in beta testing community"
                ]
            },
            pantech: {
                title: "Pantech ProEd Pvt Ltd",
                role: "Engineering Intern",
                period: "June 2020 – July 2020",
                icon: "🔧",
                description: "64-bit binary comparator development. Designed and implemented digital logic circuits with focus on performance optimization and hardware efficiency.",
                duties: [
                    "Designed and implemented 64-bit binary comparator using digital logic principles",
                    "Performed circuit simulation and verification using industry-standard tools",
                    "Optimized circuit design for reduced power consumption and improved performance",
                    "Created technical documentation and test reports for design validation",
                    "Collaborated with senior engineers on hardware design best practices"
                ],
                technologies: ["VLSI Design", "Digital Logic", "Hardware Testing", "Circuit Design", "Simulation Tools", "Performance Optimization"],
                achievements: [
                    "Successfully designed and verified 64-bit binary comparator circuit",
                    "Achieved 20% improvement in power efficiency compared to baseline design",
                    "Completed project 2 weeks ahead of schedule with full functionality"
                ]
            },
            peoplelink: {
                title: "PeopleLink Unified Communications",
                role: "Product Tester - R&D Department",
                period: "June 2018 – May 2019",
                icon: "🔬",
                description: "Product evaluation & quality assurance. Performed systematic testing protocols and contributed to product development lifecycle improvements.",
                duties: [
                    "Conducted systematic testing of communication products and systems",
                    "Developed and executed comprehensive test plans and procedures",
                    "Performed quality assurance testing for hardware and software components",
                    "Documented test results and provided recommendations for improvements",
                    "Participated in product development lifecycle and design reviews"
                ],
                technologies: ["Product Testing", "Quality Assurance", "R&D Protocols", "Communication Systems", "Test Planning", "Documentation"],
                achievements: [
                    "Tested 10+ communication products with 95% defect detection rate",
                    "Improved testing efficiency by 30% through process optimization",
                    "Contributed to 2 major product launches with zero critical defects"
                ]
            }
        };
    }
    getEducationData() {
        return {
            csun: {
                title: "CSUN - California State University, Northridge",
                degree: "Master of Science in Computer Engineering",
                period: "Aug 2022 - May 2025",
                icon: "🎓",
                description: "Focused on advanced Computer Engineering concepts including AI Systems, Network Security, and Embedded Systems. Maintained a high GPA of 3.8/4.0.",
                courses: [
                    "Advanced Computer Architecture",
                    "Network Security & Cryptography",
                    "Machine Learning & Data Mining",
                    "Embedded Systems Design",
                    "Digital Image Processing",
                    "Software Engineering"
                ],
                achievements: [
                    "GPA: 3.8/4.0",
                    "Published research paper on 'AI in Network Security'",
                    "Teaching Assistant for Digital Logic Design",
                    "Lead Developer for Graduate Capstone Project"
                ]
            },
            jbiet: {
                title: "J.B. Institute of Engineering & Technology",
                degree: "Bachelor of Technology in Electronics & Comm.",
                period: "July 2019 - June 2022",
                icon: "🏫",
                description: "Comprehensive foundation in Electronics and Communication Engineering. Active participant in technical clubs and hackathons.",
                courses: [
                    "Digital Signal Processing",
                    "VLSI Design",
                    "Microprocessors & Microcontrollers",
                    "Computer Networks",
                    "Data Structures & Algorithms"
                ],
                achievements: [
                    "Graduated with First Class with Distinction",
                    "Winner of Intra-college Robotics Competition",
                    "Student Coordinator for Technical Fest"
                ]
            }
        };
    }

    openEducationModal(eduId) {
        const education = this.educationData[eduId];
        if (!education) return;

        const modalHtml = `
            <div id="educationModal" class="detail-modal education-modal">
                <div class="detail-modal-content">
                    <div class="detail-modal-header">
                        <h2>${education.icon} ${education.title}</h2>
                        <span class="detail-close-btn" onclick="modalManager.closeModal('educationModal')">&times;</span>
                    </div>
                    <div class="detail-modal-body">
                        <div class="modal-section">
                            <h3><i class="fa fa-graduation-cap"></i>Degree Details</h3>
                            <p><strong>Degree:</strong> ${education.degree}</p>
                            <p><strong>Duration:</strong> ${education.period}</p>
                            <p><strong>Overview:</strong> ${education.description}</p>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fa fa-book"></i>Key Coursework</h3>
                            <div class="modal-tech-tags">
                               ${education.courses.map(course => `<span class="modal-tech-tag">${course}</span>`).join('')}
                            </div>
                        </div>
                        
                        <div class="modal-section">
                            <div class="modal-achievements">
                                <h3><i class="fa fa-medal"></i>Achievements</h3>
                                <ul>
                                    ${education.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('educationModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        document.getElementById('educationModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    getProjectData() {
        return {
            convir: {
                title: "Image Denoising using Deep Learning (ConvIR)",
                category: "Machine Learning • Computer Vision • Dec 2024 - May 2025",
                icon: "🤖",
                description: "Developed ConvIR, a sophisticated deep learning framework for image denoising targeting additive white Gaussian noise (AWGN) using dual-domain learning approach. Features UNet-inspired architecture with multi-shape attention and deep residual connections for robust grayscale image restoration.",
                objectives: [
                    "Develop advanced deep learning framework for image denoising",
                    "Implement dual-domain learning approach for robust noise reduction",
                    "Create UNet-inspired architecture with multi-shape attention mechanisms",
                    "Achieve superior performance compared to existing denoising methods"
                ],
                technologies: ["Python", "TensorFlow", "PyTorch", "FFT Analysis", "Computer Vision", "Deep Learning"],
                achievements: [
                    "PSNR gains >12 dB at high noise levels (σ=25)",
                    "95% reduction in residual noise (low-noise conditions)",
                    ">30 dB PSNR at σ=7.5, ~28 dB PSNR at σ=10",
                    "Composite loss: MSE + FFT spectral + noise regularization",
                    "Trained on Set12, BSD68, Urban100 datasets"
                ]
            },
            cars: {
                title: "Pre-owned Cars Pricing Forecast",
                category: "Data Science • Machine Learning • Aug 2022 - Dec 2022",
                icon: "📊",
                description: "Developed and implemented a Random Forest Regression model in R for pre-owned car price forecasting. Conducted comprehensive data preprocessing including handling missing values and converting categorical features for a dataset of 48,904 rows.",
                objectives: [
                    "Build accurate pricing model for pre-owned vehicles",
                    "Implement comprehensive data preprocessing pipeline",
                    "Handle missing values and categorical feature encoding",
                    "Achieve high prediction accuracy using ensemble methods"
                ],
                technologies: ["R Programming", "Random Forest", "Data Preparation", "Regression Analysis", "Feature Engineering", "Statistical Modeling"],
                achievements: [
                    "85.67% prediction accuracy achieved",
                    "Processed 48,904 rows of automotive data",
                    "Advanced feature engineering & preprocessing",
                    "Robust categorical variable handling"
                ]
            },
            router: {
                title: "1X3 Router Design and Verification",
                category: "VLSI Design • Hardware Verification • Dec 2021 - Jan 2022",
                icon: "🔧",
                description: "Designed a 1x3 router that directs packets to three different destinations using Verilog HDL. Implemented synthesis constraints and comprehensive verification through testbenches, utilizing Quartus Prime for synthesis and ModelSim for simulation verification.",
                objectives: [
                    "Design efficient 1x3 packet routing system",
                    "Implement comprehensive verification methodology",
                    "Optimize for performance and resource utilization",
                    "Ensure reliable packet delivery to multiple destinations"
                ],
                technologies: ["Verilog HDL", "RTL Design", "Quartus Prime", "ModelSim", "FPGA Design", "Hardware Verification"],
                achievements: [
                    "Successful packet routing to 3 destinations",
                    "Complete synthesis constraint implementation",
                    "Comprehensive testbench verification",
                    "Hardware simulation validation"
                ]
            },
            assistive: {
                title: "Raspberry Pi Assistive Technologies",
                category: "IoT • Accessibility • Aug 2021 - Nov 2021",
                icon: "🤖",
                description: "Developed reading aids for visually impaired individuals using Raspberry Pi technology. Created OCR-based prototype that captures document images and converts them to audio using Tesseract library and Python, supporting both online and offline processing methods.",
                objectives: [
                    "Create accessible reading solution for visually impaired users",
                    "Implement reliable OCR technology for text recognition",
                    "Develop text-to-speech conversion system",
                    "Ensure both online and offline functionality"
                ],
                technologies: ["Raspberry Pi", "Python", "Tesseract OCR", "Computer Vision", "Text-to-Speech", "IoT Development"],
                achievements: [
                    "OCR technology integration (online/offline)",
                    "Document-to-audio conversion system",
                    "Enhanced accessibility for visually impaired",
                    "Educational setting optimization"
                ]
            },
            camera: {
                title: "PeopleLink \"Look At Me\" Controller",
                category: "Embedded Systems • PCB Design • Nov 2018 - Dec 2018",
                icon: "📹",
                description: "Spearheaded circuit design and testing for sophisticated camera system optimized for conference rooms and educational settings. Developed both wired and wireless models with intuitive control systems enabling automatic speaker tracking and focus adjustment.",
                objectives: [
                    "Design intelligent camera control system for conference rooms",
                    "Implement automatic speaker tracking functionality",
                    "Develop both wired and wireless control options",
                    "Optimize for educational and professional environments"
                ],
                technologies: ["PCB Design", "Embedded C", "Camera Systems", "Wireless Control", "Circuit Design", "Hardware Testing"],
                achievements: [
                    "Automatic speaker tracking & focus",
                    "Dual model development (wired/wireless)",
                    "Simplified installation & operation",
                    "Enhanced collaborative environment efficiency"
                ]
            }
        };
    }

    openExperienceModal(expId) {
        const experience = this.experienceData[expId];
        if (!experience) return;

        const modalHtml = `
            <div id="experienceModal" class="detail-modal experience-modal">
                <div class="detail-modal-content">
                    <div class="detail-modal-header">
                        <h2>${experience.icon} ${experience.title}</h2>
                        <span class="detail-close-btn" onclick="modalManager.closeModal('experienceModal')">&times;</span>
                    </div>
                    <div class="detail-modal-body">
                        <div class="modal-section">
                            <h3><i class="fa fa-briefcase"></i>Position Details</h3>
                            <p><strong>Role:</strong> ${experience.role}</p>
                            <p><strong>Duration:</strong> ${experience.period}</p>
                            <p><strong>Overview:</strong> ${experience.description}</p>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fa fa-tasks"></i>Key Responsibilities</h3>
                            <ul>
                                ${experience.duties.map(duty => `<li>${duty}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fa fa-cogs"></i>Technologies & Skills</h3>
                            <div class="modal-tech-tags">
                                ${experience.technologies.map(tech => `<span class="modal-tech-tag">${tech}</span>`).join('')}
                            </div>
                        </div>
                        
                        <div class="modal-section">
                            <div class="modal-achievements">
                                <h3><i class="fa fa-trophy"></i>Key Achievements</h3>
                                <ul>
                                    ${experience.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('experienceModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        document.getElementById('experienceModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    openProjectModal(projectId) {
        const project = this.projectData[projectId];
        if (!project) return;

        const modalHtml = `
            <div id="projectModal" class="detail-modal project-modal">
                <div class="detail-modal-content">
                    <div class="detail-modal-header">
                        <h2>${project.icon} ${project.title}</h2>
                        <span class="detail-close-btn" onclick="modalManager.closeModal('projectModal')">&times;</span>
                    </div>
                    <div class="detail-modal-body">
                        <div class="modal-section">
                            <h3><i class="fa fa-info-circle"></i>Project Overview</h3>
                            <p><strong>Category:</strong> ${project.category}</p>
                            <p><strong>Description:</strong> ${project.description}</p>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fa fa-target"></i>Project Objectives</h3>
                            <ul>
                                ${project.objectives.map(objective => `<li>${objective}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fa fa-code"></i>Technologies Used</h3>
                            <div class="modal-tech-tags">
                                ${project.technologies.map(tech => `<span class="modal-tech-tag">${tech}</span>`).join('')}
                            </div>
                        </div>
                        
                        <div class="modal-section">
                            <div class="modal-achievements">
                                <h3><i class="fa fa-star"></i>Key Results & Achievements</h3>
                                <ul>
                                    ${project.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('projectModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        document.getElementById('projectModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Remove modal from DOM after animation
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.detail-modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        document.body.style.overflow = 'auto';
    }
}

// Global functions for onclick handlers
function openExperienceModal(expId) {
    modalManager.openExperienceModal(expId);
}

function openProjectModal(projectId) {
    modalManager.openProjectModal(projectId);
}

function openEducationModal(eduId) {
    modalManager.openEducationModal(eduId);
}

// Initialize modal manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modalManager = new ModalManager();
});
