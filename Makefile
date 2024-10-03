
iac-base-deploy:
	aws cloudformation create-stack --stack-name ogata-cloudformation-base \
	--template-body file://cloudformation/cloudformation-base.yml \
	--capabilities CAPABILITY_NAMED_IAM \

iac-base-update:
	aws cloudformation update-stack --stack-name ogata-cloudformation-base \
	--template-body file://cloudformation/cloudformation-base.yml \
	--capabilities CAPABILITY_NAMED_IAM \

iac-role-deploy:
	aws cloudformation create-stack --stack-name ogata-cloudformation-iam-role \
	--template-body file://cloudformation/cloudformation-iam-role.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters ParameterKey=GithubAccount,ParameterValue=$(GITHUB_ACCOUNT) \
	             ParameterKey=GithubRepository,ParameterValue=$(GITHUB_REPOSITORY) \
	--region ap-northeast-1

iac-role-update:
	aws cloudformation update-stack --stack-name ogata-cloudformation-iam-role \
	--template-body file://cloudformation/cloudformation-iam-role.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters ParameterKey=GithubAccount,ParameterValue=$(GITHUB_ACCOUNT) \
	             ParameterKey=GithubRepository,ParameterValue=$(GITHUB_REPOSITORY) \
	--region ap-northeast-1

iac-wafacl-deploy:
	aws cloudformation create-stack --stack-name ogata-cloudformation-wafacl \
	--template-body file://cloudformation/cloudformation-wafacl.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--region us-east-1

iac-wafacl-update:
	aws cloudformation update-stack --stack-name ogata-cloudformation-wafacl \
	--template-body file://cloudformation/cloudformation-wafacl.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--region us-east-1

iac-cloudfront-deploy:
	aws cloudformation create-stack --stack-name ogata-cloudformation-cloudfront \
	--template-body file://cloudformation/cloudformation-cloudfront.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters ParameterKey=WAFWebACLArn,ParameterValue=$(WAF_ACL_ARN) \
	             ParameterKey=HostZone,ParameterValue=$(HOSTED_ZONE_ID) \
	             ParameterKey=AcmArn,ParameterValue=$(ACM_CERTIFICATE_ARN_CLOUDFRONT) \
	             ParameterKey=DomainName,ParameterValue=$(DOMAIN_NAME) \
	--region ap-northeast-1

iac-cloudfront-update:
	aws cloudformation update-stack --stack-name ogata-cloudformation-cloudfront \
	--template-body file://cloudformation/cloudformation-cloudfront.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--parameters ParameterKey=WAFWebACLArn,ParameterValue=$(WAF_ACL_ARN) \
                 ParameterKey=HostZone,ParameterValue=$(HOSTED_ZONE_ID) \
                 ParameterKey=AcmArn,ParameterValue=$(ACM_CERTIFICATE_ARN_CLOUDFRONT) \
                 ParameterKey=DomainName,ParameterValue=$(DOMAIN_NAME) \
	--region ap-northeast-1

iac-dynamodb-deploy:
	aws cloudformation create-stack --stack-name ogata-cloudformation-dynamodb \
	--template-body file://cloudformation/cloudformation-dynamodb.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--region ap-northeast-1

iac-dynamodb-update:
	aws cloudformation update-stack --stack-name ogata-cloudformation-dynamodb \
	--template-body file://cloudformation/cloudformation-dynamodb.yml \
	--capabilities CAPABILITY_NAMED_IAM \
	--region ap-northeast-1

excel-post:
	curl -X POST https://5jsxr20bkc.execute-api.ap-northeast-1.amazonaws.com/Prod/api/excel -v \
         -F "file=@./try-data.xlsx"
# 	curl -X POST http://localhost:3000/api/excel -v \

create-csv:
	cd cloudfront && license_finder report --format=csv --columns=name version licenses homepage --save=../licenses.csv


create-license:
	cd cloudfront && license_finder report --format=csv --save=../licenses.csv
	curl -X POST http://localhost:3000/api/teamLists/tempTeam2 -v \
             -F "file=@./licenses.csv"

create-team-list:
	curl -X POST http://localhost:3000/api/teamLists/tempTeam -v \
         -F "file=@./licenses.csv"