function formatTimeElement(element) {
    const fixed = element.toFixed()
    return fixed >= 10 ? fixed : `0${fixed}`
}

function floatToTime(totalsSeconds) {
    const seconds = totalsSeconds % 60
    const totalMinutes = Math.floor(totalsSeconds / 60)
    const minutes = totalMinutes % 60
    const totalHours = Math.floor(totalMinutes / 60)
    const hours = totalHours % 24
    const days = Math.floor(totalHours / 24)

    return `${days.toFixed()}. ${formatTimeElement(hours)}:${formatTimeElement(minutes)}:${formatTimeElement(seconds)}`;
}

function timeToFloat(time) {
    let seconds = 0
    const daysAndTimeArr = time.split('. ')
    seconds += daysAndTimeArr[0] * 24 * 3600
    const timeArr = daysAndTimeArr[1].split(':')
    seconds += Number(timeArr[0] * 3600)
    seconds += Number(timeArr[1] * 60)
    seconds += Number(timeArr[2])
    return Number(seconds)
}

function updateTotal() {
    chrome.tabs.query({ url: 'https://*.youtube.com/*' }, function (tabs) {
        document.getElementById('totalMinutes').innerText = '0. 00:00:00'
        for (tab of tabs) {
            chrome.tabs.executeScript(tab.id, { code: `document.getElementsByClassName('video-stream html5-main-video')[0].duration - document.getElementsByClassName('video-stream html5-main-video')[0].currentTime` }, function (time) {
                let sum = timeToFloat(document.getElementById('totalMinutes').innerText)
                sum += time[0]
                document.getElementById('totalMinutes').innerText = floatToTime(sum)
            })
        }
        document.getElementById('totalTabs').innerText = `In ${tabs.length} tabs`

    })
}
document.getElementById('updateTotal').addEventListener('click', updateTotal);