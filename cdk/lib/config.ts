import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.cdk') })

function requireEnv(name: string): string {
	const value = process.env[name]
	if (!value) throw new Error(`Missing env: ${name}`)
	return value
}

export const config = {
	domainName: requireEnv('DOMAIN_NAME'),
	hostedZoneId: requireEnv('HOSTED_ZONE_ID'),
	regionCert: requireEnv('AWS_REGION_CERT'),
	regionMain: requireEnv('AWS_REGION_MAIN'),
	githubDeployRoleName: requireEnv('DEPLOY_ROLE_NAME'),
	githubRepoRef: requireEnv('DEPLOY_REPO_REF'),
}
