import React from "react";
import UserList from "../components/UserList";

function Users() {
  const USERS = [
    {
      id: "u1",
      name: "Chitransh Jain",
      image:
        "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      places: 23,
    },
  ];

  return (
    <div>
      <UserList items={USERS} />
    </div>
  );
}

export default Users;
