export default function Navbar() {
  return (
    <nav className="w-full px-4 py-3 bg-white shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">FIXOO</h1>
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
          <li>
            <a href="#about" className="hover:text-green-600">
              About
            </a>
          </li>
          <li>
            <a href="#skills" className="hover:text-green-600">
              Skills
            </a>
          </li>
          <li>
            <a href="#projects" className="hover:text-green-600">
              Projects
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-green-600">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
