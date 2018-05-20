const elasticsearch = require("elasticsearch");

const indexName = "iot-sensor-data";
const sensorLocation = ["B1A1", "B1A2", "B2A67", "B2A68"]
const cameraValue = [0, 1]; // Online: 1, Offline: 0
const waterValve = [0, 1]; // Open: 1, Close: 0
const waterSensor = [0, 1]; // Wet: 1, Dry: 0

const esClient = new elasticsearch.Client({
    host: "127.0.0.1:9200",
    log: "error"
});

const getTemperatureValues = () => {
    return {
        deviceValue: getRandomInt(60, 100),
        deviceId: getRandomItem(sensorLocation),
        deviceParameter: "Temperature",
        timestamp: randomDate(new Date(2018, 1, 1), new Date())
    }
}

const getHumidityValues = () => {
    return {
        deviceValue: getRandomInt(50, 90),
        deviceId: getRandomItem(sensorLocation),
        deviceParameter: "Humidity",
        timestamp: randomDate(new Date(2018, 1, 1), new Date())
    }
}

const getCameraValue = () => { 
    return {
        deviceValue: getRandomItem(cameraValue),
        deviceId: getRandomItem(sensorLocation),
        deviceParameter: "Camera",
        timestamp: randomDate(new Date(2018, 1, 1), new Date())
    }
}

const getWaterValveValue = () => ({
    deviceValue: getRandomItem(waterValve),
    deviceId: getRandomItem(sensorLocation),
    deviceParameter: "WaterValve",
    timestamp: randomDate(new Date(2018, 1, 1), new Date())
});

const getWaterSensorValue = () => ({
    deviceValue: getRandomItem(waterSensor),
    deviceId: getRandomItem(sensorLocation),
    deviceParameter: "WaterSensor",
    timestamp: randomDate(new Date(2018, 1, 1), new Date())
});


const addDocument = (data) => esClient.index({ index: indexName, type: "document", body: data });

const getRandomItem = (items) => {
    const randIndex = Math.floor(Math.random() * items.length);
    return items[randIndex];
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

for(let i = 0; i < 200; i++) {
 // addDocument(getCameraValue());
 addDocument(getWaterValveValue());
 // addDocument(getWaterSensorValue());
}