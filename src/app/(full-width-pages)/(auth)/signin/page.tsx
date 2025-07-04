import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PlazaOne",
  description: "This is Plazaone Dashboard",
};

export default function SignIn() {
  return <SignInForm />;
}
