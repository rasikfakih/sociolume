import cron from 'node-cron'
import { runMonitorCycle } from './services/monitor.js'
import { logger } from './utils/logger.js'

export function startCronJobs(): void {
  // Run every 2 hours
  cron.schedule('0 */2 * * *', async () => {
    logger.info('Cron: starting monitor cycle')
    await runMonitorCycle()
    logger.info('Cron: monitor cycle complete')
  })
  logger.info('Cron jobs registered: monitor every 2 hours')
}