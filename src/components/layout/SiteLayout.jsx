import SiteFooter from "./SiteFooter.jsx";
import SiteHeader from "../navigation/SiteHeader.jsx";

export default function SiteLayout({ children, onStartChat }) {
  return (
    <>
      <SiteHeader onStartChat={onStartChat} />
      {children}
      <SiteFooter />
    </>
  );
}
