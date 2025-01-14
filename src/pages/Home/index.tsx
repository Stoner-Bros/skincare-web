import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Link to="/login">
        <Button>Login</Button>
      </Link>
    </>
  );
}
