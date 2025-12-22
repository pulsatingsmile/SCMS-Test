import { Storage } from '../core/storage.js';
import { $, $$ } from '../core/utils.js';
import { Toast } from '../core/components.js';

let skills = [];

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
});

function loadProfile() {
    // 1. Get the currently logged-in user ID
    const currentUserId = Storage.get('scms-user-id', null);
    const currentUserName = Storage.get('scms-username', 'Student');
    
    // Safety check: if no ID is found, redirect to login
    if (!currentUserId) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Try to find this user in the registration database
    const allUsers = Storage.get('scms_users', []);
    const registeredUser = allUsers.find(u => u.id === currentUserId);

    // 3. Define Defaults based on Registration Data
    const defaultName = registeredUser ? registeredUser.name : currentUserName;
    const defaultID = registeredUser ? registeredUser.id : currentUserId;

    // 4. Get Profile Data (Unique to this user ID)
    // We construct a dynamic key: scms-profile-USERID
    let profile = Storage.get(`scms-profile-${currentUserId}`, null);
    
    if (!profile) {
        // Create fresh profile if none exists for this specific ID
        profile = {
            name: defaultName,
            id: defaultID,
            major: 'Computer Science',
            year: 'Year 1',
            email: `${defaultName.toLowerCase().replace(/\s+/g, '.')}@student.cadt.edu.kh`,
            linkedin: '',
            github: '',
            bio: '',
            skills: ['Student'],
            avatar: null
        };
    }

    // 5. Populate Inputs
    if($('#inp-name')) $('#inp-name').value = profile.name;
    if($('#inp-id')) $('#inp-id').value = profile.id;
    if($('#inp-major')) $('#inp-major').value = profile.major;
    if($('#inp-year')) $('#inp-year').value = profile.year;
    if($('#inp-email')) $('#inp-email').value = profile.email;
    if($('#inp-linkedin')) $('#inp-linkedin').value = profile.linkedin;
    if($('#inp-github')) $('#inp-github').value = profile.github;
    if($('#inp-bio')) $('#inp-bio').value = profile.bio;

    // 6. Load Skills
    skills = profile.skills || ['Student'];
    renderSkills();

    // 7. Update Display Text (Left Card)
    if($('#display-name')) $('#display-name').textContent = profile.name;
    if($('#display-id')) $('#display-id').textContent = `ID: ${profile.id}`;

    // 8. Update Avatar
    if (profile.avatar) {
        $('#avatar-img').src = profile.avatar;
        $('#avatar-img').classList.remove('hidden');
        $('#avatar-initial').classList.add('hidden');
    } else {
        $('#avatar-initial').textContent = profile.name.charAt(0).toUpperCase();
        $('#avatar-img').classList.add('hidden');
        $('#avatar-initial').classList.remove('hidden');
    }
}

// --- SKILLS LOGIC ---
function renderSkills() {
    const container = document.getElementById('skills-container');
    const input = document.getElementById('inp-skills');
    
    if(!container) return;

    // Clear current tags
    Array.from(container.getElementsByClassName('skill-tag')).forEach(el => el.remove());
    
    // Add tags
    skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag bg-gray-200 text-text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1 cursor-default';
        tag.innerHTML = `${skill} <button type="button" onclick="removeSkill('${skill}')" class="hover:text-red-500 font-bold ml-1">×</button>`;
        container.insertBefore(tag, input);
    });
}

const skillInput = document.getElementById('inp-skills');
if(skillInput) {
    skillInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.target.value.trim();
            if (val && !skills.includes(val)) {
                skills.push(val);
                renderSkills();
                e.target.value = '';
            }
        }
    });
}

window.removeSkill = (skill) => {
    skills = skills.filter(s => s !== skill);
    renderSkills();
};

// --- FORM SUBMIT ---
window.saveProfile = (e) => {
    e.preventDefault();

    const currentUserId = Storage.get('scms-user-id', null);

    const newProfile = {
        name: $('#inp-name').value,
        id: $('#inp-id').value,
        major: $('#inp-major').value,
        year: $('#inp-year').value,
        email: $('#inp-email').value,
        linkedin: $('#inp-linkedin').value,
        github: $('#inp-github').value,
        bio: $('#inp-bio').value,
        skills: skills,
        avatar: $('#avatar-img').src !== window.location.href ? $('#avatar-img').src : null
    };

    // Save to LocalStorage with UNIQUE Key
    Storage.set(`scms-profile-${currentUserId}`, newProfile);
    
    // Also update the dashboard username
    Storage.set('scms-username', newProfile.name);

    Toast.show('Profile updated successfully!');
    
    // Refresh display details immediately
    $('#display-name').textContent = newProfile.name;
    
    // Force Navbar update if available
    if(window.updateNavbarAvatar) window.updateNavbarAvatar();
};

// --- IMAGE UPLOAD ---
window.handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            $('#avatar-img').src = event.target.result;
            $('#avatar-img').classList.remove('hidden');
            $('#avatar-initial').classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
};

// --- PASSWORD MODAL ---
window.togglePasswordModal = (show) => {
    const modal = document.getElementById('password-modal');
    if (show) modal.classList.remove('hidden');
    else modal.classList.add('hidden');
    
    if(!show) document.querySelector('#password-modal form').reset();
};

window.handlePasswordChange = (e) => {
    e.preventDefault();
    
    const currentPwd = document.getElementById('pwd-current').value;
    const newPwd = document.getElementById('pwd-new').value;
    const confirmPwd = document.getElementById('pwd-confirm').value;

    if (newPwd !== confirmPwd) {
        alert("New passwords do not match!");
        return;
    }

    const users = Storage.get('scms_users', []);
    const currentUserID = $('#inp-id').value; 
    
    const userIndex = users.findIndex(u => u.id === currentUserID);
    
    if (userIndex !== -1) {
        if (users[userIndex].pass !== currentPwd) {
            alert("Current password is incorrect!");
            return;
        }

        users[userIndex].pass = newPwd;
        Storage.set('scms_users', users);
        
        Toast.show("Password updated successfully!");
        window.togglePasswordModal(false);
    } else {
        alert("Password updated successfully! (Demo Mode)");
        window.togglePasswordModal(false);
    }
};