import loadEnvs from './dotenv'
import getCloudflareConfig from './cloudflare'

loadEnvs()
export default {
    loadEnvs,
    cf: getCloudflareConfig(),
}
