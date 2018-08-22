module.exports = function mash(tracks) {
    var mashed = {};
    soundcloud = tracks['soundcloud'];
    spotify = tracks['spotify'];
    youtube = tracks['youtube'];

    sptfy_parsed = [];
    sc_parsed = [];
    yt_parsed = [];

    soundcloud.forEach(function (track) {
        m = {
            'title': track.title,
            'duration': track.duration,
            'permlink': track.permalink_url,
            'provider': 'SoundCloud'
        };
        sc_parsed.push(m);
    });
    mashed['soundcloud'] = sc_parsed;
    spotify.forEach(function (track) {
        // TODO Add for-loop to add a few more artists if any
        var _artists = track.artists;
        var artists = [];
        _artists.forEach(function (artist) {
            artists.push(artist.name);
        });
        m = {
            'title': track.name + ' - ' + artists.toString(),//track.artists[0].name,
            'duration': track.duration_ms,
            'permlink': track.external_urls.spotify,
            'provider': 'Spotify'
        };
        sptfy_parsed.push(m);
    });
    mashed['spotify'] = sptfy_parsed;

    yt_prefix = 'https://www.youtube.com/watch?v=';
    youtube.forEach(function (track) {
        m = {
            'title': track.snippet.title,
            'duration': track.duration,
            'permlink': yt_prefix + track.id.videoId,
            'provider': 'YouTube'
        };
        yt_parsed.push(m);
    });
    mashed['youtube'] = yt_parsed;

    return mashed
}