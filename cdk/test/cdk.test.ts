import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { MsKanzleiStack } from '../lib/cdk-stack.js';
import { MsKanzleiCertStack } from '../lib/cert-stack.js';

const domainName = 'mskanzlei.mrpitch.rocks';
const hostedZoneId = 'Z101967436NINE8V1MY7N';

function createStacks() {
  const app = new cdk.App();

  const certStack = new MsKanzleiCertStack(app, 'TestCertStack', {
    env: { account: '123456789012', region: 'us-east-1' },
    crossRegionReferences: true,
    domainName,
    hostedZoneId,
  });

  const mainStack = new MsKanzleiStack(app, 'TestMainStack', {
    env: { account: '123456789012', region: 'eu-central-1' },
    crossRegionReferences: true,
    certificate: certStack.certificate,
    domainName,
    hostedZoneId,
  });

  return {
    certTemplate: Template.fromStack(certStack),
    mainTemplate: Template.fromStack(mainStack),
  };
}

describe('MsKanzleiCertStack', () => {
  test('creates ACM certificate with DNS validation', () => {
    const { certTemplate } = createStacks();
    certTemplate.hasResourceProperties('AWS::CertificateManager::Certificate', {
      DomainName: domainName,
      ValidationMethod: 'DNS',
    });
  });
});

describe('MsKanzleiStack', () => {
  let mainTemplate: Template;

  beforeAll(() => {
    ({ mainTemplate } = createStacks());
  });

  test('S3 bucket blocks public access', () => {
    mainTemplate.hasResourceProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    });
  });

  test('S3 bucket enforces SSL', () => {
    mainTemplate.hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: 'Deny',
            Condition: { Bool: { 'aws:SecureTransport': 'false' } },
          }),
        ]),
      }),
    });
  });

  test('CloudFront distribution with PriceClass_100 and custom domain', () => {
    mainTemplate.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        PriceClass: 'PriceClass_100',
        Aliases: [domainName],
        HttpVersion: 'http2and3',
        DefaultRootObject: 'index.html',
      }),
    });
  });

  test('CloudFront function for URL rewriting', () => {
    mainTemplate.hasResourceProperties('AWS::CloudFront::Function', {
      AutoPublish: true,
      FunctionConfig: Match.objectLike({
        Runtime: 'cloudfront-js-2.0',
      }),
    });
  });

  test('OIDC provider created for GitHub Actions', () => {
    mainTemplate.hasResourceProperties('Custom::AWSCDKOpenIdConnectProvider', {
      Url: 'https://token.actions.githubusercontent.com',
      ClientIDList: ['sts.amazonaws.com'],
    });
  });

  test('IAM deploy role created', () => {
    mainTemplate.hasResourceProperties('AWS::IAM::Role', {
      RoleName: 'ms-kanzlei-github-deploy',
    });
  });

  test('Route53 A alias record created', () => {
    mainTemplate.hasResourceProperties('AWS::Route53::RecordSet', {
      Type: 'A',
      HostedZoneId: hostedZoneId,
    });
  });

  test('Route53 AAAA alias record created', () => {
    mainTemplate.hasResourceProperties('AWS::Route53::RecordSet', {
      Type: 'AAAA',
      HostedZoneId: hostedZoneId,
    });
  });

  test('outputs bucket name, distribution id, and deploy role ARN', () => {
    mainTemplate.hasOutput('BucketName', {});
    mainTemplate.hasOutput('DistributionId', {});
    mainTemplate.hasOutput('DistributionDomain', {});
    mainTemplate.hasOutput('DeployRoleArn', {});
  });
});
