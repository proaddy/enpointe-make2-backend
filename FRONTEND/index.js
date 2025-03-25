// API Endpoints
const API_ENDPOINTS = {
    uploadCSV: "http://localhost:5000/upload/file",
    createJob: "http://localhost:5000/job/create-job",
    updateJob: "http://localhost:5000/job/update-job",
    deleteJob: "http://localhost:5000/job/delete-job",
    fetchJobs: "http://localhost:5000/job/jobs",
    groupJobs: "http://localhost:5000/group/email",
    uniqueJob: "http://localhost:5000/group/unique",
};

let page_number = 1;
let items_per_page = 10;

// Pagination buttons
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");

prevButton.addEventListener("click", function () {
    if (page_number > 1) {
        page_number -= 1;
        fetchJobs(page_number);
    }
});
nextButton.addEventListener("click", function () {
    page_number += 1;
    fetchJobs(page_number);
});

// CSV Upload
document.getElementById("uploadCsvBtn").addEventListener("click", uploadCSV);

function uploadCSV() {
    const fileInput = document.getElementById("csvFileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a CSV file");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch(API_ENDPOINTS.uploadCSV, {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            alert("CSV uploaded successfully");
            fetchJobs(); // Refresh job listings
        })
        .catch((error) => {
            console.error("CSV upload error:", error);
            alert("Error uploading CSV");
        });
}

// Create Job Form
document.getElementById("jobPostingForm").addEventListener("submit", createJob);

function createJob(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const jobData = Object.fromEntries(formData.entries());

    // Convert empty strings to undefined
    Object.keys(jobData).forEach((key) => {
        if (jobData[key] === "") {
            jobData[key] = undefined;
        }
    });

    if (jobData["salaryDetails"]) {
        jobData["showSalary"] = true;
    } else {
        jobData["showSalary"] = false;
    }

    console.log(jobData);

    fetch(API_ENDPOINTS.createJob, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            alert("Job created successfully");
            form.reset();
            fetchJobs(); // Refresh job listings
        })
        .catch((error) => {
            console.error("Job creation error:", error);
            alert("Error creating job");
        });
}

// Update Job Form
document.getElementById("jobUpdateForm").addEventListener("submit", updateJob);

function updateJob(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const jobData = Object.fromEntries(formData.entries());

    // Convert empty strings to undefined
    Object.keys(jobData).forEach((key) => {
        if (jobData[key] === "") {
            jobData[key] = undefined;
        }
    });
    if (jobData["salaryDetails"]) {
        jobData["showSalary"] = true;
    } else {
        jobData["showSalary"] = false;
    }
    console.log(jobData);
    const { id, ...filteredJobData } = jobData; // only to stop the id property to be sent to the api endpoint
    fetch(`${API_ENDPOINTS.updateJob}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredJobData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            alert("Job updated successfully");
            form.reset();
            document.getElementById("updateFormSection").style.display = "none";
            fetchJobs(); // Refresh job listings
        })
        .catch((error) => {
            console.error("Job update error:", error);
            alert("Error updating job");
        });
}

// Fetch Jobs
function fetchJobs(page = 1, items = 10) {
    console.log(page, items);
    fetch(
        `${API_ENDPOINTS.fetchJobs}?page_number=${page}&items_per_page=${items}`
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            const jobListingsBody = document.getElementById("jobListingsBody");
            jobListingsBody.innerHTML = ""; // Clear existing rows
            console.log(data);

            if (page > 1) {
                prevButton.classList.remove("hide");
            } else {
                prevButton.classList.add("hide");
            }
            if (page < Math.ceil(data.count / 10)) {
                nextButton.classList.remove("hide");
            } else {
                nextButton.classList.add("hide");
            }

            data.jobs.data.forEach((job) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${job.title || "N/A"}</td>
                <td>${job.company || "N/A"}</td>
                <td>${job.location || "N/A"}</td>
                <td>${job.salary_details || "N/A"}</td>
                <td class="action-btns">
                    <button onclick="prepareUpdateForm(${
                        job.id
                    })" class="btn btn-blue">Update</button>
                    <button onclick="deleteJob(${
                        job.id
                    })" class="btn btn-red">Delete</button>
                </td>
            `;
                jobListingsBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Fetch jobs error:", error);
            alert("Error fetching jobs");
        });
}

// Prepare Update Form
function prepareUpdateForm(jobId) {
    const updateFormSection = document.getElementById("updateFormSection");
    document.getElementById("updateJobId").value = jobId;
    updateFormSection.style.display = "block";
}

// Delete Job
function deleteJob(jobId) {
    fetch(`${API_ENDPOINTS.deleteJob}/${jobId}`, {
        method: "DELETE",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            alert("Job deleted successfully");
            fetchJobs(); // Refresh job listings
        })
        .catch((error) => {
            console.error("Job deletion error:", error);
            alert("Error deleting job");
        });
}

// Group Jobs
document.getElementById("groupemail").addEventListener('click', groupEmail);

function groupEmail() {
    fetch(`${API_ENDPOINTS.groupJobs}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            const emailListingBody = document.getElementById("emailListingBody");
            emailListingBody.innerHTML = "";

            data.result.forEach((job) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${job.email || "N/A"}</td>
                <td>${job.count || "N/A"}</td>
            `;
            emailListingBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Fetch jobs error:", error);
            alert("Error fetching jobs");
        });
};

// Unique Jobs from Group Job
document.getElementById("groupunique").addEventListener('click', uniqueEmail);
function uniqueEmail() {
    fetch(`${API_ENDPOINTS.uniqueJob}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            const uniqueListingBody = document.getElementById("uniqueListingBody");
            uniqueListingBody.innerHTML = "";
            
            data.result.forEach((job) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${job.title || "N/A"}</td>
                <td>${job.email || "N/A"}</td>
            `;
            uniqueListingBody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Fetch jobs error:", error);
            alert("Error fetching jobs");
        });
};


// Initial fetch of jobs when page loads
document.addEventListener("DOMContentLoaded", fetchJobs(page_number));
