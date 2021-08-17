const { workerData, parentPort } = require('worker_threads');
const logger = require('../../config/logger');
const LOCAL_INSTANCE_ID = workerData;

let watchedWorkers = [];

setInterval(() => {
    watchedWorkers.forEach((item) => {
        if (!item.running) {
            logger.info(`${LOCAL_INSTANCE_ID} Requesting restart worker ${item.id}...`);
            sendMessage('root', 'restartWorker', item.id);
            item.running = true;
        }
    });
}, 10000);


setInterval(() => {
    sendMessage('root', 'getList', '');
}, 5000);


const sendMessage = async(recepientId, type, data) => {
    parentPort.postMessage({
        sender: LOCAL_INSTANCE_ID,
        recepient: recepientId,
        type,
        data,
    });
};


/**
 * Current thread message processor
 * @private
 */
const processMessageLocally = async(msg) => {
    switch (msg.type) {
        case 'listUpdate':
            watchedWorkers = msg.data;
            break;
    }
};

/**
 * System handlers
 * @private
 */
process.on('disconnect', () => {
    logger.error(`Thread ${workerData} is disconnected from parent process. Exitting...`);
    process.exit();
});
parentPort.on('message', (msg) => {
    if (typeof msg === 'object' && msg.recepient) {
        processMessageLocally(msg);
    } else {
        logger.info(`${LOCAL_INSTANCE_ID}: ${msg}`);
    }
});
parentPort.postMessage(`Worker ${LOCAL_INSTANCE_ID} started `);