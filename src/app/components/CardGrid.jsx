export default function CardGrid() {
  return (
    <>
    <h1 className="text-3xl pt-[3rem] sm:text-4xl font-bold text-[#2b7d78] text-center mb-8">
  Biz haqimizda
</h1>

    <section className="w-full px-4 sm:px-8 py-10 pt-[3rem]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="bg-white relative rounded-xl shadow-md border border-[#2b7d78] h-55 flex items-center justify-center">
        <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-[#2b7d78]"></div>
          <h3 className="text-xl font-semibold text-[#2b7d78] uppercase">Muammo</h3>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl shadow-md border border-[#2b7d78] p-6 h-full flex flex-col justify-center items-center text-center space-y-6">
  

  <ol className="space-y-4 text-base text-gray-800 list-decimal list-inside">
    <li>
      <span className="font-semibold text-[#2b7d78]">Ishonchli va tez xizmat</span> – buyurtmalaringizga tezkor javob va aniq natijalar kafolati.
    </li>
    <li>
      <span className="font-semibold text-[#2b7d78]">Professional ustalar</span> – har bir mutaxassisimiz tajribali va o‘z sohasining ustasi.
    </li>
    <li>
      <span className="font-semibold text-[#2b7d78]">Qulay tizim va aloqa</span> – platformamiz orqali ustalar va mijozlar oson va samarali bog‘lanadi.
    </li>
  </ol>
</div>




        {/* Card 3 */}
        <div className="bg-white rounded-xl shadow-md border border-[#2b7d78] p-6 h-full flex flex-col justify-center items-center text-center space-y-6">
  

  <ol className="space-y-4 text-base text-gray-800 list-decimal list-inside">
    <li>
      <span className="font-semibold text-[#2b7d78]">Ishonchli va tez xizmat</span> – buyurtmalaringizga tezkor javob va aniq natijalar kafolati.
    </li>
    <li>
      <span className="font-semibold text-[#2b7d78]">Professional ustalar</span> – har bir mutaxassisimiz tajribali va o‘z sohasining ustasi.
    </li>
    <li>
      <span className="font-semibold text-[#2b7d78]">Qulay tizim va aloqa</span> – platformamiz orqali ustalar va mijozlar oson va samarali bog‘lanadi.
    </li>
  </ol>
</div>


        {/* Card 4 */}
        <div className="bg-white relative rounded-xl shadow-md border border-[#2b7d78] h-55 flex items-center justify-center">
        <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-[#2b7d78]"></div>
          <h3 className="text-xl font-semibold text-[#2b7d78] uppercase">Yechim</h3>
        </div>
      </div>
    </section>
    </>
    
  );
}
