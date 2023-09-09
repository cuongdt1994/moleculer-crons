import { ServiceBroker, ServiceSchema } from 'moleculer'
import CronMixin, { CronJobSchema } from '../../src/index.js'

const broker = new ServiceBroker()

const schema: ServiceSchema & CronJobSchema = {
  name: 'cron-test',
  crons: {
    test: {
      cronTime: '* * * * *',
      onTick: function () {
        console.log('hi!')
      },
    }
  },
  mixins: [CronMixin]
}

broker.createService(schema)

broker.start()