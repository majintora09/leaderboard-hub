const tracks = [
    "SPA",
    "MONZA",
    "SILVERSTONE",
    "NURBURGRING",
    "BAHRAIN",
    "MONACO",
    "ATLANTA"
];

const games = [
    "RENNSPORT",
    "F1 25",
    "LE MANS ULTIMATE",
    "ASSETTO CORSA"
];

const categories = [
    "GT3",
    "GT4",
    "HYPERCAR",
    "M2",
    "FORMULA 1"
];

const form = document.getElementById("resultForm");
const leaderboard = document.getElementById("leaderboard");

const playerNameInput = document.getElementById("playerName");
const playerTimeInput = document.getElementById("playerTime");

const gameSelect = document.getElementById("gameName");
const trackSelect = document.getElementById("gameTrack");
const categorySelect = document.getElementById("categoryName");

const filterGameSelect = document.getElementById("filterGame");
const filterTrackSelect = document.getElementById("filterTrack");
const filterCategorySelect = document.getElementById("filterCategory");

const commentForm = document.getElementById("commentForm");
const commentNameInput = document.getElementById("commentName");
const commentMessageInput = document.getElementById("commentMessage");
const commentsContainer = document.getElementById("comments");

let results = [];
let comments = [];

function populateSelects() {
    gameSelect.innerHTML = `<option value="">Select Game</option>`;
    filterGameSelect.innerHTML = `<option value="">All Games</option>`;

    games.forEach(game => {
        gameSelect.innerHTML += `<option value="${game}">${game}</option>`;
        filterGameSelect.innerHTML += `<option value="${game}">${game}</option>`;
    });

    trackSelect.innerHTML = `<option value="">Select Track</option>`;
    filterTrackSelect.innerHTML = `<option value="">All Tracks</option>`;

    tracks.forEach(track => {
        trackSelect.innerHTML += `<option value="${track}">${track}</option>`;
        filterTrackSelect.innerHTML += `<option value="${track}">${track}</option>`;
    });

    populateCategoryOptions(categorySelect, "Select Category");
    populateCategoryOptions(filterCategorySelect, "All Categories");
}

function populateCategoryOptions(selectElement, defaultText) {
    selectElement.innerHTML = `<option value="">${defaultText}</option>`;

    categories.forEach(category => {
        selectElement.innerHTML += `<option value="${category}">${category}</option>`;
    });
}

function lockCategoryIfF1() {
    if (gameSelect.value === "F1 25") {
        categorySelect.value = "FORMULA 1";
        categorySelect.disabled = true;
    } else {
        categorySelect.disabled = false;

        if (categorySelect.value === "FORMULA 1") {
            categorySelect.value = "";
        }
    }
}

function lockFilterCategoryIfF1() {
    if (filterGameSelect.value === "F1 25") {
        filterCategorySelect.value = "FORMULA 1";
        filterCategorySelect.disabled = true;
    } else {
        filterCategorySelect.disabled = false;
    }

    renderLeaderboard();
}

async function loadResults() {
    const response = await fetch("/api/results");
    results = await response.json();

    results = results.map(result => ({
        ...result,
        category: result.category || "GT3",
        time: formatTime(result.time)
    }));

    renderLeaderboard();
}

async function loadComments() {
    const response = await fetch("/api/comments");
    comments = await response.json();
    renderComments();
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const formattedTime = formatTime(playerTimeInput.value);

    const newResult = {
        name: playerNameInput.value.toUpperCase(),
        game: gameSelect.value,
        track: trackSelect.value,
        category: categorySelect.value,
        time: formattedTime
    };

    await fetch("/api/results", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newResult)
    });

    form.reset();
    categorySelect.disabled = false;

    await loadResults();
});

commentForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const newComment = {
        name: commentNameInput.value.toUpperCase(),
        message: commentMessageInput.value
    };

    await fetch("/api/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newComment)
    });

    commentForm.reset();

    await loadComments();
});

gameSelect.addEventListener("change", lockCategoryIfF1);

filterGameSelect.addEventListener("change", lockFilterCategoryIfF1);
filterTrackSelect.addEventListener("change", renderLeaderboard);
filterCategorySelect.addEventListener("change", renderLeaderboard);

function renderLeaderboard() {
    leaderboard.innerHTML = "";

    const selectedGame = filterGameSelect.value;
    const selectedTrack = filterTrackSelect.value;
    const selectedCategory = filterCategorySelect.value;

    const visibleResults = results
        .filter(result => {
            const gameMatch = selectedGame === "" || result.game === selectedGame;
            const trackMatch = selectedTrack === "" || result.track === selectedTrack;
            const categoryMatch = selectedCategory === "" || result.category === selectedCategory;

            return gameMatch && trackMatch && categoryMatch;
        })
        .map(result => ({
            ...result,
            categoryRank: getCategoryRank(result)
        }))
        .sort((a, b) => {
            if (a.categoryRank !== b.categoryRank) {
                return a.categoryRank - b.categoryRank;
            }

            return convertTimeToMilliseconds(a.time) - convertTimeToMilliseconds(b.time);
        });

    if (visibleResults.length === 0) {
        leaderboard.innerHTML = `
            <div class="empty-message">
                No results found yet. Add a lap time or change the filters.
            </div>
        `;
        return;
    }

    visibleResults.forEach(result => {
        const row = document.createElement("div");
        row.className = "player";

        const rankClass = getRankClass(result.categoryRank);

        row.innerHTML = `
            <span class="rank ${rankClass}">#${result.categoryRank}</span>
            <span class="name">${escapeHTML(result.name)}</span>
            <span class="time">${formatTime(result.time)}</span>
            <span class="track">${escapeHTML(result.track)}</span>
            <span class="game">${escapeHTML(result.game)}</span>
            <span class="category">${escapeHTML(result.category)}</span>
            <button class="delete-btn" onclick="deleteResult(${result.id})">X</button>
        `;

        leaderboard.appendChild(row);
    });
}

function renderComments() {
    commentsContainer.innerHTML = "";

    if (comments.length === 0) {
        commentsContainer.innerHTML = `
            <div class="empty-message">
                No comments yet. Start the trash talk.
            </div>
        `;
        return;
    }

    comments.forEach(comment => {
        const commentBox = document.createElement("div");
        commentBox.className = "comment";

        commentBox.innerHTML = `
            <div class="comment-top">
                <span class="comment-name">${escapeHTML(comment.name)}</span>
                <span class="comment-date">${formatDate(comment.created_at)}</span>
            </div>
            <div class="comment-message">${escapeHTML(comment.message)}</div>
            <button class="comment-delete" onclick="deleteComment(${comment.id})">Delete</button>
        `;

        commentsContainer.appendChild(commentBox);
    });
}

function getRankClass(rank) {
    if (rank === 1) return "first";
    if (rank === 2) return "second";
    if (rank === 3) return "third";
    return "";
}

function getCategoryRank(targetResult) {
    const categoryResults = results
        .filter(result =>
            result.game === targetResult.game &&
            result.track === targetResult.track &&
            result.category === targetResult.category
        )
        .sort((a, b) =>
            convertTimeToMilliseconds(a.time) -
            convertTimeToMilliseconds(b.time)
        );

    return categoryResults.findIndex(result => result.id === targetResult.id) + 1;
}

async function deleteResult(id) {
    await fetch(`/api/results/${id}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        }
    });

    await loadResults();
}

async function deleteComment(id) {
    await fetch(`/api/comments/${id}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        }
    });

    await loadComments();
}

function convertTimeToMilliseconds(time) {
    const clean = String(time).trim().replace(",", ".");

    if (clean.includes(":")) {
        const parts = clean.split(":");
        const minutes = Number(parts[0]);
        const seconds = Number(parts[1]);

        return (minutes * 60 + seconds) * 1000;
    }

    return Number(clean) * 1000;
}

function formatTime(time) {
    const milliseconds = convertTimeToMilliseconds(time);

    if (Number.isNaN(milliseconds)) {
        return time;
    }

    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.round(milliseconds % 1000);

    return `${minutes}:${String(seconds).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString();
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

populateSelects();
loadResults();
loadComments();
