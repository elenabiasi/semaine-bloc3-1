function generateRandomLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    return alphabet[Math.floor(Math.random() * alphabet.length)]
}

function lerp(start, stop, amount) {
    return amount * (stop - start) + start
}

function round(num, decimalPoint = 100) {
    return Math.round((num + Number.EPSILON) * decimalPoint) / decimalPoint
}

function modulo(num, mod) {
    return ((num % mod) + mod) % mod
}

function random(a, b) {
    if (arguments.length === 1) {
        if (Array.isArray(a)) {
            const index = Math.floor(random(a.length))

            return a[index]
        } else if (typeof a === 'object') {
            return random(Object.values(a))
        } else if (isNumber(a)) {
            return Math.random() * a
        }
    } else if (arguments.length === 0) {
        return Math.random()
    }

    return Math.random() * (b - a) + a
}

function isNumber(elem) {
    return !(isNaN(elem) || elem === null)
}