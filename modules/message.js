"use strict";
/**
 * Returns a message
 * @param {string} msg - The Message which will be displayed.
 * @param {number} displaytime - The Time until Message disapears in ms.
 * @param {string} messageType - Message Appeareance: Info, Alert.
 */

export function showMessage(msg, displaytime, messageType) {
    const messageContainer = document.getElementById("messageContainer");
    messageContainer.classList.remove('infoMessage');
    messageContainer.classList.remove('alertMessage');

    if (messageType === 'Info') {
        messageContainer.classList.add('infoMessage')
    }
    if (messageType === 'Alert') {
        messageContainer.classList.add('alertMessage')
    }

    message.innerHTML = msg
    messageContainer.classList.add("active")

    setTimeout(() => {
        messageContainer.classList.remove("active")
    }, displaytime);
}