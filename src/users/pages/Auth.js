import React, { useState, useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";

function Auth() {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    true
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, name: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }

    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs.email);
    if (!isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        console.log(responseData);
        auth.login(responseData.user.id);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        console.log(responseData);
        auth.login(responseData.user.id);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <React.Fragment>
      <div>
        <ErrorModal error={error} onClear={clearError} />
        <Card className="authentication">
          {isLoading && <LoadingSpinner asOverlay />}
          <h2>{isLoginMode ? "Login" : "Sign Up"} Required</h2>
          <hr />
          <form onSubmit={authSubmitHandler}>
            {!isLoginMode && (
              <Input
                id="name"
                element="input"
                type="text"
                label="Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid name."
                onInput={inputChangeHandler}
                initialValue={formState.inputs.name.value}
                initialValidity={formState.inputs.name.isValid}
              />
            )}
            <Input
              id="email"
              element="input"
              type="email"
              label="Email"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email."
              onInput={inputChangeHandler}
              initialValue={formState.inputs.email.value}
              initialValidity={formState.inputs.email.isValid}
            />
            <Input
              id="password"
              element="input"
              type="password"
              label="Password"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter a valid password (at least 6 characters)."
              onInput={inputChangeHandler}
              initialValue={formState.inputs.password.value}
              initialValidity={formState.inputs.password.isValid}
            />
            <Button type="submit" disabled={!formState.isValid}>
              {isLoginMode ? "LOGIN" : "SIGN UP"}
            </Button>
          </form>
          <Button inverse onClick={switchModeHandler}>
            SWITCH TO {!isLoginMode ? "LOGIN" : "SIGN UP"}
          </Button>
        </Card>
      </div>
    </React.Fragment>
  );
}

export default Auth;
