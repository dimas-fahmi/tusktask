import Image from "next/image";
import Link from "next/link";
import ActionButton from "@/src/ui/components/ui/ActionButton";

const AuthPage = () => {
  return (
    <div className="h-full p-4 flex-center">
      <div className="max-w-md space-y-6">
        <header>
          <Link href={"/"}>
            <Image
              width={50}
              height={50}
              src={
                "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/logo/tusktask.png"
              }
              alt="TuskTask Logo"
              className="block mb-2"
            />
          </Link>
          <h1 className="text-4xl font-bold">Welcome to TuskTask</h1>
          <p>Login to your TuskTask account.</p>
        </header>

        {/* Form */}
        <div className="py-4 space-y-2">
          <ActionButton
            icon="Google"
            text="Continue With Google"
            className="text-sm"
          />
          <ActionButton
            icon="Apple"
            text="Continue With Apple"
            className="text-sm"
          />
          <ActionButton
            icon="Facebook"
            text="Continue With Facebook"
            className="text-sm"
          />
          <ActionButton
            icon="Github"
            text="Continue With Github"
            className="text-sm"
          />
          <ActionButton
            icon="Discord"
            text="Continue With Discord"
            className="text-sm"
          />
        </div>

        {/* Footer */}
        <footer>
          <p className="text-xs leading-5 block">
            By continuing, you acknowledge that you understand and agree to our{" "}
            <Link href={"#"} className="underline hover:text-primary">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href={"#"} className="underline hover:text-primary">
              Privacy & Policy
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AuthPage;
