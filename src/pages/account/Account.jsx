import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import useServerFieldErrors from '../../hooks/useServerFieldErrors';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import * as accountApi from '../../api/account';

const profileRules = {
  username: {
    required: 'The username field is required.',
    minLength: { value: 3, message: 'The username must be at least 3 characters.' },
  },
};

const passwordRules = {
  currentPassword: {
    required: 'The current password field is required.',
  },
  password: {
    required: 'The password field is required.',
    minLength: { value: 6, message: 'The password must be at least 6 characters.' },
  },
  passwordConfirmation: {
    required: 'The password confirmation field is required.',
  },
};

export default function Account() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [profileStatus, setProfileStatus] = useState('idle');
  const [passwordStatus, setPasswordStatus] = useState('idle');
  const [profileFieldErrors, setProfileFieldErrors] = useState(null);
  const [passwordFieldErrors, setPasswordFieldErrors] = useState(null);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    setError: setProfileError,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: { username: user?.username ?? '' },
  });

  useServerFieldErrors({ setError: setProfileError, fieldErrors: profileFieldErrors });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    setError: setPasswordError,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: { currentPassword: '', password: '', passwordConfirmation: '' },
  });

  useServerFieldErrors({ setError: setPasswordError, fieldErrors: passwordFieldErrors });

  const onProfileSubmit = async (data) => {
    setProfileStatus('loading');
    setProfileFieldErrors(null);
    try {
      const { user: updatedUser } = await accountApi.updateProfile(data);
      setUser(updatedUser);
      resetProfile({ username: updatedUser.username });
      toast.success('Profile updated successfully.');
    } catch (err) {
      if (err?.errors) {
        setProfileFieldErrors(err.errors);
      } else {
        toast.error(err?.message ?? 'Failed to update profile.');
      }
    } finally {
      setProfileStatus('idle');
    }
  };

  const onPasswordSubmit = async (data) => {
    setPasswordStatus('loading');
    setPasswordFieldErrors(null);
    try {
      await accountApi.updatePassword(data);
      resetPassword();
      toast.success('Password updated successfully.');
    } catch (err) {
      if (err?.errors) {
        setPasswordFieldErrors(err.errors);
      } else {
        toast.error(err?.message ?? 'Failed to update password.');
      }
    } finally {
      setPasswordStatus('idle');
    }
  };

  const isProfileLoading = profileStatus === 'loading';
  const isPasswordLoading = passwordStatus === 'loading';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2 leading-tight">Account</h1>
      <p className="text-xs sm:text-sm text-slate-500 mb-8">
        Manage your profile and password.
      </p>

      <div className="max-w-xl space-y-8">
        {/* Profile Section */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Profile</h2>
          <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-4" noValidate>
            <FormField label="Username" htmlFor="account-username" error={profileErrors.username?.message}>
              <input
                type="text"
                placeholder="e.g. admin"
                {...registerProfile('username', profileRules.username)}
              />
            </FormField>

            <div className="pt-2">
              <Button type="submit" isLoading={isProfileLoading}>
                {isProfileLoading ? 'Saving…' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </div>

        {/* Password Section */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Change Password</h2>
          <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4" noValidate>
            <FormField label="Current Password" htmlFor="account-current-password" error={passwordErrors.currentPassword?.message}>
              <input
                type="password"
                placeholder="Enter current password"
                {...registerPassword('currentPassword', passwordRules.currentPassword)}
              />
            </FormField>

            <FormField label="New Password" htmlFor="account-new-password" error={passwordErrors.password?.message}>
              <input
                type="password"
                placeholder="Enter new password"
                {...registerPassword('password', passwordRules.password)}
              />
            </FormField>

            <FormField label="Confirm New Password" htmlFor="account-confirm-password" error={passwordErrors.passwordConfirmation?.message}>
              <input
                type="password"
                placeholder="Confirm new password"
                {...registerPassword('passwordConfirmation', passwordRules.passwordConfirmation)}
              />
            </FormField>

            <div className="pt-2">
              <Button type="submit" isLoading={isPasswordLoading}>
                {isPasswordLoading ? 'Saving…' : 'Update Password'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
