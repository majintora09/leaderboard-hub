<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>The Backfish Racers Board</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>

<div class="page-bg"></div>

<div class="container">

    <header class="hero">
        <div class="hero-left">
            <div class="logo-wrap">
                <img src="{{ asset('images/backfish-logo.jpg') }}" alt="Logo" class="logo">
            </div>

            <div class="hero-text">
                <p class="eyebrow">🏁 Squad Lap Time Tracker</p>
                <h1>The Backfish Racers Board</h1>
                <p class="subtitle">
                    Compare laps, flex proof, and roast questionable driving decisions.
                </p>
            </div>
        </div>

        @auth
            <div class="user-panel">
                <span>Logged in as</span>
                <strong>{{ auth()->user()->name }}</strong>

                <form method="POST" action="/logout">
                    @csrf
                    <button type="submit">Logout</button>
                </form>
            </div>
        @else
            <div class="auth-grid">

                <form method="POST" action="/login" class="auth-card">
                    @csrf

                    <h3>Login</h3>

                    <input type="email" name="email" placeholder="Email" required>
                    <input type="password" name="password" placeholder="Password" required>

                    <button type="submit">Login</button>
                </form>

                <form method="POST" action="/register" class="auth-card">
                    @csrf

                    <h3>Create Account</h3>

                    <input type="text" name="name" placeholder="Username" required>
                    <input type="email" name="email" placeholder="Email" required>
                    <input type="password" name="password" placeholder="Password" required>

                    <button type="submit">Register</button>
                </form>

            </div>
        @endauth
    </header>

    @if ($errors->any())
        <section class="card error-card">
            @foreach ($errors->all() as $error)
                <p>{{ $error }}</p>
            @endforeach
        </section>
    @endif

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

    @auth
        <section class="card">
            <div class="section-header">
                <div>
                    <h2>Add Result</h2>
                    <p>You are posting as {{ auth()->user()->name }}</p>
                </div>
            </div>

            <form id="resultForm" class="result-form">
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
    @else
        <section class="card auth-warning">
            <h2>Login Required</h2>
            <p>Create an account or login to submit lap times and comments.</p>
        </section>
    @endauth

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
                <p>Ranks are calculated inside each category.</p>
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

<script>
    window.isLoggedIn = {{ auth()->check() ? 'true' : 'false' }};
    window.currentUserId = {{ auth()->check() ? auth()->id() : 'null' }};
</script>

<script src="/scripts.js"></script>

</body>
</html>
