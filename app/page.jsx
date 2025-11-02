"use client";
import { instance } from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSelector } from "react-redux";

const Home = () => {

  const demoRequest = async () => {
    try {
      const response = await instance.get("auth/me/");
      console.log("User data:", response.data);
      return response.data;
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  const { data: DemoData } = useQuery({
    queryKey: ["demoRequest"],
    queryFn: demoRequest,
  });
  return <div>{DemoData?.email}</div>;
};

export default Home;
