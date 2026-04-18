import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
      <>
        <div className="bg-green-600 text-white px-16 py-4 flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Image
              src="/logo/sg-logo.png"
              width={80}
              height={80}
              alt="solver green logo"
            ></Image>
            <h1 className="text-4xl font-bold">Solver Green</h1>
          </div>
          {/* this is a navbar section */}
          <ul className="flex justify-between items-center gap-4 space-x-4">
            <li>
              <Link href="/" className="hover:text-green-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/courses">All Courses</Link>
            </li>
            <li>
              <Link href="/instructors"> Instructors</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-green-300">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-green-300">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/courses" className="px-6 py-4 bg-amber-400 rounded-xl text-black">Start Learning</Link>
            </li>
          </ul>
        </div>
      </>
    );
}