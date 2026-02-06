import * as cdk from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'

export interface MsKanzleiCertStackProps extends cdk.StackProps {
	domainName: string
	hostedZoneId: string
}

export class MsKanzleiCertStack extends cdk.Stack {
	public readonly certificate: acm.ICertificate

	constructor(scope: Construct, id: string, props: MsKanzleiCertStackProps) {
		super(scope, id, props)

		const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
			hostedZoneId: props.hostedZoneId,
			zoneName: props.domainName,
		})

		this.certificate = new acm.Certificate(this, 'Certificate', {
			domainName: props.domainName,
			validation: acm.CertificateValidation.fromDns(hostedZone),
		})
	}
}
