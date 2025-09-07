import AuthForm from '../components/AuthForm.jsx';

const Login = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary-900 mb-6">Sign in to your account</h2>
      <AuthForm mode="login" />
    </div>
  );
};

export default Login;
