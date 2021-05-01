import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import "./PlaceForm.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

function UpdatePlace() {
  const placeId = useParams().placeId;
  const [identifiedPlace, setIdentifiedPlace] = useState();
  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    true
  );

  useEffect(() => {
    getPlace();
  }, []);

  const history = useHistory();

  const getPlace = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/places/${placeId}`
      );
      setIdentifiedPlace(responseData.place);
      console.log("Setting data in update place");
      console.log(responseData.place);
      setFormData(
        {
          title: {
            value: responseData.place.title,
            isValid: true,
          },
          description: {
            value: responseData.place.description,
            isValid: true,
          },
        },
        true
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return <LoadingSpinner asOverlay />;
  }

  if (!identifiedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find the place!</h2>
        </Card>
      </div>
    );
  }

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
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
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && identifiedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputChangeHandler}
            initialValue={identifiedPlace.title}
            initialValidity={true}
          />
          <Input
            id="description"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputChangeHandler}
            initialValue={identifiedPlace.description}
            initialValidity={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
}

export default UpdatePlace;
