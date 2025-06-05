const loginBtn = document.getElementById("login-btn");
const userRoleSpan = document.getElementById("user-role");
const storyFormSection = document.getElementById("story-form-section");
const storyForm = document.getElementById("story-form");
const storiesContainer = document.getElementById("stories-container");

let currentUser = {
    username: "guest",
    role: "guest" // roles: guest, user, admin
};

let stories = [];

function renderUI() {
    userRoleSpan.textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    loginBtn.textContent = currentUser.role === "guest" ? "Login" : "Logout";

    storyFormSection.classList.toggle("hidden", currentUser.role === "guest");
    renderStories();
}

function renderStories() {
    storiesContainer.innerHTML = "";

    stories.forEach((story, index) => {
        const card = document.createElement("div");
        card.className = "story-card";

        const contentDiv = document.createElement("div");
        contentDiv.className = "story-content";
        contentDiv.innerHTML = `<h3>${story.title}</h3><p>${story.content}</p><small>by ${story.author}</small>`;

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "story-actions";

        if (currentUser.role === "admin" || story.author === currentUser.username) {
            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.onclick = () => editStory(index);
            actionsDiv.appendChild(editBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = () => deleteStory(index);
            actionsDiv.appendChild(deleteBtn);
        }

        card.appendChild(contentDiv);
        card.appendChild(actionsDiv);
        storiesContainer.appendChild(card);
    });
}

function editStory(index) {
    const story = stories[index];
    const newTitle = prompt("Edit Title", story.title);
    const newContent = prompt("Edit Content", story.content);
    if (newTitle && newContent) {
        stories[index].title = newTitle;
        stories[index].content = newContent;
        renderStories();
    }
}

function deleteStory(index) {
    if (confirm("Are you sure you want to delete this story?")) {
        stories.splice(index, 1);
        renderStories();
    }
}

storyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("story-title").value.trim();
    const content = document.getElementById("story-content").value.trim();

    if (title && content) {
        stories.push({
            title,
            content,
            author: currentUser.username
        });

        storyForm.reset();
        renderStories();
    }
});

loginBtn.addEventListener("click", () => {
    if (currentUser.role === "guest") {
        const role = prompt("Login as: guest / user / admin", "user");
        if (["guest", "user", "admin"].includes(role)) {
            currentUser = {
                username: role === "guest" ? "guest" : prompt("Enter username:", "User123"),
                role
            };
        }
    } else {
        currentUser = { username: "guest", role: "guest" };
    }
    renderUI();
});

// Initial render
renderUI();
