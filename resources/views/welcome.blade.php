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
        <div class="hero-left">
            <div class="logo-wrap">
                <img src="{{ asset('images/backfish-logo.jpg') }}" alt="Backfish Racers Logo" class="logo">
            </div>

            <div class="hero-text">
                <p class="eyebrow">🏁 Squad Lap Time Tracker</p>
                <h1>The Backfish Racers Board</h1>
                <p class="subtitle">
                    Compare laps, flex proof, and roast questionable driving decisions.
                </p>
            </div>
        </div>

        <div class="hero-badge">
            <span>Live Board</span>
            <strong>Community Runs</strong>
        </div>
    </header>

    <section class="stats-grid">
        <div class="stat-card">
            <span>Total Laps</span>
            <strong id="statTotalLaps">0</strong>
        </div>

        <div class="stat-card">
            <span>Recorded Runs</span>
            <strong id="statRecordedRuns">0</strong>
        </div>

        <div class="stat-card">
            <span>Players</span>
            <strong id="statPlayers">0</strong>
        </div>

        <div class="stat-card">
            <span>Comments</span>
            <strong id="statComments">0</strong>
        </div>
    </section>

    <section class="card">
        <div class="section-header">
            <div>
                <h2>Add Result</h2>
                <p>Submit a lap time, notes, and whether you have proof.</p>
            </div>
        </div>

        <form id="resultForm" class="result-form">
            <input type="text" id="playerName" placeholder="Player name" required>
            <input type="text" id="playerTime" placeholder="Lap time (2:17.432)" required>

            <select id="gameTrack" required></select>
            <select id="gameName" required></select>
            <select id="categoryName" required></select>

            <textarea id="resultDescription" placeholder="Description / notes / setup / excuses..."></textarea>

            <label class="checkbox-field">
                <input type="checkbox" id="hasRecording">
                <span>Recording available</span>
            </label>

            <button type="submit">Add Result</button>
        </form>
    </section>

    <section class="card">
        <div class="section-header">
            <div>
                <h2>Filters</h2>
                <p>Choose what leaderboard you want to view.</p>
            </div>
        </div>

        <div class="filters">
            <select id="filterGame"></select>
            <select id="filterTrack"></select>
            <select id="filterCategory"></select>
            <select id="filterProof">
                <option value="">All Proof</option>
                <option value="recorded">Recorded only</option>
                <option value="no-proof">No proof</option>
            </select>
        </div>
    </section>

    <section class="card leaderboard-card">
        <div class="section-header">
            <div>
                <h2>Leaderboard</h2>
                <p>Ranks are calculated inside each game / track / category.</p>
            </div>
        </div>

        <div class="leaderboard-header">
            <span>Rank</span>
            <span>Player</span>
            <span>Time</span>
            <span>Track</span>
            <span>Game</span>
            <span>Class</span>
            <span>Proof</span>
            <span>Action</span>
        </div>

        <div id="leaderboard"></div>
    </section>

</div>

<script src="/scripts.js"></script>
</body>
</html>
