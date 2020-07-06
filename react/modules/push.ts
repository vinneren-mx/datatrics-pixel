window._paq = window._paq || []

export default function push(event: any) {
    console.log('datatrics', event)
    window._paq.push(event)
}