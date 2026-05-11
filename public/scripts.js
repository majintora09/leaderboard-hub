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

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

const form = document.getElementById("resultForm");
const leaderboard = document.getElementById("leaderboard");

const playerTimeInput = document.getElementById("playerTime");
const resultDescriptionInput = document.getElementById("resultDescription");
const hasRecordingInput = document.getElementById("hasRecording");

const gameSelect = document.getElementById("gameName");
const trackSelect = document.getElementById("gameTrack");
const categorySelect = document.getElementById("categoryName");

const filterGameSelect = document.getElementById("filterGame");
const filterTrackSelect = document.getElementById("filterTrack");
const filterCategorySelect = document.getElementById("filterCategory");
const filterProofSelect = document.getElementById("filterProof");

const statTotalLaps = document.getElementById("statTotalLaps");
const statRecordedRuns = document.getElementById("statRecordedRuns");
const statPlayers = document.getElementById("statPlayers");
const statComments = document.getElementById("statComments");

let results = [];
let comments = [];

function populateSelects() {
    if (gameSelect) {
        gameSelect.innerHTML = `<option value="">Select Game</option>`;
    }

    filterGameSelect.innerHTML = `<option value="">All Games</option>`;

    games.forEach(game => {
        if (gameSelect) {
            gameSelect.innerHTML += `<option value="${game}">${game}</option>`;
        }

        filterGameSelect.innerHTML += `<option value="${game}">${game}</option>`;
    });

    if (trackSelect) {
        trackSelect.innerHTML = `<option value="">Select Track</option>`;
    }

    filterTrackSelect.innerHTML = `<option value="">All Tracks</option>`;

    tracks.forEach(track => {
        if (trackSelect) {
            trackSelect.innerHTML += `<option value="${track}">${track}</option>`;
        }

        filterTrackSelect.innerHTML += `<option value="${track}">${track}</option>`;
    });

    if (categorySelect) {
        populateCategoryOptions(categorySelect, "Select Category");
    }

    populateCategoryOptions(filterCategorySelect, "All Categories");
}

function populateCategoryOptions(selectElement, defaultText) {
    selectElement.innerHTML = `<option value="">${defaultText}</option>`;

    categories.forEach(category => {
        selectElement.innerHTML += `<option value="${category}">${category}</option>`;
    });
}

function lockCategoryIfF1() {
    if (!gameSelect || !categorySelect) {
        return;
    }

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
        description: result.description || "",
        has_recording: Boolean(result.has_recording),
        user_id: result.user_id ? Number(result.user_id) : null,
        time: formatTime(result.time)
    }));

    updateStats();
    renderLeaderboard();
}

async function loadComments() {
    const response = await fetch("/api/comments");
    comments = await response.json();

    comments = comments.map(comment => ({
        ...comment,
        user_id: comment.user_id ? Number(comment.user_id) : null,
        result_id: comment.result_id ? Number(comment.result_id) : null
    }));

    updateStats();
    renderLeaderboard();
}

if (form) {
    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const formattedTime = formatTime(playerTimeInput.value);

        const newResult = {
            game: gameSelect.value,
            track: trackSelect.value,
            category: categorySelect.value,
            time: formattedTime,
            description: resultDescriptionInput.value,
            has_recording: hasRecordingInput.checked
        };

        await fetch("/api/results", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-CSRF-TOKEN": csrfToken
            },
            body: JSON.stringify(newResult)
        });

        form.reset();

        if (categorySelect) {
            categorySelect.disabled = false;
        }

        await loadResults();
        await loadComments();
    });
}

if (gameSelect) {
    gameSelect.addEventListener("change", lockCategoryIfF1);
}

filterGameSelect.addEventListener("change", lockFilterCategoryIfF1);
filterTrackSelect.addEventListener("change", renderLeaderboard);
filterCategorySelect.addEventListener("change", renderLeaderboard);
filterProofSelect.addEventListener("change", renderLeaderboard);

function renderLeaderboard() {
    leaderboard.innerHTML = "";

    const selectedGame = filterGameSelect.value;
    const selectedTrack = filterTrackSelect.value;
    const selectedCategory = filterCategorySelect.value;
    const selectedProof = filterProofSelect.value;

    const visibleResults = results
        .filter(result => {
            const gameMatch = selectedGame === "" || result.game === selectedGame;
            const trackMatch = selectedTrack === "" || result.track === selectedTrack;
            const categoryMatch = selectedCategory === "" || result.category === selectedCategory;

            const proofMatch =
                selectedProof === "" ||
                (selectedProof === "recorded" && result.has_recording) ||
                (selectedProof === "no-proof" && !result.has_recording);

            return gameMatch && trackMatch && categoryMatch && proofMatch;
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
        const resultComments = comments.filter(comment => Number(comment.result_id) === Number(result.id));
        const wrapper = document.createElement("div");
        wrapper.className = "result-card";

        const rankClass = getRankClass(result.categoryRank);
        const canDeleteResult = window.isLoggedIn && Number(result.user_id) === Number(window.currentUserId);

        wrapper.innerHTML = `
            <div class="player">
                <span class="rank ${rankClass}">#${result.categoryRank}</span>
                <span class="name">${escapeHTML(result.name)}</span>
                <span class="time">${formatTime(result.time)}</span>
                <span class="track">${escapeHTML(result.track)}</span>
                <span class="game">${escapeHTML(result.game)}</span>
                <span class="category">${escapeHTML(result.category)}</span>

                <span class="${result.has_recording ? "recording-badge" : "no-recording-badge"}">
                    ${result.has_recording ? "✓ Recorded" : "No proof"}
                </span>

                <div class="actions">
                    <button class="comment-toggle" onclick="toggleComments(${result.id})">
                        Comments (${resultComments.length})
                    </button>

                    ${
            canDeleteResult
                ? `<button class="delete-btn" onclick="deleteResult(${result.id})">X</button>`
                : ""
        }
                </div>

                ${
            result.description
                ? `<div class="result-description">${escapeHTML(result.description)}</div>`
                : ""
        }
            </div>

            <div class="comment-panel" id="comments-${result.id}">
                ${
            window.isLoggedIn
                ? `
                            <form class="inline-comment-form" onsubmit="submitLapComment(event, ${result.id})">
                                <input type="text" name="message" placeholder="Reply like Reddit trash talk..." required>
                                <button type="submit">Reply</button>
                            </form>
                        `
                : `
                            <div class="empty-message">
                                Login to comment.
                            </div>
                        `
        }

                <div>
                    ${
            resultComments.length === 0
                ? `<div class="empty-message">No comments yet.</div>`
                : resultComments.map(comment => {
                    const canDeleteComment =
                        window.isLoggedIn &&
                        Number(comment.user_id) === Number(window.currentUserId);

                    return `
                                    <div class="lap-comment">
                                        <div class="comment-top">
                                            <span class="comment-name">${escapeHTML(comment.name)}</span>
                                            <span class="comment-date">${formatDate(comment.created_at)}</span>
                                        </div>
                                        <div class="comment-message">${escapeHTML(comment.message)}</div>

                                        ${
                        canDeleteComment
                            ? `<button class="comment-delete" onclick="deleteComment(${comment.id})">Delete</button>`
                            : ""
                    }
                                    </div>
                                `;
                }).join("")
        }
                </div>
            </div>
        `;

        leaderboard.appendChild(wrapper);
    });
}

function updateStats() {
    const uniquePlayers = new Set(results.map(result => result.name));

    statTotalLaps.textContent = results.length;
    statRecordedRuns.textContent = results.filter(result => result.has_recording).length;
    statPlayers.textContent = uniquePlayers.size;
    statComments.textContent = comments.length;
}

function toggleComments(resultId) {
    const panel = document.getElementById(`comments-${resultId}`);

    if (panel) {
        panel.classList.toggle("open");
    }
}

async function submitLapComment(event, resultId) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const newComment = {
        result_id: resultId,
        message: formData.get("message")
    };

    await fetch("/api/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRF-TOKEN": csrfToken
        },
        body: JSON.stringify(newComment)
    });

    event.target.reset();

    await loadComments();

    setTimeout(() => {
        const panel = document.getElementById(`comments-${resultId}`);

        if (panel) {
            panel.classList.add("open");
        }
    }, 0);
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
            "Accept": "application/json",
            "X-CSRF-TOKEN": csrfToken
        }
    });

    await loadResults();
    await loadComments();
}

async function deleteComment(id) {
    await fetch(`/api/comments/${id}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "X-CSRF-TOKEN": csrfToken
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
