#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MsKanzleiCertStack } from '../lib/cert-stack';
import { MsKanzleiStack } from '../lib/cdk-stack';
import { config } from '../lib/config';

const app = new cdk.App();

const account = process.env.CDK_DEFAULT_ACCOUNT;

const certStack = new MsKanzleiCertStack(app, 'MsKanzleiCertStack', {
  env: { account, region: config.regionCert },
  crossRegionReferences: true,
  domainName: config.domainName,
  hostedZoneId: config.hostedZoneId,
});

new MsKanzleiStack(app, 'MsKanzleiStack', {
  env: { account, region: config.regionMain },
  crossRegionReferences: true,
  certificate: certStack.certificate,
  domainName: config.domainName,
  hostedZoneId: config.hostedZoneId,
  githubDeployRoleName: config.githubDeployRoleName,
  githubRepoRef: config.githubRepoRef,
  regionCert: config.regionCert,
  regionMain: config.regionMain,
});
