import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import PlaceList from "../components/PlaceList";

function UserPlaces() {
  const userId = useParams().userId;
  const { isLoading, error, clearError, sendRequest } = useHttpClient();

  useEffect(() => {
    getPlaces();
  }, []);

  const [loadedPlaces, setLoadedPlaces] = useState([]);

  const getPlaces = async () => {
    setLoadedPlaces([]);
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/places/user/${userId}`
      );
      console.log(responseData);
      setLoadedPlaces(responseData.places);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <PlaceList items={loadedPlaces} getPlaces={getPlaces}/>
    </React.Fragment>
  );
}

export default UserPlaces;
