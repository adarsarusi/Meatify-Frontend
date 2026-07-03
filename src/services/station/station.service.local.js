import fetchJsonp from 'fetch-jsonp'
import { storageService } from '../async-storage.service'
import { userService } from '../user'
import { songService } from '../song'
import { saveToStorage, loadFromStorage, makeId, getRandomIntInclusive, getRandomFromArr } from '../util.service'

const STATION_STORAGE_KEY = 'stationDB'
const SONG_STORAGE_KEY = 'songDB'

export const stationService = {
    query,
    getById,
    getByIds,
    save,
    remove,
    addStationMsg,
    addSongToStation,
    removeSongFromStation,
    generateSpotifyData,
}

window.cs = stationService

async function query(filterBy = {}) {
    let stations = await storageService.query(STATION_STORAGE_KEY) || []

    stations = await _ensureLikedStation(stations)

    const { txt, tags, artists } = filterBy

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
    if (stationId === 'likedSongs') {
        await _ensureLikedStation()
    }

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


async function addSongToStation(stationId, songId) {
    const station = await getById(stationId)
    const song = await songService.getById(songId)
    if (!station.songs) station.songs = []
    if (station.songs.some(song => song._id === songId)) return station

    station.songs.push(song)
    await save(station)
    return station
}

async function removeSongFromStation(stationId, songId) {
    const station = await getById(stationId)
    const songIdx = station.songs.findIndex(song => song._id === songId)
    if (songIdx === -1) return station

    station.songs.splice(songIdx, 1)

    await save(station)
    return station
}

async function _ensureLikedStation(stations = null) {
    if (!stations) {
        stations = await storageService.query(STATION_STORAGE_KEY) || []
    }

    const hasLikedStation = stations.some(station => station._id === 'likedSongs')
    if (hasLikedStation) return stations

    const likedStation = {
        _id: 'likedSongs',
        name: 'Liked Songs',
        type: 'station',
        createdBy: userService.getLoggedinUser() || { _id: 'guest', fullname: 'You', imgUrl: '' },
        songs: [],
        tags: ['Liked'],
        uploadImgUrl: 'https://misc.scdn.co/liked-songs/liked-songs-300.png',
        isPrivate: true,
        savedCount: 0,
        createdAt: Date.now()
    }

    const updatedStations = [likedStation, ...stations]
    await saveToStorage(STATION_STORAGE_KEY, updatedStations)
    return updatedStations
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
    'Bad Bunny', 'Dua Lipa', 'Olivia Rodrigo', 'Harry Styles', 'Doja Cat', 'SZA',
    'Tyler, The Creator', 'Kendrick Lamar', 'J. Cole', 'Beyonce', 'Taylor Swift', 'Rihanna',
    'Frank Ocean', 'Kali Uchis', 'Rosalia', 'Karol G', 'Rema', 'Burna Boy',
    'J Balvin', 'BLACKPINK', 'NewJeans', 'BTS', 'Fred again..', 'Disclosure',
    'Kaytranada', 'Daft Punk', 'Tame Impala', 'Arctic Monkeys', 'The Strokes', 'Paramore',
    'Nirvana', 'Pearl Jam', 'Soundgarden', 'Alice in Chains', 'Metallica', 'Deftones',
    'Phoebe Bridgers', 'Bon Iver', 'Fleetwood Mac', 'Stevie Wonder', 'Erykah Badu', 'Sade',
    'Miles Davis', 'John Coltrane', 'Nina Simone', 'Yussef Dayes', 'Khruangbin', 'Kacey Musgraves',
    'Dolly Parton', 'Chris Stapleton', 'Muddy Waters', 'B.B. King', 'Joni Mitchell', 'Bob Dylan'
]

const FALLBACK_TITLES = [
    'Blinding Lights', 'Levitating', 'As It Was', 'About Damn Time', 'Heat Waves', 'Anti-Hero',
    'Flowers', 'Vampire', 'Cruel Summer', 'Rolling in the Deep', 'Good as Hell', 'Bad Guy',
    'Shape of You', 'Uptown Funk', 'Closer', 'Cheap Thrills', 'Perfect', 'Thinking Out Loud',
    'Someone Like You', 'Counting Stars', 'Take Me Home', 'Night Changes', 'Story of My Life',
    'Kiss Me', 'Better Days', 'Electric Feel', 'Swim', 'The Mother', 'Dreams', 'Go Your Own Way',
    'Landslide', 'Rhiannon', 'Sara', 'Golden Hour', 'Neon Moon', 'Midnight City',
    'Sweet Disposition', 'Redbone', 'Pink + White', 'Lost in Yesterday', 'Eventually',
    'Digital Love', 'One More Time', 'Instant Crush', 'Dog Days Are Over', 'The Less I Know The Better',
    'Black Smoke Rising', 'Everlong', 'Come As You Are', 'Alive', 'Black Hole Sun', 'Would?',
    'Sweet Child O Mine', 'Master of Puppets', 'Change', 'Sweet Thing', 'No Ordinary Love',
    'On & On', 'Brown Sugar', 'Cranes in the Sky', 'Free Mind', 'Essence', 'Calm Down',
    'Tit Me Pregunto', 'La Bachata', 'Despacito', 'Titi Me Pregunto', 'Dynamite', 'How You Like That',
    'Hype Boy', 'Super Shy', 'Innerbloom', 'Rumble', 'Latch', 'Glue', 'Blue in Green',
    'So What', 'Feeling Good', 'Strange Fruit', 'Jolene', 'Tennessee Whiskey', 'Fast Car',
    'The Weight', 'Sweet Home Chicago', 'Mannish Boy', 'September', 'Good Times', 'I Feel Love'
]

const FALLBACK_ALBUMS = [
    'After Hours', 'Future Nostalgia', 'Sour', 'Midnights', 'Guts', 'UTOPIA', 'MOTM III',
    'IGOR', 'Astroworld', 'Good Kid, M.A.A.D City', 'Damn', 'Yeezus', 'Recovery',
    'The Marshall Mathers LP', 'Whole Lotta Red', 'Lover', 'Folklore', 'Evermore', 'Reputation',
    'Random Access Memories', 'Currents', 'AM', 'Is This It', 'Riot!', 'Nevermind',
    'Ten', 'Superunknown', 'Dirt', 'White Pony', 'Love Deluxe', 'Baduizm',
    'Brown Sugar', 'A Seat at the Table', 'Kind of Blue', 'Blue Train', 'Black Radio',
    'Golden Hour', 'Traveller', 'Rumours', 'Blue', 'Highway 61 Revisited',
    'El Ultimo Tour Del Mundo', 'Un Verano Sin Ti', 'Motomami', 'Made in Lagos',
    'Settle', 'Actual Life', '99.9%', 'Drunk', 'Mordechai', 'Maggot Brain'
]

const TITLE_VARIANTS = [
    'Night Drive', 'Sunset Edit', 'Studio Cut', 'Live Room', 'Afterglow Mix',
    'City Lights', 'Velvet Version', 'Festival Take', 'Deep Focus', 'Morning Run',
    'Acoustic Glow', 'Basement Tape'
]

const PLAYABLE_AUDIO_URLS = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3'
]

const FALLBACK_IMG_URLS = [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1459262838948-3e2de6c3ec05?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1499364238606-087db7ad4d3b?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1478225061937-adac64995dac?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516280440614-37882060ae69?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1508973379184-7517410fb0bc?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1483329078417-2ddf675a99a3?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=600&fit=crop'
]

const GENRE_PROFILES = {
    pop: {
        label: 'Pop',
        deezerQuery: 'pop hits',
        jamendoTag: 'pop',
        tags: ['Pop', 'Trending', 'Party'],
        stationNames: ['Pop Prism', 'Fresh Pop Glow', 'Big Hook Energy', 'Viral Pop Room'],
        descriptors: ['polished hooks', 'bright choruses', 'radio-ready shine'],
        coverOffset: 0
    },
    hiphop: {
        label: 'Hip Hop',
        deezerQuery: 'hip hop',
        jamendoTag: 'hiphop',
        tags: ['Hip Hop', 'Workout', 'Party'],
        stationNames: ['Midnight Cypher', '808 Boulevard', 'Rap Rotation', 'Heavy Bars'],
        descriptors: ['sharp drums', 'confident verses', 'low-end bounce'],
        coverOffset: 1
    },
    rock: {
        label: 'Rock',
        deezerQuery: 'rock',
        jamendoTag: 'rock',
        tags: ['Rock', 'Driving', 'Motivation'],
        stationNames: ['Guitar Weather', 'Amp Room', 'Roadhouse Rock', 'Indie Amplified'],
        descriptors: ['live-wire guitars', 'anthemic builds', 'garage energy'],
        coverOffset: 2
    },
    electronic: {
        label: 'Electronic',
        deezerQuery: 'electronic',
        jamendoTag: 'electronic',
        tags: ['Electronic', 'Party', 'Gaming'],
        stationNames: ['Neon Pulse', 'Afterhours Circuit', 'Synth Current', 'Warehouse Glow'],
        descriptors: ['clean synth lines', 'club momentum', 'kinetic textures'],
        coverOffset: 3
    },
    latin: {
        label: 'Latin',
        deezerQuery: 'latin hits',
        jamendoTag: 'latin',
        tags: ['Latin', 'Party', 'Mood'],
        stationNames: ['Latin Heatwave', 'Baila Central', 'Sunset Urbano', 'Reggaeton Gold'],
        descriptors: ['sunlit rhythm', 'dance-floor swing', 'warm percussion'],
        coverOffset: 4
    },
    kpop: {
        label: 'K-Pop',
        deezerQuery: 'k-pop',
        jamendoTag: 'pop',
        tags: ['K-Pop', 'Trending', 'Party'],
        stationNames: ['Seoul Spark', 'Idol Rush', 'K-Pop Chrome', 'Candy Stage'],
        descriptors: ['glossy production', 'laser-cut hooks', 'maximal pop color'],
        coverOffset: 5
    },
    jazz: {
        label: 'Jazz',
        deezerQuery: 'jazz',
        jamendoTag: 'jazz',
        tags: ['Jazz', 'Focus', 'Sleep'],
        stationNames: ['Blue Hour Jazz', 'Late Set', 'Smoke Room Standards', 'Piano Club'],
        descriptors: ['loose swing', 'warm improvisation', 'late-night calm'],
        coverOffset: 6
    },
    rnb: {
        label: 'R&B',
        deezerQuery: 'rnb',
        jamendoTag: 'rnb',
        tags: ['R&B', 'Soul', 'Romance', 'Mood'],
        stationNames: ['Velvet R&B', 'Slow Burn Soul', 'Moonlit Vocals', 'Quiet Storm'],
        descriptors: ['silky vocals', 'soft groove', 'after-dark warmth'],
        coverOffset: 7
    },
    indie: {
        label: 'Indie',
        deezerQuery: 'indie',
        jamendoTag: 'indie',
        tags: ['Indie', 'Chill', 'Focus'],
        stationNames: ['Indie Apartment', 'Soft Static', 'Bedroom Bloom', 'Analog Daydream'],
        descriptors: ['textured guitars', 'intimate vocals', 'handmade atmosphere'],
        coverOffset: 8
    },
    reggae: {
        label: 'Reggae',
        deezerQuery: 'reggae',
        jamendoTag: 'reggae',
        tags: ['Reggae', 'Chill', 'Mood', 'Party'],
        stationNames: ['Island Drift', 'Roots & Sun', 'Dub Garden', 'Reggae Sunset'],
        descriptors: ['easy skank', 'warm bass', 'sun-soaked rhythm'],
        coverOffset: 9
    },
    metal: {
        label: 'Metal',
        deezerQuery: 'metal',
        jamendoTag: 'metal',
        tags: ['Metal', 'Workout', 'Motivation'],
        stationNames: ['Iron Circuit', 'Heavy Weather', 'Riff Forge', 'Dark Stage'],
        descriptors: ['dense riffs', 'double-kick drive', 'towering distortion'],
        coverOffset: 10
    },
    classical: {
        label: 'Classical',
        deezerQuery: 'classical',
        jamendoTag: 'classical',
        tags: ['Classical', 'Study', 'Focus'],
        stationNames: ['Quiet Conservatory', 'Strings at Dawn', 'Piano Library', 'Orchestral Focus'],
        descriptors: ['patient dynamics', 'elegant strings', 'cinematic space'],
        coverOffset: 11
    },
    country: {
        label: 'Country',
        deezerQuery: 'country',
        jamendoTag: 'country',
        tags: ['Country', 'Roadtrip', 'Throwback'],
        stationNames: ['Country Roads', 'Desert Radio', 'Porchlight Country', 'Highway Ballads'],
        descriptors: ['road-worn guitars', 'plainspoken stories', 'golden-hour twang'],
        coverOffset: 12
    },
    blues: {
        label: 'Blues',
        deezerQuery: 'blues',
        jamendoTag: 'blues',
        tags: ['Blues', 'Mood', 'Chill'],
        stationNames: ['Blue Smoke', 'Delta Night', 'Guitar & Gravel', 'After Midnight Blues'],
        descriptors: ['bent-note guitar', 'smoky phrasing', 'slow-burning soul'],
        coverOffset: 13
    },
    folk: {
        label: 'Folk',
        deezerQuery: 'folk',
        jamendoTag: 'folk',
        tags: ['Folk', 'Chill', 'Roadtrip'],
        stationNames: ['Folk Trails', 'Cabin Session', 'Open Road Folk', 'Acoustic Fireside'],
        descriptors: ['fingerpicked warmth', 'story-first writing', 'natural room tone'],
        coverOffset: 14
    },
    funk: {
        label: 'Funk',
        deezerQuery: 'funk',
        jamendoTag: 'funk',
        tags: ['Funk', 'Party', 'Disco'],
        stationNames: ['Funk Factory', 'Pocket Groove', 'Chrome Bassline', 'Friday Funk'],
        descriptors: ['tight basslines', 'syncopated guitars', 'danceable pocket'],
        coverOffset: 15
    },
    soul: {
        label: 'Soul',
        deezerQuery: 'soul',
        jamendoTag: 'soul',
        tags: ['Soul', 'Romance', 'Mood'],
        stationNames: ['Soul Serenade', 'Golden Vocals', 'Warm Vinyl Soul', 'Heartline Radio'],
        descriptors: ['rich vocals', 'deep pocket drums', 'warm vintage color'],
        coverOffset: 16
    },
    punk: {
        label: 'Punk',
        deezerQuery: 'punk',
        jamendoTag: 'punk',
        tags: ['Punk', 'Rock', 'Motivation'],
        stationNames: ['Punk Basement', 'Fast Loud Now', 'Three Chords', 'Static Rebellion'],
        descriptors: ['fast guitars', 'raw chants', 'basement urgency'],
        coverOffset: 17
    },
    ambient: {
        label: 'Ambient',
        deezerQuery: 'ambient',
        jamendoTag: 'ambient',
        tags: ['Ambient', 'Sleep', 'Focus'],
        stationNames: ['Ambient Escape', 'Cloud Field', 'Deep Rest Signal', 'Weightless Room'],
        descriptors: ['slow motion pads', 'wide-open space', 'soft-focus texture'],
        coverOffset: 18
    },
    disco: {
        label: 'Disco',
        deezerQuery: 'disco',
        jamendoTag: 'disco',
        tags: ['Disco', 'Party', 'Throwback'],
        stationNames: ['Disco Fever', 'Mirrorball Magic', 'Saturday Glitter', 'Studio 79'],
        descriptors: ['four-on-the-floor lift', 'sparkling strings', 'mirrorball momentum'],
        coverOffset: 19
    }
}

const SEARCH_TERMS = Object.keys(GENRE_PROFILES)
const ALL_TAGS = [...new Set(Object.values(GENRE_PROFILES).flatMap(profile => profile.tags))]
const SONG_TAGS_MAP = Object.fromEntries(SEARCH_TERMS.map(term => [term, GENRE_PROFILES[term].tags]))
const STATION_NAMES = Object.values(GENRE_PROFILES).flatMap(profile => profile.stationNames)

export let TAGS_DATA = []

const TAG_COLORS = {
    Pop: '#f16cd5', 'Hip Hop': '#b74aff', Rock: '#E8115B', Electronic: '#3edd3e',
    Latin: '#E13300', 'K-Pop': '#af2896', Chill: '#477D95', Workout: '#f7b968',
    Party: '#c268f7', Focus: '#dd9e6a', Sleep: '#2D46B9', Gaming: '#27856A',
    Driving: '#8f8e8d', Mood: '#509BF5', Trending: '#ee632c', Jazz: '#6C5B7B',
    'R&B': '#9B5DE5', Indie: '#2A9D8F', Reggae: '#2F9E44', Metal: '#4a4a4a',
    Classical: '#8B5E3C', Country: '#C97B3D', Blues: '#1E4E8C', Folk: '#6B8E4E',
    Funk: '#D9822B', Soul: '#A63A50', Punk: '#D6001C', Ambient: '#3C6E71',
    Disco: '#B23AEE', Romance: '#E85D75', Study: '#5B7C99', Roadtrip: '#F2A65A',
    Motivation: '#E8590C', Throwback: '#9C6644', Liked: '#5038a0'
}

const TAG_SEARCH_QUERIES = {
    Pop: 'pop concert stage', 'Hip Hop': 'hip hop street', Rock: 'rock band guitar',
    Electronic: 'electronic music neon', Latin: 'latin dance music',
    'K-Pop': 'kpop stage lights', Chill: 'chill lounge relax', Workout: 'gym workout fitness',
    Party: 'party crowd dance', Focus: 'focus desk work', Sleep: 'sleep night dark',
    Gaming: 'gaming setup neon', Driving: 'driving night road', Mood: 'mood aesthetic vibe',
    Trending: 'trending viral colorful', Jazz: 'jazz saxophone club',
    'R&B': 'neon microphone stage red', Indie: 'indie bedroom aesthetic', Reggae: 'reggae beach sunset',
    Metal: 'metal concert dark', Classical: 'classical piano orchestra', Country: 'country road field',
    Blues: 'blues guitar smoky', Folk: 'folk acoustic cabin', Funk: 'funk disco groove',
    Soul: 'vinyl record player warm light', Punk: 'punk mosh pit crowd', Ambient: 'foggy misty landscape minimal',
    Disco: 'disco ball party', Romance: 'romance candles couple', Study: 'study library books',
    Roadtrip: 'roadtrip highway sunset', Motivation: 'motivation sunrise mountain', Throwback: 'retro vintage 80s',
    Liked: 'roadtrip highway sunset'
}

async function buildTagsData() {
    const entries = await Promise.all(
        Object.keys(TAG_COLORS).map(async (title) => {
            const imgUrl = await fetchTagImageFromUnsplash(TAG_SEARCH_QUERIES[title] || title)
            return { title, color: TAG_COLORS[title], imgUrl }
        })
    )
    return entries
}

export async function initTagsData() {
    if (TAGS_DATA.length) return TAGS_DATA
    TAGS_DATA = await buildTagsData()
    return TAGS_DATA
}

function upscaleImageUrl(url, size) {
    if (!url) return url
    return url.replace(/([?&])w=\d+&h=\d+/, `$1w=${size}&h=${size}`)
}

const STATION_COVER_URLS = FALLBACK_IMG_URLS.map(url => upscaleImageUrl(url, 500))

// ------------------------------------------------------------------
// COMBINED DATA SOURCES — Deezer (mainstream, real cover_xl art, previews)
// + Jamendo (full-length playable audio, no login required)
// Register a free Jamendo client_id at https://developer.jamendo.com/
// ------------------------------------------------------------------

const UNSPLASH_ACCESS_KEY = '0NmFdVz_ARctvjTEja7Z_TVqqyZXldYAGGg_21lHWQ0'

const tagImageCache = {}

async function fetchTagImageFromUnsplash(tag) {
    if (tagImageCache[tag]) return tagImageCache[tag]

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(tag)}&per_page=1&orientation=squarish&client_id=${UNSPLASH_ACCESS_KEY}`
    try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Unsplash fetch failed: ${res.status}`)
        const json = await res.json()
        const photo = json?.results?.[0]
        if (!photo) throw new Error('No results')

        const imgUrl = `${photo.urls.raw}&w=400&h=400&fit=crop&crop=faces,entropy&q=80`
        tagImageCache[tag] = imgUrl
        return imgUrl
    } catch (err) {
        console.warn(`Unsplash fetch failed for tag "${tag}"`, err)
        return FALLBACK_IMG_URLS[0]
    }
}

let combinedPoolPromise = null
let stationCoverPoolPromise = null

async function fetchITunesTracks(term) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=50`
    try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`iTunes fetch failed: ${res.status}`)
        const json = await res.json()
        return (json.results || [])
            .filter(t => t.previewUrl && t.artworkUrl100 && t.trackName && t.artistName)
            .map(t => ({
                source: 'itunes',
                id: `itunes_${t.trackId}`,
                title: t.trackName,
                url: t.previewUrl,
                previewUrl: t.previewUrl,
                imgUrl: t.artworkUrl100.replace('100x100', '600x600'),
                artistName: t.artistName,
                album: t.collectionName || 'Single',
                duration: Math.round((t.trackTimeMillis || 0) / 1000),
                term
            }))
    } catch (err) {
        console.warn(`iTunes fetch failed for ${term}`, err)
        return []
    }
}

async function fetchDeezerTracks(term) {
    const url = `https://api.deezer.com/search?q=${encodeURIComponent(term)}&limit=50&output=jsonp`
    try {
        const res = await fetchJsonp(url)
        if (!res.ok) throw new Error('Deezer API unavailable')
        const json = await res.json()
        return (json?.data || [])
            .filter(t => t.preview && (t.album?.cover_xl || t.album?.cover_big) && t.title && t.artist?.name)
            .map(t => ({
                source: 'deezer',
                id: `deezer_${t.id}`,
                title: t.title,
                url: t.preview,
                previewUrl: t.preview,
                imgUrl: t.album.cover_xl || t.album.cover_big,
                artistName: t.artist.name,
                album: t.album.title || 'Unknown album',
                duration: Number(t.duration) || 0,
                term
            }))
    } catch (err) {
        console.warn(`Deezer fetch failed for ${term}`, err)
        return []
    }
}


function jsonpRequest(url) {
    return new Promise((resolve, reject) => {
        const callbackName = `deezer_cb_${Date.now()}_${Math.floor(Math.random() * 10000)}`
        window[callbackName] = (data) => {
            resolve(data)
            delete window[callbackName]
            script.remove()
        }
        const script = document.createElement('script')
        script.src = `${url}&output=jsonp&callback=${callbackName}`
        script.onerror = reject
        document.body.appendChild(script)
    })
}

function shuffleArray(arr) {
    const copy = [...arr]
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}

let coverQueue = []

function getUniqueCover(coversPool) {
    if (!coversPool.length) return ''
    if (coverQueue.length === 0) {
        coverQueue = shuffleArray(coversPool)
    }
    return coverQueue.pop()
}


async function fetchDeezerStationCovers() {
    if (!stationCoverPoolPromise) {
        stationCoverPoolPromise = (async () => {
            try {
                const [albumData, playlistData] = await Promise.all([
                    jsonpRequest('https://api.deezer.com/chart/0/albums?limit=100'),
                    jsonpRequest('https://api.deezer.com/chart/0/playlists?limit=100')
                ])

                const albumCovers = (albumData?.data || [])
                    .map(a => a.cover_xl || a.cover_big)
                    .filter(Boolean)

                const playlistCovers = (playlistData?.data || [])
                    .map(p => p.picture_xl || p.picture_big)
                    .filter(Boolean)

                const covers = [...albumCovers, ...playlistCovers]
                console.log(`Fetched ${covers.length} Deezer covers (albums + playlists) for stations`)
                return covers
            } catch (err) {
                console.warn('Deezer station covers fetch failed', err)
                return []
            }
        })()
    }
    return stationCoverPoolPromise
}

async function buildCombinedPool() {
    if (!combinedPoolPromise) {
        combinedPoolPromise = (async () => {
            const deezerResults = await Promise.all(
                SEARCH_TERMS.map(term => fetchDeezerTracks(term))
            )

            const itunesResults = await Promise.all(
                SEARCH_TERMS.map(term => fetchITunesTracks(term))
            )

            const combined = [...deezerResults.flat(), ...itunesResults.flat()]

            const seen = new Set()
            const deduped = combined.filter(track => {
                const key = `${track.title}__${track.artistName}`.toLowerCase()
                if (seen.has(key)) return false
                seen.add(key)
                return true
            })

            const shuffled = deduped.sort(() => Math.random() - 0.5)

            console.log(`Combined pool built: ${shuffled.length} unique tracks (Deezer + iTunes)`)
            return shuffled
        })()
    }
    return combinedPoolPromise
}

export async function generateSpotifyData(songsCount = 800, stationsCount = 250) {
    await initTagsData()

    const existingSongs = await loadFromStorage(SONG_STORAGE_KEY)
    const existingStations = await loadFromStorage(STATION_STORAGE_KEY)

    const songsReady = existingSongs && existingSongs.length > 1
    const stationsReady = existingStations && existingStations.length > 1

    if (songsReady && stationsReady) {
        console.log('Spotify data already exists in storage, skipping generation')
        return
    }

    const pool = await buildCombinedPool()

    if (pool.length < 50) {
        console.error('Combined pool too small — check network connectivity')
    }

    if (!songsReady) {
        await _initData(SONG_STORAGE_KEY, (idx) => _generateSong(idx, pool), Math.min(songsCount, pool.length || songsCount))
    }

    if (!stationsReady) {
        await _initData(STATION_STORAGE_KEY, _generateStation, stationsCount)
    }
}

async function _initData(key, generateFn, count) {
    let data = await loadFromStorage(key)
    if (data && data.length > 1) return

    data = await Promise.all(Array.from({ length: count }, (_, i) => generateFn(i)))
    await saveToStorage(key, data)
}

function formatDuration(seconds) {
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

async function _generateSong(idx, pool) {
    if (pool && pool.length) {
        const track = pool[idx % pool.length]
        const duration = track.duration || getRandomIntInclusive(180, 420)
        const tags = SONG_TAGS_MAP[track.term] || ['Trending']
        const description = `${track.artistName} — "${track.title}" from the album ${track.album}.`

        return {
            _id: makeId(),
            title: track.title,
            url: track.url,
            previewUrl: track.previewUrl,
            imgUrl: track.imgUrl,
            artists: [track.artistName],
            addedAt: Date.now() - getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 365),
            album: track.album,
            duration,
            durationLabel: formatDuration(duration),
            tags,
            type: 'song',
            description
        }
    }

    const term = SEARCH_TERMS[idx % SEARCH_TERMS.length]
    const tags = SONG_TAGS_MAP[term] || ['Trending']
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
        type: 'song',
        description: `Fallback song from the album ${FALLBACK_ALBUMS[idx % FALLBACK_ALBUMS.length]}. Curated mix.`
    }
}

async function _generateStation(idx) {
    const FALLBACK_COVER = 'https://via.placeholder.com/600x600/1a1a1a/ffffff?text=No+Cover'

    function pickCoverUrl(url) {
        if (url && typeof url === 'string' && url.trim() !== '') {
            return url
        }
        return FALLBACK_COVER
    }

    const tagCount = getRandomIntInclusive(2, 6)
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
    const shuffledSongs = shuffleArray(allSongs)
    const stationSongs = shuffledSongs.slice(0, getRandomIntInclusive(12, 35))

    const allUsers = await loadFromStorage('userDB') || []
    const randomUser = allUsers.length > 0
        ? allUsers[getRandomIntInclusive(0, allUsers.length - 1)]
        : { _id: makeId(), fullname: `Creator ${idx}`, imgUrl: `https://i.pravatar.cc/150?img=${idx}` }

    const randomUsers = getRandomFromArr(allUsers, getRandomIntInclusive(0, 6))
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

    const songsImagesUrls = stationSongs.map(song => pickCoverUrl(song.imgUrl)).slice(0, 4)

    const hasEnoughMosaic = songsImagesUrls.length >= 4
    const wantsEmptyCover = Math.random() < 0.35 && hasEnoughMosaic

    let uploadImgUrl = ''
    if (!wantsEmptyCover) {
        const deezerCovers = await fetchDeezerStationCovers()
        const rawCoverUrl = deezerCovers.length > 0
            ? getUniqueCover(deezerCovers)
            : (stationSongs[getRandomIntInclusive(0, stationSongs.length - 1)]?.imgUrl || '')
        uploadImgUrl = pickCoverUrl(rawCoverUrl)
    }

    const randomStationName = STATION_NAMES[getRandomIntInclusive(0, STATION_NAMES.length - 1)]
    const nameSuffix = Math.random() < 0.15 ? ` ${getRandomIntInclusive(2, 99)}` : ''

    return {
        _id: makeId(),
        name: `${randomStationName}${nameSuffix}`,
        tags: stationTags,
        uploadImgUrl,
        songsImagesUrls,
        isPrivate: Math.random() < 0.4,
        savedCount: getRandomIntInclusive(10, 15000),
        songs: stationSongs,
        createdAt: Date.now() - getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 365),
        createdBy: miniUser,
        participants: participants,
        type: 'station'
    }
}