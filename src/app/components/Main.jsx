export default function Main() {
    return (
      <main className="w-full pt-8 px-4 sm:px-9 py-12">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-5">
          <div className="flex-1 w-full max-w-xl space-y-5 sm:space-y-6 text-center sm:text-left items-center sm:items-start flex flex-col">
            <h2 className="text-[#000] font-bold leading-tight text-[max(6vw,22px)] sm:text-[max(3.7vw,28px)]">
              
              Qulaylik va sifat namunasi –{" "}
              <span className="text-[#2b7d78]">Fixoo</span>
            </h2>
  
            <p className="text-[#000] font-medium text-sm sm:text-base leading-relaxed hidden sm:block">
              <span className="text-[#2b7d78] font-semibold">Fixoo</span> – bu
              zamonaviy va ishonchli platforma bo‘lib, ustalar va mijozlar o‘zaro
              tez va qulay bog‘lanishlari uchun yaratilgan. Agar siz usta
              bo‘lsangiz – bu yerda o‘z mijozlaringizni topasiz. Agar siz mijoz
              bo‘lsangiz – bu yerda sizga kerakli, tajribali ustani topasiz.
            </p>
  
            <p className="text-[#000] font-medium text-sm sm:hidden block max-w-xs">
              <span className="text-[#2b7d78] font-semibold">Fixoo</span> – bu
              zamonaviy va ishonchli platforma bo‘lib, ustalar va mijozlar o‘zaro
              tez va qulay bog‘lanishlari uchun yaratilgan. Agar siz usta
              bo‘lsangiz – bu yerda o‘z mijozlaringizni topasiz. Agar siz mijoz
              bo‘lsangiz – bu yerda sizga kerakli, tajribali ustani topasiz.
            </p>
  
  
            <button className="relative overflow-hidden px-5 py-2 text-sm sm:text-base font-semibold text-[#2b7d78] bg-white border border-[#2b7d78] rounded-full transition-all duration-300 group mx-auto sm:mx-0">
              <span className="relative z-10 group-hover:text-white transition-all duration-300">
                Batafsil {">"}
              </span>
              <span className="absolute left-0 top-0 h-full w-0 bg-[#2b7d78] transition-all duration-300 group-hover:w-full"></span>
            </button>
            
          </div>
  
          {/* Image */}
          <div
            className="flex-1 w-full max-w-2xl h-[200px] sm:h-[350px] md:h-[400px] bg-cover bg-center rounded-xl shadow-md"
            style={{ backgroundImage: "url('/assets/main_photo.png')" }}
          ></div>
        </div>
      </main>
    );
  }
  