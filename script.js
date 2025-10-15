document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".content-area > *[id]");
  const navLinks = document.querySelectorAll(".sidebar__nav a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");

          navLinks.forEach((l) => l.classList.remove("active"));

          const link = document.querySelector(`.sidebar__nav a[href="#${id}"]`);
          if (link) {
            link.classList.add("active");
          }
        }
      });
    },
    {
      rootMargin: "0px 0px -50% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));

  const gridViewBtn = document.getElementById("view-grid");
  const listViewBtn = document.getElementById("view-list");
  const photosContainer = document.querySelector(".photos__container");

  const switchView = (viewType) => {
    if (viewType === "list") {
      photosContainer.classList.add("list-view");
    } else {
      photosContainer.classList.remove("list-view");
    }
    gridViewBtn.classList.remove("active-view");
    listViewBtn.classList.remove("active-view");

    if (viewType === "list") {
      listViewBtn.classList.add("active-view");
    } else {
      gridViewBtn.classList.add("active-view");
    }
  };

  gridViewBtn.addEventListener("click", () => switchView("grid"));
  listViewBtn.addEventListener("click", () => switchView("list"));
});



let cvsData = [];
let currentCvIndex = -1;
let photoBase64 = null;

const initialButtonWrapper = document.getElementById("initial-button-wrapper");
const startCvButton = document.getElementById("start-cv-button");
const cvFormWrapper = document.getElementById("cv-form-wrapper");
const cvForm = document.getElementById("cv-form");
const backToListBtn = document.getElementById("back-to-list-btn");
const cvCollectionManager = document.getElementById("cv-collection-manager");
const cvsListContainer = document.getElementById("cvs-list");
const backToFormButton = document.getElementById("back-to-form");
const addPhotoButton = document.getElementById("add-photo-button");
const photoInput = document.getElementById("photo-input");
const photoText = document.getElementById("photo-text");
const dynamicText = document.getElementById("dynamic-benefit-text");

const addNewCvBtn = document.getElementById("add-new-cv-btn");
const deleteCurrentCvBtn = document.getElementById("delete-current-cv-btn");
const prevCvBtn = document.getElementById("prev-cv-btn");
const nextCvBtn = document.getElementById("next-cv-btn");
const cvCounter = document.getElementById("cv-counter");
const paginationControls = document.getElementById("pagination-controls");


const benefits = [
    "Create a CV quickly and easily",
    "Highlight your strengths among others",
    "Get a professional look without any effort",
    "Perfect even if you have no experience",
    "Download your finished CV in one click",
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


const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch (e) {
        return dateString;
    }
};


function createCvDisplayHtml(data, index) {
    const formattedDob = formatDate(data.dateOfBirth);
    const photoContent = data.photo 
        ? `<img src="${data.photo}" alt="Photo of ${data.fullName}">` 
        : '<i class="ph-bold ph-user" style="font-size: 40px;"></i>';

    return `
        <div class="single-cv-display" data-index="${index}" id="cv-display-${index}">
            <div class="cv-header">
                <h1 class="cv-name">${data.fullName}</h1>
                <div class="cv-photo-placeholder" id="display-photo-${index}">
                    ${photoContent}
                </div>
            </div>

            <div class="cv-section">
                <h2>Contact and Personal Information</h2>
                <div class="cv-details-grid">
                    <div class="cv-item"><i
                            class="ph-bold ph-envelope-simple"></i><strong>Email:</strong><span>${data.email}</span></div>
                    <div class="cv-item"><i class="ph-bold ph-phone"></i><strong>Phone:</strong><span>${data.phone}</span></div>
                    <div class="cv-item"><i class="ph-bold ph-house-line"></i><strong>Address:</strong><span>${data.homeAddress}</span></div>
                    <div class="cv-item"><i class="ph-bold ph-cake"></i><strong>Date of Birth:</strong><span>${formattedDob}</span></div>
                    <div class="cv-item"><i
                            class="ph-bold ph-globe-simple"></i><strong>Citizenship:</strong><span>${data.citizenship}</span></div>
                    <div class="cv-item"><i class="ph-bold ph-heart"></i><strong>Marital
                            Status:</strong><span>${data.maritalStatus}</span></div>
                    <div class="cv-item"><i
                            class="ph-bold ph-gender-neuter"></i><strong>Gender:</strong><span>${data.gender}</span></div>
                    <div class="cv-item"><i class="ph-bold ph-map-pin"></i><strong>Place of
                            Birth:</strong><span>${data.placeOfBirth}</span></div>
                </div>
            </div>

            <div class="cv-section">
                <h2>Work Experience and Education</h2>
                <div class="cv-experience">
                    <p>${data.workExperience}</p>
                </div>
            </div>

            <button data-index="${index}" class="back-button edit-cv-btn">
                <i class="ph-bold ph-pencil-simple"></i> Edit CV
            </button>
        </div>
    `;
}

function showCv(index) {
    if (index >= 0 && index < cvsData.length) {
        document.querySelectorAll('.single-cv-display').forEach(cvEl => {
            cvEl.classList.add('cv-hidden');
        });

        const targetCv = document.getElementById(`cv-display-${index}`);
        if (targetCv) {
            targetCv.classList.remove('cv-hidden');
            currentCvIndex = index;
            
            updatePaginationControls();
        }
    }
}


function updatePaginationControls() {
    const total = cvsData.length;
    
    if (total === 0) {
        cvCounter.textContent = 'No CVs yet';
        paginationControls.classList.add('hidden');
        deleteCurrentCvBtn.classList.add('hidden');
        cvCollectionManager.classList.add("hidden");
        if (!cvFormWrapper.classList.contains("hidden")) {
        } else if (initialButtonWrapper && initialButtonWrapper.classList.contains("hidden")) {
            cvFormWrapper.classList.remove("hidden");
        } else if (initialButtonWrapper) {
            initialButtonWrapper.classList.remove("hidden");
        }
        return;
    }

    cvCollectionManager.classList.remove("hidden");
    paginationControls.classList.remove('hidden');
    deleteCurrentCvBtn.classList.remove('hidden');

    const currentNumber = currentCvIndex + 1;
    cvCounter.textContent = `CV ${currentNumber} of ${total}`;

    prevCvBtn.disabled = currentCvIndex === 0;
    nextCvBtn.disabled = currentCvIndex === total - 1;
}

function loadCvToForm(data) {
    document.getElementById("full-name").value = data.fullName;
    document.getElementById("gender").value = data.gender;
    document.getElementById("date-of-birth").value = data.dateOfBirth;
    document.getElementById("place-of-birth").value = data.placeOfBirth;
    document.getElementById("citizenship").value = data.citizenship;
    document.getElementById("marital-status").value = data.maritalStatus;
    document.getElementById("home-address").value = data.homeAddress;
    document.getElementById("phone").value = data.phone;
    document.getElementById("email").value = data.email;
    document.getElementById("work-experience").value = data.workExperience;
    
    photoBase64 = data.photo;
    photoText.textContent = data.photo ? "Photo uploaded" : "Add photo";
}


function clearForm() {
    cvForm.reset();
    photoBase64 = null;
    photoText.textContent = "Add photo";
    cvForm.setAttribute('data-editing-index', -1); 
}



if (startCvButton) {
    startCvButton.addEventListener("click", () => {
        initialButtonWrapper.classList.add("hidden");
        clearForm();
        cvFormWrapper.classList.remove("hidden");
    });
}


cvForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newCvData = {
        fullName: document.getElementById("full-name").value,
        gender: document.getElementById("gender").value || "Not specified",
        dateOfBirth: document.getElementById("date-of-birth").value,
        placeOfBirth: document.getElementById("place-of-birth").value || "Not specified",
        citizenship: document.getElementById("citizenship").value || "Not specified",
        maritalStatus: document.getElementById("marital-status").value || "Not specified",
        homeAddress: document.getElementById("home-address").value || "Not specified",
        phone: document.getElementById("phone").value || "Not specified",
        email: document.getElementById("email").value || "Not specified",
        workExperience: document.getElementById("work-experience").value || "Not specified",
        photo: photoBase64,
    };

    const editingIndex = parseInt(cvForm.getAttribute('data-editing-index'));

    if (editingIndex !== -1 && editingIndex < cvsData.length) {
        cvsData[editingIndex] = newCvData;
        
        const oldCvEl = document.getElementById(`cv-display-${editingIndex}`);
        if (oldCvEl) {
            oldCvEl.outerHTML = createCvDisplayHtml(newCvData, editingIndex);
            currentCvIndex = editingIndex;
        }
    } else {

        cvsData.push(newCvData);
        const newIndex = cvsData.length - 1;
        
        cvsListContainer.insertAdjacentHTML('beforeend', createCvDisplayHtml(newCvData, newIndex));
        currentCvIndex = newIndex;
    }

    attachEditListeners();

    cvFormWrapper.classList.add("hidden");
    cvCollectionManager.classList.remove("hidden");
    showCv(currentCvIndex);
    updatePaginationControls();
});


addPhotoButton.addEventListener("click", () => {
    photoInput.click();
});

photoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        photoText.textContent = `Photo: ${file.name}`;
        const reader = new FileReader();
        reader.onload = (e) => {
            photoBase64 = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        photoText.textContent = "Add photo";
        photoBase64 = null;
    }
});

addNewCvBtn.addEventListener("click", () => {
    cvCollectionManager.classList.add("hidden");
    clearForm();
    cvFormWrapper.classList.remove("hidden");
});

function attachEditListeners() {
    document.querySelectorAll('.edit-cv-btn').forEach(button => {
        button.onclick = (e) => {
            const indexToEdit = parseInt(e.currentTarget.getAttribute('data-index'));
            if (indexToEdit >= 0 && indexToEdit < cvsData.length) {
                cvForm.setAttribute('data-editing-index', indexToEdit); 
                loadCvToForm(cvsData[indexToEdit]);
                
                cvCollectionManager.classList.add("hidden");
                cvFormWrapper.classList.remove("hidden");
            }
        };
    });
}

backToListBtn.addEventListener("click", () => {
    cvFormWrapper.classList.add("hidden");

    if (cvsData.length > 0) {
        cvCollectionManager.classList.remove("hidden");
        showCv(currentCvIndex !== -1 ? currentCvIndex : 0);
    } else {
        initialButtonWrapper.classList.remove("hidden");
    }
    
    cvForm.setAttribute('data-editing-index', -1);
    clearForm(); 
});

prevCvBtn.addEventListener("click", () => {
    if (currentCvIndex > 0) {
        showCv(currentCvIndex - 1);
    }
});

nextCvBtn.addEventListener("click", () => {
    if (currentCvIndex < cvsData.length - 1) {
        showCv(currentCvIndex + 1);
    }
});

deleteCurrentCvBtn.addEventListener("click", () => {
    if (currentCvIndex !== -1 && cvsData.length > 0) {
        cvsData.splice(currentCvIndex, 1);
        
        const cvElToRemove = document.getElementById(`cv-display-${currentCvIndex}`);
        if (cvElToRemove) {
            cvElToRemove.remove();
        }

        if (cvsData.length > 0) {
            let newIndex = currentCvIndex;
            if (newIndex >= cvsData.length) {
                newIndex = cvsData.length - 1;
            }
            cvsListContainer.innerHTML = '';
            cvsData.forEach((cv, index) => {
                cvsListContainer.insertAdjacentHTML('beforeend', createCvDisplayHtml(cv, index));
            });
            attachEditListeners();
            showCv(newIndex);
        } else {
            currentCvIndex = -1;
        }
        
        updatePaginationControls();
    }
});


document.addEventListener("DOMContentLoaded", () => {
    clearForm();
    updatePaginationControls();
    const sections = document.querySelectorAll(".content-area > *[id]");
    const navLinks = document.querySelectorAll(".sidebar__nav a");
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach((l) => l.classList.remove("active"));
                    const link = document.querySelector(`.sidebar__nav a[href="#${id}"]`);
                    if (link) {
                        link.classList.add("active");
                    }
                }
            });
        },
        { rootMargin: "0px 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));

    const gridViewBtn = document.getElementById("view-grid");
    const listViewBtn = document.getElementById("view-list");
    const photosContainer = document.querySelector(".photos__container");
    const switchView = (viewType) => {
        if (viewType === "list") {
            photosContainer.classList.add("list-view");
        } else {
            photosContainer.classList.remove("list-view");
        }
        if (gridViewBtn) gridViewBtn.classList.remove("active-view");
        if (listViewBtn) listViewBtn.classList.remove("active-view");
        if (viewType === "list" && listViewBtn) {
            listViewBtn.classList.add("active-view");
        } else if (gridViewBtn) {
            gridViewBtn.classList.add("active-view");
        }
    };
    if (gridViewBtn) gridViewBtn.addEventListener("click", () => switchView("grid"));
    if (listViewBtn) listViewBtn.addEventListener("click", () => switchView("list"));
});
