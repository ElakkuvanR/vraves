import axios from "axios";

export default function sendErrorMessage(channel, message) {
    axios.post(`${process.env.HOST}/api/pusher?projectid=${channel}`, { message:  message, type: "error" });

}

export default function sendInfoMessage(channel, message) {
    axios.post(`${process.env.HOST}/api/pusher?projectid=${channel}`, { message:  message, type: "info" });
}

export default function sendSuccessMessage(channel, message) {
    axios.post(`${process.env.HOST}/api/pusher?projectid=${channel}`, { message:  message, type: "success" });
}