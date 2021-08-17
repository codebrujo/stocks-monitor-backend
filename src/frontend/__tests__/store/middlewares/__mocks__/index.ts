import userMiddleware from './user';
import stocksMiddleware from './stocks';
import notificationsMiddleware from './notifications';
import portfolioMiddleware from './portfolio';

export default [
    userMiddleware,
    stocksMiddleware,
    notificationsMiddleware,
    portfolioMiddleware,
];