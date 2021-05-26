const url = 'http://api.pattanachai.xyz/api/'

async function uploadAudio(name,audioBlob) {
    const formData = new FormData()
    formData.append('name',name)
    formData.append('file',audioBlob)
    const res = await axios.post(url+'audios', formData)
    return res.data
}

function getAudio(id) {
    return new Audio(url+'audios/'+id+'/file');
}

async function deleteAudio(id) {
    await axios.delete(url+'audios/'+id)
}

async function createDevice(name,mqtt_client_id) {
    const res = await axios.post(url+'devices', {name, mqtt_client_id})
    return res.data
}

async function getDevices() {
    const res = await axios.get(url+'devices')
    return res.data
}

async function getDevice(id) {
    const res = await axios.get(url+'devices/'+id)
    return res.data
}

async function deleteDevice(id) {
    await axios.delete(url+'devices')
}

// createSchedule('test2', new Date(), ["60ae65bcd5d6370011e0d332"], "60ae6598d5d6370011e0d331").then(response => console.log(response));
async function createSchedule(name, time, receivers, audio) {
    const res = await axios.post(url+'schedules', {
        name,
        time,
        receivers,
        audio
    })
    return res.data
}

async function getSchedules() {
    const res = await axios.get(url+'schedules')
    return res.data
}

async function getSchedule(id) {
    const res = await axios.get(url+'schedules/'+id)
    return res.data
}

async function deleteSchedule(id) {
    await axios.delete(url+'schedules/'+id)
}

async function deleteAllSchedules() {
    await axios.delete(url+'schedules')
}

async function getScheduleResponse(id) {
    const res = await axios.get(url+'tasks/schedule-response/'+id)
    return res.data
}