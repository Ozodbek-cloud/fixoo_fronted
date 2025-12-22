export default function Footer() {
    return(
        <>
        <footer className="w-full bg-[#2b7d78] text-[#fff] pt-20 pb-6 px-4 sm:px-[8vw] mt-20">
  <div className="flex flex-col items-center gap-12">
    
    {/* Footer content */}
    <div className="grid w-full gap-8 sm:gap-16 lg:gap-24 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      
      {/* Left logo */}
      <div className="flex flex-col gap-4 items-start">
        <h1>Fixoo</h1>
      </div>

      {/* Contact info */}
      <div className="flex flex-col gap-3 items-start text-base sm:text-lg">
        <ul>
          <li><span className="text-[#4567aa]">8(912) 038-80-44</span></li>
          <li>298690, Russia, Crimea, Yalta, Foros, Forossky descent, 1</li>
        </ul>
      </div>

      {/* Links 1 */}
      <div className="flex flex-col gap-3 items-start text-base sm:text-lg">
        <ul>
          <li className="cursor-pointer">Rooms and prices</li>
          <li className="cursor-pointer">About the hotel</li>
          <li className="cursor-pointer">Services</li>
          <li className="cursor-pointer">Accommodation</li>
          <li className="cursor-pointer">Contacts</li>
          <li className="cursor-pointer">Guest reviews</li>
          <li className="cursor-pointer">News</li>
          <li className="cursor-pointer">Conditions</li>
        </ul>
      </div>

      {/* Links 2 */}
      <div className="flex flex-col gap-3 items-start text-base sm:text-lg">
        <ul>
          <li className="cursor-pointer">Attractions</li>
          <li className="cursor-pointer">Pasta bar</li>
          <li className="cursor-pointer">Active recreation</li>
          <li className="cursor-pointer">EXTREME</li>
          <li className="cursor-pointer">BOAT TRIPS</li>
          <li className="cursor-pointer">FISHING</li>
          <li className="cursor-pointer">Special offers</li>
        </ul>
      </div>
    </div>

    {/* Footer bottom */}
    <div className="flex flex-col sm:flex-row justify-between items-center w-full text-sm text-[#9B9598] gap-2">
      <p>© 2025 Santorini. All rights reserved.</p>
      <p>Privacy Policy</p>
    </div>
  </div>
</footer>

        </>
    )
}