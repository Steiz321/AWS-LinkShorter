# Aws LinkShorter

## Use already deployed api
You can use an already deployed API to test its functionality:

### Documentation link: [Check Docs](https://v5me1gdfk8.execute-api.eu-central-1.amazonaws.com/swagger)

All deployed endpoints:

* GET - https://6r6d47pyxf.execute-api.eu-central-1.amazonaws.com/prod/mylinks
* POST - https://6r6d47pyxf.execute-api.eu-central-1.amazonaws.com/prod/link
* GET - https://6r6d47pyxf.execute-api.eu-central-1.amazonaws.com/prod/{linkParams}
* POST - https://6r6d47pyxf.execute-api.eu-central-1.amazonaws.com/prod/deactivate/{linkParams}
* POST - https://6r6d47pyxf.execute-api.eu-central-1.amazonaws.com/prod/reactive/{linkParams}
* POST - https://6r6d47pyxf.execute-api.eu-central-1.amazonaws.com/prod/sign-up
* POST - https://6r6d47pyxf.execute-api.eu-central-1.amazonaws.com/prod/sign-in

## Deploy by yourself:

First, you need to setup your aws account credential by `aws configure` command in terminal (email, password, region and etc.).

Next, you need to make your `.env` file following the example of the `.env.sample` file.

If you want to test it locally you can use `npm run dev` command.

To deploy to aws you can use this command: `npm run deploy`.

## Structure

To write this project we used serverless framework, as well as plugins for it (esbuild, dotenv, auto-swagger, iamRolePerFunction,). Also, all necessary lambda functions are located in the functions folder, and additional functions for them are located in all other folders. From amazon services Lambda functions, SES, SQS, EventBridge, DynamoDB were used.