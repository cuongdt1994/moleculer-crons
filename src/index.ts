import { CronJob, CronJobParameters } from 'cron'
import { ServiceBroker } from 'moleculer'

export interface CronJobSchema {
  crons: {
    [k: string]: CronJobParameters
  }
}

const cronJobMixin: ThisType<{ schema: CronJobSchema, broker: ServiceBroker, $crons: Map<string, CronJob> }> = {
  name: 'cron',
  created() {
    this.$crons = new Map()
    
    const crons = this.schema.crons
    
    if (!crons) {
      return
    }

    Object.entries(crons).map(([key, cronOptions]) => {
      cronOptions.context = this.broker

      this.$crons.set(key, new CronJob(cronOptions))
    })
  },

  started() {
    this.$crons.forEach(cronjob => {
      cronjob.start()
    })
  },

  stopped() {
    this.$crons.forEach(cronjob => {
      cronjob.stop()
    })
  }
}

export default cronJobMixin