<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Backfish Racers Board</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>

<div class="page-bg"></div>

<div class="container">

    <header class="hero">
        <div class="logo-wrap">
            <img src="{{ asset('images/backfish-logo.jpg') }}" alt="Backfish Racers Logo" class="logo">
        </div>

        <div class="hero-text">
            <p class="eyebrow">🏁 Squad Lap Time Tracker</p>
            <h1>The Backfish Racers Board</h1>
            <p class="subtitle">
                Compare your fastest laps across games, tracks and car classes.
            </p>
        </div>
    </header>

    <section class="card">
        <div class="section-header">
            <h2>Add Result</h2>
            <p>Submit a new lap time to the board.</p>
        </div>

        <form id="resultForm">
            <input type="text" id="playerName" placeholder="Player name" required>
            <input type="text" id="playerTime" placeholder="Lap time (2:17.432)" required>

            <select id="gameTrack" required></select>
            <select id="gameName" required></select>
            <select id="categoryName" required></select>

            <button type="submit">Add Result</button>
        </form>
    </section>

    <section class="card">
        <div class="section-header">
            <h2>Filters</h2>
            <p>Choose what leaderboard you want to view.</p>
        </div>

        <div class="filters">
            <select id="filterGame"></select>
            <select id="filterTrack"></select>
            <select id="filterCategory"></select>
        </div>
    </section>

    <section class="card leaderboard-card">
        <div class="section-header">
            <h2>Leaderboard</h2>
            <p>Ranks are calculated inside each game / track / category.</p>
        </div>

        <div class="leaderboard-header">
            <span>Rank</span>
            <span>Player</span>
            <span>Time</span>
            <span>Track</span>
            <span>Game</span>
            <span>Class</span>
            <span>Action</span>
        </div>

        <div id="leaderboard"></div>
    </section>

    <section class="card comments-card">
        <div class="section-header">
            <h2>Backfish Comments</h2>
            <p>Talk your shit. Keep it funny.</p>
        </div>

        <form id="commentForm" class="comment-form">
            <input type="text" id="commentName" placeholder="Your name" required>
            <textarea id="commentMessage" placeholder="wtf bruh u did a 1:58.4 in GP layout??" required></textarea>
            <button type="submit">Post Comment</button>
        </form>

        <div id="comments"></div>
    </section>

</div>

<script src="/scripts.js"></script>
</body>
</html>
