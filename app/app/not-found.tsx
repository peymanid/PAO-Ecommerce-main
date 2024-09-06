import Link from "next/link";

export default function Custom404() {
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <h1>Page Not Found</h1>
      <h1 className="m-0">
        Please go back to the <Link href="/">Home Page</Link>
      </h1>
    </div>
  );
}
