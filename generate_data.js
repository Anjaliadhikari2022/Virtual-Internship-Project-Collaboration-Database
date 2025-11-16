// generate_data.js
// Node.js script to create multiple SQL files with realistic dummy data
// Usage: node generate_data.js
// Make sure a folder named "Database" exists in the same directory.

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'Database');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const cfg = {
  users: 3220,        // 3000 students, 200 mentors, 20 admins
  students: 3000,
  mentors: 200,
  admins: 20,
  internships: 300,
  projects: 200,
  applications: 1500,
  team: 800,
  tasks: 600,
  resources: 200
};

const firstNames = ["Aarav","Vivaan","Aditya","Sai","Ishaan","Arjun","Karan","Rohan","Ananya","Priya","Sakshi","Riya","Sneha","Neha","Shreya","Aditi","Tanvi","Isha","Ritika","Anika","Vishal","Amit","Suresh","Rakesh","Rahul","Akhil","Meera","Divya","Nisha","Pooja"];
const lastNames = ["Sharma","Verma","Singh","Patel","Kumar","Gupta","Reddy","Mehta","Nair","Iyer","Joshi","Chauhan","Khan","Das","Bose","Chatterjee","Saxena","Kapoor","Malhotra","Shah"];
const companies = ["Infosys","TCS","Wipro","Cognizant","IBM","Microsoft","Google","Amazon","Flipkart","Paytm","Zoho","Freshworks","MakeMyTrip","Accenture","Deloitte","Capgemini","Oracle","SAP","HCL","Siemens"];
const skills = ["Java","Python","C++","SQL","NoSQL","JavaScript","React","Node.js","Express","Django","Flask","HTML","CSS","Machine Learning","Data Science","TensorFlow","Keras","AWS","Azure","Docker","Kubernetes","Git","REST APIs"];
const internshipTitles = ["Backend Developer Intern","Frontend Intern","Data Science Intern","Machine Learning Intern","Full Stack Intern","DevOps Intern","QA Intern","Mobile App Intern","UI/UX Intern","Research Intern"];
const projectTitles = ["E-Commerce Platform","Chat Application","Library Management System","Attendance Tracker","Resume Builder","Expense Manager","Task Planner","Project Collaboration Tool","Portfolio Website","Online Examination System"];
const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac lacus nec arcu pulvinar tincidunt.";

function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function pick(arr){ return arr[randInt(0, arr.length-1)]; }
function randName(){ return `${pick(firstNames)} ${pick(lastNames)}`; }
function randEmail(name, idx){
  const n = name.toLowerCase().replace(/[^a-z]/g,'').slice(0,12);
  const domains = ["example.com","mail.com","student.edu","company.org"];
  return `${n}${idx}@${pick(domains)}`;
}
function randSkills(){
  const count = randInt(1,5);
  let s = new Set();
  while(s.size < count) s.add(pick(skills));
  return Array.from(s).join(', ');
}
function randDate(startYear=2020, endYear=2025){
  const y = randInt(startYear, endYear);
  const m = randInt(1,12);
  const d = randInt(1, (new Date(y, m, 0)).getDate());
  return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

// Helper to write file
function writeFile(name, content){
  fs.writeFileSync(path.join(OUT_DIR, name), content, 'utf8');
  console.log(`Wrote ${name}`);
}

// 1) USERS
(function generateUsers(){
  const total = cfg.users;
  const lines = [];
  lines.push('-- Insert users');
  for(let i=1; i<=total; i++){
    let role = 'student';
    if(i > cfg.students + cfg.mentors) role = 'admin';           // last admins
    else if(i > cfg.students) role = 'mentor';                   // mentors after students
    const name = randName();
    const email = randEmail(name, i);
    const password = 'password123'; // placeholder; you can hash later
    const skillsText = role === 'student' ? randSkills() : (role === 'mentor' ? randSkills() : 'admin');
    const safeName = name.replace(/'/g, "\\'");
    const safeSkills = skillsText.replace(/'/g, "\\'");
    lines.push(`INSERT INTO users (user_id, name, email, password, role, skills) VALUES (${i}, '${safeName}', '${email}', '${password}', '${role}', '${safeSkills}');`);
  }
  writeFile('users.sql', lines.join('\n'));
})();

// 2) INTERNSHIPS
(function generateInternships(){
  const lines = ['-- Insert internships'];
  for(let i=1;i<=cfg.internships;i++){
    const title = `${pick(internshipTitles)} - ${pick(companies)}`;
    const desc = `${lorem} Internship opportunity at ${pick(companies)}.`;
    const company = pick(companies);
    const durationWeeks = randInt(4,24);
    // Choose a mentor id from mentors range (students+1 .. students+mentors)
    const mentorId = randInt(cfg.students+1, cfg.students+cfg.mentors);
    const start = randDate(2023,2025);
    const end = new Date(start);
    end.setDate(end.getDate() + durationWeeks*7);
    const endStr = `${end.getFullYear()}-${String(end.getMonth()+1).padStart(2,'0')}-${String(end.getDate()).padStart(2,'0')}`;
    lines.push(`INSERT INTO internships (internship_id, title, description, company_name, duration, start_date, end_date, mentor_id) VALUES (${i}, '${title.replace(/'/g,"\\'")}', '${desc.replace(/'/g,"\\'")}', '${company}', ${durationWeeks}, '${start}', '${endStr}', ${mentorId});`);
  }
  writeFile('internships.sql', lines.join('\n'));
})();

// 3) PROJECTS
(function generateProjects(){
  const lines = ['-- Insert projects'];
  for(let i=1;i<=cfg.projects;i++){
    const title = `${pick(projectTitles)} (${i})`;
    const desc = `${lorem} Project mentored by industry professional.`;
    const mentorId = randInt(cfg.students+1, cfg.students+cfg.mentors);
    const start = randDate(2022,2025);
    const end = new Date(start);
    end.setDate(end.getDate() + randInt(30, 365));
    const endStr = `${end.getFullYear()}-${String(end.getMonth()+1).padStart(2,'0')}-${String(end.getDate()).padStart(2,'0')}`;
    lines.push(`INSERT INTO projects (project_id, title, description, start_date, end_date, mentor_id) VALUES (${i}, '${title.replace(/'/g,"\\'")}', '${desc.replace(/'/g,"\\'")}', '${start}', '${endStr}', ${mentorId});`);
  }
  writeFile('projects.sql', lines.join('\n'));
})();

// 4) APPLICATIONS
(function generateApplications(){
  const lines = ['-- Insert applications'];
  const appSet = new Set();
  let count = 0;
  while(count < cfg.applications){
    const studentId = randInt(1, cfg.students);
    const internshipId = randInt(1, cfg.internships);
    const key = `${studentId}-${internshipId}`;
    if(appSet.has(key)) continue;
    appSet.add(key);
    const statusRand = Math.random();
    let status = 'applied';
    if(statusRand < 0.10) status = 'accepted';
    else if(statusRand < 0.18) status = 'rejected';
    lines.push(`INSERT INTO applications (application_id, student_id, internship_id, status) VALUES (${count+1}, ${studentId}, ${internshipId}, '${status}');`);
    count++;
  }
  writeFile('applications.sql', lines.join('\n'));
})();

// 5) TEAM (project-team mapping)
(function generateTeam(){
  const lines = ['-- Insert team assignments'];
  const pairSet = new Set();
  let count = 0;
  while(count < cfg.team){
    const projectId = randInt(1, cfg.projects);
    const studentId = randInt(1, cfg.students);
    const key = `${projectId}-${studentId}`;
    if(pairSet.has(key)) continue;
    pairSet.add(key);
    const roles = ['Developer','Tester','UI/UX','Team Lead','Documentation','DevOps'];
    const role = pick(roles);
    lines.push(`INSERT INTO team (team_id, project_id, student_id, role_in_team) VALUES (${count+1}, ${projectId}, ${studentId}, '${role}');`);
    count++;
  }
  writeFile('team.sql', lines.join('\n'));
})();

// 6) TASKS
(function generateTasks(){
  const lines = ['-- Insert tasks'];
  for(let i=1;i<=cfg.tasks;i++){
    const projectId = randInt(1, cfg.projects);
    const assignedTo = randInt(1, cfg.students);
    const desc = `Task ${i}: ${pick(['Implement feature','Fix bug','Write tests','Create UI','Integrate API','Deploy service'])} - ${lorem}`;
    const deadline = randDate(2023,2026);
    const s = Math.random();
    let status = 'pending';
    if(s < 0.5) status = 'pending';
    else if(s < 0.85) status = 'in-progress';
    else status = 'completed';
    lines.push(`INSERT INTO tasks (task_id, project_id, assigned_to, description, deadline, status) VALUES (${i}, ${projectId}, ${assignedTo}, '${desc.replace(/'/g,"\\'")}', '${deadline}', '${status}');`);
  }
  writeFile('tasks.sql', lines.join('\n'));
})();

// 7) RESOURCES
(function generateResources(){
  const lines = ['-- Insert resources'];
  for(let i=1;i<=cfg.resources;i++){
    const projectId = randInt(1, cfg.projects);
    // uploaded_by: random student or mentor
    const uploader = Math.random() < 0.85 ? randInt(1, cfg.students) : randInt(cfg.students+1, cfg.students+cfg.mentors);
    const link = `https://storage.example.com/project_${projectId}/resource_${i}.pdf`;
    const desc = `Resource ${i} for project ${projectId}`;
    lines.push(`INSERT INTO resources (resource_id, project_id, uploaded_by, file_link, description) VALUES (${i}, ${projectId}, ${uploader}, '${link}', '${desc.replace(/'/g,"\\'")}');`);
  }
  writeFile('resources.sql', lines.join('\n'));
})();

console.log('\nAll files generated in the Database/ folder:');
console.log('- users.sql');
console.log('- internships.sql');
console.log('- projects.sql');
console.log('- applications.sql');
console.log('- team.sql');
console.log('- tasks.sql');
console.log('- resources.sql');
console.log('\nNext: Import them into your internship_portal database in phpMyAdmin (import or paste under SQL).');
