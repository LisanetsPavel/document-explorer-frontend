import {
  Button,
  useAuthenticator,
  View,
} from '@aws-amplify/ui-react';


export const components = {
  SignIn: {
    Header() {
      const { toSignUp } = useAuthenticator();

      return (
        <div>
          <p
            style={{ fontWeight: 600 }}>
            Sign in
          </p>
          <p>
            <div onClick={toSignUp}> New? Let's sign you up.</div>
          </p>
        </div>
      );
    },
  },
  SignUp: {
    Header() {
      return (
        <>
          <div>
            <div>
              Create your account
            </div>
            <div>
              Tell us a bit about yourself. We just need the basics.
            </div>
          </div>
        </>
      );
    },
    Footer() {
      const { toSignIn } = useAuthenticator();

      return (
        <View textAlign="center">
          <div>
            We"ll send you a verification code via SMS
          </div>
          <br />
          <br />
          <Button>
            <div onClick={toSignIn}> Navigate to Sign-In</div>
          </Button>
        </View>
      );
    },
  },
  ConfirmSignUp: {
    Header() {
      return (
        <p>
          <strong>We just texted you</strong>
        </p>
      );
    },
    Footer() {
      const { resendCode } = useAuthenticator();
      return (
        <div onClick={resendCode} className={'centerLink'}>
          Didn't get a code?
        </div>
      );
    },
  },
};

export const formFields = {
  signUp: {
    phone_number: {
      dialCode: '+1',
      order: 1,
    },
  },
};
