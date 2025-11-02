// Configuración MQTT
const broker = "mqtt.flespi.io";
const port = 80; // WebSocket
const token = "WE5ug92S0I6wxZXBrSgVn4zaYkcv0nEgnvTTBird4ATm5djaxGN90dt1XFpWogtx";

const topicIn = "chat/mensaje";      // Mensajes que envía el usuario
const topicOut = "chat/respuesta";   // Mensajes que envía Sorfi

// Crear cliente MQTT
const clientID = "webchat_" + Math.floor(Math.random() * 1000);
const client = new Paho.MQTT.Client(broker, port, clientID);

client.onConnectionLost = function(responseObject) {
    console.log("Conexión perdida:", responseObject.errorMessage);
};

client.onMessageArrived = function(message) {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<div class="sorfi-msg">${message.payloadString}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
};

// Conectar al broker
client.connect({
    useSSL: false,
    userName: token,
    password: "",
    onSuccess: function() {
        console.log("Conectado al broker MQTT");
        client.subscribe(topicOut);
        // Opcional: enviar mensaje de presencia
        const mensaje = new Paho.MQTT.Message("¡Webchat conectado!");
        mensaje.destinationName = topicIn;
        client.send(mensaje);
    }
});

// Enviar mensaje desde el input
document.getElementById("send-btn").addEventListener("click", function() {
    const input = document.getElementById("input-msg");
    if(input.value.trim() === "") return;

    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<div class="user-msg">${input.value}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    const message = new Paho.MQTT.Message(input.value);
    message.destinationName = topicIn;
    client.send(message);

    input.value = "";
});

// También enviar con Enter
document.getElementById("input-msg").addEventListener("keypress", function(e) {
    if(e.key === "Enter") document.getElementById("send-btn").click();
});
