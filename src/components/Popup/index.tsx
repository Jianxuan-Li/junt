import React, { useEffect } from "react";
import "./popup.css";
import { fetchApplied } from "@/libs/storage";
import AppliedForm from "./AppliedForm";

type Props = {};

export default function Popup({}: Props) {
  const [appliedList, setAppliedList] = React.useState([]);

  useEffect(() => {
    fetchApplied().then((res) => {
      if (!res) {
        return;
      }
      setAppliedList(res);
    });
  }, []);

  return (
    <div className="base">
      <AppliedForm />
      <button onClick={() => chrome.storage.local.clear()}>Click me</button>
      <div>
        {appliedList.map((item) => (
          <div key={item.id}>
            {item.company} - {item.title} - {item.datetime}
          </div>
        ))}
      </div>
    </div>
  );
}
