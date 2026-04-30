import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export interface MsKanzleiStackProps extends cdk.StackProps {
	certificate: acm.ICertificate
	domainName: string
	hostedZoneId: string
	githubDeployRoleName: string
	githubRepoRef: string
	regionCert: string
	regionMain: string
}

export class MsKanzleiStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props: MsKanzleiStackProps) {
		super(scope, id, props)

		// S3 bucket for static site
		const bucket = new s3.Bucket(this, 'SiteBucket', {
			blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
			encryption: s3.BucketEncryption.S3_MANAGED,
			enforceSSL: true,
			versioned: false,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			autoDeleteObjects: true,
		})

		// CloudFront Function for URL rewriting
		const urlRewriteFunction = new cloudfront.Function(this, 'UrlRewriteFunction', {
			code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (!uri.includes('.', uri.lastIndexOf('/'))) {
    request.uri = uri + '.html';
  }
  return request;
}
`),
			runtime: cloudfront.FunctionRuntime.JS_2_0,
		})

		// CSP allowlist: add external origins here before enforcing (analytics, fonts, embeds, etc).
		// Typical additions: script-src/connect-src/img-src/font-src/frame-src.
		const contentSecurityPolicy = [
			"default-src 'self'",
			"base-uri 'self'",
			"object-src 'none'",
			"frame-ancestors 'none'",
			"form-action 'self'",
			"img-src 'self' data:",
			"font-src 'self' data:",
			"style-src 'self' 'unsafe-inline'",
			"script-src 'self' 'unsafe-inline'",
			"connect-src 'self'",
			'upgrade-insecure-requests',
		].join('; ')

		const securityHeadersBehavior: cloudfront.ResponseHeadersPolicyProps['securityHeadersBehavior'] =
			{
				contentSecurityPolicy: {
					contentSecurityPolicy,
					override: true,
				},
				strictTransportSecurity: {
					accessControlMaxAge: cdk.Duration.seconds(63072000),
					includeSubdomains: true,
					preload: true,
					override: true,
				},
				contentTypeOptions: { override: true },
				referrerPolicy: {
					referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
					override: true,
				},
				frameOptions: { frameOption: cloudfront.HeadersFrameOption.DENY, override: true },
			}

		const permissionsPolicyHeader: cloudfront.ResponseCustomHeader = {
			header: 'Permissions-Policy',
			value:
				'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
			override: true,
		}

		const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(
			this,
			'SecurityHeadersPolicy',
			{
				securityHeadersBehavior,
				customHeadersBehavior: {
					customHeaders: [permissionsPolicyHeader],
				},
			},
		)

		const assetsResponseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(
			this,
			'AssetsHeadersPolicy',
			{
				securityHeadersBehavior,
				customHeadersBehavior: {
					customHeaders: [
						permissionsPolicyHeader,
						{
							header: 'Cache-Control',
							value: 'public, max-age=31536000, immutable',
							override: true,
						},
					],
				},
			},
		)

		const assetsCachePolicy = new cloudfront.CachePolicy(this, 'AssetsCachePolicy', {
			comment: 'Long-lived caching for versioned static assets',
			minTtl: cdk.Duration.days(1),
			defaultTtl: cdk.Duration.days(365),
			maxTtl: cdk.Duration.days(365),
			cookieBehavior: cloudfront.CacheCookieBehavior.none(),
			headerBehavior: cloudfront.CacheHeaderBehavior.none(),
			queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
			enableAcceptEncodingBrotli: true,
			enableAcceptEncodingGzip: true,
		})

		// CloudFront distribution
		const distribution = new cloudfront.Distribution(this, 'Distribution', {
			defaultBehavior: {
				origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
				viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
				responseHeadersPolicy,
				functionAssociations: [
					{
						function: urlRewriteFunction,
						eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
					},
				],
			},
			additionalBehaviors: {
				'_next/static/*': {
					origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
					viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					cachePolicy: assetsCachePolicy,
					responseHeadersPolicy: assetsResponseHeadersPolicy,
				},
				'_optimized/*': {
					origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
					viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					cachePolicy: assetsCachePolicy,
					responseHeadersPolicy: assetsResponseHeadersPolicy,
				},
				'images/*': {
					origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
					viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					cachePolicy: assetsCachePolicy,
					responseHeadersPolicy: assetsResponseHeadersPolicy,
				},
				'favicon.ico': {
					origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
					viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					cachePolicy: assetsCachePolicy,
					responseHeadersPolicy: assetsResponseHeadersPolicy,
				},
				'robots.txt': {
					origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
					viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					cachePolicy: assetsCachePolicy,
					responseHeadersPolicy: assetsResponseHeadersPolicy,
				},
				'sitemap.xml': {
					origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
					viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					cachePolicy: assetsCachePolicy,
					responseHeadersPolicy: assetsResponseHeadersPolicy,
				},
				'sitemap-*.xml': {
					origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
					viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					cachePolicy: assetsCachePolicy,
					responseHeadersPolicy: assetsResponseHeadersPolicy,
				},
			},
			domainNames: [props.domainName],
			certificate: props.certificate,
			defaultRootObject: 'index.html',
			priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
			minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
			httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
			errorResponses: [
				{
					httpStatus: 403,
					responseHttpStatus: 404,
					responsePagePath: '/404.html',
				},
				{
					httpStatus: 404,
					responseHttpStatus: 404,
					responsePagePath: '/404.html',
				},
			],
		})

		// Route53 alias records
		const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
			hostedZoneId: props.hostedZoneId,
			zoneName: props.domainName,
		})

		new route53.ARecord(this, 'AliasRecord', {
			zone: hostedZone,
			target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(distribution)),
		})

		new route53.AaaaRecord(this, 'AliasRecordAAAA', {
			zone: hostedZone,
			target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(distribution)),
		})

		// Import existing GitHub OIDC provider
		const oidcProvider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
			this,
			'GitHubOidcProvider',
			`arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`,
		)

		// IAM role for GitHub Actions deployment
		const deployRole = new iam.Role(this, 'GitHubDeployRole', {
			roleName: props.githubDeployRoleName,
			assumedBy: new iam.OpenIdConnectPrincipal(oidcProvider, {
				StringEquals: {
					'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
				},
				StringLike: {
					'token.actions.githubusercontent.com:sub': props.githubRepoRef,
				},
			}),
		})

		// S3 permissions for deploy role
		bucket.grantReadWrite(deployRole)
		bucket.grantDelete(deployRole)

		// CloudFront invalidation permission
		deployRole.addToPolicy(
			new iam.PolicyStatement({
				actions: ['cloudfront:CreateInvalidation'],
				resources: [
					`arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
				],
			}),
		)

		// Allow CDK CLI to read bootstrap version in both deployment regions
		deployRole.addToPolicy(
			new iam.PolicyStatement({
				actions: ['ssm:GetParameter'],
				resources: [
					`arn:aws:ssm:${props.regionCert}:${this.account}:parameter/cdk-bootstrap/hnb659fds/version`,
					`arn:aws:ssm:${props.regionMain}:${this.account}:parameter/cdk-bootstrap/hnb659fds/version`,
				],
			}),
		)

		// CloudFormation permissions for CDK deploy and destroy
		deployRole.addToPolicy(
			new iam.PolicyStatement({
				actions: [
					'cloudformation:DescribeStacks',
					'cloudformation:DescribeStackEvents',
					'cloudformation:DescribeStackResources',
					'cloudformation:ListStackResources',
					'cloudformation:GetTemplate',
					'cloudformation:DeleteStack',
				],
				resources: [
					`arn:aws:cloudformation:${props.regionMain}:${this.account}:stack/MsKanzleiStack/*`,
					`arn:aws:cloudformation:${props.regionCert}:${this.account}:stack/MsKanzleiCertStack/*`,
				],
			}),
		)

		// Allow CDK CLI to assume bootstrap roles created by `cdk bootstrap`
		deployRole.addToPolicy(
			new iam.PolicyStatement({
				actions: ['sts:AssumeRole'],
				resources: [`arn:aws:iam::${this.account}:role/cdk-hnb659fds-*-role-${this.account}-*`],
			}),
		)

		// Allow CDK CLI to pass the CFN execution role to CloudFormation
		deployRole.addToPolicy(
			new iam.PolicyStatement({
				actions: ['iam:PassRole'],
				resources: [
					`arn:aws:iam::${this.account}:role/cdk-hnb659fds-cfn-exec-role-${this.account}-${props.regionMain}`,
					`arn:aws:iam::${this.account}:role/cdk-hnb659fds-cfn-exec-role-${this.account}-${props.regionCert}`,
				],
				conditions: {
					StringEquals: { 'iam:PassedToService': 'cloudformation.amazonaws.com' },
				},
			}),
		)

		// Outputs
		new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName })
		new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId })
		new cdk.CfnOutput(this, 'DistributionDomain', {
			value: distribution.distributionDomainName,
		})
		new cdk.CfnOutput(this, 'DeployRoleArn', { value: deployRole.roleArn })
	}
}
