import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../AuthProvider";

const HeaderTitle = ({ title }) => {
  const location = useLocation();
  const segments = location.pathname.split("/");
  const { lightOrDark } = useContext(AuthContext);

  const capitalizedSegments = segments.map((segment) => {
    let subStr;
    let result;
    if (segment.length === 0) {
      return segment;
    }
    if (segment.includes("-")) {
      const newSegment = segment.split("-");
      result = newSegment.map((segment) => {
        if (segment.length === 0) {
          return segment;
        }
        const firstChar = segment.charAt(0).toUpperCase();
        const restOfString = segment.slice(1);
        return firstChar + restOfString;
      });
      return (subStr = result.map((str) => str).join(" "));
    }

    const firstChar = segment.charAt(0).toUpperCase();
    const restOfString = segment.slice(1);
    return firstChar + restOfString;
  });

  let finalString = "";

  for (let i = 1; i < capitalizedSegments.length; i++) {
    finalString =
      finalString +
      capitalizedSegments[i] +
      (capitalizedSegments.length - 1 === i ? "" : " / ");
  }
  return (
    <p
      className={`${
        lightOrDark === "dark" && "dark-mode"
      } header-title capitalize my-4`}
    >
      {finalString}
    </p>
  );
};

export default HeaderTitle;
