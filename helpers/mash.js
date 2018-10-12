module.exports = function mash (tracks) {
  var mashed = {}
  const soundcloud = tracks['soundcloud']
  const spotify = tracks['spotify']
  const youtube = tracks['youtube']

  var spotifyParsed = []
  var soundcloudParsed = []
  var youtubeParsed = []

  soundcloud.forEach(function (track) {
    const m = {
      'title': track.title,
      'duration': track.duration,
      'permlink': track.permalink_url,
      'provider': 'SoundCloud'
    }
    soundcloudParsed.push(m)
  })
  mashed['soundcloud'] = soundcloudParsed
  spotify.forEach(function (track) {
    const _artists = track.artists
    var artists = []
    _artists.forEach(function (artist) {
      artists.push(artist.name)
    })
    const m = {
      'title': track.name + ' - ' + artists.toString(), // track.artists[0].name,
      'duration': track.duration_ms,
      'permlink': track.external_urls.spotify,
      'provider': 'Spotify'
    }
    spotifyParsed.push(m)
  })
  mashed['spotify'] = spotifyParsed

  const youtubePrefix = 'https://www.youtube.com/watch?v='
  youtube.forEach(function (track) {
    const m = {
      'title': track.snippet.title,
      'duration': track.duration,
      'permlink': youtubePrefix + track.id.videoId,
      'provider': 'YouTube'
    }
    youtubeParsed.push(m)
  })
  mashed['youtube'] = youtubeParsed

  return mashed
}
