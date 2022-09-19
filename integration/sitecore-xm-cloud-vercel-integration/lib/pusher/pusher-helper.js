import axios from "axios";

export function sendErrorMessage(channel, message) {
    axios.post(`${process.env.HOST}/api/pusher?projectid=${channel}`, { message:  message, type: "error" });

}

export function sendInfoMessage(channel, message) {
    axios.post(`${process.env.HOST}/api/pusher?projectid=${channel}`, { message:  message, type: "info" });
}

export function sendSuccessMessage(channel, message) {
    axios.post(`${process.env.HOST}/api/pusher?projectid=${channel}`, { message:  message, type: "success" });
}