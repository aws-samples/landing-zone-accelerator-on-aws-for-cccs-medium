const { ConfigServiceClient, PutEvaluationsCommand } = require("@aws-sdk/client-config-service");
const client = new ConfigServiceClient();

const APPLICABLE_RESOURCES = ['AWS::IAM::Role'];

exports.handler = async function (event, context) {
  console.log(`Custom Rule for checking Policies attached to IAM role used under Instance Profile...`);
  console.log(JSON.stringify(event, null, 2));

  const invokingEvent = JSON.parse(event.invokingEvent);
  const invocationType = invokingEvent.messageType;
  const ruleParams = JSON.parse(event.ruleParameters || '{}');
  if (!ruleParams.AWSManagedPolicies && !ruleParams.CustomerManagedPolicies) {
    throw new Error('Either "AWSManagedPolicies" or "CustomerManagedPolicies" are required');
  }
  if (invocationType === 'ScheduledNotification') {
    return;
  }
  const configurationItem = invokingEvent.configurationItem;

  const evaluation = await evaluateCompliance({
    configurationItem,
    ruleParams,
  });

  console.debug(`Evaluation`);
  console.debug(JSON.stringify(evaluation, null, 2));

  const payload = {
    ResultToken: event.resultToken,
    Evaluations: [
      {
        ComplianceResourceId: configurationItem.resourceId,
        ComplianceResourceType: configurationItem.resourceType,
        ComplianceType: evaluation.complianceType,
        OrderingTimestamp: new Date(configurationItem.configurationItemCaptureTime),
        Annotation: evaluation.annotation,
      },
    ],
  };
  const putEvaluationsCommand = new PutEvaluationsCommand(payload);
  await client.send(putEvaluationsCommand);
};

async function evaluateCompliance(props) {
  const { configurationItem, ruleParams } = props;
  if (!APPLICABLE_RESOURCES.includes(configurationItem.resourceType)) {
    return {
      complianceType: 'NOT_APPLICABLE',
      annotation: `The rule doesn't apply to resources of type ${configurationItem.resourceType}`,
    };
  } else if (configurationItem.configurationItemStatus === 'ResourceDeleted') {
    return {
      complianceType: 'NOT_APPLICABLE',
      annotation: 'The configuration item was deleted and could not be validated',
    };
  } else if (configurationItem.configurationItemStatus === 'ResourceNotRecorded' || configurationItem.configurationItemStatus === 'ResourceDeletedNotRecorded') {
    return {
      complianceType: 'NOT_APPLICABLE',
      annotation: 'The configuration item is not recorded in this region and need not be validated',
    };
  }

  if (configurationItem.configuration && !configurationItem.configuration.instanceProfileList) {
    return {
      complianceType: 'NOT_APPLICABLE',
      annotation: 'The IAM Role is not under any Instance Profile',
    };
  } else if (configurationItem.configuration && configurationItem.configuration.instanceProfileList.length === 0) {
    return {
      complianceType: 'NOT_APPLICABLE',
      annotation: 'The IAM Role is not under any Instance Profile',
    };
  } else if (configurationItem.configuration) {
    const existingPolicyNames = configurationItem.configuration.attachedManagedPolicies.map(p => p.policyName);
    const existingPolicyArns = configurationItem.configuration.attachedManagedPolicies.map(p => p.policyArn);
    if (ruleParams.AWSManagedPolicies) {
      const requiredAwsPolicies = ruleParams.AWSManagedPolicies.split(',');
      for (const requiredPolicy of requiredAwsPolicies) {
        if (!requiredPolicy) {
          continue;
        }
        if (!existingPolicyNames.includes(requiredPolicy.trim())) {
          return {
            complianceType: 'NON_COMPLIANT',
            annotation: 'The IAM Role is not having required policies attached ' + requiredPolicy,
          };
        }
      }
    }
    if (ruleParams.CustomerManagedPolicies) {
      const requiredCustomerPolicies = ruleParams.CustomerManagedPolicies.split(',');
      for (const requiredPolicy of requiredCustomerPolicies) {
        if (!requiredPolicy) {
          continue;
        }
        if (!existingPolicyNames.includes(requiredPolicy.trim())) {
          return {
            complianceType: 'NON_COMPLIANT',
            annotation: 'The IAM Role is not having required policies attached ' + requiredPolicy,
          };
        }
      }
    }
    return {
      complianceType: 'COMPLIANT',
      annotation: 'The resource is compliant',
    };
  } else {
    // TODO retrive from api call
  }

  return {
    complianceType: 'NON_COMPLIANT',
    annotation: 'The resource logging destination is incorrect',
  };
}