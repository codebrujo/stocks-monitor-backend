const { workerData, parentPort } = require('worker_threads');
const logger = require('../config/logger');
const LOCAL_INSTANCE_ID = workerData;

const sendMessage = async(recepientId, type, data) => {
    parentPort.postMessage({
        sender: LOCAL_INSTANCE_ID,
        recepient: recepientId,
        type,
        data,
    });
};

const notifyUser = async(payload) => {
    //TO DO
    logger.info(`${LOCAL_INSTANCE_ID} sending message: 
    user: ${JSON.stringify(payload.user)} 
    message: ${payload.message}`);
};

/**
 * Current thread message processor
 * @private
 */
const processMessageLocally = async(msg) => {
    switch (msg.type) {
        case 'notifyUser':
            notifyUser(msg.data);
            break;
        default:
            logger.info(`${LOCAL_INSTANCE_ID}: 
            From: ${msg.sender} 
            To: ${msg.recepient} 
            Type: ${msg.type} 
            Data: ${JSON.stringify(msg.data)} 
            Timestamp: ${msg.timestamp}`);
    }
};

/**
 * System handlers
 * @private
 */
process.on('disconnect', () => {
    logger.error(`${LOCAL_INSTANCE_ID} is disconnected from parent process.Exitting...`);
    process.exit();
});
parentPort.on('message', (msg) => {
    if (typeof msg === 'object' && msg.recepient) {
        processMessageLocally(msg);
    } else {
        logger.info(`${LOCAL_INSTANCE_ID}: ${msg}`);
    }
});
parentPort.postMessage(`Worker ${LOCAL_INSTANCE_ID} started`);

parentPort.postMessage(`Worker ${LOCAL_INSTANCE_ID} started`);