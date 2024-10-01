cloudfront-deploy:
	npm run build
	if aws s3 ls "s3://$(S3_BUCKET)" 2>&1 | grep -q 'NoSuchBucket'; then \
            echo "バケット $(S3_BUCKET) が存在しません。作成します。"; \
            aws s3 mb s3://$(S3_BUCKET) --region ap-northeast-1; \
    fi
	aws s3 sync ./dist s3://$(AWS_S3_BACKET) --delete
	aws cloudfront create-invalidation --distribution-id $(CLOUDFRONT_DISTRIBUTION_ID) --paths "/*"


