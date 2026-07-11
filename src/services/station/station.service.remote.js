import { httpService } from '../http.service'

export const stationService = {
    query,
    getById,
    save,
    remove,
    addStationMsg,
}

async function query() {
    return httpService.get(`station`)
}

function getById(stationId) {
    return httpService.get(`station/${stationId}`)
}

async function remove(stationId) {
    return httpService.delete(`station/${stationId}`)
}
async function save(station) {
    var savedStation
    if (station._id) {
        savedStation = await httpService.put(`station/${station._id}`, station)
    } else {
        savedStation = await httpService.post('station', station)
    }
    return savedStation
}

async function addStationMsg(stationId, txt) {
    const savedMsg = await httpService.post(`station/${stationId}/msg`, {txt})
    return savedMsg
}


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
    Motivation: '#E8590C', Throwback: '#9C6644', Liked: '#5038a0', Israeli: '#0038b8'
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
    Liked: 'heart love music', Israeli: 'tel aviv skyline night'
}

const UNSPLASH_ACCESS_KEY = '0NmFdVz_ARctvjTEja7Z_TVqqyZXldYAGGg_21lHWQ0'
const LASTFM_API_KEY = '05855db705ab67b60735b4fcfbcc4d85'

async function initTagsData() {
    if (TAGS_DATA.length) return TAGS_DATA
    TAGS_DATA = await buildTagsData()
    return TAGS_DATA
}

function upscaleImageUrl(url, size) {
    if (!url) return url
    return url.replace(/([?&])w=\d+&h=\d+/, `$1w=${size}&h=${size}`)
}


