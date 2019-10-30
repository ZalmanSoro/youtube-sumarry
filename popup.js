const youtubeScript = `var data = {
	title: document.getElementsByClassName('title style-scope ytd-video-primary-info-renderer')[0].children[0].innerHTML,
	duration: document.getElementsByClassName('video-stream html5-main-video')[0].duration,
	currentTime: document.getElementsByClassName('video-stream html5-main-video')[0].currentTime
}; data`

// const youtubeScript = 'console.log(JSON.stringify(document,0,2))'
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

function updateTime(duration, currentTime) {
    let sum = timeToFloat(document.getElementById('totalMinutes').innerText)
    sum += (duration - currentTime)
    document.getElementById('totalMinutes').innerText = floatToTime(sum)
}

function updateTable(data) {
    var table = document.getElementById('summaryTable')
    var nextRow = table.rows.length
    var row = table.insertRow(nextRow)
    var title = row.insertCell(0)
    var duration = row.insertCell(1)
    var timeLeft = row.insertCell(2)
    title.innerHTML = data.title
    duration.innerHTML = floatToTime(data.duration)
    timeLeft.innerHTML = floatToTime(data.duration - data.currentTime)
}

function updateTotal() {
    chrome.tabs.query({ url: 'https://*.youtube.com/*' }, function(tabs) {
        document.getElementById('totalMinutes').innerText = '0. 00:00:00'
        var table = document.getElementById('summaryTable')
        var length = table.rows.length
        for (i = 1; i < length; i++) {
            table.deleteRow(1)
        }
        for (tab of tabs) {
            chrome.tabs.executeScript(tab.id, { code: youtubeScript }, function(data) {
                updateTime(data[0].duration, data[0].currentTime)
                updateTable(data[0])
            })
        }
        document.getElementById('totalTabs').innerText = `In ${tabs.length} tabs`
    })
}

chrome.browserAction.onClicked.addListener(updateTotal())
chrome.browserAction.onClicked.addListener(window.setInterval(updateTotal, 3000))