import React, { useEffect } from "react";
import { fetchApplied } from "@/libs/storage";

type Props = {};

export default function AppliedList({}: Props) {
  const [appliedList, setAppliedList] = React.useState([]);

  useEffect(() => {
    fetchApplied().then((res) => {
      console.log(res);
      if (!res) {
        return;
      }
      setAppliedList(res);
    });
  }, []);

  return (
    <div>
      {appliedList.map((item, index) => (
        <div key={"applied_item_" + index}>
          {item.company} - {item.title} - {item.datetime}
        </div>
      ))}
    </div>
  );
}
