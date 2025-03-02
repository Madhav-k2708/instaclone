import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUsers = () => {
  const { suggestedUsers, user } = useSelector((store) => store.auth);

  const isfollowed = suggestedUsers?.map((id) => id?.followers?._id === user?.following?._id)


  

  return (
    <div className="my-10 ">
      <div className="flex items-center justify-between text-sm ">
        <h1 className="font-semibold text-gray-600 ">Suggested for you</h1>
        <span className="font-medium cursor-pointer ">See All</span>
      </div>
      {suggestedUsers.map((users) => {
        return (
          <div
            key={users._id}
            className="flex items-center justify-between my-5"
          >
            <div className="flex items-center gap-2 ">
              <Link to={`/profile/${users?._id}`}>
                <Avatar>
                  <AvatarImage src={users?.profilePicture} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm ">
                  <Link to={`/profile/${users?._id}`}> {users?.username}</Link>
                </h1>
                <span className="text-gray-600 text-sm  ">
                  {users?.bio || "Bio here..."}
                </span>
              </div>
            </div>
            {users && (
              <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#288dcd] ">
                {
                  isfollowed ? 'unfollow' : 'follow'
                }
              </span>
            ) }
          </div>
        );
      })}
      {}
    </div>
  );
};

export default SuggestedUsers;
