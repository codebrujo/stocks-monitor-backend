const { Worker } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');
const LOCAL_INSTANCE_ID = 'root';

const workersDir = path.normalize(`${__dirname}`);
const workers = [];
let messageQueue = [];
let messageCounter = 0;

const restartWorker = (workerId) => {
    const worker = workers.find(item => item.id === workerId);
    if (worker) {
        try {
            worker.worker.terminate();
        } catch (err) {}
        createWorker(workerId, worker);
    }
};

const handleWorkerStop = (code, workerId) => {
    if (code !== 0) {
        logger.error(`${LOCAL_INSTANCE_ID}: worker ${workerId} stopped with exit code ${code}`);
    }
    const worker = workers.find(item => item.id === workerId);
    if (worker) {
        worker.running = false;
    }
};

const sendMessage = async(recepientId, type, data) => {
    const recepientItem = workers.find(item => item.id === recepientId);
    const msg = {
        sender: LOCAL_INSTANCE_ID,
        recepient: recepientId,
        type,
        data,
        timestamp: Date(),
    };
    try { recepientItem.worker.postMessage(msg); } catch (e) {
        recepientItem.running = false;
        putInQueue(recepientItem, msg, LOCAL_INSTANCE_ID);
    }
};

const forwardMessage = async(recepientItem, message) => {
    try {
        recepientItem.worker.postMessage(message);
    } catch (e) {
        recepientItem.running = false;
        putInQueue(recepientItem, message, LOCAL_INSTANCE_ID);
    }
};

const putInQueue = (recepientItem, msg) => {
    messageQueue.push({ id: ++messageCounter, recepientItem, msg });
};

const processMessageLocally = async(msg) => {
    switch (msg.type) {
        case 'restartWorker':
            restartWorker(msg.data);
            break;
        case 'getList':
            sendMessage(msg.sender, 'listUpdate', workers.map((item) => {
                return ({
                    id: item.id,
                    running: item.running,
                });
            }));
            break;
        default:
            logger.info(`${LOCAL_INSTANCE_ID}: ${msg.data}`);
    }
};

const handleMessage = async(msg, sender) => {
    if (typeof msg === 'object' && msg.recepient) {
        const message = {...msg, timestamp: Date(), sender };
        if (msg.recepient === LOCAL_INSTANCE_ID) {
            processMessageLocally(message);
        } else {
            const recepientItem = workers.find(item => item.id === message.recepient);

            if (!recepientItem) { return; }
            if (recepientItem.running) {
                forwardMessage(recepientItem, message);
            } else {
                putInQueue(recepientItem, message);
            }
        }
    } else {
        logger.info(`${LOCAL_INSTANCE_ID}: ${msg}`);
    }
};

const readMessageQueue = () => {
    messageQueue = messageQueue.reduce((previousValue, queueItem) => {
        const recepientItem = workers.find(item => item.id === queueItem.msg.recepient);
        if (recepientItem.running) {
            forwardMessage(queueItem.recepientItem, queueItem.msg);
        } else {
            previousValue.push(queueItem);
        }
        return previousValue;
    }, []);
};

const createWorker = (file, ref) => {
    return new Promise((resolve, reject) => {
        logger.info(`${LOCAL_INSTANCE_ID}: Creating worker ${file}`);
        resolve(new Worker(path.join(workersDir, file), { workerData: file }));
    }).then((worker) => {
        worker.on('message', (msg) => handleMessage(msg, file));
        worker.on('error', (err) => logger.error(`${LOCAL_INSTANCE_ID}: ${file}: ${err}`));
        worker.on('exit', (code) => handleWorkerStop(code, file));
        if (ref) {
            ref.worker = worker;
            ref.running = true;
        } else {
            workers.push({
                id: file,
                worker,
                running: true,
            });
        }
    });
};

function startWorkers() {
    fs.readdirSync(workersDir)
        .filter((file) => (file.indexOf('.js') !== 0) && (file.indexOf('.map') === -1) && (file !== 'index.js'))
        // import model files and save model names
        .forEach((file) => {

            createWorker(file);
        });
}

startWorkers();

setInterval(() => readMessageQueue(), 5000);