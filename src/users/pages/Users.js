import React, { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import UserList from "../components/UserList";

function Users() {
  const [users, setUsers] = useState([]);
  const { error, isLoading, clearError, sendRequest } = useHttpClient();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/users/"
      );
      setUsers(responseData.users);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <UserList items={users} />
    </div>
  );
}

export default Users;
