import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SignUp = (props) => {
  const { SignUpOpen } = props;
  // Validation schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Initial values
  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  // Submit handler
  const handleSubmit = (values) => {
    console.log("Form Data:", values);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 rounded bg-white p-6 shadow-md dark:bg-slate-800 dark:text-white">
      <h2 className="mb-6 text-center text-2xl font-bold">SignUp</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ isSubmitting, errors, touched, setFieldTouched }) => (
          <Form className="flex flex-col gap-2">
            {/* Username */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Username
              </label>
              <Field
                type="text"
                id="username"
                name="username"
                className="mt-1 w-full rounded border border-gray-300 p-2 dark:text-black"
                onFocus={() => setFieldTouched("username")}
              />
              <ErrorMessage
                name="username"
                component="div"
                className={`mt-1 text-sm text-red-500 ${
                  touched.username || errors.username ? "block" : "hidden"
                }`}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="mt-1 w-full rounded border border-gray-300 p-2 dark:text-black"
                onFocus={() => setFieldTouched("email")}
              />
              <ErrorMessage
                name="email"
                component="div"
                className={`mt-1 text-sm text-red-500 ${
                  touched.email || errors.email ? "block" : "hidden"
                }`}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="mt-1 w-full rounded border border-gray-300 p-2 dark:text-black"
                onFocus={() => setFieldTouched("password")}
              />
              <ErrorMessage
                name="password"
                component="div"
                className={`mt-1 text-sm text-red-500 ${
                  touched.password || errors.password ? "block" : "hidden"
                }`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>
      <div className="flex items-center gap-2">
        <p className="text-xs">Already have account</p>
        <button className="text-xs font-semibold" onClick={() => SignUpOpen()}>
          LogIn
        </button>
      </div>
    </div>
  );
};

export default SignUp;
