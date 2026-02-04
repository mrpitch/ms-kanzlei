#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MsKanzleiCertStack } from '../lib/cert-stack';
import { MsKanzleiStack } from '../lib/cdk-stack';

const app = new cdk.App();

const domainName = 'mskanzlei.mrpitch.rocks';
const hostedZoneId = 'Z101967436NINE8V1MY7N';
const account = process.env.CDK_DEFAULT_ACCOUNT;

const certStack = new MsKanzleiCertStack(app, 'MsKanzleiCertStack', {
  env: { account, region: 'us-east-1' },
  crossRegionReferences: true,
  domainName,
  hostedZoneId,
});

new MsKanzleiStack(app, 'MsKanzleiStack', {
  env: { account, region: 'eu-central-1' },
  crossRegionReferences: true,
  certificate: certStack.certificate,
  domainName,
  hostedZoneId,
});
