import fetchJsonp from 'fetch-jsonp'
import { storageService } from '../async-storage.service'
import { userService } from '../user'
import { generateDemoUsers } from '../user/user.service.local'
import { saveToStorage, loadFromStorage, makeId, getRandomIntInclusive, utilService, getRandomFromArr } from '../util.service'


const STATION_STORAGE_KEY = 'stationDB'
const SONG_STORAGE_KEY = 'songDB'

export const stationService = {
    query,
    getById,
    getByIds,
    save,
    remove,
    addStationMsg,
    generateSpotifyData
}

window.cs = stationService

async function query(filterBy = {}) {
    let stations = await storageService.query(STATION_STORAGE_KEY) || []

    const hasLikedStation = stations.some(station => station._id === 'likedSongs')

    if (!hasLikedStation) {
        const likedStation = {
            _id: 'likedSongs',
            name: 'Liked Songs',
            type: 'station',
            createdBy: userService.getLoggedinUser() || { _id: 'guest', fullname: 'You', imgUrl: '' },
            songs: [],
            uploadImgUrl: 'https://misc.scdn.co/liked-songs/liked-songs-300.png',
            isPrivate: true,
            savedCount: 0,
            createdAt: Date.now()
        }

        stations.unshift(likedStation)

        await saveToStorage(STATION_STORAGE_KEY, stations)
    }

    const { txt, tags, genres, artists } = filterBy

    if (txt) {
        const regex = new RegExp(txt, 'i')
        stations = stations.filter(station =>
            regex.test(station.name) ||
            regex.test(station.tags?.join(' ')) ||
            regex.test(station.genres?.join(' ') || '') ||
            station.songs?.some(song =>
                regex.test(song.title) ||
                (song.artists && song.artists.some(artist => regex.test(artist)))
            )
        )
    }

    if (tags && tags.length && !tags.includes('')) {
        stations = stations.filter(station =>
            (station.tags || []).some(tag => tags.includes(tag))
        )
    }

    if (artists && artists.length && !artists.includes('')) {
        stations = stations.filter(station =>
            (station.songs || []).some(song =>
                (song.artists || []).some(artist => artists.includes(artist))
            )
        )
    }

    return stations
}

async function getById(stationId) {
    return await storageService.get(STATION_STORAGE_KEY, stationId)
}

async function getByIds(stationIds) {
    const stations = await storageService.query(STATION_STORAGE_KEY)
    return stations.filter(station => stationIds.includes(station._id))
}

async function remove(stationId) {
    if (stationId === 'likedSongs') {
        throw new Error('Cannot remove the Liked Songs station')
    }
    await storageService.remove(STATION_STORAGE_KEY, stationId)
}

async function save(station) {
    let savedStation
    if (station._id) {
        savedStation = await storageService.put(STATION_STORAGE_KEY, station)
    } else {
        const stationToSave = {
            ...station,
            createdBy: userService.getLoggedinUser(),
            savedCount: station.savedCount || 0,
            createdAt: Date.now(),
            type: 'station'
        }
        savedStation = await storageService.post(STATION_STORAGE_KEY, stationToSave)
    }
    return savedStation
}

async function addStationMsg(stationId, txt) {
    const station = await getById(stationId)
    if (!station.msgs) station.msgs = []
    station.msgs.push({
        id: makeId(),
        txt,
        by: userService.getLoggedinUser()
    })
    return await save(station)
}

const FALLBACK_ARTISTS = [
    'The Weeknd', 'Drake', 'Post Malone', 'Ariana Grande', 'Billie Eilish', 'Travis Scott',
    'Bad Bunny', 'Dua Lipa', 'Olivia Rodrigo', 'Harry Styles', 'Doja Cat', 'Nicki Minaj',
    'Cardi B', 'SZA', 'Tyler, The Creator', 'Kendrick Lamar', 'J. Cole', 'Kanye West',
    'Eminem', 'Lil Baby', 'Playboi Carti', 'Juice WRLD', 'XXXTentacion', 'Trippie Redd',
    'Ski Mask the Slump God', 'Soundgarden', 'Nirvana', 'Pearl Jam', 'Alice in Chains'
]

const FALLBACK_TITLES = [
    'Blinding Lights', 'Levitating', 'As It Was', 'About Damn Time', 'Heat Waves', 'Anti-Hero',
    'Flowers', 'Vampire', 'Cruel Summer', 'Rolling in the Deep', 'Good as Hell', 'Bad Guy',
    'Shape of You', 'Uptown Funk', 'Closer', 'Cheap Thrills', 'Perfect', 'Thinking Out Loud',
    'Someone Like You', 'Counting Stars', 'Take Me Home', 'Night Changes', 'Story of My Life',
    'Kiss Me', 'Better Days', 'Electric Feel', 'Swim', 'The Mother', 'Dreams', 'Go Your Own Way',
    'Landslide', 'Rhiannon', 'Sara'
]

const FALLBACK_ALBUMS = [
    'After Hours', 'Future Nostalgia', 'Sour', 'Midnights', 'Guts', 'UTOPIA', 'MOTM III',
    'IGOR', 'Astroworld', 'A Good Kid, m.A.A.d City', 'Damn', 'Yeezus', 'Recovery',
    'The Marshall Mathers LP', 'Whole Lotta Red', 'Lover', 'folklore', 'evermore', 'Reputation'
]

const FALLBACK_IMG_URLS = [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1459262838948-3e2de6c3ec05?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1499364238606-087db7ad4d3b?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1478225061937-adac64995dac?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1516280440614-37882060ae69?w=300&h=300&fit=crop'
]

const SEARCH_TERMS = ['pop', 'hip hop', 'rock', 'electronic', 'latin', 'k-pop', 'jazz', 'r&b', 'indie', 'reggae']


const STATION_NAMES = [
    'Morning Vibes', 'Deep Focus', 'Workout Mix', 'Chill Lofi', 'Party Hits', 'Late Night Drive',
    'Summer Playlist', 'Indie Gems', 'Hip Hop Classics', 'Throwback Hits', 'Pop Revolution',
    'Alternative Wave', 'R&B Smooth', 'Electronic Beats', 'Acoustic Sessions', 'Reggae Sunset',
    'Metal Madness', 'Jazz Standards', 'Classical Masterpieces', 'Country Roads', 'Soul Serenade',
    'Urban Beats', 'Retro Vibes', 'Chillwave Nights', 'Trap Nation', 'Indie Rock Paradise'
]

const ALL_TAGS = [
    'Pop', 'Hip Hop', 'Rock', 'Electronic', 'Latin', 'K-Pop',
    'Chill', 'Workout', 'Party', 'Focus', 'Sleep',
    'Gaming', 'Driving', 'Mood', 'Trending',
]

const SONG_TAGS_MAP = {
    pop: ['Pop', 'Trending', 'Party'],
    'hip hop': ['Hip Hop', 'Workout', 'Party'],
    rock: ['Rock', 'Driving'],
    electronic: ['Electronic', 'Party', 'Gaming'],
    latin: ['Latin', 'Party', 'Mood'],
    'k-pop': ['K-Pop', 'Trending', 'Party'],
    jazz: ['Focus', 'Sleep'],
    'r&b': ['Mood', 'Chill'],
    indie: ['Chill', 'Focus'],
    reggae: ['Chill', 'Mood', 'Party'],
}

export const TAGS_DATA = [
    {
        title: 'Pop',
        color: '#f16cd5',
        imgUrl: '/tags/pop.webp',
    },
    {
        title: 'Hip Hop',
        color: '#b74aff',
        imgUrl: '/tags/hip-hop.webp',
    },
    {
        title: 'Rock',
        color: '#E8115B',
        imgUrl: '/tags/rock.webp',
    },
    {
        title: 'Electronic',
        color: '#3edd3e',
        imgUrl: '/tags/electronic.webp',
    },
    {
        title: 'Latin',
        color: '#E13300',
        imgUrl: '/tags/latin.webp',
    },
    {
        title: 'K-Pop',
        color: '#af2896',
        imgUrl: '/tags/k-pop.webp',
    },
    {
        title: 'Chill',
        color: '#477D95',
        imgUrl: '/tags/chill.webp',
    },
    {
        title: 'Workout',
        color: '#f7b968',
        imgUrl: '/tags/workout.webp',
    },
    {
        title: 'Party',
        color: '#c268f7',
        imgUrl: '/tags/party.webp',
    },
    {
        title: 'Focus',
        color: '#dd9e6a',
        imgUrl: '/tags/focus.webp',
    },
    {
        title: 'Sleep',
        color: '#2D46B9',
        imgUrl: '/tags/sleep.webp',
    },
    {
        title: 'Gaming',
        color: '#27856A',
        imgUrl: '/tags/gaming.webp',
    },
    {
        title: 'Driving',
        color: '#8f8e8d',
        imgUrl: '/tags/driving.webp',
    },
    {
        title: 'Mood',
        color: '#509BF5',
        imgUrl: '/tags/mood.webp',
    },
    {
        title: 'Trending',
        color: '#ee632c',
        imgUrl: '/tags/trending.webp',
    },
]

const deezerFetchCache = {}
const youtubeFetchCache = {}

const YOUTUBE_API_KEY = 'AIzaSyAuUmX2nSr4Lp1cre--z_WzHV2LhoHYwFo'

export async function generateSpotifyData(songsCount = 381, stationsCount = 147) {
    await _initData(SONG_STORAGE_KEY, _generateSong, songsCount)
    await _initData(STATION_STORAGE_KEY, _generateStation, stationsCount)
}

async function _initData(key, generateFn, count) {
    let data = await loadFromStorage(key)
    if (data && data.length > 1) return

    data = await Promise.all(Array.from({ length: count }, (_, i) => generateFn(i)))
    await saveToStorage(key, data)
}

function parseISODurationToSeconds(iso) {
    if (!iso) return 0

    // Robust regex that gracefully handles Days, Hours, Minutes, and Seconds (e.g., P1DT2H, PT5M4S)
    const match = iso.match(/P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/i)
    if (!match) return 0

    const [, d, h, m, s] = match
    return (Number(d || 0) * 86400) +
        (Number(h || 0) * 3600) +
        (Number(m || 0) * 60) +
        Number(s || 0)
}

function formatDuration(seconds) {
    // Catch invalid inputs to prevent NaN:NaN renders
    if (seconds === null || seconds === undefined || isNaN(Number(seconds))) return '0:00'

    const totalSeconds = Math.max(0, Math.floor(Number(seconds)))
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    return `${minutes}:${String(secs).padStart(2, '0')}`
}

async function fetchJson(url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}

function normalizeText(str = '') {
    return str
        .toLowerCase()
        .replace(/\(.*?\)|\[.*?\]/g, ' ')
        .replace(/\b(official|video|audio|lyrics|lyric|hd|4k|remastered|remaster|live|feat|ft)\b/g, ' ')
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function scoreDeezerMatch(ytTrack, dzTrack, term) {
    let score = 0

    const ytTitle = normalizeText(ytTrack.title)
    const dzTitle = normalizeText(dzTrack.title)
    const ytArtist = normalizeText(ytTrack.artists?.[0] || '')
    const dzArtist = normalizeText(dzTrack.artists?.[0] || '')
    const q = normalizeText(term)

    if (ytTitle && dzTitle && (ytTitle.includes(dzTitle) || dzTitle.includes(ytTitle))) score += 5
    if (ytArtist && dzArtist && (ytArtist.includes(dzArtist) || dzArtist.includes(ytArtist))) score += 4
    if (q && dzTitle.includes(q)) score += 1
    if (dzTrack.readable) score += 1
    if (dzTrack.imgUrl) score += 2
    if (dzTrack.previewUrl) score += 1

    return score
}

async function fetchYoutubeTracks(term) {
    if (!YOUTUBE_API_KEY) {
        console.warn('Missing VITE_YOUTUBE_API_KEY')
        return []
    }

    if (!youtubeFetchCache[term]) {
        youtubeFetchCache[term] = (async () => {
            const searchParams = new URLSearchParams({
                key: YOUTUBE_API_KEY,
                part: 'snippet',
                q: term,
                type: 'video',
                maxResults: '25',
                videoEmbeddable: 'true',
                videoSyndicated: 'true',
                videoCategoryId: '10'
            })

            const searchJson = await fetchJson(`https://www.googleapis.com/youtube/v3/search?${searchParams}`)

            const ids = (searchJson.items || [])
                .map(item => item?.id?.videoId)
                .filter(Boolean)

            if (!ids.length) return []

            const detailsParams = new URLSearchParams({
                key: YOUTUBE_API_KEY,
                part: 'snippet,contentDetails,status',
                id: ids.join(',')
            })

            const detailsJson = await fetchJson(`https://www.googleapis.com/youtube/v3/videos?${detailsParams}`)

            return (detailsJson.items || [])
                .filter(video => video?.status?.embeddable !== false)
                .map(video => {
                    const duration = parseISODurationToSeconds(video.contentDetails?.duration)

                    return {
                        youtubeId: video.id,
                        title: video.snippet?.title || 'Unknown title',
                        url: `https://www.youtube.com/watch?v=${video.id}`,
                        youtubeImgUrl:
                            video.snippet?.thumbnails?.maxres?.url ||
                            video.snippet?.thumbnails?.standard?.url ||
                            video.snippet?.thumbnails?.high?.url ||
                            video.snippet?.thumbnails?.medium?.url ||
                            video.snippet?.thumbnails?.default?.url ||
                            '',
                        artists: [video.snippet?.channelTitle || 'Unknown artist'],
                        addedAt: Date.now() - getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 365),
                        album: 'YouTube',
                        duration,
                        durationLabel: formatDuration(duration),
                        type: 'song'
                    }
                })
        })()
    }

    return youtubeFetchCache[term]
}

async function fetchDeezerTracks(term) {
    if (!deezerFetchCache[term]) {
        const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(term)}&limit=25&output=jsonp`

        deezerFetchCache[term] = fetchJsonp(deezerUrl)
            .then(res => {
                if (!res.ok) throw new Error('Deezer API unavailable')
                return res.json()
            })
            .then(json => {
                const availableTracks = json?.data?.filter(track => track.readable === true) || []
                const tracksToUse = availableTracks.length ? availableTracks : (json?.data || [])

                return tracksToUse.map(track => {
                    const duration = Number(track.duration) || 0

                    return {
                        title: track.title || 'Unknown title',
                        previewUrl: track.preview || '',
                        imgUrl:
                            track.album?.cover_big ||
                            track.album?.cover_medium ||
                            track.album?.cover ||
                            '',
                        artists: [track.artist?.name || 'Unknown'],
                        album: track.album?.title || 'Unknown album',
                        duration,
                        durationLabel: formatDuration(duration),
                        readable: track.readable === true,
                        type: 'song'
                    }
                })
            })
    }

    return deezerFetchCache[term]
}

async function _generateSong(idx) {
    const term = SEARCH_TERMS[idx % SEARCH_TERMS.length]
    const tags = SONG_TAGS_MAP[term] || ['Trending']

    try {
        const [youtubeTracks, deezerTracks] = await Promise.all([
            fetchYoutubeTracks(term),
            fetchDeezerTracks(term)
        ])

        const ytTrack = youtubeTracks.length ? youtubeTracks[idx % youtubeTracks.length] : null

        if (ytTrack) {
            let bestDeezer = null

            if (deezerTracks.length) {
                bestDeezer = [...deezerTracks].sort(
                    (a, b) => scoreDeezerMatch(ytTrack, b, term) - scoreDeezerMatch(ytTrack, a, term)
                )[0]
            }

            // Fix: Prioritize Deezer's studio track duration over YouTube's music video duration
            const resolvedDuration =
                (bestDeezer && bestDeezer.duration > 0) ? bestDeezer.duration :
                    (ytTrack && ytTrack.duration > 0) ? ytTrack.duration :
                        getRandomIntInclusive(180, 420)

            return {
                _id: makeId(),
                title: bestDeezer?.title || ytTrack.title,
                url: ytTrack.url,
                youtubeId: ytTrack.youtubeId,
                previewUrl: bestDeezer?.previewUrl || '',
                imgUrl: bestDeezer?.imgUrl || ytTrack.youtubeImgUrl || FALLBACK_IMG_URLS[idx % FALLBACK_IMG_URLS.length],
                artists: bestDeezer?.artists || ytTrack.artists || [FALLBACK_ARTISTS[idx % FALLBACK_ARTISTS.length]],
                addedAt: Date.now() - getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 365),
                album: bestDeezer?.album || ytTrack.album || FALLBACK_ALBUMS[idx % FALLBACK_ALBUMS.length],
                duration: resolvedDuration,
                durationLabel: formatDuration(resolvedDuration),
                tags,
                type: 'song'
            }
        }

        if (deezerTracks.length) {
            const track = deezerTracks[idx % deezerTracks.length]
            const resolvedDuration = track.duration || getRandomIntInclusive(180, 420)

            return {
                _id: makeId(),
                title: track.title,
                url: track.previewUrl || `https://example.com/track/${idx}`,
                previewUrl: track.previewUrl || '',
                imgUrl: track.imgUrl || FALLBACK_IMG_URLS[idx % FALLBACK_IMG_URLS.length],
                artists: track.artists || [FALLBACK_ARTISTS[idx % FALLBACK_ARTISTS.length]],
                addedAt: Date.now() - getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 365),
                album: track.album || FALLBACK_ALBUMS[idx % FALLBACK_ALBUMS.length],
                duration: resolvedDuration,
                durationLabel: formatDuration(resolvedDuration),
                tags,
                type: 'song'
            }
        }
    } catch (err) {
        console.warn(`YouTube/Deezer fetch failed for ${term}, using fallback data.`, err)
    }

    const fallbackDuration = getRandomIntInclusive(180, 420)

    return {
        _id: makeId(),
        title: FALLBACK_TITLES[idx % FALLBACK_TITLES.length],
        url: `https://example.com/track/${idx}`,
        previewUrl: '',
        imgUrl: FALLBACK_IMG_URLS[idx % FALLBACK_IMG_URLS.length],
        artists: [FALLBACK_ARTISTS[idx % FALLBACK_ARTISTS.length]],
        addedAt: Date.now() - getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 365),
        album: FALLBACK_ALBUMS[idx % FALLBACK_ALBUMS.length],
        duration: fallbackDuration,
        durationLabel: formatDuration(fallbackDuration),
        tags,
        type: 'song'
    }
}

async function _generateStation(idx) {
    const tagCount = getRandomIntInclusive(3, 5)
    const stationTags = []
    const tagSet = new Set()

    while (stationTags.length < tagCount && tagSet.size < ALL_TAGS.length) {
        const randomTag = ALL_TAGS[getRandomIntInclusive(0, ALL_TAGS.length - 1)]
        if (!tagSet.has(randomTag)) {
            stationTags.push(randomTag)
            tagSet.add(randomTag)
        }
    }

    const allSongs = await loadFromStorage(SONG_STORAGE_KEY) || []
    const shuffledSongs = [...allSongs].sort(() => Math.random() - 0.5)
    const stationSongs = shuffledSongs.slice(0, getRandomIntInclusive(15, 30))

    const allUsers = await loadFromStorage('userDB') || []
    const randomUser = allUsers.length > 0
        ? allUsers[getRandomIntInclusive(0, allUsers.length - 1)]
        : { _id: makeId(), fullname: `Creator ${idx}`, imgUrl: `https://i.pravatar.cc/150?img=${idx}` }

    const randomUsers = getRandomFromArr(allUsers, getRandomIntInclusive(0, 5))
    const participants = randomUsers.map(user => ({
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl
    }))

    const miniUser = {
        _id: randomUser._id,
        fullname: randomUser.fullname,
        imgUrl: randomUser.imgUrl
    }

    return {
        _id: makeId(),
        name: STATION_NAMES[idx % STATION_NAMES.length] + (idx >= STATION_NAMES.length ? ` ${Math.floor(idx / STATION_NAMES.length)}` : ''),
        tags: stationTags,
        uploadImgUrl: '',
        songsImagesUrls: stationSongs.map(song => song.imgUrl).filter(Boolean).slice(0, 4),
        isPrivate: Math.random() < 0.5,
        savedCount: getRandomIntInclusive(50, 9999),
        songs: stationSongs,
        createdAt: Date.now() - getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 365),
        createdBy: miniUser,
        participants: participants,
        type: 'station'
    }
}