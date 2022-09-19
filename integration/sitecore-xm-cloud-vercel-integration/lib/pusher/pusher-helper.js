import axios from "axios";

function sendErrorMessage(channel, message) {
    axios.post(`${process.env.HOST}/api/pusher?projectid=${channel}`, { message: message.toString(), type: "error" });
}

function sendInfoMessage(channel, message) {
    axios.post(`${process.env.HOST}/api/pusher?projectid=${channel}`, { message: message.toString(), type: "info" });
}

function sendSuccessMessage(channel, message) {
    axios.post(`${process.env.HOST}/api/pusher?projectid=${channel}`, { message: message.toString(), type: "success" });
}

export default { sendErrorMessage, sendInfoMessage, sendSuccessMessage }