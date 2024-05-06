// LoginForm.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLogin } from "../hooks/mutate";
import { useNavigate } from "react-router-dom";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const {mutate} = useLogin()
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate()

  const login: SubmitHandler<LoginFormInputs> = async(data) =>{
    // mutate(data)
    // localStorage.setItem("merchantId", 'adbc5c96-f8ba-4a01-8383-58bf5241b05c');
    localStorage.setItem("email", getValues('email'));
    navigate("/home");
  }

  return (
    <form
      onSubmit={handleSubmit(login)}
      className="max-w-sm mx-auto mt-[8rem] border p-5 rounded-xl"
    >
      <div className="mb-4">
        <label htmlFor="username" className="block mb-2">
          Email
        </label>
        <input
          type="text"
          {...register("email", { required: true })}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.email && (
          <span className="text-red-500">Email is required</span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block mb-2">
          Password
        </label>
        <input
          type="password"
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
