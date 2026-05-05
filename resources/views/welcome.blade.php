<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Backfish Racers Board</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>

<div class="container">
    <h1>The Backfish Racers Board</h1>

    <form id="resultForm">
        <input type="text" id="playerName" placeholder="Player name" required>
        <input type="text" id="playerTime" placeholder="Lap time (2:17.432)" required>

        <select id="gameTrack" required></select>
        <select id="gameName" required></select>
        <select id="categoryName" required></select>

        <button type="submit">Add Result</button>
    </form>

    <div class="filters">
        <select id="filterGame"></select>
        <select id="filterTrack"></select>
        <select id="filterCategory"></select>
    </div>

    <div id="leaderboard"></div>
</div>

<script src="/scripts.js"></script>
</body>
</html>
