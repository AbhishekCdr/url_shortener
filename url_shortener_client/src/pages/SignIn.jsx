import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const SignIn = (props) => {
  const { SignUpOpen, handleClose, userName, fetchData } = props;
  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Initial values
  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("submit");

    try {
      const response = await axios.post(
        `http://localhost:3000/v1/api/auth/signin`,
        values,
        { withCredentials: true },
      );
      // console.log("Signin successful:", response.data);

      localStorage.removeItem("username");
      localStorage.setItem("username", response.data.username);
      resetForm();
      handleClose();
      // SignUpOpen();
      enqueueSnackbar("Login successful!", { variant: "success" });
      userName();
      fetchData();
    } catch (error) {
      console.error(
        "Error during signup:",
        error.response?.data || error.message,
      );

      enqueueSnackbar(
        "Login failed. " + (error.response?.data || "Please try again."),
        { variant: "error" },
      );
      // alert("Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto flex max-w-md flex-col gap-6 rounded bg-white p-6 shadow-md dark:bg-slate-800 dark:text-white">
      <h2 className="mb-6 text-center text-2xl font-bold">LogIn</h2>
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
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                email
              </label>
              <Field
                type="text"
                id="email"
                name="email"
                className="mt-1 w-full rounded border border-gray-300 p-2 dark:text-black"
                onFocus={() => setFieldTouched("email")}
              />
              <ErrorMessage
                name="username"
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
              {isSubmitting ? "Signing up..." : "LogIn"}
            </button>
          </Form>
        )}
      </Formik>
      <div className="flex items-center gap-2">
        <p className="text-xs">Don't have account</p>
        <button className="text-xs font-semibold" onClick={() => SignUpOpen()}>
          SignUp
        </button>
      </div>
    </div>
  );
};

export default SignIn;
