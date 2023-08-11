import React, { useEffect } from "react";
import { fetchAppliedList } from "@/libs/sync";

type Props = {};

export default function AppliedList({}: Props) {
  const [appliedList, setAppliedList] = React.useState([]);

  useEffect(() => {
    const getData = async () => {
      setAppliedList(await fetchAppliedList());
    };
    getData();
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
