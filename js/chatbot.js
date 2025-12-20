/**
 * Pam - The Portfolio Assistant Module
 * A keyword-based chatbot that uses data.json as its knowledge base.
 * Persona: Pam Beesly (The Office)
 */

document.addEventListener('DOMContentLoaded', () => {
    initPam();
});

let pamData = null;

async function initPam() {
    // 1. Create UI
    createChatUI();

    // 2. Load Knowledge Base
    try {
        const response = await fetch('js/data.json');
        pamData = await response.json();
        console.log('Pam: Knowledge loaded!', pamData);
    } catch (e) {
        console.error('Pam: Failed to load knowledge.', e);
        addMessage('system', "Dunder Mifflin, this is Pam... sorry, my line seems to be down (failed to load data.json).");
    }

    // 3. Attach Listeners
    const sendBtn = document.getElementById('pam-send-btn');
    const input = document.getElementById('pam-input');
    const toggleBtn = document.getElementById('pam-toggle-btn');
    const closeBtn = document.getElementById('pam-close-btn');

    sendBtn.addEventListener('click', () => handleUserInput(input));
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput(input);
    });

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // 4. Greeting
    setTimeout(() => {
        addMessage('bot', "Dunder Mifflin, this is Pam. 👋  \nI can help you with Rajesh's portfolio. What would you like to know?");
    }, 1000);
}

function createChatUI() {
    const html = `
    <!-- Floating Toggle Button -->
    <button id="pam-toggle-btn" class="pam-float-btn">
        <i class="fa fa-comments"></i>
    </button>

    <!-- Chat Window -->
    <div id="pam-window" class="pam-window" style="display: none;">
        <div class="pam-header">
            <div class="pam-avatar">P</div>
            <div class="pam-info">
                <h4>Pam Beesly</h4>
                <span>Receptionist & Assistant</span>
            </div>
            <button id="pam-close-btn">&times;</button>
        </div>
        <div id="pam-messages" class="pam-messages"></div>
        <div class="pam-input-area">
            <input type="text" id="pam-input" placeholder="Ask about skills, projects, or say hi...">
            <button id="pam-send-btn"><i class="fa fa-paper-plane"></i></button>
        </div>
    </div>
    `;

    const container = document.createElement('div');
    container.id = 'pam-container';
    container.innerHTML = html;
    document.body.appendChild(container);
}

function toggleChat() {
    const window = document.getElementById('pam-window');
    const btn = document.getElementById('pam-toggle-btn');

    if (window.style.display === 'none') {
        window.style.display = 'flex';
        btn.style.display = 'none';

        // Focus input
        setTimeout(() => document.getElementById('pam-input').focus(), 100);
    } else {
        window.style.display = 'none';
        btn.style.display = 'flex';
    }
}

function handleUserInput(inputEl) {
    const text = inputEl.value.trim();
    if (!text) return;

    addMessage('user', text);
    inputEl.value = '';

    // Simulate thinking
    const typingId = showTyping();

    // Process logic
    setTimeout(() => {
        removeTyping(typingId);
        const response = generateResponse(text);
        addMessage('bot', response);
    }, 600 + Math.random() * 500);
}

function showTyping() {
    const id = Date.now();
    const msgs = document.getElementById('pam-messages');
    const bubble = document.createElement('div');
    bubble.className = 'pam-msg bot typing';
    bubble.id = `typing-${id}`;
    bubble.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    msgs.appendChild(bubble);
    msgs.scrollTop = msgs.scrollHeight;
    return id;
}

function removeTyping(id) {
    const el = document.getElementById(`typing-${id}`);
    if (el) el.remove();
}

function addMessage(sender, text) {
    const msgs = document.getElementById('pam-messages');
    const bubble = document.createElement('div');
    bubble.className = `pam-msg ${sender}`;
    // Convert newlines to breaks if needed, or simple text
    bubble.innerHTML = text.replace(/\n/g, '<br/>');
    msgs.appendChild(bubble);
    msgs.scrollTop = msgs.scrollHeight;
}

/**
 * CORE LOGIC: Searching data.json
 * Persona: Pam Beesly
 */
function generateResponse(query) {
    if (!pamData) return "Oh, hold on a second, I need to find the files... (Data not loaded yet)";

    const q = query.toLowerCase();

    // 1. The Office / Pam Persona Easter Eggs
    if (q.includes("jim")) return "Oh, Jim? He's great. He might be pranking Dwight right now. 😉";
    if (q.includes("michael")) return "Michael is... well, being Michael. I try to keep him busy.";
    if (q.includes("dwight")) return "Assistant *to* the Regional Manager. Don't tell him I said that.";
    if (q.includes("dunder") || q.includes("mifflin")) return "Dunder Mifflin, this is Pam. How can I help you today?";
    if (q.includes("art") || q.includes("paint")) return "I actually love art! I did a watercolor of the office building once. Maybe Rajesh needs a logo design?";

    // 2. Basic Greetings
    if (q.match(/^(hi|hello|hey|yo)/)) return "Hi there! 👋  Pam here. Looking for info on Rajesh's work?";
    if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("phone")) {
        return `You can email Rajesh at **${pamData.basics.email}**. <br/>I'd transfer you, but... well, this is a website.`;
    }
    if (q.includes("who are you")) return "I'm Pam Beesly, the office administrator here. I keep things organized while Rajesh codes.";

    // 3. Search Skills
    const skillMatch = findSkill(q);
    if (skillMatch) return skillMatch;

    // 4. Search Projects
    const projectMatch = findProject(q);
    if (projectMatch) return projectMatch;

    // 5. Search Experience/Work
    const workMatch = findWork(q);
    if (workMatch) return workMatch;

    // 6. Search Certifications
    const certMatch = findCert(q);
    if (certMatch) return certMatch;

    // Default Fallback
    return "I'm not sure about that one. I can check the files for his **Skills**, **Projects**, or **Experience** if you like?";
}

function findSkill(query) {
    if (!pamData.skills) return null;

    for (const cat of pamData.skills) {
        const match = cat.keywords.find(k => query.includes(k.toLowerCase()));
        if (match) {
            return `Oh yes, **${match}**! That's stored in the "${cat.name}" file. Rajesh is quite good at it.`;
        }
    }
    return null;
}

function findProject(query) {
    if (!pamData.projects) return null;

    const p = pamData.projects.find(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.keywords.some(k => query.includes(k.toLowerCase()))
    );

    if (p) {
        return `I found a project folder labeled "**${p.name}**". <br/>"${p.description}" <br/>Apparently he used: ${p.keywords.join(', ')}. neat!`;
    }

    if (query.includes("projects") || query.includes("work")) {
        const names = pamData.projects.map(p => p.name).slice(0, 3).join(", ");
        return `We have a lot of project files here. Some recent ones are: **${names}**. You can see the full list below!`;
    }

    return null;
}

function findWork(query) {
    if (!pamData.work) return null;

    const w = pamData.work.find(job => job.name.toLowerCase().includes(query) || job.summary.toLowerCase().includes(query));
    if (w) {
        return `Ah, employment history. He worked at **${w.name}** as a ${w.position}. <br/>Dates: ${w.startDate} - ${w.endDate}. <br/>"${w.summary}"`;
    }
    return null;
}

function findCert(query) {
    if (!pamData.certificates) return null;

    const c = pamData.certificates.find(cert => cert.name.toLowerCase().includes(query) || cert.issuer.toLowerCase().includes(query));
    if (c) {
        return `Yup, there's a certificate here for **${c.name}** from ${c.issuer} (${c.date}). Hanging on the fridge... I mean, wall.`;
    }
    return null;
}
