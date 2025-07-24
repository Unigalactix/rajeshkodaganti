/*!
    Resume Generator
    Author: Rajesh Kodaganti
    Description: Dynamically generates resume from website content with print functionality
*/

(function() {
    'use strict';
    
    // Resume data extraction and generation
    function initResumeGenerator() {
        const viewResumeBtn = document.getElementById('viewResumeBtn');
        const resumeModal = document.getElementById('resumeModal');
        const closeResumeBtn = document.getElementById('closeResumeBtn');
        const printResumeBtn = document.getElementById('printResumeBtn');
        const resumeContent = document.getElementById('resumeContent');
        
        if (!viewResumeBtn || !resumeModal) {
            console.warn('Resume elements not found');
            return;
        }
        
        // Open resume modal
        viewResumeBtn.addEventListener('click', function() {
            generateResumeContent();
            resumeModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        // Close resume modal
        closeResumeBtn?.addEventListener('click', function() {
            resumeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Close modal when clicking outside
        resumeModal.addEventListener('click', function(e) {
            if (e.target === resumeModal) {
                resumeModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Print resume
        printResumeBtn?.addEventListener('click', function() {
            window.print();
        });
        
        // ESC key to close modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && resumeModal.style.display === 'flex') {
                resumeModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        console.log('Resume generator initialized successfully');
    }
    
    // Extract and format data from website sections
    function generateResumeContent() {
        const resumeContent = document.getElementById('resumeContent');
        if (!resumeContent) return;
        
        const resumeData = extractWebsiteData();
        const resumeHTML = generateResumeHTML(resumeData);
        resumeContent.innerHTML = resumeHTML;
    }
    
    // Extract data from various sections of the website
    function extractWebsiteData() {
        const data = {
            personal: extractPersonalInfo(),
            about: extractAboutInfo(),
            experience: extractExperienceInfo(),
            education: extractEducationInfo(),
            skills: extractSkillsInfo(),
            projects: extractProjectsInfo(),
            certifications: extractCertificationsInfo(),
            contact: extractContactInfo()
        };
        
        return data;
    }
    
    // Extract personal information
    function extractPersonalInfo() {
        const nameElement = document.querySelector('#nameTransition');
        const titleElement = document.querySelector('#lead-content p');
        
        return {
            name: nameElement ? (nameElement.textContent || 'Rajesh Kodaganti') : 'Rajesh Kodaganti',
            title: titleElement ? titleElement.textContent.trim() : 'Machine Learning Engineer & Data Scientist'
        };
    }
    
    // Extract about information
    function extractAboutInfo() {
        const aboutSection = document.querySelector('#about');
        const aboutText = aboutSection?.querySelector('p');
        
        return aboutText ? aboutText.textContent.trim() : 
            'Passionate Machine Learning Engineer and Data Scientist with expertise in developing intelligent systems and data-driven solutions.';
    }
    
    // Extract experience information
    function extractExperienceInfo() {
        const experienceSection = document.querySelector('#experience');
        const experiences = [];
        
        if (experienceSection) {
            const experienceItems = experienceSection.querySelectorAll('#experience-timeline > div');
            
            experienceItems.forEach(item => {
                const title = item.querySelector('h3')?.textContent?.trim();
                const company = item.querySelector('h4')?.textContent?.trim();
                const date = item.querySelector('.experience-date')?.textContent?.trim();
                const description = item.querySelector('p')?.textContent?.trim();
                
                if (title && company) {
                    experiences.push({
                        title,
                        company,
                        date: date || '',
                        description: description || ''
                    });
                }
            });
        }
        
        // Fallback data if no experience found
        if (experiences.length === 0) {
            experiences.push({
                title: 'Machine Learning Engineer',
                company: 'Tech Company',
                date: '2022 - Present',
                description: 'Developing and deploying machine learning models for various business applications.'
            });
        }
        
        return experiences;
    }
    
    // Extract education information
    function extractEducationInfo() {
        const educationSection = document.querySelector('#education');
        const educations = [];
        
        if (educationSection) {
            const educationItems = educationSection.querySelectorAll('.education-block');
            
            educationItems.forEach(item => {
                const school = item.querySelector('h3')?.textContent?.trim();
                const degree = item.querySelector('.education-degree')?.textContent?.trim();
                const date = item.querySelector('.education-date')?.textContent?.trim();
                
                if (school && degree) {
                    educations.push({
                        school,
                        degree,
                        date: date || ''
                    });
                }
            });
        }
        
        // Fallback data if no education found
        if (educations.length === 0) {
            educations.push({
                school: 'University Name',
                degree: 'Bachelor of Technology in Computer Science',
                date: '2018 - 2022'
            });
        }
        
        return educations;
    }
    
    // Extract skills information
    function extractSkillsInfo() {
        const skillsSection = document.querySelector('#skills');
        const skillCategories = {};
        
        if (skillsSection) {
            const skillItems = skillsSection.querySelectorAll('li');
            
            // Group skills by category (you can customize this logic)
            const programmingSkills = [];
            const mlSkills = [];
            const webSkills = [];
            const toolsSkills = [];
            
            skillItems.forEach(item => {
                const skillText = item.textContent.trim();
                
                // Categorize skills based on keywords
                if (skillText.match(/(Python|Java|JavaScript|C\+\+|SQL|R)/i)) {
                    programmingSkills.push(skillText);
                } else if (skillText.match(/(Machine Learning|Deep Learning|TensorFlow|PyTorch|Scikit|Neural|AI)/i)) {
                    mlSkills.push(skillText);
                } else if (skillText.match(/(HTML|CSS|React|Node|Web|Frontend|Backend)/i)) {
                    webSkills.push(skillText);
                } else {
                    toolsSkills.push(skillText);
                }
            });
            
            if (programmingSkills.length > 0) skillCategories['Programming Languages'] = programmingSkills;
            if (mlSkills.length > 0) skillCategories['Machine Learning & AI'] = mlSkills;
            if (webSkills.length > 0) skillCategories['Web Technologies'] = webSkills;
            if (toolsSkills.length > 0) skillCategories['Tools & Technologies'] = toolsSkills;
        }
        
        // Fallback skills if none found
        if (Object.keys(skillCategories).length === 0) {
            skillCategories['Programming Languages'] = ['Python', 'JavaScript', 'SQL', 'Java'];
            skillCategories['Machine Learning & AI'] = ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas'];
            skillCategories['Web Technologies'] = ['HTML', 'CSS', 'React', 'Node.js'];
            skillCategories['Tools & Technologies'] = ['Git', 'Docker', 'AWS', 'Linux'];
        }
        
        return skillCategories;
    }
    
    // Extract projects information
    function extractProjectsInfo() {
        const projectsSection = document.querySelector('#projects');
        const projects = [];
        
        if (projectsSection) {
            const projectItems = projectsSection.querySelectorAll('.project');
            
            projectItems.forEach(item => {
                const title = item.querySelector('.project-info h3')?.textContent?.trim();
                const description = item.querySelector('.project-info p')?.textContent?.trim();
                const link = item.querySelector('.project-info a')?.href;
                
                if (title && description) {
                    projects.push({
                        title,
                        description,
                        link: link || '',
                        technologies: 'Various Technologies' // You can extract this from description or data attributes
                    });
                }
            });
        }
        
        // Fallback projects if none found
        if (projects.length === 0) {
            projects.push({
                title: 'Machine Learning Project',
                description: 'Developed a comprehensive machine learning solution for data analysis and prediction.',
                technologies: 'Python, TensorFlow, Pandas',
                link: ''
            });
        }
        
        return projects;
    }
    
    // Extract certifications information
    function extractCertificationsInfo() {
        const certificationsSection = document.querySelector('#certifications');
        const certifications = [];
        
        if (certificationsSection) {
            const certItems = certificationsSection.querySelectorAll('.certification-item, .cert-item');
            
            certItems.forEach(item => {
                const name = item.querySelector('.cert-name, h3')?.textContent?.trim();
                const issuer = item.querySelector('.cert-issuer, .cert-organization')?.textContent?.trim();
                
                if (name) {
                    certifications.push({
                        name,
                        issuer: issuer || 'Professional Organization'
                    });
                }
            });
        }
        
        // Fallback certifications if none found
        if (certifications.length === 0) {
            certifications.push({
                name: 'Machine Learning Certification',
                issuer: 'Professional Organization'
            });
        }
        
        return certifications;
    }
    
    // Extract contact information
    function extractContactInfo() {
        const contactSection = document.querySelector('#contact');
        
        // Try to extract from various possible locations
        const email = document.querySelector('a[href^="mailto:"]')?.href?.replace('mailto:', '') || 'your.email@example.com';
        const phone = document.querySelector('a[href^="tel:"]')?.textContent?.trim() || '';
        const linkedin = document.querySelector('a[href*="linkedin"]')?.href || '';
        const github = document.querySelector('a[href*="github"]')?.href || '';
        
        return {
            email,
            phone,
            linkedin,
            github,
            location: 'Location' // You can extract this from contact section if available
        };
    }
    
    // Generate HTML for the resume
    function generateResumeHTML(data) {
        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        return `
            <div class="resume-personal-info">
                <div class="resume-name">${data.personal.name}</div>
                <div class="resume-title">${data.personal.title}</div>
                <div class="resume-contact-info">
                    ${data.contact.email ? `<div class="resume-contact-item"><i class="fa fa-envelope"></i> ${data.contact.email}</div>` : ''}
                    ${data.contact.phone ? `<div class="resume-contact-item"><i class="fa fa-phone"></i> ${data.contact.phone}</div>` : ''}
                    ${data.contact.linkedin ? `<div class="resume-contact-item"><i class="fa fa-linkedin"></i> LinkedIn Profile</div>` : ''}
                    ${data.contact.github ? `<div class="resume-contact-item"><i class="fa fa-github"></i> GitHub Profile</div>` : ''}
                </div>
            </div>
            
            <div class="resume-section">
                <div class="resume-section-title">Professional Summary</div>
                <div class="resume-about">${data.about}</div>
            </div>
            
            <div class="resume-section">
                <div class="resume-section-title">Professional Experience</div>
                ${data.experience.map(exp => `
                    <div class="resume-experience-item">
                        <div class="resume-job-title">${exp.title}</div>
                        <div class="resume-company">${exp.company}</div>
                        <div class="resume-date">${exp.date}</div>
                        <div class="resume-description">${exp.description}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="resume-section">
                <div class="resume-section-title">Education</div>
                ${data.education.map(edu => `
                    <div class="resume-education-item">
                        <div class="resume-degree">${edu.degree}</div>
                        <div class="resume-school">${edu.school}</div>
                        <div class="resume-education-date">${edu.date}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="resume-section">
                <div class="resume-section-title">Technical Skills</div>
                <div class="resume-skills-grid">
                    ${Object.entries(data.skills).map(([category, skills]) => `
                        <div class="resume-skill-category">
                            <div class="resume-skill-category-title">${category}</div>
                            <div class="resume-skills-list">${skills.join(', ')}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="resume-section">
                <div class="resume-section-title">Projects</div>
                ${data.projects.map(project => `
                    <div class="resume-project-item">
                        <div class="resume-project-title">${project.title}</div>
                        <div class="resume-project-tech">Technologies: ${project.technologies}</div>
                        <div class="resume-project-description">${project.description}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="resume-section">
                <div class="resume-section-title">Certifications</div>
                <div class="resume-certification-grid">
                    ${data.certifications.map(cert => `
                        <div class="resume-certification-item">
                            <div class="resume-certification-name">${cert.name}</div>
                            <div class="resume-certification-issuer">${cert.issuer}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #7f8c8d; border-top: 1px solid #ddd; padding-top: 15px;">
                <em>Resume generated on ${currentDate} from portfolio website content</em>
            </div>
        `;
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initResumeGenerator);
    } else {
        initResumeGenerator();
    }
    
    // Also initialize when window loads (backup)
    window.addEventListener('load', initResumeGenerator);
    
})();
