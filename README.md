# Canadian Centre for Cyber Security (CCCS) Cloud Medium (CCCS Medium)

## Overview
**The Landing Zone Accelerator on AWS (LZA)** for _Canadian Centre for Cyber Security (CCCS) Cloud Medium_ is an industry specific deployment of the [Landing Zone Accelerator on AWS](https://aws.amazon.com/solutions/implementations/landing-zone-accelerator-on-aws/) solution designed in collaboration with our national security; defence; national law enforcement; and federal, provincial, and municipal government customers to accelerate compliance with their strict and unique security and compliance requirements. The _Canadian Centre for Cyber Security Cloud Medium (CCCS Medium) Reference Architecture_ is a comprehensive, multi-account AWS cloud architecture targeting sensitive level workloads. It was designed to help customers address central identity and access management, governance, data security, comprehensive logging, and network design/segmentation in alignment with security frameworks such as NIST 800-53, ITSG-33, FEDRAMP Moderate, CCCS-Medium, IRAP, and other [sensitive][sensitive] or medium level security profiles.

Please refer to the CCCS Medium [Reference Architecture document](./architecture-doc/readme.md) for the full detailed design.

## Deployment overview
AWS developed the sample config files herein for use with the Landing Zone Accelerator on AWS (LZA) solution. Using these sample config files with LZA will automate the deployment of [CCCS Medium](https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/cloud-services/government-canada-security-control-profile-cloud-based-it-services.html) (formerly PBMM) security controls.

LZA will deploy an opinionated architecture that has been designed in consultation with CCCS and Government of Canada’s Treasury Board Secretariat. Inheriting the controls from the [CCCS assessment of AWS](https://aws.amazon.com/compliance/services-in-scope/CCCS/) and deploying additional controls using LZA with the sample config files allow customers to meet up to 70% of the controls that have a technical element. This reduces security control implementation time, allowing customers to focus on operational capabilities and the evidentiary exercise in a [Security Assessment and Authorization](https://www.cyber.gc.ca/en/guidance/guidance-cloud-security-assessment-and-authorization-itsp50105) (SA&A) process like that used by the Government of Canada.

The sample config files define a log retention period of 2 years based on [guidance](https://www.canada.ca/en/government/system/digital-government/online-security-privacy/event-logging-guidance.html) provided by the Treasury Board Secretariat.  Customers are encouraged to consider defining longer retention periods, such as 10 years, so that you'll have the data you need to investigate and reconstruct events long after they occur.

Customers are encouraged to work with their local AWS Account Teams to learn more about customizing this configuration, to learn more about the CCCS-Medium reference architecture, and the Landing Zone Accelerator on AWS solution.

-  [Configuration files and installation instructions](./install.md)
-  [Instructions for version updates](./update-instructions.md)
-  [FAQ](./documentation/FAQ.md)


[sensitive]: https://www.canada.ca/en/government/system/digital-government/modern-emerging-technologies/cloud-services/government-canada-security-control-profile-cloud-based-it-services.html#toc4