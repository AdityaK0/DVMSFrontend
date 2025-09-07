import AuthForm from '../components/AuthForm.jsx';

const Signup = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary-900 mb-6">Create your account</h2>
      <AuthForm mode="signup" />
    </div>
  );
};

export default Signup;
