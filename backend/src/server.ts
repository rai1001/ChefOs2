import app, { logger } from './app';
// import { env } from './config/env';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
