import React, { useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./PlaceForm.css";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHistory } from "react-router-dom";

function NewPlaces() {
  const auth = useContext(AuthContext);
  const { error, isLoading, clearError, sendRequest } = useHttpClient();

  const [formState, inputChangeHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/places/",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: auth.userId,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      console.log(responseData);
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        <Input
          id="title"
          type="text"
          label="Title"
          element="input"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputChangeHandler}
        />
        <Input
          id="description"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputChangeHandler}
        />
        <Input
          id="address"
          type="text"
          label="Address"
          element="input"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputChangeHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
}

export default NewPlaces;
