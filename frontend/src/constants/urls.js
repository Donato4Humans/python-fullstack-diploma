const baseURL = '/api'

const auth = '/auth'
const venues = '/venues'
const admin = '/admin'

const urls = {
    auth: {
        login: auth,
        siteRole: `${auth}/site_role`,
        refresh: `${auth}/refresh`,
        socket: `${auth}/socket`
    },
    venues,
    admin
}


export {
    baseURL,
    urls
}