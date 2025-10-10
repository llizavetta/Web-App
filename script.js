document.addEventListener('DOMContentLoaded', () => {
    
    const sections = document.querySelectorAll('.content-area > *[id]');
    const navLinks = document.querySelectorAll('.sidebar__nav a');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(l => l.classList.remove('active'));
                
                const link = document.querySelector(`.sidebar__nav a[href="#${id}"]`);
                if (link) {
                    link.classList.add('active');
                }
            }
        });
    }, { 
        rootMargin: '0px 0px -50% 0px' 
    });

    sections.forEach(section => observer.observe(section));

    
    
    const gridViewBtn = document.getElementById('view-grid');
    const listViewBtn = document.getElementById('view-list');
    const photosContainer = document.querySelector('.photos__container');

    const switchView = (viewType) => {
        if (viewType === 'list') {
            photosContainer.classList.add('list-view');
        } else {
            photosContainer.classList.remove('list-view');
        }
        gridViewBtn.classList.remove('active-view');
        listViewBtn.classList.remove('active-view');

        if (viewType === 'list') {
            listViewBtn.classList.add('active-view');
        } else {
            gridViewBtn.classList.add('active-view');
        }
    };

    gridViewBtn.addEventListener('click', () => switchView('grid'));
    listViewBtn.addEventListener('click', () => switchView('list'));
});



// DOM Elements
const initialButtonWrapper = document.getElementById('initial-button-wrapper');
const startCvButton = document.getElementById('start-cv-button');
const cvFormWrapper = document.getElementById('cv-form-wrapper');
const cvForm = document.getElementById('cv-form');
const cvDisplayWrapper = document.getElementById('cv-display-wrapper');
const backToFormButton = document.getElementById('back-to-form');
const addPhotoButton = document.getElementById('add-photo-button');
const photoInput = document.getElementById('photo-input');
const photoText = document.getElementById('photo-text');
const dynamicText = document.getElementById('dynamic-benefit-text');

let photoBase64 = null;

const benefits = [
    "Create a CV quickly and easily",
    "Highlight your strengths among others",
    "Get a professional look without any effort",
    "Perfect even if you have no experience",
    "Download your finished CV in one click"
];

let currentBenefitIndex = 0;

function cycleBenefits() {
    if (dynamicText) {
        dynamicText.style.opacity = 0;

        setTimeout(() => {
            dynamicText.textContent = benefits[currentBenefitIndex];
            
            dynamicText.style.opacity = 1;

            currentBenefitIndex = (currentBenefitIndex + 1) % benefits.length;

        }, 500);

    }
}

if (dynamicText) {
    cycleBenefits();
    setInterval(cycleBenefits, 4000);
}



startCvButton.addEventListener('click', () => {
    initialButtonWrapper.classList.add('hidden');
    cvFormWrapper.classList.remove('hidden');
});

backToFormButton.addEventListener('click', () => {
    cvDisplayWrapper.classList.add('hidden');
    cvFormWrapper.classList.remove('hidden');
});


addPhotoButton.addEventListener('click', () => {
    photoInput.click();
});

photoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        photoText.textContent = `Photo: ${file.name}`;
        const reader = new FileReader();
        reader.onload = (e) => {
            photoBase64 = e.target.result; 
        };
        reader.readAsDataURL(file);
    } else {
        photoText.textContent = 'Add photo';
        photoBase64 = null;
    }
});


cvForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = {
        fullName: document.getElementById('full-name').value,
        gender: document.getElementById('gender').value || 'Not specified',
        dateOfBirth: document.getElementById('date-of-birth').value,
        placeOfBirth: document.getElementById('place-of-birth').value || 'Not specified',
        citizenship: document.getElementById('citizenship').value || 'Not specified',
        maritalStatus: document.getElementById('marital-status').value || 'Not specified',
        homeAddress: document.getElementById('home-address').value || 'Not specified',
        phone: document.getElementById('phone').value || 'Not specified',
        email: document.getElementById('email').value || 'Not specified',
        workExperience: document.getElementById('work-experience').value || 'Not specified',
        photo: photoBase64 
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    document.getElementById('display-full-name').textContent = data.fullName;
    document.getElementById('display-email').textContent = data.email;
    document.getElementById('display-phone').textContent = data.phone;
    document.getElementById('display-address').textContent = data.homeAddress;
    document.getElementById('display-dob').textContent = formatDate(data.dateOfBirth);
    document.getElementById('display-citizenship').textContent = data.citizenship;
    document.getElementById('display-marital-status').textContent = data.maritalStatus;
    document.getElementById('display-gender').textContent = data.gender;
    document.getElementById('display-pob').textContent = data.placeOfBirth;
    document.getElementById('display-work-experience').textContent = data.workExperience;

    const displayPhotoElement = document.getElementById('display-photo');
    displayPhotoElement.innerHTML = '';

    if (data.photo) {
        const img = document.createElement('img');
        img.src = data.photo;
        img.alt = `Photo of ${data.fullName}`;
        displayPhotoElement.appendChild(img);
    } else {
        displayPhotoElement.innerHTML = '<i class="ph-bold ph-user" style="font-size: 40px;"></i>';
    }

    cvFormWrapper.classList.add('hidden');
    cvDisplayWrapper.classList.remove('hidden');
});
