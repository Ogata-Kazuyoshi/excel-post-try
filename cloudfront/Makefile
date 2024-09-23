cloudfront-deploy:
	npm run build
	aws s3 sync ./dist s3://$(AWS_S3_BACKET) --delete
	aws cloudfront create-invalidation --distribution-id $(CLOUDFRONT_DISTRIBUTION_ID) --paths "/*"


