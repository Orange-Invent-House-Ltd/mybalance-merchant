// LoginForm.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type LoginFormInputs = {
  username: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    console.log(data);
    // You can perform login logic here
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto mt-[8rem] border p-5 rounded-xl"
    >
      <div className="mb-4">
        <label htmlFor="username" className="block mb-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          {...register("username", { required: true })}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.username && (
          <span className="text-red-500">Username is required</span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          {...register("password", { required: true })}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.password && (
          <span className="text-red-500">Password is required</span>
        )}
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Log In
      </button>
    </form>
  );
};

export default LoginForm;
