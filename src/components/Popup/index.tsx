import React, { useEffect } from "react";
import "./popup.css";
import { fetchApplied, saveApplied } from "@/libs/jobUtil";
import AppliedForm from "./AppliedForm";

type Props = {};

export default function Popup({}: Props) {
  useEffect(() => {
    fetchApplied().then((res) => {
      console.log(res);
    });
  }, []);

  return (
    <div className="base">
      <AppliedForm />
    </div>
  );
}
