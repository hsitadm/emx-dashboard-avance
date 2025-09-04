import { Amplify } from 'aws-amplify'

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_A7TjCD2od',
      userPoolClientId: '17lv6rcvcop1mgm7opi3ib1irb',
      loginWith: {
        email: true
      }
    }
  }
}

Amplify.configure(awsConfig)
export default awsConfig
