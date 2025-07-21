// Timeline Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Experience Timeline Data
    const experienceData = {
        'exp1': {
            title: 'Software Intern',
            company: 'Quadrant Technologies',
            period: 'July 2025 – Present',
            summary: 'Cybersecurity & AI applications development',
            details: {
                overview: 'Currently working as a Software Intern at Quadrant Technologies, focusing on cybersecurity solutions and AI applications development. Contributing to cutting-edge projects in the security domain.',
                responsibilities: [
                    'Developing cybersecurity applications and tools',
                    'Working on AI-powered security solutions',
                    'Collaborating with senior developers on security protocols',
                    'Testing and debugging security applications',
                    'Participating in code reviews and technical discussions'
                ],
                achievements: [
                    'Contributing to innovative cybersecurity projects',
                    'Learning advanced AI/ML techniques for security applications',
                    'Gaining hands-on experience with enterprise security tools'
                ],
                technologies: ['Python', 'AI/ML', 'Cybersecurity Tools', 'Security Protocols', 'Data Analysis']
            }
        },
        'exp2': {
            title: 'Solutions Engineer (Internship)',
            company: 'QikCell by tickioT',
            period: 'January 2025 – May 2025',
            summary: 'Technical demonstrations & client solutions',
            details: {
                overview: 'Worked as a Solutions Engineer intern at QikCell by tickioT, focusing on technical demonstrations and developing client solutions. Gained experience in client communication and solution architecture.',
                responsibilities: [
                    'Conducted technical product demonstrations to clients',
                    'Developed customized solutions based on client requirements',
                    'Collaborated with sales teams to support client acquisition',
                    'Created technical documentation and user guides',
                    'Provided technical support to existing clients'
                ],
                achievements: [
                    'Successfully demonstrated products to 20+ prospective clients',
                    'Contributed to 3 successful client acquisitions',
                    'Improved demonstration process efficiency by 25%'
                ],
                technologies: ['IoT Solutions', 'Client Management', 'Technical Documentation', 'Product Demo Tools']
            }
        },
        'exp3': {
            title: 'User Test Specialist (Freelance)',
            company: 'ColorOS (OPPO)',
            period: 'June 2018 – July 2022',
            summary: 'Beta testing & user experience optimization',
            details: {
                overview: 'Served as a freelance User Test Specialist for ColorOS (OPPO), contributing to beta testing programs and user experience optimization across multiple ColorOS versions.',
                responsibilities: [
                    'Conducted comprehensive beta testing of ColorOS features',
                    'Provided detailed feedback on user interface and experience',
                    'Identified and reported bugs and system vulnerabilities',
                    'Participated in user experience research studies',
                    'Collaborated with development teams for feature improvements'
                ],
                achievements: [
                    'Tested and provided feedback on 15+ ColorOS beta versions',
                    'Contributed to significant UX improvements in ColorOS 12 & 13',
                    'Recognized as top contributor in beta testing community',
                    'Helped identify critical bugs preventing major system issues'
                ],
                technologies: ['Mobile OS Testing', 'UX Research', 'Bug Reporting', 'Quality Assurance', 'Android']
            }
        },
        'exp4': {
            title: 'Engineering Intern',
            company: 'Pantech ProEd Pvt Ltd',
            period: 'June 2020 – July 2020',
            summary: '64-bit binary comparator development',
            details: {
                overview: 'Completed an engineering internship at Pantech ProEd Pvt Ltd, focusing on digital circuit design and specifically developing a 64-bit binary comparator system.',
                responsibilities: [
                    'Designed and developed a 64-bit binary comparator circuit',
                    'Performed simulation and testing of digital circuits',
                    'Documented design processes and circuit specifications',
                    'Collaborated with engineering team on circuit optimization',
                    'Presented final project to technical review board'
                ],
                achievements: [
                    'Successfully designed and implemented 64-bit binary comparator',
                    'Achieved optimal performance with minimal gate delay',
                    'Received excellent feedback on project presentation',
                    'Gained practical experience in digital circuit design'
                ],
                technologies: ['Digital Circuit Design', 'VHDL', 'Circuit Simulation', 'Binary Logic', 'Hardware Design']
            }
        },
        'exp5': {
            title: 'Product Tester - R&D Department',
            company: 'PeopleLink Unified Communications',
            period: 'June 2018 – May 2019',
            summary: 'Product evaluation & quality assurance',
            details: {
                overview: 'Worked as a Product Tester in the R&D Department at PeopleLink Unified Communications, focusing on product evaluation and quality assurance for unified communication solutions.',
                responsibilities: [
                    'Conducted comprehensive product testing and evaluation',
                    'Developed test cases and testing protocols',
                    'Performed quality assurance on communication products',
                    'Collaborated with R&D team on product improvements',
                    'Documented test results and provided improvement recommendations'
                ],
                achievements: [
                    'Developed efficient testing protocols improving test coverage by 30%',
                    'Identified critical issues preventing product launch delays',
                    'Contributed to successful launch of 2 major communication products',
                    'Received recognition for thorough testing methodologies'
                ],
                technologies: ['Product Testing', 'Quality Assurance', 'Test Automation', 'Communication Systems', 'R&D Processes']
            }
        }
    };

    // Education Timeline Data
    const educationData = {
        'edu1': {
            title: 'Master of Science - Computer Engineering',
            institution: 'California State University, Northridge',
            period: 'Aug 2022 - May 2025',
            summary: 'Advanced ML, Data Engineering & Cybersecurity',
            details: {
                overview: 'Pursuing Master of Science in Computer Engineering at California State University, Northridge, with specializations in Machine Learning, Data Engineering, and Cybersecurity. Gaining advanced knowledge in cutting-edge technologies and research methodologies.',
                coursework: [
                    'Advanced Machine Learning and Deep Learning',
                    'Data Engineering and Big Data Analytics',
                    'Cybersecurity and Network Security',
                    'Advanced Computer Architecture',
                    'Distributed Systems and Cloud Computing',
                    'Software Engineering and Project Management',
                    'Research Methods in Computer Engineering'
                ],
                projects: [
                    'Developed ML-based cybersecurity threat detection system',
                    'Built scalable data pipeline for real-time analytics',
                    'Created distributed computing solution for large dataset processing',
                    'Implemented network security monitoring tool'
                ],
                achievements: [
                    'Maintaining excellent academic standing',
                    'Active participant in research projects',
                    'Graduate Teaching Assistant for undergraduate courses',
                    'Published research paper in conference proceedings'
                ],
                technologies: ['Python', 'TensorFlow', 'PyTorch', 'Apache Spark', 'Hadoop', 'Kubernetes', 'AWS', 'Cybersecurity Tools']
            }
        },
        'edu2': {
            title: 'B-Tech in ECE - Electronics & Communication',
            institution: 'JB Institute Of Engineering and Technology',
            period: 'July 2019 - June 2022',
            summary: 'Grade: 7.45 - Digital Systems & Networks',
            details: {
                overview: 'Completed Bachelor of Technology in Electronics and Communication Engineering at JB Institute Of Engineering and Technology with a CGPA of 7.45. Gained comprehensive knowledge in digital systems, communication networks, and embedded systems.',
                coursework: [
                    'Digital Signal Processing',
                    'Communication Systems and Networks',
                    'Embedded Systems and Microcontrollers',
                    'VLSI Design and Digital Electronics',
                    'Antenna and Wave Propagation',
                    'Control Systems Engineering',
                    'Computer Networks and Internet Protocols'
                ],
                projects: [
                    'Designed and implemented digital communication system',
                    'Developed embedded system for home automation',
                    'Created VLSI design for digital signal processor',
                    'Built wireless sensor network for environmental monitoring'
                ],
                achievements: [
                    'Graduated with CGPA of 7.45/10',
                    'Best Project Award for innovative embedded system design',
                    'Active member of Electronics and Communication Society',
                    'Completed multiple industry-relevant certification courses'
                ],
                technologies: ['VHDL', 'Verilog', 'MATLAB', 'Embedded C', 'Microcontrollers', 'PCB Design', 'Digital Signal Processing']
            }
        },
        'edu3': {
            title: 'ECE (SCN) Specialization',
            institution: 'Government Institute of Electronics',
            period: 'June 2015 - Dec 2018',
            summary: 'Electronics, Communication & Mobile Technologies',
            details: {
                overview: 'Completed specialized program in Electronics, Communication, and Mobile Technologies at Government Institute of Electronics. Gained foundational knowledge in electronics principles, communication systems, and mobile technology applications.',
                coursework: [
                    'Fundamentals of Electronics and Circuit Analysis',
                    'Communication Principles and Systems',
                    'Mobile Communication Technologies',
                    'Digital Electronics and Logic Design',
                    'Network Theory and Analysis',
                    'Electronic Devices and Circuits',
                    'Computer Programming and Applications'
                ],
                projects: [
                    'Built basic communication system prototype',
                    'Developed mobile application for electronics calculations',
                    'Created digital circuit simulator',
                    'Designed basic electronic measurement instruments'
                ],
                achievements: [
                    'Successfully completed specialized ECE program',
                    'Demonstrated practical skills in electronics lab work',
                    'Participated in technical exhibitions and competitions',
                    'Built strong foundation for higher studies in engineering'
                ],
                technologies: ['Basic Electronics', 'Circuit Design', 'Mobile Technologies', 'Digital Logic', 'Programming Fundamentals']
            }
        }
    };

    // Modal Functions
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    function populateModal(modalId, data) {
        const modal = document.getElementById(modalId);
        if (!modal || !data) return;

        // Update modal content
        const titleElement = modal.querySelector('.detail-modal-header h2');
        const bodyElement = modal.querySelector('.detail-modal-body');

        if (titleElement) {
            titleElement.textContent = data.title;
        }

        if (bodyElement && data.details) {
            bodyElement.innerHTML = `
                <div class="modal-section">
                    <h3>Overview</h3>
                    <p>${data.details.overview}</p>
                </div>
                
                ${data.details.responsibilities ? `
                <div class="modal-section">
                    <h3>Key Responsibilities</h3>
                    <ul>
                        ${data.details.responsibilities.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${data.details.coursework ? `
                <div class="modal-section">
                    <h3>Coursework</h3>
                    <ul>
                        ${data.details.coursework.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${data.details.projects ? `
                <div class="modal-section">
                    <h3>Key Projects</h3>
                    <ul>
                        ${data.details.projects.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${data.details.achievements ? `
                <div class="modal-section">
                    <h3>Achievements</h3>
                    ${data.details.achievements.map(item => `
                        <div class="modal-achievement">
                            <strong>Achievement:</strong> ${item}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${data.details.technologies ? `
                <div class="modal-section">
                    <h3>Technologies Used</h3>
                    <div class="modal-skills">
                        ${data.details.technologies.map(tech => `<span class="modal-skill-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
            `;
        }
    }

    // Event Listeners for Experience Timeline
    document.querySelectorAll('#experience .view-details-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const experienceId = this.getAttribute('data-experience');
            const data = experienceData[experienceId];
            
            if (data) {
                populateModal('experienceModal', data);
                openModal('experienceModal');
            }
        });
    });

    // Event Listeners for Education Timeline
    document.querySelectorAll('#education .view-details-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const educationId = this.getAttribute('data-education');
            const data = educationData[educationId];
            
            if (data) {
                populateModal('educationModal', data);
                openModal('educationModal');
            }
        });
    });

    // Close Modal Event Listeners
    document.querySelectorAll('.detail-close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.detail-modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.detail-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.detail-modal').forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal.id);
                }
            });
        }
    });

    // Add smooth scrolling animation for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        timelineObserver.observe(item);
    });
});
