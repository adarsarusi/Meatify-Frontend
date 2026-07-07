export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    randomPastTime,
    debounce,
}

window.cs = utilService

export function makeId(prefix = '', length = 6) {
    let txt = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return `${prefix}${txt}`;
}

export function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


export function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

export function getRandomFromArr(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
}

export function formatTime(seconds = 0) {
    const s = Math.floor(seconds % 60)
    const m = Math.floor(seconds / 60)
    return `${m}:${s.toString().padStart(2, "0")}`
}

export function shuffle(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

export function getMostCommonTags(songs, limit = 3) {
    if (!songs?.length) return []

    const tagCountMap = {}

    songs.forEach(song => {
        song.tags?.forEach(tag => {
            tagCountMap[tag] = (tagCountMap[tag] || 0) + 1
        })
    })

    return Object.entries(tagCountMap)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, limit)
        .map(([tag]) => tag)
}

export function formatArtists(song) {
    return (song.artists || []).map(artist => artist.name).join(", ")
}