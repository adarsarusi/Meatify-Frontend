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
    save,
    remove,
    addStationMsg,
    generateSpotifyData
}

window.cs = stationService

async function query(filterBy = {}) {
    let stations = await storageService.query(STATION_STORAGE_KEY)
    const { txt, tags, genres, artists } = filterBy

    if (txt) {
        const regex = new RegExp(txt, 'i')
        stations = stations.filter(station =>
            regex.test(station.name) ||
            regex.test(station.tags?.join(' ')) ||
            regex.test(station.genres?.join(' ') || '') ||
            station.songs.some(song =>
                regex.test(song.title) ||
                (song.artists && song.artists.some(artist => regex.test(artist)))
            )
        )
    }

    if (tags && tags.length && !tags.includes('')) {
        stations = stations.filter(station =>
            tags.some(tag => station.tags.includes(tag))
        )
    }

    if (artists && artists.length && !artists.includes('')) {
        stations = stations.filter(station =>
            station.songs.some(song =>
                song.artists.some(artist => artists.includes(artist))
            )
        )
    }

    return stations
}

async function getById(stationId) {
    return await storageService.get(STATION_STORAGE_KEY, stationId)
}

async function remove(stationId) {
    await storageService.remove(STATION_STORAGE_KEY, stationId)
}

async function save(station) {
    var savedStation
    if (station._id) {
        savedStation = await storageService.put(STATION_STORAGE_KEY, station)
    } else {
        const stationToSave = {
            name: station.name,
            tags: station.tags || [],
            songs: station.songs || [],
            isPrivate: station.isPrivate || false,
            createdBy: userService.getLoggedinUser() || { fullname: 'You', imgUrl: '', _id: 'guest' },
            savedCount: 0,
            createdAt: Date.now()
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

// 1. CONSTANTS HOISTED TO PREVENT MEMORY REALLOCATION
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

const SEARCH_TERMS = ['pop', 'rock', 'hip hop', 'jazz', 'electronic', 'r&b', 'alternative', 'indie', 'country', 'reggae']

const STATION_NAMES = [
    'Morning Vibes', 'Deep Focus', 'Workout Mix', 'Chill Lofi', 'Party Hits', 'Late Night Drive',
    'Summer Playlist', 'Indie Gems', 'Hip Hop Classics', 'Throwback Hits', 'Pop Revolution',
    'Alternative Wave', 'R&B Smooth', 'Electronic Beats', 'Acoustic Sessions', 'Reggae Sunset',
    'Metal Madness', 'Jazz Standards', 'Classical Masterpieces', 'Country Roads', 'Soul Serenade',
    'Urban Beats', 'Retro Vibes', 'Chillwave Nights', 'Trap Nation', 'Indie Rock Paradise'
]

const ALL_TAGS = [
    'Pop', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 'Country', 'R&B', 'Soul', 'Reggae',
    'Blues', 'Metal', 'Punk', 'Indie', 'Alternative', 'Folk', 'Latin', 'K-Pop', 'Anime', 'Gaming',
    'Chill', 'Happy', 'Sad', 'Energetic', 'Relaxing', 'Melancholic', 'Romantic', 'Uplifting', 'Intense', 'Peaceful',
    'Moody', 'Powerful', 'Dreamy', 'Nostalgic', 'Euphoric', 'Dark', 'Playful', 'Introspective',
    'Workout', 'Focus', 'Party', 'Sleep', 'Study', 'Cooking', 'Driving', 'Running', 'Yoga', 'Meditation',
    'Dancing', 'Gaming', 'Working', 'Commute', 'Weekend', 'Date Night', 'Hangout', 'Gym',
    'Morning', 'Afternoon', 'Evening', 'Night', 'Late Night', 'Dawn'
]

// 2. PROMISE CACHE: Prevents 381 simultaneous network requests
const deezerFetchCache = {}

// --- MAIN FUNCTIONS ---

export async function generateSpotifyData(songsCount = 381, stationsCount = 147) {
    await generateDemoUsers(50)
    await _initData(SONG_STORAGE_KEY, _generateSong, songsCount)
    await _initData(STATION_STORAGE_KEY, _generateStation, stationsCount)
}

async function _initData(key, generateFn, count) {
    var data = await loadFromStorage(key)
    if (data && data.length > 0) return

    data = await Promise.all(Array.from({ length: count }, (_, i) => generateFn(i)))
    await saveToStorage(key, data)
}

async function _generateSong(idx) {
    const term = SEARCH_TERMS[idx % SEARCH_TERMS.length]

    // Using the real API URL with JSONP to bypass CORS completely
    const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(term)}&limit=50&output=jsonp`

    try {
        // If we haven't fetched this genre yet, start the fetch using fetchJsonp
        if (!deezerFetchCache[term]) {
            deezerFetchCache[term] = fetchJsonp(deezerUrl).then(res => {
                if (!res.ok) throw new Error('Deezer API unavailable')
                return res.json()
            })
        }

        // Await the cached promise (this instantly resolves for songs 11 through 381)
        const json = await deezerFetchCache[term]
        const track = json?.data?.[idx % (json.data?.length || 1)]

        if (track && track.title) {
            return {
                _id: makeId(),
                title: track.title,
                url: track.preview || `https://example.com/track/${idx}`,
                imgUrl: track.album?.cover_big || track.album?.cover_medium || '',
                artists: [track.artist?.name || 'Unknown'],
                addedAt: Date.now() - getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 365),
                album: track.album?.title || FALLBACK_ALBUMS[idx % FALLBACK_ALBUMS.length],
                duration: track.duration || getRandomIntInclusive(180, 420)
            }
        }
    } catch (err) {
        console.warn(`Deezer fetch failed for ${term}, using fallback data.`, err)
    }

    // Fallback data
    return {
        _id: makeId(),
        title: FALLBACK_TITLES[idx % FALLBACK_TITLES.length],
        url: `https://example.com/track/${idx}`,
        imgUrl: FALLBACK_IMG_URLS[idx % FALLBACK_IMG_URLS.length],
        artists: [FALLBACK_ARTISTS[idx % FALLBACK_ARTISTS.length]],
        addedAt: Date.now() - getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 365),
        album: FALLBACK_ALBUMS[idx % FALLBACK_ALBUMS.length],
        duration: getRandomIntInclusive(180, 420)
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
    const shuffledSongs = allSongs.sort(() => Math.random() - 0.5)
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
        imgUrl: stationSongs.map(song => song.imgUrl).filter(Boolean).slice(0, 4),
        isPrivate: Math.random() < 0.5,
        savedCount: getRandomIntInclusive(50, 9999),
        songs: stationSongs,
        createdAt: Date.now() - getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 365),
        createdBy: miniUser,
        participants: participants,
    }
}